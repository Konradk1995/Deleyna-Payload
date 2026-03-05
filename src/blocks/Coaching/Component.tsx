import React from 'react'
import { Award, TrendingUp, Target, Heart } from 'lucide-react'
import type { CoachingBlock as CoachingBlockProps } from '@/payload-types'
import { SectionHeader } from '@/components/SectionHeader'
import { CMSLink } from '@/components/CMSLink'
import { cn } from '@/utilities/ui'

const iconMap = {
    award: Award,
    trendingUp: TrendingUp,
    target: Target,
    heart: Heart,
}

export const CoachingBlockComponent: React.FC<
    CoachingBlockProps & { id?: string; className?: string; locale?: string }
> = ({
    overline,
    title,
    description,
    benefitsSubheading,
    benefits,
    coachesSubheading,
    coaches,
    ctaText,
    cta,
    className,
    locale,
}) => {
    if (!title) return null

    const isDE = locale === 'de'

    return (
        <section className={cn('padding-large section-atmosphere relative', className)}>
            <div
                aria-hidden
                className="pointer-events-none absolute top-1/4 -left-32 h-64 w-64 rounded-full bg-copper/10 blur-3xl animate-blob"
            />
            <div
                aria-hidden
                className="pointer-events-none absolute bottom-1/4 -right-32 h-64 w-64 rounded-full bg-secondary/10 blur-3xl animate-blob animation-delay-2000"
            />

            <div className="container relative z-10">
                <SectionHeader
                    overline={overline ?? undefined}
                    title={title}
                    description={description ?? undefined}
                    titleClassName="chrome-text"
                />
                <div className="grid grid-cols-1 gap-medium lg:grid-cols-2">
                    <div>
                        {benefitsSubheading && (
                            <h3 className="mb-6 font-heading-6-bold text-copper">
                                {benefitsSubheading}
                            </h3>
                        )}
                        {benefits && benefits.length > 0 && (
                            <div className="grid gap-medium md:grid-cols-2 md:items-stretch">
                                {benefits.map((benefit, index) => {
                                    const Icon = benefit.icon
                                        ? iconMap[benefit.icon as keyof typeof iconMap]
                                        : Award
                                    return (
                                        <div
                                            key={index}
                                            className="block-card-base animate-reveal flex h-full rounded-2xl padding-large transition duration-300 hover:border-copper/20 hover:shadow-copper-glow"
                                            style={{ animationDelay: `${index * 0.1}s` }}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-copper/20 text-copper">
                                                    {Icon && <Icon className="h-5 w-5" />}
                                                </div>
                                                <div className="flex min-h-full flex-1 flex-col">
                                                    <h4 className="font-heading-6-bold text-foreground">
                                                        {benefit.title}
                                                    </h4>
                                                    <p className="mt-1 font-small-text-regular text-muted-foreground">
                                                        {benefit.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                    <div>
                        {coachesSubheading && (
                            <h3 className="mb-6 font-heading-6-bold text-copper">
                                {coachesSubheading}
                            </h3>
                        )}
                        {coaches && coaches.length > 0 && (
                            <div className="space-y-4">
                                {coaches.map((coach, index) => (
                                    <div
                                        key={index}
                                        className="group block-card-base rounded-2xl padding-large transition duration-300 hover:border-copper/25 hover:bg-copper/10 hover:shadow-copper-glow animate-reveal"
                                        style={{ animationDelay: `${index * 0.1 + 0.3}s` }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-muted" />
                                            <div>
                                                <h4 className="font-heading-6-bold text-foreground transition-colors group-hover:text-copper">
                                                    {coach.name}
                                                </h4>
                                                <p className="font-small-text-regular text-muted-foreground">
                                                    {coach.role}
                                                </p>
                                            </div>
                                        </div>
                                        <span
                                            className={cn(
                                                'font-small-text-regular',
                                                coach.available
                                                    ? 'text-success'
                                                    : 'text-muted-foreground',
                                            )}
                                        >
                                            {coach.available
                                                ? isDE
                                                    ? 'Verfügbar'
                                                    : 'Available'
                                                : isDE
                                                  ? 'Ausgebucht'
                                                  : 'Booked'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                        {(ctaText || (cta?.label && (cta?.url || cta?.reference))) && (
                            <div className="mt-8 rounded-2xl border border-copper/30 bg-gradient-to-r from-copper/20 to-secondary/20 padding-large text-center shadow-copper-glow">
                                {ctaText && (
                                    <p className="mb-4 font-normal-text-regular text-foreground">
                                        {ctaText}
                                    </p>
                                )}
                                {cta?.label && (cta?.url || cta?.reference) && (
                                    <CMSLink {...cta} appearance="copper" className="inline-flex" />
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}
