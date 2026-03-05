import type { CollectionConfig } from 'payload'
import { adminOrEditor, anyone } from '@/access'

export const Categories: CollectionConfig = {
    slug: 'categories',
    defaultPopulate: {
        title: true,
        slug: true,
    },
    labels: {
        singular: { de: 'Kategorie', en: 'Category' },
        plural: { de: 'Kategorien', en: 'Categories' },
    },
    admin: {
        useAsTitle: 'title',
        listSearchableFields: ['title', 'slug'],
        defaultColumns: ['title', 'slug', 'updatedAt'],
        group: { de: 'Blog', en: 'Blog' },
        description: { de: 'Kategorien für Blog-Beiträge (z. B. News, Kampagnen). Optional: Bild und Farbe.', en: 'Categories for blog posts (e.g. News, Campaigns). Optional: image and colour.' },
    },
    access: {
        read: anyone,
        create: adminOrEditor,
        update: adminOrEditor,
        delete: adminOrEditor,
    },
    fields: [
        {
            name: 'title',
            type: 'text',
            label: { de: 'Titel', en: 'Title' },
            required: true,
            localized: true,
        },
        {
            name: 'slug',
            type: 'text',
            label: { de: 'Slug', en: 'Slug' },
            required: true,
            unique: true,
            index: true,
            admin: {
                description: { de: 'URL-freundlicher Name (z.B. "web-development")', en: 'URL-friendly name (e.g. "web-development")' },
            },
            hooks: {
                beforeValidate: [
                    ({ value, data }) => {
                        if (!value && data?.title) {
                            return (data.title as string)
                                .toLowerCase()
                                .replace(/[^a-z0-9]+/g, '-')
                                .replace(/(^-|-$)/g, '')
                        }
                        return value
                    },
                ],
            },
        },
        {
            name: 'description',
            type: 'textarea',
            label: { de: 'Beschreibung', en: 'Description' },
            localized: true,
            admin: {
                description: { de: 'Kurze Beschreibung der Kategorie (optional)', en: 'Short category description (optional)' },
            },
        },
        {
            name: 'image',
            type: 'upload',
            label: { de: 'Kategoriebild', en: 'Category image' },
            relationTo: 'media',
            admin: {
                description: { de: 'Bild für die Kategorieseite (optional)', en: 'Image for the category page (optional)' },
            },
        },
        {
            name: 'color',
            type: 'text',
            label: { de: 'Farbe', en: 'Colour' },
            admin: {
                description: { de: 'HEX-Farbcode für die Kategorie (z.B. #3B82F6)', en: 'HEX colour code for the category (e.g. #3B82F6)' },
            },
            validate: (value: string | undefined | null) => {
                if (!value) return true
                const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
                return hexPattern.test(value) ? true : 'Bitte gib einen gültigen HEX-Farbcode ein'
            },
        },
    ],
    timestamps: true,
}
