import React from 'react'
import Image from 'next/image'
import { Award, TrendingUp, Target, Heart, ArrowRight } from 'lucide-react'
import type { CoachingBlock as CoachingBlockProps, Media, Talent } from '@/payload-types'
import { SectionHeader } from '@/components/SectionHeader'
import { ScrollFadeIn } from '@/components/ScrollFadeIn'
import { CMSLink } from '@/components/CMSLink'
import { cn } from '@/utilities/ui'

const iconMap = {
    award: Award,
    trendingUp: TrendingUp,
    target: Target,
    heart: Heart,
}

function categoryLabel(cat: string, locale: string): string {
    const labels: Record<string, { de: string; en: string }> = {
        dancer: { de: 'Tänzer/in', en: 'Dancer' },
        model: { de: 'Model', en: 'Model' },
        both: { de: 'Tänzer/in & Model', en: 'Dancer & Model' },
    }
    return labels[cat]?.[locale === 'de' ? 'de' : 'en'] || cat
}

export const CoachingBlockComponent: React.FC<
    CoachingBlockProps & { id?: string; className?: string; locale?: string }
> = ({
    badge,
    title,
    description,
    headingLevel,
    benefitsSubheading,
    benefits,
    coachesSubheading,
    coaches,
    ctaText,
    cta,
    backgroundColor = 'white',
    className,
    locale,
}) => {
    if (!title) return null

    const lang = locale === 'en' ? 'en' : 'de'
    const bgClass = backgroundColor === 'muted' ? 'bg-muted' : 'bg-background'

    // Resolve coaches — may be IDs or populated Talent objects
    const resolvedCoaches: Talent[] = Array.isArray(coaches)
        ? (coaches.filter((c) => typeof c === 'object' && c !== null && 'name' in c) as Talent[])
        : []

    return (
        <section className={cn('section-padding-lg section-atmosphere relative', bgClass, className)}>
            {/* Decorative blurs */}
            <div
                aria-hidden
                className="pointer-events-none absolute top-1/4 -left-32 h-72 w-72 rounded-full bg-copper/8 blur-3xl"
            />
            <div
                aria-hidden
                className="pointer-events-none absolute bottom-1/4 -right-32 h-64 w-64 rounded-full bg-copper/6 blur-[100px]"
            />

            <div className="container relative z-10">
                <SectionHeader
                    overline={badge ?? undefined}
                    title={title}
                    description={description ?? undefined}
                    as={(headingLevel as 'h1' | 'h2' | 'h3') || 'h2'}
                    titleClassName="chrome-text"
                />

                <div className="grid grid-cols-1 gap-10 lg:grid-cols-5 lg:gap-12">
                    {/* Benefits — left column (3/5) */}
                    <div className="lg:col-span-3">
                        {benefitsSubheading && (
                            <h3 className="mb-6 font-heading-6-bold text-copper flex items-center gap-2">
                                <span className="inline-block h-px w-6 bg-copper/40" aria-hidden />
                                {benefitsSubheading}
                            </h3>
                        )}
                        {benefits && benefits.length > 0 && (
                            <div className="grid gap-4 sm:grid-cols-2">
                                {benefits.map((benefit, index) => {
                                    const Icon = benefit.icon
                                        ? iconMap[benefit.icon as keyof typeof iconMap]
                                        : Award
                                    return (
                                        <ScrollFadeIn key={benefit.title ?? index} delay={index * 80} animation="fade-up">
                                            <div className="group relative h-full rounded-[var(--block-radius)] border border-border/40 bg-card/50 p-5 backdrop-blur-sm transition duration-300 hover:border-copper/30 hover:bg-card/80 hover:shadow-copper-glow">
                                                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-copper/20 to-copper/10 text-copper transition-colors duration-300 group-hover:from-copper/30 group-hover:to-copper/15">
                                                    {Icon && <Icon className="h-5 w-5" aria-hidden="true" />}
                                                </div>
                                                <h4 className="font-heading-6-bold text-foreground mb-1.5">
                                                    {benefit.title}
                                                </h4>
                                                <p className="font-small-text-regular text-muted-foreground leading-relaxed">
                                                    {benefit.description}
                                                </p>
                                            </div>
                                        </ScrollFadeIn>
                                    )
                                })}
                            </div>
                        )}
                    </div>

                    {/* Coaches — right column (2/5) */}
                    <div className="lg:col-span-2">
                        {coachesSubheading && (
                            <h3 className="mb-6 font-heading-6-bold text-copper flex items-center gap-2">
                                <span className="inline-block h-px w-6 bg-copper/40" aria-hidden />
                                {coachesSubheading}
                            </h3>
                        )}
                        {resolvedCoaches.length > 0 && (
                            <div className="space-y-3">
                                {resolvedCoaches.map((coach, index) => {
                                    const image = coach.featuredImage as Media | null | undefined
                                    const catLabel = categoryLabel(coach.category || '', lang)
                                    const coachingDesc = coach.coachingDescription as string | undefined
                                    const initials = (coach.name || '')
                                        .split(' ')
                                        .filter(Boolean)
                                        .slice(0, 2)
                                        .map((n) => n[0]?.toUpperCase())
                                        .join('')

                                    return (
                                        <ScrollFadeIn key={coach.id ?? index} delay={index * 80} animation="fade-up">
                                            <div className="group flex items-start gap-4 rounded-[var(--block-radius)] border border-border/40 bg-card/50 p-4 backdrop-blur-sm transition duration-300 hover:border-copper/25 hover:bg-card/80 hover:shadow-copper-glow">
                                                {/* Coach image or avatar */}
                                                {image && typeof image === 'object' && image.url ? (
                                                    <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-full">
                                                        <Image
                                                            src={image.url}
                                                            alt={image.alt ?? coach.name ?? 'Coach'}
                                                            fill
                                                            className="object-cover"
                                                            sizes="56px"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div
                                                        className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-copper/20 to-copper/10 text-copper font-heading-6-bold text-sm transition-colors duration-300 group-hover:from-copper/30 group-hover:to-copper/15"
                                                        role="img"
                                                        aria-label={coach.name ? `Avatar of ${coach.name}` : 'Coach avatar'}
                                                    >
                                                        {initials || 'C'}
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-heading-6-bold text-foreground transition-colors group-hover:text-copper truncate">
                                                        {coach.name}
                                                    </h4>
                                                    <p className="font-small-text-regular text-copper truncate">
                                                        {catLabel}
                                                    </p>
                                                    {coachingDesc && (
                                                        <p className="mt-1.5 font-small-text-regular text-muted-foreground leading-relaxed line-clamp-3">
                                                            {coachingDesc}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </ScrollFadeIn>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* CTA — full width */}
                {(ctaText || (cta?.label && (cta?.url || cta?.reference))) && (
                    <ScrollFadeIn delay={200} animation="fade-up">
                        <div className="mt-12 rounded-[var(--block-radius)] border border-copper/20 bg-gradient-to-r from-copper/10 via-copper/5 to-secondary/10 p-8 sm:p-10 text-center backdrop-blur-sm">
                            {ctaText && (
                                <p className="mb-5 font-heading-5-bold text-foreground">
                                    {ctaText}
                                </p>
                            )}
                            {cta?.label && (cta?.url || cta?.reference) && (
                                <CMSLink
                                    {...cta}
                                    appearance="copper"
                                    className="inline-flex items-center gap-2"
                                >
                                    {cta.label}
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                </CMSLink>
                            )}
                        </div>
                    </ScrollFadeIn>
                )}
            </div>
        </section>
    )
}
