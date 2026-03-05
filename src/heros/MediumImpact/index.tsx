import React from 'react'
import type { Page } from '@/payload-types'
import { Media } from '@/components/Media'
import { CMSLink } from '@/components/CMSLink'
import RichText from '@/components/RichText'
import dynamic from 'next/dynamic'

const HeroBackground = dynamic(() =>
    import('../HeroBackground.client').then((mod) => mod.HeroBackground),
)
import { resolveHeroLinkAppearance } from '../resolveHeroLinkAppearance'
import { cn } from '@/utilities/ui'

export const MediumImpactHero: React.FC<Page['hero']> = ({
    media,
    badge,
    headline,
    subtext,
    richText,
    links,
    mediaMobile,
}) => {
    return (
        <section className="relative overflow-hidden bg-background">
            <HeroBackground />

            <div className="container relative z-10 padding-section-hero-tight">
                <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
                    {/* Content */}
                    <div>
                        {badge && (
                            <p className="font-subtext-semibold mb-6 text-copper tracking-wide-hero">
                                {badge}
                            </p>
                        )}
                        {(headline || subtext) && (
                            <div className="mb-6">
                                {headline && (
                                    <h1 className="font-display-tight font-heading-1-bold leading-none pb-1 tracking-tight text-balance hyphens-auto [overflow-wrap:anywhere] drop-shadow-sm">
                                        {headline}
                                    </h1>
                                )}
                                {subtext && (
                                    <p className="mt-4 max-w-2xl font-normal-text-regular md:font-medium-text-regular tracking-wide text-muted-foreground text-balance">
                                        {subtext}
                                    </p>
                                )}
                            </div>
                        )}
                        {richText && (
                            <RichText data={richText} enableGutter={false} className="prose-lg" />
                        )}

                        {links && links.length > 0 && (
                            <div className="mt-8 flex flex-wrap gap-3 md:gap-4">
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

                    {/* Image */}
                    {(media || mediaMobile) && (
                        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border/60 bg-card/80 backdrop-blur-sm">
                            {media && (
                                <Media
                                    resource={media}
                                    fill
                                    imgClassName="object-cover"
                                    priority
                                    fetchPriority="high"
                                    className={cn(mediaMobile ? 'hidden md:block' : 'block')}
                                />
                            )}
                            {mediaMobile && (
                                <Media
                                    resource={mediaMobile}
                                    fill
                                    imgClassName="object-cover"
                                    priority
                                    fetchPriority="high"
                                    className="block md:hidden"
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}
