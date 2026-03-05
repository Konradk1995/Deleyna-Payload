import localization from '@/i18n/localization'

const localeCodes = localization.locales.map((l) => l.code)

export type ResolvedLocale = (typeof localeCodes)[number]

/**
 * Gültige Locale aus String (z. B. aus Params). Fallback: defaultLocale.
 */
export function resolveLocale(locale?: string): ResolvedLocale {
    const code = locale || localization.defaultLocale
    return localeCodes.includes(code as ResolvedLocale) ? (code as ResolvedLocale) : (localization.defaultLocale as ResolvedLocale)
}

/**
 * Prüft, ob der Pfad bereits ein Locale-Prefix hat.
 */
const localePrefix = new RegExp(`^/(?:${localeCodes.join('|')})(?:/|$)`)

/**
 * Fügt Locale-Prefix zu einem Pfad hinzu (für zukünftige [locale]-Routen).
 * Wenn path schon mit Locale beginnt oder nicht mit / startet, wird er unverändert zurückgegeben.
 */
export function withLocalePath(path: string, locale?: string): string {
    if (!path.startsWith('/')) return path
    if (localePrefix.test(path)) return path
    const resolved = resolveLocale(locale)
    if (path === '/') return `/${resolved}`
    return `/${resolved}${path}`
}
