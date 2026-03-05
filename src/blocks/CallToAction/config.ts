import type { Block } from 'payload'
import { link } from '../../fields'

export const CallToActionBlock: Block = {
    slug: 'cta',
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
        },
        {
            name: 'text',
            type: 'textarea',
            localized: true,
        },
        {
            name: 'backgroundImage',
            type: 'upload',
            relationTo: 'media',
            admin: {
                condition: (_, siblingData) => siblingData?.variant === 'background',
            },
        },
        link({ overrides: { name: 'button' } }),
    ],
}
