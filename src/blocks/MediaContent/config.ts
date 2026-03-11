import type { Block } from 'payload'
import { link } from '../../fields/link'
import { sectionHeaderFields } from '@/fields/sectionHeader'

export const MediaContent: Block = {
    slug: 'mediaContent',
    interfaceName: 'MediaContentBlock',
    imageURL: '/block-previews/media-content.svg',
    imageAltText: 'Media Content: Split layout with media and text',
    labels: {
        singular: { de: 'Medien & Inhalt', en: 'Media & Content' },
        plural: { de: 'Medien & Inhalte', en: 'Media & Content' },
    },
    fields: [
        {
            name: 'layout',
            type: 'select',
            defaultValue: 'mediaLeft',
            options: [
                { label: { de: 'Medium links', en: 'Media left' }, value: 'mediaLeft' },
                { label: { de: 'Medium rechts', en: 'Media right' }, value: 'mediaRight' },
            ],
            admin: {
                description: {
                    de: 'Anordnung von Medium und Text',
                    en: 'Arrangement of media and text',
                },
            },
        },
        {
            name: 'media',
            type: 'upload',
            relationTo: 'media',
            required: true,
            admin: {
                description: { de: 'Bild oder Video (autoplay)', en: 'Image or video (autoplay)' },
            },
        },
        ...sectionHeaderFields({ headingLevel: true, description: false }),
        {
            name: 'body',
            type: 'richText',
            localized: true,
            label: { de: 'Fließtext', en: 'Body text' },
            admin: {
                description: {
                    de: 'Fließtext neben dem Medium',
                    en: 'Body text beside the media',
                },
            },
        },
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
            name: 'links',
            type: 'array',
            maxRows: 2,
            labels: {
                singular: { de: 'Link', en: 'Link' },
                plural: { de: 'Links', en: 'Links' },
            },
            admin: {
                components: {
                    RowLabel: '@/components/admin/RowLabels#LinkRowLabel',
                },
            },
            fields: [
                link({
                    appearances: ['primary-pill', 'outline', 'secondary-glass'],
                }),
            ],
        },
    ],
}
