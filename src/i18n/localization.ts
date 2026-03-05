/**
 * Lokalisierung Konfiguration für Payload CMS
 * DE = Default, EN = Fallback
 */
const localization = {
    defaultLocale: 'de',
    locales: [
        {
            code: 'de',
            label: 'Deutsch',
            rtl: false,
        },
        {
            code: 'en',
            label: 'English',
            fallbackLocale: 'de',
            rtl: false,
        },
    ],
    fallback: true,
}

export default localization
