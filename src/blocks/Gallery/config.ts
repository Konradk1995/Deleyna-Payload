import type { Block } from 'payload'
import { sectionHeaderFields } from '@/fields/sectionHeader'

export const GalleryBlock: Block = {
    slug: 'gallery',
    interfaceName: 'GalleryBlock',
    imageURL: '/block-previews/gallery.svg',
    imageAltText: 'Image gallery grid with multiple columns',
    labels: {
        singular: { de: 'Galerie', en: 'Gallery' },
        plural: { de: 'Galerien', en: 'Galleries' },
    },
    fields: [
        {
            name: 'variant',
            type: 'select',
            defaultValue: 'grid',
            options: [
                { label: { de: 'Grid', en: 'Grid' }, value: 'grid' },
                { label: { de: 'Masonry', en: 'Masonry' }, value: 'masonry' },
                { label: { de: 'Slider', en: 'Slider' }, value: 'slider' },
                { label: { de: 'Lightbox Grid', en: 'Lightbox grid' }, value: 'lightbox' },
            ],
        },
        {
            name: 'columns',
            type: 'select',
            defaultValue: '3',
            options: [
                { label: { de: '2 Spalten', en: '2 columns' }, value: '2' },
                { label: { de: '3 Spalten', en: '3 columns' }, value: '3' },
                { label: { de: '4 Spalten', en: '4 columns' }, value: '4' },
            ],
            admin: {
                condition: (_, siblingData) =>
                    ['grid', 'masonry', 'lightbox'].includes(siblingData?.variant),
            },
        },
        ...sectionHeaderFields({ headingLevel: true, titleHighlight: false }),
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
            name: 'images',
            type: 'array',
            required: true,
            minRows: 1,
            maxRows: 24,
            labels: {
                singular: { de: 'Bild', en: 'Image' },
                plural: { de: 'Bilder', en: 'Images' },
            },
            admin: {
                components: {
                    RowLabel: '@/components/admin/RowLabels#CaptionRowLabel',
                },
            },
            fields: [
                {
                    name: 'image',
                    type: 'upload',
                    relationTo: 'media',
                    required: true,
                },
                {
                    name: 'caption',
                    type: 'text',
                    localized: true,
                },
            ],
        },
    ],
}
