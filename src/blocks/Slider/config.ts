import type { Block } from 'payload'
import { sectionHeaderFields } from '@/fields/sectionHeader'

export const Slider: Block = {
    slug: 'slider',
    interfaceName: 'SliderBlock',
    imageURL: '/block-previews/slider.svg',
    imageAltText: 'Slider: compact or featured cards from a collection',
    labels: {
        singular: { de: 'Karussell', en: 'Slider' },
        plural: { de: 'Karussells', en: 'Sliders' },
    },
    fields: [
        {
            name: 'cardStyle',
            type: 'select',
            required: true,
            defaultValue: 'compact',
            options: [
                { label: { de: 'Kompakte Karten', en: 'Compact cards' }, value: 'compact' },
                { label: { de: 'Featured-Karten', en: 'Featured cards' }, value: 'featured' },
            ],
            admin: {
                description: {
                    de: 'Kompakt: Kleine Karten | Featured: Große Karten mit Bild',
                    en: 'Compact: Small product-style cards | Featured: Large cards with image',
                },
            },
        },
        {
            name: 'sourceCollection',
            type: 'select',
            required: true,
            defaultValue: 'posts',
            options: [
                { label: { de: 'Beiträge', en: 'Posts' }, value: 'posts' },
                { label: { de: 'Talente', en: 'Talents' }, value: 'talents' },
            ],
            admin: {
                description: {
                    de: 'Aus welcher Collection die Slider-Einträge kommen',
                    en: 'Which collection to pull slider items from',
                },
            },
        },
        {
            name: 'badgeField',
            type: 'select',
            defaultValue: 'none',
            options: [
                { label: { de: 'Keins / Statisch', en: 'None / Static' }, value: 'none' },
                { label: { de: 'Collection-Titel', en: 'Use collection title' }, value: 'title' },
                {
                    label: { de: 'Kategorie/Abteilung', en: 'Use category/department' },
                    value: 'category',
                },
            ],
            admin: {
                description: {
                    de: 'Woher der Badge-Text kommt (über dem Kartentitel)',
                    en: 'Where to pull the badge text from (displayed above card title)',
                },
            },
        },
        {
            name: 'staticBadge',
            type: 'text',
            localized: true,
            admin: {
                condition: (_, siblingData) => siblingData?.badgeField === 'none',
                description: {
                    de: 'Statischer Badge-Text für alle Karten (z.B. "WEESS", "FEATURED")',
                    en: 'Static badge text to show on all cards (e.g. "WEESS", "FEATURED")',
                },
            },
        },
        ...sectionHeaderFields({ headingLevel: true, cta: true }),
        {
            name: 'backgroundColor',
            type: 'select',
            defaultValue: 'white',
            options: [
                { label: { de: 'Weiß', en: 'White' }, value: 'white' },
                { label: { de: 'Hellgrau', en: 'Light gray' }, value: 'muted' },
            ],
            admin: {
                description: {
                    de: 'Hintergrund der Section (Dark/Light Mode wird automatisch angepasst)',
                    en: 'Section background (dark/light mode adapts automatically)',
                },
            },
        },
        {
            name: 'itemsLimit',
            type: 'number',
            defaultValue: 6,
            min: 1,
            max: 20,
            admin: {
                description: {
                    de: 'Maximale Anzahl Einträge im Slider',
                    en: 'Maximum number of items to show in the slider',
                },
            },
        },
        {
            name: 'sortBy',
            type: 'select',
            defaultValue: 'publishedAt',
            options: [
                {
                    label: {
                        de: 'Veröffentlichungsdatum (neueste zuerst)',
                        en: 'Published date (newest first)',
                    },
                    value: 'publishedAt',
                },
                { label: { de: 'Titel (A–Z)', en: 'Title (A–Z)' }, value: 'title' },
                { label: { de: 'Manuelle Auswahl', en: 'Manual selection' }, value: 'manual' },
            ],
            admin: {
                description: {
                    de: 'Sortierung und Auswahl der Einträge',
                    en: 'How to sort and select items',
                },
            },
        },
        {
            name: 'manualSelection',
            type: 'relationship',
            relationTo: ['posts', 'talents'],
            hasMany: true,
            maxDepth: 2,
            admin: {
                condition: (_, siblingData) => siblingData?.sortBy === 'manual',
                description: {
                    de: 'Einträge manuell auswählen und anordnen',
                    en: 'Manually select and order items for the slider',
                },
            },
        },
        // Compact card specific fields
        {
            name: 'compactFields',
            type: 'group',
            admin: {
                condition: (_, siblingData) => siblingData?.cardStyle === 'compact',
            },
            fields: [
                {
                    name: 'showImage',
                    type: 'checkbox',
                    defaultValue: true,
                    admin: {
                        description: {
                            de: 'Bild des Eintrags anzeigen',
                            en: 'Show the product/collection image',
                        },
                    },
                },
            ],
        },
        // Featured card specific fields
        {
            name: 'featuredFields',
            type: 'group',
            admin: {
                condition: (_, siblingData) => siblingData?.cardStyle === 'featured',
            },
            fields: [
                {
                    name: 'imagePosition',
                    type: 'select',
                    enumName: 'ip',
                    defaultValue: 'right',
                    options: [
                        { label: { de: 'Links', en: 'Left' }, value: 'left' },
                        { label: { de: 'Rechts', en: 'Right' }, value: 'right' },
                    ],
                    admin: {
                        description: {
                            de: 'Auf welcher Seite das Bild erscheint',
                            en: 'Which side the image appears on',
                        },
                    },
                },
                {
                    name: 'showFallbackImage',
                    type: 'checkbox',
                    defaultValue: false,
                    admin: {
                        description: {
                            de: 'Fallback-Bild anzeigen, wenn der Eintrag kein Bild hat',
                            en: 'Show fallback image if collection item has no image',
                        },
                    },
                },
            ],
        },
    ],
}
