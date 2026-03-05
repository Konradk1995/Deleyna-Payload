import { unstable_cache } from 'next/cache'

/**
 * Cache tags for Next.js cache invalidation
 * Use these to tag cached data and invalidate specific caches
 */
export const CACHE_TAGS = {
    seo: 'seo-settings',
    pages: 'pages',
    posts: 'posts',
    categories: 'categories',
    globals: 'globals',
    media: 'media',
    header: 'header',
    footer: 'footer',
    navigation: 'navigation',
} as const

export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS]

/**
 * Create a cached function using Next.js unstable_cache
 * Wraps any async function with caching capabilities
 *
 * @param fn - The async function to cache
 * @param keyParts - Unique key parts for cache identification
 * @param tags - Cache tags for invalidation
 * @param revalidate - Revalidation time in seconds (default: 1 hour)
 */
export function createCachedFunction<T extends unknown[], R>(
    fn: (...args: T) => Promise<R>,
    keyParts: string[],
    tags: string[] = [],
    revalidate: number = 3600,
) {
    return unstable_cache(fn, keyParts, {
        tags,
        revalidate,
    })
}

/**
 * Generate a cache key from multiple parts
 * Filters out undefined values and joins with colons
 */
export function generateCacheKey(...parts: (string | number | undefined)[]): string {
    return parts
        .filter((part): part is string | number => part !== undefined)
        .map(String)
        .join(':')
}

/**
 * Simple in-memory cache for build time operations
 * When Next.js cache isn't available during build, this provides fallback caching
 */
class SimpleCache {
    private cache = new Map<string, { value: unknown; expires: number }>()

    set<T>(key: string, value: T, ttlSeconds = 3600): void {
        this.cache.set(key, {
            value,
            expires: Date.now() + ttlSeconds * 1000,
        })
    }

    get<T>(key: string): T | null {
        const entry = this.cache.get(key)
        if (!entry) return null

        if (Date.now() > entry.expires) {
            this.cache.delete(key)
            return null
        }

        return entry.value as T
    }

    has(key: string): boolean {
        const entry = this.cache.get(key)
        if (!entry) return false

        if (Date.now() > entry.expires) {
            this.cache.delete(key)
            return false
        }

        return true
    }

    delete(key: string): boolean {
        return this.cache.delete(key)
    }

    clear(): void {
        this.cache.clear()
    }

    size(): number {
        return this.cache.size
    }
}

/**
 * Build-time cache instance
 * Use this when Next.js caching isn't available
 */
export const buildTimeCache = new SimpleCache()

/**
 * Cache durations in seconds
 */
export const CACHE_DURATIONS = {
    /** 5 minutes - for frequently changing data */
    SHORT: 300,
    /** 1 hour - default for most data */
    MEDIUM: 3600,
    /** 24 hours - for rarely changing data */
    LONG: 86400,
    /** 7 days - for static data */
    WEEK: 604800,
} as const
