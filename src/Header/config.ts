import type { GlobalConfig } from 'payload'

import { adminOnly } from '@/access'
import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
    slug: 'header',
    label: { de: 'Header', en: 'Header' },
    access: {
        read: () => true,
        update: adminOnly,
    },
    admin: {
        group: { de: 'Einstellungen', en: 'Settings' },
        description: {
            de: 'Header-Navigation, Sprachumschalter und CTA-Buttons',
            en: 'Header navigation, language switcher and CTA buttons',
        },
    },
    fields: [
        {
            type: 'tabs',
            tabs: [
                {
                    label: { de: 'Sprache & Anzeige', en: 'Language & display' },
                    fields: [
                        {
                            name: 'languageSwitcherPlacement',
                            type: 'select',
                            label: {
                                de: 'Sprachumschalter Position',
                                en: 'Language switcher position',
                            },
                            defaultValue: 'header',
                            options: [
                                { label: { de: 'Nur Header', en: 'Header only' }, value: 'header' },
                                { label: { de: 'Nur Footer', en: 'Footer only' }, value: 'footer' },
                                {
                                    label: { de: 'Header und Footer', en: 'Header and footer' },
                                    value: 'header-footer',
                                },
                            ],
                            localized: false,
                        },
                        {
                            name: 'themeTogglePlacement',
                            type: 'select',
                            label: {
                                de: 'Theme-Umschalter Position',
                                en: 'Theme toggle placement',
                            },
                            defaultValue: 'header',
                            options: [
                                { label: { de: 'Nur Header', en: 'Header only' }, value: 'header' },
                                { label: { de: 'Nur Footer', en: 'Footer only' }, value: 'footer' },
                                {
                                    label: { de: 'Header und Footer', en: 'Header and footer' },
                                    value: 'header-footer',
                                },
                                { label: { de: 'Ausblenden', en: 'Hidden' }, value: 'hidden' },
                            ],
                            localized: false,
                        },
                    ],
                },
                {
                    label: { de: 'Navigations-Karten', en: 'Navigation cards' },
                    fields: [
                        {
                            name: 'cardNavItems',
                            type: 'array',
                            label: { de: 'Navigations-Karten', en: 'Navigation cards' },
                            localized: true,
                            admin: {
                                description: {
                                    de: 'Navigations-Karten, die sich aus dem Header erweitern',
                                    en: 'Navigation cards that expand from the header',
                                },
                                initCollapsed: true,
                            },
                            fields: [
                                {
                                    name: 'label',
                                    type: 'text',
                                    label: { de: 'Karten-Label', en: 'Card label' },
                                    required: true,
                                    localized: true,
                                    admin: {
                                        description: {
                                            de: 'Das Hauptlabel, das in der Navigation angezeigt wird (z.B. "Talents", "Services", "Über uns")',
                                            en: 'The main label shown in the navigation (e.g. "Talents", "Services", "About us")',
                                        },
                                    },
                                },
                                link({
                                    appearances: false,
                                    disableLabel: true,
                                    optionalLink: true,
                                    overrides: {
                                        name: 'labelLink',
                                        label: {
                                            de: 'Karten-Label Link (Optional)',
                                            en: 'Card label link (optional)',
                                        },
                                        admin: {
                                            description: {
                                                de: 'Das Karten-Label klickbar machen. Leer lassen, wenn das Label kein Link sein soll.',
                                                en: 'Make the card label clickable. Leave empty if the label should not be a link.',
                                            },
                                        },
                                    },
                                }),
                                {
                                    name: 'mediaDisplay',
                                    type: 'select',
                                    label: { de: 'Medien-Anzeige', en: 'Media display' },
                                    defaultValue: 'image',
                                    options: [
                                        {
                                            label: { de: 'Statisches Bild', en: 'Static image' },
                                            value: 'image',
                                        },
                                        {
                                            label: {
                                                de: 'Neuester Blog-Beitrag',
                                                en: 'Latest blog post',
                                            },
                                            value: 'latestBlog',
                                        },
                                    ],
                                    admin: {
                                        description:
                                            'Wählen Sie, ob ein Bild hochgeladen oder automatisch der neueste Blog-Beitrag angezeigt werden soll.',
                                        width: '50%',
                                    },
                                },
                                {
                                    name: 'image',
                                    type: 'upload',
                                    relationTo: 'media',
                                    label: { de: 'Karten-Bild', en: 'Card image' },
                                    required: false,
                                    admin: {
                                        condition: (_, siblingData) =>
                                            siblingData?.mediaDisplay !== 'latestBlog',
                                        description:
                                            'Optionales Bild, das links neben den Links in der Navigations-Karte angezeigt wird.',
                                    },
                                },
                                {
                                    name: 'links',
                                    type: 'array',
                                    label: {
                                        de: 'Karten-Links (Optional)',
                                        en: 'Card links (optional)',
                                    },
                                    required: false,
                                    admin: {
                                        description:
                                            'Links, die in dieser Karte angezeigt werden. Leer lassen, um einen einfachen Navigations-Link ohne Dropdown zu erstellen.',
                                    },
                                    fields: [
                                        link({
                                            appearances: false,
                                        }),
                                        {
                                            name: 'icon',
                                            type: 'text',
                                            label: {
                                                de: 'Icon (Lucide-Name)',
                                                en: 'Icon (Lucide name)',
                                            },
                                            admin: {
                                                description:
                                                    'Optional. Geben Sie einen Lucide-Icon-Namen ein, z.B. ArrowUpRight, Sparkles, Workflow. Leer lassen für den Standard-Pfeil.',
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                {
                    label: { de: 'CTA-Buttons', en: 'CTA buttons' },
                    fields: [
                        {
                            name: 'ctaButtons',
                            type: 'array',
                            label: { de: 'CTA-Buttons', en: 'CTA buttons' },
                            admin: {
                                initCollapsed: true,
                                description: {
                                    de: 'Call-to-Action Buttons im Header (max. 3)',
                                    en: 'Call-to-action buttons in the header (max. 3)',
                                },
                            },
                            maxRows: 3,
                            localized: true,
                            fields: [
                                link({
                                    appearances: [
                                        'primary',
                                        'secondary',
                                        'outline',
                                        'primary-pill',
                                        'secondary-glass',
                                        'copper',
                                    ],
                                }),
                            ],
                        },
                    ],
                },
            ],
        },
    ],
    hooks: {
        beforeChange: [
            ({ data }) => {
                // Clean up invalid labelLink fields before validation
                if (data?.cardNavItems && Array.isArray(data.cardNavItems)) {
                    data.cardNavItems = data.cardNavItems.map((item: Record<string, unknown>) => {
                        if (item && typeof item === 'object') {
                            // Remove labelLink if it's invalid (has type but no reference/url)
                            if (item.labelLink) {
                                const labelLink = item.labelLink as {
                                    type?: string
                                    reference?: unknown
                                    url?: string
                                }
                                // If labelLink has type 'reference' but no reference, remove it
                                if (labelLink.type === 'reference' && !labelLink.reference) {
                                    const { labelLink: _, ...rest } = item
                                    return rest
                                }
                                // If labelLink has type 'custom' but no url, remove it
                                if (labelLink.type === 'custom' && !labelLink.url) {
                                    const { labelLink: _, ...rest } = item
                                    return rest
                                }
                            }
                        }
                        return item
                    })
                }
                return data
            },
        ],
        afterChange: [revalidateHeader],
    },
}
