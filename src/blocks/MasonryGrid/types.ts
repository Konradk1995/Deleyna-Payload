import type { CMSLinkProps } from '@/components/CMSLink'
import type { Media as MediaType } from '@/payload-types'

export type TextTone = 'light' | 'dark'

export type CardLink = CMSLinkProps | null | undefined

export type MediaCard = {
  title?: string | null
  description?: string | null
  textTone?: TextTone | null
  backgroundMedia?: string | number | MediaType | null
  link?: CardLink
}

export type TabsCard = {
  textTone?: TextTone | null
  backgroundMedia?: string | number | MediaType | null
  tabs?:
    | {
        label?: string | null
        title?: string | null
        description?: string | null
        link?: CardLink
        id?: string
      }[]
    | null
}

export type AudienceCard = {
  title?: string | null
  description?: string | null
  backgroundMedia?: string | number | MediaType | null
  size?: 'large' | 'medium' | null
  theme?: 'dark' | 'light' | null
  linkStyle?: 'default' | 'outline' | null
  link?: CardLink
}
