/**
 * In-Memory Rate Limiter
 *
 * Simple but effective rate limiting for API routes.
 *
 * PRODUCTION NOTE: This in-memory store does NOT share state across multiple
 * server instances (e.g. behind a load balancer or in a multi-replica deployment).
 * For multi-instance production environments, replace `rateLimitStore` with a
 * Redis-backed store such as Upstash Redis (@upstash/ratelimit) or ioredis.
 */

interface RateLimitEntry {
    count: number
    resetTime: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

// Cleanup old entries every 5 minutes
if (typeof setInterval !== 'undefined') {
    setInterval(
        () => {
            const now = Date.now()
            for (const [key, entry] of rateLimitStore.entries()) {
                if (entry.resetTime < now) {
                    rateLimitStore.delete(key)
                }
            }
        },
        5 * 60 * 1000,
    )
}

export interface RateLimitConfig {
    /** Maximum requests allowed in the window */
    maxRequests: number
    /** Time window in seconds */
    windowSeconds: number
}

export interface RateLimitResult {
    success: boolean
    remaining: number
    resetIn: number
    headers: Record<string, string>
}

/**
 * Check if a request should be rate limited
 */
export function checkRateLimit(
    identifier: string,
    config: RateLimitConfig = { maxRequests: 60, windowSeconds: 60 },
): RateLimitResult {
    const now = Date.now()
    const windowMs = config.windowSeconds * 1000
    const key = `ratelimit:${identifier}`

    let entry = rateLimitStore.get(key)

    // Reset if window has passed
    if (!entry || entry.resetTime < now) {
        entry = {
            count: 0,
            resetTime: now + windowMs,
        }
    }

    entry.count++
    rateLimitStore.set(key, entry)

    const remaining = Math.max(0, config.maxRequests - entry.count)
    const resetIn = Math.ceil((entry.resetTime - now) / 1000)
    const success = entry.count <= config.maxRequests

    return {
        success,
        remaining,
        resetIn,
        headers: {
            'X-RateLimit-Limit': String(config.maxRequests),
            'X-RateLimit-Remaining': String(remaining),
            'X-RateLimit-Reset': String(Math.ceil(entry.resetTime / 1000)),
        },
    }
}

function toRateLimitResult(
    currentCount: number,
    config: RateLimitConfig,
    resetInSeconds: number,
): RateLimitResult {
    const remaining = Math.max(0, config.maxRequests - currentCount)
    const resetIn = Math.max(1, Math.ceil(resetInSeconds))
    const resetEpoch = Math.ceil(Date.now() / 1000) + resetIn
    const success = currentCount <= config.maxRequests

    return {
        success,
        remaining,
        resetIn,
        headers: {
            'X-RateLimit-Limit': String(config.maxRequests),
            'X-RateLimit-Remaining': String(remaining),
            'X-RateLimit-Reset': String(resetEpoch),
        },
    }
}

async function getUpstashCredentials(): Promise<{ url: string; token: string } | null> {
    try {
        const { getIntegrationCredentials } = await import('./getIntegrationCredentials')
        const { upstash } = await getIntegrationCredentials()
        // Respect the admin panel toggle — if disabled, don't use Upstash even with env vars
        if (!upstash.enabled) return null
        if (upstash.url && upstash.token) {
            return { url: upstash.url, token: upstash.token }
        }
    } catch {
        // Fallback to env-only (no admin panel available)
    }
    const url = process.env.UPSTASH_REDIS_REST_URL
    const token = process.env.UPSTASH_REDIS_REST_TOKEN
    if (url && token) return { url, token }
    return null
}

type UpstashPipelineResponse = Array<{
    result?: number | string | null
    error?: string
}>

async function checkRateLimitWithUpstash(
    identifier: string,
    config: RateLimitConfig,
    credentials: { url: string; token: string },
): Promise<RateLimitResult> {
    const { url, token } = credentials

    const key = `ratelimit:${identifier}`
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 1500)

    try {
        const response = await fetch(`${url}/pipeline`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify([
                ['INCR', key],
                ['TTL', key],
                ['EXPIRE', key, config.windowSeconds, 'NX'],
            ]),
            cache: 'no-store',
            signal: controller.signal,
        })

        if (!response.ok) {
            throw new Error(`Upstash pipeline failed with status ${response.status}`)
        }

        const payload = (await response.json()) as UpstashPipelineResponse
        const incrementResult = Number(payload?.[0]?.result ?? 1)
        const ttlResult = Number(payload?.[1]?.result ?? config.windowSeconds)
        const resetInSeconds = ttlResult > 0 ? ttlResult : config.windowSeconds

        return toRateLimitResult(incrementResult, config, resetInSeconds)
    } finally {
        clearTimeout(timeout)
    }
}

/**
 * Distributed rate limit check with safe fallback to in-memory limiting.
 *
 * Uses Upstash Redis when `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` are present.
 * If not configured (or temporarily unavailable), falls back to local in-memory limiter.
 */
export async function checkRateLimitDistributed(
    identifier: string,
    config: RateLimitConfig = { maxRequests: 60, windowSeconds: 60 },
): Promise<RateLimitResult> {
    const credentials = await getUpstashCredentials()
    if (!credentials) {
        return checkRateLimit(identifier, config)
    }

    try {
        return await checkRateLimitWithUpstash(identifier, config, credentials)
    } catch {
        return checkRateLimit(identifier, config)
    }
}

const IP_PATTERN = /^[\d.a-fA-F:]+$/

function isValidIP(ip: string): boolean {
    return IP_PATTERN.test(ip) && ip.length <= 45
}

/**
 * Get client IP from request headers.
 * Priority: Cloudflare (trusted infra) > x-real-ip (reverse proxy) > x-forwarded-for (least trusted).
 */
export function getClientIP(headers: Headers): string {
    // Cloudflare sets this — cannot be spoofed when behind CF
    const cfConnectingIP = headers.get('cf-connecting-ip')?.trim()
    if (cfConnectingIP && isValidIP(cfConnectingIP)) {
        return cfConnectingIP
    }

    // Set by trusted reverse proxy (Nginx/Caddy)
    const realIP = headers.get('x-real-ip')?.trim()
    if (realIP && isValidIP(realIP)) {
        return realIP
    }

    // x-forwarded-for: take rightmost (closest to our infra), not leftmost (client-spoofable)
    const forwardedFor = headers.get('x-forwarded-for')
    if (forwardedFor) {
        const ips = forwardedFor.split(',').map((ip) => ip.trim()).filter(isValidIP)
        if (ips.length > 0) {
            return ips[ips.length - 1]
        }
    }

    return 'unknown'
}

/**
 * Rate limit configurations for different endpoints
 */
export const RATE_LIMITS = {
    // General API - 60 requests per minute
    api: { maxRequests: 60, windowSeconds: 60 },

    // Form submissions - 10 per minute (prevent spam)
    form: { maxRequests: 10, windowSeconds: 60 },

    // Newsletter - 5 per minute
    newsletter: { maxRequests: 5, windowSeconds: 60 },

    // Auth attempts - 5 per minute (brute force protection)
    auth: { maxRequests: 5, windowSeconds: 60 },

    // Health check - unlimited basically
    health: { maxRequests: 1000, windowSeconds: 60 },
} as const
