import type { Block } from 'payload'

export const StickyMedia: Block = {
    slug: 'stickyMedia',
    interfaceName: 'StickyMediaBlock',
    labels: {
        singular: {
            de: 'Sticky Media (Fullscreen-Scroll)',
            en: 'Sticky media (fullscreen scroll)',
        },
        plural: { de: 'Sticky-Media-Blöcke', en: 'Sticky media blocks' },
    },
    imageURL: '/block-previews/sticky-media.svg',
    imageAltText: 'Fullscreen sticky background with scroll-driven text animation.',
    fields: [
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
                    de: 'Hintergrundfarbe der Section (angepasst an Dark/Light Mode)',
                    en: 'Section background colour (adapts to dark mode)',
                },
            },
        },
        {
            name: 'badge',
            type: 'text',
            localized: true,
            admin: {
                description: {
                    de: 'Optionales Badge/Tagline über der Überschrift (z.B. "EINLEITUNG").',
                    en: 'Optional badge/tagline above the headline (e.g. "EINLEITUNG").',
                },
            },
        },
        {
            name: 'headline',
            type: 'text',
            localized: true,
            admin: {
                description: {
                    de: 'Hauptüberschrift (H2). Leer lassen zum Ausblenden.',
                    en: 'Main headline (H2). Leave empty to hide.',
                },
            },
        },
        {
            name: 'headlineHighlight',
            type: 'text',
            localized: true,
            admin: {
                description: {
                    de: 'Wort oder Phrase in der Überschrift in Akzentfarbe hervorheben.',
                    en: 'Word or phrase in the headline to highlight in accent colour.',
                },
            },
        },
        {
            name: 'subtitle',
            type: 'textarea',
            localized: true,
            admin: {
                description: {
                    de: 'Text unter der Überschrift. Scrollt im Star-Wars-Stil.',
                    en: 'Text below the headline. Scrolls in Star Wars style.',
                },
            },
        },
        {
            name: 'media',
            type: 'upload',
            relationTo: 'media',
            required: true,
            admin: {
                description: {
                    de: 'Hintergrundbild oder -video (Fullscreen, sticky).',
                    en: 'Background image or video (fullscreen, sticky).',
                },
            },
        },
        {
            name: 'overlayOpacity',
            type: 'select',
            defaultValue: '50',
            options: [
                { label: { de: '0% (kein Overlay)', en: '0% (no overlay)' }, value: '0' },
                { label: { de: '10%', en: '10%' }, value: '10' },
                { label: { de: '20%', en: '20%' }, value: '20' },
                { label: { de: '30%', en: '30%' }, value: '30' },
                { label: { de: '40%', en: '40%' }, value: '40' },
                { label: { de: '50%', en: '50%' }, value: '50' },
                { label: { de: '60%', en: '60%' }, value: '60' },
                { label: { de: '70%', en: '70%' }, value: '70' },
                { label: { de: '80%', en: '80%' }, value: '80' },
            ],
            admin: {
                description: {
                    de: 'Hintergrund abdunkeln für bessere Lesbarkeit.',
                    en: 'Darken the background for better text readability.',
                },
            },
        },
    ],
}
