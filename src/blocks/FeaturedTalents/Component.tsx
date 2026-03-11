import React from 'react'
import type { FeaturedTalentsBlock as FeaturedTalentsBlockProps } from '@/payload-types'
import type { Talent } from '@/payload-types'
import { FeaturedTalentsCarousel, type TalentItem } from './FeaturedTalentsCarousel'
import { FeaturedTalentsGrid } from './FeaturedTalentsGrid'
import { CMSLink } from '@/components/CMSLink'
import { cn } from '@/utilities/ui'

function isTalentItem(value: unknown): value is TalentItem {
    if (!value || typeof value !== 'object') return false
    const candidate = value as Partial<TalentItem>
    return (
        typeof candidate.id === 'string' &&
        typeof candidate.name === 'string' &&
        typeof candidate.slug === 'string' &&
        typeof candidate.category === 'string'
    )
}

export function normalizeTalent(t: Talent | string | number): TalentItem | null {
    if (typeof t === 'string' || typeof t === 'number') {
        return null
    }
    const slug = typeof t.slug === 'string' ? t.slug : ''
    const featuredImage = t.featuredImage
    const imageUrl =
        typeof featuredImage === 'object' && featuredImage?.url ? featuredImage.url : undefined

    const cutoutImage = (t as { cutoutImage?: Talent['cutoutImage'] }).cutoutImage
    const cutoutImageUrl =
        typeof cutoutImage === 'object' && cutoutImage?.url ? cutoutImage.url : undefined

    const measurements = t.measurements as
        | { height?: string; hair?: string | string[]; eyes?: string | string[] }
        | undefined

    return {
        id: String(t.id),
        name: t.name ?? '',
        slug,
        category: (t.category as 'dancer' | 'model' | 'both') ?? 'both',
        imageUrl,
        cutoutImageUrl,
        height: measurements?.height || undefined,
        hair: measurements?.hair || undefined,
        eyes: measurements?.eyes || undefined,
    }
}

type FeaturedTalentsBlockComponentProps = Omit<FeaturedTalentsBlockProps, 'talents'> & {
    id?: string
    className?: string
    talents?: unknown
    locale?: string
    randomize?: boolean
    size?: 'normal' | 'hero'
    backgroundColor?: 'white' | 'muted' | null
}

export function FeaturedTalentsBlockComponent(props: FeaturedTalentsBlockComponentProps) {
    const { badge, title, headingLevel, layout, talents: blockTalents, locale, randomize, size, cta, backgroundColor = 'white' } = props
    const bgClass = backgroundColor === 'muted' ? 'bg-muted' : 'bg-background'

    let talents: TalentItem[] =
        blockTalents && Array.isArray(blockTalents)
            ? (blockTalents
                  .map((entry) => {
                      // Already normalized item (e.g. from Talents archive page)
                      if (isTalentItem(entry)) {
                          return entry
                      }
                      return normalizeTalent(entry as Talent | string | number)
                  })
                  .filter(Boolean) as TalentItem[])
            : []

    if (randomize && talents.length > 1) {
        talents = [...talents]
        for (let i = talents.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[talents[i], talents[j]] = [talents[j], talents[i]]
        }
    }

    const ctaElement = cta && typeof cta === 'object' && cta.label ? (
        <div className="mt-10 text-center">
            <CMSLink {...cta} />
        </div>
    ) : null

    if (layout === 'grid') {
        return (
            <section className={cn('section-padding-lg section-atmosphere', bgClass)}>
                <FeaturedTalentsGrid
                    talents={talents}
                    badge={badge}
                    title={title}
                    headingLevel={headingLevel}
                    className={props.className}
                    locale={locale}
                />
                {ctaElement}
            </section>
        )
    }

    return (
        <section className={cn('section-padding-lg section-atmosphere', bgClass)}>
            <FeaturedTalentsCarousel
                talents={talents}
                badge={badge}
                title={title}
                headingLevel={headingLevel}
                layout={layout as 'carousel' | 'premium'}
                size={size as 'normal' | 'hero'}
                className={props.className}
                locale={locale}
            />
            {ctaElement}
        </section>
    )
}
