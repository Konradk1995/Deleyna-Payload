'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'

export function NotFoundContent() {
    const t = useTranslations('errors')

    return (
        <div className="padding-section-hero-tight relative flex min-h-[100vh] flex-col items-center justify-center overflow-hidden text-center">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden">
                <span className="text-display-404 font-black text-foreground-faint">
                    404
                </span>
            </div>

            <div className="relative z-10 flex flex-col items-center max-w-2xl px-6">
                <h1 className="font-heading-1-bold text-gradient-copper mb-6">{t('notFound')}</h1>

                <p className="text-muted-foreground font-large-text-regular mb-10 max-w-lg mx-auto">
                    {t('notFoundDescription')}
                </p>

                <Button
                    asChild
                    variant="primary"
                    size="lg"
                    className="rounded-full font-small-text-bold tracking-wide uppercase px-8 shadow-xl shadow-copper/20 hover:scale-105 transition"
                >
                    <Link href="/">{t('backToHome')}</Link>
                </Button>
            </div>
        </div>
    )
}
