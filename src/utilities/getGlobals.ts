import type { Config } from '@/payload-types'
import { getCachedPayload } from '@/lib/payloadClient'
import { unstable_cache } from 'next/cache'
import localization from '@/i18n/localization'
import { resolveLocale } from '@/utilities/locale'

type Global = keyof Config['globals']

type FetchOptions = {
    fallbackLocale?: string | null
    locale?: string
    depth?: number
}

/**
 * Fetches a global from Payload CMS
 */
export async function getGlobal<T extends Global>(
    slug: T,
    options: FetchOptions = {},
): Promise<Config['globals'][T] | null> {
    try {
        const payload = await getCachedPayload()

        const queryOptions: Parameters<typeof payload.findGlobal>[0] = {
            slug,
            depth: options.depth ?? 2,
        }

        if (options.locale) {
            queryOptions.locale = options.locale as 'en' | 'de'
        }

        if (options.fallbackLocale) {
            queryOptions.fallbackLocale = options.fallbackLocale as 'en' | 'de'
        }

        const global = await payload.findGlobal(queryOptions)
        return global as Config['globals'][T]
    } catch (error) {
        // Gracefully handle missing tables (e.g. theme-settings before migration)
        const msg = error instanceof Error ? error.message : String(error)
        if (msg.includes('Failed query') || msg.includes('does not exist')) {
            console.warn(
                `[getGlobal] "${slug}" unavailable (table may need migration): ${msg.slice(0, 120)}`,
            )
        } else {
            console.error(`[getGlobal] Failed to fetch "${slug}":`, msg)
        }
        return null
    }
}

/**
 * Cached global fetch with Next.js unstable_cache.
 * Use for Header/Footer so revalidateTag(global_header_${locale}) invalidates correctly.
 */
export async function getCachedGlobal<T extends Global>(
    slug: T,
    depth = 2,
    locale: string = localization.defaultLocale,
): Promise<Config['globals'][T] | null> {
    const resolvedLocale = resolveLocale(locale)
    return unstable_cache(
        async () => getGlobal(slug, { locale: resolvedLocale, depth }),
        [slug, resolvedLocale],
        { tags: [`global_${slug}_${resolvedLocale}`] },
    )()
}

/**
 * Get Header global (cached per locale)
 */
export async function getHeader(locale?: string) {
    const resolvedLocale = resolveLocale(locale || localization.defaultLocale)
    return getGlobal('header', { locale: resolvedLocale, depth: 4 })
}

/**
 * Get Footer global (cached per locale)
 */
export async function getFooter(locale?: string) {
    const resolvedLocale = resolveLocale(locale || localization.defaultLocale)
    const fallbackLocale = resolvedLocale === 'de' ? 'en' : 'de'
    return getGlobal('footer', { locale: resolvedLocale, fallbackLocale, depth: 4 })
}

/**
 * Get SEO global
 */
export async function getSEO(locale?: string) {
    return getGlobal('seo', { locale, depth: 1 })
}

/**
 * Get Cookie Banner global
 */
export async function getCookieBanner(locale?: string) {
    return getGlobal('cookie-banner', { locale, depth: 1 })
}

/**
 * Get Theme Settings global
 */
export async function getThemeSettings() {
    return getGlobal('theme-settings', { depth: 0 })
}
