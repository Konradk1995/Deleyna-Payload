import React from 'react'
import { ArrowUpRight } from 'lucide-react'

import { CMSLink } from '@/components/CMSLink'
import { Media } from '@/components/Media'
import { renderHighlightedHeadline } from '@/components/SectionHeader'
import { cn } from '@/utilities/ui'
import type { AudienceCard } from './types'

type AudienceVariantProps = {
    badge?: string | null
    heading?: string | null
    headlineHighlight?: string | null
    sectionTone?: 'light' | 'dark' | null
    cards: AudienceCard[]
}

const getThemeStyles = (theme: AudienceCard['theme'], hasImage: boolean) => {
    // Image cards enforce on-media contrast to avoid unreadable dark text on bright visuals.
    const useLightText = hasImage ? true : theme ? theme !== 'light' : false

    return {
        heading: useLightText ? 'text-on-media' : 'text-foreground',
        body: useLightText ? 'text-on-media-muted' : 'text-muted-foreground',
        overlay: useLightText
            ? 'bg-gradient-to-b from-media-overlay/80 via-media-overlay/45 to-media-overlay/70'
            : 'bg-gradient-to-b from-background/92 via-background/65 to-background/92',
        buttonDefault: useLightText
            ? 'border border-on-media/35 bg-media-overlay/20 text-on-media hover:bg-background hover:text-foreground'
            : 'border border-border text-foreground hover:bg-foreground hover:text-background',
        buttonOutline: useLightText
            ? 'border border-on-media/35 bg-media-overlay/30 text-on-media hover:bg-media-overlay/45'
            : 'border border-border/60 bg-background/90 text-foreground hover:bg-background',
        cardBase: useLightText ? 'bg-surface-inverse' : 'bg-card border border-border shadow-sm',
    }
}

/** Gleiche Mindesthöhen wie Benefits (Karten wachsen bei viel Text, nichts wird abgeschnitten). */
const getCardHeight = (size: AudienceCard['size']) => {
    return size === 'medium' ? 'block-card-min-h' : 'block-card-min-h'
}

export const AudienceVariant: React.FC<AudienceVariantProps> = ({
    badge,
    heading,
    headlineHighlight,
    sectionTone = 'light',
    cards,
}) => {
    const sectionClass =
        sectionTone === 'dark'
            ? 'bg-surface-inverse text-on-media'
            : 'bg-background text-foreground'
    const badgeClass =
        sectionTone === 'dark'
            ? 'border border-on-media/30 bg-media-overlay/45 text-on-media-muted'
            : 'border border-border/70 bg-muted/60 text-muted-foreground'
    const hasHeader = badge || heading

    const [firstCard, secondCard, thirdCard, fourthCard] = cards

    if (!firstCard || !secondCard || !thirdCard || !fourthCard) {
        return null
    }

    return (
        <section
            className={cn(
                'section-padding-lg section-atmosphere transition-colors duration-300',
                sectionClass,
            )}
            {...(heading
                ? { 'aria-labelledby': 'audience-masonry-heading' }
                : { 'aria-label': badge || 'Audience Grid' })}
        >
            <div className="container">
                {hasHeader && (
                    <div className="mb-8 text-center sm:mb-10 md:mb-14">
                        {badge && (
                            <div className="mb-4 md:mb-5">
                                <span
                                    className={cn(
                                        'font-subtext-semibold inline-flex items-center gap-2 rounded-full px-4 py-1.5',
                                        badgeClass,
                                    )}
                                >
                                    <span
                                        className="h-1.5 w-1.5 rounded-full bg-copper shadow-[0_0_8px_var(--color-copper)]"
                                        aria-hidden
                                    />
                                    {badge}
                                </span>
                            </div>
                        )}
                        {heading && (
                            <h2
                                id="audience-masonry-heading"
                                className="font-display-tight font-heading-3-bold leading-none tracking-tight text-balance hyphens-auto [overflow-wrap:anywhere] pb-1"
                            >
                                {renderHighlightedHeadline(heading, headlineHighlight)}
                            </h2>
                        )}
                    </div>
                )}
                <div className="flex flex-col block-grid-gap">
                    <AudienceCardBlock card={firstCard} isFooter />

                    <div className="grid grid-cols-1 block-grid-gap lg:grid-cols-2">
                        {[secondCard, thirdCard].map((card, index) => (
                            <AudienceCardBlock
                                key={card.title ?? `audience-${index}`}
                                card={card}
                            />
                        ))}
                    </div>

                    <AudienceCardBlock card={fourthCard} isFooter />
                </div>
            </div>
        </section>
    )
}

type AudienceCardBlockProps = {
    card: AudienceCard
    isFooter?: boolean
}

const AudienceCardBlock: React.FC<AudienceCardBlockProps> = ({ card, isFooter }) => {
    const hasImage = Boolean(card.backgroundMedia)
    const theme = getThemeStyles(card.theme, hasImage)
    const heightClass = isFooter ? 'block-card-min-h' : getCardHeight(card.size)

    return (
        <div
            className={cn(
                'relative rounded-[var(--block-radius)] overflow-hidden group',
                'block-card-base',
                heightClass,
                !hasImage && theme.cardBase,
            )}
        >
            {hasImage && (
                <>
                    <Media
                        resource={card.backgroundMedia}
                        imgClassName="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        videoClassName="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        size={
                            isFooter
                                ? '(max-width: 1280px) 100vw, 1280px'
                                : '(max-width: 1024px) 100vw, (max-width: 1280px) 50vw, 640px'
                        }
                    />
                    <div className={cn('absolute inset-0 pointer-events-none', theme.overlay)} />
                </>
            )}

            <div
                className={cn(
                    'relative z-10 h-full flex flex-col min-w-0',
                    isFooter
                        ? 'p-5 sm:padding-large items-center text-center'
                        : 'p-5 sm:padding-large',
                )}
            >
                <h3
                    className={cn(
                        'font-heading-5-bold',
                        theme.heading,
                        isFooter ? 'mb-4 text-center' : 'mb-3',
                    )}
                >
                    {card.title}
                </h3>
                {card.description && (
                    <p
                        className={cn(
                            'font-normal-text-regular text-muted-foreground md:font-medium-text-regular leading-relaxed break-words',
                            theme.body,
                            isFooter ? 'max-w-full md:max-w-3xl' : 'max-w-full md:max-w-lg',
                        )}
                    >
                        {card.description}
                    </p>
                )}

                {card.link && (
                    <div className={cn(isFooter ? 'mt-6' : 'mt-auto')}>
                        {(() => {
                            const linkStyle = card.linkStyle ?? 'default'
                            const buttonClass =
                                linkStyle === 'outline' ? theme.buttonOutline : theme.buttonDefault
                            const linkLabel = card.link.label || 'Learn more'

                            return (
                                <CMSLink
                                    {...card.link}
                                    appearance="inline"
                                    label={null}
                                    className={cn(
                                        'group inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium backdrop-blur-sm transition duration-300 break-words',
                                        buttonClass,
                                    )}
                                >
                                    {linkLabel}
                                    <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </CMSLink>
                            )
                        })()}
                    </div>
                )}
            </div>
        </div>
    )
}
