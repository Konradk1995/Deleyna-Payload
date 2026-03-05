import React, { Fragment } from 'react'

import type { Props } from './types'

import { ImageMedia } from './ImageMedia'
import { VideoMedia } from './VideoMedia'

export const Media: React.FC<Props> = (props) => {
    const { className, htmlElement = 'div', resource } = props

    const isVideo =
        typeof resource === 'object' &&
        resource !== null &&
        (resource.mimeType?.includes('video') ||
            (typeof resource.url === 'string' &&
                (resource.url.toLowerCase().endsWith('.mp4') ||
                    resource.url.toLowerCase().endsWith('.webm'))))
    const Tag = htmlElement || Fragment

    return (
        <Tag
            {...(htmlElement !== null
                ? {
                      className,
                  }
                : {})}
        >
            {isVideo ? <VideoMedia {...props} /> : <ImageMedia {...props} />}
        </Tag>
    )
}

export type { Props as MediaProps } from './types'
