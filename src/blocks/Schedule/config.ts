import type { Block } from 'payload'
import { sectionHeaderFields } from '@/fields/sectionHeader'

export const Schedule: Block = {
    slug: 'schedule',
    interfaceName: 'ScheduleBlock',
    imageURL: '/block-previews/schedule.svg',
    imageAltText: 'Class schedule list or grid',
    labels: {
        singular: { de: 'Kursplan', en: 'Schedule' },
        plural: { de: 'Kurspläne', en: 'Schedules' },
    },
    fields: [
        ...sectionHeaderFields({ headingLevel: true, cta: true }),
        {
            name: 'backgroundColor',
            type: 'select',
            defaultValue: 'muted',
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
            name: 'layout',
            type: 'select',
            defaultValue: 'list',
            options: [
                { label: { de: 'Listenansicht', en: 'List view' }, value: 'list' },
                { label: { de: 'Grid-Ansicht', en: 'Grid view' }, value: 'grid' },
            ],
            admin: {
                description: {
                    de: 'Darstellung als Liste oder Karten-Grid',
                    en: 'Display as list or card grid',
                },
            },
        },
        {
            name: 'classes',
            type: 'array',
            minRows: 1,
            labels: {
                singular: { de: 'Kurs', en: 'Class' },
                plural: { de: 'Kurse', en: 'Classes' },
            },
            admin: {
                components: {
                    RowLabel: '@/components/admin/RowLabels#ClassRowLabel',
                },
            },
            fields: [
                {
                    name: 'title',
                    type: 'text',
                    required: true,
                    localized: true,
                    label: { de: 'Titel', en: 'Title' },
                    admin: {
                        description: {
                            de: 'Name des Kurses (z. B. "Hip Hop Basics")',
                            en: 'Name of the class (e.g. "Hip Hop Basics")',
                        },
                    },
                },
                {
                    name: 'coach',
                    type: 'text',
                    localized: true,
                    label: { de: 'Coach', en: 'Coach' },
                    admin: {
                        description: {
                            de: 'Name des Trainers / der Trainerin',
                            en: 'Name of the coach / instructor',
                        },
                    },
                },
                {
                    name: 'dateText',
                    type: 'text',
                    localized: true,
                    label: { de: 'Datumstext', en: 'Date text' },
                    admin: {
                        description: {
                            de: 'Wochentag oder Datumsangabe (z. B. "Montag" oder "Ab 15.03.")',
                            en: 'Day of week or date info (e.g. "Monday" or "From Mar 15")',
                        },
                    },
                },
                {
                    name: 'time',
                    type: 'text',
                    label: { de: 'Uhrzeit', en: 'Time' },
                    admin: {
                        description: {
                            de: 'Uhrzeit des Kurses (z. B. "18:00 – 19:30")',
                            en: 'Class time (e.g. "18:00 – 19:30")',
                        },
                    },
                },
                {
                    name: 'level',
                    type: 'text',
                    localized: true,
                    label: { de: 'Level', en: 'Level' },
                    admin: {
                        description: {
                            de: 'Schwierigkeitsstufe (z. B. "Anfänger", "Fortgeschritten")',
                            en: 'Difficulty level (e.g. "Beginner", "Advanced")',
                        },
                    },
                },
                {
                    name: 'location',
                    type: 'text',
                    localized: true,
                    label: { de: 'Ort', en: 'Location' },
                    admin: {
                        description: {
                            de: 'Veranstaltungsort oder Studio-Name',
                            en: 'Venue or studio name',
                        },
                    },
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
