import type { Theme } from './types'

export const themeLocalStorageKey = 'theme'
/** Standard-Theme beim ersten Besuch (Deleyna = Dark, Lovable-Style) */
export const defaultTheme: Theme = 'dark'

/**
 * Get implicit theme preference from system
 */
export function getImplicitPreference(): Theme | null {
    if (typeof window === 'undefined') return null

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    return mediaQuery.matches ? 'dark' : 'light'
}

/**
 * Validate if a value is a valid theme
 */
export function themeIsValid(theme: unknown): theme is Theme {
    return theme === 'light' || theme === 'dark'
}
