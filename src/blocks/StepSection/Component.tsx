import React from 'react'
import { Check, ChevronRight, MoveRight } from 'lucide-react'
import type { StepSectionBlock as StepSectionBlockProps, Media as MediaType } from '@/payload-types'

import RichText from '@/components/RichText'
import { CMSLink } from '@/components/CMSLink'
import { ScrollFadeIn } from '@/components/ScrollFadeIn'
import { Media } from '@/components/Media'
import { SectionHeader } from '@/components/SectionHeader'
import { cn } from '@/utilities/ui'

import { AnimatedCircle, ScrollProgressLine } from './Timeline.client'

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

type Props = StepSectionBlockProps & {
    disableInnerContainer?: boolean
    locale?: string
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */

const getDesktopCols = (count: number): string => {
    if (count <= 2) return 'lg:grid-cols-2'
    if (count <= 3) return 'lg:grid-cols-3'
    if (count <= 4) return 'lg:grid-cols-4'
    if (count <= 5) return 'lg:grid-cols-5'
    return 'lg:grid-cols-6'
}

/** Dashed arrow between flow items (desktop only) */
const FlowArrow: React.FC = () => (
    <div
        className="hidden lg:flex items-center justify-center flex-shrink-0 px-3"
        aria-hidden="true"
    >
        <MoveRight className="h-5 w-5 text-border" strokeWidth={1.5} />
    </div>
)

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */

export const StepSectionBlock: React.FC<Props> = (props) => {
    const {
        title,
        titleHighlight,
        headingLevel,
        intro,
        steps,
        cta,
        ctaPosition = 'center',
        backgroundColor = 'white',
        badge,
        layout = 'cards',
        cardDisplay = 'number',
        resultTitle,
        resultDescription,
        flowContainerStyle = 'none',
        flowDescription,
    } = props

    if (!steps || steps.length === 0) return null

    const hasCta = cta?.label && (cta.reference || cta.url || cta.archive)
    const isMuted = backgroundColor === 'muted'
    const bgClass = isMuted ? 'bg-muted' : 'bg-background'
    const cardClass = isMuted ? 'surface-pill' : 'surface-pill-soft'
    const stepCount = steps.length
    const isTimeline = layout === 'timeline'
    const isFlow = layout === 'flow'
    const isIconMode = cardDisplay === 'icon'
    const hasResult = isTimeline && (resultTitle || resultDescription)

    return (
        <section
            className={cn('section-padding-lg section-atmosphere', bgClass)}
            aria-label={badge || title || 'Section'}
        >
            <div className="container">
                {/* ── Header ── */}
                <div className="mx-auto mb-12 max-w-4xl text-center md:mb-16">
                    <SectionHeader
                        overline={badge ?? undefined}
                        title={title ?? ''}
                        titleHighlight={titleHighlight}
                        as={(headingLevel as 'h1' | 'h2' | 'h3') || 'h2'}
                        centered={true}
                        className="mb-0"
                    />
                    {intro && (
                        <RichText
                            className="mx-auto mt-4 max-w-3xl font-normal-text-regular text-muted-foreground md:font-medium-text-regular"
                            data={intro}
                            enableGutter={false}
                            enableProse={false}
                        />
                    )}
                </div>

                {/* ────────────────────────────────────────────────────────────── */}
                {/*  FLOW variant (Architektur/Integration)                        */}
                {/* ────────────────────────────────────────────────────────────── */}
                {isFlow && (
                    <>
                        {/* CTA above the flow card (like screenshot 2) */}
                        {hasCta && flowContainerStyle === 'card' && (
                            <ScrollFadeIn delay={100}>
                                <div
                                    className={cn(
                                        'mb-8 flex md:mb-10',
                                        ctaPosition === 'center' && 'justify-center',
                                        ctaPosition === 'left' && 'justify-start',
                                        ctaPosition === 'right' && 'justify-end',
                                    )}
                                >
                                    <CMSLink
                                        {...cta}
                                        appearance="primary-pill"
                                        size="lg"
                                        className="inline-flex w-full items-center justify-center gap-2 sm:w-auto"
                                    />
                                </div>
                            </ScrollFadeIn>
                        )}

                        <ScrollFadeIn delay={150} animation="fade-up">
                            <div
                                className={cn(
                                    flowContainerStyle === 'card' &&
                                        cn(
                                            'surface-pill padding-large',
                                            isMuted ? 'bg-background' : 'bg-muted/70',
                                        ),
                                )}
                            >
                                {/* Desktop: horizontal flow with arrows */}
                                <div className="hidden lg:flex items-center justify-center gap-0">
                                    {steps.map((step, index) => {
                                        const iconMedia = step.icon as MediaType | null | undefined
                                        const hasIcon =
                                            iconMedia &&
                                            typeof iconMedia === 'object' &&
                                            iconMedia.url
                                        const isHighlighted = step.highlight

                                        return (
                                            <React.Fragment key={step.id ?? index}>
                                                <div className="flex flex-col items-center gap-3 min-w-0 flex-1 max-w-[240px]">
                                                    {/* Icon container */}
                                                    <div
                                                        className={cn(
                                                            'flex h-14 w-14 items-center justify-center rounded-[var(--block-radius)] transition-[border-color,background-color,box-shadow] duration-300',
                                                            isHighlighted
                                                                ? 'border-2 border-primary bg-primary/5 ring-4 ring-primary/10'
                                                                : 'bg-muted border border-border',
                                                        )}
                                                    >
                                                        {hasIcon ? (
                                                            <Media
                                                                resource={iconMedia}
                                                                className="h-7 w-7"
                                                                imgClassName="object-contain"
                                                            />
                                                        ) : (
                                                            <span className="font-heading-6-bold text-muted-foreground">
                                                                {step.number || '?'}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Title + subtitle */}
                                                    <div className="text-center">
                                                        <h3 className="font-heading-6-bold text-foreground leading-tight">
                                                            {step.title}
                                                        </h3>
                                                        {step.subtitle && (
                                                            <p
                                                                className={cn(
                                                                    'font-subtext-regular mt-0.5',
                                                                    isHighlighted
                                                                        ? 'text-primary'
                                                                        : 'text-muted-foreground',
                                                                )}
                                                            >
                                                                {step.subtitle}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Arrow between items */}
                                                {index < stepCount - 1 && <FlowArrow />}
                                            </React.Fragment>
                                        )
                                    })}
                                </div>

                                {/* Mobile/Tablet: 2-col grid, no arrows */}
                                <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:hidden">
                                    {steps.map((step, index) => {
                                        const iconMedia = step.icon as MediaType | null | undefined
                                        const hasIcon =
                                            iconMedia &&
                                            typeof iconMedia === 'object' &&
                                            iconMedia.url
                                        const isHighlighted = step.highlight
                                        const isOddLast =
                                            index === stepCount - 1 &&
                                            stepCount % 2 === 1 &&
                                            stepCount > 1

                                        return (
                                            <ScrollFadeIn
                                                key={step.id ?? index}
                                                delay={80 + index * 60}
                                                animation="fade-up"
                                                className={isOddLast ? 'col-span-2' : undefined}
                                            >
                                                <div className="flex flex-col items-center gap-2.5 text-center">
                                                    <div
                                                        className={cn(
                                                            'flex h-12 w-12 items-center justify-center rounded-[var(--block-radius)] transition-[border-color,background-color] duration-300',
                                                            isHighlighted
                                                                ? 'border-2 border-primary bg-primary/5'
                                                                : 'bg-muted border border-border',
                                                        )}
                                                    >
                                                        {hasIcon ? (
                                                            <Media
                                                                resource={iconMedia}
                                                                className="h-6 w-6"
                                                                imgClassName="object-contain"
                                                            />
                                                        ) : (
                                                            <span className="font-subtext-semibold text-muted-foreground">
                                                                {step.number || '?'}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <h3 className="font-heading-6-bold text-foreground leading-tight">
                                                        {step.title}
                                                    </h3>
                                                    {step.subtitle && (
                                                        <p
                                                            className={cn(
                                                                'font-subtext-regular',
                                                                isHighlighted
                                                                    ? 'text-primary'
                                                                    : 'text-muted-foreground',
                                                            )}
                                                        >
                                                            {step.subtitle}
                                                        </p>
                                                    )}
                                                </div>
                                            </ScrollFadeIn>
                                        )
                                    })}
                                </div>
                            </div>
                        </ScrollFadeIn>

                        {/* Flow description text below */}
                        {flowDescription && (
                            <ScrollFadeIn delay={300}>
                                <div className="mx-auto mt-8 max-w-3xl text-center md:mt-12">
                                    <p className="font-normal-text-regular text-muted-foreground md:font-medium-text-regular whitespace-pre-line">
                                        {flowDescription}
                                    </p>
                                </div>
                            </ScrollFadeIn>
                        )}

                        {/* CTA below flow (when no card container) */}
                        {hasCta && flowContainerStyle === 'none' && (
                            <ScrollFadeIn delay={350}>
                                <div
                                    className={cn(
                                        'mt-10 flex md:mt-14',
                                        ctaPosition === 'center' && 'justify-center',
                                        ctaPosition === 'left' && 'justify-start',
                                        ctaPosition === 'right' && 'justify-end',
                                    )}
                                >
                                    <CMSLink
                                        {...cta}
                                        appearance="primary-pill"
                                        size="lg"
                                        className="inline-flex w-full items-center justify-center gap-2 sm:w-auto"
                                    />
                                </div>
                            </ScrollFadeIn>
                        )}
                    </>
                )}

                {/* ────────────────────────────────────────────────────────────── */}
                {/*  CARDS variant (StepSection.png / OverviewSection.png)          */}
                {/* ────────────────────────────────────────────────────────────── */}
                {!isTimeline && !isFlow && (
                    <ol
                        className={cn(
                            'grid list-none gap-6 p-0 md:gap-8',
                            'grid-cols-1 md:grid-cols-2',
                            getDesktopCols(stepCount),
                        )}
                    >
                        {steps.map((step, index) => {
                            const isLast = index === steps.length - 1
                            const iconMedia = step.icon as MediaType | null | undefined
                            const hasIcon =
                                isIconMode &&
                                iconMedia &&
                                typeof iconMedia === 'object' &&
                                iconMedia.url

                            // Last item on an odd-count grid: span 2 cols at md (before lg kicks in)
                            const isOddLast = isLast && stepCount % 2 === 1 && stepCount > 1

                            return (
                                <li
                                    key={step.id ?? index}
                                    className={cn('list-none', isOddLast && 'md:col-span-2 lg:col-span-1')}
                                >
                                    <ScrollFadeIn delay={index * 120} className="h-full">
                                        <div className="group relative h-full">
                                            {/* Chevron between cards (number mode only) */}
                                            {!isIconMode && !isLast && (
                                                <div
                                                    className="absolute -right-[0.85rem] top-1/2 z-20 hidden -translate-y-1/2 text-border lg:flex"
                                                    aria-hidden="true"
                                                >
                                                    <ChevronRight className="h-4 w-4" />
                                                </div>
                                            )}
                                            <div
                                                className={cn(
                                                    'relative flex h-full flex-col padding-large',
                                                    cardClass,
                                                )}
                                            >
                                                {/* Icon mode: show icon in rounded container */}
                                                {isIconMode ? (
                                                    <div className="mb-4" aria-hidden="true">
                                                        {hasIcon ? (
                                                            <div className="flex h-12 w-12 items-center justify-center rounded-[var(--block-radius)] bg-muted">
                                                                <Media
                                                                    resource={iconMedia}
                                                                    className="h-7 w-7"
                                                                    imgClassName="object-contain"
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div className="flex h-12 w-12 items-center justify-center rounded-[var(--block-radius)] bg-muted">
                                                                <span className="font-heading-6-bold text-muted-foreground">
                                                                    ?
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    /* Number mode: big ghost number */
                                                    <span
                                                        className="mb-4 block font-heading-1-bold leading-none text-muted-foreground/30"
                                                        aria-hidden="true"
                                                    >
                                                        {step.number}
                                                    </span>
                                                )}
                                                <h3 className="font-heading-5-bold text-foreground mb-1.5">
                                                    {step.title}
                                                </h3>
                                                {step.description && (
                                                    <p className="font-normal-text-regular text-muted-foreground leading-relaxed">
                                                        {step.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </ScrollFadeIn>
                                </li>
                            )
                        })}
                    </ol>
                )}

                {/* ────────────────────────────────────────────────────────────── */}
                {/*  TIMELINE variant (AblaufSection.png)                          */}
                {/* ────────────────────────────────────────────────────────────── */}
                {isTimeline && (
                    <>
                        {/* ── DESKTOP (lg+) ── */}
                        <div className={cn('hidden lg:grid gap-6', getDesktopCols(stepCount))}>
                            {steps.map((step, index) => {
                                const iconMedia = step.icon as MediaType | null | undefined
                                const hasIcon =
                                    iconMedia && typeof iconMedia === 'object' && iconMedia.url

                                return (
                                    <ScrollFadeIn key={step.id ?? index} delay={index * 120} className="h-full">
                                        <div className="flex h-full flex-col items-center">
                                            {/* Circle + connecting line */}
                                            <div className="relative mb-5 flex w-full items-center justify-center">
                                                {index > 0 && (
                                                    <div
                                                        className="absolute left-0 top-1/2 h-px w-[calc(50%-26px)] -translate-y-1/2 bg-border"
                                                        aria-hidden="true"
                                                    />
                                                )}
                                                {index < stepCount - 1 && (
                                                    <div
                                                        className="absolute right-0 top-1/2 h-px w-[calc(50%-26px)] -translate-y-1/2 bg-border"
                                                        aria-hidden="true"
                                                    />
                                                )}
                                                <AnimatedCircle
                                                    number={step.number ?? ''}
                                                    size="md"
                                                />
                                            </div>

                                            {/* Card */}
                                            <div
                                                className={cn(
                                                    'flex w-full flex-1 flex-col items-center p-5 text-center md:p-6',
                                                    cardClass,
                                                )}
                                            >
                                                {hasIcon ? (
                                                    <div
                                                        className="mb-3 flex h-10 w-10 items-center justify-center"
                                                        aria-hidden="true"
                                                    >
                                                        <Media
                                                            resource={iconMedia}
                                                            className="h-6 w-6"
                                                            imgClassName="object-contain"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div
                                                        className="mb-3 flex h-10 w-10 items-center justify-center rounded-[var(--block-radius)] bg-primary/10"
                                                        aria-hidden="true"
                                                    >
                                                        <span className="font-subtext-semibold text-primary">
                                                            {step.number}
                                                        </span>
                                                    </div>
                                                )}
                                                <h3 className="font-heading-5-bold text-foreground mb-1">
                                                    {step.title}
                                                </h3>
                                                {step.description && (
                                                    <p className="font-normal-text-regular text-muted-foreground leading-relaxed">
                                                        {step.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </ScrollFadeIn>
                                )
                            })}
                        </div>

                        {/* ── MOBILE / TABLET (<lg): vertical timeline with scroll progress ── */}
                        <ScrollProgressLine>
                            <div className="flex flex-col gap-0">
                                {steps.map((step, index) => {
                                    const iconMedia = step.icon as MediaType | null | undefined
                                    const hasIcon =
                                        iconMedia && typeof iconMedia === 'object' && iconMedia.url
                                    const isLast = index === steps.length - 1

                                    return (
                                        <ScrollFadeIn key={step.id ?? index} delay={index * 100}>
                                            <div className="flex items-center gap-4 md:gap-5">
                                                {/* Left: animated circle + connector */}
                                                <div className="relative flex flex-shrink-0 flex-col items-center self-stretch">
                                                    <div className="flex flex-1 items-center">
                                                        <AnimatedCircle
                                                            number={step.number ?? ''}
                                                            size="sm"
                                                        />
                                                    </div>
                                                    {!isLast && (
                                                        <div
                                                            className="absolute left-1/2 top-[calc(50%+20px)] bottom-0 w-px -translate-x-1/2 bg-transparent md:top-[calc(50%+24px)]"
                                                            aria-hidden="true"
                                                        />
                                                    )}
                                                </div>

                                                {/* Right: card */}
                                                <div
                                                    className={cn(
                                                        'mb-6 flex-1 p-4 md:mb-8 md:p-5',
                                                        cardClass,
                                                    )}
                                                >
                                                    {hasIcon ? (
                                                        <div
                                                            className="mb-3 flex h-9 w-9 items-center justify-center"
                                                            aria-hidden="true"
                                                        >
                                                            <Media
                                                                resource={iconMedia}
                                                                className="h-5 w-5"
                                                                imgClassName="object-contain"
                                                            />
                                                        </div>
                                                    ) : null}
                                                    <h3 className="font-heading-5-bold text-foreground mb-1">
                                                        {step.title}
                                                    </h3>
                                                    {step.description && (
                                                        <p className="font-normal-text-regular text-muted-foreground leading-relaxed">
                                                            {step.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </ScrollFadeIn>
                                    )
                                })}
                            </div>
                        </ScrollProgressLine>
                    </>
                )}

                {/* ── Ergebnis-Box ── */}
                {hasResult && (
                    <ScrollFadeIn delay={(stepCount + 1) * 100}>
                        <div className="surface-pill mt-10 flex items-start gap-4 border-primary/20 bg-primary/5 padding-large md:mt-14 md:gap-5">
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground md:h-12 md:w-12">
                                <Check className="h-5 w-5 md:h-6 md:w-6" aria-hidden="true" />
                            </div>
                            <div className="min-w-0 flex-1">
                                {resultTitle && (
                                    <h3 className="font-heading-5-bold text-foreground mb-1">
                                        {resultTitle}
                                    </h3>
                                )}
                                {resultDescription && (
                                    <p className="font-normal-text-regular text-muted-foreground leading-relaxed">
                                        {resultDescription}
                                    </p>
                                )}
                            </div>
                        </div>
                    </ScrollFadeIn>
                )}

                {/* ── CTA (cards + timeline variants) ── */}
                {hasCta && !isFlow && (
                    <ScrollFadeIn delay={(stepCount + 1) * 100}>
                        <div
                            className={cn(
                                'mt-10 flex md:mt-14',
                                ctaPosition === 'center' && 'justify-center',
                                ctaPosition === 'left' && 'justify-start',
                                ctaPosition === 'right' && 'justify-end',
                            )}
                        >
                            <CMSLink
                                {...cta}
                                appearance="primary-pill"
                                size="lg"
                                className="inline-flex w-full items-center justify-center gap-2 sm:w-auto"
                            />
                        </div>
                    </ScrollFadeIn>
                )}
            </div>
        </section>
    )
}
