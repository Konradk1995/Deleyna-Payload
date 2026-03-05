import React from 'react'
import type { StatsBlock as StatsBlockProps } from '@/payload-types'
import { StatsGrid } from '@/components/StatsCounter'
import { CMSLink } from '@/components/CMSLink'
import { cn } from '@/utilities/ui'
import { ScrollFadeIn } from '@/components/ScrollFadeIn'

import { SectionHeader } from '@/components/SectionHeader'

type StatsBlockWithTitle = Omit<StatsBlockProps, 'titleLine1'> & {
    title?: string | null
}

export const StatsBlockComponent: React.FC<
    StatsBlockWithTitle & { id?: string; className?: string }
> = ({ overline, title, titleHighlight, description, cta, stats, className }) => {
    if (!stats?.length) return null

    const statsMapped = stats.map((s) => ({
        value: s.value ?? 0,
        suffix: s.suffix ?? '',
        label: s.label ?? '',
    }))

    return (
        <section
            className={cn('section-padding-lg section-atmosphere bg-muted/40 relative', className)}
        >
            <div
                className="section-chrome pointer-events-none absolute inset-0 opacity-60"
                aria-hidden
            />
            <div className="container relative z-10">
                <div className="grid items-center block-grid-gap-lg lg:grid-cols-2">
                    <ScrollFadeIn animation="fade-up">
                        <div className="text-left">
                            <SectionHeader
                                overline={overline ?? undefined}
                                title={title ?? ''}
                                titleHighlight={titleHighlight}
                                description={description ?? undefined}
                                centered={false}
                                className="mb-8 md:mb-10 text-left"
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
