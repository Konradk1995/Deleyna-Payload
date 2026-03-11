import type { Block } from 'payload'
import { link } from '../../fields'

export const CallToActionBlock: Block = {
    slug: 'cta',
    interfaceName: 'CallToActionBlock',
    imageURL: '/block-previews/cta.svg',
    imageAltText: 'Call to action with headline and button',
    labels: {
        singular: { de: 'Call to Action', en: 'Call to Action' },
        plural: { de: 'Call to Actions', en: 'Call to Actions' },
    },
    fields: [
        {
            name: 'variant',
            type: 'select',
            defaultValue: 'default',
            label: { de: 'Variante', en: 'Variant' },
            options: [
                { label: { de: 'Standard', en: 'Default' }, value: 'default' },
                { label: { de: 'Mit Hintergrund', en: 'With background' }, value: 'background' },
                {
                    label: { de: 'Geteilt (Medium + Text)', en: 'Split (Media + Text)' },
                    value: 'split',
                },
                { label: { de: 'Inline Banner', en: 'Inline banner' }, value: 'banner' },
            ],
        },
        {
            name: 'media',
            type: 'upload',
            relationTo: 'media',
            label: { de: 'Medium', en: 'Media' },
            admin: {
                condition: (_, siblingData) =>
                    ['background', 'split'].includes(siblingData?.variant),
                description: {
                    de: 'Hintergrundbild oder seitliches Medium',
                    en: 'Background image or side media',
                },
            },
        },
        {
            name: 'headline',
            type: 'text',
            required: true,
            localized: true,
            label: { de: 'Überschrift', en: 'Headline' },
            admin: {
                description: {
                    de: 'Hauptüberschrift des CTA-Blocks',
                    en: 'Main headline of the CTA block',
                },
            },
        },
        {
            name: 'text',
            type: 'textarea',
            localized: true,
            label: { de: 'Text', en: 'Text' },
            admin: {
                description: {
                    de: 'Optionaler Beschreibungstext unter der Überschrift',
                    en: 'Optional description text below the headline',
                },
            },
        },
        {
            name: 'backgroundImage',
            type: 'upload',
            relationTo: 'media',
            label: { de: 'Hintergrundbild', en: 'Background image' },
            admin: {
                condition: (_, siblingData) => siblingData?.variant === 'background',
                description: {
                    de: 'Hintergrundbild (nur bei Variante "Mit Hintergrund")',
                    en: 'Background image (only for "With background" variant)',
                },
            },
        },
        link({ overrides: { name: 'button' } }),
    ],
}
