import type { GlobalConfig } from 'payload'
import { adminOnly } from '../access'

export const SEO: GlobalConfig = {
    slug: 'seo',
    label: { de: 'SEO Konfiguration', en: 'SEO Configuration' },
    access: {
        read: () => true,
        update: adminOnly,
    },
    admin: {
        group: { de: 'Einstellungen', en: 'Settings' },
        description: { de: 'Globale SEO-Einstellungen für deine Website', en: 'Global SEO settings for your website' },
    },
    fields: [
        {
            type: 'tabs',
            tabs: [
                {
                    label: { de: 'Favicon & App-Icons', en: 'Favicon & app icons' },
                    fields: [
                        {
                            name: 'favicon',
                            type: 'upload',
                            relationTo: 'media',
                            label: { de: 'Favicon', en: 'Favicon' },
                            admin: {
                                description: {
                                    de: 'Kleinformat für Browser-Tabs (z. B. 32×32 oder SVG). Leer = Standard-Icon aus dem Projekt.',
                                    en: 'Small icon for browser tabs (e.g. 32×32 or SVG). Empty = project default.',
                                },
                            },
                        },
                        {
                            name: 'appleTouchIcon',
                            type: 'upload',
                            relationTo: 'media',
                            label: { de: 'Apple Touch Icon / Webclip', en: 'Apple Touch Icon / web clip' },
                            admin: {
                                description: {
                                    de: 'Für Homescreen / „Zum Home-Bildschirm“ (empfohlen 180×180 px). Leer = Favicon oder Standard.',
                                    en: 'For home screen / "Add to Home Screen" (recommended 180×180 px). Empty = favicon or default.',
                                },
                            },
                        },
                    ],
                },
                {
                    label: { de: 'Unternehmensinfo', en: 'Business info' },
                    fields: [
                        {
                            name: 'businessInfo',
                            type: 'group',
                            fields: [
                                {
                                    name: 'name',
                                    type: 'text',
                                    label: { de: 'Firmenname', en: 'Company name' },
                                    required: true,
                                    defaultValue: 'Meine Agentur',
                                    localized: true,
                                },
                                {
                                    name: 'description',
                                    type: 'textarea',
                                    label: { de: 'Firmenbeschreibung', en: 'Company description' },
                                    required: true,
                                    localized: true,
                                },
                                {
                                    name: 'businessType',
                                    type: 'select',
                                    label: { de: 'Unternehmensart', en: 'Business type' },
                                    defaultValue: 'ProfessionalService',
                                    options: [
                                        { label: { de: 'Lokales Unternehmen', en: 'Local business' }, value: 'LocalBusiness' },
                                        { label: { de: 'Dienstleister', en: 'Professional service' }, value: 'ProfessionalService' },
                                        { label: { de: 'Agentur', en: 'Organization' }, value: 'Organization' },
                                    ],
                                },
                                {
                                    name: 'foundingDate',
                                    type: 'text',
                                    label: { de: 'Gründungsjahr', en: 'Founding year' },
                                    defaultValue: '2024',
                                },
                                {
                                    name: 'priceRange',
                                    type: 'select',
                                    label: { de: 'Preisbereich', en: 'Price range' },
                                    defaultValue: '€€',
                                    options: [
                                        { label: { de: '€ – Budget', en: '€ – Budget' }, value: '€' },
                                        { label: { de: '€€ – Mittel', en: '€€ – Mid-range' }, value: '€€' },
                                        { label: { de: '€€€ – Premium', en: '€€€ – Premium' }, value: '€€€' },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                {
                    label: { de: 'Kontakt', en: 'Contact' },
                    fields: [
                        {
                            name: 'contactInfo',
                            type: 'group',
                            fields: [
                                {
                                    name: 'email',
                                    type: 'email',
                                    label: { de: 'E-Mail', en: 'Email' },
                                },
                                {
                                    name: 'telephone',
                                    type: 'text',
                                    label: { de: 'Telefon', en: 'Phone' },
                                    admin: {
                                        description: { de: 'Mit Ländervorwahl (z.B. +49 123 456789)', en: 'With country code (e.g. +49 123 456789)' },
                                    },
                                },
                                {
                                    name: 'streetAddress',
                                    type: 'text',
                                    label: { de: 'Straße', en: 'Street' },
                                },
                                {
                                    name: 'addressLocality',
                                    type: 'text',
                                    label: { de: 'Stadt', en: 'City' },
                                },
                                {
                                    name: 'postalCode',
                                    type: 'text',
                                    label: { de: 'PLZ', en: 'Postal code' },
                                },
                                {
                                    name: 'addressCountry',
                                    type: 'text',
                                    label: { de: 'Land (ISO-Code)', en: 'Country (ISO code)' },
                                    defaultValue: 'DE',
                                },
                            ],
                        },
                    ],
                },
                {
                    label: { de: 'Social Media', en: 'Social media' },
                    fields: [
                        {
                            name: 'socialMedia',
                            type: 'group',
                            fields: [
                                {
                                    name: 'website',
                                    type: 'text',
                                    label: { de: 'Website-URL', en: 'Website URL' },
                                },
                                {
                                    name: 'logo',
                                    type: 'upload',
                                    label: { de: 'Logo', en: 'Logo' },
                                    relationTo: 'media',
                                },
                                {
                                    name: 'sameAs',
                                    type: 'array',
                                    label: { de: 'Social-Media-Profile', en: 'Social media profiles' },
                                    maxRows: 10,
                                    fields: [
                                        {
                                            name: 'platform',
                                            type: 'select',
                                            label: { de: 'Plattform', en: 'Platform' },
                                            options: [
                                                { label: { de: 'Facebook', en: 'Facebook' }, value: 'facebook' },
                                                { label: { de: 'Instagram', en: 'Instagram' }, value: 'instagram' },
                                                { label: { de: 'LinkedIn', en: 'LinkedIn' }, value: 'linkedin' },
                                                { label: { de: 'Twitter/X', en: 'Twitter/X' }, value: 'twitter' },
                                                { label: { de: 'YouTube', en: 'YouTube' }, value: 'youtube' },
                                                { label: { de: 'GitHub', en: 'GitHub' }, value: 'github' },
                                            ],
                                        },
                                        {
                                            name: 'url',
                                            type: 'text',
                                            label: { de: 'Profil-URL', en: 'Profile URL' },
                                            required: true,
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                {
                    label: { de: 'AI & Crawler', en: 'AI & crawler' },
                    fields: [
                        {
                            name: 'aiAndCrawlers',
                            type: 'group',
                            fields: [
                                {
                                    name: 'allowAITraining',
                                    type: 'checkbox',
                                    label: { de: 'AI-Training erlauben', en: 'Allow AI training' },
                                    defaultValue: true,
                                },
                                {
                                    name: 'llmTxtEnabled',
                                    type: 'checkbox',
                                    label: { de: 'llms.txt aktivieren', en: 'Enable llms.txt' },
                                    defaultValue: true,
                                },
                                {
                                    name: 'llmTxtContent',
                                    type: 'group',
                                    label: { de: 'llms.txt Konfiguration', en: 'llms.txt configuration' },
                                    admin: {
                                        condition: (_, siblingData) => siblingData?.llmTxtEnabled,
                                    },
                                    fields: [
                                        {
                                            name: 'updateSchedule',
                                            type: 'select',
                                            label: { de: 'Update-Frequenz', en: 'Update frequency' },
                                            defaultValue: 'weekly',
                                            options: [
                                                { label: { de: 'Täglich', en: 'Daily' }, value: 'daily' },
                                                { label: { de: 'Wöchentlich', en: 'Weekly' }, value: 'weekly' },
                                                { label: { de: 'Monatlich', en: 'Monthly' }, value: 'monthly' },
                                            ],
                                        },
                                        {
                                            name: 'citationPolicy',
                                            type: 'textarea',
                                            label: { de: 'Zitierrichtlinie', en: 'Citation policy' },
                                            localized: true,
                                        },
                                        {
                                            name: 'contentAreasText',
                                            type: 'textarea',
                                            label: { de: 'Inhalts-Bereiche', en: 'Content areas' },
                                            admin: {
                                                description:
                                                    'Ein Pfad pro Zeile, z.B.:\n/blog/*\n/leistungen/*',
                                            },
                                        },
                                    ],
                                },
                                {
                                    name: 'robotsExtraRules',
                                    type: 'textarea',
                                    label: { de: 'Zusätzliche robots.txt Regeln', en: 'Extra robots.txt rules' },
                                    admin: {
                                        description:
                                            'Zusätzliche robots.txt Direktiven (eine pro Zeile)',
                                    },
                                },
                            ],
                        },
                    ],
                },
                {
                    label: { de: 'Sitemap', en: 'Sitemap' },
                    fields: [
                        {
                            name: 'sitemapsIndexing',
                            type: 'group',
                            fields: [
                                {
                                    name: 'enabled',
                                    type: 'checkbox',
                                    label: { de: 'Sitemap aktivieren', en: 'Enable sitemap' },
                                    defaultValue: true,
                                },
                                {
                                    name: 'includePages',
                                    type: 'checkbox',
                                    label: { de: 'Seiten einschließen', en: 'Include pages' },
                                    defaultValue: true,
                                },
                                {
                                    name: 'includePosts',
                                    type: 'checkbox',
                                    label: { de: 'Blog-Beiträge einschließen', en: 'Include blog posts' },
                                    defaultValue: true,
                                },
                                {
                                    name: 'changeFrequency',
                                    type: 'select',
                                    label: { de: 'Änderungsfrequenz', en: 'Change frequency' },
                                    defaultValue: 'weekly',
                                    options: [
                                        { label: { de: 'Täglich', en: 'Daily' }, value: 'daily' },
                                        { label: { de: 'Wöchentlich', en: 'Weekly' }, value: 'weekly' },
                                        { label: { de: 'Monatlich', en: 'Monthly' }, value: 'monthly' },
                                    ],
                                },
                                {
                                    name: 'priority',
                                    type: 'number',
                                    label: { de: 'Standard-Priorität', en: 'Default priority' },
                                    defaultValue: 0.5,
                                    min: 0,
                                    max: 1,
                                },
                                {
                                    name: 'excludePathsText',
                                    type: 'textarea',
                                    label: { de: 'Ausgeschlossene Pfade', en: 'Excluded paths' },
                                    admin: {
                                        description: { de: 'Ein Pfad pro Zeile', en: 'One path per line' },
                                    },
                                },
                            ],
                        },
                    ],
                },
                {
                    label: { de: 'Analytics', en: 'Analytics' },
                    fields: [
                        {
                            name: 'analytics',
                            type: 'group',
                            fields: [
                                {
                                    name: 'rybbit',
                                    type: 'group',
                                    label: { de: 'Rybbit Analytics', en: 'Rybbit Analytics' },
                                    fields: [
                                        {
                                            name: 'enabled',
                                            type: 'checkbox',
                                            label: { de: 'Aktivieren', en: 'Enable' },
                                            defaultValue: false,
                                        },
                                        {
                                            name: 'siteId',
                                            type: 'text',
                                            label: { de: 'Site-ID', en: 'Site ID' },
                                            admin: {
                                                condition: (_, siblingData) => siblingData?.enabled,
                                            },
                                        },
                                        {
                                            name: 'scriptUrl',
                                            type: 'text',
                                            label: { de: 'Script-URL', en: 'Script URL' },
                                            defaultValue: 'https://app.rybbit.io/api/script.js',
                                            admin: {
                                                condition: (_, siblingData) => siblingData?.enabled,
                                            },
                                        },
                                    ],
                                },
                                {
                                    name: 'googleAnalytics',
                                    type: 'group',
                                    label: { de: 'Google Analytics', en: 'Google Analytics' },
                                    fields: [
                                        {
                                            name: 'enabled',
                                            type: 'checkbox',
                                            label: { de: 'GA4 aktivieren', en: 'Enable GA4' },
                                            defaultValue: false,
                                        },
                                        {
                                            name: 'measurementId',
                                            type: 'text',
                                            label: { de: 'Measurement ID', en: 'Measurement ID' },
                                            admin: {
                                                condition: (_, siblingData) => siblingData?.enabled,
                                                description: { de: 'z.B. G-XXXXXXXXXX', en: 'e.g. G-XXXXXXXXXX' },
                                            },
                                        },
                                        {
                                            name: 'requireConsent',
                                            type: 'checkbox',
                                            label: { de: 'Cookie-Consent erforderlich', en: 'Cookie consent required' },
                                            defaultValue: true,
                                            admin: {
                                                condition: (_, siblingData) => siblingData?.enabled,
                                            },
                                        },
                                    ],
                                },
                                {
                                    name: 'googleTagManager',
                                    type: 'group',
                                    label: { de: 'Google Tag Manager', en: 'Google Tag Manager' },
                                    fields: [
                                        {
                                            name: 'enabled',
                                            type: 'checkbox',
                                            label: { de: 'GTM aktivieren', en: 'Enable GTM' },
                                            defaultValue: false,
                                        },
                                        {
                                            name: 'containerId',
                                            type: 'text',
                                            label: { de: 'Container-ID', en: 'Container ID' },
                                            admin: {
                                                condition: (_, siblingData) => siblingData?.enabled,
                                                description: { de: 'z.B. GTM-XXXXXXX', en: 'e.g. GTM-XXXXXXX' },
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                {
                    label: { de: 'Schema', en: 'Schema' },
                    fields: [
                        {
                            name: 'schemaTemplates',
                            type: 'group',
                            fields: [
                                {
                                    name: 'websiteSchema',
                                    type: 'group',
                                    label: { de: 'Website-Schema', en: 'Website schema' },
                                    fields: [
                                        {
                                            name: 'enableSearch',
                                            type: 'checkbox',
                                            label: { de: 'Suchfunktion aktivieren', en: 'Enable search' },
                                            defaultValue: true,
                                        },
                                        {
                                            name: 'searchEndpoint',
                                            type: 'text',
                                            label: { de: 'Such-Endpoint', en: 'Search endpoint' },
                                            defaultValue: '/suche?q={search_term_string}',
                                            admin: {
                                                condition: (_, siblingData) =>
                                                    siblingData?.enableSearch,
                                            },
                                        },
                                        {
                                            name: 'language',
                                            type: 'select',
                                            label: { de: 'Primärsprache', en: 'Primary language' },
                                            defaultValue: 'de-DE',
                                            options: [
                                                { label: { de: 'Deutsch', en: 'German' }, value: 'de-DE' },
                                                { label: { de: 'Englisch', en: 'English' }, value: 'en-US' },
                                            ],
                                        },
                                    ],
                                },
                                {
                                    name: 'includeBreadcrumbs',
                                    type: 'checkbox',
                                    label: { de: 'Breadcrumbs standardmäßig', en: 'Breadcrumbs by default' },
                                    defaultValue: true,
                                },
                                {
                                    name: 'includeOrganization',
                                    type: 'checkbox',
                                    label: { de: 'Organization-Schema standardmäßig', en: 'Organization schema by default' },
                                    defaultValue: true,
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
}
