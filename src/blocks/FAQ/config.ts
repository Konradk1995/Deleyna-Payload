import type { Block } from 'payload'
import { sectionHeaderFields } from '@/fields/sectionHeader'

/**
 * FAQ Block mit automatischer Schema.org Generation
 * Wenn generateSchema aktiviert ist, wird FAQPage Schema für Google generiert
 */
export const FAQBlock: Block = {
    slug: 'faq',
    imageURL: '/block-previews/faq.svg',
    imageAltText: 'FAQ accordion block',
    labels: {
        singular: { de: 'FAQ', en: 'FAQ' },
        plural: { de: 'FAQs', en: 'FAQs' },
    },
    interfaceName: 'FAQBlock',
    fields: [
        {
            name: 'anchorId',
            type: 'text',
            label: { de: 'Anker-ID', en: 'Anchor ID' },
            admin: {
                description: { de: 'Optional. Für In-Page-Links, z.B. #faq', en: 'Optional. For in-page links, e.g. #faq' },
            },
        },
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
            name: 'items',
            type: 'array',
            label: { de: 'FAQ Einträge', en: 'FAQ items' },
            minRows: 1,
            maxRows: 30,
            admin: {
                components: {
                    RowLabel: '@/components/admin/RowLabels#QuestionRowLabel',
                },
            },
            fields: [
                {
                    name: 'question',
                    type: 'text',
                    label: { de: 'Frage', en: 'Question' },
                    required: true,
                    localized: true,
                },
                {
                    name: 'answer',
                    type: 'richText',
                    label: { de: 'Antwort', en: 'Answer' },
                    required: true,
                    localized: true,
                },
            ],
        },
        {
            name: 'generateSchema',
            type: 'checkbox',
            label: { de: 'FAQ Schema generieren', en: 'Generate FAQ schema' },
            defaultValue: true,
            admin: {
                description: { de: 'Automatisch FAQPage-Schema für Google Rich Results generieren', en: 'Automatically generate FAQPage schema for Google Rich Results' },
            },
        },
        {
            name: 'layout',
            type: 'select',
            label: { de: 'Layout', en: 'Layout' },
            defaultValue: 'accordion',
            options: [
                { label: { de: 'Akkordeon', en: 'Accordion' }, value: 'accordion' },
                { label: { de: 'Liste (alle offen)', en: 'List (all open)' }, value: 'list' },
                { label: { de: 'Zwei Spalten', en: 'Two columns' }, value: 'twoColumn' },
            ],
        },
    ],
}
