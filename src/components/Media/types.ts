import type { StaticImageData } from 'next/image'
import type { Ref } from 'react'

import type { Media as MediaType } from '@/payload-types'

export interface Props {
    alt?: string
    className?: string
    fill?: boolean
    htmlElement?:
        | 'div'
        | 'section'
        | 'span'
        | 'figure'
        | 'article'
        | 'main'
        | 'header'
        | 'footer'
        | null
    pictureClassName?: string
    imgClassName?: string
    onClick?: () => void
    onLoad?: () => void
    loading?: 'lazy' | 'eager'
    priority?: boolean
    ref?: Ref<HTMLImageElement | HTMLVideoElement | null>
    resource?: MediaType | string | number | null
    size?: string
    src?: StaticImageData | string
    fetchPriority?: 'high' | 'low' | 'auto'
    videoClassName?: string
    videoAutoPlay?: boolean
    videoLoop?: boolean
    videoMuted?: boolean
    videoPlaysInline?: boolean
    videoControls?: boolean
    videoPoster?: string
    videoPreload?: 'auto' | 'metadata' | 'none'
}
