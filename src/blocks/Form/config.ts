import type { Block } from 'payload'

import {
    FixedToolbarFeature,
    HeadingFeature,
    InlineToolbarFeature,
    lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { sectionHeaderFields } from '@/fields/sectionHeader'

export const FormBlock: Block = {
    slug: 'formBlock',
    interfaceName: 'FormBlock',
    imageURL: '/block-previews/form-block.svg',
    imageAltText: 'Form block with optional intro content',
    labels: {
        singular: { de: 'Formular-Block', en: 'Form block' },
        plural: { de: 'Formular-Blöcke', en: 'Form blocks' },
    },
    graphQL: {
        singularName: 'FormBlock',
    },
    fields: [
        {
            name: 'form',
            type: 'relationship',
            relationTo: 'forms',
            required: true,
            label: { de: 'Formular', en: 'Form' },
            admin: {
                description: {
                    de: 'Welches Formular angezeigt werden soll',
                    en: 'Which form to display',
                },
            },
        },
        ...sectionHeaderFields({ headingLevel: true }),
        {
            name: 'backgroundColor',
            type: 'select',
            label: { de: 'Hintergrundfarbe', en: 'Background colour' },
            defaultValue: 'white',
            options: [
                { label: { de: 'Weiß', en: 'White' }, value: 'white' },
                { label: { de: 'Hellgrau', en: 'Light gray' }, value: 'muted' },
            ],
            admin: {
                description: {
                    de: 'Hintergrundfarbe der Section',
                    en: 'Background colour of the section',
                },
            },
        },
        {
            name: 'enableIntro',
            type: 'checkbox',
            label: { de: 'Intro-Text anzeigen', en: 'Enable intro content' },
            admin: {
                description: {
                    de: 'Optionalen RichText-Block über dem Formular anzeigen',
                    en: 'Show optional RichText block above the form',
                },
            },
        },
        {
            name: 'introContent',
            type: 'richText',
            admin: {
                condition: (_, { enableIntro }) => Boolean(enableIntro),
                description: {
                    de: 'Freitext-Inhalt über dem Formular',
                    en: 'Free-form content above the form',
                },
            },
            editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                    return [
                        ...rootFeatures,
                        HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                        FixedToolbarFeature(),
                        InlineToolbarFeature(),
                    ]
                },
            }),
            label: { de: 'Intro-Text', en: 'Intro content' },
        },
    ],
}
