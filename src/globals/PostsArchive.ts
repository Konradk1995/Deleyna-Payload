import type { GlobalConfig } from 'payload'
import { adminOrEditor } from '../access'
import { revalidatePostsArchive } from '@/hooks/revalidateArchiveGlobals'

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
                    ],
                },
            ],
        },
    ],
}
