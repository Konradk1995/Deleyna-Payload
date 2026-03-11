import type { Block } from 'payload'
import { sectionHeaderFields } from '@/fields/sectionHeader'

const iconOptions = [
    { label: { de: 'Users', en: 'Users' }, value: 'users' },
    { label: { de: 'Calendar', en: 'Calendar' }, value: 'calendar' },
    { label: { de: 'Handshake', en: 'Handshake' }, value: 'handshake' },
    { label: { de: 'Globe', en: 'Globe' }, value: 'globe' },
    { label: { de: 'Kamera', en: 'Camera' }, value: 'camera' },
    { label: { de: 'Megafon', en: 'Megaphone' }, value: 'megaphone' },
    { label: { de: 'Stern', en: 'Star' }, value: 'star' },
    { label: { de: 'Herz', en: 'Heart' }, value: 'heart' },
    { label: { de: 'Glühbirne', en: 'Lightbulb' }, value: 'lightbulb' },
    { label: { de: 'Rakete', en: 'Rocket' }, value: 'rocket' },
    { label: { de: 'Schild', en: 'Shield' }, value: 'shield' },
    { label: { de: 'Award', en: 'Award' }, value: 'award' },
    { label: { de: 'Trend', en: 'Trending Up' }, value: 'trending-up' },
    { label: { de: 'Koffer', en: 'Briefcase' }, value: 'briefcase' },
    { label: { de: 'Sparkles', en: 'Sparkles' }, value: 'sparkles' },
    { label: { de: 'Headset', en: 'Headset' }, value: 'headset' },
    { label: { de: 'Netzwerk', en: 'Network' }, value: 'network' },
    { label: { de: 'Palette', en: 'Palette' }, value: 'palette' },
    { label: { de: 'Musik', en: 'Music' }, value: 'music' },
    { label: { de: 'Ziel', en: 'Target' }, value: 'target' },
]

export const ServicesBlock: Block = {
    slug: 'services',
    interfaceName: 'ServicesBlock',
    imageURL: '/block-previews/services.svg',
    imageAltText: 'Service cards grid',
    labels: {
        singular: { de: 'Leistungen', en: 'Services' },
        plural: { de: 'Leistungen', en: 'Services' },
    },
    fields: [
        ...sectionHeaderFields({ headingLevel: true, cta: true }),
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
            name: 'services',
            type: 'array',
            required: true,
            minRows: 1,
            maxRows: 6,
            labels: {
                singular: { de: 'Service', en: 'Service' },
                plural: { de: 'Services', en: 'Services' },
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
