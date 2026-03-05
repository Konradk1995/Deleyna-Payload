import type { Block } from 'payload'

export const Schedule: Block = {
    slug: 'schedule',
    interfaceName: 'ScheduleBlock',
    imageURL: '/block-previews/schedule.svg',
    imageAltText: 'Class schedule list or grid',
    labels: {
        singular: { de: 'Schedule', en: 'Schedule' },
        plural: { de: 'Schedules', en: 'Schedules' },
    },
    fields: [
        {
            name: 'headline',
            type: 'text',
            localized: true,
            label: { de: 'Überschrift', en: 'Headline' },
        },
        {
            name: 'subtitle',
            type: 'text',
            localized: true,
            label: { de: 'Untertitel', en: 'Subtitle' },
        },
        {
            name: 'layout',
            type: 'select',
            defaultValue: 'list',
            options: [
                { label: { de: 'Listenansicht', en: 'List view' }, value: 'list' },
                { label: { de: 'Grid-Ansicht', en: 'Grid view' }, value: 'grid' },
            ],
        },
        {
            name: 'classes',
            type: 'array',
            minRows: 1,
            fields: [
                {
                    name: 'title',
                    type: 'text',
                    required: true,
                    localized: true,
                    label: { de: 'Titel', en: 'Title' },
                },
                {
                    name: 'coach',
                    type: 'text',
                    localized: true,
                    label: { de: 'Coach', en: 'Coach' },
                },
                {
                    name: 'dateText',
                    type: 'text',
                    localized: true,
                    label: { de: 'Datumstext', en: 'Date text' },
                },
                {
                    name: 'time',
                    type: 'text',
                    label: { de: 'Uhrzeit', en: 'Time' },
                },
                {
                    name: 'level',
                    type: 'text',
                    localized: true,
                    label: { de: 'Level', en: 'Level' },
                },
                {
                    name: 'location',
                    type: 'text',
                    localized: true,
                    label: { de: 'Ort', en: 'Location' },
                },
                {
                    name: 'notes',
                    type: 'text',
                    localized: true,
                    admin: {
                        description: {
                            de: 'Zum Beispiel: *KEINE STRASSENSCHUHE*',
                            en: 'For example: *NO STREET SHOES*',
                        },
                    },
                },
                {
                    name: 'bookingLink',
                    type: 'text',
                    label: { de: 'Buchungslink', en: 'Booking link' },
                    admin: {
                        description: {
                            de: 'Externe URL zur Buchungsseite',
                            en: 'External URL to booking page',
                        },
                    },
                },
            ],
        },
    ],
}
