import type { CollectionConfig } from 'payload'
import { adminOrEditor, anyone } from '@/access'

export const TalentSkills: CollectionConfig = {
    slug: 'talent-skills',
    defaultPopulate: {
        title: true,
        slug: true,
        skillGroup: true,
    },
    labels: {
        singular: { de: 'Talent-Skill', en: 'Talent Skill' },
        plural: { de: 'Talent-Skills', en: 'Talent Skills' },
    },
    admin: {
        useAsTitle: 'title',
        listSearchableFields: ['title', 'slug'],
        defaultColumns: ['title', 'skillGroup', 'slug', 'updatedAt'],
        group: { de: 'Talent', en: 'Talent' },
        description: {
            de: 'Skills für Talente (z. B. Contemporary, Hip-Hop, Editorial)',
            en: 'Skills for talents (e.g. Contemporary, Hip-Hop, Editorial)',
        },
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
                description: {
                    de: 'URL-freundlicher Name (wird automatisch generiert)',
                    en: 'URL-friendly name (auto-generated)',
                },
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
            name: 'skillGroup',
            type: 'select',
            label: { de: 'Skill-Gruppe', en: 'Skill group' },
            defaultValue: 'other',
            options: [
                { label: { de: 'Tanz', en: 'Dance' }, value: 'dance' },
                { label: { de: 'Modeling', en: 'Modeling' }, value: 'modeling' },
                { label: { de: 'Schauspiel', en: 'Acting' }, value: 'acting' },
                { label: { de: 'Fitness', en: 'Fitness' }, value: 'fitness' },
                { label: { de: 'Sonstiges', en: 'Other' }, value: 'other' },
            ],
        },
    ],
    timestamps: true,
}
