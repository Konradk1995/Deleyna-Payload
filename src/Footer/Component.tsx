import { Link } from '@/i18n/navigation'
import React from 'react'
import { Suspense } from 'react'

import type { Footer as FooterType, Page } from '@/payload-types'

import {
    Dribbble,
    Facebook,
    Github,
    Instagram,
    Linkedin,
    Twitter,
    X,
    Youtube,
    ArrowUpRight,
    type LucideIcon,
} from 'lucide-react'

import { CMSLink } from '@/components/CMSLink'
import { Logo } from '@/components/Logo'
import { ThemeToggle } from '@/components/ThemeToggle'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { getFooter, getCookieBanner, getHeader } from '@/utilities/getGlobals'
import { CookieSettingsButton } from '@/components/CookieBanner/SettingsButton'
import { Media } from '@/components/Media'

const SOCIAL_ICONS: Record<string, LucideIcon> = {
    facebook: Facebook,
    twitter: Twitter,
    x: X,
    linkedin: Linkedin,
    instagram: Instagram,
    youtube: Youtube,
    tiktok: Instagram,
    github: Github,
    dribbble: Dribbble,
    behance: Dribbble,
}

type SocialLinkItem = NonNullable<FooterType['socialLinks']>[number]
type ColumnLink = NonNullable<NonNullable<FooterType['columns']>[number]['links']>[number]
type BottomLink = NonNullable<FooterType['bottomLinks']>[number]

function resolveLinkHref(
    link: ColumnLink | BottomLink,
    locale: string,
): { href: string; newTab: boolean } | null {
    void locale

    const newTab = 'newTab' in link ? Boolean(link.newTab) : false

    if (link.page && typeof link.page === 'object' && 'slug' in link.page) {
        const page = link.page as Page
        const href = page.slug === 'home' || !page.slug ? '/' : `/${page.slug}`
        return { href, newTab }
    }
    if (link.url) {
        const href = link.url.startsWith('http')
            ? link.url
            : link.url.startsWith('/')
              ? link.url
              : `/${link.url}`
        return { href, newTab }
    }
    return null
}

export async function Footer({ locale }: { locale: string }) {
    const footerData = await getFooter(locale)
    const footer: FooterType | null = footerData ?? null
    const fallbackLocale = locale === 'de' ? 'en' : 'de'
    const fallbackFooterData = await getFooter(fallbackLocale)
    const fallbackFooter: FooterType | null = fallbackFooterData ?? null
    const headerData = await getHeader(locale)
    const languagePlacement = headerData?.languageSwitcherPlacement
    const themePlacement = headerData?.themeTogglePlacement

    const cookieBannerData = await getCookieBanner(locale)
    const showCookieButtonInFooter =
        cookieBannerData?.enabled && cookieBannerData?.trigger?.placement === 'footer'
    const cookieSettingsLabel =
        cookieBannerData?.banner?.settingsLabel ||
        (locale === 'de' ? 'Cookie-Einstellungen' : 'Cookie settings')

    const homeUrl = '/'

    const mergeLabel = (
        primary: string | null | undefined,
        fallback: string | null | undefined,
    ): string | null => {
        if (typeof primary === 'string' && primary.trim().length > 0) return primary
        if (typeof fallback === 'string' && fallback.trim().length > 0) return fallback
        return null
    }

    const primaryColumns = footer?.columns ?? []
    const fallbackColumns = fallbackFooter?.columns ?? []
    const mergedColumns = (primaryColumns.length > 0 ? primaryColumns : fallbackColumns)
        .map((col, colIdx) => {
            const fallbackCol = fallbackColumns[colIdx]
            const title = mergeLabel(
                typeof col?.title === 'string' ? col.title : null,
                typeof fallbackCol?.title === 'string' ? fallbackCol.title : null,
            )

            const primaryLinks = col?.links ?? []
            const fallbackLinks = fallbackCol?.links ?? []
            const links = (primaryLinks.length > 0 ? primaryLinks : fallbackLinks)
                .map((link, linkIdx) => {
                    const fallbackLink = fallbackLinks[linkIdx]
                    const sourceLink = link ?? fallbackLink
                    if (!sourceLink) return null
                    const label = mergeLabel(
                        typeof link?.label === 'string' ? link.label : null,
                        typeof fallbackLink?.label === 'string' ? fallbackLink.label : null,
                    )

                    const page = link?.page ?? fallbackLink?.page ?? null
                    const url = link?.url ?? fallbackLink?.url ?? null
                    const newTab = Boolean(
                        'newTab' in (link ?? {}) ? link?.newTab : fallbackLink?.newTab,
                    )

                    if (!label || (!page && !url)) return null
                    return {
                        ...(sourceLink as ColumnLink),
                        label,
                        page,
                        url,
                        newTab,
                    } as ColumnLink
                })
                .filter(Boolean) as ColumnLink[]

            if (!title || links.length === 0) return null
            return { ...col, title, links }
        })
        .filter(Boolean) as Array<{ id?: string | null; title: string; links: ColumnLink[] }>

    const columns = mergedColumns

    const socialLinks = (footer?.socialLinks ?? fallbackFooter?.socialLinks ?? []).map(
        (item: SocialLinkItem) => {
            const Icon = SOCIAL_ICONS[item.platform] ?? SOCIAL_ICONS.instagram
            return {
                id: item.id ?? item.platform,
                platform: item.platform,
                url: item.url,
                Icon,
            }
        },
    )

    const contact = footer?.contact ?? fallbackFooter?.contact
    const showContact =
        contact?.showContact !== false && (contact?.email || contact?.phone || contact?.address)
    const copyrightText =
        footer?.copyright ??
        fallbackFooter?.copyright ??
        (locale === 'de'
            ? '© {year} Deleyna. Alle Rechte vorbehalten.'
            : '© {year} Deleyna. All rights reserved.')
    const currentYear = new Date().getFullYear()
    const copyright = copyrightText.replace('{year}', String(currentYear))

    const primaryBottomLinks = footer?.bottomLinks ?? []
    const fallbackBottomLinks = fallbackFooter?.bottomLinks ?? []
    const bottomLinks = (primaryBottomLinks.length > 0 ? primaryBottomLinks : fallbackBottomLinks)
        .map((item, idx) => {
            const fallbackItem = fallbackBottomLinks[idx]
            const sourceItem = item ?? fallbackItem
            if (!sourceItem) return null
            const label = mergeLabel(
                typeof item?.label === 'string' ? item.label : null,
                typeof fallbackItem?.label === 'string' ? fallbackItem.label : null,
            )
            const page = item?.page ?? fallbackItem?.page ?? null
            const url = item?.url ?? fallbackItem?.url ?? null
            if (!label || (!page && !url)) return null
            return { ...(sourceItem as BottomLink), label, page, url } as BottomLink
        })
        .filter(Boolean) as BottomLink[]
    const showCookieSettings = footer?.showCookieSettings !== false
    const showLanguageSwitcherInFooter =
        languagePlacement === 'footer' || languagePlacement === 'header-footer'
    const showThemeToggleInFooter =
        themePlacement === 'footer' || themePlacement === 'header-footer'

    const logoSource =
        (footer?.logo && typeof footer.logo === 'object' ? footer.logo : null) ||
        (fallbackFooter?.logo && typeof fallbackFooter.logo === 'object'
            ? fallbackFooter.logo
            : null)
    const logoMedia = logoSource
    const description = (footer?.description ?? fallbackFooter?.description ?? '').trim()

    // Calculate grid columns: 1 (brand) + columns count + contact (if shown)
    const gridSections = 1 + columns.length + (showContact ? 1 : 0)
    const gridColsClass =
        gridSections <= 3
            ? 'lg:grid-cols-3'
            : gridSections <= 4
              ? 'lg:grid-cols-4'
              : 'lg:grid-cols-5'

    return (
        <footer className="mt-auto border-t border-border/60 bg-muted/20 text-foreground">
            <div className="container py-12 md:py-14">
                {/* Main footer grid */}
                <div className={`grid grid-cols-1 gap-8 sm:grid-cols-2 md:gap-10 ${gridColsClass}`}>
                    {/* Brand column: Logo + description + socials + toggles */}
                    <div
                        className={`flex flex-col gap-4 col-span-1 ${
                            columns.length > 0 || showContact ? 'sm:col-span-2 lg:col-span-2' : ''
                        }`}
                    >
                        <Link href={homeUrl} className="flex items-center gap-3">
                            {logoMedia ? (
                                <Media
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    resource={logoMedia as any}
                                    className="max-h-10 w-auto"
                                    imgClassName="max-h-10 w-auto"
                                />
                            ) : (
                                <Logo href={null} className="max-w-[2.5rem] w-[2.5rem]" />
                            )}
                            <span className="text-label-small text-foreground">
                                Deleyna
                            </span>
                        </Link>
                        {description && (
                            <p className="mb-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
                                {description}
                            </p>
                        )}
                        <div className="flex items-center gap-3 pt-1">
                            {showThemeToggleInFooter && <ThemeToggle />}
                            {showLanguageSwitcherInFooter && (
                                <Suspense fallback={<span className="h-9 w-9" aria-hidden />}>
                                    <LanguageSwitcher size="sm" variant="minimal" />
                                </Suspense>
                            )}
                            {showCookieButtonInFooter && showCookieSettings && (
                                <CookieSettingsButton locale={locale}>
                                    {cookieSettingsLabel}
                                </CookieSettingsButton>
                            )}
                        </div>
                        {socialLinks.length > 0 && (
                            <div className="flex flex-wrap gap-3">
                                {socialLinks.map((social) => (
                                    <a
                                        key={social.id}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={social.platform}
                                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/30 text-foreground/60 transition duration-300 hover:border-copper/50 hover:bg-copper/12 hover:text-copper hover:shadow-md hover:shadow-copper/25 hover:scale-105 active:scale-95"
                                    >
                                        <social.Icon className="h-4 w-4" aria-hidden="true" />
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Link group columns */}
                    {columns.map((col) => (
                        <div key={col.id ?? col.title} className="flex flex-col gap-3 col-span-1">
                            <p className="mb-4 text-label-small text-foreground/90">
                                {col.title}
                            </p>
                            <nav className="flex flex-col gap-2">
                                {(col.links ?? []).map((link, idx) => {
                                    const resolved = resolveLinkHref(link, locale)
                                    if (!resolved) return null
                                    const label =
                                        typeof link.label === 'string'
                                            ? link.label
                                            : (link as ColumnLink).label
                                    return (
                                        <CMSLink
                                            key={link.id ?? idx}
                                            type="custom"
                                            url={resolved.href}
                                            newTab={resolved.newTab}
                                            appearance="inline"
                                            className="group inline-flex items-center gap-1 !no-underline text-sm !text-muted-foreground transition-colors duration-200 hover:!text-foreground"
                                        >
                                            {label ?? ''}
                                            <ArrowUpRight
                                                size={12}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                            />
                                        </CMSLink>
                                    )
                                })}
                            </nav>
                        </div>
                    ))}

                    {/* Contact column */}
                    {showContact && contact && (
                        <div className="flex flex-col gap-3 col-span-1">
                            {contact.title && (
                                <p className="mb-4 text-label-small text-foreground/90">
                                    {contact.title}
                                </p>
                            )}
                            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                                {contact.email && (
                                    <a
                                        href={`mailto:${contact.email}`}
                                        className="hover:text-foreground transition-colors"
                                    >
                                        {contact.email}
                                    </a>
                                )}
                                {contact.phone && (
                                    <a
                                        href={`tel:${contact.phone}`}
                                        className="hover:text-foreground transition-colors"
                                    >
                                        {contact.phone}
                                    </a>
                                )}
                                {contact.address && (
                                    <p className="whitespace-pre-line">{contact.address}</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Legal bar */}
                {(copyright || bottomLinks.length > 0) && (
                    <div className="mt-10 flex flex-col gap-4 border-t border-border/40 pt-6 md:flex-row md:items-center md:justify-between">
                        <span className="text-xs text-muted-foreground">{copyright}</span>
                        {(bottomLinks.length > 0 ||
                            (showCookieSettings && showCookieButtonInFooter)) && (
                            <div className="flex flex-col gap-2 text-xs md:flex-row md:items-center md:gap-6">
                                {bottomLinks.map((item, idx) => {
                                    const resolved = resolveLinkHref(item, locale)
                                    if (!resolved) return null
                                    const label = item.label ?? ''
                                    return (
                                        <CMSLink
                                            key={item.id ?? idx}
                                            type="custom"
                                            url={resolved.href}
                                            appearance="inline"
                                            className="text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {label}
                                        </CMSLink>
                                    )
                                })}
                                {showCookieSettings && showCookieButtonInFooter && (
                                    <CookieSettingsButton
                                        locale={locale}
                                        className="!text-muted-foreground hover:!text-foreground"
                                    >
                                        {cookieSettingsLabel}
                                    </CookieSettingsButton>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </footer>
    )
}
