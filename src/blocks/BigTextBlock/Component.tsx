import React from 'react'

import type { BigTextBlock as BigTextBlockProps } from '@/payload-types'

import { ScrollFadeIn } from '@/components/ScrollFadeIn'
import { cn } from '@/utilities/ui'

/**
 * Renders a heading line with an optional highlighted word/phrase.
 * Non-highlighted text is muted-foreground (gray), highlighted text is foreground (black/white).
 */
function HeadingLine({
    text,
    highlight,
    as: Tag,
    className,
}: {
    text: string
    highlight?: string | null
    as: 'h2' | 'h3'
    className: string
}) {
    if (!highlight || !text.includes(highlight)) {
        return <Tag className={className}>{text}</Tag>
    }

    const parts = text.split(highlight)

    return (
        <Tag className={cn(className, 'transition duration-300')}>
            {parts[0]}
            <span className="text-copper [text-shadow:0_0_16px_rgb(var(--copper)/0.28)]">
                {highlight}
            </span>
            {parts[1]}
        </Tag>
    )
}

export const BigTextBlockComponent: React.FC<BigTextBlockProps> = ({
    headingLevel,
    lineOne,
    lineOneHighlight,
    lineTwo,
    lineTwoHighlight,
}) => {
    if (!lineOne) return null

    const Tag = headingLevel === 'h3' ? 'h3' : 'h2'
    const fontClass =
        headingLevel === 'h3'
            ? 'font-display-tight font-heading-2-bold'
            : 'font-display-tight font-heading-1-bold'

    return (
        <section className="section-padding-lg section-atmosphere relative flex items-center justify-center bg-muted/20">
            <div className="container relative z-10 flex justify-center">
                <ScrollFadeIn className="mx-auto flex max-w-6xl flex-col items-center py-2 text-center md:py-3">
                    <HeadingLine
                        text={lineOne}
                        highlight={lineOneHighlight}
                        as={Tag}
                        className={cn(
                            fontClass,
                            'text-balance bg-gradient-to-r from-foreground via-copper to-foreground bg-clip-text text-transparent',
                        )}
                    />
                    {lineTwo && (
                        <HeadingLine
                            text={lineTwo}
                            highlight={lineTwoHighlight}
                            as={Tag}
                            className={cn(
                                fontClass,
                                'mt-4 text-balance bg-gradient-to-r from-foreground via-copper to-foreground bg-clip-text text-transparent md:mt-6',
                            )}
                        />
                    )}
                </ScrollFadeIn>
            </div>
        </section>
    )
}
