'use client'
import React, { Suspense } from 'react'
import { useParams } from 'next/navigation'

import type { Post, Header, Media as MediaType } from '@/payload-types'

import { Logo } from '@/components/Logo'
import { CMSLink } from '@/components/CMSLink'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { ThemeToggle } from '@/components/ThemeToggle'
import { HeaderSelectionTrigger } from '@/components/Dancefloor/HeaderDancefloorTrigger'
import { CardNav } from './CardNav'
import { buildLocalizedCollectionPath, getLocalizedSlug } from '@/utilities/collectionPaths'
import localization from '@/i18n/localization'

function resolveMediaResource(media: unknown): MediaType | null {
    if (!media || typeof media === 'number') return null
    if (typeof media === 'object') {
        const mediaObj = media as Record<string, unknown>
        if ('value' in mediaObj && mediaObj.value && typeof mediaObj.value === 'object') {
            return mediaObj.value as MediaType
        }
        return media as MediaType
    }
    return null
}

function getLocalizedString(value: unknown, localeCode: string): string {
    if (!value) return ''
    if (typeof value === 'string') return value
    if (typeof value === 'object') {
        const localized = (value as Record<string, string | null | undefined>)[localeCode]
        if (localized) return localized
        const fallback = (value as Record<string, string | null | undefined>)[
            localization.defaultLocale
        ]
        if (fallback) return fallback
        const first = Object.values(value as Record<string, string | null | undefined>).find(
            Boolean,
        )
        if (first) return first as string
    }
    return ''
}

function getHeaderLabelFallback(label: string | null | undefined, localeCode: string): string {
    if (!label) return ''
    const deToEn: Record<string, string> = {
        'Kontakt aufnehmen': 'Get in touch',
        'Jetzt bewerben': 'Apply now',
        'Als Talent bewerben': 'Apply as talent',
        'Projekt anfragen': 'Project request',
        'Für Kunden': 'For Clients',
        'Für Talente': 'For Talents',
        'Über uns': 'About us',
        'Über Deleyna': 'About Deleyna',
        'Alle Talents': 'All talents',
        Tänzer: 'Dancers',
        'Tänzer & Models': 'Dancers & Models',
        'Unsere Services': 'Our services',
        'Booking-Anfrage': 'Booking request',
        Leistungen: 'Services',
        Partnerschaften: 'Partnerships',
    }
    const enToDe: Record<string, string> = Object.fromEntries(
        Object.entries(deToEn).map(([de, en]) => [en, de]),
    )

    if (localeCode === 'en') return deToEn[label] ?? label
    if (localeCode === 'de') return enToDe[label] ?? label
    return label
}

const ALLOWED_HEADER_CTA_APPEARANCES = new Set([
    'primary',
    'secondary',
    'outline',
    'ghost',
    'link',
    'primary-pill',
    'secondary-glass',
    'copper',
])

function normalizeHeaderCtaAppearance(
    appearance: unknown,
): React.ComponentProps<typeof CMSLink>['appearance'] {
    if (typeof appearance === 'string' && ALLOWED_HEADER_CTA_APPEARANCES.has(appearance)) {
        return appearance as React.ComponentProps<typeof CMSLink>['appearance']
    }
    return 'primary-pill'
}

interface HeaderClientProps {
    data: Header
    latestBlog?: Post | null
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data, latestBlog }) => {
    const params = useParams()
    const locale = (params?.locale as string) || 'de'

    const ctaButtons = Array.isArray(data?.ctaButtons) ? data.ctaButtons : []
    const cardNavItems = Array.isArray(data?.cardNavItems) ? data.cardNavItems : []
    const hasLanguageSwitcher =
        data.languageSwitcherPlacement === 'header' ||
        data.languageSwitcherPlacement === 'header-footer'
    const hasThemeToggle =
        data.themeTogglePlacement === 'header' || data.themeTogglePlacement === 'header-footer'
    const hasCtaButtons = ctaButtons.some((item) => Boolean(item?.link))
    const homeUrl = '/'

    const localizedSlug = latestBlog ? getLocalizedSlug(latestBlog.slug, locale) : ''
    const fallbackSlug =
        !localizedSlug && latestBlog
            ? getLocalizedSlug(latestBlog.slug, localization.defaultLocale)
            : ''
    const latestBlogSlug = localizedSlug || fallbackSlug
    const latestBlogPath = latestBlogSlug
        ? buildLocalizedCollectionPath({
              collection: 'posts',
              slug: latestBlogSlug,
              locale: localizedSlug ? locale : localization.defaultLocale,
          })
        : ''
    const latestBlogTitle = latestBlog ? getLocalizedString(latestBlog.title, locale) : ''
    const latestBlogShortTitle = latestBlogTitle
    const latestBlogHeroImage = latestBlog ? resolveMediaResource(latestBlog.featuredImage) : null

    return (
        <header className="fixed top-0 left-0 right-0 z-50 w-full overflow-x-clip">
            <CardNav
                logo={
                    <Logo
                        href={homeUrl}
                        priority
                        className="block h-[32px] md:h-[42px] aspect-[5/2] transition"
                        imageClassName="h-full w-full object-contain"
                    />
                }
                items={cardNavItems.map((item) => {
                    const mediaDisplay = (item.mediaDisplay as 'image' | 'latestBlog') || 'image'
                    const resolvedImage =
                        mediaDisplay === 'image' ? resolveMediaResource(item.image) : null
                    const includeLatestBlog = mediaDisplay === 'latestBlog' && latestBlogPath

                    const rawLabel = getLocalizedString(item.label, locale)
                    return {
                        label: getHeaderLabelFallback(rawLabel || '', locale),
                        labelLink: item.labelLink
                            ? {
                                  ...item.labelLink,
                                  locale,
                              }
                            : null,
                        mediaDisplay,
                        image: resolvedImage,
                        latestBlog: includeLatestBlog
                            ? {
                                  title: latestBlogTitle,
                                  shortTitle: latestBlogShortTitle || latestBlogTitle,
                                  path: latestBlogPath,
                                  heroImage: latestBlogHeroImage,
                              }
                            : null,
                        links: (item.links || []).map((l) => ({
                            link: l.link
                                ? {
                                      ...l.link,
                                      label: getHeaderLabelFallback(l.link.label, locale),
                                      locale,
                                  }
                                : l.link,
                            id: l.id || undefined,
                            icon:
                                typeof l.icon === 'string' && l.icon.trim().length > 0
                                    ? l.icon
                                    : null,
                        })),
                        id: item.id || undefined,
                    }
                })}
                languageSwitcher={
                    hasLanguageSwitcher ? (
                        <Suspense fallback={<span className="h-9 w-9" aria-hidden />}>
                            <LanguageSwitcher size="sm" variant="minimal" />
                        </Suspense>
                    ) : undefined
                }
                themeToggle={hasThemeToggle ? <ThemeToggle /> : undefined}
                dancefloorTrigger={<HeaderSelectionTrigger />}
                ctaButtons={
                    hasCtaButtons
                        ? ctaButtons.map((item) =>
                              item?.link ? (
                                  <div key={item.id} className="h-full flex items-center">
                                      <CMSLink
                                          {...item.link}
                                          label={getHeaderLabelFallback(item.link.label, locale)}
                                          appearance={normalizeHeaderCtaAppearance(
                                              item.link.appearance,
                                          )}
                                          locale={locale}
                                      />
                                  </div>
                              ) : null,
                          )
                        : undefined
                }
            />
        </header>
    )
}
