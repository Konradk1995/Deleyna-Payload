import type { Block } from 'payload'
import { link } from '@/fields/link'
import { sectionHeaderFields } from '@/fields/sectionHeader'

const benefitIconOptions = [
    { label: { de: 'Award', en: 'Award' }, value: 'award' },
    { label: { de: 'TrendingUp', en: 'TrendingUp' }, value: 'trendingUp' },
    { label: { de: 'Target', en: 'Target' }, value: 'target' },
    { label: { de: 'Heart', en: 'Heart' }, value: 'heart' },
]

export const CoachingBlock: Block = {
    slug: 'coaching',
    interfaceName: 'CoachingBlock',
    imageURL: '/block-previews/coaching.svg',
    imageAltText: 'Coaching benefits and coaches block',
    labels: {
        singular: { de: 'Coaching', en: 'Coaching' },
        plural: { de: 'Coaching', en: 'Coaching' },
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
        {
            name: 'benefitsSubheading',
            type: 'text',
            localized: true,
            label: {
                de: "Überschrift Benefits (z. B. What You'll Gain)",
                en: "Benefits heading (e.g. What You'll Gain)",
            },
            defaultValue: 'Was du gewinnst',
        },
        {
            name: 'benefits',
            type: 'array',
            minRows: 1,
            maxRows: 6,
            labels: {
                singular: { de: 'Vorteil', en: 'Benefit' },
                plural: { de: 'Vorteile', en: 'Benefits' },
            },
            admin: {
                components: {
                    RowLabel: '@/components/admin/RowLabels#TitleRowLabel',
                },
            },
            fields: [
                {
                    name: 'icon',
                    type: 'select',
                    required: true,
                    options: benefitIconOptions,
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
        {
            name: 'coachesSubheading',
            type: 'text',
            localized: true,
            label: { de: 'Überschrift Coaches', en: 'Coaches heading' },
            defaultValue: 'Unsere Lead-Coaches',
        },
        {
            name: 'coaches',
            type: 'relationship',
            relationTo: 'talents',
            hasMany: true,
            label: { de: 'Coaches', en: 'Coaches' },
            filterOptions: {
                isCoach: { equals: true },
            },
            admin: {
                description: {
                    de: 'Talente mit aktivem Coach-Status auswählen (nur Talente mit "Coach"-Häkchen werden angezeigt)',
                    en: 'Select talents with active coach status (only talents with "Coach" checkbox are shown)',
                },
            },
        },
        {
            name: 'ctaText',
            type: 'text',
            localized: true,
            label: {
                de: 'CTA-Text (z. B. Ready to level up?)',
                en: 'CTA text (e.g. Ready to level up?)',
            },
        },
        link({
            overrides: {
                name: 'cta',
                label: {
                    de: 'CTA-Button (z. B. Book Consultation)',
                    en: 'CTA button (e.g. Book Consultation)',
                },
            },
            optionalLink: true,
        }),
    ],
}
