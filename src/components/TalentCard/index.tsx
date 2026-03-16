import { cn } from '@/utilities/ui'
import Image from 'next/image'
import React from 'react'
import { Link } from '@/i18n/navigation'
import { AddToSelectionButton } from '@/components/Dancefloor/AddToDancefloorButton'

export type TalentCardStyle = 'sage' | 'peach' | 'cream' | '' | null

interface TalentCardProps {
    id: string
    name: string
    slug: string
    category: 'dancer' | 'model' | 'both'
    locale?: string
    imageUrl?: string
    imageAlt?: string
    /** Hintergrund-Stil der Karte (chrome-grace-talent: talent-bg-sage/peach/cream) */
    cardStyle?: TalentCardStyle
    isCoach?: boolean
    className?: string
    priority?: boolean
}

const categoryLabels = {
    de: {
        dancer: 'Tänzer/in',
        model: 'Model',
        both: 'Tänzer/in & Model',
    },
    en: {
        dancer: 'Dancer',
        model: 'Model',
        both: 'Dancer & Model',
    },
} as const

/**
 * TalentCard – Karte für Talent-Übersicht (BLOCK-STANDARDS: Card/CardImage).
 * Bild mit Hover-Zoom, Name, Kategorie.
 */
const cardStyleClassMap: Record<'sage' | 'peach' | 'cream', string> = {
    sage: 'talent-card talent-bg-sage',
    peach: 'talent-card talent-bg-peach',
    cream: 'talent-card talent-bg-cream',
}

export function TalentCard({
    id,
    name,
    slug,
    category,
    locale,
    imageUrl,
    imageAlt,
    cardStyle,
    isCoach,
    className,
    priority = false,
}: TalentCardProps) {
    const styleClass =
        cardStyle && cardStyle in cardStyleClassMap
            ? cardStyleClassMap[cardStyle as keyof typeof cardStyleClassMap]
            : ''
    const labels = locale === 'de' ? categoryLabels.de : categoryLabels.en
    const noImageLabel = locale === 'de' ? 'Kein Bild' : 'No image'

    return (
        <Link
            href={{ pathname: '/talents/[slug]', params: { slug } }}
            aria-label={`${name} – ${labels[category]}`}
            className={cn(
                'talent-card group block cursor-pointer rounded-2xl border border-transparent transition duration-300 hover:border-copper/25 hover:shadow-lg hover:shadow-foreground/10 focus-visible:border-copper/25 focus-visible:shadow-lg dark:hover:border-copper/30 dark:hover:shadow-foreground/20',
                className,
            )}
        >
            <div className={cn('relative aspect-[3/4] overflow-hidden rounded-2xl', styleClass)}>
                <AddToSelectionButton talent={{ id, name, slug }} variant="icon" tone="onMedia" />
                {/* Image Background */}
                {imageUrl ? (
                    <Image
                        src={imageUrl || undefined}
                        alt={imageAlt || name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        priority={priority}
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted/20">
                        <span className="font-small-text-regular text-muted-foreground">
                            {noImageLabel}
                        </span>
                    </div>
                )}

                {/* Floating overlay to improve text readability on media */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-media-overlay/85 to-transparent opacity-90 transition-opacity duration-400 md:opacity-0 md:group-hover:opacity-100" />

                {/* Info Hover Overlay */}
                <div className="absolute bottom-0 left-0 right-0 z-10 p-6 translate-y-0 opacity-100 transition duration-400 md:translate-y-4 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
                    <h3 className="font-display-tight font-heading-5-bold text-on-media drop-shadow-md">
                        {name}
                    </h3>
                    <p className="mt-1 flex items-center gap-2 text-sm uppercase tracking-widest text-on-media-muted">
                        {labels[category]}
                        {isCoach && (
                            <span className="rounded-full bg-copper/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-background normal-case">
                                Coach
                            </span>
                        )}
                    </p>
                </div>
            </div>
        </Link>
    )
}

/**
 * TalentCardSkeleton - Loading State
 */
export function TalentCardSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="aspect-[3/4] w-full rounded-2xl bg-muted" />
            <div className="mt-4 space-y-2">
                <div className="h-5 w-2/3 rounded bg-muted" />
                <div className="h-4 w-1/3 rounded bg-muted" />
            </div>
        </div>
    )
}
