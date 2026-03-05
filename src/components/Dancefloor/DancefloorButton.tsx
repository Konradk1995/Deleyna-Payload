'use client'

import React from 'react'
import { Footprints, X } from 'lucide-react'
import { useLocale } from 'next-intl'
import { useTranslations } from 'next-intl'
import { useSelection } from '@/providers/Dancefloor'
import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'
import { cn } from '@/utilities/ui'

const bookingSlugByLocale: Record<string, string> = { de: 'booking', en: 'booking' }

/**
 * Floating Dancefloor button (bottom-right) + drawer with selected talents.
 * Click opens drawer; "Kontakt" links to contact with talents in context for the form.
 */
export function DancefloorButton() {
    const locale = useLocale()
    const t = useTranslations('selection')
    const { talents, removeTalent, clearSelection, drawerOpen, setDrawerOpen } = useSelection()
    const count = talents.length
    const bookingSlug = bookingSlugByLocale[locale] ?? 'booking'

    return (
        <>
            <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                aria-label={count > 0 ? t('ariaCount', { count }) : t('ariaOpen')}
                className={cn(
                    'fixed bottom-7 right-7 z-40 flex h-14 w-14 items-center justify-center rounded-full transition duration-200',
                    'bg-background/90 backdrop-blur-lg border border-border/50 shadow-lg',
                    'hover:border-copper/60 hover:shadow-xl hover:scale-105',
                    'active:scale-95',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                )}
            >
                <Footprints className="h-6 w-6 text-foreground" />
                {count > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-copper px-1 font-display text-[10px] font-bold leading-none text-background">
                        {count > 9 ? '9+' : count}
                    </span>
                )}
            </button>

            {/* Drawer overlay */}
            {drawerOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm"
                        aria-hidden
                        onClick={() => setDrawerOpen(false)}
                    />
                    <div
                        role="dialog"
                        aria-label="Dancefloor – ausgewählte Talente"
                        className={cn(
                            'fixed top-0 right-0 z-50 flex h-full w-full max-w-[22rem] flex-col',
                            'border-l border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl',
                            'animate-in slide-in-from-right duration-300',
                        )}
                    >
                        {/* Header – sexy typo */}
                        <div className="flex items-start justify-between border-b border-border/40 p-5">
                            <div>
                                <p className="overline-copper mb-1">{t('yourSelection')}</p>
                                <h2 className="font-display text-2xl font-bold tracking-tight text-gradient-copper">
                                    {t('title')}
                                </h2>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 rounded-full hover:bg-copper/20 hover:text-copper transition-colors"
                                onClick={() => setDrawerOpen(false)}
                                aria-label={t('closeDrawer')}
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4">
                            {talents.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <Footprints className="mb-4 h-12 w-12 text-muted-foreground/50" />
                                    <p className="font-display-tight text-muted-foreground text-sm leading-relaxed max-w-[200px]">
                                        {t('emptyState')}
                                    </p>
                                </div>
                            ) : (
                                <ul className="space-y-2">
                                    {talents.map((talent) => (
                                        <li
                                            key={talent.id}
                                            className="group/item flex items-center justify-between gap-3 rounded-xl border border-border/50 bg-foreground/[0.03] px-4 py-3 transition duration-200 hover:border-copper/40 hover:bg-copper/8"
                                        >
                                            <Link
                                                href={{ pathname: '/talents/[slug]', params: { slug: talent.slug } }}
                                                className="font-display-tight font-medium text-foreground hover:text-copper truncate text-[0.95rem] tracking-tight transition-colors"
                                                onClick={() => setDrawerOpen(false)}
                                            >
                                                {talent.name}
                                            </Link>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="xs"
                                                className="h-8 w-8 shrink-0 rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                                                onClick={() => removeTalent(talent.id)}
                                                aria-label={`${talent.name} ${t('remove')}`}
                                            >
                                                <X className="h-3.5 w-3.5" />
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {talents.length > 0 && (
                            <div className="border-t border-border p-5 space-y-3">
                                <Button
                                    asChild
                                    variant="primary"
                                    size="lg"
                                    className="w-full rounded-full font-display-tight font-semibold tracking-tight text-base"
                                    onClick={() => setDrawerOpen(false)}
                                >
                                    <Link href={{ pathname: '/[...slug]', params: { slug: [bookingSlug] } }}>
                                        {t('contactWithCount', { count })}
                                    </Link>
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="w-full rounded-full text-muted-foreground hover:text-foreground font-small-text-regular"
                                    onClick={() => {
                                        clearSelection()
                                        setDrawerOpen(false)
                                    }}
                                >
                                    {t('clear')}
                                </Button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </>
    )
}
