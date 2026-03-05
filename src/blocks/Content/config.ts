import type { Block } from 'payload'

export const ContentBlock: Block = {
    slug: 'content',
    imageURL: '/block-previews/content.svg',
    imageAltText: 'Rich text content block with layout variants',
    labels: {
        singular: { de: 'Inhalt', en: 'Content' },
        plural: { de: 'Content-Blöcke', en: 'Content Blocks' },
    },
    fields: [
        {
            name: 'layout',
            type: 'select',
            defaultValue: 'default',
            options: [
                { label: { de: 'Standard', en: 'Default' }, value: 'default' },
                { label: { de: 'Schmal (für Artikel)', en: 'Narrow (for articles)' }, value: 'narrow' },
                { label: { de: 'Breit', en: 'Wide' }, value: 'wide' },
                { label: { de: 'Volle Breite', en: 'Full width' }, value: 'full' },
            ],
        },
        {
            name: 'backgroundColor',
            type: 'select',
            label: { de: 'Hintergrundfarbe', en: 'Background colour' },
            defaultValue: 'white',
            options: [
                { label: { de: 'Weiß', en: 'White' }, value: 'white' },
                { label: { de: 'Gedämpft', en: 'Muted' }, value: 'muted' },
            ],
        },
        {
            name: 'content',
            type: 'richText',
            required: true,
            localized: true,
        },
    ],
}
