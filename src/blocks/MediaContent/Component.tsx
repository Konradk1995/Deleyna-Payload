import React from 'react'
import type { MediaContentBlock as MediaContentBlockProps } from '@/payload-types'
import { CMSLink } from '@/components/CMSLink'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { ScrollFadeIn } from '@/components/ScrollFadeIn'
import { cn } from '@/utilities/ui'

export const MediaContentBlock: React.FC<MediaContentBlockProps> = (props) => {
    const { layout = 'mediaLeft', media, tagline, headline, body, links } = props

    return (
        <section className="section-padding-lg section-atmosphere relative">
            <div
                aria-hidden
                className="pointer-events-none absolute -right-24 top-1/4 h-80 w-80 rounded-full bg-copper/9 blur-[110px]"
            />
            <div
                aria-hidden
                className="pointer-events-none absolute -left-20 bottom-1/4 h-72 w-72 rounded-full bg-copper/7 blur-[100px]"
            />
            <div className="container">
                <div
                    className={cn('grid grid-cols-1 items-center block-grid-gap-lg lg:grid-cols-2')}
                >
                    {/* Media Column */}
                    <ScrollFadeIn
                        animation={layout === 'mediaLeft' ? 'fade-right' : 'fade-left'}
                        className={cn('relative', layout === 'mediaRight' && 'lg:order-2')}
                    >
                        <div className="surface-pill overflow-hidden border border-border/70 shadow-copper-glow">
                            <Media
                                resource={media}
                                className="aspect-[4/3] w-full object-cover md:aspect-video lg:aspect-[4/5]"
                                imgClassName="object-cover w-full h-full transition-transform duration-700 hover:scale-105"
                            />
                        </div>

                        {/* Ambient Glow */}
                        <div
                            className="absolute -inset-4 -z-10 bg-copper/5 blur-3xl opacity-50"
                            aria-hidden="true"
                        />
                    </ScrollFadeIn>

                    {/* Text Column */}
                    <ScrollFadeIn
                        animation={layout === 'mediaLeft' ? 'fade-left' : 'fade-right'}
                        className={cn(layout === 'mediaRight' && 'lg:order-1')}
                    >
                        {tagline && (
                            <span className="overline-copper mb-4 block animate-reveal">
                                {tagline}
                            </span>
                        )}
                        <h2 className="mb-6 max-w-2xl font-display-tight font-heading-3-bold leading-[1.1] tracking-tight text-balance chrome-text hyphens-auto [overflow-wrap:anywhere] pb-[0.03em]">
                            {headline}
                        </h2>
                        {body && (
                            <div className="font-medium-text-regular text-muted-foreground mb-10 [&_p]:mb-4 last:[&_p]:mb-0 hyphens-auto">
                                <RichText data={body} enableGutter={false} />
                            </div>
                        )}
                        {links && links.length > 0 && (
                            <div className="flex flex-wrap gap-4">
                                {links.map((linkItem, i) => (
                                    <span
                                        key={i}
                                        className="animate-reveal"
                                        style={{ animationDelay: `${(i + 1) * 0.1}s` }}
                                    >
                                        <CMSLink {...linkItem.link} />
                                    </span>
                                ))}
                            </div>
                        )}
                    </ScrollFadeIn>
                </div>
            </div>
        </section>
    )
}
