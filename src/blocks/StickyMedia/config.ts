import type { Block } from 'payload'
import { sectionHeaderFields } from '@/fields/sectionHeader'

export const StickyMedia: Block = {
    slug: 'stickyMedia',
    interfaceName: 'StickyMediaBlock',
    labels: {
        singular: {
            de: 'Vollbild-Scroll',
            en: 'Sticky media (fullscreen scroll)',
        },
        plural: { de: 'Vollbild-Scroll-Blöcke', en: 'Sticky media blocks' },
    },
    imageURL: '/block-previews/sticky-media.svg',
    imageAltText: 'Fullscreen sticky background with scroll-driven text animation.',
    fields: [
        ...sectionHeaderFields({ headingLevel: true, description: false }),
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
