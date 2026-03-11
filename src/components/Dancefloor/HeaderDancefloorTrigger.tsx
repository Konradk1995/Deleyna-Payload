'use client'

import React, { useRef, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Bookmark, X } from 'lucide-react'
import { useLocale } from 'next-intl'
import { useTranslations } from 'next-intl'
import { useSelection } from '@/providers/Dancefloor'
import { Link } from '@/i18n/navigation'
import { toHref } from '@/utilities/typedHref'
import { cn } from '@/utilities/ui'

const bookingSlugByLocale: Record<string, string> = { de: 'booking', en: 'booking' }
const talentsPath = '/talents'
const MAX_VISIBLE = 4

export function HeaderSelectionTrigger() {
    const locale = useLocale()
    const t = useTranslations('selection')
    const { talents, removeTalent, clearSelection } = useSelection()
    const [open, setOpen] = useState(false)
    const [isMobileViewport, setIsMobileViewport] = useState(false)
    const [mounted, setMounted] = useState(false)
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const count = talents.length
    const bookingSlug = bookingSlugByLocale[locale] ?? 'booking'

    useEffect(() => {
        setMounted(true)
    }, [])

    const handleMouseEnter = () => {
        if (isMobileViewport) return
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
            timeoutRef.current = null
        }
        setOpen(true)
    }

    const handleMouseLeave = () => {
        if (isMobileViewport) return
        timeoutRef.current = setTimeout(() => setOpen(false), 200)
    }

    const visible = talents.slice(0, MAX_VISIBLE)
    const rest = talents.length - MAX_VISIBLE

    useEffect(() => {
        if (typeof window === 'undefined') return
        const mediaQuery = window.matchMedia('(max-width: 1023px)')
        const apply = () => setIsMobileViewport(mediaQuery.matches)
        apply()

        mediaQuery.addEventListener('change', apply)
        return () => mediaQuery.removeEventListener('change', apply)
    }, [])

    useEffect(() => {
        if (isMobileViewport) {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
                timeoutRef.current = null
            }
        }
    }, [isMobileViewport])

    // Close on click outside (desktop only — mobile uses backdrop button)
    useEffect(() => {
        if (!open || isMobileViewport) return
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as Node
            if (
                buttonRef.current &&
                !buttonRef.current.contains(target) &&
                dropdownRef.current &&
                !dropdownRef.current.contains(target)
            ) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [open, isMobileViewport])

    const dropdownContent = (
        <>
            <div className="border-b border-border px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <p className="overline-copper text-[10px]">{t('yourSelection')}</p>
                        <p className="font-display-tight text-lg font-bold tracking-tight text-gradient-copper">
                            {t('title')}
                        </p>
                    </div>
                    {isMobileViewport && (
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            aria-label={t('closeDrawer')}
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                    {count > 0 ? t('contactWithCount', { count }) : t('emptyStateShort')}
                </p>
            </div>

            <div
                className={cn(
                    'overflow-y-auto p-2',
                    isMobileViewport ? 'max-h-[52svh]' : 'max-h-[240px]',
                )}
            >
                {talents.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 py-5">
                        <p className="font-small-text-regular text-muted-foreground text-center text-sm">
                            {t('emptyStateShort')}
                        </p>
                        <Link
                            href={toHref(talentsPath)}
                            onClick={() => setOpen(false)}
                            className="inline-flex items-center justify-center rounded-xl border border-border/60 px-3 py-2 text-xs font-medium text-foreground/85 transition-colors hover:bg-foreground/8 hover:text-foreground"
                        >
                            {t('browseTalents')}
                        </Link>
                    </div>
                ) : (
                    <ul className="space-y-1">
                        {visible.map((talent) => (
                            <li
                                key={talent.id}
                                className="group flex items-center justify-between gap-2 rounded-xl px-3 py-2 transition-colors hover:bg-copper/5"
                            >
                                <Link
                                    href={{
                                        pathname: '/talents/[slug]',
                                        params: { slug: talent.slug },
                                    }}
                                    className="font-display-tight font-medium text-foreground hover:text-copper truncate text-sm tracking-tight"
                                    onClick={() => setOpen(false)}
                                >
                                    {talent.name}
                                </Link>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        removeTalent(talent.id)
                                    }}
                                    className={cn(
                                        'shrink-0 rounded-full p-1 text-muted-foreground transition-opacity hover:bg-destructive/10 hover:text-destructive',
                                        isMobileViewport
                                            ? 'opacity-100'
                                            : 'opacity-0 group-hover:opacity-100',
                                    )}
                                    aria-label={`${talent.name} ${t('remove')}`}
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </li>
                        ))}
                        {rest > 0 && (
                            <li className="px-3 py-2 text-xs text-muted-foreground">
                                {t('moreCount', { count: rest })}
                            </li>
                        )}
                    </ul>
                )}
            </div>

            {talents.length > 0 && (
                <div className="border-t border-border p-2 space-y-1">
                    <Link
                        href={{ pathname: '/[...slug]', params: { slug: [bookingSlug] } }}
                        onClick={() => setOpen(false)}
                        className="flex w-full items-center justify-center rounded-xl border border-copper/50 bg-copper/10 px-3 py-2.5 text-sm font-semibold text-copper transition-colors hover:bg-copper/20"
                    >
                        {t('bookingRequest')}
                    </Link>
                    <button
                        type="button"
                        onClick={() => {
                            clearSelection()
                            setOpen(false)
                        }}
                        className="flex w-full items-center justify-center rounded-xl px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                    >
                        {t('clear')}
                    </button>
                </div>
            )}
        </>
    )

    // Desktop: inline dropdown positioned absolutely
    const desktopDropdown = (
        <div
            ref={dropdownRef}
            className={cn(
                'absolute right-0 top-full z-[100] mt-2 w-[280px] overflow-hidden rounded-2xl border border-border bg-card shadow-[0_4px_24px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]',
                'transition duration-200',
                open
                    ? 'pointer-events-auto opacity-100 translate-y-0'
                    : 'pointer-events-none opacity-0 -translate-y-1',
            )}
            aria-hidden={!open}
        >
            {dropdownContent}
        </div>
    )

    // Mobile: portal to body so it escapes all containing blocks (backdrop-filter, transforms)
    // Backdrop and panel use explicit z-index to guarantee paint order
    const mobileDropdown = mounted
        ? createPortal(
              <div
                  style={{
                      position: 'fixed',
                      inset: 0,
                      zIndex: 9999,
                      pointerEvents: open ? 'auto' : 'none',
                  }}
                  aria-hidden={!open}
              >
                  {/* Backdrop — z-index 1 */}
                  {open && (
                      <button
                          type="button"
                          style={{
                              position: 'absolute',
                              inset: 0,
                              zIndex: 1,
                              background: 'rgba(0,0,0,0.2)',
                              backdropFilter: 'blur(2px)',
                              WebkitBackdropFilter: 'blur(2px)',
                              border: 'none',
                              cursor: 'default',
                          }}
                          aria-label={t('closeDrawer')}
                          onClick={() => setOpen(false)}
                      />
                  )}
                  {/* Dropdown panel — z-index 2 to stay above backdrop stacking context */}
                  <div
                      ref={dropdownRef}
                      style={{
                          position: 'absolute',
                          zIndex: 2,
                          left: 12,
                          right: 12,
                          top: 80,
                          maxHeight: 'calc(100svh - 6rem)',
                          overflow: 'hidden',
                          borderRadius: 16,
                          opacity: open ? 1 : 0,
                          transform: open ? 'translateY(0)' : 'translateY(-4px)',
                          transition: 'opacity 200ms, transform 200ms',
                      }}
                      className="border border-border bg-card shadow-[0_8px_34px_rgba(0,0,0,0.24)]"
                      role="dialog"
                      aria-label={t('title')}
                  >
                      {dropdownContent}
                  </div>
              </div>,
              document.body,
          )
        : null

    return (
        <div
            className="relative flex items-center"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <button
                ref={buttonRef}
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-label={mounted && count > 0 ? t('ariaCount', { count }) : t('ariaOpen')}
                aria-expanded={open}
                aria-haspopup={isMobileViewport ? 'dialog' : 'menu'}
                className={cn(
                    'relative flex h-10 w-10 items-center justify-center rounded-full border transition duration-300',
                    'bg-background/80 supports-[backdrop-filter]:bg-background/55 backdrop-blur-md',
                    'hover:border-copper/50 hover:bg-copper/12 hover:text-copper hover:shadow-md hover:shadow-copper/25 hover:scale-105',
                    'active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper/40',
                    mounted && count === 0
                        ? 'animate-copper-pulse border-copper/35 text-copper/70'
                        : mounted && count > 0
                          ? 'shadow-copper-glow border-copper/45 text-copper'
                          : 'border-border/40 text-muted-foreground',
                    open && 'text-copper',
                )}
            >
                <Bookmark className="h-[18px] w-[18px]" />
                {mounted && count > 0 && (
                    <span className="absolute -right-1.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-copper px-1 text-[10px] font-bold leading-none text-background shadow-sm">
                        {count > 9 ? '9+' : count}
                    </span>
                )}
            </button>

            {isMobileViewport ? mobileDropdown : desktopDropdown}
        </div>
    )
}

/** @deprecated Use HeaderSelectionTrigger */
export const HeaderDancefloorTrigger = HeaderSelectionTrigger
