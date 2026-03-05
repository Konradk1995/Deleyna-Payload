import type { Block } from 'payload'

const iconOptions = [
    { label: { de: 'Users', en: 'Users' }, value: 'users' },
    { label: { de: 'Calendar', en: 'Calendar' }, value: 'calendar' },
    { label: { de: 'Handshake', en: 'Handshake' }, value: 'handshake' },
    { label: { de: 'Globe', en: 'Globe' }, value: 'globe' },
]

export const ServicesBlock: Block = {
    slug: 'services',
    interfaceName: 'ServicesBlock',
    imageURL: '/block-previews/services.svg',
    imageAltText: 'Service cards grid',
    labels: {
        singular: { de: 'Services', en: 'Services' },
        plural: { de: 'Services', en: 'Services' },
    },
    fields: [
        {
            name: 'overline',
            type: 'text',
            localized: true,
            label: { de: 'Overline', en: 'Overline' },
            admin: { description: { de: 'z. B. What We Offer', en: 'e.g. What We Offer' } },
        },
        {
            name: 'title',
            type: 'text',
            required: true,
            localized: true,
            label: { de: 'Titel', en: 'Title' },
        },
        {
            name: 'description',
            type: 'textarea',
            localized: true,
            label: { de: 'Beschreibung', en: 'Description' },
        },
        {
            name: 'services',
            type: 'array',
            required: true,
            minRows: 1,
            maxRows: 6,
            labels: {
                singular: { de: 'Service', en: 'Service' },
                plural: { de: 'Services', en: 'Services' },
            },
            fields: [
                {
                    name: 'icon',
                    type: 'select',
                    required: true,
                    options: iconOptions,
                    label: { de: 'Icon', en: 'Icon' },
                },
                {
                    name: 'title',
                    type: 'text',
                    required: true,
                    localized: true,
                    label: { de: 'Titel', en: 'Title' },
                },
                {
                    name: 'description',
                    type: 'textarea',
                    required: true,
                    localized: true,
                    label: { de: 'Beschreibung', en: 'Description' },
                },
            ],
        },
    ],
}
