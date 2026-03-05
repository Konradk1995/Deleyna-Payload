import type { Block } from 'payload'
import { link } from '@/fields/link'

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
        {
            name: 'overline',
            type: 'text',
            localized: true,
            label: { de: 'Overline', en: 'Overline' },
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
                singular: { de: 'Benefit', en: 'Benefit' },
                plural: { de: 'Benefits', en: 'Benefits' },
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
            type: 'array',
            minRows: 0,
            maxRows: 8,
            labels: {
                singular: { de: 'Coach', en: 'Coach' },
                plural: { de: 'Coaches', en: 'Coaches' },
            },
            fields: [
                {
                    name: 'name',
                    type: 'text',
                    required: true,
                    localized: true,
                    label: { de: 'Name', en: 'Name' },
                },
                {
                    name: 'role',
                    type: 'text',
                    required: true,
                    localized: true,
                    label: { de: 'Rolle', en: 'Role' },
                },
                {
                    name: 'available',
                    type: 'checkbox',
                    defaultValue: true,
                    label: { de: 'Verfügbar', en: 'Available' },
                },
            ],
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
