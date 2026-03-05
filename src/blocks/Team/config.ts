import type { Block } from 'payload'

export const TeamBlock: Block = {
    slug: 'team',
    interfaceName: 'TeamBlock',
    imageURL: '/block-previews/team.svg',
    imageAltText: 'Team member cards grid',
    labels: { singular: { de: 'Team', en: 'Team' }, plural: { de: 'Team', en: 'Team' } },
    fields: [
        {
            name: 'overline',
            type: 'text',
            localized: true,
            label: { de: 'Overline (z. B. Our Team)', en: 'Overline (e.g. Our Team)' },
        },
        {
            name: 'title',
            type: 'text',
            required: true,
            localized: true,
            label: { de: 'Titel', en: 'Title' },
        },
        {
            name: 'members',
            type: 'array',
            required: true,
            minRows: 1,
            maxRows: 12,
            labels: {
                singular: { de: 'Teammitglied', en: 'Team member' },
                plural: { de: 'Teammitglieder', en: 'Team members' },
            },
            fields: [
                {
                    name: 'name',
                    type: 'text',
                    required: true,
                    localized: true,
                    label: { de: 'Name', en: 'Name' },
                },
                {
                    name: 'role',
                    type: 'text',
                    required: true,
                    localized: true,
                    label: { de: 'Rolle (z. B. Founder & CEO)', en: 'Role (e.g. Founder & CEO)' },
                },
                {
                    name: 'image',
                    type: 'upload',
                    relationTo: 'media',
                    label: { de: 'Bild', en: 'Image' },
                    admin: {
                        description: { de: 'Portrait (optional)', en: 'Portrait (optional)' },
                    },
                },
                {
                    name: 'bio',
                    type: 'textarea',
                    localized: true,
                    label: { de: 'Kurzbeschreibung', en: 'Short bio' },
                },
            ],
        },
    ],
}
