import type { TextTone } from './types'

/** Tone styles use design tokens and work in light/dark via CSS variables only. */
export const getToneStyles = (tone: TextTone | null | undefined) => {
  const normalized = tone ?? 'dark'
  const usesDarkText = normalized === 'dark'

  return {
    heading:
      usesDarkText ? 'text-foreground' : 'text-on-media',
    body:
      usesDarkText ? 'text-muted-foreground' : 'text-on-media-muted',
    link:
      usesDarkText ? 'text-foreground' : 'text-on-media',
    overlay:
      usesDarkText
        ? 'pointer-events-none opacity-75 group-hover:opacity-85 transition-opacity duration-500 bg-gradient-to-t from-background/88 via-background/66 to-background/24'
        : 'pointer-events-none opacity-75 group-hover:opacity-85 transition-opacity duration-500 bg-gradient-to-t from-media-overlay/74 via-media-overlay/48 to-media-overlay/22',
    sideOverlay:
      usesDarkText
        ? 'pointer-events-none bg-gradient-to-r from-transparent via-background/42 to-background/86 backdrop-blur-[1px]'
        : 'pointer-events-none bg-gradient-to-r from-transparent via-media-overlay/28 to-media-overlay/68 backdrop-blur-[1px]',
    contentSurface:
      usesDarkText
        ? 'border border-border/40 bg-background/82 backdrop-blur-md'
        : 'border border-on-media/18 bg-media-overlay/42 backdrop-blur-md',
    fallback:
      usesDarkText ? 'bg-card' : 'bg-surface-inverse',
  }
}
