/**
 * Processes media resource URL to ensure proper formatting
 * @param url The original URL from the resource
 * @param cacheTag Optional cache tag to append to the URL
 * @returns Properly formatted URL with cache tag if provided
 */
export const getMediaUrl = (url: string | null | undefined, cacheTag?: string | null): string => {
    if (!url) return ''

    const tag = cacheTag && cacheTag !== '' ? encodeURIComponent(cacheTag) : null

    const appendCacheTag = (value: string): string => {
        if (!tag) return value
        return value.includes('?') ? `${value}&v=${tag}` : `${value}?v=${tag}`
    }

    // Check if URL already has http/https protocol
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return appendCacheTag(url)
    }

    // Keep root-relative media URLs relative. This avoids Next Image remote-host checks in dev.
    if (url.startsWith('/')) {
        return appendCacheTag(url)
    }

    return appendCacheTag(`/${url}`)
}
