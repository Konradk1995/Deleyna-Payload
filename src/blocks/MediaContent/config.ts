import type { Block } from 'payload'
import { link } from '../../fields/link'

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
        {
            name: 'tagline',
            type: 'text',
            localized: true,
            admin: {
                description: {
                    de: 'Kleines Label über der Überschrift',
                    en: 'Small label above the headline',
                },
            },
        },
        {
            name: 'headline',
            type: 'text',
            required: true,
            localized: true,
        },
        {
            name: 'body',
            type: 'richText',
            localized: true,
        },
        {
            name: 'links',
            type: 'array',
            maxRows: 2,
            fields: [
                link({
                    appearances: ['primary-pill', 'outline', 'secondary-glass'],
                }),
            ],
        },
    ],
}
