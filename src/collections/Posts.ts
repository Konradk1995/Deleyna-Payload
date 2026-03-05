import type { CollectionConfig } from 'payload'
import { adminOrEditor, publishedOrAuthenticated } from '../access'
import { slugField, pageSettings } from '../fields'
import { ContentBlock, GalleryBlock, FAQBlock, CallToActionBlock, MapBlock } from '../blocks'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'
import { populatePublishedAt } from '../hooks/populatePublishedAt'

export const Posts: CollectionConfig = {
    slug: 'posts',
    labels: {
        singular: { de: 'Beitrag', en: 'Post' },
        plural: { de: 'Beiträge', en: 'Posts' },
    },
    defaultPopulate: {
        title: true,
        slug: true,
    },
    admin: {
        useAsTitle: 'title',
        listSearchableFields: ['title', 'slug'],
        defaultColumns: ['title', 'postType', 'author', 'categories', '_status', 'publishedAt'],
        group: { de: 'Blog', en: 'Blog' },
        description: {
            de: 'Blog-Beiträge und Magazin-Artikel. Kategorien, Entwürfe und Veröffentlichung pro Beitrag.',
            en: 'Blog posts and magazine articles. Categories, drafts and publishing per post.',
        },
        livePreview: {
            url: ({ data, locale }) => {
                const locObj = locale as string | { code?: string }
                const localePrefix = typeof locObj === 'string' ? locObj : (locObj?.code ?? 'de')
                const postSegment = localePrefix === 'de' ? 'magazin' : 'blog'
                return `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/${localePrefix}/${postSegment}/${data.slug || ''}`
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
                        {
                            name: 'featuredImage',
                            type: 'upload',
                            relationTo: 'media',
                        },
                        {
                            name: 'excerpt',
                            type: 'textarea',
                            localized: true,
                            admin: {
                                description: {
                                    de: 'Kurze Zusammenfassung für Listen und SEO',
                                    en: 'Short summary for lists and SEO',
                                },
                            },
                        },
                        {
                            name: 'content',
                            type: 'blocks',
                            blocks: [
                                ContentBlock,
                                GalleryBlock,
                                FAQBlock,
                                CallToActionBlock,
                                MapBlock,
                            ],
                            localized: true,
                        },
                    ],
                },
                {
                    label: { de: 'Seiteneinstellungen', en: 'Page settings' },
                    fields: [pageSettings],
                },
            ],
        },
        // Sidebar Fields
        slugField(),
        {
            name: 'postType',
            type: 'select',
            label: { de: 'Beitragstyp', en: 'Post type' },
            defaultValue: 'article',
            admin: {
                position: 'sidebar',
                description: {
                    de: 'Artikel, News-Update oder Dance-Class Announcement.',
                    en: 'Article, news update, or dance class announcement.',
                },
            },
            options: [
                { label: { de: 'Artikel', en: 'Article' }, value: 'article' },
                { label: { de: 'News', en: 'News' }, value: 'news' },
                { label: { de: 'Dance Class', en: 'Dance class' }, value: 'class' },
            ],
        },
        {
            name: 'classDetails',
            type: 'group',
            label: { de: 'Dance Class Details', en: 'Dance class details' },
            admin: {
                position: 'sidebar',
                condition: (_, siblingData) => siblingData?.postType === 'class',
                description: {
                    de: 'Infos für Class-Posts: Studio, Datum, Talent-Instructor usw.',
                    en: 'Details for class posts: studio, date, talent instructor, etc.',
                },
            },
            fields: [
                {
                    type: 'row',
                    fields: [
                        {
                            name: 'classDate',
                            type: 'date',
                            label: { de: 'Start (Datum/Uhrzeit)', en: 'Start (date/time)' },
                            admin: {
                                width: '50%',
                                date: {
                                    pickerAppearance: 'dayAndTime',
                                },
                            },
                        },
                        {
                            name: 'classEndDate',
                            type: 'date',
                            label: { de: 'Ende (optional)', en: 'End (optional)' },
                            admin: {
                                width: '50%',
                                date: {
                                    pickerAppearance: 'dayAndTime',
                                },
                            },
                        },
                    ],
                },
                {
                    type: 'row',
                    fields: [
                        {
                            name: 'studioName',
                            type: 'text',
                            localized: true,
                            label: { de: 'Studio Name', en: 'Studio name' },
                            admin: { width: '50%' },
                        },
                        {
                            name: 'studioCity',
                            type: 'text',
                            localized: true,
                            label: { de: 'Stadt', en: 'City' },
                            admin: { width: '50%' },
                        },
                    ],
                },
                {
                    name: 'studioAddress',
                    type: 'textarea',
                    localized: true,
                    label: { de: 'Studio-Adresse', en: 'Studio address' },
                },
                {
                    type: 'row',
                    fields: [
                        {
                            name: 'danceStyle',
                            type: 'text',
                            localized: true,
                            label: { de: 'Dance Style', en: 'Dance style' },
                            admin: { width: '50%' },
                        },
                        {
                            name: 'level',
                            type: 'select',
                            label: { de: 'Level', en: 'Level' },
                            admin: { width: '50%' },
                            options: [
                                { label: { de: 'Open Level', en: 'Open level' }, value: 'open' },
                                { label: { de: 'Beginner', en: 'Beginner' }, value: 'beginner' },
                                {
                                    label: { de: 'Intermediate', en: 'Intermediate' },
                                    value: 'intermediate',
                                },
                                { label: { de: 'Advanced', en: 'Advanced' }, value: 'advanced' },
                            ],
                        },
                    ],
                },
                {
                    type: 'row',
                    fields: [
                        {
                            name: 'duration',
                            type: 'text',
                            localized: true,
                            label: { de: 'Dauer (z. B. 90 Min)', en: 'Duration (e.g. 90 min)' },
                            admin: { width: '50%' },
                        },
                        {
                            name: 'priceInfo',
                            type: 'text',
                            localized: true,
                            label: { de: 'Preis-Info', en: 'Price info' },
                            admin: { width: '50%' },
                        },
                    ],
                },
                {
                    type: 'row',
                    fields: [
                        {
                            name: 'maxParticipants',
                            type: 'number',
                            label: { de: 'Max. Teilnehmer', en: 'Max participants' },
                            admin: { width: '50%' },
                        },
                        {
                            name: 'bookingUrl',
                            type: 'text',
                            label: { de: 'Buchungs-URL', en: 'Booking URL' },
                            admin: { width: '50%' },
                        },
                    ],
                },
                {
                    name: 'mapEmbedUrl',
                    type: 'text',
                    label: { de: 'Google Maps Embed-URL', en: 'Google Maps embed URL' },
                    admin: {
                        description: {
                            de: 'Optional: Google Maps Embed-Link (https://www.google.com/maps/embed?…). Zeigt eine interaktive Karte unter den Kursdetails.',
                            en: 'Optional: Google Maps embed link (https://www.google.com/maps/embed?…). Shows an interactive map below class details.',
                        },
                    },
                },
                {
                    name: 'instructorTalents',
                    type: 'relationship',
                    relationTo: 'talents',
                    hasMany: true,
                    label: { de: 'Instructor Talents', en: 'Instructor talents' },
                    admin: {
                        description: {
                            de: 'Talente aus eurem Roster, die diese Class unterrichten.',
                            en: 'Talents from your roster who teach this class.',
                        },
                    },
                },
            ],
        },
        {
            name: 'author',
            type: 'relationship',
            relationTo: 'users',
            required: true,
            admin: {
                position: 'sidebar',
            },
        },
        {
            name: 'categories',
            type: 'relationship',
            relationTo: 'categories',
            hasMany: true,
            admin: {
                position: 'sidebar',
                description: {
                    de: 'Kategorien für diesen Beitrag',
                    en: 'Categories for this post',
                },
            },
        },
        {
            name: 'tags',
            type: 'text',
            hasMany: true,
            admin: {
                position: 'sidebar',
            },
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
        {
            name: 'relatedPosts',
            type: 'relationship',
            relationTo: 'posts',
            hasMany: true,
            maxRows: 3,
            admin: {
                position: 'sidebar',
                description: { de: 'Ähnliche Beiträge', en: 'Related posts' },
            },
            filterOptions: ({ id }) => (id != null ? { id: { not_equals: id } } : true),
        },
    ],
    hooks: {
        beforeChange: [populatePublishedAt],
        afterChange: [
            revalidateAfterChange({
                pathPrefix: '/blog',
                listingPath: '/blog',
                tag: 'posts',
            }),
        ],
        afterDelete: [
            revalidateAfterDelete({ pathPrefix: '/blog', listingPath: '/blog', tag: 'posts' }),
        ],
    },
}
