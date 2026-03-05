'use client'

import React from 'react'
import { cn } from '@/utilities/ui'
import type { MarqueeBannerBlock as MarqueeBannerBlockType } from '@/payload-types'

/**
 * MarqueeBanner – endlos scrollender Textbanner.
 * Nutzt reine CSS-Animation (kein motion/react) für minimales JS-Bundle.
 * Respektiert prefers-reduced-motion für A11y/Lighthouse.
 */
export const MarqueeBannerBlock: React.FC<MarqueeBannerBlockType> = ({
    text,
    speed,
    appearance,
}) => {
    if (!text) return null

    const separator = ' \u2022 ' // bullet separator
    const repeatedText = Array.from({ length: 6 }, () => text).join(separator)
    const durationSeconds = speed === 'slow' ? 80 : speed === 'fast' ? 30 : 50

    return (
        <section
            className="section-atmosphere relative overflow-hidden border-y border-border/50 bg-background"
            aria-label={text}
        >
            <div className="py-4 sm:py-6 md:py-8">
                <div
                    className="marquee-track flex whitespace-nowrap"
                    style={{ '--marquee-duration': `${durationSeconds}s` } as React.CSSProperties}
                >
                    <span
                        className={cn(
                            'marquee-content inline-block pr-12 font-sans font-light marquee-tracking marquee-text',
                            appearance === 'outline'
                                ? 'text-transparent [-webkit-text-stroke:1px_var(--foreground)]'
                                : 'text-foreground/90',
                        )}
                    >
                        {repeatedText}
                        {separator}
                    </span>
                    <span
                        aria-hidden="true"
                        className={cn(
                            'marquee-content inline-block pr-12 font-sans font-light marquee-tracking marquee-text',
                            appearance === 'outline'
                                ? 'text-transparent [-webkit-text-stroke:1px_var(--foreground)]'
                                : 'text-foreground/90',
                        )}
                    >
                        {repeatedText}
                        {separator}
                    </span>
                </div>
            </div>
        </section>
    )
}
