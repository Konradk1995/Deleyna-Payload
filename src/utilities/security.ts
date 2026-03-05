/**
 * Security Utilities
 *
 * Ergänzende Sicherheits-Funktionen für API-Routen.
 * Basis-Sanitization (XSS, SQL, Formulare) liegt in @/utilities/sanitize.ts.
 *
 * Hier: Token-Generierung, Hashing, Timing-Safe-Compare, Path-Traversal-Check, Masking.
 */

/**
 * Check for path traversal attempts
 */
export function containsPathTraversal(input: string): boolean {
    if (typeof input !== 'string') return false

    const patterns = [/\.\.\//, /\.\.\\/, /%2e%2e%2f/i, /%2e%2e\//i, /\.%2e\//i, /%2e\.\//i]

    return patterns.some((pattern) => pattern.test(input))
}

/**
 * Validate email format (RFC 5322)
 */
export function isValidEmail(email: string): boolean {
    if (typeof email !== 'string') return false

    const emailRegex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

    return emailRegex.test(email) && email.length <= 254
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
    if (typeof url !== 'string') return false

    try {
        const parsed = new URL(url)
        return ['http:', 'https:'].includes(parsed.protocol)
    } catch {
        return false
    }
}

/**
 * Validate slug format
 */
export function isValidSlug(slug: string): boolean {
    if (typeof slug !== 'string') return false

    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
    return slugRegex.test(slug) && slug.length <= 100
}

/**
 * Generate secure random token
 */
export function generateSecureToken(length: number = 32): string {
    const array = new Uint8Array(length)
    crypto.getRandomValues(array)
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

/**
 * Hash string (for non-sensitive data comparison)
 */
export async function hashString(input: string): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(input)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Timing-safe string comparison (prevent timing attacks)
 */
export function timingSafeEqual(a: string, b: string): boolean {
    if (a.length !== b.length) {
        return false
    }

    let result = 0
    for (let i = 0; i < a.length; i++) {
        result |= a.charCodeAt(i) ^ b.charCodeAt(i)
    }

    return result === 0
}

/**
 * Mask sensitive data for logging
 */
export function maskSensitiveData(data: Record<string, unknown>): Record<string, unknown> {
    const sensitiveFields = [
        'password',
        'token',
        'secret',
        'apiKey',
        'api_key',
        'authorization',
        'credit_card',
        'ssn',
    ]
    const masked = { ...data }

    for (const key of Object.keys(masked)) {
        if (sensitiveFields.some((field) => key.toLowerCase().includes(field))) {
            masked[key] = '***REDACTED***'
        }
    }

    return masked
}
