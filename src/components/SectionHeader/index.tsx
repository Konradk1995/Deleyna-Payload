import { cn } from '@/utilities/ui'
import React from 'react'

/**
 * Renders a headline with an optionally highlighted segment in accent colour.
 */
export function renderHighlightedHeadline(
    headline: string,
    highlight?: string | null,
): React.ReactNode {
    if (!highlight || !headline.includes(highlight)) return headline
    const idx = headline.indexOf(highlight)
    return (
        <>
            {headline.slice(0, idx)}
            <span className="text-accent">{highlight}</span>
            {headline.slice(idx + highlight.length)}
        </>
    )
}

export interface SectionHeaderProps {
    /** Small label/badge above the headline */
    badge?: string | null
    /** Overline text (alternative to badge — elegant line-style) */
    overline?: string | null
    /** Main section heading — leave empty to hide entire header */
    title?: string | null
    /** Word/phrase highlighted in accent colour inside the title */
    titleHighlight?: string | null
    /** Description text below the title */
    description?: string | null
    /** Centre-align everything (default: true) */
    centered?: boolean
    className?: string
    /** Override title classes */
    titleClassName?: string
    /** HTML heading level (default: h2) */
    as?: 'h1' | 'h2' | 'h3'
    /** Typography size variant */
    size?: 'sm' | 'md' | 'lg'
    /** HTML id for aria-labelledby */
    id?: string
}

const sizeClasses = {
    sm: {
        title: 'font-heading-4-bold',
        description: 'font-small-text-regular md:font-normal-text-regular',
    },
    md: {
        title: 'font-heading-3-bold',
        description: 'font-normal-text-regular text-muted-foreground md:font-medium-text-regular',
    },
    lg: {
        title: 'font-heading-2-bold',
        description: 'font-normal-text-regular text-muted-foreground md:font-medium-text-regular',
    },
} as const

/**
 * SectionHeader — Unified section header for all blocks.
 *
 * Supports two label styles above the headline:
 * - **badge**: Pill-style label with accent dot (modern / CTA-heavy)
 * - **overline**: Elegant copper line-style (editorial / luxury)
 *
 * Anti-clipping: hyphens-auto, overflow-wrap, padding for descenders.
 */
export function SectionHeader({
    badge,
    overline,
    title,
    titleHighlight,
    description,
    centered = true,
    className,
    titleClassName,
    as: Heading = 'h2',
    size = 'md',
    id,
}: SectionHeaderProps) {
    if (!badge && !overline && !title && !description) return null

    return (
        <div
            className={cn(
                'mb-12 md:mb-16',
                centered ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl',
                className,
            )}
        >
            {/* Badge — pill style */}
            {badge && !overline && (
                <div className="mb-4 md:mb-5">
                    <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-muted/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
                        {badge}
                    </span>
                </div>
            )}

            {/* Overline — elegant line style */}
            {overline && (
                <span
                    className={cn(
                        'font-subtext-semibold mb-4 inline-flex items-center gap-3 text-copper animate-reveal',
                        centered && 'justify-center',
                    )}
                >
                    <span className="h-px w-8 bg-copper/60" aria-hidden />
                    {overline}
                    <span className="h-px w-8 bg-copper/60" aria-hidden />
                </span>
            )}

            {/* Headline — anti-clipping, highlighted word */}
            {title && (
                <Heading
                    id={id}
                    className={cn(
                        'font-display-tight tracking-tight text-foreground text-balance hyphens-auto [overflow-wrap:anywhere]',
                        sizeClasses[size].title,
                        titleClassName,
                    )}
                >
                    {renderHighlightedHeadline(title, titleHighlight)}
                </Heading>
            )}

            {/* Description */}
            {description && (
                <p
                    className={cn(
                        'mt-4 max-w-2xl hyphens-auto text-balance text-muted-foreground',
                        sizeClasses[size].description,
                        centered && 'mx-auto',
                    )}
                >
                    {description}
                </p>
            )}
        </div>
    )
}
