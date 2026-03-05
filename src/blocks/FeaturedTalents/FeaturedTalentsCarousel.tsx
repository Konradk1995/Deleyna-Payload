'use client'

import { AnimatePresence, motion, type PanInfo } from 'motion/react'
import { cn } from '@/utilities/ui'
import { SectionHeader } from '@/components/SectionHeader'
import { AddToSelectionButton } from '@/components/Dancefloor/AddToDancefloorButton'
import { getEyeLabel, getHairLabel } from '@/lib/constants/talentOptions'
import { Media } from '@/components/Media'
import { Link, useRouter } from '@/i18n/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import React, { useState, useCallback, useMemo } from 'react'

export interface TalentItem {
    id: string
    name: string
    slug: string
    category: 'dancer' | 'model' | 'both'
    imageUrl?: string
    cutoutImageUrl?: string
    height?: string
    hair?: string | string[]
    eyes?: string | string[]
}

interface FeaturedTalentsCarouselProps {
    talents: TalentItem[]
    overline?: string | null
    title?: string | null
    layout?: 'carousel' | 'premium'
    size?: 'normal' | 'hero'
    className?: string
    locale?: string
}

const CATEGORY_LABELS: Record<string, Record<string, string>> = {
    de: { dancer: 'Tänzer/in', model: 'Model', both: 'Tänzer/in & Model' },
    en: { dancer: 'Dancer', model: 'Model', both: 'Dancer & Model' },
}

const mapOptionValue = (
    value: string | string[] | undefined,
    locale: string,
    type: 'hair' | 'eyes',
): string => {
    const format = (token: string) =>
        type === 'hair'
            ? getHairLabel(token, locale === 'en' ? 'en' : 'de')
            : getEyeLabel(token, locale === 'en' ? 'en' : 'de')

    if (!value) return ''
    return Array.isArray(value) ? value.map(format).join(', ') : format(value)
}

export function FeaturedTalentsCarousel({
    talents,
    overline,
    title,
    layout = 'carousel',
    size = 'normal',
    className,
    locale = 'de',
}: FeaturedTalentsCarouselProps) {
    const router = useRouter()
    const [activeIndex, setActiveIndex] = useState(0)
    const [isTransitioning, setIsTransitioning] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const total = talents.length
    const labels = useMemo(() => CATEGORY_LABELS[locale] || CATEGORY_LABELS.de, [locale])

    const goTo = useCallback(
        (index: number) => {
            if (isTransitioning || index === activeIndex) return
            setIsTransitioning(true)
            setActiveIndex(index)
            setTimeout(() => setIsTransitioning(false), 500)
        },
        [isTransitioning, activeIndex],
    )

    const goNext = useCallback(() => {
        goTo(activeIndex === total - 1 ? 0 : activeIndex + 1)
    }, [activeIndex, total, goTo])

    const goPrev = useCallback(() => {
        goTo(activeIndex === 0 ? total - 1 : activeIndex - 1)
    }, [activeIndex, total, goTo])

    const onDragStart = () => {
        setIsDragging(true)
    }

    const onDragEnd = (_: unknown, info: PanInfo) => {
        setIsDragging(false)
        const threshold = 50
        if (info.offset.x < -threshold) goNext()
        else if (info.offset.x > threshold) goPrev()
    }

    // Touch handlers for standard carousel
    const touchStart = React.useRef<number | null>(null)
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStart.current = e.touches[0].clientX
    }
    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStart.current === null) return
        const touchEnd = e.changedTouches[0].clientX
        const diff = touchStart.current - touchEnd
        const threshold = 50
        if (diff > threshold) goNext()
        else if (diff < -threshold) goPrev()
        touchStart.current = null
    }
    const stopAutoplay = () => {}

    if (!talents || talents.length === 0) return null

    const activeTalent = talents[activeIndex]
    const defaultTitle = locale === 'de' ? 'Unsere Talente' : 'Our Talents'

    const getSlideIndex = (offset: number) => {
        return (activeIndex + offset + total) % total
    }

    const stats = [
        activeTalent.height && {
            label: locale === 'de' ? 'Größe' : 'Height',
            value: activeTalent.height,
        },
        activeTalent.hair && {
            label: locale === 'de' ? 'Haar' : 'Hair',
            value: mapOptionValue(activeTalent.hair, locale, 'hair'),
        },
        activeTalent.eyes && {
            label: locale === 'de' ? 'Augen' : 'Eyes',
            value: mapOptionValue(activeTalent.eyes, locale, 'eyes'),
        },
    ].filter(Boolean) as Array<{ label: string; value: string }>

    if (layout === 'premium') {
        const isHero = size === 'hero'

        return (
            <section
                className={cn(
                    'relative overflow-visible bg-background text-foreground dark:bg-surface-inverse dark:text-on-media',
                    isHero ? 'py-20 lg:py-28' : 'section-padding-lg',
                    className,
                )}
            >
                {/* Background Atmosphere */}
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute left-1/2 top-1/4 h-[30rem] w-[50rem] -translate-x-1/2 rounded-full bg-copper/10 blur-[140px]" />
                    <div className="absolute bottom-0 left-1/2 h-64 w-[60rem] -translate-x-1/2 rounded-full bg-copper/5 blur-[100px]" />
                </div>

                <div className="container relative mb-12">
                    <SectionHeader
                        overline={overline ?? undefined}
                        title={title ?? defaultTitle}
                        titleClassName="chrome-text"
                        className={cn(isHero ? 'mb-16 lg:mb-20' : 'mb-0')}
                    />
                </div>

                <div className="relative overflow-visible">
                    <div className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 px-4 sm:px-8 lg:px-12">
                        <div className="relative mx-auto max-w-[1400px]">
                            <motion.div
                                className={cn(
                                    'relative flex cursor-grab touch-pan-y items-center justify-center active:cursor-grabbing',
                                    isHero ? 'h-[40rem] lg:h-[45rem]' : 'h-[35rem]',
                                )}
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                dragElastic={0.2}
                                dragMomentum={false}
                                onDragStart={onDragStart}
                                onDragEnd={onDragEnd}
                            >
                                <AnimatePresence mode="popLayout" initial={false}>
                                    {[-1, 0, 1].map((offset) => {
                                        const index = getSlideIndex(offset)
                                        const talent = talents[index]
                                        const isActive = offset === 0
                                        const isActiveCutout =
                                            isActive && Boolean(talent.cutoutImageUrl)

                                        return (
                                            <motion.div
                                                key={`${talent.id}-${offset}`}
                                                initial={{
                                                    scale: isActive ? 1 : 0.8,
                                                    opacity: isActive ? 1 : 0.3,
                                                    x: offset * (isHero ? 400 : 320),
                                                    zIndex: isActive ? 20 : 10,
                                                }}
                                                animate={{
                                                    scale: isActive ? 1.1 : 0.8,
                                                    opacity: isActive ? 1 : 0.3,
                                                    x: offset * (isActive ? 0 : isHero ? 450 : 360),
                                                    zIndex: isActive ? 20 : 10,
                                                }}
                                                exit={{
                                                    scale: 0.7,
                                                    opacity: 0,
                                                    x: offset > 0 ? 500 : -500,
                                                }}
                                                transition={{
                                                    type: 'spring',
                                                    stiffness: 260,
                                                    damping: 26,
                                                }}
                                                className={cn(
                                                    'absolute cursor-pointer',
                                                    isHero
                                                        ? 'h-[36rem] w-[24rem] lg:h-[42rem] lg:w-[28rem]'
                                                        : 'h-[30rem] w-[20rem]',
                                                )}
                                                onClick={() => {
                                                    if (isDragging) return
                                                    if (offset !== 0) goTo(index)
                                                    else
                                                        router.push({
                                                            pathname: '/talents/[slug]',
                                                            params: { slug: talent.slug },
                                                        })
                                                }}
                                            >
                                                {/* Platform glow underneath talent */}
                                                {isActive && (
                                                    <div className="absolute -bottom-4 left-1/2 z-0 h-16 w-72 -translate-x-1/2 rounded-[100%] bg-copper/25 blur-2xl filter" />
                                                )}
                                                {isActive && (
                                                    <div className="absolute -bottom-1 left-1/2 z-0 h-8 w-52 -translate-x-1/2 rounded-[100%] border border-copper/40 bg-copper/15 backdrop-blur-sm" />
                                                )}

                                                {/* Radial spotlight glow behind cutout */}
                                                {isActive && talent.cutoutImageUrl && (
                                                    <div
                                                        className="absolute inset-0 z-0"
                                                        style={{
                                                            background:
                                                                'radial-gradient(ellipse 70% 90% at 50% 55%, rgba(184,134,72,0.20) 0%, rgba(184,134,72,0.08) 40%, transparent 100%)',
                                                        }}
                                                    />
                                                )}

                                                <div
                                                    className={cn(
                                                        'relative h-full w-full rounded-[var(--block-radius)] transition duration-500',
                                                        isActive && talent.cutoutImageUrl
                                                            ? 'overflow-visible border border-copper/20 bg-card/5 backdrop-blur-[2px]'
                                                            : 'overflow-hidden border border-border/50 bg-card/10 backdrop-blur-[2px]',
                                                        isActive
                                                            ? 'shadow-2xl shadow-copper/10'
                                                            : 'shadow-lg',
                                                    )}
                                                >
                                                    {/* Image */}
                                                    <div className="relative h-full w-full">
                                                        <Media
                                                            resource={
                                                                talent.cutoutImageUrl ||
                                                                talent.imageUrl ||
                                                                ''
                                                            }
                                                            alt={talent.name}
                                                            fill
                                                            size="(max-width: 640px) 75vw, (max-width: 1024px) 50vw, 540px"
                                                            imgClassName={cn(
                                                                'transition-transform duration-700',
                                                                isActive && !talent.cutoutImageUrl
                                                                    ? 'scale-105'
                                                                    : '',
                                                                talent.cutoutImageUrl
                                                                    ? 'object-contain object-bottom p-4'
                                                                    : 'object-cover',
                                                            )}
                                                            priority={isActive}
                                                        />
                                                        {/* Overlay only for non-cutout or inactive */}
                                                        {(!talent.cutoutImageUrl || !isActive) && (
                                                            <div className="absolute inset-0 bg-gradient-to-t from-[rgb(var(--media-overlay))/0.84] via-[rgb(var(--media-overlay))/0.16] to-transparent" />
                                                        )}
                                                    </div>

                                                    {/* Name details (overlay when active) */}
                                                    {isActive && (
                                                        <div
                                                            className={cn(
                                                                'absolute bottom-0 left-0 right-0 text-on-media lg:hidden',
                                                                isActiveCutout
                                                                    ? 'p-4'
                                                                    : 'padding-large',
                                                            )}
                                                        >
                                                            <motion.div
                                                                initial={{ opacity: 0, y: 10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{ delay: 0.2 }}
                                                                className={cn(
                                                                    isActiveCutout &&
                                                                        'mx-auto max-w-[22rem] rounded-2xl border border-white/20 bg-media-overlay-strong px-4 py-3 backdrop-blur-md',
                                                                )}
                                                            >
                                                                <span className="mb-2 badge-pill badge-pill-sm badge-pill-copper">
                                                                    {labels[talent.category] ||
                                                                        talent.category}
                                                                </span>
                                                                <h3 className="font-display font-heading-4-bold text-on-media drop-shadow-lg">
                                                                    {talent.name}
                                                                </h3>
                                                            </motion.div>
                                                        </div>
                                                    )}

                                                    <AddToSelectionButton
                                                        talent={{
                                                            id: talent.id,
                                                            name: talent.name,
                                                            slug: talent.slug,
                                                        }}
                                                        variant="icon"
                                                        tone="onMedia"
                                                        className={cn(
                                                            'absolute z-20',
                                                            isActiveCutout
                                                                ? 'right-2 top-2 sm:right-3 sm:top-3 bg-media-overlay-strong'
                                                                : 'right-4 top-4',
                                                        )}
                                                    />
                                                </div>
                                            </motion.div>
                                        )
                                    })}
                                </AnimatePresence>
                            </motion.div>

                            {/* Stats Panel (Desktop Top-Right) */}
                            <div className="pointer-events-none absolute right-2 top-4 z-30 hidden lg:block xl:right-4">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeTalent.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="pointer-events-auto w-[190px] rounded-2xl border border-copper/25 bg-card/65 p-3.5 shadow-xl backdrop-blur-xl xl:w-[210px] xl:p-4"
                                    >
                                        <span className="mb-2 badge-pill badge-pill-sm badge-pill-copper">
                                            {labels[activeTalent.category] || activeTalent.category}
                                        </span>
                                        <h2 className="chrome-text mb-3 font-display text-base font-bold leading-tight">
                                            {activeTalent.name}
                                        </h2>

                                        {stats.length > 0 && (
                                            <div className="space-y-2.5">
                                                {stats.map((stat) => (
                                                    <div key={stat.label}>
                                                        <p className="mb-1 text-label-small text-muted-foreground">
                                                            {stat.label}
                                                        </p>
                                                        <p className="text-sm font-semibold text-foreground">
                                                            {stat.value}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <div className="mt-3">
                                            <Link
                                                href={{
                                                    pathname: '/talents/[slug]',
                                                    params: { slug: activeTalent.slug },
                                                }}
                                                className="group inline-flex items-center gap-1.5 rounded-full bg-copper px-4 py-2 text-xs font-bold text-white transition hover:bg-copper-accent hover:shadow-[0_0_20px_rgba(var(--copper-rgb),0.4)]"
                                            >
                                                {locale === 'de'
                                                    ? 'Profil ansehen'
                                                    : 'View profile'}
                                                <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                                            </Link>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {/* Controls (Absolute or relative to breakout) */}
                    <div className="mt-8 flex items-center justify-center gap-8">
                        <button
                            type="button"
                            onClick={goPrev}
                            aria-label={locale === 'de' ? 'Vorheriges Talent' : 'Previous talent'}
                            className="flex h-14 w-14 items-center justify-center rounded-full border border-copper/30 bg-copper/5 text-copper transition hover:bg-copper hover:text-white hover:shadow-[0_0_15px_rgba(var(--copper-rgb),0.3)]"
                        >
                            <ChevronLeft className="h-7 w-7" />
                        </button>
                        <div className="flex gap-2.5">
                            {talents.map((_, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => goTo(i)}
                                    aria-label={`Slide ${i + 1}`}
                                    className="group relative flex h-8 min-w-8 items-center justify-center cursor-pointer p-2"
                                >
                                    <span
                                        className={cn(
                                            'h-2 rounded-full transition duration-300',
                                            i === activeIndex
                                                ? 'w-10 bg-copper'
                                                : 'w-2 bg-copper/20 group-hover:bg-copper/40',
                                        )}
                                    />
                                </button>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={goNext}
                            aria-label={locale === 'de' ? 'Nächstes Talent' : 'Next talent'}
                            className="flex h-14 w-14 items-center justify-center rounded-full border border-copper/30 bg-copper/5 text-copper transition hover:bg-copper hover:text-white hover:shadow-[0_0_15px_rgba(var(--copper-rgb),0.3)]"
                        >
                            <ChevronRight className="h-7 w-7" />
                        </button>
                    </div>
                </div>
            </section>
        )
    }

    // Fallback to existing Carousel (Standard) logic...
    // (Existing Component code remains for 'carousel' layout)

    return (
        <section
            className={cn(
                'section-padding-lg section-atmosphere relative overflow-x-clip bg-background text-foreground dark:bg-surface-inverse dark:text-on-media',
                className,
            )}
        >
            {/* Background atmosphere */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-1/2 top-0 h-96 w-[50rem] -translate-x-1/2 rounded-full bg-copper/5 blur-[120px]" />
                <div className="absolute bottom-0 left-1/4 h-64 w-96 rounded-full bg-copper/5 blur-[100px]" />
            </div>

            <div className="container relative">
                <SectionHeader
                    overline={overline ?? undefined}
                    title={title ?? defaultTitle}
                    titleClassName="chrome-text"
                />
            </div>

            <div className="container relative">
                {/* Main slider area */}
                <div
                    className="relative mx-auto"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    onPointerDown={stopAutoplay}
                >
                    {/* Desktop: 3-card peek layout */}
                    <div className="hidden md:block">
                        <div className="block-carousel-h relative flex items-center justify-center gap-4 lg:gap-6 overflow-visible">
                            {/* Previous card (peek) */}
                            {total > 1 && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        stopAutoplay()
                                        goPrev()
                                    }}
                                    className="block-carousel-peek-h group relative w-48 flex-shrink-0 scale-90 cursor-pointer overflow-hidden rounded-[var(--block-radius)] opacity-40 transition duration-500 hover:opacity-60 lg:w-56"
                                    aria-label="Previous talent"
                                >
                                    <SlideImage talent={talents[getSlideIndex(-1)]} />
                                    <div className="bg-media-overlay absolute inset-0" />
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ChevronLeft className="h-8 w-8 text-on-media drop-shadow-lg" />
                                    </div>
                                </button>
                            )}

                            {/* Active card (center, large) */}
                            <div className="relative h-[32rem] w-80 lg:w-96 flex-shrink-0">
                                <Link
                                    href={{
                                        pathname: '/talents/[slug]',
                                        params: { slug: activeTalent.slug },
                                    }}
                                    className={cn(
                                        'relative block h-full w-full overflow-hidden rounded-[var(--block-radius)] transition duration-500',
                                        'ring-2 ring-copper/30 shadow-2xl shadow-copper/10',
                                    )}
                                >
                                    <SlideImage talent={activeTalent} priority />
                                    {/* Gradient overlay */}
                                    <div className="absolute inset-0 bg-media-overlay-gradient" />

                                    {/* Name at bottom */}
                                    <div
                                        className={cn(
                                            'absolute bottom-0 left-0 right-0 p-6 transition duration-400',
                                            isTransitioning
                                                ? 'opacity-0 translate-y-2'
                                                : 'opacity-100 translate-y-0',
                                        )}
                                    >
                                        <span className="mb-2 badge-pill badge-pill-sm badge-pill-copper">
                                            {labels[activeTalent.category] || activeTalent.category}
                                        </span>
                                        <h3 className="font-display font-heading-5-bold text-on-media [text-shadow:0_6px_22px_rgb(var(--media-overlay)/0.5)]">
                                            {activeTalent.name}
                                        </h3>
                                    </div>
                                </Link>
                                <AddToSelectionButton
                                    talent={{
                                        id: activeTalent.id,
                                        name: activeTalent.name,
                                        slug: activeTalent.slug,
                                    }}
                                    variant="icon"
                                    tone="onMedia"
                                    className="absolute right-4 top-4 z-20"
                                />

                                {/* Gold glow behind active card */}
                                <div className="pointer-events-none absolute -inset-4 -z-10 rounded-[var(--block-radius)] bg-copper/8 blur-2xl" />
                            </div>

                            {/* Next card (peek) */}
                            {total > 1 && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        stopAutoplay()
                                        goNext()
                                    }}
                                    className="block-carousel-peek-h group relative w-48 flex-shrink-0 scale-90 cursor-pointer overflow-hidden rounded-[var(--block-radius)] opacity-40 transition duration-500 hover:opacity-60 lg:w-56"
                                    aria-label="Next talent"
                                >
                                    <SlideImage talent={talents[getSlideIndex(1)]} />
                                    <div className="bg-media-overlay absolute inset-0" />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ChevronRight className="h-8 w-8 text-on-media drop-shadow-lg" />
                                    </div>
                                </button>
                            )}

                            {/* Stats panel (top-right, gold themed) */}
                            {stats.length > 0 && (
                                <div
                                    className={cn(
                                        'absolute right-2 top-3 z-30 transition duration-500 lg:right-4',
                                        isTransitioning
                                            ? 'opacity-0 translate-x-4'
                                            : 'opacity-100 translate-x-0',
                                    )}
                                >
                                    <div className="w-[176px] rounded-xl border border-copper/20 bg-media-overlay-medium p-3.5 backdrop-blur-md">
                                        <div className="mb-3 text-label-small text-copper/80 font-bold">
                                            {locale === 'de' ? 'Details' : 'Details'}
                                        </div>
                                        <div className="space-y-2.5">
                                            {stats.map((stat) => (
                                                <div key={stat.label}>
                                                    <div className="text-label-small text-on-media-muted">
                                                        {stat.label}
                                                    </div>
                                                    <div className="text-sm font-semibold text-copper">
                                                        {stat.value}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <Link
                                            href={{
                                                pathname: '/talents/[slug]',
                                                params: { slug: activeTalent.slug },
                                            }}
                                            className="mt-4 flex items-center gap-1 text-xs font-semibold text-copper/80 hover:text-copper transition-colors"
                                        >
                                            {locale === 'de' ? 'Profil ansehen' : 'View profile'}
                                            <ChevronRight className="h-3 w-3" />
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile: Swipeable with peek */}
                    <div className="md:hidden">
                        <div className="relative flex items-center justify-center block-carousel-h md:h-auto">
                            {/* Prev peek (small) */}
                            {total > 1 && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        stopAutoplay()
                                        goPrev()
                                    }}
                                    className="absolute left-0 z-10 h-56 w-16 overflow-hidden rounded-r-xl opacity-30 transition-opacity"
                                    aria-label="Previous"
                                >
                                    <SlideImage talent={talents[getSlideIndex(-1)]} />
                                    <div className="absolute inset-0 bg-media-overlay-strong" />
                                </button>
                            )}

                            {/* Active card */}
                            <div className="block-carousel-h relative w-[75vw] max-w-[20rem] md:h-auto">
                                <Link
                                    href={{
                                        pathname: '/talents/[slug]',
                                        params: { slug: activeTalent.slug },
                                    }}
                                    className={cn(
                                        'relative block h-full w-full overflow-hidden rounded-[var(--block-radius)] transition duration-400',
                                        'ring-1 ring-copper/25 [box-shadow:0_16px_40px_rgb(var(--media-overlay)/0.3)]',
                                    )}
                                >
                                    <SlideImage talent={activeTalent} priority />
                                    <div className="absolute inset-0 bg-media-overlay-gradient" />

                                    {/* Mobile info overlay */}
                                    <div
                                        className={cn(
                                            'absolute bottom-0 left-0 right-0 p-5 transition duration-300',
                                            isTransitioning ? 'opacity-0' : 'opacity-100',
                                        )}
                                    >
                                        <span className="mb-1.5 badge-pill badge-pill-sm badge-pill-copper">
                                            {labels[activeTalent.category]}
                                        </span>
                                        <h3 className="font-display font-heading-5-bold text-on-media [text-shadow:0_6px_20px_rgb(var(--media-overlay)/0.5)]">
                                            {activeTalent.name}
                                        </h3>
                                        {stats.length > 0 && (
                                            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                                                {stats.map((stat) => (
                                                    <span
                                                        key={stat.label}
                                                        className="text-label-small text-copper/80"
                                                    >
                                                        <span className="text-on-media-muted">
                                                            {stat.label}:{' '}
                                                        </span>
                                                        {stat.value}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </Link>
                                <AddToSelectionButton
                                    talent={{
                                        id: activeTalent.id,
                                        name: activeTalent.name,
                                        slug: activeTalent.slug,
                                    }}
                                    variant="icon"
                                    tone="onMedia"
                                    className="absolute right-3 top-3 z-20"
                                />
                            </div>

                            {/* Next peek (small) */}
                            {total > 1 && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        stopAutoplay()
                                        goNext()
                                    }}
                                    className="absolute right-0 z-10 h-56 w-16 overflow-hidden rounded-l-xl opacity-30 transition-opacity"
                                    aria-label="Next"
                                >
                                    <SlideImage talent={talents[getSlideIndex(1)]} />
                                    <div className="absolute inset-0 bg-media-overlay-strong" />
                                </button>
                            )}
                        </div>

                        {/* Mobile dots */}
                        <div className="mt-5 flex justify-center gap-1.5">
                            {talents.map((_, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => {
                                        stopAutoplay()
                                        goTo(i)
                                    }}
                                    aria-label={`Slide ${i + 1}`}
                                    className="flex items-center justify-center rounded-full px-2 py-3"
                                >
                                    <span
                                        className={cn(
                                            'h-1.5 rounded-full transition duration-300',
                                            i === activeIndex
                                                ? 'w-6 bg-copper'
                                                : 'w-1.5 bg-on-media-soft group-hover:bg-on-media-medium',
                                        )}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Desktop dots (below cards) */}
                    <div className="hidden md:flex justify-center gap-2 mt-8">
                        {talents.map((_, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => {
                                    stopAutoplay()
                                    goTo(i)
                                }}
                                aria-label={`Slide ${i + 1}`}
                                className="flex items-center justify-center rounded-full p-3"
                            >
                                <span
                                    className={cn(
                                        'h-1.5 rounded-full transition duration-300',
                                        i === activeIndex
                                            ? 'w-8 bg-copper'
                                            : 'w-1.5 bg-on-media-weak hover:bg-copper/40',
                                    )}
                                />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

/* ─── Slide Image ─── */
function SlideImage({ talent, priority = false }: { talent: TalentItem; priority?: boolean }) {
    const source = talent.cutoutImageUrl || talent.imageUrl

    if (!source) {
        return <div className="absolute inset-0 bg-gradient-to-br from-card to-muted" />
    }

    return (
        <Media
            resource={source}
            alt={talent.name}
            fill
            size="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 400px"
            imgClassName={
                talent.cutoutImageUrl ? 'object-contain object-bottom p-3' : 'object-cover'
            }
            priority={priority}
        />
    )
}
