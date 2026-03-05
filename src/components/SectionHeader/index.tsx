import { cn } from '@/utilities/ui'
import React from 'react'

/**
 * Rendert eine Headline mit optional hervorgehobenem Teilstück (z. B. für Akzentfarbe).
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

interface SectionHeaderProps {
    overline?: string
    title: string
    /** Optional: Teilstück von title, das mit text-accent hervorgehoben wird */
    titleHighlight?: string | null
    description?: string
    centered?: boolean
    className?: string
    titleClassName?: string
    size?: 'sm' | 'md' | 'lg'
    /** HTML heading level (default: h2). Use h1 for page-level headings. */
    as?: 'h1' | 'h2' | 'h3'
}

/**
 * SectionHeader – Wiederverwendbare Sektion-Überschrift
 *
 * Besteht aus:
 * - Overline (optional): Kleine Überschrift in Accent-Farbe
 * - Title: Hauptüberschrift (h2), optional mit titleHighlight hervorgehoben
 * - Description (optional): Beschreibungstext
 */
export function SectionHeader({
    overline,
    title,
    titleHighlight,
    description,
    centered = true,
    className,
    titleClassName,
    size = 'md',
    as: Heading = 'h2',
}: SectionHeaderProps) {
    const sizeClasses = {
        sm: {
            title: 'font-heading-4-bold',
            description: 'font-small-text-regular md:font-normal-text-regular',
        },
        md: {
            title: 'font-heading-3-bold leading-[1.1]',
            description: 'font-normal-text-regular md:font-medium-text-regular',
        },
        lg: {
            title: 'font-heading-2-bold leading-[1.1]',
            description: 'font-normal-text-regular md:font-medium-text-regular',
        },
    }

    return (
        <div className={cn('mb-12 md:mb-18', centered && 'text-center', className)}>
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
            <Heading
                className={cn(
                    'font-display-tight tracking-tight text-foreground text-balance hyphens-auto [overflow-wrap:anywhere] pt-[0.02em] pb-[0.06em]',
                    sizeClasses[size].title,
                    titleClassName,
                )}
            >
                {renderHighlightedHeadline(title, titleHighlight)}
            </Heading>
            {description && (
                <p
                    className={cn(
                        'mt-6 max-w-4xl hyphens-auto text-balance text-muted-foreground',
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
