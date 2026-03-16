'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import useEmblaCarousel from 'embla-carousel-react'
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures'
import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'
import { toHref } from '@/utilities/typedHref'
import { SectionHeader } from '@/components/SectionHeader'
import { CMSLink } from '@/components/CMSLink'
import { AddToSelectionButton } from '@/components/Dancefloor/AddToDancefloorButton'

type SliderItem = {
    id: string
    badge: string
    name: string
    description: string
    image?: string | null
    href: string
    slug?: string | null
}

type SliderClientProps = {
    cardStyle: 'compact' | 'featured'
    badge?: string | null
    title: string
    titleHighlight?: string | null
    headingLevel?: string | null
    description?: string | null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cta?: any
    items: SliderItem[]
    sourceCollection: string
    compactFields?: {
        showImage?: boolean | null
    } | null
    featuredFields?: {
        imagePosition?: 'left' | 'right' | null
        showFallbackImage?: boolean | null
    } | null
    backgroundColor?: 'white' | 'muted' | null
    locale?: string
}

export const SliderClient: React.FC<SliderClientProps> = (props) => {
    const { cardStyle, badge, title, titleHighlight, headingLevel, description, cta, items, compactFields, featuredFields, sourceCollection, backgroundColor } = props

    const t = useTranslations('common')
    const previousSlideLabel = t('previousSlide')
    const nextSlideLabel = t('nextSlide')
    const noImageLabel = t('noImage')
    const enableSelection = sourceCollection === 'talents'

    // Calculate slides per view for static grid fallback only
    const [slidesPerView, setSlidesPerView] = useState(1)

    const getSlidesPerView = useCallback(() => {
        if (typeof window === 'undefined') return 1
        const width = window.innerWidth
        if (cardStyle === 'featured') return 1
        if (width >= 1440) return 4
        if (width >= 1024) return 3
        if (width >= 768) return 2
        return 1
    }, [cardStyle])

    useEffect(() => {
        setSlidesPerView(getSlidesPerView())
        let timer: ReturnType<typeof setTimeout>
        const handleResize = () => {
            clearTimeout(timer)
            timer = setTimeout(() => setSlidesPerView(getSlidesPerView()), 150)
        }
        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
            clearTimeout(timer)
        }
    }, [getSlidesPerView])

    const sliderEnabled = items.length > slidesPerView

    // Embla Carousel
    const [emblaRef, emblaApi] = useEmblaCarousel(
        {
            loop: false,
            align: 'start',
            containScroll: 'trimSnaps',
            slidesToScroll: 1,
            dragFree: false,
        },
        [WheelGesturesPlugin()],
    )

    const [canScrollPrev, setCanScrollPrev] = useState(false)
    const [canScrollNext, setCanScrollNext] = useState(false)

    useEffect(() => {
        if (!emblaApi) return
        const onSelect = () => {
            setCanScrollPrev(emblaApi.canScrollPrev())
            setCanScrollNext(emblaApi.canScrollNext())
        }
        onSelect()
        emblaApi.on('select', onSelect)
        emblaApi.on('reInit', onSelect)
        return () => {
            emblaApi.off('select', onSelect)
            emblaApi.off('reInit', onSelect)
        }
    }, [emblaApi])

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

    // Slide class based on card style
    const slideClassName =
        cardStyle === 'compact'
            ? 'flex-[0_0_300px] md:flex-[0_0_320px] lg:flex-[0_0_350px] min-w-0'
            : 'min-w-0 max-w-[1000px] flex-[0_0_88vw] md:flex-[0_0_82vw]'

    return (
        <section className={`section-padding-lg section-atmosphere relative overflow-x-clip transition-colors duration-300 ${backgroundColor === 'muted' ? 'bg-muted' : 'bg-background'}`}>
            <div className="container relative pb-8 md:pb-10">
                <SectionHeader
                    overline={badge ?? undefined}
                    title={title}
                    titleHighlight={titleHighlight ?? undefined}
                    description={description ?? undefined}
                    as={(headingLevel as 'h1' | 'h2' | 'h3') || 'h2'}
                    centered={false}
                    className="mb-0"
                    titleClassName="chrome-text"
                />
            </div>

            {/* Slider Container */}
            <div className="container relative">
                {/* Left Arrow - only show when slider is enabled */}
                {sliderEnabled && (
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={scrollPrev}
                        disabled={!canScrollPrev}
                        aria-label={previousSlideLabel}
                        className={`absolute -left-1 top-1/2 z-10 -translate-y-1/2 border-border/70 bg-card/75 backdrop-blur-sm sm:left-0 ${
                            !canScrollPrev
                                ? 'opacity-40'
                                : 'hover:scale-[1.04] hover:border-copper/30'
                        }`}
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                )}

                {/* Right Arrow - only show when slider is enabled */}
                {sliderEnabled && (
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={scrollNext}
                        disabled={!canScrollNext}
                        aria-label={nextSlideLabel}
                        className={`absolute -right-1 top-1/2 z-10 -translate-y-1/2 border-border/70 bg-card/75 backdrop-blur-sm sm:right-0 ${
                            !canScrollNext
                                ? 'opacity-40'
                                : 'hover:scale-[1.04] hover:border-copper/30'
                        }`}
                    >
                        <ChevronRight className="w-5 h-5" />
                    </Button>
                )}

                {/* Cards Container - Grid when disabled, Embla Slider when enabled */}
                {sliderEnabled ? (
                    <div className="overflow-visible" ref={emblaRef}>
                        <div className="flex block-grid-gap">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className={`${slideClassName} slider-ambient-glow`}
                                >
                                    {cardStyle === 'compact' ? (
                                        <CompactCard
                                            item={item}
                                            showImage={compactFields?.showImage !== false}
                                            learnMoreText={t('learnMore')}
                                            sliderEnabled={sliderEnabled}
                                            enableSelection={enableSelection}
                                        />
                                    ) : (
                                        <FeaturedCard
                                            item={item}
                                            imagePosition={featuredFields?.imagePosition || 'right'}
                                            learnMoreText={t('learnMore')}
                                            noImageText={noImageLabel}
                                            sliderEnabled={sliderEnabled}
                                            enableSelection={enableSelection}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div
                        className={
                            cardStyle === 'compact'
                                ? 'grid grid-cols-1 block-grid-gap md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                                : 'flex flex-col justify-center block-grid-gap md:flex-row'
                        }
                    >
                        {items.map((item) => (
                            <div key={item.id}>
                                {cardStyle === 'compact' ? (
                                    <CompactCard
                                        item={item}
                                        showImage={compactFields?.showImage !== false}
                                        learnMoreText={t('learnMore')}
                                        sliderEnabled={sliderEnabled}
                                        enableSelection={enableSelection}
                                    />
                                ) : (
                                    <FeaturedCard
                                        item={item}
                                        imagePosition={featuredFields?.imagePosition || 'right'}
                                        learnMoreText={t('learnMore')}
                                        noImageText={noImageLabel}
                                        sliderEnabled={sliderEnabled}
                                        enableSelection={enableSelection}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {cta && typeof cta === 'object' && cta.label && (
                <div className="container mt-10 text-center">
                    <CMSLink {...cta} />
                </div>
            )}
        </section>
    )
}

// Compact Card Component
const CompactCard: React.FC<{
    item: SliderItem
    showImage: boolean
    learnMoreText: string
    sliderEnabled: boolean
    enableSelection: boolean
}> = ({ item, showImage, learnMoreText, sliderEnabled, enableSelection }) => {
    const linkHref = item.href || '/'
    const hasImage = showImage && item.image

    return (
        <div
            className={`${sliderEnabled ? 'w-full' : 'w-full'} relative block-card-base block-card-min-h-compact group flex flex-col padding-medium md:padding-large`}
        >
            <Link href={toHref(linkHref)} className="absolute inset-0 z-0" aria-label={item.name} />
            {enableSelection && item.slug && (
                <div className="relative z-20 pointer-events-auto w-fit">
                    <AddToSelectionButton
                        talent={{ id: item.id, name: item.name, slug: item.slug }}
                        variant="icon"
                        tone="surface"
                    />
                </div>
            )}
            <div className="relative z-10 pointer-events-none">
                {item.badge && (
                    <span className="font-subtext-semibold mb-3 md:mb-4 text-copper inline-flex items-center gap-2">
                        <span className="h-px w-6 bg-copper/60" aria-hidden />
                        {item.badge}
                    </span>
                )}
                <h3 className="font-heading-5-bold mb-3 md:mb-4 text-foreground">{item.name}</h3>
                {item.description && (
                    <p className="font-small-text-regular leading-relaxed mb-4 line-clamp-3 md:line-clamp-4 text-muted-foreground">
                        {item.description}
                    </p>
                )}
            </div>
            <div className="flex-1 pointer-events-none" />
            <div className="relative z-10 flex items-end justify-between mt-4 md:mt-6 pointer-events-none">
                {hasImage ? (
                    <div className="relative h-[120px] w-[120px] transition-transform duration-500 group-hover:-translate-y-2 group-hover:scale-105 md:h-[140px] md:w-[140px]">
                    {item.image ? (
                        <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-contain"
                            sizes="140px"
                        />
                    ) : null}
                    </div>
                ) : (
                    <div className="w-[45px] md:w-[50px]" />
                )}
                <span className="inline-flex items-center gap-2 font-small-text-bold text-copper transition duration-300 group-hover:gap-3">
                    {learnMoreText}
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
            </div>
        </div>
    )
}

// Featured Card Component
const FeaturedCard: React.FC<{
    item: SliderItem
    imagePosition: 'left' | 'right'
    learnMoreText: string
    noImageText: string
    sliderEnabled: boolean
    enableSelection: boolean
}> = ({ item, imagePosition, learnMoreText, noImageText, sliderEnabled, enableSelection }) => {
    const linkHref = item.href || '/'
    const hasImage = item.image

    const contentSection = (
        <div className="flex-1 padding-large flex flex-col relative z-10 pointer-events-none">
            <span className="font-subtext-semibold mb-4 text-copper inline-flex items-center gap-2">
                <span className="h-px w-6 bg-copper/60" aria-hidden />
                {item.badge}
            </span>
            <h3 className="font-heading-3-bold mb-5 text-foreground">{item.name}</h3>
            {item.description && (
                <p className="font-medium-text-regular mb-6 leading-relaxed text-muted-foreground">
                    {item.description}
                </p>
            )}
            <div className="flex-1" />
            <span className="self-start inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-full font-small-text-bold bg-card text-foreground border border-border group-hover:border-copper group-hover:text-copper transition duration-300 group-hover:gap-3">
                {learnMoreText}
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
        </div>
    )

    const imageSection = (
        <div className="flex-1 relative overflow-hidden bg-muted min-h-[280px] md:min-h-0 z-10 pointer-events-none">
            {hasImage ? (
                <Image
                    src={item.image!}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 640px"
                />
            ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm text-muted-foreground">{noImageText}</span>
                </div>
            )}
        </div>
    )

    return (
        <div
            className={`${
                sliderEnabled ? 'w-full' : 'w-full max-w-[1100px]'
            } relative block-card-base block-card-min-h-featured group flex flex-col overflow-hidden hover:-translate-y-0.5 hover:shadow-md md:flex-row`}
        >
            <Link href={toHref(linkHref)} className="absolute inset-0 z-0" aria-label={item.name} />
            {enableSelection && item.slug && (
                <div className="absolute top-4 left-4 z-20 pointer-events-auto">
                    <AddToSelectionButton
                        talent={{ id: item.id, name: item.name, slug: item.slug }}
                        variant="icon"
                        tone="surface"
                    />
                </div>
            )}
            {imagePosition === 'left' ? (
                <>
                    {imageSection}
                    {contentSection}
                </>
            ) : (
                <>
                    {contentSection}
                    {imageSection}
                </>
            )}
        </div>
    )
}
