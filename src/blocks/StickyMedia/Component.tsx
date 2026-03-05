import React from 'react'

import type { StickyMediaBlock as StickyMediaBlockProps } from '@/payload-types'

import { StickyMediaClient } from './StickyMediaClient'

type Props = StickyMediaBlockProps & {
    locale?: string
    backgroundColor?: 'white' | 'muted'
}

export const StickyMediaBlock: React.FC<Props> = (props) => {
    const {
        badge,
        headline,
        headlineHighlight,
        subtitle,
        media,
        overlayOpacity = '50',
        locale,
        backgroundColor = 'white',
    } = props

    if (!media) return null

    const scrollLabel = locale === 'en' ? 'Scroll' : 'Scrollen'

    return (
        <StickyMediaClient
            badge={badge ?? undefined}
            headline={headline ?? undefined}
            headlineHighlight={headlineHighlight ?? undefined}
            subtitle={subtitle ?? undefined}
            media={media}
            overlayOpacity={parseInt(overlayOpacity || '50') / 100}
            scrollLabel={scrollLabel}
            backgroundColor={backgroundColor || 'white'}
        />
    )
}
