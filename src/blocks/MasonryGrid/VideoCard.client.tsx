'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { VolumeX, Volume2, Maximize } from 'lucide-react'
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

    // Track fullscreen state to hide overlay when in fullscreen
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
                                    {isMuted ? <VolumeX className="h-5 w-5" aria-hidden="true" /> : <Volume2 className="h-5 w-5" aria-hidden="true" />}
                                </button>
                                <button
                                    className={btnClass}
                                    onClick={handleFullscreen}
                                    type="button"
                                    aria-label="Vollbild"
                                >
                                    <Maximize className="h-5 w-5" aria-hidden="true" />
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
