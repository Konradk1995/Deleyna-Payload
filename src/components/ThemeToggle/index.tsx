'use client'

import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'
import { cn } from '@/utilities/ui'

const STORAGE_KEY = 'theme'

export function ThemeToggle({ className }: { className?: string }) {
    const [theme, setTheme] = useState<'light' | 'dark'>('dark')
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        const hasLight = document.documentElement.classList.contains('light')
        const hasDark = document.documentElement.classList.contains('dark')
        const fromDom = hasLight ? 'light' : hasDark ? 'dark' : null
        const savedTheme = localStorage.getItem(STORAGE_KEY) as 'light' | 'dark' | null
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

        const initialTheme =
            fromDom ??
            (savedTheme === 'dark' || savedTheme === 'light'
                ? savedTheme
                : prefersDark
                  ? 'dark'
                  : 'light')
        setTheme(initialTheme)

        document.documentElement.classList.remove('light', 'dark')
        document.documentElement.classList.add(initialTheme)
        document.documentElement.setAttribute('data-theme', initialTheme)
        if (savedTheme !== initialTheme) localStorage.setItem(STORAGE_KEY, initialTheme)
    }, [])

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light'
        setTheme(newTheme)
        localStorage.setItem(STORAGE_KEY, newTheme)

        document.documentElement.classList.remove('light', 'dark')
        document.documentElement.classList.add(newTheme)
        document.documentElement.setAttribute('data-theme', newTheme)
    }

    if (!mounted) {
        return (
            <button
                type="button"
                className={cn(
                    'inline-flex h-10 w-10 items-center justify-center rounded-full',
                    className,
                )}
                aria-label="Theme wechseln"
            >
                <span className="block h-5 w-5" />
            </button>
        )
    }

    return (
        <button
            type="button"
            onClick={toggleTheme}
            className={cn(
                'relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/40 bg-background/80 text-foreground/82 transition duration-300 supports-[backdrop-filter]:bg-background/55 backdrop-blur-md',
                'hover:border-copper/50 hover:bg-copper/12 hover:text-copper hover:shadow-md hover:shadow-copper/25 hover:scale-105',
                'active:scale-95',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper/40',
                className,
            )}
            aria-label={theme === 'light' ? 'Zu Dark Mode wechseln' : 'Zu Light Mode wechseln'}
        >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-transform duration-300 dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-transform duration-300 dark:rotate-0 dark:scale-100" />
        </button>
    )
}
