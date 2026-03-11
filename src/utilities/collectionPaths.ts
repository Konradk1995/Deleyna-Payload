import { resolveLocale } from '@/utilities/locale'

/**
 * Get localized slug from a slug field (which can be string or localized object)
 */
export function getLocalizedSlug(
    slug: string | Record<string, string> | null | undefined,
    locale: string,
): string {
    if (!slug) return ''
    if (typeof slug === 'string') return slug

    // If it's a localized object, try to get the locale-specific value
    if (typeof slug === 'object') {
        return slug[locale] || slug['de'] || slug['en'] || Object.values(slug)[0] || ''
    }

    return ''
}

/**
 * Build a localized collection path
 */
/**
 * Build a localized collection path WITHOUT locale prefix.
 * The locale prefix is added automatically by next-intl's <Link>.
 */
export function buildLocalizedCollectionPath({
    collection,
    slug,
    locale,
}: {
    collection: 'posts' | 'pages' | 'blog' | 'talents'
    slug: string
    locale: string
}): string {
    if (!slug) return ''

    const resolvedLocale = resolveLocale(locale)

    if (collection === 'posts' || collection === 'blog') {
        return `/${resolvedLocale === 'de' ? 'magazin' : 'blog'}/${slug}`
    }

    if (collection === 'talents') {
        return `/${resolvedLocale === 'de' ? 'talente' : 'talents'}/${slug}`
    }

    return slug === 'home' ? '/' : `/${slug}`
}
