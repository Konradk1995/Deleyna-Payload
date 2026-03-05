import { getServerSideURL, normalizeURL } from './getURL'
import type { CanonicalConfig } from '@/types/seo'
import { DEFAULT_CANONICAL_CONFIG } from '@/types/seo'

/**
 * Generate a canonical URL for a given path
 */
export function generateCanonicalURL(path: string, config: Partial<CanonicalConfig> = {}): string {
    const mergedConfig = { ...DEFAULT_CANONICAL_CONFIG, ...config }
    let url = mergedConfig.preferredDomain || mergedConfig.baseUrl || getServerSideURL()

    // Force HTTPS
    if (mergedConfig.forceHttps) {
        url = url.replace(/^http:/, 'https:')
    }

    // Force www or non-www
    if (mergedConfig.forceWww) {
        const parsed = new URL(url)
        if (!parsed.hostname.startsWith('www.')) {
            parsed.hostname = `www.${parsed.hostname}`
            url = parsed.toString()
        }
    }

    // Normalize base URL
    url = normalizeURL(url)

    // Process path
    let processedPath = path

    // Remove duplicate slashes
    if (mergedConfig.removeDuplicateSlashes) {
        processedPath = processedPath.replace(/\/+/g, '/')
    }

    // Remove index.html
    if (mergedConfig.removeIndexHtml) {
        processedPath = processedPath.replace(/\/index\.html?$/i, '/')
    }

    // Handle trailing slash
    if (mergedConfig.removeTrailingSlash && processedPath !== '/') {
        processedPath = processedPath.replace(/\/+$/, '')
    }

    // Ensure path starts with /
    if (!processedPath.startsWith('/')) {
        processedPath = `/${processedPath}`
    }

    return `${url}${processedPath}`
}

/**
 * Get canonical URL for a page
 */
export function getCanonicalURL(slug: string, customCanonical?: string, baseUrl?: string): string {
    if (customCanonical) {
        // If custom canonical is absolute, return it
        if (customCanonical.startsWith('http')) {
            return customCanonical
        }
        // Otherwise, build absolute URL
        return generateCanonicalURL(customCanonical, { baseUrl })
    }

    // Handle home page
    if (slug === 'home' || slug === '') {
        return generateCanonicalURL('/', { baseUrl })
    }

    return generateCanonicalURL(`/${slug}`, { baseUrl })
}

/**
 * Check if two URLs are canonically equivalent
 */
export function areURLsEquivalent(url1: string, url2: string): boolean {
    const canonical1 = generateCanonicalURL(url1)
    const canonical2 = generateCanonicalURL(url2)

    return canonical1 === canonical2
}
