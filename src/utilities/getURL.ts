import canUseDOM from './canUseDOM'

/**
 * Get the server-side URL
 * Uses NEXT_PUBLIC_SERVER_URL environment variable
 */
export function getServerSideURL(): string {
    const url = process.env.NEXT_PUBLIC_SERVER_URL

    if (!url) {
        return 'http://localhost:3000'
    }

    return url
}

/**
 * Get the client-side URL
 * Uses window.location.origin when available
 */
export function getClientSideURL(): string {
    if (canUseDOM) {
        const protocol = window.location.protocol
        const domain = window.location.hostname
        const port = window.location.port

        return `${protocol}//${domain}${port ? `:${port}` : ''}`
    }

    return getServerSideURL()
}

/**
 * Normalize a URL by removing trailing slashes and ensuring protocol
 */
export function normalizeURL(url: string): string {
    let normalized = url.trim()

    // Add protocol if missing
    if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
        normalized = `https://${normalized}`
    }

    // Remove trailing slash
    normalized = normalized.replace(/\/+$/, '')

    return normalized
}

/**
 * Build an absolute URL from a path
 */
export function buildAbsoluteURL(path: string, baseUrl?: string): string {
    const base = baseUrl || getServerSideURL()

    // If path is already absolute, return it
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path
    }

    // Ensure path starts with /
    const normalizedPath = path.startsWith('/') ? path : `/${path}`

    return `${normalizeURL(base)}${normalizedPath}`
}

/**
 * Check if a URL is valid
 */
export function isValidURL(url: string): boolean {
    try {
        new URL(url)
        return true
    } catch {
        return false
    }
}

/**
 * Extract pathname from URL
 */
export function getPathname(url: string): string {
    try {
        const parsed = new URL(url)
        return parsed.pathname
    } catch {
        return url.startsWith('/') ? url : `/${url}`
    }
}
