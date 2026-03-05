import React, { useId } from 'react'

import { Media } from '@/components/Media'
import { CMSLink } from '@/components/CMSLink'
import { ScrollFadeIn } from '@/components/ScrollFadeIn'
import { renderHighlightedHeadline } from '@/components/SectionHeader'
import { Card } from '@/components/ui/card'
import { cn } from '@/utilities/ui'
import { AudienceVariant } from './AudienceVariant'
import { TabsCardClient } from './TabsCard.client'
import { VideoCardClient } from './VideoCard.client'
import type { AudienceCard, MediaCard, TabsCard } from './types'
import { getToneStyles } from './toneStyles'

const masonryCardLayoutClass =
    'group relative block-card-strong block-card-min-h padding-large flex flex-col overflow-clip hover:shadow-copper-glow'

const resolveCardTone = (
    tone: 'light' | 'dark' | null | undefined,
    backgroundMedia: MediaCard['backgroundMedia'] | TabsCard['backgroundMedia'] | undefined,
): 'light' | 'dark' => {
    if (tone === 'light' || tone === 'dark') return tone
    return backgroundMedia ? 'light' : 'dark'
}

type MasonryGridBlockProps = {
    id?: string | null
    variant?: 'benefits' | 'audience' | null
    badge?: string | null
    heading?: string | null
    headlineHighlight?: string | null
    backgroundColor?: 'white' | 'muted' | null
    sectionTone?: 'light' | 'dark' | null
    audienceCards?: AudienceCard[] | null
    highlightCard?: MediaCard | null
    tabsCard?: TabsCard | null
    cashflowCard?: MediaCard | null
    videoCard?: MediaCard | null
}

export const MasonryGridBlock: React.FC<MasonryGridBlockProps> = ({
    id: blockId,
    heading,
    badge,
    headlineHighlight,
    backgroundColor = 'white',
    variant = 'benefits',
    sectionTone,
    audienceCards,
    highlightCard,
    tabsCard,
    cashflowCard,
    videoCard,
}) => {
    const fallbackId = useId()
    const headingId = `masonry-grid-heading-${blockId ?? fallbackId}`
    const bgClass = backgroundColor === 'muted' ? 'bg-muted/40' : 'bg-background'
    const hasHeader = badge || heading

    if (variant === 'audience' && audienceCards?.length) {
        return (
            <AudienceVariant
                badge={badge}
                heading={heading}
                headlineHighlight={headlineHighlight}
                sectionTone={sectionTone}
                cards={audienceCards}
            />
        )
    }

    const highlightTone = getToneStyles(
        resolveCardTone(highlightCard?.textTone, highlightCard?.backgroundMedia),
    )
    const cashflowTone = getToneStyles(
        resolveCardTone(cashflowCard?.textTone, cashflowCard?.backgroundMedia),
    )
    const videoTone = getToneStyles(
        resolveCardTone(videoCard?.textTone, videoCard?.backgroundMedia),
    )
    const tabsTone = getToneStyles(resolveCardTone(tabsCard?.textTone, tabsCard?.backgroundMedia))

    return (
        <section
            className={cn('relative section-padding-lg section-atmosphere', bgClass)}
            {...(heading
                ? { 'aria-labelledby': headingId }
                : { 'aria-label': badge || 'Masonry Grid' })}
        >
            <div className="container relative">
                {hasHeader && (
                    <ScrollFadeIn className="mb-10 md:mb-14 text-center">
                        {badge && (
                            <div className="mb-4 md:mb-5">
                                <span className="font-subtext-semibold text-copper lowercase tracking-widest">
                                    {badge}
                                </span>
                            </div>
                        )}
                        {heading && (
                            <h2
                                id={headingId}
                                className="font-display-tight font-heading-3-bold text-foreground text-balance leading-none tracking-tight hyphens-auto [overflow-wrap:anywhere] pb-1"
                            >
                                {renderHighlightedHeadline(heading, headlineHighlight)}
                            </h2>
                        )}
                    </ScrollFadeIn>
                )}

                <div className="grid block-grid-gap-lg">
                    <ScrollFadeIn delay={80} animation="fade-up">
                        <Card
                            className={cn(
                                masonryCardLayoutClass,
                                !highlightCard?.backgroundMedia && highlightTone.fallback,
                            )}
                        >
                            {highlightCard?.backgroundMedia && (
                                <>
                                    <Media
                                        resource={highlightCard.backgroundMedia}
                                        imgClassName="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        videoClassName="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        size="(max-width: 1280px) 100vw, 1280px"
                                    />
                                    <div
                                        className={cn('absolute inset-0', highlightTone.overlay)}
                                    />
                                </>
                            )}

                            <div className="relative z-10 text-center flex-1 flex flex-col justify-center min-w-0">
                                <div
                                    className={cn(
                                        'mx-auto w-full max-w-3xl',
                                        highlightCard?.backgroundMedia &&
                                            'rounded-[var(--block-radius)] padding-large',
                                        highlightCard?.backgroundMedia &&
                                            highlightTone.contentSurface,
                                    )}
                                >
                                    {highlightCard?.title && (
                                        <h3
                                            className={cn(
                                                'font-heading-3-bold mb-4 drop-shadow-md transition group-hover:chrome-text',
                                                highlightTone.heading,
                                            )}
                                        >
                                            {highlightCard.title}
                                        </h3>
                                    )}
                                    {highlightCard?.description && (
                                        <p
                                            className={cn(
                                                'font-normal-text-regular md:font-medium-text-regular max-w-2xl mx-auto hyphens-auto text-balance leading-relaxed',
                                                highlightTone.body || 'text-muted-foreground',
                                            )}
                                        >
                                            {highlightCard.description}
                                        </p>
                                    )}
                                    {highlightCard?.link && (
                                        <div className="mt-8">
                                            <CMSLink
                                                {...highlightCard.link}
                                                appearance="primary-pill"
                                                label={highlightCard.link.label || 'Learn more'}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </ScrollFadeIn>

                    <div className="grid grid-cols-1 block-grid-gap-lg lg:grid-cols-2">
                        <ScrollFadeIn delay={140} animation="fade-up">
                            <TabsCardClient tabsCard={tabsCard} tone={tabsTone} />
                        </ScrollFadeIn>

                        <ScrollFadeIn delay={200} animation="fade-up">
                            <Card
                                className={cn(
                                    masonryCardLayoutClass,
                                    !cashflowCard?.backgroundMedia && cashflowTone.fallback,
                                )}
                            >
                                {cashflowCard?.backgroundMedia && (
                                    <>
                                        <Media
                                            resource={cashflowCard.backgroundMedia}
                                            imgClassName="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            videoClassName="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            size="(max-width: 1024px) 100vw, (max-width: 1280px) 50vw, 640px"
                                        />
                                        <div
                                            className={cn('absolute inset-0', cashflowTone.overlay)}
                                        />
                                    </>
                                )}

                                <div className="relative z-10 min-w-0 flex-1 flex flex-col justify-end">
                                    <div
                                        className={cn(
                                            cashflowCard?.backgroundMedia &&
                                                'rounded-[var(--block-radius)] padding-large',
                                            cashflowCard?.backgroundMedia &&
                                                cashflowTone.contentSurface,
                                        )}
                                    >
                                        {cashflowCard?.title && (
                                            <h3
                                                className={cn(
                                                    'font-heading-4-bold mb-3 transition group-hover:chrome-text',
                                                    cashflowTone.heading,
                                                )}
                                            >
                                                {cashflowCard.title}
                                            </h3>
                                        )}
                                        {cashflowCard?.description && (
                                            <p
                                                className={cn(
                                                    'font-normal-text-regular md:font-medium-text-regular max-w-full sm:max-w-md hyphens-auto text-balance leading-relaxed',
                                                    cashflowTone.body || 'text-muted-foreground',
                                                )}
                                            >
                                                {cashflowCard.description}
                                            </p>
                                        )}
                                        {cashflowCard?.link && (
                                            <div className="mt-6">
                                                <CMSLink
                                                    {...cashflowCard.link}
                                                    appearance="secondary-glass"
                                                    label={cashflowCard.link.label || 'Learn more'}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        </ScrollFadeIn>
                    </div>

                    <ScrollFadeIn delay={260} animation="fade-up">
                        <VideoCardClient videoCard={videoCard} tone={videoTone} />
                    </ScrollFadeIn>
                </div>
            </div>
        </section>
    )
}
