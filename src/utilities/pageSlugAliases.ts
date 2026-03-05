import { resolveLocale } from '@/utilities/locale'

const localizedPageSlugByCanonical = {
    about: { de: 'ueber-uns', en: 'about' },
    contact: { de: 'kontakt', en: 'contact' },
    'talent-werden': { de: 'talent-werden', en: 'become-talent' },
    agb: { de: 'agb', en: 'terms' },
    testimonials: { de: 'erfahrungen', en: 'testimonials' },
} as const

type CanonicalPageSlug = keyof typeof localizedPageSlugByCanonical

const aliasToCanonical = new Map<string, CanonicalPageSlug>()

for (const [canonicalSlug, localizedSlugs] of Object.entries(
    localizedPageSlugByCanonical,
) as Array<[CanonicalPageSlug, { de: string; en: string }]>) {
    aliasToCanonical.set(canonicalSlug, canonicalSlug)
    aliasToCanonical.set(localizedSlugs.de, canonicalSlug)
    aliasToCanonical.set(localizedSlugs.en, canonicalSlug)
}

export function toCanonicalPageSlug(slug: string): string {
    if (!slug) return slug
    return aliasToCanonical.get(slug.toLowerCase()) ?? slug
}

export function localizePageSlug(slug: string, locale?: string): string {
    if (!slug || slug === 'home') return slug

    const canonicalSlug = toCanonicalPageSlug(slug)
    const localized = localizedPageSlugByCanonical[canonicalSlug as CanonicalPageSlug]
    if (!localized) return canonicalSlug

    const resolvedLocale = resolveLocale(locale)
    const localeKey: 'de' | 'en' = resolvedLocale === 'en' ? 'en' : 'de'
    return localized[localeKey]
}
