import type { ComponentProps } from 'react'
import type { Link } from '@/i18n/navigation'

type LinkHref = ComponentProps<typeof Link>['href']

/**
 * Cast a dynamic CMS path to next-intl's typed href.
 * Centralizes the single unavoidable cast for CMS-driven URLs
 * that can't be statically known at compile time.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toHref(path: string | Record<string, any>): LinkHref {
    return path as LinkHref
}
