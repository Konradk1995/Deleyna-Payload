'use client'

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'

import type { Theme, ThemeContextType } from './types'
import canUseDOM from '@/utilities/canUseDOM'
import { defaultTheme, getImplicitPreference, themeLocalStorageKey, themeIsValid } from './shared'

const initialContext: ThemeContextType = {
    setTheme: () => null,
    theme: undefined,
}

const ThemeContext = createContext<ThemeContextType>(initialContext)

interface ThemeProviderProps {
    children: React.ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps): React.ReactElement {
    const [theme, setThemeState] = useState<Theme | undefined>(
        canUseDOM ? (document.documentElement.getAttribute('data-theme') as Theme) : undefined,
    )

    const setTheme = useCallback((themeToSet: Theme | null) => {
        if (themeToSet === null) {
            // Use system preference
            window.localStorage.removeItem(themeLocalStorageKey)
            const implicitPreference = getImplicitPreference()
            const newTheme = implicitPreference || defaultTheme

            document.documentElement.setAttribute('data-theme', newTheme)
            document.documentElement.classList.remove('light', 'dark')
            document.documentElement.classList.add(newTheme)

            setThemeState(newTheme)
        } else {
            setThemeState(themeToSet)
            window.localStorage.setItem(themeLocalStorageKey, themeToSet)

            document.documentElement.setAttribute('data-theme', themeToSet)
            document.documentElement.classList.remove('light', 'dark')
            document.documentElement.classList.add(themeToSet)
        }
    }, [])

    useEffect(() => {
        let themeToSet: Theme = defaultTheme
        const preference = window.localStorage.getItem(themeLocalStorageKey)

        if (themeIsValid(preference)) {
            themeToSet = preference
        } else {
            const implicitPreference = getImplicitPreference()

            if (implicitPreference) {
                themeToSet = implicitPreference
            }
        }

        document.documentElement.setAttribute('data-theme', themeToSet)
        document.documentElement.classList.remove('light', 'dark')
        document.documentElement.classList.add(themeToSet)

        setThemeState(themeToSet)
    }, [])

    // Listen for system theme changes
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

        const handleChange = (e: MediaQueryListEvent) => {
            const storedTheme = window.localStorage.getItem(themeLocalStorageKey)

            // Only update if no theme is stored (user hasn't made a choice)
            if (!storedTheme) {
                const newTheme: Theme = e.matches ? 'dark' : 'light'
                setThemeState(newTheme)
                document.documentElement.setAttribute('data-theme', newTheme)
                document.documentElement.classList.remove('light', 'dark')
                document.documentElement.classList.add(newTheme)
            }
        }

        mediaQuery.addEventListener('change', handleChange)

        return () => {
            mediaQuery.removeEventListener('change', handleChange)
        }
    }, [])

    return <ThemeContext.Provider value={{ setTheme, theme }}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextType {
    const context = useContext(ThemeContext)

    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }

    return context
}

export { type Theme, type ThemeContextType } from './types'
export { InitTheme } from './InitTheme'
