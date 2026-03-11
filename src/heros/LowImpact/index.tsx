import React from 'react'
import type { Page } from '@/payload-types'
import { CMSLink } from '@/components/CMSLink'
import RichText from '@/components/RichText'
import { resolveHeroLinkAppearance } from '../resolveHeroLinkAppearance'
import { cn } from '@/utilities/ui'

export const LowImpactHero: React.FC<Page['hero']> = ({
    badge,
    headline,
    subtext,
    richText,
    links,
    alignment = 'left',
}) => {
    const isCentered = alignment === 'center'

    return (
        <section className="relative overflow-hidden padding-section-hero-tight">
            <div className="hero-dots pointer-events-none absolute inset-0 z-0" aria-hidden="true" />
            <div className="container relative z-10">
                <div className={cn('max-w-3xl', isCentered && 'mx-auto text-center')}>
                    {badge && (
                        <span className="font-subtext-semibold mb-4 inline-flex items-center gap-3 text-copper">
                            <span className="h-px w-8 bg-copper/60" aria-hidden />
                            {badge}
                            <span className="h-px w-8 bg-copper/60" aria-hidden />
                        </span>
                    )}
                    {(headline || subtext) && (
                        <div className="mb-6">
                            {headline && (
                                <h1 className="font-display-tight font-heading-2-bold tracking-tight text-balance hyphens-auto [overflow-wrap:anywhere]">
                                    {headline}
                                </h1>
                            )}
                            {subtext && (
                                <p className={cn('mt-3 max-w-2xl font-normal-text-regular md:font-medium-text-regular text-balance text-muted-foreground', isCentered && 'mx-auto')}>
                                    {subtext}
                                </p>
                            )}
                        </div>
                    )}
                    {richText && (
                        <RichText data={richText} enableGutter={false} className="prose-lg" />
                    )}

                    {links && links.length > 0 && (
                        <div className={cn('mt-8 flex flex-wrap items-center gap-4', isCentered && 'justify-center')}>
                            {links.map(({ link }, i) => (
                                <CMSLink
                                    key={i}
                                    {...link}
                                    appearance={resolveHeroLinkAppearance(link.appearance, i)}
                                    className="inline-flex min-w-32 justify-center"
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}
