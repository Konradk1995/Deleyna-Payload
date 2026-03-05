'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const LOCALES = ['de', 'en']

/**
 * Outermost error boundary for the (frontend) route group.
 * Lives OUTSIDE [locale]/layout.tsx, so NextIntlClientProvider is NOT available.
 * Uses hardcoded strings only — the locale-level error.tsx handles translated errors.
 */
export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    const pathname = usePathname() ?? ''
    const localeSegment = pathname.split('/')[1]
    const locale = LOCALES.includes(localeSegment) ? localeSegment : 'de'
    const homeHref = `/${locale}`

    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            console.error('Frontend error (root boundary):', error)
        }
    }, [error])

    const isDev = process.env.NODE_ENV === 'development'
    const text =
        locale === 'de'
            ? {
                  title: 'Etwas ist schiefgelaufen',
                  description:
                      'Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es erneut oder kehre zur Startseite zurück.',
                  tryAgain: 'Erneut versuchen',
                  home: 'Zur Startseite',
              }
            : {
                  title: 'Something went wrong',
                  description:
                      'An unexpected error occurred. Please try again or return to the home page.',
                  tryAgain: 'Try again',
                  home: 'Back to home',
              }

    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 py-16 text-center">
            <h1 className="font-display-tight font-heading-3-bold tracking-tight text-foreground">
                {text.title}
            </h1>
            <p className="font-normal-text-regular max-w-md text-muted-foreground">{text.description}</p>
            {isDev && error?.message && (
                <pre className="max-w-2xl overflow-auto rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-left text-sm text-destructive">
                    {error.message}
                </pre>
            )}
            <div className="flex flex-wrap justify-center gap-4">
                <button
                    onClick={reset}
                    className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-7 text-sm font-semibold text-background transition duration-300 hover:-translate-y-0.5 hover:bg-foreground/85 hover:shadow-lg hover:shadow-copper/20"
                >
                    {text.tryAgain}
                </button>
                <Link
                    href={homeHref}
                    className="inline-flex h-11 items-center justify-center rounded-full border border-border/70 bg-card px-7 text-sm font-semibold text-card-foreground transition duration-300 hover:-translate-y-0.5 hover:bg-muted hover:shadow-lg hover:shadow-copper/15"
                >
                    {text.home}
                </Link>
            </div>
        </div>
    )
}
