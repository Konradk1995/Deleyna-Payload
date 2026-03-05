'use client'

import React, { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react'
import type { Media as MediaType } from '@/payload-types'
import { Media } from '@/components/Media'
import { renderHighlightedHeadline } from '@/components/SectionHeader'
import { cn } from '@/utilities/ui'

type StickyMediaClientProps = {
    badge?: string
    headline?: string
    headlineHighlight?: string
    subtitle?: string
    media: MediaType | string | number | null // Pass full resource to Media component
    overlayOpacity: number
    scrollLabel?: string
    backgroundColor?: string
}

export const StickyMediaClient: React.FC<StickyMediaClientProps> = ({
    badge,
    headline,
    headlineHighlight,
    subtitle,
    media,
    overlayOpacity,
    scrollLabel = 'Scroll',
    backgroundColor = 'white',
}) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const shouldReduceMotion = useReducedMotion()

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    })

    // Gentler animation values — avoid clipping while preserving motion
    const textY = useTransform(scrollYProgress, [0, 0.4, 1], ['-8vh', '0vh', '0vh'])
    const textOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1])
    const scrollHintOpacity = useTransform(scrollYProgress, [0, 0.15, 0.3], [1, 1, 0])

    const hasText = badge || headline || subtitle
    const bgClass = backgroundColor === 'muted' ? 'bg-muted' : 'bg-background'

    return (
        <div
            ref={containerRef}
            className={cn('section-atmosphere relative min-h-[145svh] md:min-h-[190vh]', bgClass)}
        >
            {/* h-dvh fixes iOS Safari address bar bug (100vh != visible viewport) */}
            <div className="sticky top-0 h-dvh w-full overflow-hidden">
                {/* Background media */}
                <Media
                    resource={media}
                    fill
                    className="object-cover"
                    priority
                    size="100vw"
                    imgClassName="object-cover"
                />

                {/* Overlay */}
                {overlayOpacity > 0 && (
                    <div
                        className="absolute inset-0 z-10 pointer-events-none bg-media-overlay"
                        style={{ opacity: overlayOpacity }}
                        aria-hidden="true"
                    />
                )}

                {/* Scroll-driven text */}
                {hasText && (
                    <motion.div
                        className="absolute inset-0 z-20 flex items-center justify-center px-5 sm:px-8 md:px-6"
                        style={
                            shouldReduceMotion ? { opacity: 1 } : { y: textY, opacity: textOpacity }
                        }
                    >
                        <div className="surface-on-media mx-auto max-w-4xl padding-large text-center">
                            {badge && (
                                <div className="mb-4 md:mb-5">
                                    <span className="badge-pill badge-pill-sm border border-on-media-soft bg-on-media-muted text-on-media-soft backdrop-blur-sm sm:px-4 sm:py-1.5 sm:text-xs">
                                        <span
                                            className="h-1.5 w-1.5 rounded-full bg-accent"
                                            aria-hidden
                                        />
                                        {badge}
                                    </span>
                                </div>
                            )}

                            {headline && (
                                <h2 className="mb-4 font-display-tight font-heading-2-bold leading-[1.08] tracking-tight text-balance text-on-media hyphens-auto [overflow-wrap:anywhere] pb-[0.04em] md:mb-5">
                                    {renderHighlightedHeadline(headline, headlineHighlight)}
                                </h2>
                            )}

                            {subtitle && (
                                <p className="mx-auto max-w-3xl whitespace-pre-line text-balance font-medium-text-regular leading-relaxed text-on-media-soft">
                                    {subtitle}
                                </p>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* Scroll indicator — safe-area aware for iPhone home indicator */}
                <motion.div
                    className="absolute bottom-8 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-1.5 pointer-events-none md:bottom-8 md:gap-2"
                    style={{
                        opacity: shouldReduceMotion ? 0 : scrollHintOpacity,
                        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
                    }}
                    aria-hidden="true"
                >
                    <span className="text-label-small text-on-media-medium md:text-xs">
                        {scrollLabel}
                    </span>
                    <svg
                        className="h-5 w-5 animate-bounce text-on-media-medium md:h-6 md:w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        aria-hidden="true"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </motion.div>
            </div>
        </div>
    )
}
