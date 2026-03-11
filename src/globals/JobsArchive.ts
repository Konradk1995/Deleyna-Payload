import type { GlobalConfig } from 'payload'
import { adminOrEditor } from '../access'
import { link } from '../fields/link'
import { revalidateJobsArchive } from '@/hooks/revalidateArchiveGlobals'

export const JobsArchive: GlobalConfig = {
    slug: 'jobs-archive',
    label: { de: 'Jobs-Übersicht', en: 'Jobs Overview' },
    access: {
        read: () => true,
        update: adminOrEditor,
    },
    admin: {
        group: { de: 'Jobs', en: 'Jobs' },
        description: {
            de: 'Inhalte der Jobs-Übersichtsseite konfigurieren',
            en: 'Configure jobs overview page content',
        },
        livePreview: {
            url: ({ locale }) => {
                const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
                const localePrefix = locale?.code ?? 'de'
                return `${baseUrl}/${localePrefix}/jobs`
            },
        },
    },
    hooks: {
        afterChange: [revalidateJobsArchive],
    },
    fields: [
        {
            type: 'tabs',
            tabs: [
                {
                    label: { de: 'Hero', en: 'Hero' },
                    fields: [
                        {
                            name: 'heroOverline',
                            type: 'text',
                            label: { de: 'Overline / Badge', en: 'Overline / Badge' },
                            localized: true,
                            defaultValue: 'Jobs',
                        },
                        {
                            name: 'heroHeadline',
                            type: 'text',
                            label: { de: 'Überschrift', en: 'Heading' },
                            localized: true,
                            defaultValue: 'Offene Stellen',
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
                            name: 'enabled',
                            type: 'checkbox',
                            label: { de: 'Jobs-Seite aktiv', en: 'Jobs page active' },
                            defaultValue: true,
                            admin: {
                                description: {
                                    de: 'Deaktivieren, um die Jobs-Seite offline zu nehmen (404).',
                                    en: 'Disable to take the jobs page offline (404).',
                                },
                            },
                        },
                        {
                            name: 'jobsPerPage',
                            type: 'number',
                            label: { de: 'Jobs pro Seite', en: 'Jobs per page' },
                            defaultValue: 12,
                            min: 4,
                            max: 48,
                        },
                        {
                            name: 'emptyStateText',
                            type: 'text',
                            label: { de: 'Text bei keinen Jobs', en: 'Empty state text' },
                            localized: true,
                        },
                    ],
                },
                {
                    label: { de: 'CTA', en: 'CTA' },
                    fields: [
                        {
                            name: 'showCta',
                            type: 'checkbox',
                            label: { de: 'CTA-Sektion anzeigen', en: 'Show CTA section' },
                            defaultValue: true,
                        },
                        {
                            name: 'ctaBadge',
                            type: 'text',
                            label: { de: 'CTA Badge', en: 'CTA Badge' },
                            localized: true,
                            admin: {
                                condition: (_, siblingData) => siblingData?.showCta,
                            },
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
                                label: { de: 'CTA-Button', en: 'CTA button' },
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
