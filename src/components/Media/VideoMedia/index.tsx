'use client'

import { cn } from '@/utilities/ui'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import type { Media as MediaType } from '@/payload-types'
import type { Props as MediaProps } from '../types'

import { getMediaUrl } from '@/utilities/getMediaUrl'

export const VideoMedia: React.FC<MediaProps> = (props) => {
    const {
        onClick,
        resource,
        videoClassName,
        fill,
        videoAutoPlay = true,
        videoLoop = true,
        videoMuted = true,
        videoPlaysInline = true,
        videoControls = false,
        videoPoster,
        videoPreload = 'metadata',
    } = props

    const videoRef = useRef<HTMLVideoElement>(null)
    const [shouldLoad, setShouldLoad] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)

    const mediaResource = useMemo<MediaType | null>(() => {
        if (resource && typeof resource === 'object') {
            return resource as MediaType
        }
        return null
    }, [resource])

    const cacheTag = mediaResource?.updatedAt

    const resolvedPoster = useMemo(() => {
        if (videoPoster) {
            if (videoPoster.startsWith('data:')) return videoPoster
            const posterUrl = getMediaUrl(videoPoster, cacheTag)
            return posterUrl || undefined
        }

        if (mediaResource) {
            const posterFromResource =
                mediaResource.thumbnailURL ||
                (mediaResource.sizes as Record<string, { url?: string }>)?.medium?.url ||
                (mediaResource.sizes as Record<string, { url?: string }>)?.small?.url ||
                (mediaResource.sizes as Record<string, { url?: string }>)?.thumbnail?.url

            if (!posterFromResource) return undefined

            if (posterFromResource.startsWith('data:')) return posterFromResource

            const posterUrl = getMediaUrl(posterFromResource, cacheTag)
            return posterUrl || undefined
        }

        return undefined
    }, [videoPoster, mediaResource, cacheTag])

    const resolvedSource = useMemo(() => {
        if (!mediaResource) return ''

        if (!mediaResource.url) return ''

        return getMediaUrl(mediaResource.url, cacheTag)
    }, [mediaResource, cacheTag])

    useEffect(() => {
        const video = videoRef.current
        if (!video) return

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const scheduleLoad = () => setShouldLoad(true)
                        const win = window as typeof window & {
                            requestIdleCallback?: (callback: IdleRequestCallback) => number
                        }

                        if (typeof win.requestIdleCallback === 'function') {
                            win.requestIdleCallback(() => scheduleLoad())
                        } else {
                            setTimeout(scheduleLoad, 0)
                        }
                        observer.unobserve(video)
                    }
                })
            },
            { threshold: 0.1 },
        )

        observer.observe(video)
        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        if (!shouldLoad || !resolvedSource) return
        const video = videoRef.current
        if (!video) return

        video.load()
    }, [shouldLoad, resolvedSource])

    useEffect(() => {
        if (!videoAutoPlay || !isLoaded || !shouldLoad || isPlaying) return

        const video = videoRef.current
        if (!video) return

        const playPromise = video.play()
        if (playPromise && typeof playPromise.then === 'function') {
            playPromise.catch(() => {
                // Autoplay might be blocked
            })
        }
    }, [isLoaded, shouldLoad, videoAutoPlay, isPlaying])

    const handleLoadedData = useCallback(() => {
        setIsLoaded(true)
    }, [])

    const handlePlay = useCallback(() => {
        setIsPlaying(true)
    }, [])

    const handlePause = useCallback(() => {
        setIsPlaying(false)
    }, [])

    const handleClick = useCallback(
        (e: React.MouseEvent<HTMLVideoElement>) => {
            const video = e.currentTarget

            if (!videoControls) {
                if (video.paused) {
                    void video.play()
                } else {
                    video.pause()
                }
            }

            onClick?.()
        },
        [onClick, videoControls],
    )

    if (mediaResource) {
        const mimeType = mediaResource.mimeType || undefined

        return (
            <video
                ref={videoRef}
                autoPlay={videoAutoPlay}
                className={cn(
                    fill && 'absolute inset-0 w-full h-full object-cover',
                    videoClassName,
                    'transition-opacity duration-300',
                    {
                        'opacity-50': shouldLoad && !isLoaded,
                        'opacity-100': !shouldLoad || isLoaded,
                    },
                )}
                controls={videoControls}
                loop={videoLoop}
                muted={videoMuted}
                onClick={handleClick}
                playsInline={videoPlaysInline}
                preload={videoPreload}
                poster={resolvedPoster}
                onLoadedData={handleLoadedData}
                onCanPlay={handleLoadedData}
                onPlay={handlePlay}
                onPause={handlePause}
            >
                {shouldLoad && resolvedSource ? (
                    <source src={resolvedSource} type={mimeType || undefined} />
                ) : null}
            </video>
        )
    }

    return null
}
