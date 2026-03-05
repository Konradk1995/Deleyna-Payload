'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'

export default function LocaleError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    const t = useTranslations('errors')

    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            console.error('Frontend error:', error)
        }
    }, [error])

    const isDev = process.env.NODE_ENV === 'development'

    return (
        <div className="padding-large relative flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
            <h1 className="font-heading-2 chrome-text">{t('serverError')}</h1>
            <p className="text-muted-foreground max-w-md">{t('serverErrorDescription')}</p>
            {isDev && error?.message && (
                <pre className="max-w-2xl overflow-auto rounded-2xl border border-border bg-muted/50 p-4 text-left text-sm text-destructive">
                    {error.message}
                </pre>
            )}
            <div className="flex flex-wrap justify-center gap-4">
                <Button onClick={reset} variant="primary" className="rounded-full">
                    {t('tryAgain')}
                </Button>
                <Button asChild variant="outline" className="rounded-full">
                    <Link href="/">{t('backToHome')}</Link>
                </Button>
            </div>
        </div>
    )
}
