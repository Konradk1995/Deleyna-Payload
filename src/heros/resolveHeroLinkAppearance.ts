import type { CMSLinkProps } from '@/components/CMSLink'

const HERO_SAFE_APPEARANCES: ReadonlySet<
    Exclude<NonNullable<CMSLinkProps['appearance']>, 'secondary' | 'inline' | 'link'>
> =
    new Set([
        'primary',
        'outline',
        'ghost',
        'muted',
        'destructive',
        'primary-pill',
        'secondary-glass',
        'copper',
        'nav-cta',
    ])

export function resolveHeroLinkAppearance(
    rawAppearance: string | null | undefined,
    index: number,
): CMSLinkProps['appearance'] {
    if (rawAppearance && HERO_SAFE_APPEARANCES.has(rawAppearance as never)) {
        return rawAppearance as CMSLinkProps['appearance']
    }

    return index === 0 ? 'primary' : 'outline'
}
