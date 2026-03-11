import React from 'react'
import type { MediaContentBlock as MediaContentBlockProps } from '@/payload-types'
import { CMSLink } from '@/components/CMSLink'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { ScrollFadeIn } from '@/components/ScrollFadeIn'
import { SectionHeader } from '@/components/SectionHeader'
import { cn } from '@/utilities/ui'

export const MediaContentBlock: React.FC<MediaContentBlockProps & { backgroundColor?: 'white' | 'muted' | null }> = (props) => {
    const { layout = 'mediaLeft', media, badge, title, titleHighlight, headingLevel, body, links, backgroundColor = 'white' } = props as MediaContentBlockProps & { backgroundColor?: 'white' | 'muted' | null }

    const bgClass = backgroundColor === 'muted' ? 'bg-muted' : 'bg-background'

    return (
        <section className={cn('section-padding-lg section-atmosphere relative', bgClass)}>
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
                                size="(max-width: 1024px) 100vw, 50vw"
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
                        <SectionHeader
                            overline={badge ?? undefined}
                            title={title || ''}
                            titleHighlight={titleHighlight ?? undefined}
                            as={(headingLevel as 'h1' | 'h2' | 'h3') || 'h2'}
                            centered={false}
                            titleClassName="chrome-text"
                            className="mb-0"
                        />
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
