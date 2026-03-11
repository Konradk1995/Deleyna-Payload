import type { GlobalConfig } from 'payload'
import { adminOrEditor } from '../access'
import { revalidatePostsArchive } from '@/hooks/revalidateArchiveGlobals'
import { link } from '../fields/link'

export const PostsArchive: GlobalConfig = {
    slug: 'posts-archive',
    label: { de: 'Blog-Übersicht', en: 'Blog Overview' },
    access: {
        read: () => true,
        update: adminOrEditor,
    },
    admin: {
        group: { de: 'Blog', en: 'Blog' },
        description: { de: 'Inhalte der Blog-Übersichtsseite konfigurieren', en: 'Configure blog overview page content' },
        livePreview: {
            url: ({ locale }) => {
                const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
                const localePrefix = locale?.code ?? 'de'
                const postSegment = localePrefix === 'de' ? 'magazin' : 'blog'
                return `${baseUrl}/${localePrefix}/${postSegment}`
            },
        },
    },
    hooks: {
        afterChange: [revalidatePostsArchive],
    },
    fields: [
        {
            type: 'tabs',
            tabs: [
                {
                    label: { de: 'Hero', en: 'Hero' },
                    fields: [
                        {
                            name: 'heroHeadline',
                            type: 'text',
                            label: { de: 'Überschrift', en: 'Heading' },
                            localized: true,
                            defaultValue: 'Blog',
                        },
                        {
                            name: 'heroDescription',
                            type: 'textarea',
                            label: { de: 'Beschreibung', en: 'Description' },
                            localized: true,
                        },
                    ],
                },
                {
                    label: { de: 'Einstellungen', en: 'Settings' },
                    fields: [
                        {
                            name: 'postsPerPage',
                            type: 'number',
                            label: { de: 'Beiträge pro Seite', en: 'Posts per page' },
                            defaultValue: 12,
                            min: 4,
                            max: 48,
                        },
                        {
                            name: 'showCategories',
                            type: 'checkbox',
                            label: { de: 'Kategorie-Filter anzeigen', en: 'Show category filter' },
                            defaultValue: true,
                        },
                        {
                            name: 'showFeatured',
                            type: 'checkbox',
                            label: { de: 'Featured Post oben anzeigen', en: 'Show featured post at top' },
                            defaultValue: true,
                        },
                    ],
                },
                {
                    label: { de: 'CTA', en: 'CTA' },
                    fields: [
                        {
                            name: 'showCta',
                            type: 'checkbox',
                            label: { de: 'Newsletter CTA anzeigen', en: 'Show newsletter CTA' },
                            defaultValue: false,
                        },
                        {
                            name: 'ctaHeadline',
                            type: 'text',
                            label: { de: 'CTA Überschrift', en: 'CTA heading' },
                            localized: true,
                            admin: {
                                condition: (_, siblingData) => siblingData?.showCta,
                            },
                        },
                        {
                            name: 'ctaDescription',
                            type: 'textarea',
                            label: { de: 'CTA Beschreibung', en: 'CTA description' },
                            localized: true,
                            admin: {
                                condition: (_, siblingData) => siblingData?.showCta,
                            },
                        },
                        link({
                            appearances: ['primary', 'secondary', 'outline', 'copper'],
                            optionalLink: true,
                            overrides: {
                                name: 'ctaLink',
                                label: { de: 'CTA Button', en: 'CTA button' },
                                admin: {
                                    condition: (_, siblingData) => siblingData?.showCta,
                                },
                            },
                        }),
                    ],
                },
                {
                    label: { de: 'SEO', en: 'SEO' },
                    fields: [
                        {
                            name: 'metaTitle',
                            type: 'text',
                            label: { de: 'Meta Titel', en: 'Meta title' },
                            localized: true,
                        },
                        {
                            name: 'metaDescription',
                            type: 'textarea',
                            label: { de: 'Meta Beschreibung', en: 'Meta description' },
                            localized: true,
                            maxLength: 160,
                        },
                        {
                            name: 'metaKeywords',
                            type: 'text',
                            label: { de: 'Meta Keywords', en: 'Meta keywords' },
                            localized: true,
                            admin: {
                                description: {
                                    de: 'Kommagetrennte Keywords für SEO',
                                    en: 'Comma-separated keywords for SEO',
                                },
                            },
                        },
                        {
                            name: 'noIndex',
                            type: 'checkbox',
                            label: { de: 'Nicht indexieren', en: 'No index' },
                            defaultValue: false,
                            admin: {
                                description: {
                                    de: 'Suchmaschinen bitten, diese Seite nicht zu indexieren.',
                                    en: 'Ask search engines not to index this page.',
                                },
                            },
                        },
                        {
                            name: 'ogImage',
                            type: 'upload',
                            relationTo: 'media',
                            label: { de: 'Social Media Bild', en: 'Social media image' },
                            admin: {
                                description: { de: 'Bild für Social Media (1200x630px). Fallback: globales Logo.', en: 'Image for social media (1200x630px). Fallback: global logo.' },
                            },
                        },
                    ],
                },
            ],
        },
    ],
}
