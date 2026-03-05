import type { Block } from 'payload'

import {
    FixedToolbarFeature,
    InlineToolbarFeature,
    lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const Impressum: Block = {
    slug: 'impressum',
    interfaceName: 'ImpressumBlock',
    imageURL: '/block-previews/impressum.svg',
    imageAltText: 'Impressum: Unternehmensangaben, Anschrift, Kontakt, Vertretung',
    labels: {
        singular: 'Impressum',
        plural: 'Impressum',
    },
    fields: [
        {
            type: 'collapsible',
            label: 'Überschriften (optional – leer = deutsche Standard-Texte)',
            admin: {
                description:
                    'Alle Überschriften sind pro Sprache editierbar. Leer lassen = Standard-Anzeige (DE).',
                initCollapsed: true,
            },
            fields: [
                {
                    name: 'headingCompany',
                    type: 'text',
                    localized: true,
                    admin: { description: 'z.B. "Unternehmensangaben" / "Company Information"' },
                },
                {
                    name: 'headingContact',
                    type: 'text',
                    localized: true,
                    admin: { description: 'z.B. "Kontakt" / "Contact"' },
                },
                {
                    name: 'headingRepresentatives',
                    type: 'text',
                    localized: true,
                    admin: {
                        description: 'z.B. "Vertretungsberechtigte" / "Authorized Representatives"',
                    },
                },
                {
                    name: 'headingRegister',
                    type: 'text',
                    localized: true,
                    admin: { description: 'z.B. "Registereintrag" / "Register Entry"' },
                },
                {
                    name: 'headingContentResponsible',
                    type: 'text',
                    localized: true,
                    admin: {
                        description:
                            'z.B. "Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV" (langer Titel)',
                    },
                },
                {
                    name: 'headingDisclaimer',
                    type: 'text',
                    localized: true,
                    admin: { description: 'z.B. "Haftungsausschluss" / "Disclaimer"' },
                },
                {
                    name: 'headingLiabilityContent',
                    type: 'text',
                    localized: true,
                    admin: { description: 'z.B. "Haftung für Inhalte" / "Liability for Content"' },
                },
                {
                    name: 'headingLiabilityLinks',
                    type: 'text',
                    localized: true,
                    admin: { description: 'z.B. "Haftung für Links" / "Liability for Links"' },
                },
                {
                    name: 'headingCopyright',
                    type: 'text',
                    localized: true,
                    admin: { description: 'z.B. "Urheberrecht" / "Copyright"' },
                },
                {
                    name: 'headingEuDispute',
                    type: 'text',
                    localized: true,
                    admin: { description: 'z.B. "EU-Streitschlichtung" / "EU Dispute Resolution"' },
                },
            ],
        },
        {
            type: 'row',
            fields: [
                {
                    name: 'companyName',
                    type: 'text',
                    required: true,
                    localized: true,
                    admin: { description: 'Unternehmensangaben – Firmenname', width: '50%' },
                },
                {
                    name: 'street',
                    type: 'text',
                    required: true,
                    localized: true,
                    admin: { description: 'Straße und Hausnummer', width: '50%' },
                },
            ],
        },
        {
            type: 'row',
            fields: [
                {
                    name: 'postalCode',
                    type: 'text',
                    required: true,
                    localized: true,
                    admin: { description: 'PLZ', width: '25%' },
                },
                {
                    name: 'city',
                    type: 'text',
                    required: true,
                    localized: true,
                    admin: { description: 'Ort', width: '25%' },
                },
                {
                    name: 'country',
                    type: 'text',
                    required: true,
                    localized: true,
                    defaultValue: 'Deutschland',
                    admin: { description: 'Land', width: '50%' },
                },
            ],
        },
        {
            type: 'collapsible',
            label: 'Kontakt',
            admin: { initCollapsed: false },
            fields: [
                {
                    name: 'phone',
                    type: 'text',
                    localized: true,
                    admin: { description: 'Telefon (z.B. +49 30 123 456 789)' },
                },
                {
                    name: 'email',
                    type: 'email',
                    localized: true,
                    admin: { description: 'E-Mail' },
                },
                {
                    name: 'website',
                    type: 'text',
                    localized: true,
                    admin: { description: 'Website (z.B. www.weess.energy)' },
                },
            ],
        },
        {
            type: 'collapsible',
            label: 'Vertretungsberechtigte',
            admin: { initCollapsed: false },
            fields: [
                {
                    name: 'representativesLabel',
                    type: 'text',
                    defaultValue: 'Geschäftsführer:',
                    localized: true,
                    admin: { description: 'Überschrift (z.B. Geschäftsführer:)' },
                },
                {
                    name: 'representativesNames',
                    type: 'array',
                    minRows: 1,
                    labels: { singular: 'Name', plural: 'Namen' },
                    fields: [
                        {
                            name: 'name',
                            type: 'text',
                            required: true,
                            localized: true,
                        },
                    ],
                    admin: { description: 'Namen der vertretungsberechtigten Personen' },
                },
            ],
        },
        {
            type: 'collapsible',
            label: 'Registereintrag',
            admin: { initCollapsed: false },
            fields: [
                {
                    name: 'registerCourt',
                    type: 'text',
                    localized: true,
                    admin: { description: 'Registergericht (z.B. Amtsgericht Charlottenburg)' },
                },
                {
                    name: 'registerNumber',
                    type: 'text',
                    localized: true,
                    admin: { description: 'Registernummer (z.B. HRB 123456 B)' },
                },
                {
                    name: 'vatId',
                    type: 'text',
                    localized: true,
                    admin: { description: 'USt-IdNr. (z.B. DE123456789)' },
                },
            ],
        },
        {
            type: 'collapsible',
            label: 'Verantwortlich für den Inhalt (§ 55 Abs. 2 RStV)',
            admin: { initCollapsed: false },
            fields: [
                {
                    name: 'contentResponsibleName',
                    type: 'text',
                    required: true,
                    localized: true,
                    admin: {
                        description:
                            'Name der verantwortlichen Person (Adresse wird aus Unternehmensangaben übernommen)',
                    },
                },
            ],
        },
        {
            type: 'collapsible',
            label: 'Haftungsausschluss',
            admin: { initCollapsed: false },
            fields: [
                {
                    name: 'liabilityContent',
                    type: 'richText',
                    localized: true,
                    editor: lexicalEditor({
                        features: ({ rootFeatures }) => [
                            ...rootFeatures,
                            FixedToolbarFeature(),
                            InlineToolbarFeature(),
                        ],
                    }),
                    admin: { description: 'Haftung für Inhalte' },
                },
                {
                    name: 'liabilityLinks',
                    type: 'richText',
                    localized: true,
                    editor: lexicalEditor({
                        features: ({ rootFeatures }) => [
                            ...rootFeatures,
                            FixedToolbarFeature(),
                            InlineToolbarFeature(),
                        ],
                    }),
                    admin: { description: 'Haftung für Links' },
                },
                {
                    name: 'copyright',
                    type: 'richText',
                    localized: true,
                    editor: lexicalEditor({
                        features: ({ rootFeatures }) => [
                            ...rootFeatures,
                            FixedToolbarFeature(),
                            InlineToolbarFeature(),
                        ],
                    }),
                    admin: { description: 'Urheberrecht' },
                },
            ],
        },
        {
            type: 'collapsible',
            label: 'EU-Streitschlichtung',
            admin: { initCollapsed: false },
            fields: [
                {
                    name: 'euDisputeIntro',
                    type: 'richText',
                    localized: true,
                    editor: lexicalEditor({
                        features: ({ rootFeatures }) => [
                            ...rootFeatures,
                            FixedToolbarFeature(),
                            InlineToolbarFeature(),
                        ],
                    }),
                    admin: { description: 'Einleitungstext zur ODR-Plattform' },
                },
                {
                    name: 'euDisputeUrl',
                    type: 'text',
                    defaultValue: 'https://ec.europa.eu/consumers/odr/',
                    admin: { description: 'URL der EU-Streitschlichtungsplattform' },
                },
                {
                    name: 'euDisputeClosing',
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
                        description:
                            'Schlusstext (E-Mail im Impressum, keine Verpflichtung zur Teilnahme)',
                    },
                },
            ],
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
