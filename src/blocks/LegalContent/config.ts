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
        singular: { de: 'Rechtstext', en: 'Legal text' },
        plural: { de: 'Rechtstexte', en: 'Legal texts' },
    },
    fields: [
        {
            name: 'title',
            type: 'text',
            localized: true,
            admin: {
                description: { de: 'Optionaler Seitentitel (z.B. "Datenschutz" oder "AGB")', en: 'Optional page title (e.g. "Privacy Policy" or "Terms")' },
            },
        },
        {
            name: 'tocLabel',
            type: 'text',
            localized: true,
            defaultValue: 'Inhaltsverzeichnis',
            admin: {
                description: {
                    de: 'Überschrift über der linken Navigation (z.B. "Inhaltsverzeichnis")',
                    en: 'Heading above the left navigation (e.g. "Table of contents")',
                },
            },
        },
        {
            name: 'sections',
            type: 'array',
            minRows: 1,
            required: true,
            labels: {
                singular: { de: 'Abschnitt', en: 'Section' },
                plural: { de: 'Abschnitte', en: 'Sections' },
            },
            fields: [
                {
                    name: 'heading',
                    type: 'text',
                    required: true,
                    localized: true,
                    admin: {
                        description: {
                            de: 'Überschrift des Abschnitts (erscheint im Inhaltsverzeichnis und über dem Text)',
                            en: 'Section heading (appears in table of contents and above the text)',
                        },
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
                        description: { de: 'Inhalt des Abschnitts', en: 'Section content' },
                    },
                },
            ],
            admin: {
                description: { de: 'Nummerierte Abschnitte. Reihenfolge = Reihenfolge auf der Seite.', en: 'Numbered sections. Order = order on the page.' },
                components: {
                    RowLabel: '@/components/admin/RowLabels#TitleRowLabel',
                },
            },
        },
        {
            name: 'dateLabel',
            type: 'text',
            localized: true,
            admin: {
                description: { de: 'z.B. "Stand: Dezember 2024"', en: 'e.g. "As of: December 2024"' },
            },
        },
    ],
}
