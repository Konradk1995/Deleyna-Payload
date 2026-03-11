export function resolveLocalizedText(value: unknown, locale: 'de' | 'en'): string {
    if (typeof value === 'string') return value
    if (value && typeof value === 'object') {
        const map = value as Record<string, unknown>
        const localized = locale === 'en' ? (map.en ?? map.de) : (map.de ?? map.en)
        return typeof localized === 'string' ? localized : ''
    }
    return ''
}
