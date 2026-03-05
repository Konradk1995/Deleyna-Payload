import type { Block } from 'payload'

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
        {
            name: 'overline',
            type: 'text',
            localized: true,
            label: { de: 'Overline', en: 'Overline' },
        },
        {
            name: 'title',
            type: 'text',
            required: true,
            localized: true,
            label: { de: 'Titel', en: 'Title' },
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
