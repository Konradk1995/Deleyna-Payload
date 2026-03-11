import React from 'react'
import { SectionHeader } from '@/components/SectionHeader'
import { TalentCard } from '@/components/TalentCard'
import { cn } from '@/utilities/ui'
import type { TalentItem } from './FeaturedTalentsCarousel'

interface FeaturedTalentsGridProps {
    talents: TalentItem[]
    badge?: string | null
    title?: string | null
    headingLevel?: string | null
    className?: string
    locale?: string
}

/**
 * Featured Talents als Grid (BLOCK-STANDARDS: SectionHeader, TalentCard, Design-Tokens).
 */
export function FeaturedTalentsGrid({
    talents,
    badge,
    title,
    headingLevel,
    className,
    locale,
}: FeaturedTalentsGridProps) {
    if (!talents || talents.length === 0) return null

    const defaultTitle = locale === 'de' ? 'Featured Talente' : 'Featured Talents'

    return (
        <section
            className={cn('section-padding-lg section-atmosphere relative bg-muted/30', className)}
        >
            <div className="pointer-events-none absolute -left-24 top-1/3 h-80 w-80 rounded-full bg-copper/9 blur-[110px]" aria-hidden="true" />
            <div className="pointer-events-none absolute -right-24 bottom-1/4 h-72 w-72 rounded-full bg-copper/8 blur-[100px]" aria-hidden="true" />
            <div className="container relative">
                <SectionHeader
                    overline={badge ?? undefined}
                    title={title ?? defaultTitle}
                    as={(headingLevel as 'h1' | 'h2' | 'h3') || 'h2'}
                    titleClassName="chrome-text"
                />
                <div className="grid grid-cols-1 gap-medium sm:grid-cols-2 lg:grid-cols-4">
                    {talents.map((talent, index) => (
                        <TalentCard
                            key={talent.id}
                            id={talent.id}
                            name={talent.name}
                            slug={talent.slug}
                            category={talent.category}
                            imageUrl={talent.imageUrl}
                            priority={index < 2}
                            locale={locale}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}
