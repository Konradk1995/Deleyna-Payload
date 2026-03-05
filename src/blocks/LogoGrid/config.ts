import type { Block } from 'payload'

export const LogoGrid: Block = {
    slug: 'logoGrid',
    interfaceName: 'LogoGridBlock',
    imageURL: '/block-previews/logo-grid.svg',
    imageAltText: 'Logo grid for clients and partners',
    labels: {
        singular: { de: 'Logo Grid', en: 'Logo grid' },
        plural: { de: 'Logo Grids', en: 'Logo grids' },
    },
    fields: [
        {
            name: 'variant',
            type: 'select',
            defaultValue: 'logos',
            options: [
                { label: { de: 'Logo-Bilder', en: 'Logo images' }, value: 'logos' },
                { label: { de: 'Nur Text', en: 'Text only' }, value: 'text' },
            ],
        },
        {
            name: 'headline',
            type: 'text',
            localized: true,
            admin: {
                description: {
                    de: 'Optionale Überschrift, z. B. „Trusted by“',
                    en: 'Optional headline, e.g. "Trusted by"',
                },
            },
        },
        {
            name: 'clients',
            type: 'array',
            minRows: 1,
            fields: [
                {
                    name: 'name',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'logo',
                    type: 'upload',
                    relationTo: 'media',
                },
                {
                    name: 'link',
                    type: 'text',
                    label: { de: 'Link (optional)', en: 'Link (optional)' },
                },
            ],
        },
    ],
}
