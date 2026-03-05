'use client'

import localization from '@/i18n/localization'
import { useRouter, usePathname } from '@/i18n/navigation'
import { cn } from '@/utilities/ui'
import { useParams } from 'next/navigation'
import { useTransition } from 'react'

interface LanguageSwitcherProps {
    className?: string
    size?: 'sm' | 'md'
    variant?: 'pill' | 'minimal'
}

export function LanguageSwitcher({
    className,
    size = 'md',
    variant = 'pill',
}: LanguageSwitcherProps) {
    const pathname = usePathname()
    const router = useRouter()
    const params = useParams()
    const [isPending, startTransition] = useTransition()

    const locales = localization.locales
    const currentLocale = (params?.locale as string) || localization.defaultLocale

    const handleChange = (locale: string) => {
        if (locale === currentLocale) return
        startTransition(() => {
            router.replace(
                // @ts-expect-error -- pathname is always valid here
                { pathname },
                { locale },
            )
        })
    }

    const nextLocale =
        locales.find((locale) => locale.code !== currentLocale)?.code ?? currentLocale
    const nextLocaleLabel = locales.find((l) => l.code === nextLocale)?.label ?? nextLocale

    if (variant === 'minimal') {
        return (
            <button
                type="button"
                onClick={() => handleChange(nextLocale)}
                className={cn(
                    'group relative inline-flex items-center justify-center rounded-full border border-border/40 bg-background/80 font-semibold tracking-[0.08em] text-foreground/82 transition duration-300 supports-[backdrop-filter]:bg-background/55 backdrop-blur-md',
                    'hover:border-copper/50 hover:bg-copper/12 hover:text-copper hover:shadow-md hover:shadow-copper/25 hover:scale-105',
                    'active:scale-95',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper/40',
                    size === 'sm' ? 'h-9 w-9 text-[11px]' : 'h-10 w-10 text-xs',
                    isPending && 'opacity-60 pointer-events-none',
                    className,
                )}
                aria-label={`Switch to ${nextLocaleLabel}`}
                title={`Switch to ${nextLocaleLabel}`}
                disabled={isPending}
            >
                <span className="transition-transform duration-200 group-hover:scale-110">
                    {nextLocale.toUpperCase()}
                </span>
            </button>
        )
    }

    return (
        <div
            className={cn(
                'inline-flex items-center gap-0.5 rounded-full p-[3px] text-xs font-semibold',
                variant === 'pill' &&
                    'border border-border/50 bg-transparent text-foreground shadow-sm',
                size === 'sm' && 'text-[11px]',
                className,
            )}
            aria-live="polite"
        >
            {locales.map((locale) => (
                <button
                    key={locale.code}
                    type="button"
                    onClick={() => handleChange(locale.code)}
                    className={cn(
                        'rounded-full px-2.5 py-1 transition-colors duration-200',
                        locale.code === currentLocale
                            ? 'bg-foreground text-background shadow-sm'
                            : 'text-foreground/50 hover:text-foreground hover:bg-foreground/10',
                    )}
                    aria-pressed={locale.code === currentLocale}
                    disabled={isPending && locale.code === currentLocale}
                >
                    {locale.code.toUpperCase()}
                </button>
            ))}
        </div>
    )
}
