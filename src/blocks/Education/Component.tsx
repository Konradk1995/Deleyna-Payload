import React from 'react'
import { GraduationCap, Users, Briefcase, Zap } from 'lucide-react'
import type { EducationBlock as EducationBlockProps } from '@/payload-types'
import { SectionHeader } from '@/components/SectionHeader'
import { ScrollFadeIn } from '@/components/ScrollFadeIn'
import { CMSLink } from '@/components/CMSLink'
import { cn } from '@/utilities/ui'

const iconMap = {
    graduationCap: GraduationCap,
    users: Users,
    briefcase: Briefcase,
    zap: Zap,
}

export const EducationBlockComponent: React.FC<
    EducationBlockProps & { id?: string; className?: string }
> = ({ badge, title, description, headingLevel, programs, cta, backgroundColor = 'white', className }) => {
    if (!title || !programs?.length) return null

    const bgClass = backgroundColor === 'muted' ? 'bg-muted' : 'bg-background'

    return (
        <section className={cn('section-padding-lg section-atmosphere relative', bgClass, className)}>
            <div className="pointer-events-none absolute inset-0 opacity-10" aria-hidden="true">
                <div className="hero-grid absolute inset-0" />
            </div>

            <div className="container relative z-10">
                <SectionHeader
                    overline={badge ?? undefined}
                    title={title}
                    description={description ?? undefined}
                    as={(headingLevel as 'h1' | 'h2' | 'h3') || 'h2'}
                    titleClassName="chrome-text"
                    centered={false}
                />
                <div className="grid block-grid-gap md:grid-cols-2">
                    {programs.map((program, index) => {
                        const Icon = program.icon
                            ? iconMap[program.icon as keyof typeof iconMap]
                            : GraduationCap
                        return (
                            <ScrollFadeIn key={program.title ?? index} delay={index * 80} animation="fade-up" className="h-full">
                                <div
                                    className="group h-full block-card-base rounded-[var(--block-radius-xl)] padding-large transition duration-500 hover:border-copper/30 hover:bg-accent/10 hover:shadow-copper-glow focus-within:border-copper/30 focus-within:shadow-copper-glow"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-[var(--block-radius)] bg-copper/20 text-copper transition-colors group-hover:bg-copper/30">
                                            <Icon className="h-7 w-7" aria-hidden="true" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="mb-2 font-heading-5-bold text-foreground transition-colors group-hover:text-copper">
                                                {program.title}
                                            </h3>
                                            <p className="mb-4 font-small-text-regular leading-relaxed text-muted-foreground">
                                                {program.description}
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {program.duration && (
                                                    <span className="tag text-xs">
                                                        {program.duration}
                                                    </span>
                                                )}
                                                {program.level && (
                                                    <span className="tag tag-accent text-xs">
                                                        {program.level}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </ScrollFadeIn>
                        )
                    })}
                </div>
                {cta?.label && (cta?.url || cta?.reference) && (
                    <div className="mt-10 text-center">
                        <CMSLink {...cta} appearance="primary-pill" className="inline-flex" />
                    </div>
                )}
            </div>
        </section>
    )
}
