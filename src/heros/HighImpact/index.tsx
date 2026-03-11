import React from 'react'
import type { Page, Media as MediaType } from '@/payload-types'
import { Media } from '@/components/Media'
import { CMSLink } from '@/components/CMSLink'
import RichText from '@/components/RichText'
import dynamic from 'next/dynamic'

const HeroBackground = dynamic(() =>
    import('../HeroBackground.client').then((mod) => mod.HeroBackground),
)
import { ScrollIndicator } from '@/components/ScrollIndicator'
import { cn } from '@/utilities/ui'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { resolveHeroLinkAppearance } from '../resolveHeroLinkAppearance'

export const HighImpactHero: React.FC<Page['hero']> = ({
    media,
    mediaMobile,
    headline,
    subtext,
    richText,
    links,
    showScrollIndicator,
    heroLogo,
    badge,
}) => {
    const isVideo = (m: MediaType | string | null | undefined): boolean => {
        if (!m || typeof m === 'string') return false

        return Boolean(
            m.mimeType?.includes('video') ||
            (typeof m.url === 'string' &&
                (m.url.toLowerCase().endsWith('.mp4') || m.url.toLowerCase().endsWith('.webm'))),
        )
    }

    const getMediaUrlForVideo = (m: MediaType | string | null | undefined): string =>
        m && typeof m === 'object' && typeof m.url === 'string'
            ? getMediaUrl(m.url, m.updatedAt)
            : ''

    const getMimeType = (m: MediaType | string | null | undefined): string => {
        const url = getMediaUrlForVideo(m)
        return m && typeof m === 'object' && typeof m.mimeType === 'string'
            ? m.mimeType
            : url.toLowerCase().endsWith('.webm')
              ? 'video/webm'
              : 'video/mp4'
    }

    const getPosterUrl = (m: MediaType | string | null | undefined): string | undefined =>
        isVideo(m) && m && typeof m === 'object'
            ? (m.thumbnailURL ??
              (m.sizes as Record<string, { url?: string }> | undefined)?.thumbnail?.url ??
              undefined)
            : undefined

    const hasMediaBackdrop = Boolean(
        (media || mediaMobile) && typeof (media || mediaMobile) === 'object',
    )
    return (
        <section className="relative flex min-h-[75svh] items-center justify-center overflow-hidden md:min-h-[85vh] -mt-[var(--header-h)]">
            {/* Background Content */}
            {(media || mediaMobile) && (
                <div className="absolute inset-0 z-0">
                    {/* Desktop Media */}
                    {media && typeof media === 'object' && (
                        <div
                            className={cn(
                                'absolute inset-0 z-0',
                                mediaMobile ? 'hidden md:block' : 'block',
                            )}
                        >
                            {isVideo(media) ? (
                                <video
                                    aria-hidden="true"
                                    className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    poster={getPosterUrl(media)}
                                    preload="metadata"
                                >
                                    <source
                                        src={getMediaUrlForVideo(media)}
                                        type={getMimeType(media)}
                                    />
                                </video>
                            ) : (
                                <Media
                                    resource={media}
                                    fill
                                    imgClassName="object-cover"
                                    priority
                                    fetchPriority="high"
                                    size="100vw"
                                />
                            )}
                        </div>
                    )}

                    {/* Mobile Media */}
                    {mediaMobile && typeof mediaMobile === 'object' && (
                        <div className="absolute inset-0 z-0 block md:hidden">
                            {isVideo(mediaMobile) ? (
                                <video
                                    aria-hidden="true"
                                    className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    poster={getPosterUrl(mediaMobile)}
                                    preload="metadata"
                                >
                                    <source
                                        src={getMediaUrlForVideo(mediaMobile)}
                                        type={getMimeType(mediaMobile)}
                                    />
                                </video>
                            ) : (
                                <Media
                                    resource={mediaMobile}
                                    fill
                                    imgClassName="object-cover"
                                    priority
                                    fetchPriority="high"
                                    size="100vw"
                                />
                            )}
                        </div>
                    )}
                    <div className="absolute inset-0 hero-overlay z-10" />
                </div>
            )}

            {/* Animated interactive Lovable background */}
            <HeroBackground />

            {/* Content */}
            <div
                className={cn(
                    'container relative z-10 padding-section-hero text-center',
                    hasMediaBackdrop ? 'text-on-media' : 'text-foreground',
                )}
            >
                {heroLogo && typeof heroLogo === 'object' && (
                    <div className="mx-auto mb-8 flex justify-center">
                        <Media
                            resource={heroLogo}
                            className="max-h-24 w-auto md:max-h-32"
                            imgClassName="object-contain drop-shadow-2xl"
                            size="(max-width: 768px) 50vw, 320px"
                        />
                    </div>
                )}
                {badge && (
                    <span className="font-subtext-semibold mb-10 inline-flex items-center gap-3 text-copper">
                        <span className="h-px w-8 bg-copper/60" aria-hidden />
                        {badge}
                        <span className="h-px w-8 bg-copper/60" aria-hidden />
                    </span>
                )}
                {(headline || subtext) && (
                    <div className="mx-auto max-w-3xl">
                        <div className="w-32 h-px mx-auto mb-8 transition-transform duration-1000 scale-x-100 hero-divider" />
                        {headline && (
                            <h1
                                className={cn(
                                    'headline-sexy text-gradient-copper font-heading-1-bold drop-shadow-sm text-balance hyphens-auto [overflow-wrap:anywhere]',
                                    subtext ? 'mb-4' : '',
                                )}
                            >
                                {headline}
                            </h1>
                        )}
                        {subtext && (
                            <p
                                className={cn(
                                    'mx-auto mt-4 max-w-2xl font-medium-text-regular tracking-wide text-balance',
                                    hasMediaBackdrop
                                        ? 'text-on-media-muted drop-shadow-sm'
                                        : 'text-muted-foreground',
                                )}
                            >
                                {subtext}
                            </p>
                        )}
                    </div>
                )}
                {richText && (
                    <RichText
                        data={richText}
                        enableGutter={false}
                        className={cn(
                            'prose-lg mx-auto max-w-3xl',
                            hasMediaBackdrop ? 'prose-invert' : 'prose',
                            headline || subtext ? 'mt-6' : '',
                            '[&_.text-heading]:chrome-text [&_h1]:chrome-text [&_h2]:chrome-text',
                        )}
                    />
                )}

                {links && links.length > 0 && (
                    <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                        {links.map(({ link }, i) => {
                            const appearance = resolveHeroLinkAppearance(link.appearance, i)
                            const isPrimary =
                                appearance === 'primary' ||
                                appearance === 'primary-pill' ||
                                appearance === 'copper' ||
                                appearance === 'nav-cta'
                            const primaryClass =
                                '!bg-copper !text-background border border-copper/60 hover:border-copper hover:!bg-copper/90 shadow-copper-glow font-bold'
                            const mediaClass = isPrimary
                                ? primaryClass
                                : hasMediaBackdrop
                                  ? 'hero-btn-glass'
                                  : 'border-border hover:border-copper/40'

                            return (
                                <CMSLink
                                    key={i}
                                    {...link}
                                    appearance={appearance}
                                    className={cn(
                                        'inline-flex min-w-32 justify-center text-sm',
                                        mediaClass,
                                    )}
                                />
                            )
                        })}
                    </div>
                )}
            </div>

            {showScrollIndicator !== false && <ScrollIndicator targetId="main-content" />}
        </section>
    )
}
