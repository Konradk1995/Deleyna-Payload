import React from 'react'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'
import { ScrollFadeIn } from '@/components/ScrollFadeIn'

type Props = {
    layout?: 'default' | 'narrow' | 'wide' | 'full' | null
    backgroundColor?: 'white' | 'muted' | null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    content?: any
}

const layoutClasses: Record<string, string> = {
    default: 'max-w-5xl', // Increased from 4xl
    narrow: 'max-w-2xl',
    wide: 'max-w-7xl', // Increased from 6xl
    full: 'w-full',
}

export function ContentBlockComponent({
    layout = 'default',
    backgroundColor = 'white',
    content,
}: Props) {
    if (!content) return null

    const bgClass = backgroundColor === 'muted' ? 'bg-muted/30' : 'bg-background'

    const hasWhiteBackground = backgroundColor !== 'muted'
    const useCardWrapper = backgroundColor === 'muted' || layout === 'narrow'

    return (
        <section className={cn('section-padding-lg section-atmosphere relative', bgClass)}>
            {hasWhiteBackground && (
                <>
                    <div
                        aria-hidden
                        className="pointer-events-none absolute -left-20 top-1/3 h-72 w-72 rounded-full bg-copper/8 blur-[100px]"
                    />
                    <div
                        aria-hidden
                        className="pointer-events-none absolute -right-24 bottom-1/4 h-80 w-80 rounded-full bg-copper/7 blur-[110px]"
                    />
                </>
            )}
            <div className="container">
                <ScrollFadeIn animation="fade-up">
                    <div
                        className={cn(
                            layout !== 'full' && 'mx-auto',
                            layoutClasses[layout || 'default'],
                            layout === 'full' && 'max-w-none',
                        )}
                    >
                        <div
                            className={cn(
                                'hyphens-auto leading-relaxed text-balance',
                                useCardWrapper
                                    ? 'surface-pill border border-border/70 padding-medium shadow-copper-glow'
                                    : 'px-0 md:px-2',
                            )}
                        >
                            <RichText data={content} enableGutter={false} />
                        </div>
                    </div>
                </ScrollFadeIn>
            </div>
        </section>
    )
}
