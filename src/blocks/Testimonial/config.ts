import type { Block } from 'payload'
import { sectionHeaderFields } from '@/fields/sectionHeader'

export const TestimonialBlock: Block = {
    slug: 'testimonial',
    interfaceName: 'TestimonialBlock',
    imageURL: '/block-previews/testimonial.svg',
    imageAltText: 'Testimonial: Zitate von Kunden & Partnern mit Video/Bild',
    labels: {
        singular: { de: 'Kundenstimme', en: 'Testimonial' },
        plural: { de: 'Kundenstimmen', en: 'Testimonials' },
    },
    fields: [
        ...sectionHeaderFields({ headingLevel: true, description: false, cta: true }),
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
            minRows: 1,
            maxRows: 12,
            required: true,
            labels: {
                singular: { de: 'Testimonial', en: 'Testimonial' },
                plural: { de: 'Testimonials', en: 'Testimonials' },
            },
            admin: {
                components: {
                    RowLabel: '@/components/admin/RowLabels#TestimonialRowLabel',
                },
            },
            fields: [
                {
                    name: 'quote',
                    type: 'textarea',
                    required: true,
                    localized: true,
                    admin: {
                        description: {
                            de: 'Zitat-Text',
                            en: 'Quote text',
                        },
                    },
                },
                {
                    name: 'author',
                    type: 'text',
                    required: true,
                    localized: true,
                    admin: {
                        description: {
                            de: 'Name der Person',
                            en: 'Person name',
                        },
                    },
                },
                {
                    type: 'row',
                    fields: [
                        {
                            name: 'role',
                            type: 'text',
                            localized: true,
                            admin: {
                                width: '50%',
                                description: { de: 'Rolle / Titel', en: 'Role / Title' },
                            },
                        },
                        {
                            name: 'company',
                            type: 'text',
                            localized: true,
                            admin: {
                                width: '50%',
                                description: {
                                    de: 'Firma / Organisation',
                                    en: 'Company / Organisation',
                                },
                            },
                        },
                    ],
                },
                {
                    name: 'avatar',
                    type: 'upload',
                    relationTo: 'media',
                    admin: {
                        description: { de: 'Portrait (optional)', en: 'Portrait (optional)' },
                    },
                },
                {
                    name: 'media',
                    type: 'upload',
                    relationTo: 'media',
                    admin: {
                        description: {
                            de: 'Video oder Bild vom Shoot / Projekt (optional). Wird als großes Hintergrund-Visual angezeigt.',
                            en: 'Video or image from the shoot / project (optional). Displayed as large background visual.',
                        },
                    },
                },
                {
                    name: 'logo',
                    type: 'upload',
                    relationTo: 'media',
                    admin: {
                        description: {
                            de: 'Firmenlogo (optional)',
                            en: 'Company logo (optional)',
                        },
                    },
                },
            ],
        },
    ],
}
