import type { Block } from 'payload'
import { link } from '@/fields/link'
import { sectionHeaderFields } from '@/fields/sectionHeader'

export const StatsBlock: Block = {
    slug: 'stats',
    interfaceName: 'StatsBlock',
    imageURL: '/block-previews/stats.svg',
    imageAltText: 'Stats counters block',
    labels: {
        singular: { de: 'Zahlen & Fakten', en: 'Stats / About' },
        plural: { de: 'Zahlen & Fakten', en: 'Stats / About' },
    },
    fields: [
        ...sectionHeaderFields({ headingLevel: true }),
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
            admin: {
                components: {
                    RowLabel: '@/components/admin/RowLabels#StatRowLabel',
                },
            },
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
