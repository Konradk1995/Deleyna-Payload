import type { Block } from 'payload'

export const MapBlock: Block = {
    slug: 'map',
    interfaceName: 'MapBlock',
    imageURL: '/block-previews/map.svg',
    imageAltText: 'Embedded map block',
    labels: {
        singular: { de: 'Karte', en: 'Map' },
        plural: { de: 'Karten', en: 'Maps' },
    },
    fields: [
        {
            name: 'location',
            type: 'text',
            label: { de: 'Adresse / Ort', en: 'Address / Location' },
            required: true,
            admin: {
                description: {
                    de: 'Die zu zeigende Adresse (z.B. "Friedrichstraße 43, Berlin")',
                    en: 'The address to display (e.g. "Friedrichstraße 43, Berlin")',
                },
            },
        },
        {
            name: 'height',
            type: 'select',
            label: { de: 'Höhe', en: 'Height' },
            defaultValue: 'medium',
            options: [
                { label: { de: 'Klein (300px)', en: 'Small (300px)' }, value: 'small' },
                { label: { de: 'Mittel (450px)', en: 'Medium (450px)' }, value: 'medium' },
                { label: { de: 'Groß (600px)', en: 'Large (600px)' }, value: 'large' },
            ],
            admin: {
                width: '50%',
            },
        },
        {
            name: 'zoom',
            type: 'number',
            label: { de: 'Zoom Level', en: 'Zoom level' },
            defaultValue: 14,
            min: 1,
            max: 20,
            admin: {
                width: '50%',
            },
        },
        {
            name: 'title',
            type: 'text',
            label: { de: 'Titel (Optional)', en: 'Title (Optional)' },
            localized: true,
        },
    ],
}
