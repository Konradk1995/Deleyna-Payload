import type { Block } from 'payload'

import {
    FixedToolbarFeature,
    HeadingFeature,
    InlineToolbarFeature,
    lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const FormBlock: Block = {
    slug: 'formBlock',
    interfaceName: 'FormBlock',
    imageURL: '/block-previews/form-block.svg',
    imageAltText: 'Form block with optional intro content',
    fields: [
        {
            name: 'form',
            type: 'relationship',
            relationTo: 'forms',
            required: true,
        },
        {
            name: 'overline',
            type: 'text',
            localized: true,
            label: { de: 'Overline (optional)', en: 'Overline (optional)' },
        },
        {
            name: 'titleLine1',
            type: 'text',
            localized: true,
            label: { de: 'Headline (optional)', en: 'Headline (optional)' },
        },
        {
            name: 'titleHighlight',
            type: 'text',
            localized: true,
            label: { de: 'Headline Highlight (optional)', en: 'Headline highlight (optional)' },
        },
        {
            name: 'description',
            type: 'textarea',
            localized: true,
            label: { de: 'Beschreibung (optional)', en: 'Description (optional)' },
        },
        {
            name: 'enableIntro',
            type: 'checkbox',
            label: { de: 'Intro-Text anzeigen', en: 'Enable intro content' },
        },
        {
            name: 'introContent',
            type: 'richText',
            admin: {
                condition: (_, { enableIntro }) => Boolean(enableIntro),
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
    graphQL: {
        singularName: 'FormBlock',
    },
    labels: {
        singular: { de: 'Formular-Block', en: 'Form block' },
        plural: { de: 'Formular-Blöcke', en: 'Form blocks' },
    },
}
