import React from 'react'
import Image from 'next/image'
import { Quote } from 'lucide-react'

import type { Media } from '@/payload-types'

import { cn } from '@/utilities/ui'
import { SectionHeader } from '@/components/SectionHeader'
import { ScrollFadeIn } from '@/components/ScrollFadeIn'
import { Media as MediaComponent } from '@/components/Media'

type TestimonialItem = {
    id?: string | null
    quote: string
    author: string
    role?: string | null
    company?: string | null
    avatar?: number | Media | null
    media?: number | Media | null
    logo?: number | Media | null
}

type TestimonialBlockProps = {
    badge?: string | null
    headline?: string | null
    headlineHighlight?: string | null
    items: TestimonialItem[]
    backgroundColor?: 'white' | 'muted' | null
    locale?: string
}

export function TestimonialBlockComponent({
    badge,
    headline,
    headlineHighlight,
    items,
    backgroundColor = 'white',
}: TestimonialBlockProps) {
    if (!Array.isArray(items) || items.length === 0) return null

    const bgClass = backgroundColor === 'muted' ? 'bg-muted' : 'bg-background'

    return (
        <section className={cn('padding-large section-atmosphere relative gap-large', bgClass)}>
            <div className="container">
                {(headline || badge) && (
                <SectionHeader
                    overline={badge || undefined}
                    title={headline || ''}
                    titleHighlight={headlineHighlight || undefined}
                    centered
                    size="md"
                    titleClassName="chrome-text"
                    className="mb-10 md:mb-14"
                />
                )}

                {/* Single testimonial — hero quote layout */}
                {items.length === 1 ? (
                    <SingleTestimonial item={items[0]} />
                ) : items.length === 2 ? (
                    /* Two testimonials — side by side */
                    <div className="grid grid-cols-1 gap-medium md:grid-cols-2">
                        {items.map((item, index) => (
                            <ScrollFadeIn
                                key={item.id ?? index}
                                delay={index * 100}
                                animation="fade-up"
                            >
                                <TestimonialCard item={item} />
                            </ScrollFadeIn>
                        ))}
                    </div>
                ) : (
                    /* 3+ testimonials — masonry-style grid */
                    <div className="grid grid-cols-1 gap-medium md:grid-cols-2 lg:grid-cols-3">
                        {items.map((item, index) => (
                            <ScrollFadeIn
                                key={item.id ?? index}
                                delay={80 + index * 60}
                                animation="fade-up"
                            >
                                <TestimonialCard item={item} featured={index === 0} />
                            </ScrollFadeIn>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}

/** Hero-sized single testimonial with full-bleed media */
function SingleTestimonial({ item }: { item: TestimonialItem }) {
    const mediaData = item.media && typeof item.media === 'object' ? (item.media as Media) : null
    const avatarData =
        item.avatar && typeof item.avatar === 'object' ? (item.avatar as Media) : null
    const logoData = item.logo && typeof item.logo === 'object' ? (item.logo as Media) : null
    const hasMedia = Boolean(mediaData?.url)

    return (
        <ScrollFadeIn animation="fade-up">
                    <div
                        className={cn(
                            'relative overflow-hidden rounded-3xl padding-medium',
                            hasMedia ? 'min-h-96 md:min-h-[32rem]' : 'bg-card border border-border',
                        )}
                    >
                {/* Background media */}
                {hasMedia && (
                    <>
                        <MediaComponent resource={mediaData!} fill imgClassName="object-cover" />
                        <div className="absolute inset-0 hero-overlay" aria-hidden />
                    </>
                )}

                {/* Content */}
                <div
                    className={cn(
                        'relative z-10 flex flex-col items-center justify-center padding-large text-center',
                        hasMedia && 'min-h-96 md:min-h-[32rem]',
                    )}
                >
                    <Quote
                        className={cn(
                            'mb-6 h-10 w-10 opacity-30',
                            hasMedia ? 'text-on-media' : 'text-copper',
                        )}
                        strokeWidth={1.5}
                    />

                    <blockquote
                        className={cn(
                            'font-heading-3-bold max-w-3xl leading-relaxed',
                            hasMedia ? 'text-on-media' : 'text-foreground',
                        )}
                    >
                        &ldquo;{item.quote}&rdquo;
                    </blockquote>

                    <div className="mt-8 flex items-center gap-4">
                        {avatarData?.url && (
                            <div className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-copper/40">
                                <Image
                                    src={avatarData.url}
                                    alt={avatarData.alt || item.author}
                                    fill
                                    className="object-cover"
                                    sizes="56px"
                                />
                            </div>
                        )}
                        <div className="text-left">
                            <p
                                className={cn(
                                    'font-heading-6-bold',
                                    hasMedia ? 'text-on-media' : 'text-foreground',
                                )}
                            >
                                {item.author}
                            </p>
                            {(item.role || item.company) && (
                                <p
                                    className={cn(
                                        'font-small-text-regular',
                                        hasMedia ? 'text-on-media/70' : 'text-muted-foreground',
                                    )}
                                >
                                    {[item.role, item.company].filter(Boolean).join(' · ')}
                                </p>
                            )}
                        </div>
                    </div>

                    {logoData?.url && (
                        <div className="mt-6 relative h-8 w-24">
                            <Image
                                src={logoData.url}
                                alt={logoData.alt || item.company || ''}
                                fill
                                className={cn(
                                    'object-contain',
                                    hasMedia ? 'brightness-0 invert opacity-60' : 'opacity-50',
                                )}
                                sizes="96px"
                            />
                        </div>
                    )}
                </div>
            </div>
        </ScrollFadeIn>
    )
}

/** Card-based testimonial for grids */
function TestimonialCard({
    item,
    featured = false,
}: {
    item: TestimonialItem
    featured?: boolean
}) {
    const mediaData = item.media && typeof item.media === 'object' ? (item.media as Media) : null
    const avatarData =
        item.avatar && typeof item.avatar === 'object' ? (item.avatar as Media) : null
    const logoData = item.logo && typeof item.logo === 'object' ? (item.logo as Media) : null
    const hasMedia = Boolean(mediaData?.url)

    return (
        <div
            className={cn(
                'group relative flex flex-col h-full overflow-hidden rounded-2xl border border-border transition duration-300 hover:shadow-lg hover:-translate-y-0.5',
                featured && 'md:col-span-2 lg:col-span-1',
                hasMedia ? 'min-h-96' : 'bg-card padding-large',
            )}
        >
            {/* Background media */}
            {hasMedia && (
                <>
                    <MediaComponent
                        resource={mediaData!}
                        fill
                        imgClassName="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div
                        className="absolute inset-0 bg-gradient-to-t from-media-overlay/85 via-media-overlay/40 to-transparent"
                        aria-hidden
                    />
                </>
            )}

            {/* Content */}
                    <div
                        className={cn(
                            'relative z-10 flex flex-1 flex-col padding-medium',
                            hasMedia && 'justify-end',
                        )}
                    >
                <Quote
                    className={cn(
                        'mb-4 h-7 w-7 opacity-30',
                        hasMedia ? 'text-on-media' : 'text-copper',
                    )}
                    strokeWidth={1.5}
                />

                <blockquote
                    className={cn(
                        'font-medium-text-regular leading-relaxed mb-6',
                        hasMedia ? 'text-on-media' : 'text-foreground',
                    )}
                >
                    &ldquo;{item.quote}&rdquo;
                </blockquote>

                <div className="mt-auto flex items-center gap-3">
                    {avatarData?.url && (
                        <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border border-copper/30">
                            <Image
                                src={avatarData.url}
                                alt={avatarData.alt || item.author}
                                fill
                                className="object-cover"
                                sizes="40px"
                            />
                        </div>
                    )}
                    <div className="min-w-0 flex-1">
                        <p
                            className={cn(
                                'font-small-text-bold truncate',
                                hasMedia ? 'text-on-media' : 'text-foreground',
                            )}
                        >
                            {item.author}
                        </p>
                        {(item.role || item.company) && (
                            <p
                                className={cn(
                                    'font-small-text-regular truncate',
                                    hasMedia ? 'text-on-media/70' : 'text-muted-foreground',
                                )}
                            >
                                {[item.role, item.company].filter(Boolean).join(' · ')}
                            </p>
                        )}
                    </div>
                    {logoData?.url && (
                        <div className="relative h-6 w-16 flex-shrink-0">
                            <Image
                                src={logoData.url}
                                alt={logoData.alt || item.company || ''}
                                fill
                                className={cn(
                                    'object-contain',
                                    hasMedia ? 'brightness-0 invert opacity-50' : 'opacity-40',
                                )}
                                sizes="64px"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
