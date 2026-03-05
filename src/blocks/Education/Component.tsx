import React from 'react'
import { GraduationCap, Users, Briefcase, Zap } from 'lucide-react'
import type { EducationBlock as EducationBlockProps } from '@/payload-types'
import { SectionHeader } from '@/components/SectionHeader'
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
> = ({ overline, title, description, programs, cta, className }) => {
    if (!title || !programs?.length) return null

    return (
        <section className={cn('section-padding-lg section-atmosphere relative', className)}>
            <div className="pointer-events-none absolute inset-0 opacity-10" aria-hidden>
                <div className="hero-grid absolute inset-0" />
            </div>

            <div className="container relative z-10">
                <SectionHeader
                    overline={overline ?? undefined}
                    title={title}
                    description={description ?? undefined}
                    titleClassName="chrome-text"
                    centered={false}
                />
                <div className="grid gap-6 md:grid-cols-2">
                    {programs.map((program, index) => {
                        const Icon = program.icon
                            ? iconMap[program.icon as keyof typeof iconMap]
                            : GraduationCap
                        return (
                            <div
                                key={index}
                                className="group block-card-base rounded-[var(--block-radius-xl)] p-7 transition duration-500 hover:border-copper/30 hover:bg-accent/10 hover:shadow-copper-glow animate-reveal"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-copper/20 text-copper transition-colors group-hover:bg-copper/30">
                                        <Icon className="h-7 w-7" />
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
