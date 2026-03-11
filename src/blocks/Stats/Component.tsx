import React from 'react'
import type { StatsBlock as StatsBlockProps } from '@/payload-types'
import { StatsGrid } from '@/components/StatsCounter/index'
import { CMSLink } from '@/components/CMSLink'
import { cn } from '@/utilities/ui'
import { ScrollFadeIn } from '@/components/ScrollFadeIn'

import { SectionHeader } from '@/components/SectionHeader'

type StatsBlockWithTitle = Omit<StatsBlockProps, 'titleLine1'> & {
    title?: string | null
}

export const StatsBlockComponent: React.FC<
    StatsBlockWithTitle & { id?: string; className?: string }
> = ({ badge, title, titleHighlight, description, headingLevel, cta, stats, backgroundColor = 'white', className }) => {
    if (!stats?.length) return null

    const statsMapped = stats.map((s) => ({
        value: s.value ?? 0,
        suffix: s.suffix ?? '',
        label: s.label ?? '',
    }))

    const bgClass = backgroundColor === 'muted' ? 'bg-muted' : 'bg-background'

    return (
        <section
            className={cn('section-padding-lg section-atmosphere relative', bgClass, className)}
        >
            <div
                className="section-chrome pointer-events-none absolute inset-0 opacity-60"
                aria-hidden="true"
            />
            <div className="container relative z-10">
                <div className="grid items-center block-grid-gap-lg lg:grid-cols-2">
                    <ScrollFadeIn animation="fade-up">
                        <div className="text-left">
                            <SectionHeader
                                overline={badge ?? undefined}
                                title={title ?? ''}
                                titleHighlight={titleHighlight}
                                description={description ?? undefined}
                                as={(headingLevel as 'h1' | 'h2' | 'h3') || 'h2'}
                                centered={false}
                                className="text-left"
                            />
                            {cta?.label && (cta?.url || cta?.reference) && (
                                <CMSLink {...cta} appearance="primary-pill" />
                            )}
                        </div>
                    </ScrollFadeIn>
                    <ScrollFadeIn animation="fade-up" delay={150}>
                        <StatsGrid stats={statsMapped} className="gap-4 sm:gap-6 md:gap-8" />
                    </ScrollFadeIn>
                </div>
            </div>
        </section>
    )
}
