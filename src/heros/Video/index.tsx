'use client'

import React from 'react'
import type { Page, Media as MediaType } from '@/payload-types'
import { CMSLink } from '@/components/CMSLink'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { resolveHeroLinkAppearance } from '../resolveHeroLinkAppearance'

export const VideoHero: React.FC<Page['hero']> = (props) => {
    const {
        headline,
        subtext,
        richText,
        links,
        video,
        videoUrl,
        posterImage,
        muted = true,
        loop = true,
        autoPlay = true,
        playsInline = true,
        badge,
    } = props

    const p = props as Record<string, unknown>
    const videoMobile = p.videoMobile
    const videoUrlMobile = p.videoUrlMobile as string | undefined
    const posterImageMobile = p.posterImageMobile

    const desktopVideo = React.useMemo(() => {
        if (videoUrl) {
            const isWebM = videoUrl.toLowerCase().includes('.webm')
            return { url: videoUrl, mimeType: isWebM ? 'video/webm' : 'video/mp4' }
        }
        if (video && typeof video === 'object') {
            const v = video as MediaType
            const url = getMediaUrl(v.url, v.updatedAt)
            const mime =
                (v as MediaType).mimeType ??
                (url.toLowerCase().endsWith('.webm') ? 'video/webm' : 'video/mp4')
            return { url, mimeType: mime }
        }
        return null
    }, [video, videoUrl])

    const mobileVideo = React.useMemo(() => {
        if (videoUrlMobile) {
            const isWebM = videoUrlMobile.toLowerCase().includes('.webm')
            return { url: videoUrlMobile, mimeType: isWebM ? 'video/webm' : 'video/mp4' }
        }
        if (videoMobile && typeof videoMobile === 'object') {
            const v = videoMobile as MediaType
            const url = getMediaUrl(v.url, v.updatedAt)
            const mime =
                (v as MediaType).mimeType ??
                (url.toLowerCase().endsWith('.webm') ? 'video/webm' : 'video/mp4')
            return { url, mimeType: mime }
        }
        return null
    }, [videoMobile, videoUrlMobile])

    const posterSrc = React.useMemo(() => {
        if (posterImage && typeof posterImage === 'object') {
            return getMediaUrl((posterImage as MediaType).url, (posterImage as MediaType).updatedAt)
        }
        return undefined
    }, [posterImage])

    const posterSrcMobile = React.useMemo(() => {
        if (posterImageMobile && typeof posterImageMobile === 'object') {
            return getMediaUrl(
                (posterImageMobile as MediaType).url,
                (posterImageMobile as MediaType).updatedAt,
            )
        }
        return posterSrc
    }, [posterImageMobile, posterSrc])

    return (
        <section className="relative flex min-h-[75vh] items-center justify-center overflow-hidden md:min-h-screen">
            {/* Background Video */}
            {(desktopVideo || mobileVideo) && (
                <div className="absolute inset-0 z-0">
                    {/* Desktop Video */}
                    {desktopVideo && (
                        <video
                            className={cn(
                                'absolute inset-0 w-full h-full object-cover z-0 pointer-events-none',
                                mobileVideo ? 'hidden md:block' : 'block',
                            )}
                            autoPlay={autoPlay ?? true}
                            loop={loop ?? true}
                            muted={muted ?? true}
                            playsInline={playsInline ?? true}
                            poster={posterSrc}
                            preload="metadata"
                        >
                            <source src={desktopVideo.url} type={desktopVideo.mimeType} />
                        </video>
                    )}

                    {/* Mobile Video */}
                    {mobileVideo && (
                        <video
                            className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none block md:hidden"
                            autoPlay={autoPlay ?? true}
                            loop={loop ?? true}
                            muted={muted ?? true}
                            playsInline={playsInline ?? true}
                            poster={posterSrcMobile}
                            preload="metadata"
                        >
                            <source src={mobileVideo.url} type={mobileVideo.mimeType} />
                        </video>
                    )}
                </div>
            )}

            {/* Poster fallback */}
            {!desktopVideo && !mobileVideo && (posterSrc || posterSrcMobile) && (
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${posterSrcMobile || posterSrc})` }}
                />
            )}

            <div className="hero-overlay absolute inset-0 z-[1]" />

            {/* Content */}
            <div className="container relative z-10 padding-section-hero text-center text-on-media md:py-24">
                {badge && <p className="overline mb-4 text-on-media-muted">{badge}</p>}
                {(headline || subtext) && (
                    <div className="mx-auto max-w-3xl">
                        {headline && (
                            <h1
                                className={cn(
                                    'headline-sexy text-gradient-copper font-heading-1-bold leading-none tracking-tight hyphens-auto [overflow-wrap:anywhere] pb-1 text-balance',
                                    subtext ? 'mb-4' : '',
                                )}
                            >
                                {headline}
                            </h1>
                        )}
                        {subtext && (
                            <p className="mx-auto mt-4 max-w-2xl font-medium-text-regular tracking-wide text-balance text-on-media-muted">
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
                            'prose-invert prose-lg mx-auto max-w-3xl',
                            headline || subtext ? 'mt-6' : '',
                        )}
                    />
                )}

                {links && links.length > 0 && (
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                        {links.map(({ link }, i) => {
                            const appearance = resolveHeroLinkAppearance(link.appearance, i)
                            const mediaClass =
                                appearance === 'primary' ||
                                appearance === 'primary-pill' ||
                                appearance === 'copper' ||
                                appearance === 'nav-cta'
                                    ? '!bg-copper !text-background border border-copper/60 hover:border-copper hover:!bg-copper/90 shadow-copper-glow font-bold'
                                    : 'hero-btn-glass'

                            return (
                                <CMSLink
                                    key={i}
                                    {...link}
                                    appearance={appearance}
                                    className={cn(
                                        'inline-flex min-w-32 justify-center',
                                        mediaClass,
                                    )}
                                />
                            )
                        })}
                    </div>
                )}
            </div>
        </section>
    )
}
