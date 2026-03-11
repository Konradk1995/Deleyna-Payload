import { resolveLocale } from '@/utilities/locale'

const localizedPageSlugByCanonical = {
    about: { de: 'ueber-uns', en: 'about' },
    contact: { de: 'kontakt', en: 'contact' },
    services: { de: 'leistungen', en: 'services' },
    'talent-werden': { de: 'talent-werden', en: 'become-talent' },
    booking: { de: 'buchung', en: 'booking' },
    education: { de: 'ausbildung', en: 'education' },
    coaching: { de: 'coaching', en: 'coaching' },
    privacy: { de: 'datenschutz', en: 'privacy' },
    imprint: { de: 'impressum', en: 'imprint' },
    agb: { de: 'agb', en: 'terms' },
    faq: { de: 'faq', en: 'faq' },
    testimonials: { de: 'erfahrungen', en: 'testimonials' },
    'job-anfrage': { de: 'job-anfrage', en: 'job-inquiry' },
    'kurs-anfrage': { de: 'kurs-anfrage', en: 'class-inquiry' },
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
