import type { Block } from 'payload'

export const ContentBlock: Block = {
    slug: 'content',
    interfaceName: 'ContentBlock',
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
            admin: {
                description: {
                    de: 'Breite des Inhaltsbereichs (Standard, Schmal, Breit oder Vollbreite)',
                    en: 'Width of the content area (Default, Narrow, Wide or Full width)',
                },
            },
        },
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
            name: 'content',
            type: 'richText',
            required: true,
            localized: true,
            admin: {
                description: {
                    de: 'Freitext-Inhalt mit Rich-Text-Formatierung',
                    en: 'Free-form content with rich text formatting',
                },
            },
        },
    ],
}
