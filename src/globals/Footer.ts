import type { GlobalConfig } from 'payload'
import { adminOnly } from '../access'
import { revalidateFooter } from '../Footer/hooks/revalidateFooter'

export const Footer: GlobalConfig = {
    slug: 'footer',
    label: { de: 'Footer', en: 'Footer' },
    access: {
        read: () => true,
        update: adminOnly,
    },
    admin: {
        group: { de: 'Einstellungen', en: 'Settings' },
        description: { de: 'Footer-Inhalt: Logo, Spalten, Kontakt, Social Media und Bottom Bar (Copyright, Links, Cookie-Link).', en: 'Footer content: logo, columns, contact, social media and bottom bar (copyright, links, cookie link).' },
    },
    hooks: {
        afterChange: [revalidateFooter],
    },
    fields: [
        {
            type: 'tabs',
            tabs: [
                {
                    label: { de: 'Inhalt', en: 'Content' },
                    fields: [
                        {
                            name: 'logo',
                            type: 'upload',
                            label: { de: 'Footer Logo', en: 'Footer logo' },
                            relationTo: 'media',
                        },
                        {
                            name: 'description',
                            type: 'textarea',
                            label: { de: 'Kurzbeschreibung', en: 'Short description' },
                            localized: true,
                        },
                        {
                            name: 'columns',
                            type: 'array',
                            label: { de: 'Link-Spalten', en: 'Link columns' },
                            maxRows: 4,
                            fields: [
                                {
                                    name: 'title',
                                    type: 'text',
                                    label: { de: 'Spalten-Titel', en: 'Column title' },
                                    required: true,
                                    localized: true,
                                },
                                {
                                    name: 'links',
                                    type: 'array',
                                    label: { de: 'Links', en: 'Links' },
                                    maxRows: 8,
                                    fields: [
                                        {
                                            name: 'label',
                                            type: 'text',
                                            label: { de: 'Label', en: 'Label' },
                                            required: true,
                                            localized: true,
                                        },
                                        {
                                            name: 'page',
                                            type: 'relationship',
                                            label: { de: 'Seite', en: 'Page' },
                                            relationTo: 'pages',
                                        },
                                        {
                                            name: 'url',
                                            type: 'text',
                                            label: { de: 'Externe URL', en: 'External URL' },
                                        },
                                        {
                                            name: 'newTab',
                                            type: 'checkbox',
                                            label: { de: 'In neuem Tab öffnen', en: 'Open in new tab' },
                                            defaultValue: false,
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                {
                    label: { de: 'Kontakt', en: 'Contact' },
                    fields: [
                        {
                            name: 'contact',
                            type: 'group',
                            label: { de: 'Kontaktdaten', en: 'Contact details' },
                            fields: [
                                {
                                    name: 'showContact',
                                    type: 'checkbox',
                                    label: { de: 'Kontakt anzeigen', en: 'Show contact' },
                                    defaultValue: true,
                                },
                                {
                                    name: 'title',
                                    type: 'text',
                                    label: { de: 'Überschrift', en: 'Heading' },
                                    defaultValue: 'Kontakt',
                                    localized: true,
                                    admin: {
                                        condition: (_, siblingData) => siblingData?.showContact,
                                    },
                                },
                                {
                                    name: 'email',
                                    type: 'email',
                                    label: { de: 'E-Mail', en: 'Email' },
                                    admin: {
                                        condition: (_, siblingData) => siblingData?.showContact,
                                    },
                                },
                                {
                                    name: 'phone',
                                    type: 'text',
                                    label: { de: 'Telefon', en: 'Phone' },
                                    admin: {
                                        condition: (_, siblingData) => siblingData?.showContact,
                                    },
                                },
                                {
                                    name: 'address',
                                    type: 'textarea',
                                    label: { de: 'Adresse', en: 'Address' },
                                    localized: true,
                                    admin: {
                                        condition: (_, siblingData) => siblingData?.showContact,
                                    },
                                },
                            ],
                        },
                    ],
                },
                {
                    label: { de: 'Social Media', en: 'Social media' },
                    fields: [
                        {
                            name: 'socialLinks',
                            type: 'array',
                            label: { de: 'Social Media Links', en: 'Social media links' },
                            maxRows: 8,
                            fields: [
                                {
                                    name: 'platform',
                                    type: 'select',
                                    label: { de: 'Plattform', en: 'Platform' },
                                    required: true,
                                    options: [
                                        { label: { de: 'Facebook', en: 'Facebook' }, value: 'facebook' },
                                        { label: { de: 'Instagram', en: 'Instagram' }, value: 'instagram' },
                                        { label: { de: 'LinkedIn', en: 'LinkedIn' }, value: 'linkedin' },
                                        { label: { de: 'Twitter/X', en: 'Twitter/X' }, value: 'twitter' },
                                        { label: { de: 'YouTube', en: 'YouTube' }, value: 'youtube' },
                                        { label: { de: 'TikTok', en: 'TikTok' }, value: 'tiktok' },
                                        { label: { de: 'GitHub', en: 'GitHub' }, value: 'github' },
                                        { label: { de: 'Dribbble', en: 'Dribbble' }, value: 'dribbble' },
                                        { label: { de: 'Behance', en: 'Behance' }, value: 'behance' },
                                    ],
                                },
                                {
                                    name: 'url',
                                    type: 'text',
                                    label: { de: 'URL', en: 'URL' },
                                    required: true,
                                },
                            ],
                        },
                    ],
                },
                {
                    label: { de: 'Bottom Bar', en: 'Bottom bar' },
                    fields: [
                        {
                            name: 'copyright',
                            type: 'text',
                            label: { de: 'Copyright Text', en: 'Copyright text' },
                            defaultValue: '© {year} Meine Agentur. Alle Rechte vorbehalten.',
                            localized: true,
                            admin: {
                                description: { de: '{year} wird automatisch ersetzt', en: '{year} is replaced automatically' },
                            },
                        },
                        {
                            name: 'bottomLinks',
                            type: 'array',
                            label: { de: 'Bottom Links (Impressum, Datenschutz)', en: 'Bottom links (imprint, privacy)' },
                            maxRows: 5,
                            fields: [
                                {
                                    name: 'label',
                                    type: 'text',
                                    label: { de: 'Label', en: 'Label' },
                                    required: true,
                                    localized: true,
                                },
                                {
                                    name: 'page',
                                    type: 'relationship',
                                    label: { de: 'Seite', en: 'Page' },
                                    relationTo: 'pages',
                                },
                                {
                                    name: 'url',
                                    type: 'text',
                                    label: { de: 'Externe URL', en: 'External URL' },
                                },
                            ],
                        },
                        {
                            name: 'showCookieSettings',
                            type: 'checkbox',
                            label: { de: 'Cookie-Einstellungen Link anzeigen', en: 'Show cookie settings link' },
                            defaultValue: true,
                        },
                    ],
                },
            ],
        },
    ],
}
