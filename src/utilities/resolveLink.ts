import { resolveLocale } from '@/utilities/locale'
import { localizePageSlug } from '@/utilities/pageSlugAliases'

export type LinkLike = {
    type?: 'reference' | 'custom' | 'archive' | null
    label?: string | null
    url?: string | null
    archive?: 'posts' | 'talents' | null
    /** Polymorphic: { relationTo, value } with value populated (has slug) when depth >= 1 */
    reference?:
        | { relationTo?: 'pages' | 'posts' | 'talents'; value?: { slug?: string | null } | number }
        | number
        | null
    newTab?: boolean | null
}

export type ResolvedLink = { href: string; label: string | null; newTab?: boolean }

/**
 * Resolves a Payload link field (reference / custom / archive) to href and label.
 * Returns paths WITHOUT locale prefix — next-intl's Link adds it automatically.
 * Use with depth: 1 when fetching so reference.value is populated with slug.
 */
export function resolveLink(
    link: LinkLike | null | undefined,
    locale?: string,
): ResolvedLink | null {
    if (!link) return null

    const resolvedLocale = locale ? resolveLocale(locale) : 'de'
    let href: string

    if (link.type === 'custom' && link.url) {
        if (link.url.startsWith('http')) {
            href = link.url
        } else {
            // Strip any existing locale prefix from custom URLs
            const stripped = link.url.replace(/^\/(de|en)\//, '/')
            href = stripped
        }
    } else if (link.type === 'archive') {
        if (link.archive === 'posts') {
            href = `/${resolvedLocale === 'de' ? 'magazin' : 'blog'}`
        } else {
            href = `/${resolvedLocale === 'de' ? 'talente' : 'talents'}`
        }
    } else if (link.type === 'reference' && link.reference) {
        const ref = link.reference
        if (typeof ref !== 'object' || ref === null) return null
        const value = 'value' in ref ? ref.value : ref
        const slug = typeof value === 'object' && value !== null && 'slug' in value ? (value as { slug: string }).slug : null
        if (!slug) return null
        const relationTo = 'relationTo' in ref ? (ref as { relationTo?: string }).relationTo : undefined
        if (relationTo === 'posts') {
            href = `/${resolvedLocale === 'de' ? 'magazin' : 'blog'}/${slug}`
        } else if (relationTo === 'talents') {
            href = `/${resolvedLocale === 'de' ? 'talente' : 'talents'}/${slug}`
        } else {
            const localizedPagePathSlug = localizePageSlug(slug, resolvedLocale)
            href = localizedPagePathSlug === 'home' ? '/' : `/${localizedPagePathSlug}`
        }
    } else {
        return null
    }

    return {
        href,
        label: link.label ?? null,
        newTab: link.newTab ?? false,
    }
}
