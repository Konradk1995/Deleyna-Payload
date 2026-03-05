export type Theme = 'light' | 'dark'

export interface ThemeContextType {
    theme: Theme | undefined
    setTheme: (theme: Theme | null) => void
}
