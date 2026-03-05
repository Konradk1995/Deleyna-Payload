import React from 'react'
import type { LucideIcon } from 'lucide-react'
import { icons as lucideIcons } from 'lucide-react'
import type { Media as MediaType } from '@/payload-types'

export type CardNavItem = {
    label: string
    labelLink?: {
        type?: 'custom' | 'reference' | 'archive' | 'modal' | null
        url?: string | null
        label?: string | null
        locale?: string | null
        newTab?: boolean | null
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        reference?: any
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        archiveCollection?: any
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        modal?: any
    } | null
    image?: MediaType | null
    mediaDisplay?: 'image' | 'latestBlog'
    latestBlog?: {
        title: string
        shortTitle?: string | null
        path: string
        heroImage?: MediaType | null
    } | null
    links: Array<{
        link?: {
            type?: 'custom' | 'reference' | 'archive' | 'modal' | null
            url?: string | null
            label?: string | null
            locale?: string | null
            newTab?: boolean | null
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            reference?: any
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            archiveCollection?: any
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            modal?: any
        }
        id?: string | null
        icon?: string | null
    }>
    id?: string
}

const iconMap = lucideIcons as Record<string, LucideIcon>

export const normalizeIconName = (icon?: string | null): string | undefined => {
    if (!icon) return undefined
    if (iconMap[icon]) return icon

    const normalizedInput = icon.toString().trim()
    const strippedPrefix = normalizedInput.replace(/^lucide:/i, '')
    const cleaned = strippedPrefix.replace(/[^\w\s-]/g, ' ').replace(/\s+/g, ' ')

    const pascal = cleaned
        .split(/[-_\s]/)
        .filter(Boolean)
        .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
        .join('')

    if (iconMap[pascal]) return pascal

    return undefined
}

export const renderLinkIcon = (icon?: string | null, className?: string) => {
    const normalized = normalizeIconName(icon)
    if (!normalized) return null

    const IconComponent = iconMap[normalized]
    if (!IconComponent) return null

    return <IconComponent className={className} aria-hidden />
}
