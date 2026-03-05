import type { Block } from 'payload'

import {
    FixedToolbarFeature,
    InlineToolbarFeature,
    lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const LegalContent: Block = {
    slug: 'legalContent',
    interfaceName: 'LegalContentBlock',
    imageURL: '/block-previews/legal-content.svg',
    imageAltText: 'Rechtstext: Titel, Inhaltsverzeichnis und Absätze (z.B. Datenschutz, AGB)',
    labels: {
        singular: 'Rechtstext mit Inhaltsverzeichnis',
        plural: 'Rechtstexte (Datenschutz, AGB, …)',
    },
    fields: [
        {
            name: 'title',
            type: 'text',
            localized: true,
            admin: {
                description: 'Optionaler Seitentitel (z.B. "Datenschutz" oder "AGB")',
            },
        },
        {
            name: 'tocLabel',
            type: 'text',
            localized: true,
            defaultValue: 'Inhaltsverzeichnis',
            admin: {
                description:
                    'Überschrift über der linken Navigation (z.B. "Inhaltsverzeichnis" / "Table of contents")',
            },
        },
        {
            name: 'sections',
            type: 'array',
            minRows: 1,
            required: true,
            labels: {
                singular: 'Abschnitt',
                plural: 'Abschnitte',
            },
            fields: [
                {
                    name: 'heading',
                    type: 'text',
                    required: true,
                    localized: true,
                    admin: {
                        description:
                            'Überschrift des Abschnitts (erscheint im Inhaltsverzeichnis und über dem Text)',
                    },
                },
                {
                    name: 'content',
                    type: 'richText',
                    required: true,
                    localized: true,
                    editor: lexicalEditor({
                        features: ({ rootFeatures }) => [
                            ...rootFeatures,
                            FixedToolbarFeature(),
                            InlineToolbarFeature(),
                        ],
                    }),
                    admin: {
                        description: 'Inhalt des Abschnitts',
                    },
                },
            ],
            admin: {
                description: 'Nummerierte Abschnitte. Reihenfolge = Reihenfolge auf der Seite.',
            },
        },
        {
            name: 'dateLabel',
            type: 'text',
            localized: true,
            admin: {
                description: 'z.B. "Stand: Dezember 2024"',
            },
        },
    ],
}
