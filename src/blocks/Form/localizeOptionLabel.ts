type FormLocale = 'de' | 'en'

function pickFromLocalizedObject(
    value: Record<string, unknown>,
    locale: FormLocale,
): string | null {
    const localized = value[locale]
    if (typeof localized === 'string' && localized.trim()) return localized.trim()

    const fallback = locale === 'de' ? value.en : value.de
    if (typeof fallback === 'string' && fallback.trim()) return fallback.trim()

    for (const candidate of Object.values(value)) {
        if (typeof candidate === 'string' && candidate.trim()) return candidate.trim()
    }

    return null
}

/**
 * Form options are often seeded as "Deutsch / English" strings.
 * We normalize them to one language at render time.
 */
export function localizeOptionLabel(rawLabel: unknown, locale: FormLocale): string {
    if (!rawLabel) return ''

    if (typeof rawLabel === 'object') {
        const fromObject = pickFromLocalizedObject(rawLabel as Record<string, unknown>, locale)
        if (fromObject) return fromObject
    }

    const label = typeof rawLabel === 'string' ? rawLabel.trim() : String(rawLabel).trim()
    if (!label) return ''

    if (!label.includes('/')) return label

    const segments = label
        .split('/')
        .map((segment) => segment.trim())
        .filter(Boolean)

    if (segments.length < 2) return label
    return locale === 'en' ? segments[segments.length - 1] : segments[0]
}
