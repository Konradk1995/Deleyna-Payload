/**
 * Seeds missing globals: ThemeSettings, CookieBanner, Notifications, SedcardSettings, FormSettings
 */
import type { Payload } from 'payload'

export async function globalsSeeder(payload: Payload) {
    console.log('📦 Seeding globals (ThemeSettings, CookieBanner, Notifications, SedcardSettings)...')

    // 1. ThemeSettings
    try {
        await payload.updateGlobal({
            slug: 'theme-settings',
            data: {
                defaultTheme: 'dark',
                colorPreset: 'deleyna-dark',
            },
        })
        console.log('  ✅ ThemeSettings seeded')
    } catch (error) {
        console.warn('  ⚠️ ThemeSettings seeding failed:', error)
    }

    // 2. CookieBanner (DE default, then EN pass)
    try {
        await payload.updateGlobal({
            slug: 'cookie-banner',
            locale: 'de',
            data: {
                enabled: true,
                trigger: { placement: 'floating' },
                banner: {
                    title: 'Cookie-Einstellungen',
                    description:
                        'Wir verwenden Cookies, um dir die bestmögliche Erfahrung auf unserer Website zu bieten. Du kannst deine Einstellungen jederzeit anpassen.',
                    acceptAllLabel: 'Alle akzeptieren',
                    rejectLabel: 'Nur notwendige',
                    settingsLabel: 'Einstellungen',
                    saveLabel: 'Auswahl speichern',
                },
                modal: {
                    title: 'Cookie-Einstellungen verwalten',
                    description:
                        'Hier kannst du deine Cookie-Präferenzen anpassen. Notwendige Cookies sind für die Grundfunktionen der Website erforderlich.',
                },
                policies: {
                    privacyPolicyLabel: 'Datenschutzerklärung',
                    imprintLabel: 'Impressum',
                },
                necessary: {
                    label: 'Notwendig',
                    description:
                        'Diese Cookies sind für die Grundfunktionen der Website erforderlich und können nicht deaktiviert werden.',
                },
                analytics: {
                    enabled: true,
                    label: 'Analyse',
                    description:
                        'Diese Cookies helfen uns zu verstehen, wie Besucher mit unserer Website interagieren.',
                },
                marketing: {
                    enabled: false,
                    label: 'Marketing',
                    description:
                        'Diese Cookies werden verwendet, um Werbung relevanter für dich zu machen.',
                },
            },
        })
        await payload.updateGlobal({
            slug: 'cookie-banner',
            locale: 'en',
            data: {
                banner: {
                    title: 'Cookie Settings',
                    description:
                        'We use cookies to provide you with the best possible experience on our website. You can adjust your settings at any time.',
                    acceptAllLabel: 'Accept all',
                    rejectLabel: 'Necessary only',
                    settingsLabel: 'Settings',
                    saveLabel: 'Save preferences',
                },
                modal: {
                    title: 'Manage Cookie Settings',
                    description:
                        'Here you can adjust your cookie preferences. Necessary cookies are required for the basic functions of the website.',
                },
                policies: {
                    privacyPolicyLabel: 'Privacy Policy',
                    imprintLabel: 'Legal Notice',
                },
                necessary: {
                    label: 'Necessary',
                    description:
                        'These cookies are required for the basic functions of the website and cannot be disabled.',
                },
                analytics: {
                    label: 'Analytics',
                    description:
                        'These cookies help us understand how visitors interact with our website.',
                },
                marketing: {
                    label: 'Marketing',
                    description:
                        'These cookies are used to make advertising more relevant to you.',
                },
            },
        })
        console.log('  ✅ CookieBanner seeded (DE/EN)')
    } catch (error) {
        console.warn('  ⚠️ CookieBanner seeding failed:', error)
    }

    // 3. Notifications (counter reset)
    try {
        await payload.updateGlobal({
            slug: 'notifications',
            data: {
                unreadFormSubmissionsDe: 0,
                unreadFormSubmissionsEn: 0,
            },
        })
        console.log('  ✅ Notifications seeded')
    } catch (error) {
        console.warn('  ⚠️ Notifications seeding failed:', error)
    }

    // 4. SedcardSettings
    try {
        await payload.updateGlobal({
            slug: 'sedcard-settings',
            data: {
                enableFrontendDownload: false,
                defaultTemplate: 'classic',
            },
        })
        console.log('  ✅ SedcardSettings seeded')
    } catch (error) {
        console.warn('  ⚠️ SedcardSettings seeding failed:', error)
    }

    // 5. FormSettings (contactForm is auto-linked in scripts.ts)
    try {
        await payload.updateGlobal({
            slug: 'form-settings',
            locale: 'de',
            data: {
                enableTurnstile: false,
                enableAutoReply: false,
                autoReplyEmailField: 'email',
                enableUpstash: false,
            },
        })
        console.log('  ✅ FormSettings seeded')
    } catch (error) {
        console.warn('  ⚠️ FormSettings seeding failed:', error)
    }

    // 6. NotionSettings (disabled by default)
    try {
        await payload.updateGlobal({
            slug: 'notion-settings',
            data: {
                enabled: false,
                syncOnPublish: true,
                archiveOnDelete: true,
            },
        })
        console.log('  ✅ NotionSettings seeded (disabled by default)')
    } catch (error) {
        console.warn('  ⚠️ NotionSettings seeding failed:', error)
    }

    console.log('  ✅ All globals seeded')
}
