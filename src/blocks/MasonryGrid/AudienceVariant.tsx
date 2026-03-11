import React from 'react'
import { ArrowUpRight } from 'lucide-react'

import { CMSLink } from '@/components/CMSLink'
import { Media } from '@/components/Media'
import { SectionHeader } from '@/components/SectionHeader'
import { cn } from '@/utilities/ui'
import type { AudienceCard } from './types'

type AudienceVariantProps = {
    badge?: string | null
    heading?: string | null
    headlineHighlight?: string | null
    headingLevel?: string | null
    sectionTone?: 'light' | 'dark' | null
    cards: AudienceCard[]
}

/**
 * Card theme styles.
 * Image cards always use on-media (white text on dark overlay) regardless of section tone.
 * Non-image cards use the section's token-based colours (which swap via inverse-section in dark mode).
 */
const getThemeStyles = (_theme: AudienceCard['theme'], hasImage: boolean) => {
    if (hasImage) {
        return {
            heading: 'text-on-media',
            body: 'text-on-media-muted',
            overlay: 'bg-gradient-to-t from-media-overlay/90 via-media-overlay/50 to-transparent',
            buttonClass:
                'border border-on-media/35 bg-media-overlay/20 text-on-media hover:bg-background hover:text-foreground',
            cardBase: '',
        }
    }
    // Non-image cards use standard tokens — inverse-section swaps them automatically
    return {
        heading: 'text-foreground',
        body: 'text-muted-foreground',
        overlay: '',
        buttonClass:
            'border border-border text-foreground hover:bg-foreground hover:text-background',
        cardBase: 'bg-card border border-border/30',
    }
}

export const AudienceVariant: React.FC<AudienceVariantProps> = ({
    badge,
    heading,
    headlineHighlight,
    headingLevel,
    sectionTone = 'light',
    cards,
}) => {
    const isDark = sectionTone === 'dark'
    const hasHeader = badge || heading

    const [firstCard, secondCard, thirdCard, fourthCard] = cards

    if (!firstCard || !secondCard || !thirdCard || !fourthCard) {
        return null
    }

    return (
        <section
            className={cn(
                'section-padding-lg section-atmosphere transition-colors duration-300',
                isDark
                    ? 'inverse-section bg-[rgb(var(--background))] text-[rgb(var(--foreground))]'
                    : 'bg-background text-foreground',
            )}
            {...(heading
                ? { 'aria-labelledby': 'audience-masonry-heading' }
                : { 'aria-label': badge || 'Audience Grid' })}
        >
            <div className="container">
                {hasHeader && (
                    <SectionHeader
                        overline={badge}
                        title={heading}
                        titleHighlight={headlineHighlight}
                        as={(headingLevel as 'h1' | 'h2' | 'h3') || 'h2'}
                        centered
                        id="audience-masonry-heading"
                        titleClassName={isDark ? 'text-[rgb(var(--foreground))]' : 'chrome-text'}
                    />
                )}
                <div className="flex flex-col block-grid-gap">
                    {/* Top wide card */}
                    <AudienceCardBlock card={firstCard} isWide />

                    {/* Middle 2-column row */}
                    <div className="grid grid-cols-1 block-grid-gap lg:grid-cols-2">
                        {[secondCard, thirdCard].map((card, index) => (
                            <AudienceCardBlock
                                key={card.title ?? `audience-${index}`}
                                card={card}
                            />
                        ))}
                    </div>

                    {/* Bottom wide card */}
                    <AudienceCardBlock card={fourthCard} isWide />
                </div>
            </div>
        </section>
    )
}

type AudienceCardBlockProps = {
    card: AudienceCard
    isWide?: boolean
}

const AudienceCardBlock: React.FC<AudienceCardBlockProps> = ({ card, isWide }) => {
    const hasImage = Boolean(card.backgroundMedia)
    const theme = getThemeStyles(card.theme, hasImage)

    return (
        <div
            className={cn(
                'relative rounded-[var(--block-radius)] overflow-hidden group',
                isWide
                    ? 'min-h-[280px] sm:min-h-[320px] md:min-h-[360px]'
                    : 'min-h-[300px] sm:min-h-[340px] md:min-h-[360px]',
                hasImage ? 'bg-card/65' : theme.cardBase,
            )}
        >
            {/* Background image */}
            {hasImage && (
                <>
                    <Media
                        resource={card.backgroundMedia}
                        imgClassName="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        videoClassName="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        size={
                            isWide
                                ? '(max-width: 1280px) 100vw, 1280px'
                                : '(max-width: 1024px) 100vw, (max-width: 1280px) 50vw, 640px'
                        }
                    />
                    <div className={cn('absolute inset-0 pointer-events-none', theme.overlay)} />
                </>
            )}

            {/* Content — anchored to the bottom */}
            <div
                className={cn(
                    'relative z-10 h-full flex flex-col justify-end min-w-0',
                    'p-6 sm:p-8 md:p-10',
                    isWide && 'md:max-w-2xl',
                )}
            >
                <h3
                    className={cn(
                        isWide ? 'font-heading-4-bold' : 'font-heading-5-bold',
                        theme.heading,
                        'mb-2',
                    )}
                >
                    {card.title}
                </h3>
                {card.description && (
                    <p
                        className={cn(
                            'font-normal-text-regular md:font-medium-text-regular leading-relaxed break-words',
                            theme.body,
                            isWide ? 'max-w-xl' : 'max-w-md',
                        )}
                    >
                        {card.description}
                    </p>
                )}

                {card.link && (
                    <div className="mt-5">
                        {(() => {
                            const linkLabel = card.link.label || 'Learn more'

                            return (
                                <CMSLink
                                    {...card.link}
                                    appearance="inline"
                                    label={null}
                                    className={cn(
                                        'group inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium backdrop-blur-sm transition duration-300 break-words',
                                        theme.buttonClass,
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
