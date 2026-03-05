import type { GlobalConfig } from 'payload'
import { adminOnly } from '../access'

// Default Werte für Cookie Banner
const COOKIE_BANNER_DEFAULTS = {
    enabled: true,
    trigger: {
        placement: 'floating',
    },
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
    },
    // DB-kompatibel: Defaults als String (DE). Lokalisierte Anzeige bleibt über Feldkonfiguration.
    necessary: {
        enabled: true,
        required: true,
        label: 'Notwendig',
        description:
            'Diese Cookies sind für die Grundfunktionen der Website erforderlich und können nicht deaktiviert werden.',
    },
    analytics: {
        enabled: true,
        required: false,
        label: 'Analyse',
        description:
            'Diese Cookies helfen uns zu verstehen, wie Besucher mit unserer Website interagieren.',
    },
    marketing: {
        enabled: false,
        required: false,
        label: 'Marketing',
        description:
            'Diese Cookies werden verwendet, um Werbung relevanter für dich zu machen.',
    },
}

export const CookieBanner: GlobalConfig = {
    slug: 'cookie-banner',
    label: { de: 'Cookie Consent', en: 'Cookie Consent' },
    access: {
        read: () => true,
        update: adminOnly,
    },
    admin: {
        group: { de: 'Einstellungen', en: 'Settings' },
        description: { de: 'Cookie-Banner Einstellungen für DSGVO-Konformität', en: 'Cookie banner settings for GDPR compliance' },
    },
    fields: [
        {
            type: 'tabs',
            tabs: [
                {
                    label: { de: 'Allgemein', en: 'General' },
                    fields: [
                        {
                            name: 'enabled',
                            type: 'checkbox',
                            label: { de: 'Cookie-Banner aktivieren', en: 'Enable cookie banner' },
                            defaultValue: COOKIE_BANNER_DEFAULTS.enabled,
                        },
                        {
                            name: 'trigger',
                            type: 'group',
                            label: { de: 'Einstellungs-Trigger', en: 'Settings trigger' },
                            fields: [
                                {
                                    name: 'placement',
                                    type: 'select',
                                    label: { de: 'Position', en: 'Position' },
                                    required: true,
                                    defaultValue: COOKIE_BANNER_DEFAULTS.trigger.placement,
                                    options: [
                                        { label: { de: 'Link im Footer', en: 'Link in footer' }, value: 'footer' },
                                        { label: { de: 'Floating Button (unten links)', en: 'Floating button (bottom left)' }, value: 'floating' },
                                        { label: { de: 'Floating Button (unten rechts)', en: 'Floating button (bottom right)' }, value: 'floating-right' },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                {
                    label: { de: 'Banner-Texte', en: 'Banner text' },
                    fields: [
                        {
                            name: 'banner',
            type: 'group',
            label: { de: 'Banner Texte', en: 'Banner text' },
            localized: true,
            fields: [
                {
                    name: 'title',
                    type: 'text',
                    label: { de: 'Überschrift', en: 'Heading' },
                    required: true,
                    defaultValue: COOKIE_BANNER_DEFAULTS.banner.title,
                },
                {
                    name: 'description',
                    type: 'textarea',
                    label: { de: 'Beschreibung', en: 'Description' },
                    required: true,
                    defaultValue: COOKIE_BANNER_DEFAULTS.banner.description,
                },
                {
                    name: 'acceptAllLabel',
                    type: 'text',
                    label: { de: 'Alle akzeptieren Button', en: 'Accept all button' },
                    required: true,
                    defaultValue: COOKIE_BANNER_DEFAULTS.banner.acceptAllLabel,
                },
                {
                    name: 'rejectLabel',
                    type: 'text',
                    label: { de: 'Ablehnen Button', en: 'Reject button' },
                    required: true,
                    defaultValue: COOKIE_BANNER_DEFAULTS.banner.rejectLabel,
                },
                {
                    name: 'settingsLabel',
                    type: 'text',
                    label: { de: 'Einstellungen Button', en: 'Settings button' },
                    required: true,
                    defaultValue: COOKIE_BANNER_DEFAULTS.banner.settingsLabel,
                },
                {
                    name: 'saveLabel',
                    type: 'text',
                    label: { de: 'Speichern Button', en: 'Save button' },
                    required: true,
                    defaultValue: COOKIE_BANNER_DEFAULTS.banner.saveLabel,
                },
            ],
                        },
                    ],
                },
                {
                    label: { de: 'Modal', en: 'Modal' },
                    fields: [
                        {
                            name: 'modal',
                            type: 'group',
                            label: { de: 'Einstellungs-Modal', en: 'Settings modal' },
                            localized: true,
                            fields: [
                                {
                                    name: 'title',
                                    type: 'text',
                                    label: { de: 'Modal Überschrift', en: 'Modal heading' },
                                    required: true,
                                    defaultValue: COOKIE_BANNER_DEFAULTS.modal.title,
                                },
                                {
                                    name: 'description',
                                    type: 'textarea',
                                    label: { de: 'Modal Beschreibung', en: 'Modal description' },
                                    required: true,
                                    defaultValue: COOKIE_BANNER_DEFAULTS.modal.description,
                                },
                            ],
                        },
                    ],
                },
                {
                    label: { de: 'Datenschutz-Links', en: 'Privacy links' },
                    fields: [
                        {
                            name: 'policies',
            type: 'group',
            label: { de: 'Datenschutz-Links', en: 'Privacy links' },
            fields: [
                {
                    name: 'privacyPolicyLabel',
                    type: 'text',
                    label: { de: 'Datenschutz Link Text', en: 'Privacy policy link text' },
                    required: true,
                    defaultValue: COOKIE_BANNER_DEFAULTS.policies.privacyPolicyLabel,
                    localized: true,
                },
                {
                    name: 'privacyPolicy',
                    type: 'relationship',
                    label: { de: 'Datenschutz-Seite', en: 'Privacy policy page' },
                    relationTo: 'pages',
                },
                {
                    name: 'imprintLabel',
                    type: 'text',
                    label: { de: 'Impressum Link Text', en: 'Imprint link text' },
                    defaultValue: 'Impressum',
                    localized: true,
                },
                {
                    name: 'imprint',
                    type: 'relationship',
                    label: { de: 'Impressum-Seite', en: 'Imprint page' },
                    relationTo: 'pages',
                },
            ],
                        },
                    ],
                },
                {
                    label: { de: 'Cookie-Kategorien', en: 'Cookie categories' },
                    fields: [
                        {
                            type: 'collapsible',
                            label: { de: 'Kategorien konfigurieren', en: 'Configure categories' },
                            admin: {
                                initCollapsed: false,
                            },
                            fields: [
                {
                    name: 'necessary',
                    type: 'group',
                    label: { de: 'Notwendige Cookies', en: 'Necessary cookies' },
                    fields: [
                        {
                            name: 'label',
                            type: 'text',
                            label: { de: 'Kategorie-Name', en: 'Category name' },
                            required: true,
                            defaultValue: COOKIE_BANNER_DEFAULTS.necessary.label,
                            localized: true,
                        },
                        {
                            name: 'description',
                            type: 'textarea',
                            label: { de: 'Beschreibung', en: 'Description' },
                            required: true,
                            defaultValue: COOKIE_BANNER_DEFAULTS.necessary.description,
                            localized: true,
                        },
                    ],
                },
                {
                    name: 'analytics',
                    type: 'group',
                    label: { de: 'Analyse Cookies', en: 'Analytics cookies' },
                    fields: [
                        {
                            name: 'enabled',
                            type: 'checkbox',
                            label: { de: 'Kategorie anzeigen', en: 'Show category' },
                            defaultValue: COOKIE_BANNER_DEFAULTS.analytics.enabled,
                        },
                        {
                            name: 'label',
                            type: 'text',
                            label: { de: 'Kategorie-Name', en: 'Category name' },
                            required: true,
                            defaultValue: COOKIE_BANNER_DEFAULTS.analytics.label,
                            localized: true,
                        },
                        {
                            name: 'description',
                            type: 'textarea',
                            label: { de: 'Beschreibung', en: 'Description' },
                            required: true,
                            defaultValue: COOKIE_BANNER_DEFAULTS.analytics.description,
                            localized: true,
                        },
                    ],
                },
                {
                    name: 'marketing',
                    type: 'group',
                    label: { de: 'Marketing Cookies', en: 'Marketing cookies' },
                    fields: [
                        {
                            name: 'enabled',
                            type: 'checkbox',
                            label: { de: 'Kategorie anzeigen', en: 'Show category' },
                            defaultValue: COOKIE_BANNER_DEFAULTS.marketing.enabled,
                        },
                        {
                            name: 'label',
                            type: 'text',
                            label: { de: 'Kategorie-Name', en: 'Category name' },
                            required: true,
                            defaultValue: COOKIE_BANNER_DEFAULTS.marketing.label,
                            localized: true,
                        },
                        {
                            name: 'description',
                            type: 'textarea',
                            label: { de: 'Beschreibung', en: 'Description' },
                            required: true,
                            defaultValue: COOKIE_BANNER_DEFAULTS.marketing.description,
                            localized: true,
                        },
                    ],
                },
            ],
                        },
                    ],
                },
            ],
        },
    ],
}
