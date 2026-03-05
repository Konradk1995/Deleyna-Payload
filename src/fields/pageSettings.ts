import type { Field } from 'payload'

/**
 * PageSettings - Wiederverwendbare SEO & Page Settings
 * Enthält: SEO Meta, Open Graph, Schema Markup, Crawling Options
 */
export const pageSettings: Field = {
    name: 'pageSettings',
    type: 'group',
    label: { de: 'Seiteneinstellungen', en: 'Page settings' },
    admin: {
        position: 'sidebar',
    },
    fields: [
        {
            type: 'collapsible',
            label: { de: 'SEO', en: 'SEO' },
            admin: {
                initCollapsed: true,
            },
            fields: [
                {
                    name: 'metaTitle',
                    type: 'text',
                    localized: true,
                    admin: {
                        description: { de: 'Überschreibt den Standard-Titel (max. 60 Zeichen)', en: 'Overrides the default title (max. 60 characters)' },
                    },
                    maxLength: 60,
                },
                {
                    name: 'metaDescription',
                    type: 'textarea',
                    localized: true,
                    admin: {
                        description: { de: 'Beschreibung für Suchmaschinen (max. 160 Zeichen)', en: 'Description for search engines (max. 160 characters)' },
                    },
                    maxLength: 160,
                },
                {
                    name: 'metaKeywords',
                    type: 'text',
                    localized: true,
                    admin: {
                        description: { de: 'Komma-getrennte Keywords', en: 'Comma-separated keywords' },
                    },
                },
            ],
        },
        {
            type: 'collapsible',
            label: { de: 'Open Graph / Social Media', en: 'Open Graph / Social Media' },
            admin: {
                initCollapsed: true,
            },
            fields: [
                {
                    name: 'ogTitle',
                    type: 'text',
                    localized: true,
                    admin: {
                        description: { de: 'Titel für Social Media Sharing', en: 'Title for social media sharing' },
                    },
                },
                {
                    name: 'ogDescription',
                    type: 'textarea',
                    localized: true,
                    admin: {
                        description: { de: 'Beschreibung für Social Media', en: 'Description for social media' },
                    },
                },
                {
                    name: 'ogImage',
                    type: 'upload',
                    relationTo: 'media',
                    admin: {
                        description: { de: 'Bild für Social Media (empfohlen: 1200x630px)', en: 'Image for social media (recommended: 1200x630px)' },
                    },
                },
            ],
        },
        {
            type: 'collapsible',
            label: { de: 'Schema Markup', en: 'Schema markup' },
            admin: {
                initCollapsed: true,
            },
            fields: [
                {
                    name: 'schemaType',
                    type: 'select',
                    defaultValue: 'WebPage',
                    options: [
                        { label: { de: 'Webseite', en: 'Website' }, value: 'WebPage' },
                        { label: { de: 'Artikel', en: 'Article' }, value: 'Article' },
                        { label: { de: 'Blog Post', en: 'Blog post' }, value: 'BlogPosting' },
                        { label: { de: 'FAQ Seite', en: 'FAQ page' }, value: 'FAQPage' },
                        { label: { de: 'Kontaktseite', en: 'Contact page' }, value: 'ContactPage' },
                        { label: { de: 'Über uns', en: 'About us' }, value: 'AboutPage' },
                        { label: { de: 'Sammlung', en: 'Collection' }, value: 'CollectionPage' },
                        { label: { de: 'Service', en: 'Service' }, value: 'Service' },
                        { label: { de: 'Produkt', en: 'Product' }, value: 'Product' },
                    ],
                },
                {
                    name: 'includeBreadcrumbs',
                    type: 'checkbox',
                    defaultValue: true,
                    label: { de: 'Breadcrumbs Schema', en: 'Breadcrumbs schema' },
                },
                {
                    name: 'includeOrganization',
                    type: 'checkbox',
                    defaultValue: true,
                    label: { de: 'Organization Schema', en: 'Organization schema' },
                },
            ],
        },
        {
            type: 'collapsible',
            label: { de: 'Custom Schema Markup', en: 'Custom schema markup' },
            admin: {
                initCollapsed: true,
            },
            fields: [
                {
                    name: 'schemaMarkup',
                    type: 'code',
                    localized: true,
                    admin: {
                        language: 'json',
                        description: {
                            de: 'Eigenes JSON-LD Schema Markup (optional). Wird als <script type="application/ld+json"> eingefügt.',
                            en: 'Custom JSON-LD schema markup (optional). Inserted as <script type="application/ld+json">.',
                        },
                    },
                },
            ],
        },
        {
            type: 'collapsible',
            label: { de: 'Crawling & Indexierung', en: 'Crawling & indexing' },
            admin: {
                initCollapsed: true,
            },
            fields: [
                {
                    name: 'noIndex',
                    type: 'checkbox',
                    defaultValue: false,
                    admin: {
                        description: { de: 'Diese Seite von Suchmaschinen ausschließen', en: 'Exclude this page from search engines' },
                    },
                },
                {
                    name: 'noFollow',
                    type: 'checkbox',
                    defaultValue: false,
                    admin: {
                        description: { de: 'Links auf dieser Seite nicht folgen', en: 'Do not follow links on this page' },
                    },
                },
                {
                    name: 'excludeFromSitemap',
                    type: 'checkbox',
                    defaultValue: false,
                    admin: {
                        description: { de: 'Aus der Sitemap ausschließen', en: 'Exclude from sitemap' },
                    },
                },
                {
                    name: 'excludeFromLLM',
                    type: 'checkbox',
                    defaultValue: false,
                    admin: {
                        description: { de: 'Aus llms.txt ausschließen', en: 'Exclude from llms.txt' },
                    },
                },
                {
                    name: 'canonicalUrl',
                    type: 'text',
                    admin: {
                        description: { de: 'Optionale kanonische URL (für Duplikate)', en: 'Optional canonical URL (for duplicate content)' },
                    },
                },
                {
                    name: 'priority',
                    type: 'number',
                    defaultValue: 0.5,
                    min: 0,
                    max: 1,
                    admin: {
                        step: 0.1,
                        description: { de: 'Sitemap Priorität (0.0 - 1.0)', en: 'Sitemap priority (0.0 - 1.0)' },
                    },
                },
            ],
        },
    ],
}
