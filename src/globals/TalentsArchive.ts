import type { GlobalConfig } from 'payload'
import { adminOrEditor } from '../access'
import { linkGroup } from '../fields/linkGroup'
import { allBlocks } from '../blocks'
import { revalidateTalentsArchive } from '@/hooks/revalidateArchiveGlobals'

export const TalentsArchive: GlobalConfig = {
    slug: 'talents-archive',
    label: { de: 'Talent-Übersicht', en: 'Talents Overview' },
    access: {
        read: () => true,
        update: adminOrEditor,
    },
    admin: {
        group: { de: 'Talent', en: 'Talent' },
        description: { de: 'Inhalte der Talent-Übersichtsseite konfigurieren', en: 'Configure talents overview page content' },
        livePreview: {
            url: ({ locale }) => {
                const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
                const localePrefix = locale?.code ?? 'de'
                const talentSegment = localePrefix === 'de' ? 'talente' : 'talents'
                return `${baseUrl}/${localePrefix}/${talentSegment}`
            },
        },
    },
    hooks: {
        afterChange: [revalidateTalentsArchive],
    },
    fields: [
        {
            type: 'tabs',
            tabs: [
                {
                    label: { de: 'Showcase', en: 'Showcase' },
                    fields: [
                        {
                            name: 'showcaseEnabled',
                            type: 'checkbox',
                            label: { de: 'Showcase aktivieren', en: 'Enable showcase' },
                            defaultValue: true,
                            admin: {
                                description: {
                                    de: 'Zeigt einen großen Talent-Swiper oben auf der Seite',
                                    en: 'Shows a large talent swiper at the top of the page',
                                },
                            },
                        },
                        {
                            name: 'showcaseMode',
                            type: 'select',
                            label: { de: 'Modus', en: 'Mode' },
                            defaultValue: 'featured',
                            options: [
                                {
                                    label: { de: 'Featured Talente (automatisch)', en: 'Featured talents (automatic)' },
                                    value: 'featured',
                                },
                                {
                                    label: { de: 'Manuell auswählen', en: 'Manual selection' },
                                    value: 'manual',
                                },
                            ],
                            admin: {
                                condition: (_, siblingData) => siblingData?.showcaseEnabled,
                            },
                        },
                        {
                            name: 'showcaseTalents',
                            type: 'relationship',
                            relationTo: 'talents',
                            hasMany: true,
                            maxRows: 12,
                            label: { de: 'Showcase Talente', en: 'Showcase talents' },
                            admin: {
                                condition: (_, siblingData) =>
                                    siblingData?.showcaseEnabled && siblingData?.showcaseMode === 'manual',
                                description: {
                                    de: 'Wähle bis zu 12 Talente für den Showcase',
                                    en: 'Select up to 12 talents for the showcase',
                                },
                            },
                        },
                        {
                            name: 'showcaseMaxSlides',
                            type: 'number',
                            label: { de: 'Max. Slides', en: 'Max slides' },
                            defaultValue: 8,
                            min: 3,
                            max: 16,
                            admin: {
                                condition: (_, siblingData) => siblingData?.showcaseEnabled,
                                description: {
                                    de: 'Maximale Anzahl der Slides im Showcase',
                                    en: 'Maximum number of slides in the showcase',
                                },
                            },
                        },
                        {
                            name: 'showcaseAutoplay',
                            type: 'checkbox',
                            label: { de: 'Autoplay', en: 'Autoplay' },
                            defaultValue: true,
                            admin: {
                                condition: (_, siblingData) => siblingData?.showcaseEnabled,
                            },
                        },
                    ],
                },
                {
                    label: { de: 'Hero', en: 'Hero' },
                    fields: [
                        {
                            name: 'heroHeadline',
                            type: 'text',
                            label: { de: 'Überschrift', en: 'Heading' },
                            localized: true,
                            defaultValue: 'Unsere Talente',
                        },
                        {
                            name: 'heroDescription',
                            type: 'textarea',
                            label: { de: 'Beschreibung', en: 'Description' },
                            localized: true,
                        },
                        {
                            name: 'heroImage',
                            type: 'upload',
                            label: { de: 'Hero Bild', en: 'Hero image' },
                            relationTo: 'media',
                        },
                    ],
                },
                {
                    label: { de: 'Inhalt', en: 'Content' },
                    description: {
                        de: 'Zusätzliche Inhaltsblöcke zwischen Showcase und Talent-Grid (z.B. FAQ, Text, Galerie)',
                        en: 'Additional content blocks between showcase and talent grid (e.g. FAQ, text, gallery)',
                    },
                    fields: [
                        {
                            name: 'layout',
                            type: 'blocks',
                            blocks: allBlocks,
                            localized: true,
                            admin: {
                                description: {
                                    de: 'Inhaltsblöcke, die zwischen Showcase und Talent-Grid angezeigt werden.',
                                    en: 'Content blocks displayed between the showcase and talent grid.',
                                },
                            },
                        },
                    ],
                },
                {
                    label: { de: 'Filter', en: 'Filter' },
                    fields: [
                        {
                            name: 'showFilters',
                            type: 'checkbox',
                            label: { de: 'Kategorie-Filter anzeigen', en: 'Show category filter' },
                            defaultValue: true,
                        },
                        {
                            name: 'filterLabels',
                            type: 'group',
                            label: { de: 'Filter-Labels', en: 'Filter labels' },
                            localized: true,
                            admin: {
                                condition: (_, siblingData) => siblingData?.showFilters,
                            },
                            fields: [
                                {
                                    name: 'all',
                                    type: 'text',
                                    label: { de: 'Alle', en: 'All' },
                                    defaultValue: 'Alle',
                                },
                                {
                                    name: 'dancers',
                                    type: 'text',
                                    label: { de: 'Tänzer', en: 'Dancers' },
                                    defaultValue: 'Tänzer',
                                },
                                {
                                    name: 'models',
                                    type: 'text',
                                    label: { de: 'Models', en: 'Models' },
                                    defaultValue: 'Models',
                                },
                            ],
                        },
                        {
                            name: 'showHairFilter',
                            type: 'checkbox',
                            label: { de: 'Haarfarben-Filter anzeigen', en: 'Show hair colour filter' },
                            defaultValue: true,
                            admin: {
                                condition: (_, siblingData) => siblingData?.showFilters,
                            },
                        },
                        {
                            name: 'showEyeFilter',
                            type: 'checkbox',
                            label: { de: 'Augenfarben-Filter anzeigen', en: 'Show eye colour filter' },
                            defaultValue: true,
                            admin: {
                                condition: (_, siblingData) => siblingData?.showFilters,
                            },
                        },
                        {
                            name: 'showSkillsFilter',
                            type: 'checkbox',
                            label: { de: 'Skills-Filter anzeigen', en: 'Show skills filter' },
                            defaultValue: true,
                            admin: {
                                condition: (_, siblingData) => siblingData?.showFilters,
                            },
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
                            name: 'ctaHeadline',
                            type: 'text',
                            label: { de: 'CTA Überschrift', en: 'CTA heading' },
                            localized: true,
                            defaultValue: 'Du bist ein Talent?',
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
                        {
                            ...linkGroup({
                                overrides: {
                                    maxRows: 1,
                                    name: 'ctaButton',
                                    label: { de: 'CTA-Button', en: 'CTA button' },
                                    admin: {
                                        condition: (_, siblingData) => siblingData?.showCta,
                                        description: {
                                            de: 'Link für den Button (interne Seite z. B. Kontakt, externe URL oder Archiv).',
                                            en: 'Button link (internal page e.g. Contact, external URL, or archive).',
                                        },
                                    },
                                },
                            }),
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
