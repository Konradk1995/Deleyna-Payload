import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
    slug: 'footer',
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'brandLabel',
            type: 'text',
            label: { de: 'Marken-Label', en: 'Brand label' },
            localized: true,
            admin: {
                description: { de: 'Wird neben dem Logo im Footer angezeigt.', en: 'Displayed next to the logo in the footer.' },
            },
        },
        {
            name: 'tagline',
            type: 'textarea',
            label: { de: 'Tagline', en: 'Tagline' },
            localized: true,
            admin: {
                rows: 3,
                description: { de: 'Kurzbeschreibung unter dem Logo.', en: 'Short description shown beneath the logo.' },
            },
        },
        {
            name: 'socialLinks',
            type: 'array',
            label: { de: 'Social Links', en: 'Social links' },
            localized: false,
            maxRows: 6,
            admin: {
                description: { de: 'Social-Profile als Icon-Buttons anzeigen.', en: 'Add social profiles displayed as icon buttons.' },
                initCollapsed: true,
            },
            fields: [
                {
                    name: 'platform',
                    type: 'select',
                    label: { de: 'Plattform', en: 'Platform' },
                    required: true,
                    defaultValue: 'custom',
                    options: [
                        { label: { de: 'Facebook', en: 'Facebook' }, value: 'facebook' },
                        { label: { de: 'X / Twitter', en: 'X / Twitter' }, value: 'x' },
                        { label: { de: 'LinkedIn', en: 'LinkedIn' }, value: 'linkedin' },
                        { label: { de: 'Instagram', en: 'Instagram' }, value: 'instagram' },
                        { label: { de: 'YouTube', en: 'YouTube' }, value: 'youtube' },
                        { label: { de: 'TikTok', en: 'TikTok' }, value: 'tiktok' },
                        { label: { de: 'GitHub', en: 'GitHub' }, value: 'github' },
                        { label: { de: 'Dribbble', en: 'Dribbble' }, value: 'dribbble' },
                        { label: { de: 'Behance', en: 'Behance' }, value: 'behance' },
                        { label: { de: 'Custom / Andere', en: 'Custom / Other' }, value: 'custom' },
                    ],
                },
                {
                    name: 'ariaLabel',
                    type: 'text',
                    label: { de: 'Barrierefreies Label', en: 'Accessible label' },
                    admin: {
                        description:
                            { de: 'Optional. Für Screenreader; bei Leerlass wird der Plattformname verwendet.', en: 'Optional. Used for screen readers if left blank the platform name is used.' },
                    },
                },
                link({
                    disableLabel: true,
                    appearances: false,
                    overrides: {
                        admin: {
                            description: { de: 'Link zum Social-Profil. Interne oder externe URLs möglich.', en: 'Link to the social profile. Internal or external URLs are supported.' },
                        },
                    },
                }),
            ],
        },
        {
            name: 'navGroups',
            type: 'array',
            label: { de: 'Navigations-Gruppen', en: 'Navigation groups' },
            localized: true,
            admin: {
                description: { de: 'Footer-Links in Spalten gruppieren.', en: 'Group footer links into columns.' },
                initCollapsed: true,
            },
            maxRows: 4,
            fields: [
                {
                    name: 'title',
                    type: 'text',
                    label: { de: 'Gruppentitel', en: 'Group title' },
                    required: true,
                    localized: true,
                },
                {
                    name: 'links',
                    type: 'array',
                    label: { de: 'Links', en: 'Links' },
                    minRows: 1,
                    localized: true,
                    fields: [
                        link({
                            appearances: false,
                        }),
                    ],
                },
            ],
        },
        {
            name: 'navItems',
            type: 'array',
            localized: true,
            fields: [
                link({
                    appearances: false,
                }),
            ],
            maxRows: 6,
            admin: {
                description: { de: 'Legacy: flache Liste von Footer-Links. Besser: Navigations-Gruppen.', en: 'Legacy flat list of footer links. Prefer Navigation groups.' },
                initCollapsed: true,
                components: {
                    RowLabel: '@/Footer/RowLabel#RowLabel',
                },
            },
        },
    ],
    hooks: {
        beforeChange: [
            ({ data }) => {
                // Clean up invalid link fields before validation
                if (data?.socialLinks && Array.isArray(data.socialLinks)) {
                    data.socialLinks = data.socialLinks
                        .map((item: Record<string, unknown>) => {
                            if (item?.link) {
                                const link = item.link as {
                                    type?: string
                                    reference?: unknown
                                    url?: string
                                }
                                // If link has type 'reference' but no reference, remove the entire item
                                if (link.type === 'reference' && !link.reference) {
                                    return null
                                }
                                // If link has type 'custom' but no url, remove the entire item
                                if (link.type === 'custom' && !link.url) {
                                    return null
                                }
                            }
                            // If no link at all, remove the item
                            if (!item?.link) {
                                return null
                            }
                            return item
                        })
                        .filter((item: Record<string, unknown> | null) => item !== null)
                }
                // Clean up invalid links in navGroups
                if (data?.navGroups && Array.isArray(data.navGroups)) {
                    data.navGroups = data.navGroups.map((group: Record<string, unknown>) => {
                        if (group?.links && Array.isArray(group.links)) {
                            group.links = group.links
                                .map((item: Record<string, unknown>) => {
                                    if (item?.link) {
                                        const link = item.link as {
                                            type?: string
                                            reference?: unknown
                                            url?: string
                                        }
                                        if (link.type === 'reference' && !link.reference) {
                                            return null
                                        }
                                        if (link.type === 'custom' && !link.url) {
                                            return null
                                        }
                                    }
                                    // If no link at all, remove the item
                                    if (!item?.link) {
                                        return null
                                    }
                                    return item
                                })
                                .filter((item: Record<string, unknown> | null) => item !== null)
                        }
                        return group
                    })
                }
                return data
            },
        ],
        afterChange: [revalidateFooter],
    },
}
