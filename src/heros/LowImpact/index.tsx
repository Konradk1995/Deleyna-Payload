import React from 'react'
import type { Page } from '@/payload-types'
import { CMSLink } from '@/components/CMSLink'
import RichText from '@/components/RichText'
import { resolveHeroLinkAppearance } from '../resolveHeroLinkAppearance'

export const LowImpactHero: React.FC<Page['hero']> = ({
    badge,
    headline,
    subtext,
    richText,
    links,
}) => {
    return (
        <section className="relative overflow-hidden padding-section-hero-tight">
            <div className="hero-dots pointer-events-none absolute inset-0 z-0" aria-hidden />
            <div className="container relative z-10">
                <div className="mx-auto max-w-3xl text-center">
                    {badge && <p className="overline mb-2 text-muted-foreground">{badge}</p>}
                    {(headline || subtext) && (
                        <div className="mb-6">
                            {headline && (
                                <h1 className="font-display-tight font-heading-2-bold leading-none pb-1 tracking-tight text-balance hyphens-auto [overflow-wrap:anywhere]">
                                    {headline}
                                </h1>
                            )}
                            {subtext && (
                                <p className="mx-auto mt-3 max-w-2xl font-normal-text-regular md:font-medium-text-regular text-balance text-muted-foreground">
                                    {subtext}
                                </p>
                            )}
                        </div>
                    )}
                    {richText && (
                        <RichText data={richText} enableGutter={false} className="prose-lg" />
                    )}

                    {links && links.length > 0 && (
                        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
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
