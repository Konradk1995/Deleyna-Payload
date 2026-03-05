'use client'

import React, { useEffect, useState, useCallback, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import useEmblaCarousel from 'embla-carousel-react'
import { motion, AnimatePresence } from 'motion/react'
import { Link } from '@/i18n/navigation'
import { AddToSelectionButton } from '@/components/Dancefloor/AddToDancefloorButton'
import { getEyeLabel, getHairLabel } from '@/lib/constants/talentOptions'
import { cn } from '@/utilities/ui'

export interface ShowcaseTalent {
    id: string
    name: string
    slug: string
    category: 'dancer' | 'model' | 'both'
    imageUrl?: string
    height?: string
    hair?: string | string[]
    eyes?: string | string[]
}

const CATEGORY_LABELS: Record<string, Record<string, string>> = {
    de: { dancer: 'Tänzer/in', model: 'Model', both: 'Tänzer/in & Model' },
    en: { dancer: 'Dancer', model: 'Model', both: 'Dancer & Model' },
}

export function TalentShowcase({
    talents,
    autoplay = true,
    locale = 'de',
}: {
    talents: ShowcaseTalent[]
    autoplay?: boolean
    locale?: string
}) {
    if (!talents.length) return null
    const labels = CATEGORY_LABELS[locale] || CATEGORY_LABELS.de

    return (
        <section className="section-atmosphere relative w-full overflow-hidden bg-background">
            <div className="hidden md:block">
                <DesktopShowcase
                    talents={talents}
                    autoplay={autoplay}
                    labels={labels}
                    locale={locale}
                />
            </div>
            <div className="md:hidden">
                <MobileShowcase
                    talents={talents}
                    autoplay={autoplay}
                    labels={labels}
                    locale={locale}
                />
            </div>
        </section>
    )
}

/* ─── Autoplay hook ─── */
function useAutoplay(emblaApi: ReturnType<typeof useEmblaCarousel>[1], enabled: boolean) {
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
    const stoppedRef = useRef(false)

    const stop = useCallback(() => {
        stoppedRef.current = true
        if (timerRef.current) {
            clearInterval(timerRef.current)
            timerRef.current = null
        }
    }, [])

    useEffect(() => {
        if (!enabled || !emblaApi || stoppedRef.current) return
        timerRef.current = setInterval(() => emblaApi.scrollNext(), 5000)
        return () => {
            if (timerRef.current) clearInterval(timerRef.current)
        }
    }, [enabled, emblaApi])

    return stop
}

/* ─── Quick Stats ─── */
function QuickStats({
    talent,
    className,
    locale,
}: {
    talent: ShowcaseTalent
    className?: string
    locale: 'de' | 'en'
}) {
    const mapHair = (value: string) => getHairLabel(value, locale)
    const mapEyes = (value: string) => getEyeLabel(value, locale)

    const stats = [
        talent.height,
        Array.isArray(talent.hair)
            ? talent.hair.map(mapHair).join(', ')
            : talent.hair && mapHair(talent.hair),
        Array.isArray(talent.eyes)
            ? talent.eyes.map(mapEyes).join(', ')
            : talent.eyes && mapEyes(talent.eyes),
    ].filter(Boolean)
    if (!stats.length) return null
    return (
        <div className={cn('flex flex-wrap gap-3', className)}>
            {stats.map((s) => (
                <span key={String(s)} className="flex items-center gap-1.5">
                    <span className="h-1 w-1 rounded-full bg-copper" />
                    {s}
                </span>
            ))}
        </div>
    )
}

/* ─── Desktop ─── */
function DesktopShowcase({
    talents,
    autoplay,
    labels,
    locale,
}: {
    talents: ShowcaseTalent[]
    autoplay: boolean
    labels: Record<string, string>
    locale: string
}) {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        align: 'center',
        containScroll: false,
    })
    const [idx, setIdx] = useState(0)
    const stopAutoplay = useAutoplay(emblaApi, autoplay)

    useEffect(() => {
        if (!emblaApi) return
        const onSelect = () => setIdx(emblaApi.selectedScrollSnap())
        onSelect()
        emblaApi.on('select', onSelect)
        return () => {
            emblaApi.off('select', onSelect)
        }
    }, [emblaApi])

    const go = useCallback(
        (dir: 'prev' | 'next' | number) => {
            stopAutoplay()
            if (typeof dir === 'number') emblaApi?.scrollTo(dir)
            else if (dir === 'prev') emblaApi?.scrollPrev()
            else emblaApi?.scrollNext()
        },
        [emblaApi, stopAutoplay],
    )

    return (
        <div className="relative" onPointerDown={stopAutoplay}>
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                    {talents.map((t, i) => (
                        <div key={t.id} className="relative flex-[0_0_100%] min-w-0">
                            <Link
                                href={{ pathname: '/talents/[slug]', params: { slug: t.slug } }}
                                className="relative block h-[85vh] min-h-[560px] max-h-[860px] w-full"
                            >
                                {t.imageUrl ? (
                                    <Image
                                        src={t.imageUrl}
                                        alt={t.name}
                                        fill
                                        className="object-cover"
                                        sizes="100vw"
                                        priority={i === 0}
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-gradient-to-br from-card to-muted" />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-media-overlay/80 via-media-overlay/20 to-transparent" />

                                <div className="absolute bottom-0 left-0 right-0 padding-large">
                                    <AnimatePresence mode="wait">
                                        {idx === i && (
                                            <motion.div
                                                key={t.id}
                                                initial={{ opacity: 0, y: 16 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <span className="mb-3 inline-block rounded-full border border-copper/40 bg-copper/10 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-copper backdrop-blur-sm">
                                                    {labels[t.category] || t.category}
                                                </span>
                                                <h3 className="mb-3 font-display-tight font-heading-2-bold leading-[1.08] tracking-tight text-on-media drop-shadow-[0_6px_24px_rgba(0,0,0,0.45)] text-balance hyphens-auto [overflow-wrap:anywhere] pb-[0.03em]">
                                                    {t.name}
                                                </h3>
                                                <QuickStats
                                                    talent={t}
                                                    locale={locale === 'en' ? 'en' : 'de'}
                                                    className="text-sm text-on-media-muted"
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </Link>
                            <AddToSelectionButton
                                talent={{ id: t.id, name: t.name, slug: t.slug }}
                                variant="icon"
                                tone="onMedia"
                                className="absolute right-6 top-6 z-20"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Arrows */}
            {(['prev', 'next'] as const).map((dir) => (
                <button
                    key={dir}
                    type="button"
                    onClick={() => go(dir)}
                    aria-label={
                        dir === 'prev'
                            ? locale === 'de'
                                ? 'Vorheriges Talent'
                                : 'Previous talent'
                            : locale === 'de'
                              ? 'Nächstes Talent'
                              : 'Next talent'
                    }
                    className={cn(
                        'absolute top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-on-media/30 bg-media-overlay/55 text-on-media backdrop-blur-sm transition hover:border-copper/50 hover:bg-media-overlay/75',
                        dir === 'prev' ? 'left-4' : 'right-4',
                    )}
                >
                    {dir === 'prev' ? (
                        <ChevronLeft className="h-5 w-5" />
                    ) : (
                        <ChevronRight className="h-5 w-5" />
                    )}
                </button>
            ))}

            {/* Dots */}
            <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
                {talents.map((_, i) => (
                    <button
                        key={i}
                        type="button"
                        onClick={() => go(i)}
                        aria-label={`Slide ${i + 1}`}
                        className={cn(
                            'h-1.5 rounded-full transition duration-300',
                            idx === i
                                ? 'w-7 bg-copper'
                                : 'w-1.5 bg-on-media/40 hover:bg-on-media/60',
                        )}
                    />
                ))}
            </div>
        </div>
    )
}

/* ─── Mobile ─── */
function MobileShowcase({
    talents,
    autoplay,
    labels,
    locale,
}: {
    talents: ShowcaseTalent[]
    autoplay: boolean
    labels: Record<string, string>
    locale: string
}) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center' })
    const [idx, setIdx] = useState(0)
    const stopAutoplay = useAutoplay(emblaApi, autoplay)

    useEffect(() => {
        if (!emblaApi) return
        const onSelect = () => setIdx(emblaApi.selectedScrollSnap())
        onSelect()
        emblaApi.on('select', onSelect)
        return () => {
            emblaApi.off('select', onSelect)
        }
    }, [emblaApi])

    const current = talents[idx]

    return (
        <div onPointerDown={stopAutoplay}>
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                    {talents.map((t, i) => (
                        <div key={t.id} className="relative flex-[0_0_100%] min-w-0">
                            <div className="relative aspect-[3/4] w-full">
                                {t.imageUrl ? (
                                    <Image
                                        src={t.imageUrl}
                                        alt={t.name}
                                        fill
                                        className="object-cover"
                                        sizes="100vw"
                                        priority={i === 0}
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-gradient-to-br from-card to-muted" />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-media-overlay/45 to-transparent" />
                                <AddToSelectionButton
                                    talent={{ id: t.id, name: t.name, slug: t.slug }}
                                    variant="icon"
                                    tone="onMedia"
                                    className="absolute right-4 top-4 z-20"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Card below image */}
            <div className="relative -mt-8 mx-4 rounded-2xl border border-border/40 bg-card/95 p-5 backdrop-blur-md shadow-lg">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={current?.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <span className="mb-2 inline-block rounded-full border border-copper/40 bg-copper/10 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-copper">
                            {labels[current?.category || 'dancer'] || current?.category}
                        </span>
                        <h3 className="mb-2 font-display-tight font-heading-5-bold leading-[1.15] tracking-tight text-foreground text-balance hyphens-auto [overflow-wrap:anywhere] pb-[0.02em]">
                            {current?.name}
                        </h3>
                        <QuickStats
                            talent={current}
                            locale={locale === 'en' ? 'en' : 'de'}
                            className="mb-3 text-xs text-muted-foreground"
                        />
                        <Link
                            href={{
                                pathname: '/talents/[slug]',
                                params: { slug: current?.slug || '' },
                            }}
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-copper hover:opacity-80 transition-opacity"
                        >
                            {locale === 'de' ? 'Profil ansehen' : 'View profile'}
                            <ChevronRight className="h-3.5 w-3.5" />
                        </Link>
                    </motion.div>
                </AnimatePresence>

                <div className="mt-4 flex justify-center gap-1.5">
                    {talents.map((_, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => {
                                stopAutoplay()
                                emblaApi?.scrollTo(i)
                            }}
                            aria-label={`Slide ${i + 1}`}
                            className={cn(
                                'h-1 rounded-full transition duration-300',
                                idx === i ? 'w-5 bg-copper' : 'w-1 bg-muted-foreground/30',
                            )}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
