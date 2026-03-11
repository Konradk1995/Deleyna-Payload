import type { Block } from 'payload'
import { sectionHeaderFields } from '@/fields/sectionHeader'

export const LogoGrid: Block = {
    slug: 'logoGrid',
    interfaceName: 'LogoGridBlock',
    imageURL: '/block-previews/logo-grid.svg',
    imageAltText: 'Logo grid for clients and partners',
    labels: {
        singular: { de: 'Logo-Raster', en: 'Logo grid' },
        plural: { de: 'Logo-Raster', en: 'Logo grids' },
    },
    fields: [
        ...sectionHeaderFields({ headingLevel: true, description: false, titleHighlight: false }),
        {
            name: 'backgroundColor',
            type: 'select',
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
            },
        },
        {
            name: 'variant',
            type: 'select',
            defaultValue: 'logos',
            options: [
                { label: { de: 'Logo-Bilder', en: 'Logo images' }, value: 'logos' },
                { label: { de: 'Nur Text', en: 'Text only' }, value: 'text' },
            ],
            admin: {
                description: {
                    de: 'Darstellungsart: Logos als Bilder oder nur als Textnamen',
                    en: 'Display style: logos as images or text names only',
                },
            },
        },
        {
            name: 'clients',
            type: 'array',
            minRows: 1,
            labels: {
                singular: { de: 'Kunde', en: 'Client' },
                plural: { de: 'Kunden', en: 'Clients' },
            },
            admin: {
                components: {
                    RowLabel: '@/components/admin/RowLabels#TitleRowLabel',
                },
            },
            fields: [
                {
                    name: 'name',
                    type: 'text',
                    required: true,
                    label: { de: 'Name', en: 'Name' },
                    admin: {
                        description: {
                            de: 'Name des Kunden oder Partners',
                            en: 'Client or partner name',
                        },
                    },
                },
                {
                    name: 'logo',
                    type: 'upload',
                    relationTo: 'media',
                    label: { de: 'Logo', en: 'Logo' },
                    admin: {
                        description: {
                            de: 'Logo-Bild (empfohlen: SVG oder transparentes PNG)',
                            en: 'Logo image (recommended: SVG or transparent PNG)',
                        },
                    },
                },
                {
                    name: 'link',
                    type: 'text',
                    label: { de: 'Link (optional)', en: 'Link (optional)' },
                    admin: {
                        description: {
                            de: 'Optionaler Link zur Website des Kunden',
                            en: 'Optional link to the client website',
                        },
                    },
                },
            ],
        },
    ],
}
