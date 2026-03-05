import type { GlobalConfig } from 'payload'
import { adminOnly } from '@/access'

export const SedcardSettings: GlobalConfig = {
    slug: 'sedcard-settings',
    label: { de: 'Sedcard-Einstellungen', en: 'Sedcard Settings' },
    access: {
        read: () => true,
        update: adminOnly,
    },
    admin: {
        group: { de: 'Talent', en: 'Talent' },
        description: {
            de: 'PDF-Download und Template-Einstellungen für Sedcards.',
            en: 'PDF download and template settings for sedcards.',
        },
    },
    fields: [
        {
            name: 'enableFrontendDownload',
            type: 'checkbox',
            label: { de: 'Download im Frontend aktivieren', en: 'Enable frontend download' },
            defaultValue: false,
            admin: {
                description: {
                    de: 'Wenn aktiviert, können Website-Besucher Sedcard-PDFs herunterladen.',
                    en: 'When enabled, website visitors can download sedcard PDFs.',
                },
            },
        },
        {
            name: 'defaultTemplate',
            type: 'select',
            label: { de: 'Standard-Template', en: 'Default template' },
            defaultValue: 'classic',
            options: [
                { label: { de: 'Klassisch', en: 'Classic' }, value: 'classic' },
            ],
            admin: {
                description: {
                    de: 'Standard-PDF-Template für alle Talents (kann pro Talent überschrieben werden).',
                    en: 'Default PDF template for all talents (can be overridden per talent).',
                },
            },
        },
        {
            name: 'agencyLogo',
            type: 'upload',
            relationTo: 'media',
            label: { de: 'Agentur-Logo', en: 'Agency logo' },
            admin: {
                description: {
                    de: 'Logo für das Sedcard-PDF (wird oben rechts platziert).',
                    en: 'Logo for the sedcard PDF (placed top-right).',
                },
            },
        },
        {
            name: 'footerText',
            type: 'text',
            label: { de: 'Fußzeile', en: 'Footer text' },
            admin: {
                description: {
                    de: 'Text der Fußzeile im Sedcard-PDF (z.B. Kontaktdaten, Website).',
                    en: 'Footer text in the sedcard PDF (e.g. contact info, website).',
                },
            },
        },
    ],
}
