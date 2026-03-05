import type { Block } from 'payload'

import {
    FixedToolbarFeature,
    InlineToolbarFeature,
    lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { link } from '@/fields/link'

export const InfoCards: Block = {
    slug: 'infoCards',
    interfaceName: 'InfoCardsBlock',
    imageURL: '/block-previews/info-cards.svg',
    imageAltText: 'Info Cards: 2 Intro-Karten, CTA mit 3 Boxen, lange Textbox',
    labels: {
        singular: { de: 'Info-Karten', en: 'Info cards' },
        plural: { de: 'Info-Karten', en: 'Info cards' },
    },
    fields: [
        {
            type: 'collapsible',
            label: {
                de: 'Obere 2 Karten (Headline + Text + CTA)',
                en: 'Top 2 cards (headline + text + CTA)',
            },
            admin: {
                description: {
                    de: 'Optional: zwei Spalten oben, z. B. "Technologiehaus..." und "Über 150 Gebäude..."',
                    en: 'Optional: two columns at top, e.g. "Tech house..." and "Over 150 buildings..."',
                },
            },
            fields: [
                {
                    name: 'topCards',
                    type: 'array',
                    maxRows: 2,
                    labels: {
                        singular: { de: 'Karte', en: 'Card' },
                        plural: { de: 'Karten', en: 'Cards' },
                    },
                    admin: {
                        description: {
                            de: 'Max. 2 Karten nebeneinander',
                            en: 'Max. 2 cards side by side',
                        },
                    },
                    fields: [
                        {
                            name: 'headline',
                            type: 'text',
                            required: true,
                            localized: true,
                            admin: { description: { de: 'Überschrift', en: 'Headline' } },
                        },
                        {
                            name: 'body',
                            type: 'textarea',
                            required: true,
                            localized: true,
                            admin: { description: { de: 'Fließtext', en: 'Body text' } },
                        },
                        link({
                            appearances: ['outline'],
                            overrides: {
                                localized: true,
                                required: false,
                                admin: {
                                    description: {
                                        de: 'CTA (Outline: weißer Hintergrund, schwarzer Rahmen wie im Bild)',
                                        en: 'CTA (Outline: white background, black border as in design)',
                                    },
                                },
                            },
                        }),
                    ],
                },
            ],
        },
        {
            name: 'sideMedia',
            type: 'upload',
            relationTo: 'media',
            admin: {
                description: {
                    de: 'Optionales Medium an der Seite des Hauptblocks',
                    en: 'Optional media on the side of the main block',
                },
            },
        },
        {
            name: 'backgroundColor',
            type: 'select',
            defaultValue: 'muted',
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
            name: 'tagline',
            type: 'text',
            localized: true,
            admin: {
                description: {
                    de: 'Kleines Label über der Überschrift, z. B. "WAS UNS AUSZEICHNET"',
                    en: 'Small label above the headline, e.g. "WHAT SETS US APART"',
                },
            },
        },
        {
            name: 'title',
            type: 'text',
            required: true,
            localized: true,
            admin: {
                description: {
                    de: 'Hauptüberschrift, z. B. "5+ Disziplinen. Ein Ziel."',
                    en: 'Main headline, e.g. "5+ disciplines. One goal."',
                },
            },
        },
        {
            name: 'cards',
            type: 'array',
            minRows: 1,
            maxRows: 6,
            required: true,
            labels: {
                singular: { de: 'Info-Karte', en: 'Info card' },
                plural: { de: 'Info-Karten', en: 'Info cards' },
            },
            admin: {
                description: {
                    de: 'Karten mit Icon, Titel, Kurzbeschreibung und optionalem Link (z. B. für "What We Offer")',
                    en: 'Cards with icon, title, short description and optional link (e.g. for "What We Offer")',
                },
            },
            fields: [
                {
                    name: 'icon',
                    type: 'upload',
                    relationTo: 'media',
                    admin: {
                        description: {
                            de: 'Icon oben in der Karte (SVG empfohlen)',
                            en: 'Icon at top of card (SVG recommended)',
                        },
                    },
                },
                {
                    name: 'title',
                    type: 'text',
                    required: true,
                    localized: true,
                    admin: {
                        description: {
                            de: 'Kartentitel, z. B. "Planungsqualität"',
                            en: 'Card title, e.g. "Planning quality"',
                        },
                    },
                },
                {
                    name: 'description',
                    type: 'text',
                    required: true,
                    localized: true,
                    admin: {
                        description: {
                            de: 'Kurzbeschreibung unter dem Titel',
                            en: 'Short description below the title',
                        },
                    },
                },
                link({
                    overrides: {
                        name: 'link',
                        label: { de: 'Link (optional)', en: 'Link (optional)' },
                        admin: {
                            description: {
                                de: 'Gesamte Karte wird klickbar (z. B. Services, Education, About)',
                                en: 'Entire card becomes clickable (e.g. Services, Education, About)',
                            },
                        },
                    },
                    optionalLink: true,
                }),
            ],
        },
        {
            name: 'contentBelowCards',
            type: 'richText',
            localized: true,
            editor: lexicalEditor({
                features: ({ rootFeatures }) => [
                    ...rootFeatures,
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                ],
            }),
            admin: {
                description: {
                    de: 'Optional. Nur ausfüllen, wenn zusätzlicher Text unter den Karten gewünscht ist – sonst leer lassen.',
                    en: 'Optional. Only fill in if additional text below the cards is desired – otherwise leave empty.',
                },
            },
        },
    ],
}
