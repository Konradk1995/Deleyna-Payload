'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { CMSLink } from '@/components/CMSLink'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import type { MediaCard } from './types'
import { getToneStyles } from './toneStyles'

type VideoCardClientProps = {
    videoCard?: MediaCard | null
    tone: ReturnType<typeof getToneStyles>
}

/** Nur Bild: keine Video-Logik, kein Video-Tag, keine Buttons – wird gemountet wenn backgroundMedia kein Video ist */
function MediaCardStatic({ videoCard, tone }: VideoCardClientProps) {
    if (!videoCard) return null
    const hasMedia = Boolean(videoCard?.backgroundMedia)
    return (
        <div
            className={cn(
                'relative flex flex-col block-card-base block-card-min-h overflow-clip shadow-sm hover:-translate-y-0.5 hover:shadow-md',
                !videoCard?.backgroundMedia && tone.fallback,
            )}
        >
            {videoCard?.backgroundMedia && (
                <>
                    <Media
                        resource={videoCard.backgroundMedia}
                        imgClassName="absolute inset-0 h-full w-full object-cover"
                        videoClassName="absolute inset-0 h-full w-full object-cover"
                        size="(max-width: 1280px) 100vw, 1280px"
                    />
                    <div className={cn('absolute inset-0', tone.overlay)} />
                </>
            )}
            <div className="relative z-10 flex-1 flex flex-col sm:flex-row">
                <div className="order-2 sm:order-1 flex-1 min-w-0" />
                <div
                    className={cn(
                        'relative order-1 sm:order-2 w-full sm:w-[55%] md:w-[45%] flex-1 flex flex-col justify-center min-w-0',
                    )}
                >
                    <div className={cn('absolute inset-0', tone.sideOverlay)} />
                    <div
                        className={cn(
                            'relative z-10 m-4 sm:m-6 padding-large flex flex-col justify-center',
                            hasMedia && 'rounded-[var(--block-radius)]',
                            hasMedia && tone.contentSurface,
                        )}
                    >
                        {videoCard?.title && (
                            <h3 className={cn('font-heading-5-bold mb-3', tone.heading)}>
                                {videoCard.title}
                            </h3>
                        )}
                        {videoCard?.description && (
                            <p
                                className={cn(
                                    'font-normal-text-regular text-muted-foreground md:font-medium-text-regular break-words',
                                    tone.body,
                                )}
                            >
                                {videoCard.description}
                            </p>
                        )}
                        {videoCard?.link && (
                            <div className="mt-4">
                                <CMSLink
                                    {...videoCard.link}
                                    label={videoCard.link.label || 'Watch Video'}
                                    className={cn(
                                        'text-sm font-semibold underline underline-offset-4 break-all',
                                        tone.link,
                                    )}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

const btnClass =
    'flex h-11 w-11 items-center justify-center rounded-full border-0 bg-background/20 text-on-media shadow-lg backdrop-blur-md transition duration-300 hover:scale-105 hover:bg-background/35 focus:outline-none focus:ring-2 focus:ring-ring/50'

function IconMuted() {
    return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
        </svg>
    )
}

function IconSound() {
    return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
        </svg>
    )
}

function IconFullscreen() {
    return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
        </svg>
    )
}

/** Volle Video-Card: nur rendern wenn backgroundMedia ein Video ist – dann wird die ganze Video-Logik geladen */
function VideoCardWithVideo({ videoCard, tone }: VideoCardClientProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const videoRef = useRef<HTMLVideoElement>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isMuted, setIsMuted] = useState(true)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const hasMedia = Boolean(videoCard?.backgroundMedia)

    // Sync muted state to video element
    useEffect(() => {
        const video = videoRef.current
        if (video) video.muted = isMuted
    }, [isMuted])

    useEffect(() => {
        const video = videoRef.current
        if (!video) return

        const handlePlay = () => setIsPlaying(true)
        const handlePause = () => setIsPlaying(false)

        video.addEventListener('play', handlePlay)
        video.addEventListener('pause', handlePause)

        return () => {
            video.removeEventListener('play', handlePlay)
            video.removeEventListener('pause', handlePause)
        }
    }, [])

    // Fullscreen-Status für Overlay (im Vollbild kein Overlay)
    useEffect(() => {
        const container = containerRef.current
        if (!container) return
        const onFullscreenChange = () => {
            setIsFullscreen(document.fullscreenElement === container)
        }
        document.addEventListener('fullscreenchange', onFullscreenChange)
        return () => document.removeEventListener('fullscreenchange', onFullscreenChange)
    }, [])

    // Beim Reinscrollen starten, beim Rausscrollen pausieren
    useEffect(() => {
        const container = containerRef.current
        const video = videoRef.current
        if (!container || !video) return

        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries
                if (!entry) return
                if (entry.isIntersecting) {
                    video.play().catch(() => {})
                } else {
                    video.pause()
                }
            },
            { threshold: 0.25, rootMargin: '0px' },
        )
        observer.observe(container)
        return () => observer.disconnect()
    }, [])

    const handleTogglePlayback = useCallback(async () => {
        const video = videoRef.current
        if (!video) return

        if (video.paused) {
            try {
                await video.play()
            } catch {
                video.muted = true
                setIsMuted(true)
            }
        } else {
            video.pause()
        }
    }, [])

    const handleToggleMute = useCallback(() => {
        setIsMuted((m) => !m)
    }, [])

    const handleFullscreen = useCallback(() => {
        const el = containerRef.current
        if (!el) return
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => {})
        } else {
            el.requestFullscreen().catch(() => {})
        }
    }, [])

    if (!videoCard) {
        return null
    }

    // Payload Media: url ist die echte Abspiel-URL (S3 oder Server); sonst Fallback /media/filename
    const media = typeof videoCard.backgroundMedia === 'object' ? videoCard.backgroundMedia : null
    const videoSrc = media
        ? getMediaUrl(media.url ?? (media.filename ? `/media/${media.filename}` : ''))
        : ''

    return (
        <div
            ref={containerRef}
            className={cn(
                'relative flex flex-col block-card-base block-card-min-h overflow-clip shadow-sm hover:-translate-y-0.5 hover:shadow-md',
                !videoCard?.backgroundMedia && tone.fallback,
            )}
        >
            {videoCard?.backgroundMedia && (
                <>
                    {videoSrc ? (
                        <video
                            className="absolute inset-0 h-full w-full object-cover bg-foreground/5"
                            loop
                            muted
                            playsInline
                            preload="metadata"
                            ref={videoRef}
                            src={videoSrc}
                            crossOrigin="anonymous"
                        />
                    ) : null}
                    {!isFullscreen && <div className={cn('absolute inset-0', tone.overlay)} />}
                </>
            )}

            {!isFullscreen && (
                <div className="relative z-10 flex-1 flex flex-col sm:flex-row">
                    <div className="order-2 sm:order-1 flex-1 p-5 sm:padding-large flex items-end gap-2 min-w-0">
                        {videoSrc && (
                            <div className="relative z-20 flex gap-2">
                                <button
                                    className={cn('w-14 h-14', btnClass)}
                                    onClick={handleTogglePlayback}
                                    type="button"
                                    aria-label={isPlaying ? 'Video pausieren' : 'Video abspielen'}
                                >
                                    <span
                                        className="text-xl font-medium drop-shadow-sm"
                                        aria-hidden
                                    >
                                        {isPlaying ? '❚❚' : '▶'}
                                    </span>
                                </button>
                                <button
                                    className={btnClass}
                                    onClick={handleToggleMute}
                                    type="button"
                                    aria-label={isMuted ? 'Ton einschalten' : 'Ton ausschalten'}
                                >
                                    {isMuted ? <IconMuted /> : <IconSound />}
                                </button>
                                <button
                                    className={btnClass}
                                    onClick={handleFullscreen}
                                    type="button"
                                    aria-label="Vollbild"
                                >
                                    <IconFullscreen />
                                </button>
                            </div>
                        )}
                    </div>

                    <div
                        className={cn(
                            'relative order-1 sm:order-2 w-full sm:w-[55%] md:w-[45%] flex-1 flex flex-col justify-center min-w-0',
                        )}
                    >
                        <div className={cn('absolute inset-0', tone.sideOverlay)} />
                        <div
                            className={cn(
                                'relative z-10 m-4 sm:m-6 padding-large flex flex-col justify-center',
                                hasMedia && 'rounded-[var(--block-radius)]',
                                hasMedia && tone.contentSurface,
                            )}
                        >
                            {videoCard?.title && (
                                <h3 className={cn('font-heading-5-bold mb-3', tone.heading)}>
                                    {videoCard.title}
                                </h3>
                            )}
                            {videoCard?.description && (
                                <p
                                    className={cn(
                                        'font-normal-text-regular text-muted-foreground md:font-medium-text-regular break-words',
                                        tone.body,
                                    )}
                                >
                                    {videoCard.description}
                                </p>
                            )}
                            {videoCard?.link && (
                                <div className="mt-4">
                                    <CMSLink
                                        {...videoCard.link}
                                        label={videoCard.link.label || 'Watch Video'}
                                        className={cn(
                                            'text-sm font-semibold underline underline-offset-4 break-all',
                                            tone.link,
                                        )}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

/** Wrapper: Bild → nur MediaCardStatic (kein Video-Code). Video → VideoCardWithVideo (Play, Mute, Vollbild, Scroll-Play). */
export const VideoCardClient: React.FC<VideoCardClientProps> = ({ videoCard, tone }) => {
    const isVideo = useMemo(() => {
        const media = videoCard?.backgroundMedia
        return Boolean(typeof media === 'object' && media?.mimeType?.includes('video'))
    }, [videoCard?.backgroundMedia])

    if (!videoCard) return null
    if (!isVideo) return <MediaCardStatic videoCard={videoCard} tone={tone} />
    return <VideoCardWithVideo videoCard={videoCard} tone={tone} />
}
