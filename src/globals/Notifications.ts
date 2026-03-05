import type { GlobalConfig } from 'payload'
import { authenticated } from '../access'

/**
 * Notifications Global - tracks unread form submissions per locale.
 * Counters are incremented by form submission hooks and decremented
 * when submissions are marked as read.
 */
export const Notifications: GlobalConfig = {
    slug: 'notifications',
    label: { de: 'Benachrichtigungen', en: 'Notifications' },
    access: {
        read: authenticated,
        update: authenticated,
    },
    admin: {
        group: { de: 'Admin', en: 'Admin' },
        description: { de: 'Zähler für ungelesene Formular-Anfragen pro Sprache (werden automatisch gesetzt).', en: 'Counters for unread form submissions per locale (set automatically).' },
    },
    fields: [
        {
            type: 'tabs',
            tabs: [
                {
                    label: { de: 'Übersicht', en: 'Overview' },
                    fields: [
                        {
                            name: 'unreadFormSubmissionsDe',
                            type: 'number',
                            label: { de: 'Ungelesene Anfragen (DE)', en: 'Unread submissions (DE)' },
                            defaultValue: 0,
                            min: 0,
                            admin: {
                                readOnly: true,
                            },
                        },
                        {
                            name: 'unreadFormSubmissionsEn',
                            type: 'number',
                            label: { de: 'Ungelesene Anfragen (EN)', en: 'Unread submissions (EN)' },
                            defaultValue: 0,
                            min: 0,
                            admin: {
                                readOnly: true,
                            },
                        },
                    ],
                },
            ],
        },
    ],
}
