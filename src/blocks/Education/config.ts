import type { Block } from 'payload'
import { link } from '@/fields/link'

const iconOptions = [
    { label: { de: 'GraduationCap', en: 'GraduationCap' }, value: 'graduationCap' },
    { label: { de: 'Users', en: 'Users' }, value: 'users' },
    { label: { de: 'Briefcase', en: 'Briefcase' }, value: 'briefcase' },
    { label: { de: 'Zap', en: 'Zap' }, value: 'zap' },
]

export const EducationBlock: Block = {
    slug: 'education',
    interfaceName: 'EducationBlock',
    imageURL: '/block-previews/education.svg',
    imageAltText: 'Education programs cards',
    labels: { singular: { de: 'Education', en: 'Education' }, plural: { de: 'Education', en: 'Education' } },
    fields: [
        { name: 'overline', type: 'text', localized: true, label: { de: 'Overline', en: 'Overline' } },
        { name: 'title', type: 'text', required: true, localized: true, label: { de: 'Titel', en: 'Title' } },
        { name: 'description', type: 'textarea', localized: true, label: { de: 'Beschreibung', en: 'Description' } },
        {
            name: 'programs',
            type: 'array',
            required: true,
            minRows: 1,
            maxRows: 6,
            labels: { singular: { de: 'Programm', en: 'Program' }, plural: { de: 'Programme', en: 'Programs' } },
            fields: [
                { name: 'icon', type: 'select', required: true, options: iconOptions, label: { de: 'Icon', en: 'Icon' } },
                { name: 'title', type: 'text', required: true, localized: true, label: { de: 'Titel', en: 'Title' } },
                { name: 'description', type: 'textarea', required: true, localized: true, label: { de: 'Beschreibung', en: 'Description' } },
                { name: 'duration', type: 'text', localized: true, label: { de: 'Dauer (z. B. 8 Weeks)', en: 'Duration (e.g. 8 weeks)' } },
                { name: 'level', type: 'text', localized: true, label: { de: 'Level (z. B. Beginner)', en: 'Level (e.g. Beginner)' } },
            ],
        },
        link({
            overrides: { name: 'cta', label: { de: 'CTA (z. B. Enroll Now)', en: 'CTA (e.g. Enroll Now)' } },
            optionalLink: true,
        }),
    ],
}
