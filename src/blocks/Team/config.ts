import type { Block } from 'payload'
import { sectionHeaderFields } from '@/fields/sectionHeader'

export const TeamBlock: Block = {
    slug: 'team',
    interfaceName: 'TeamBlock',
    imageURL: '/block-previews/team.svg',
    imageAltText: 'Team member cards grid',
    labels: { singular: { de: 'Team', en: 'Team' }, plural: { de: 'Team', en: 'Team' } },
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
            name: 'members',
            type: 'array',
            required: true,
            minRows: 1,
            maxRows: 12,
            labels: {
                singular: { de: 'Teammitglied', en: 'Team member' },
                plural: { de: 'Teammitglieder', en: 'Team members' },
            },
            admin: {
                components: {
                    RowLabel: '@/components/admin/RowLabels#MemberRowLabel',
                },
            },
            fields: [
                {
                    name: 'name',
                    type: 'text',
                    required: true,
                    localized: true,
                    label: { de: 'Name', en: 'Name' },
                    admin: {
                        description: {
                            de: 'Vollständiger Name des Teammitglieds',
                            en: 'Full name of the team member',
                        },
                    },
                },
                {
                    name: 'role',
                    type: 'text',
                    required: true,
                    localized: true,
                    label: { de: 'Rolle (z. B. Founder & CEO)', en: 'Role (e.g. Founder & CEO)' },
                    admin: {
                        description: {
                            de: 'Position oder Rolle im Team',
                            en: 'Position or role within the team',
                        },
                    },
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
                    admin: {
                        description: {
                            de: 'Kurze Biografie oder Beschreibung (optional)',
                            en: 'Short biography or description (optional)',
                        },
                    },
                },
            ],
        },
    ],
}
