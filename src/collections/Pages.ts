import type { CollectionConfig } from 'payload'
import { adminOrEditor, publishedOrAuthenticated } from '../access'
import { slugField, pageSettings } from '../fields'
import { allBlocks } from '../blocks'
import { hero } from '../heros/config'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'
import { populatePublishedAt } from '../hooks/populatePublishedAt'

export const Pages: CollectionConfig = {
    slug: 'pages',
    labels: {
        singular: { de: 'Seite', en: 'Page' },
        plural: { de: 'Seiten', en: 'Pages' },
    },
    defaultPopulate: {
        title: true,
        slug: true,
    },
    admin: {
        useAsTitle: 'title',
        listSearchableFields: ['title', 'slug'],
        defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
        group: { de: 'Inhalte', en: 'Content' },
        description: {
            de: 'Seiten der Website (Startseite, Über uns, Kontakt etc.). SEO und Layout pro Seite einstellbar.',
            en: 'Website pages (home, about, contact etc.). SEO and layout configurable per page.',
        },
        livePreview: {
            url: ({ data, locale }) => {
                const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
                const locObj = locale as string | { code?: string }
                const localePrefix = typeof locObj === 'string' ? locObj : (locObj?.code ?? 'de')
                const slug = data?.slug
                if (slug === 'home' || !slug) return `${baseUrl}/${localePrefix}`
                return `${baseUrl}/${localePrefix}/${slug}`
            },
        },
        components: {
            edit: {
                beforeDocumentControls: [
                    '@/components/admin/ViewOnSite#ViewOnSite',
                ],
            },
        },
    },
    defaultSort: '-updatedAt',
    access: {
        read: publishedOrAuthenticated,
        create: adminOrEditor,
        update: adminOrEditor,
        delete: adminOrEditor,
    },
    versions: {
        drafts: {
            autosave: {
                interval: 300,
            },
            schedulePublish: true,
        },
        maxPerDoc: 25,
    },
    fields: [
        {
            type: 'tabs',
            tabs: [
                {
                    label: { de: 'Inhalt', en: 'Content' },
                    fields: [
                        {
                            name: 'title',
                            type: 'text',
                            required: true,
                            localized: true,
                        },
                        hero,
                    ],
                },
                {
                    label: { de: 'Layout', en: 'Layout' },
                    description: {
                        de: 'Blöcke für den Seiteninhalt (Sektionen). Reihenfolge per Drag & Drop. Nach dem Veröffentlichen: URL = /[Sprache]/[slug], z. B. /de/kontakt. Bei 404 prüfen: Status „Veröffentlicht“, Slug in der Sidebar, ggf. Seite erneut speichern und Cache (Seite neu laden).',
                        en: 'Blocks for page content (sections). Drag & drop to reorder. After publishing: URL = /[locale]/[slug], e.g. /en/contact. If you get 404: check status „Published“, slug in sidebar, save again and reload.',
                    },
                    fields: [
                        {
                            name: 'layout',
                            type: 'blocks',
                            blocks: allBlocks,
                            localized: true,
                            admin: {
                                description: {
                                    de: 'Mindestens ein Block empfohlen. Pro Sprache getrennt bearbeitbar.',
                                    en: 'At least one block recommended. Editable per locale.',
                                },
                            },
                        },
                    ],
                },
                {
                    label: { de: 'SEO & Meta', en: 'SEO & Meta' },
                    fields: [pageSettings],
                },
            ],
        },
        // Sidebar Fields
        slugField(),
        {
            name: 'parent',
            type: 'relationship',
            relationTo: 'pages',
            admin: {
                position: 'sidebar',
                description: {
                    de: 'Übergeordnete Seite für Breadcrumbs',
                    en: 'Parent page for breadcrumbs',
                },
            },
            // Exclude self from parent options (id is undefined during create → show all)
            filterOptions: ({ id }) => (id != null ? { id: { not_equals: id } } : true),
        },
        {
            name: 'template',
            type: 'select',
            label: { de: 'Template', en: 'Template' },
            defaultValue: 'default',
            admin: {
                position: 'sidebar',
            },
            options: [
                { label: { de: 'Standard', en: 'Default' }, value: 'default' },
                { label: { de: 'Volle Breite', en: 'Full width' }, value: 'fullWidth' },
                { label: { de: 'Landing Page', en: 'Landing page' }, value: 'landing' },
                { label: { de: 'Blog Übersicht', en: 'Blog listing' }, value: 'blogListing' },
            ],
        },
        {
            name: 'publishedAt',
            type: 'date',
            admin: {
                position: 'sidebar',
                date: {
                    pickerAppearance: 'dayAndTime',
                },
            },
        },
    ],
    hooks: {
        beforeChange: [populatePublishedAt],
        afterChange: [
            revalidateAfterChange({
                pathPrefix: '',
                listingPath: undefined,
                tag: 'pages',
            }),
        ],
        afterDelete: [
            revalidateAfterDelete({
                pathPrefix: '',
                listingPath: undefined,
                tag: 'pages',
            }),
        ],
    },
}
