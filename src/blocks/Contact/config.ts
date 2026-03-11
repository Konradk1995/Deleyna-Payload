import type { Block } from 'payload'
import { sectionHeaderFields } from '@/fields/sectionHeader'

export const ContactBlock: Block = {
    slug: 'contact',
    interfaceName: 'ContactBlock',
    imageURL: '/block-previews/contact.svg',
    imageAltText: 'Contact info and form block',
    labels: {
        singular: { de: 'Kontakt', en: 'Contact' },
        plural: { de: 'Kontakt', en: 'Contact' },
    },
    fields: [
        ...sectionHeaderFields({ headingLevel: true, cta: true }),
        {
            name: 'backgroundColor',
            type: 'select',
            defaultValue: 'white',
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
            name: 'form',
            type: 'relationship',
            relationTo: 'forms',
            required: true,
            admin: {
                description: {
                    de: 'Wähle das Payload-Formular aus, das rechts angezeigt werden soll.',
                    en: 'Choose the Payload form that should be rendered on the right side.',
                },
            },
        },
        {
            name: 'emailLabel',
            type: 'text',
            localized: true,
            label: { de: 'E-Mail-Label', en: 'Email label' },
            defaultValue: 'E-Mail schreiben',
        },
        {
            name: 'email',
            type: 'text',
            label: { de: 'E-Mail (z. B. hello@deleyna.com)', en: 'Email (e.g. hello@deleyna.com)' },
        },
        {
            name: 'phoneLabel',
            type: 'text',
            localized: true,
            label: { de: 'Telefon-Label', en: 'Phone label' },
            defaultValue: 'Anrufen',
        },
        { name: 'phone', type: 'text', label: { de: 'Telefonnummer', en: 'Phone number' } },
        {
            name: 'addressLabel',
            type: 'text',
            localized: true,
            label: { de: 'Adress-Label', en: 'Address label' },
            defaultValue: 'Besuchen',
        },
        {
            name: 'address',
            type: 'textarea',
            localized: true,
            label: { de: 'Adresse (mehrzeilig)', en: 'Address (multiline)' },
        },
        {
            name: 'whatsappLabel',
            type: 'text',
            localized: true,
            label: { de: 'WhatsApp-Label', en: 'WhatsApp label' },
            defaultValue: 'WhatsApp',
        },
        {
            name: 'whatsappNumber',
            type: 'text',
            label: {
                de: 'WhatsApp-Nummer (international, z. B. +491701234567)',
                en: 'WhatsApp number (international, e.g. +491701234567)',
            },
            admin: {
                description: {
                    de: 'Nummer im internationalen Format ohne Leerzeichen. Wird als wa.me Link angezeigt.',
                    en: 'Number in international format without spaces. Displayed as wa.me link.',
                },
            },
        },
        {
            name: 'whatsappText',
            type: 'text',
            localized: true,
            label: {
                de: 'WhatsApp Vorausgefüllte Nachricht (optional)',
                en: 'WhatsApp pre-filled message (optional)',
            },
            admin: {
                description: {
                    de: 'Optionale Nachricht die im Chat vorausgefüllt wird.',
                    en: 'Optional message pre-filled in the chat.',
                },
            },
        },
        {
            name: 'socialLabel',
            type: 'text',
            localized: true,
            label: { de: 'Social-Label', en: 'Social label' },
            defaultValue: 'Folgen',
        },
        {
            name: 'socialUrl',
            type: 'text',
            label: { de: 'Social-URL (z. B. Instagram)', en: 'Social URL (e.g. Instagram)' },
        },
        {
            name: 'socialText',
            type: 'text',
            localized: true,
            label: {
                de: 'Social Anzeige-Text (z. B. @deleyna)',
                en: 'Social display text (e.g. @deleyna)',
            },
        },
    ],
}
