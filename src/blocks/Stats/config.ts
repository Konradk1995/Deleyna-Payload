import type { Block } from 'payload'
import { link } from '@/fields/link'

export const StatsBlock: Block = {
    slug: 'stats',
    interfaceName: 'StatsBlock',
    imageURL: '/block-previews/stats.svg',
    imageAltText: 'Stats counters block',
    labels: {
        singular: { de: 'Stats / About', en: 'Stats / About' },
        plural: { de: 'Stats / About', en: 'Stats / About' },
    },
    fields: [
        {
            name: 'overline',
            type: 'text',
            localized: true,
            label: { de: 'Overline (z. B. About Us)', en: 'Overline (e.g. About Us)' },
        },
        {
            name: 'title',
            type: 'text',
            localized: true,
            label: { de: 'Haupttitel', en: 'Main title' },
        },
        {
            name: 'titleHighlight',
            type: 'text',
            localized: true,
            label: {
                de: 'Titel hervorgehoben (Akzent)',
                en: 'Title highlight (accent)',
            },
        },
        {
            name: 'description',
            type: 'textarea',
            localized: true,
            label: { de: 'Beschreibung', en: 'Description' },
        },
        link({
            overrides: {
                name: 'cta',
                label: { de: 'CTA (z. B. Learn More)', en: 'CTA (e.g. Learn More)' },
            },
            optionalLink: true,
        }),
        {
            name: 'stats',
            type: 'array',
            required: true,
            minRows: 1,
            maxRows: 6,
            labels: { singular: { de: 'Stat', en: 'Stat' }, plural: { de: 'Stats', en: 'Stats' } },
            fields: [
                {
                    name: 'value',
                    type: 'number',
                    required: true,
                    label: { de: 'Zahl', en: 'Number' },
                },
                {
                    name: 'suffix',
                    type: 'text',
                    localized: true,
                    label: { de: 'Suffix (z. B. +)', en: 'Suffix (e.g. +)' },
                },
                {
                    name: 'label',
                    type: 'text',
                    required: true,
                    localized: true,
                    label: { de: 'Label (z. B. Talents)', en: 'Label (e.g. Talents)' },
                },
            ],
        },
    ],
}
