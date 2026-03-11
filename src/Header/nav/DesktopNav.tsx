'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useLocale } from 'next-intl'
import { cn } from '@/utilities/ui'
import { CMSLink } from '@/components/CMSLink'
import { NavCard } from './NavCard'
import type { CardNavItem } from './types'

export interface DesktopNavProps {
    logo: React.ReactNode
    items: CardNavItem[]
    ctaButtons?: React.ReactNode[]
    languageSwitcher?: React.ReactNode
    themeToggle?: React.ReactNode
    dancefloorTrigger?: React.ReactNode
    className?: string
}

export const DesktopNav: React.FC<DesktopNavProps> = ({
    logo,
    items,
    ctaButtons,
    languageSwitcher,
    themeToggle,
    dancefloorTrigger,
}) => {
    const locale = useLocale()
    const [activeDesktopIndex, setActiveDesktopIndex] = useState<number | null>(null)
    const [isScrolled, setIsScrolled] = useState(false)
    const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    const handleMouseEnter = useCallback((idx: number) => {
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current)
            closeTimeoutRef.current = null
        }
        setActiveDesktopIndex(idx)
    }, [])

    const handleMouseLeave = useCallback(() => {
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current)
        }
        closeTimeoutRef.current = setTimeout(() => {
            setActiveDesktopIndex(null)
        }, 300)
    }, [])

    useEffect(() => {
        return () => {
            if (closeTimeoutRef.current) {
                clearTimeout(closeTimeoutRef.current)
            }
        }
    }, [])

    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 12)
        onScroll()
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const isElevated = isScrolled || activeDesktopIndex !== null

    return (
        <div className="hidden lg:block w-full overflow-x-clip pt-3 px-4">
            <nav
                aria-label={locale === 'de' ? 'Hauptnavigation' : 'Main navigation'}
                className={cn(
                    'w-full mx-auto rounded-[1.5rem] border transition duration-300',
                    'supports-[backdrop-filter]:backdrop-blur-xl',
                    isElevated
                        ? 'border-border/70 bg-background/92 shadow-[0_12px_36px_rgb(0_0_0/0.22)] supports-[backdrop-filter]:bg-background/72'
                        : 'border-border/55 bg-background/86 shadow-[0_8px_24px_rgb(0_0_0/0.16)] supports-[backdrop-filter]:bg-background/58',
                )}
            >
                <div className="container">
                    <div
                        className={cn(
                            'flex items-center justify-between gap-6 transition duration-300',
                            isScrolled ? 'h-[68px]' : 'h-[74px]',
                        )}
                    >
                        <div className="flex items-center flex-shrink-0">{logo}</div>

                        <div className="hidden flex-1 justify-center gap-1 xl:gap-2 lg:flex">
                            {(items || []).map((item, idx) => {
                                const hasLinks = item.links && item.links.length > 0
                                const isActive = activeDesktopIndex === idx
                                if (!hasLinks) {
                                    return (
                                        <div
                                            key={item.id || `${item.label}-${idx}`}
                                            className="flex items-center"
                                        >
                                            {item.labelLink ? (
                                                <CMSLink
                                                    {...item.labelLink}
                                                    appearance="inline"
                                                    className={cn(
                                                        'px-4 py-2 text-sm font-medium rounded-full transition-colors duration-300 !no-underline',
                                                        isActive
                                                            ? 'text-foreground bg-foreground/14'
                                                            : 'text-foreground/80 hover:text-foreground hover:bg-foreground/10',
                                                    )}
                                                >
                                                    {item.label}
                                                </CMSLink>
                                            ) : (
                                                <span
                                                    className={cn(
                                                        'px-4 py-2 text-sm font-medium rounded-full transition-colors duration-300',
                                                        isActive
                                                            ? 'text-foreground bg-foreground/14'
                                                            : 'text-foreground/80 hover:text-foreground hover:bg-foreground/10',
                                                    )}
                                                >
                                                    {item.label}
                                                </span>
                                            )}
                                        </div>
                                    )
                                }

                                return (
                                    <div
                                        key={item.id || `${item.label}-${idx}`}
                                        className="relative flex flex-col items-center"
                                        onMouseEnter={() => handleMouseEnter(idx)}
                                        onMouseLeave={handleMouseLeave}
                                        onFocus={() => handleMouseEnter(idx)}
                                        onBlur={handleMouseLeave}
                                    >
                                        {item.labelLink ? (
                                            <CMSLink
                                                {...item.labelLink}
                                                appearance="inline"
                                                className={cn(
                                                    'px-4 py-2 text-sm font-medium rounded-full transition-colors duration-300 !no-underline',
                                                    isActive
                                                        ? 'text-foreground bg-foreground/14'
                                                        : 'text-foreground/80 hover:text-foreground hover:bg-foreground/10',
                                                )}
                                            >
                                                {item.label}
                                            </CMSLink>
                                        ) : (
                                            <button
                                                type="button"
                                                className={cn(
                                                    'px-4 py-2 text-sm font-medium rounded-full transition-colors duration-300',
                                                    isActive
                                                        ? 'text-foreground bg-foreground/14'
                                                        : 'text-foreground/80 hover:text-foreground hover:bg-foreground/10',
                                                )}
                                            >
                                                {item.label}
                                            </button>
                                        )}

                                        <div
                                            className={cn(
                                                'pointer-events-none absolute left-1/2 top-full mt-3 w-[min(340px,calc(100vw-2rem))] max-w-[calc(100vw-2rem)] -translate-x-1/2 transition duration-200 ease-out',
                                                isActive
                                                    ? 'pointer-events-auto opacity-100 translate-y-0'
                                                    : 'opacity-0 translate-y-1',
                                            )}
                                            onMouseEnter={() => handleMouseEnter(idx)}
                                            onMouseLeave={handleMouseLeave}
                                            aria-hidden={!isActive}
                                            inert={!isActive ? true : undefined}
                                        >
                                            <NavCard item={item} variant="desktop" />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        <div className="flex items-center gap-1.5 flex-shrink-0">
                            {dancefloorTrigger && (
                                <div className="flex items-center">{dancefloorTrigger}</div>
                            )}
                            {themeToggle && <div className="flex items-center">{themeToggle}</div>}
                            {languageSwitcher && (
                                <div className="flex items-center">{languageSwitcher}</div>
                            )}
                            {ctaButtons && ctaButtons.length > 0 && (
                                <div className="flex items-center gap-3">
                                    {ctaButtons.map((btn, idx) => (
                                        <div key={idx} className="flex items-center">
                                            {btn}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    )
}
