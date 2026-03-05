import type { Field, GroupField } from 'payload'
import deepMerge from '@/utilities/deepMerge'

export type LinkAppearance =
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'ghost'
    | 'link'
    | 'primary-pill'
    | 'secondary-glass'
    | 'copper'

export const appearanceOptions: Record<
    LinkAppearance,
    { label: { de: string; en: string }; value: LinkAppearance }
> = {
    primary: { label: { de: 'Schwarz (Primary)', en: 'Black (Primary)' }, value: 'primary' },
    secondary: {
        label: { de: 'Surface (Secondary)', en: 'Surface (Secondary)' },
        value: 'secondary',
    },
    outline: { label: { de: 'Outline / Glass', en: 'Outline / Glass' }, value: 'outline' },
    ghost: { label: { de: 'Ghost', en: 'Ghost' }, value: 'ghost' },
    link: { label: { de: 'Link', en: 'Link' }, value: 'link' },
    'primary-pill': {
        label: { de: 'Pill-Button (Primary)', en: 'Pill Button (Primary)' },
        value: 'primary-pill',
    },
    'secondary-glass': {
        label: { de: 'Glass-Button (Secondary)', en: 'Glass Button (Secondary)' },
        value: 'secondary-glass',
    },
    copper: { label: { de: 'Kupfer (Copper)', en: 'Copper (Copper)' }, value: 'copper' },
}

type LinkFieldOptions = {
    appearances?: LinkAppearance[] | false
    disableLabel?: boolean
    /** Make all fields optional (for optional CTAs in globals) */
    optionalLink?: boolean
    overrides?: Partial<GroupField>
}

export const link = ({
    appearances,
    disableLabel = false,
    optionalLink = false,
    overrides = {},
}: LinkFieldOptions = {}): Field => {
    const isEmpty = (value: unknown): boolean => {
        if (value == null) return true
        if (typeof value === 'string') return value.trim().length === 0
        if (Array.isArray(value)) return value.length === 0
        if (typeof value === 'object') {
            if ('value' in (value as Record<string, unknown>)) {
                const relValue = (value as { value?: unknown }).value
                return relValue == null || (typeof relValue === 'string' && relValue.length === 0)
            }
            return Object.keys(value as Record<string, unknown>).length === 0
        }
        return false
    }

    const linkResult: GroupField = {
        name: 'link',
        type: 'group',
        admin: {
            hideGutter: true,
        },
        fields: [
            {
                type: 'row',
                fields: [
                    {
                        name: 'type',
                        type: 'radio',
                        enumName: 'l_t',
                        admin: {
                            layout: 'horizontal',
                            width: '50%',
                        },
                        defaultValue: 'reference',
                        options: [
                            {
                                label: { de: 'Interne Seite', en: 'Internal page' },
                                value: 'reference',
                            },
                            { label: { de: 'Externe URL', en: 'External URL' }, value: 'custom' },
                            { label: { de: 'Archiv-Seite', en: 'Archive page' }, value: 'archive' },
                        ],
                    },
                    {
                        name: 'newTab',
                        type: 'checkbox',
                        admin: {
                            style: { alignSelf: 'flex-end' },
                            width: '50%',
                        },
                        label: { de: 'In neuem Tab öffnen', en: 'Open in new tab' },
                    },
                ],
            },
            {
                name: 'reference',
                type: 'relationship',
                admin: {
                    condition: (_, siblingData) => siblingData?.type === 'reference',
                },
                label: { de: 'Seite', en: 'Page' },
                relationTo: ['pages', 'posts', 'talents'],
                required: false,
                validate: (
                    value: unknown,
                    { siblingData }: { siblingData?: { type?: string } },
                ) => {
                    if (optionalLink) return true
                    if (siblingData?.type !== 'reference') return true
                    return isEmpty(value)
                        ? 'Please select an internal page / Bitte interne Seite wählen'
                        : true
                },
            },
            {
                name: 'url',
                type: 'text',
                localized: true,
                admin: {
                    condition: (_, siblingData) => siblingData?.type === 'custom',
                },
                label: { de: 'URL', en: 'URL' },
                required: false,
                validate: (
                    value: unknown,
                    { siblingData }: { siblingData?: { type?: string } },
                ) => {
                    if (optionalLink) return true
                    if (siblingData?.type !== 'custom') return true
                    return isEmpty(value) ? 'Please enter a URL / Bitte URL eingeben' : true
                },
            },
            {
                name: 'archive',
                type: 'select',
                enumName: 'l_ar',
                admin: {
                    condition: (_, siblingData) => siblingData?.type === 'archive',
                },
                label: { de: 'Archiv-Seite', en: 'Archive page' },
                options: [
                    { label: { de: 'Blog', en: 'Blog' }, value: 'posts' },
                    { label: { de: 'Talente', en: 'Talents' }, value: 'talents' },
                ],
                validate: (
                    value: unknown,
                    { siblingData }: { siblingData?: { type?: string } },
                ) => {
                    if (optionalLink) return true
                    if (siblingData?.type !== 'archive') return true
                    return isEmpty(value) ? 'Please select an archive / Bitte Archiv wählen' : true
                },
            },
        ],
    }

    if (!disableLabel) {
        linkResult.fields.push({
            name: 'label',
            type: 'text',
            localized: true,
            label: { de: 'Label', en: 'Label' },
            required: !optionalLink,
        })
    }

    if (appearances !== false) {
        const options = appearances
            ? appearances.map((a) => appearanceOptions[a])
            : Object.values(appearanceOptions)

        linkResult.fields.push({
            name: 'appearance',
            type: 'select',
            enumName: 'l_ap',
            defaultValue: appearances?.[0] || 'primary',
            options,
        })
    }

    linkResult.fields.push({
        name: 'trackClicks',
        type: 'checkbox',
        label: { de: 'Klick-Tracking aktivieren', en: 'Enable click tracking' },
        admin: {
            description: {
                de: 'Sendet ein Event an Rybbit Analytics, wenn dieser Link geklickt wird.',
                en: 'Sends an event to Rybbit Analytics when this link is clicked.',
            },
        },
    })

    linkResult.fields.push({
        name: 'trackingEventName',
        type: 'text',
        label: { de: 'Tracking-Event-Name', en: 'Tracking event name' },
        admin: {
            condition: (_data, siblingData) => Boolean(siblingData?.trackClicks),
            description: {
                de: "Standardmäßig 'link_click', wenn leer gelassen.",
                en: "Default 'link_click' when left empty.",
            },
        },
    })

    return deepMerge(linkResult, overrides as Record<string, unknown>) as Field
}

export const linkField = link
