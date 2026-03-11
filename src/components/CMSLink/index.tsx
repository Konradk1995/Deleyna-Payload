import type { Page, Post, Talent } from '@/payload-types'
import { Link } from '@/i18n/navigation'
import { toHref } from '@/utilities/typedHref'
import { type ButtonProps, buttonVariants } from '@/components/ui/button'
import { cn } from '@/utilities/ui'
import { resolveLocale, withLocalePath } from '@/utilities/locale'

export type CMSLinkProps = {
    appearance?:
        | 'primary'
        | 'secondary'
        | 'outline'
        | 'ghost'
        | 'link'
        | 'inline'
        | 'muted'
        | 'destructive'
        // Legacy aliases (mapped to new variants)
        | 'primary-pill'
        | 'secondary-glass'
        | 'copper'
        | 'nav-cta'
        | null
    archive?: 'posts' | 'talents' | null
    children?: React.ReactNode
    className?: string
    label?: string | null
    newTab?: boolean | null
    onClick?: () => void
    reference?: {
        relationTo: 'pages' | 'posts' | 'talents'
        value: Page | Post | Talent | Record<string, unknown> | string | number
    } | null
    size?: 'sm' | 'md' | 'lg' | null
    trackClicks?: boolean | null
    trackingEventName?: string | null
    type?: 'custom' | 'reference' | 'archive' | 'modal' | null
    url?: string | null
    locale?: string | null
}

const cmsSizeMap = {
    lg: 'lg',
    md: 'default',
    sm: 'sm',
} as const

type ButtonVariant = NonNullable<ButtonProps['variant']>

/** Map legacy appearance names to current variants */
function normalizeAppearance(appearance: CMSLinkProps['appearance']): CMSLinkProps['appearance'] {
    switch (appearance) {
        case 'primary-pill':
        case 'copper':
        case 'nav-cta':
            return 'primary'
        case 'secondary-glass':
            return 'outline'
        default:
            return appearance
    }
}

const buttonAppearanceMap: Record<
    'destructive' | 'ghost' | 'muted' | 'outline' | 'primary' | 'secondary',
    ButtonVariant
> = {
    destructive: 'destructive',
    ghost: 'ghost',
    muted: 'muted',
    outline: 'outline',
    primary: 'primary',
    secondary: 'secondary',
} as const

function getLinkAppearanceClass(
    rawAppearance: CMSLinkProps['appearance'],
    size: CMSLinkProps['size'],
): string {
    const appearance = normalizeAppearance(rawAppearance)

    if (!appearance || appearance === 'inline') {
        return 'text-foreground underline-offset-4 hover:opacity-80'
    }

    if (appearance === 'link') {
        return buttonVariants({ variant: 'link', size: 'clear' })
    }

    if (appearance in buttonAppearanceMap) {
        const buttonVariant = buttonAppearanceMap[appearance as keyof typeof buttonAppearanceMap]
        const buttonSize = size ? cmsSizeMap[size] : cmsSizeMap.md
        return buttonVariants({ size: buttonSize, variant: buttonVariant })
    }

    return 'text-foreground underline-offset-4 hover:opacity-80'
}

const segmentAliases: Record<
    string,
    'blog' | 'talents' | 'contact' | 'about' | 'becomeTalent' | 'terms' | 'testimonials'
> = {
    blog: 'blog',
    magazin: 'blog',
    talents: 'talents',
    talente: 'talents',
    contact: 'contact',
    kontakt: 'contact',
    about: 'about',
    'ueber-uns': 'about',
    'über-uns': 'about',
    'talent-werden': 'becomeTalent',
    'become-talent': 'becomeTalent',
    agb: 'terms',
    terms: 'terms',
    testimonials: 'testimonials',
    erfahrungen: 'testimonials',
}

const localizedSegments: Record<
    'blog' | 'talents' | 'contact' | 'about' | 'becomeTalent' | 'terms' | 'testimonials',
    { de: string; en: string }
> = {
    blog: { de: 'magazin', en: 'blog' },
    talents: { de: 'talente', en: 'talents' },
    contact: { de: 'kontakt', en: 'contact' },
    about: { de: 'ueber-uns', en: 'about' },
    becomeTalent: { de: 'talent-werden', en: 'become-talent' },
    terms: { de: 'agb', en: 'terms' },
    testimonials: { de: 'erfahrungen', en: 'testimonials' },
}

function localizeInternalPath(path: string, locale?: string | null): string {
    if (!path.startsWith('/')) return path
    if (!locale) return path

    const resolvedLocale = resolveLocale(locale)
    const localeKey = resolvedLocale === 'en' ? 'en' : 'de'
    const [rawPath, suffix = ''] = path.split(/([?#].*)/, 2)
    const segments = rawPath.split('/').filter(Boolean)
    const withoutLocale =
        segments[0] === 'de' || segments[0] === 'en' ? segments.slice(1) : segments

    if (withoutLocale.length === 0) {
        return withLocalePath('/', resolvedLocale)
    }

    const canonical = segmentAliases[withoutLocale[0]]
    if (canonical) {
        withoutLocale[0] = localizedSegments[canonical][localeKey]
    }

    const normalized = `/${withoutLocale.join('/')}`
    return `${normalized}${suffix}`
}

export function CMSLink({
    type,
    appearance = 'inline',
    archive,
    children,
    className,
    label,
    newTab,
    onClick,
    reference,
    size,
    trackClicks,
    trackingEventName,
    url,
    locale,
}: CMSLinkProps) {
    let href:
        | string
        | {
              pathname: '/blog' | '/talents' | '/blog/[slug]' | '/talents/[slug]'
              params?: { slug: string }
          }
        | null
        | undefined = url

    if (type === 'reference' && typeof reference?.value === 'object' && reference.value?.slug) {
        if (reference.relationTo === 'pages') {
            const pageSlug = (reference.value as { slug: string }).slug
            const pageHref = pageSlug === 'home' ? '/' : `/${pageSlug}`
            href = localizeInternalPath(pageHref, locale)
        } else if (reference.relationTo === 'talents') {
            href = {
                pathname: '/talents/[slug]',
                params: { slug: (reference.value as { slug: string }).slug },
            }
        } else if (reference.relationTo === 'posts') {
            href = {
                pathname: '/blog/[slug]',
                params: { slug: (reference.value as { slug: string }).slug },
            }
        } else {
            href = `/${reference.relationTo}/${(reference.value as { slug: string }).slug}`
        }
    }

    if (type === 'archive' && archive) {
        href = archive === 'posts' ? { pathname: '/blog' } : { pathname: '/talents' }
    }

    if (type === 'custom' && typeof href === 'string' && !href.startsWith('http')) {
        href = localizeInternalPath(href, locale)
    }

    if (!href) return null

    const isExternal = typeof href === 'string' && href.startsWith('http')
    const newTabProps = newTab
        ? { rel: 'noopener noreferrer', target: '_blank' as const, 'aria-label': label ? `${label} (opens in new tab)` : undefined }
        : {}
    const style = getLinkAppearanceClass(appearance, size)
    const trackingHref =
        typeof href === 'string'
            ? href
            : href.pathname === '/blog/[slug]' || href.pathname === '/talents/[slug]'
              ? `${href.pathname.replace('[slug]', href.params?.slug || '')}`
              : href.pathname

    const trackingAttributes: Record<string, string> = {}
    if (trackClicks) {
        trackingAttributes['data-rybbit-event'] = trackingEventName?.trim() || 'link_click'
        trackingAttributes['data-rybbit-prop-url'] = trackingHref
        if (label) trackingAttributes['data-rybbit-prop-label'] = label
        if (appearance) trackingAttributes['data-rybbit-prop-appearance'] = appearance
        if (newTab) trackingAttributes['data-rybbit-prop-new_tab'] = 'true'
    }

    if (isExternal) {
        return (
            <a
                href={href as string}
                className={cn(style, className)}
                onClick={onClick}
                {...newTabProps}
                {...trackingAttributes}
            >
                {label || children}
            </a>
        )
    }

    return (
        <Link
            href={toHref(href)}
            className={cn(style, className)}
            onClick={onClick}
            {...newTabProps}
            {...trackingAttributes}
        >
            {label || children}
        </Link>
    )
}
