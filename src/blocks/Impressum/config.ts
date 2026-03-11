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
        singular: { de: 'Impressum', en: 'Imprint' },
        plural: { de: 'Impressum', en: 'Imprints' },
    },
    fields: [
        {
            type: 'collapsible',
            label: {
                de: 'Überschriften (optional – leer = deutsche Standard-Texte)',
                en: 'Headings (optional – empty = German defaults)',
            },
            admin: {
                description: {
                    de: 'Alle Überschriften sind pro Sprache editierbar. Leer lassen = Standard-Anzeige (DE).',
                    en: 'All headings are editable per language. Leave empty = default display (DE).',
                },
                initCollapsed: true,
            },
            fields: [
                {
                    name: 'headingCompany',
                    type: 'text',
                    localized: true,
                    admin: {
                        description: {
                            de: 'z.B. "Unternehmensangaben"',
                            en: 'e.g. "Company Information"',
                        },
                    },
                },
                {
                    name: 'headingContact',
                    type: 'text',
                    localized: true,
                    admin: {
                        description: {
                            de: 'z.B. "Kontakt"',
                            en: 'e.g. "Contact"',
                        },
                    },
                },
                {
                    name: 'headingRepresentatives',
                    type: 'text',
                    localized: true,
                    admin: {
                        description: {
                            de: 'z.B. "Vertretungsberechtigte"',
                            en: 'e.g. "Authorized Representatives"',
                        },
                    },
                },
                {
                    name: 'headingRegister',
                    type: 'text',
                    localized: true,
                    admin: {
                        description: {
                            de: 'z.B. "Registereintrag"',
                            en: 'e.g. "Register Entry"',
                        },
                    },
                },
                {
                    name: 'headingContentResponsible',
                    type: 'text',
                    localized: true,
                    admin: {
                        description: {
                            de: 'z.B. "Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV"',
                            en: 'e.g. "Responsible for content according to § 55 para. 2 RStV"',
                        },
                    },
                },
                {
                    name: 'headingDisclaimer',
                    type: 'text',
                    localized: true,
                    admin: {
                        description: {
                            de: 'z.B. "Haftungsausschluss"',
                            en: 'e.g. "Disclaimer"',
                        },
                    },
                },
                {
                    name: 'headingLiabilityContent',
                    type: 'text',
                    localized: true,
                    admin: {
                        description: {
                            de: 'z.B. "Haftung für Inhalte"',
                            en: 'e.g. "Liability for Content"',
                        },
                    },
                },
                {
                    name: 'headingLiabilityLinks',
                    type: 'text',
                    localized: true,
                    admin: {
                        description: {
                            de: 'z.B. "Haftung für Links"',
                            en: 'e.g. "Liability for Links"',
                        },
                    },
                },
                {
                    name: 'headingCopyright',
                    type: 'text',
                    localized: true,
                    admin: {
                        description: {
                            de: 'z.B. "Urheberrecht"',
                            en: 'e.g. "Copyright"',
                        },
                    },
                },
                {
                    name: 'headingEuDispute',
                    type: 'text',
                    localized: true,
                    admin: {
                        description: {
                            de: 'z.B. "EU-Streitschlichtung"',
                            en: 'e.g. "EU Dispute Resolution"',
                        },
                    },
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
                    label: { de: 'Firmenname', en: 'Company name' },
                    admin: {
                        description: {
                            de: 'Unternehmensangaben – Firmenname',
                            en: 'Company information – company name',
                        },
                        width: '50%',
                    },
                },
                {
                    name: 'street',
                    type: 'text',
                    required: true,
                    localized: true,
                    label: { de: 'Straße', en: 'Street' },
                    admin: {
                        description: {
                            de: 'Straße und Hausnummer',
                            en: 'Street and house number',
                        },
                        width: '50%',
                    },
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
                    label: { de: 'PLZ', en: 'Postal code' },
                    admin: {
                        description: {
                            de: 'Postleitzahl',
                            en: 'Postal code',
                        },
                        width: '25%',
                    },
                },
                {
                    name: 'city',
                    type: 'text',
                    required: true,
                    localized: true,
                    label: { de: 'Ort', en: 'City' },
                    admin: {
                        description: {
                            de: 'Ort / Stadt',
                            en: 'City / town',
                        },
                        width: '25%',
                    },
                },
                {
                    name: 'country',
                    type: 'text',
                    required: true,
                    localized: true,
                    defaultValue: 'Deutschland',
                    label: { de: 'Land', en: 'Country' },
                    admin: {
                        description: {
                            de: 'Land',
                            en: 'Country',
                        },
                        width: '50%',
                    },
                },
            ],
        },
        {
            type: 'collapsible',
            label: { de: 'Kontakt', en: 'Contact' },
            admin: { initCollapsed: false },
            fields: [
                {
                    name: 'phone',
                    type: 'text',
                    localized: true,
                    label: { de: 'Telefon', en: 'Phone' },
                    admin: {
                        description: {
                            de: 'Telefonnummer (z.B. +49 30 123 456 789)',
                            en: 'Phone number (e.g. +49 30 123 456 789)',
                        },
                    },
                },
                {
                    name: 'email',
                    type: 'email',
                    localized: true,
                    label: { de: 'E-Mail', en: 'Email' },
                    admin: {
                        description: {
                            de: 'E-Mail-Adresse',
                            en: 'Email address',
                        },
                    },
                },
                {
                    name: 'website',
                    type: 'text',
                    localized: true,
                    label: { de: 'Website', en: 'Website' },
                    admin: {
                        description: {
                            de: 'Website (z.B. www.deleyna.com)',
                            en: 'Website (e.g. www.deleyna.com)',
                        },
                    },
                },
            ],
        },
        {
            type: 'collapsible',
            label: { de: 'Vertretungsberechtigte', en: 'Authorized Representatives' },
            admin: { initCollapsed: false },
            fields: [
                {
                    name: 'representativesLabel',
                    type: 'text',
                    defaultValue: 'Geschäftsführer:',
                    localized: true,
                    label: { de: 'Bezeichnung', en: 'Label' },
                    admin: {
                        description: {
                            de: 'Überschrift (z.B. Geschäftsführer:)',
                            en: 'Label (e.g. Managing Director:)',
                        },
                    },
                },
                {
                    name: 'representativesNames',
                    type: 'array',
                    minRows: 1,
                    labels: { singular: { de: 'Name', en: 'Name' }, plural: { de: 'Namen', en: 'Names' } },
                    fields: [
                        {
                            name: 'name',
                            type: 'text',
                            required: true,
                            localized: true,
                        },
                    ],
                    admin: {
                        description: {
                            de: 'Namen der vertretungsberechtigten Personen',
                            en: 'Names of authorized representatives',
                        },
                        components: {
                            RowLabel: '@/components/admin/RowLabels#TitleRowLabel',
                        },
                    },
                },
            ],
        },
        {
            type: 'collapsible',
            label: { de: 'Registereintrag', en: 'Register Entry' },
            admin: { initCollapsed: false },
            fields: [
                {
                    name: 'registerCourt',
                    type: 'text',
                    localized: true,
                    label: { de: 'Registergericht', en: 'Register court' },
                    admin: {
                        description: {
                            de: 'Registergericht (z.B. Amtsgericht Charlottenburg)',
                            en: 'Register court (e.g. Amtsgericht Charlottenburg)',
                        },
                    },
                },
                {
                    name: 'registerNumber',
                    type: 'text',
                    localized: true,
                    label: { de: 'Registernummer', en: 'Register number' },
                    admin: {
                        description: {
                            de: 'Registernummer (z.B. HRB 123456 B)',
                            en: 'Register number (e.g. HRB 123456 B)',
                        },
                    },
                },
                {
                    name: 'vatId',
                    type: 'text',
                    localized: true,
                    label: { de: 'USt-IdNr.', en: 'VAT ID' },
                    admin: {
                        description: {
                            de: 'USt-IdNr. (z.B. DE123456789)',
                            en: 'VAT ID (e.g. DE123456789)',
                        },
                    },
                },
            ],
        },
        {
            type: 'collapsible',
            label: {
                de: 'Verantwortlich für den Inhalt (§ 55 Abs. 2 RStV)',
                en: 'Responsible for content (§ 55 para. 2 RStV)',
            },
            admin: { initCollapsed: false },
            fields: [
                {
                    name: 'contentResponsibleName',
                    type: 'text',
                    required: true,
                    localized: true,
                    label: { de: 'Name', en: 'Name' },
                    admin: {
                        description: {
                            de: 'Name der verantwortlichen Person (Adresse wird aus Unternehmensangaben übernommen)',
                            en: 'Name of responsible person (address is taken from company info)',
                        },
                    },
                },
            ],
        },
        {
            type: 'collapsible',
            label: { de: 'Haftungsausschluss', en: 'Disclaimer' },
            admin: { initCollapsed: false },
            fields: [
                {
                    name: 'liabilityContent',
                    type: 'richText',
                    localized: true,
                    label: { de: 'Haftung für Inhalte', en: 'Liability for content' },
                    editor: lexicalEditor({
                        features: ({ rootFeatures }) => [
                            ...rootFeatures,
                            FixedToolbarFeature(),
                            InlineToolbarFeature(),
                        ],
                    }),
                    admin: {
                        description: {
                            de: 'Haftung für Inhalte',
                            en: 'Liability for content',
                        },
                    },
                },
                {
                    name: 'liabilityLinks',
                    type: 'richText',
                    localized: true,
                    label: { de: 'Haftung für Links', en: 'Liability for links' },
                    editor: lexicalEditor({
                        features: ({ rootFeatures }) => [
                            ...rootFeatures,
                            FixedToolbarFeature(),
                            InlineToolbarFeature(),
                        ],
                    }),
                    admin: {
                        description: {
                            de: 'Haftung für Links',
                            en: 'Liability for links',
                        },
                    },
                },
                {
                    name: 'copyright',
                    type: 'richText',
                    localized: true,
                    label: { de: 'Urheberrecht', en: 'Copyright' },
                    editor: lexicalEditor({
                        features: ({ rootFeatures }) => [
                            ...rootFeatures,
                            FixedToolbarFeature(),
                            InlineToolbarFeature(),
                        ],
                    }),
                    admin: {
                        description: {
                            de: 'Urheberrecht',
                            en: 'Copyright',
                        },
                    },
                },
            ],
        },
        {
            type: 'collapsible',
            label: { de: 'EU-Streitschlichtung', en: 'EU Dispute Resolution' },
            admin: { initCollapsed: false },
            fields: [
                {
                    name: 'euDisputeIntro',
                    type: 'richText',
                    localized: true,
                    label: { de: 'Einleitung', en: 'Introduction' },
                    editor: lexicalEditor({
                        features: ({ rootFeatures }) => [
                            ...rootFeatures,
                            FixedToolbarFeature(),
                            InlineToolbarFeature(),
                        ],
                    }),
                    admin: {
                        description: {
                            de: 'Einleitungstext zur ODR-Plattform',
                            en: 'Introduction text about the ODR platform',
                        },
                    },
                },
                {
                    name: 'euDisputeUrl',
                    type: 'text',
                    defaultValue: 'https://ec.europa.eu/consumers/odr/',
                    label: { de: 'Plattform-URL', en: 'Platform URL' },
                    admin: {
                        description: {
                            de: 'URL der EU-Streitschlichtungsplattform',
                            en: 'URL of the EU dispute resolution platform',
                        },
                    },
                },
                {
                    name: 'euDisputeClosing',
                    type: 'richText',
                    localized: true,
                    label: { de: 'Schlusstext', en: 'Closing text' },
                    editor: lexicalEditor({
                        features: ({ rootFeatures }) => [
                            ...rootFeatures,
                            FixedToolbarFeature(),
                            InlineToolbarFeature(),
                        ],
                    }),
                    admin: {
                        description: {
                            de: 'Schlusstext (E-Mail im Impressum, keine Verpflichtung zur Teilnahme)',
                            en: 'Closing text (email in imprint, no obligation to participate)',
                        },
                    },
                },
            ],
        },
        {
            name: 'dateLabel',
            type: 'text',
            localized: true,
            label: { de: 'Stand', en: 'Last updated' },
            admin: {
                description: {
                    de: 'z.B. "Stand: Dezember 2024"',
                    en: 'e.g. "Last updated: December 2024"',
                },
            },
        },
    ],
}
