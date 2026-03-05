import type { Block } from 'payload'

export const FeaturedTalentsBlock: Block = {
    slug: 'featuredTalents',
    interfaceName: 'FeaturedTalentsBlock',
    imageURL: '/block-previews/featured-talents.svg',
    imageAltText: 'Featured talents carousel or grid',
    labels: {
        singular: { de: 'Featured Talents', en: 'Featured talents' },
        plural: { de: 'Featured Talents', en: 'Featured talents' },
    },
    fields: [
        {
            name: 'overline',
            type: 'text',
            localized: true,
            label: { de: 'Overline', en: 'Overline' },
        },
        { name: 'title', type: 'text', localized: true, label: { de: 'Titel', en: 'Title' } },
        {
            name: 'layout',
            type: 'select',
            label: { de: 'Layout', en: 'Layout' },
            defaultValue: 'carousel',
            options: [
                {
                    label: { de: 'Carousel (Standard)', en: 'Carousel (Standard)' },
                    value: 'carousel',
                },
                {
                    label: {
                        de: 'Premium (Fortnite Style, 3 Karten, Draggable)',
                        en: 'Premium (Fortnite style, 3 cards, draggable)',
                    },
                    value: 'premium',
                },
                {
                    label: { de: 'Grid (Alle Sichtbar)', en: 'Grid (All visible)' },
                    value: 'grid',
                },
            ],
            admin: {
                description: {
                    de: 'Carousel: ein Talent mit Navigation. Grid: mehrere Talente in einer Reihe.',
                    en: 'Carousel: one talent with navigation. Grid: multiple talents in a row.',
                },
            },
        },
        {
            name: 'randomize',
            type: 'checkbox',
            label: { de: 'Zufällige Reihenfolge', en: 'Randomize order' },
            defaultValue: false,
            admin: {
                description: {
                    de: 'Wenn aktiviert, werden die Talente bei jedem Laden in zufälliger Reihenfolge angezeigt.',
                    en: 'If enabled, talents will be shown in a random order on every load.',
                },
            },
        },
        {
            name: 'size',
            type: 'select',
            label: { de: 'Größe', en: 'Size' },
            defaultValue: 'normal',
            options: [
                { label: { de: 'Normal', en: 'Normal' }, value: 'normal' },
                { label: { de: 'Hero (Groß)', en: 'Hero (Large)' }, value: 'hero' },
            ],
        },
        {
            name: 'talents',
            type: 'relationship',
            relationTo: 'talents',
            hasMany: true,
            maxRows: 8,
            label: {
                de: 'Talente (leer = automatisch Featured aus Collection)',
                en: 'Talents (empty = auto featured from collection)',
            },
            admin: {
                description: {
                    de: 'Optional: Bestimmte Talente wählen. Sonst werden automatisch alle als "Featured" markierten angezeigt.',
                    en: 'Optional: Select specific talents. Otherwise all "Featured" talents are shown automatically.',
                },
            },
        },
    ],
}
