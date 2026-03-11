import type { CollectionConfig } from 'payload'
import { adminOrEditor, publishedOrAuthenticated } from '../access'
import { slugField, pageSettings } from '../fields'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'
import { populatePublishedAt } from '../hooks/populatePublishedAt'

export const Jobs: CollectionConfig = {
    slug: 'jobs',
    labels: {
        singular: { de: 'Job', en: 'Job' },
        plural: { de: 'Jobs', en: 'Jobs' },
    },
    defaultPopulate: {
        title: true,
        slug: true,
    },
    admin: {
        useAsTitle: 'title',
        listSearchableFields: ['title', 'slug', 'company'],
        defaultColumns: ['title', 'jobType', 'location', '_status', 'publishedAt'],
        group: { de: 'Jobs', en: 'Jobs' },
        description: {
            de: 'Job-Angebote und Ausschreibungen für Talente und Mitarbeiter.',
            en: 'Job listings and postings for talents and staff.',
        },
        livePreview: {
            url: ({ data, locale }) => {
                const locObj = locale as string | { code?: string }
                const localePrefix = typeof locObj === 'string' ? locObj : (locObj?.code ?? 'de')
                return `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/${localePrefix}/jobs/${data.slug || ''}`
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
    defaultSort: '-publishedAt',
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
                            label: { de: 'Jobtitel', en: 'Job title' },
                        },
                        {
                            name: 'excerpt',
                            type: 'textarea',
                            localized: true,
                            label: { de: 'Kurzbeschreibung', en: 'Short description' },
                            admin: {
                                description: {
                                    de: 'Kurze Zusammenfassung für Listen und SEO',
                                    en: 'Short summary for listings and SEO',
                                },
                            },
                        },
                        {
                            name: 'description',
                            type: 'richText',
                            localized: true,
                            label: { de: 'Beschreibung', en: 'Description' },
                        },
                        {
                            name: 'requirements',
                            type: 'richText',
                            localized: true,
                            label: { de: 'Anforderungen', en: 'Requirements' },
                        },
                        {
                            name: 'benefits',
                            type: 'richText',
                            localized: true,
                            label: { de: 'Wir bieten', en: 'What we offer' },
                        },
                    ],
                },
                {
                    label: { de: 'Seiteneinstellungen', en: 'Page settings' },
                    fields: [pageSettings],
                },
            ],
        },
        // Sidebar
        slugField(),
        {
            name: 'featuredImage',
            type: 'upload',
            relationTo: 'media',
            label: { de: 'Bild', en: 'Image' },
            admin: { position: 'sidebar' },
        },
        {
            name: 'jobType',
            type: 'select',
            label: { de: 'Art der Stelle', en: 'Job type' },
            defaultValue: 'fulltime',
            admin: { position: 'sidebar' },
            options: [
                { label: { de: 'Vollzeit', en: 'Full-time' }, value: 'fulltime' },
                { label: { de: 'Teilzeit', en: 'Part-time' }, value: 'parttime' },
                { label: { de: 'Freelance', en: 'Freelance' }, value: 'freelance' },
                { label: { de: 'Praktikum', en: 'Internship' }, value: 'internship' },
                { label: { de: 'Mini-Job', en: 'Mini job' }, value: 'minijob' },
            ],
        },
        {
            name: 'location',
            type: 'text',
            localized: true,
            label: { de: 'Standort', en: 'Location' },
            admin: {
                position: 'sidebar',
                description: { de: 'z. B. "Berlin" oder "Remote"', en: 'e.g. "Berlin" or "Remote"' },
            },
        },
        {
            name: 'company',
            type: 'text',
            label: { de: 'Unternehmen / Auftraggeber', en: 'Company / Client' },
            admin: {
                position: 'sidebar',
                description: {
                    de: 'Leer lassen falls Deleyna selbst',
                    en: 'Leave empty if Deleyna itself',
                },
            },
        },
        {
            name: 'compensation',
            type: 'text',
            localized: true,
            label: { de: 'Vergütung', en: 'Compensation' },
            admin: {
                position: 'sidebar',
                description: { de: 'z. B. "nach Vereinbarung" oder Betrag', en: 'e.g. "negotiable" or amount' },
            },
        },
        {
            name: 'applicationDeadline',
            type: 'date',
            label: { de: 'Bewerbungsfrist', en: 'Application deadline' },
            admin: {
                position: 'sidebar',
                date: { pickerAppearance: 'dayOnly' },
            },
        },
        {
            name: 'applicationUrl',
            type: 'text',
            label: { de: 'Bewerbungs-Link', en: 'Application link' },
            admin: {
                position: 'sidebar',
                description: {
                    de: 'Externer Link zur Bewerbung (optional, sonst Kontaktformular)',
                    en: 'External application link (optional, otherwise contact form)',
                },
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
                    de: 'Kategorien für diesen Job',
                    en: 'Categories for this job',
                },
            },
        },
        {
            name: 'publishedAt',
            type: 'date',
            admin: {
                position: 'sidebar',
                date: { pickerAppearance: 'dayAndTime' },
            },
        },
    ],
    hooks: {
        beforeChange: [populatePublishedAt],
        afterChange: [
            revalidateAfterChange({
                pathPrefix: '/jobs',
                listingPath: '/jobs',
                tag: 'jobs',
            }),
        ],
        afterDelete: [
            revalidateAfterDelete({ pathPrefix: '/jobs', listingPath: '/jobs', tag: 'jobs' }),
        ],
    },
}
