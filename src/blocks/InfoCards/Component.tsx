import React, { useId } from 'react'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

import type { InfoCardsBlock as InfoCardsBlockProps } from '@/payload-types'
import type { Media } from '@/payload-types'

import { CMSLink } from '@/components/CMSLink'
import RichText from '@/components/RichText'
import { ScrollFadeIn } from '@/components/ScrollFadeIn'
import { SectionHeader } from '@/components/SectionHeader'
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { cn } from '@/utilities/ui'

type TopCard = NonNullable<InfoCardsBlockProps['topCards']>[number]
type CardItem = NonNullable<InfoCardsBlockProps['cards']>[number]

function isValidTopCardLink(
    link: TopCard['link'],
): link is NonNullable<TopCard['link']> & { label: string } {
    return Boolean(link?.label && (link?.url || link?.reference))
}

function hasCardLink(
    link: CardItem['link'],
): link is NonNullable<CardItem['link']> & { label?: string | null } {
    if (!link) return false
    const hasTarget = link.reference || link.url || (link.type === 'archive' && link.archive)
    return Boolean(hasTarget)
}


import { Media as MediaComponent } from '@/components/Media'

type Props = InfoCardsBlockProps & {
    id?: string
    disableInnerContainer?: boolean
    locale?: string
}

export const InfoCardsBlock: React.FC<Props> = (props) => {
    const {
        id: blockId,
        backgroundColor = 'muted',
        topCards,
        badge,
        title,
        titleHighlight,
        headingLevel,
        cards,
        contentBelowCards,
        sideMedia,
        locale = 'de',
    } = props

    const fallbackId = useId()
    const headingId = `info-cards-heading-${blockId ?? fallbackId}`
    const bgClass = backgroundColor === 'muted' ? 'bg-muted' : 'bg-background'
    const hasTopCards = topCards && topCards.length > 0
    const hasMainBlock = title && cards && cards.length > 0
    const hasContentBelow = contentBelowCards && typeof contentBelowCards === 'object'
    const hasSideMedia = sideMedia && typeof sideMedia === 'object'
    const fallbackCardLinkLabel = locale === 'en' ? 'Learn more' : 'Mehr erfahren'

    if (!hasTopCards && !hasMainBlock) return null

    return (
        <section
            className={cn('section-padding-lg section-atmosphere', bgClass)}
            aria-labelledby={hasMainBlock ? headingId : undefined}
            aria-label={!hasMainBlock ? badge || 'Info' : undefined}
        >
            <div className="container">
                {/* ── Obere 2 Karten (Headline + Text + CTA) ── */}
                {hasTopCards && (
                    <div className="mb-20 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-12 lg:gap-16">
                        {topCards.slice(0, 2).map((card, index) => (
                            <ScrollFadeIn
                                key={card.id ?? index}
                                delay={index * 80}
                                animation="fade-up"
                            >
                                <Card
                                    variant="interactive-glass"
                                    className="block-card-min-h-compact flex h-full flex-col padding-large"
                                >
                                    {card.headline && (
                                        <h3 className="mb-4 font-display-tight font-heading-3-bold tracking-tight text-balance chrome-text hyphens-auto [overflow-wrap:anywhere]">
                                            {card.headline}
                                        </h3>
                                    )}
                                    {card.body && (
                                        <p className="font-normal-text-regular text-muted-foreground mb-6">
                                            {card.body}
                                        </p>
                                    )}
                                    {card.link && isValidTopCardLink(card.link) && (
                                        <CMSLink
                                            {...card.link}
                                            appearance="outline"
                                            className="inline-flex items-center gap-1.5 w-fit group/cta"
                                        >
                                            {card.link.label}
                                            <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover/cta:translate-x-1" />
                                        </CMSLink>
                                    )}
                                </Card>
                            </ScrollFadeIn>
                        ))}
                    </div>
                )}

                {/* ── CTA mit 3 Boxen (Tagline, Titel, Karten) ── */}
                {hasMainBlock && (
                    <div
                        className={cn(
                            'grid grid-cols-1 gap-12',
                            hasSideMedia && 'lg:grid-cols-[1fr_2fr]',
                        )}
                    >
                        {hasSideMedia && (
                            <ScrollFadeIn animation="fade-right">
                                <div className="surface-pill block-card-base sticky top-24 overflow-hidden shadow-copper-glow">
                                    <MediaComponent
                                        resource={sideMedia}
                                        className="aspect-[4/5] object-cover"
                                        imgClassName="object-cover w-full h-full"
                                    />
                                </div>
                            </ScrollFadeIn>
                        )}

                        <div>
                            {/* Header oben, linksbündig – darunter die 3 Karten (wie im Bild) */}
                            <ScrollFadeIn className="mb-10 md:mb-12">
                                <SectionHeader
                                    overline={badge}
                                    title={title}
                                    titleHighlight={titleHighlight ?? undefined}
                                    as={(headingLevel as 'h1' | 'h2' | 'h3') || 'h2'}
                                    centered={false}
                                    titleClassName="chrome-text"
                                    id={headingId}
                                    className="mb-0"
                                />
                            </ScrollFadeIn>

                            <ul
                                className={cn(
                                    'grid list-none gap-6 p-0 grid-cols-1 md:grid-cols-2 lg:gap-8',
                                    hasSideMedia
                                        ? '' // Keep max 2 cols if side media is present (1fr_2fr layout)
                                        : cards.length === 4
                                          ? 'lg:grid-cols-2 xl:grid-cols-4' // Show 4 columns if exactly 4 cards, or 2x2
                                          : 'lg:grid-cols-3', // Default to 3 columns max
                                )}
                            >
                                {cards.map((card, index) => {
                                    const icon = card.icon as Media | null | undefined
                                    const cardLink = card.link
                                    const isLinkCard = hasCardLink(cardLink)
                                    const isLast = index === cards.length - 1
                                    const isOddLast = isLast && cards.length % 2 === 1 && cards.length > 1
                                    const cardContent = (
                                        <>
                                            {icon && typeof icon === 'object' && icon.url && (
                                                <div className="mb-4 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-[var(--block-radius)] border border-border bg-muted transition-transform duration-300 group-hover:scale-105 md:mb-5 md:h-14 md:w-14">
                                                    <div className="relative h-6 w-6 md:h-7 md:w-7">
                                                        <Image
                                                            src={icon.url}
                                                            alt={icon.alt ?? ''}
                                                            fill
                                                            className="object-contain"
                                                            sizes="(max-width: 768px) 24px, 28px"
                                                            loading="lazy"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                            {card.title && (
                                                <CardTitle className="mb-2 md:mb-3">
                                                    {card.title}
                                                </CardTitle>
                                            )}
                                            <div className="flex-1">
                                                {card.description && (
                                                    <CardDescription className="font-normal-text-regular">
                                                        {card.description}
                                                    </CardDescription>
                                                )}
                                            </div>
                                            {isLinkCard && (
                                                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-copper group-hover:underline">
                                                    {cardLink.label || fallbackCardLinkLabel}
                                                    <ArrowRight className="h-4 w-4 shrink-0" />
                                                </span>
                                            )}
                                        </>
                                    )
                                    return (
                                        <li
                                            key={card.id ?? index}
                                            className={cn('list-none flex h-full', isOddLast && 'md:col-span-2 lg:col-span-1')}
                                        >
                                            <ScrollFadeIn
                                                delay={80 + index * 60}
                                                animation="fade-up"
                                                className="flex h-full w-full"
                                            >
                                                {isLinkCard && cardLink ? (
                                                    <Card
                                                        asChild
                                                        variant="interactive"
                                                        className="block-card-min-h h-full w-full rounded-[var(--block-radius)] hover:-translate-y-0.5 hover:border-copper/30 hover:bg-foreground/5"
                                                    >
                                                        <CMSLink
                                                            type={cardLink.type}
                                                            reference={cardLink.reference}
                                                            url={cardLink.url}
                                                            archive={cardLink.archive}
                                                            newTab={cardLink.newTab}
                                                            label={
                                                                cardLink.label ||
                                                                card.title ||
                                                                undefined
                                                            }
                                                            className="group flex h-full flex-col justify-between p-5 text-left no-underline md:p-6"
                                                        >
                                                            {cardContent}
                                                        </CMSLink>
                                                    </Card>
                                                ) : (
                                                    <Card
                                                        variant="interactive"
                                                        className="group block-card-min-h h-full w-full rounded-[var(--block-radius)] text-left hover:-translate-y-0.5 hover:border-copper/30 hover:bg-foreground/5"
                                                    >
                                                        <CardContent className="flex h-full flex-col justify-between p-5 md:p-6">
                                                            {cardContent}
                                                        </CardContent>
                                                    </Card>
                                                )}
                                            </ScrollFadeIn>
                                        </li>
                                    )
                                })}
                            </ul>

                            {/* ── Lange Textbox unter den Karten ── */}
                            {hasContentBelow && (
                                <div className="mt-10 border-t border-border pt-8 md:mt-12 md:pt-10">
                                    <div className="max-w-3xl font-normal-text-regular text-muted-foreground [&_p]:mb-3 [&_p:last-child]:mb-0 hyphens-auto">
                                        <RichText
                                            data={contentBelowCards}
                                            enableGutter={false}
                                            enableProse={false}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}
