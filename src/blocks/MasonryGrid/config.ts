import type { Block } from 'payload'

import { link } from '@/fields/link'
import { sectionHeaderFields } from '@/fields/sectionHeader'

export const MasonryGrid: Block = {
    slug: 'masonryGrid',
    interfaceName: 'MasonryGridBlock',
    imageURL: '/block-previews/masonry-grid.svg',
    imageAltText: 'Masonry grid: four tiles with media, overlay or tabs',
    fields: [
        {
            name: 'variant',
            type: 'select',
            label: { de: 'Variante', en: 'Variant' },
            defaultValue: 'benefits',
            options: [
                { label: { de: 'Benefits Grid', en: 'Benefits grid' }, value: 'benefits' },
                {
                    label: { de: 'Zielgruppen Grid', en: 'Target audience grid' },
                    value: 'audience',
                },
            ],
        },
        ...sectionHeaderFields({ headingLevel: true, description: false }),
        {
            name: 'backgroundColor',
            type: 'select',
            label: { de: 'Hintergrundfarbe', en: 'Background color' },
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
                condition: (_, siblingData) => siblingData?.variant === 'benefits',
            },
        },
        {
            name: 'highlightCard',
            type: 'group',
            label: { de: 'Highlight-Karte', en: 'Highlight card' },
            admin: {
                description: { de: 'Primäre Feature-Karte', en: 'Primary feature card content' },
                condition: (_, siblingData) => siblingData?.variant === 'benefits',
            },
            fields: [
                {
                    name: 'title',
                    type: 'text',
                    label: { de: 'Titel', en: 'Title' },
                    localized: true,
                    required: true,
                },
                {
                    name: 'description',
                    type: 'textarea',
                    label: { de: 'Beschreibung', en: 'Description' },
                    localized: true,
                },
                {
                    name: 'textTone',
                    type: 'select',
                    enumName: 'tt',
                    label: { de: 'Text-Ton', en: 'Text tone' },
                    defaultValue: 'light',
                    options: [
                        { label: { de: 'Hell', en: 'Light' }, value: 'light' },
                        { label: { de: 'Dunkel', en: 'Dark' }, value: 'dark' },
                    ],
                },
                {
                    name: 'backgroundMedia',
                    type: 'upload',
                    label: { de: 'Hintergrundbild', en: 'Background media' },
                    relationTo: 'media',
                },
                link({
                    appearances: false,
                    optionalLink: true,
                    overrides: { label: { de: 'Karten-Link', en: 'Card link' } },
                }),
            ],
        },
        {
            name: 'tabsCard',
            type: 'group',
            label: { de: 'Tab-Karte', en: 'Tabs card' },
            admin: {
                description: { de: 'Karte mit Tab-Inhalten', en: 'Tabbed content card' },
                condition: (_, siblingData) => siblingData?.variant === 'benefits',
            },
            fields: [
                {
                    name: 'textTone',
                    type: 'select',
                    dbName: 'tt',
                    label: { de: 'Text-Ton', en: 'Text tone' },
                    defaultValue: 'dark',
                    options: [
                        { label: { de: 'Dunkel', en: 'Dark' }, value: 'dark' },
                        { label: { de: 'Hell', en: 'Light' }, value: 'light' },
                    ],
                },
                {
                    name: 'backgroundMedia',
                    type: 'upload',
                    label: { de: 'Hintergrundbild', en: 'Background media' },
                    relationTo: 'media',
                },
                {
                    name: 'tabs',
                    type: 'array',
                    label: { de: 'Tabs', en: 'Tabs' },
                    labels: {
                        singular: { de: 'Tab', en: 'Tab' },
                        plural: { de: 'Tabs', en: 'Tabs' },
                    },
                    minRows: 2,
                    required: true,
                    admin: {
                        components: {
                            RowLabel: '@/components/admin/RowLabels#TitleRowLabel',
                        },
                    },
                    fields: [
                        {
                            name: 'label',
                            type: 'text',
                            label: { de: 'Tab-Label', en: 'Tab label' },
                            required: true,
                            localized: true,
                        },
                        {
                            name: 'title',
                            type: 'text',
                            label: { de: 'Titel', en: 'Title' },
                            localized: true,
                        },
                        {
                            name: 'description',
                            type: 'textarea',
                            label: { de: 'Beschreibung', en: 'Description' },
                            localized: true,
                        },
                        link({
                            appearances: false,
                            optionalLink: true,
                            overrides: { label: { de: 'Tab-Link', en: 'Tab link' } },
                        }),
                    ],
                },
            ],
        },
        {
            name: 'cashflowCard',
            type: 'group',
            label: { de: 'Sekundäre Karte', en: 'Secondary card' },
            admin: {
                description: { de: 'Unterstützende Karte', en: 'Secondary supporting card' },
                condition: (_, siblingData) => siblingData?.variant === 'benefits',
            },
            fields: [
                {
                    name: 'title',
                    type: 'text',
                    label: { de: 'Titel', en: 'Title' },
                    localized: true,
                    required: true,
                },
                {
                    name: 'description',
                    type: 'textarea',
                    label: { de: 'Beschreibung', en: 'Description' },
                    localized: true,
                },
                {
                    name: 'textTone',
                    type: 'select',
                    dbName: 'tt',
                    label: { de: 'Text-Ton', en: 'Text tone' },
                    defaultValue: 'light',
                    options: [
                        { label: { de: 'Hell', en: 'Light' }, value: 'light' },
                        { label: { de: 'Dunkel', en: 'Dark' }, value: 'dark' },
                    ],
                },
                {
                    name: 'backgroundMedia',
                    type: 'upload',
                    label: { de: 'Hintergrundbild', en: 'Background media' },
                    relationTo: 'media',
                },
                link({
                    appearances: false,
                    optionalLink: true,
                    overrides: { label: { de: 'Karten-Link', en: 'Card link' } },
                }),
            ],
        },
        {
            name: 'videoCard',
            type: 'group',
            label: { de: 'Video-Karte', en: 'Video card' },
            admin: {
                description: {
                    de: 'Vollbreite Medien-Karte mit optionalem Play-Link',
                    en: 'Full-width media card with optional play link',
                },
                condition: (_, siblingData) => siblingData?.variant === 'benefits',
            },
            fields: [
                {
                    name: 'title',
                    type: 'text',
                    label: { de: 'Titel', en: 'Title' },
                    localized: true,
                    required: true,
                },
                {
                    name: 'description',
                    type: 'textarea',
                    label: { de: 'Beschreibung', en: 'Description' },
                    localized: true,
                },
                {
                    name: 'textTone',
                    type: 'select',
                    dbName: 'tt',
                    label: { de: 'Text-Ton', en: 'Text tone' },
                    defaultValue: 'light',
                    options: [
                        { label: { de: 'Hell', en: 'Light' }, value: 'light' },
                        { label: { de: 'Dunkel', en: 'Dark' }, value: 'dark' },
                    ],
                },
                {
                    name: 'backgroundMedia',
                    type: 'upload',
                    label: { de: 'Hintergrundbild', en: 'Background media' },
                    relationTo: 'media',
                },
                link({
                    appearances: false,
                    disableLabel: true,
                    optionalLink: true,
                    overrides: { label: { de: 'Play-Link', en: 'Play link' } },
                }),
            ],
        },
        {
            name: 'sectionTone',
            type: 'select',
            label: { de: 'Sektions-Ton', en: 'Section tone' },
            defaultValue: 'light',
            options: [
                { label: { de: 'Hell', en: 'Light' }, value: 'light' },
                { label: { de: 'Dunkel', en: 'Dark' }, value: 'dark' },
            ],
            admin: {
                description: {
                    de: 'Hintergrundton für die Zielgruppen-Sektion',
                    en: 'Background tone for the audience grid section',
                },
                condition: (_, siblingData) => siblingData?.variant === 'audience',
            },
        },
        {
            name: 'audienceCards',
            type: 'array',
            label: { de: 'Zielgruppen-Karten', en: 'Audience cards' },
            labels: {
                singular: { de: 'Karte', en: 'Card' },
                plural: { de: 'Karten', en: 'Cards' },
            },
            minRows: 4,
            maxRows: 4,
            required: true,
            admin: {
                description: {
                    de: 'Genau vier Karten für das Zielgruppen-Grid',
                    en: 'Add exactly four cards for the audience grid layout',
                },
                condition: (_, siblingData) => siblingData?.variant === 'audience',
                components: {
                    RowLabel: '@/components/admin/RowLabels#TitleRowLabel',
                },
            },
            fields: [
                {
                    name: 'title',
                    type: 'text',
                    label: { de: 'Titel', en: 'Title' },
                    localized: true,
                    required: true,
                },
                {
                    name: 'description',
                    type: 'textarea',
                    label: { de: 'Beschreibung', en: 'Description' },
                    localized: true,
                },
                {
                    name: 'backgroundMedia',
                    type: 'upload',
                    label: { de: 'Hintergrundbild', en: 'Background media' },
                    relationTo: 'media',
                },
                {
                    name: 'size',
                    type: 'select',
                    label: { de: 'Größe', en: 'Size' },
                    defaultValue: 'large',
                    options: [
                        { label: { de: 'Groß', en: 'Large' }, value: 'large' },
                        { label: { de: 'Mittel', en: 'Medium' }, value: 'medium' },
                    ],
                },
                {
                    name: 'theme',
                    type: 'select',
                    enumName: 'th',
                    label: { de: 'Theme', en: 'Theme' },
                    defaultValue: 'dark',
                    options: [
                        { label: { de: 'Dunkel', en: 'Dark' }, value: 'dark' },
                        { label: { de: 'Hell', en: 'Light' }, value: 'light' },
                    ],
                },
                {
                    name: 'linkStyle',
                    type: 'select',
                    label: { de: 'Link-Stil', en: 'Link style' },
                    enumName: 'ls',
                    defaultValue: 'default',
                    options: [
                        { label: { de: 'Standard', en: 'Default' }, value: 'default' },
                        { label: { de: 'Outline', en: 'Outline' }, value: 'outline' },
                    ],
                },
                link({
                    appearances: false,
                    optionalLink: true,
                    overrides: { label: { de: 'Karten-Link', en: 'Card link' } },
                }),
            ],
        },
    ],
    labels: {
        singular: { de: 'Kachel-Raster', en: 'Masonry grid' },
        plural: { de: 'Kachel-Raster', en: 'Masonry grids' },
    },
}
