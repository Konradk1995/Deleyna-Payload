import type { Block } from 'payload'
import { sectionHeaderFields } from '@/fields/sectionHeader'

export const FeaturedTalentsBlock: Block = {
    slug: 'featuredTalents',
    interfaceName: 'FeaturedTalentsBlock',
    imageURL: '/block-previews/featured-talents.svg',
    imageAltText: 'Featured talents carousel or grid',
    labels: {
        singular: { de: 'Talente im Fokus', en: 'Featured talents' },
        plural: { de: 'Talente im Fokus', en: 'Featured talents' },
    },
    fields: [
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
