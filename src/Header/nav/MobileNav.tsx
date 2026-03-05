'use client'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { cn } from '@/utilities/ui'
import { CMSLink } from '@/components/CMSLink'
import { usePathname } from 'next/navigation'
import { HamburgerButton } from './HamburgerButton'
import { NavCard } from './NavCard'
import type { CardNavItem } from './types'

export interface MobileNavProps {
    logo: React.ReactNode
    items: CardNavItem[]
    ctaButtons?: React.ReactNode[]
    languageSwitcher?: React.ReactNode
    themeToggle?: React.ReactNode
    dancefloorTrigger?: React.ReactNode
    className?: string
}

export const MobileNav: React.FC<MobileNavProps> = ({
    logo,
    items,
    ctaButtons,
    languageSwitcher,
    themeToggle,
    dancefloorTrigger,
    className = '',
}) => {
    const pathname = usePathname()
    const navRef = useRef<HTMLDivElement | null>(null)
    const [isExpanded, setIsExpanded] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)

    // Lock body scroll when menu is open
    useLayoutEffect(() => {
        if (isExpanded) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [isExpanded])

    const toggleMenu = () => {
        setIsExpanded((prev) => !prev)
    }

    const closeMenu = () => {
        if (!isExpanded) return
        setIsExpanded(false)
    }

    // Close menu when pathname changes
    useEffect(() => {
        if (isExpanded) {
            setIsExpanded(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname])

    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 12)
        onScroll()
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!isExpanded) return
            if (window.innerWidth >= 1024) return

            const target = event.target as Node
            if (navRef.current && !navRef.current.contains(target)) {
                closeMenu()
            }
        }

        if (isExpanded) {
            document.addEventListener('mousedown', handleClickOutside)
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isExpanded])

    const simpleItems = (items || []).filter((item) => !item.links || item.links.length === 0)
    const cardItems = (items || []).filter((item) => item.links && item.links.length > 0)

    const hasControls = Boolean(languageSwitcher)

    return (
        <div className={`card-nav-container lg:hidden w-full ${className}`}>
            <motion.nav
                ref={navRef}
                initial={false}
                animate={{ height: isExpanded ? 'auto' : 60 }}
                className={cn(
                    'card-nav block h-[60px] max-w-[calc(100vw-2rem)] p-0 relative overflow-hidden will-change-[height] mx-4 mt-3 rounded-[1.2rem] border transition duration-300',
                    'supports-[backdrop-filter]:backdrop-blur-xl',
                    isExpanded || isScrolled
                        ? 'open border-border/70 bg-background/94 shadow-[0_12px_34px_rgb(0_0_0/0.2)] supports-[backdrop-filter]:bg-background/72'
                        : 'border-border/55 bg-background/86 shadow-[0_8px_24px_rgb(0_0_0/0.15)] supports-[backdrop-filter]:bg-background/58',
                )}
            >
                {/* Top bar: logo + CTA + hamburger */}
                <div className="card-nav-top relative h-[60px] flex items-center justify-between px-4 z-[10]">
                    <div className="logo-container flex items-center flex-shrink-0">{logo}</div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                        {themeToggle && <div className="flex items-center">{themeToggle}</div>}
                        {dancefloorTrigger && (
                            <div className="flex items-center">{dancefloorTrigger}</div>
                        )}
                        <HamburgerButton isOpen={isExpanded} onToggle={toggleMenu} />
                    </div>
                </div>

                {/* Expanded menu content */}
                <div
                    className={cn(
                        'card-nav-content relative border-t border-border/50 padding-small pb-[calc(env(safe-area-inset-bottom)+var(--space-md))] flex flex-col gap-medium z-[5] overflow-y-auto overflow-x-hidden',
                        isExpanded
                            ? 'opacity-100 pointer-events-auto transition-opacity duration-300'
                            : 'opacity-0 pointer-events-none',
                    )}
                    style={{
                        maxHeight: isExpanded ? 'min(calc(100svh - 88px), 780px)' : '0',
                    }}
                    aria-hidden={!isExpanded}
                    inert={!isExpanded ? true : undefined}
                >
                    {/* Simple links (no dropdown) */}
                    {simpleItems.length > 0 && (
                        <div className="flex flex-col gap-1 mb-1">
                            {simpleItems.map((item, idx) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{
                                        opacity: isExpanded ? 1 : 0,
                                        y: isExpanded ? 0 : 16,
                                    }}
                                    transition={{
                                        duration: 0.25,
                                        delay: isExpanded ? idx * 0.04 : 0,
                                    }}
                                    key={item.id || `${item.label}-simple-${idx}`}
                                >
                                    {item.labelLink ? (
                                        <CMSLink
                                            {...item.labelLink}
                                            appearance="inline"
                                            className={cn(
                                                'w-full rounded-xl px-4 py-3 text-sm font-medium text-left !no-underline transition-colors block',
                                                pathname === item.labelLink.url
                                                    ? 'text-foreground bg-foreground/8'
                                                    : 'text-muted-foreground hover:text-foreground hover:bg-foreground/5',
                                            )}
                                            onClick={closeMenu}
                                        >
                                            {item.label}
                                        </CMSLink>
                                    ) : (
                                        <span className="w-full rounded-xl px-4 py-3 text-sm font-medium text-left text-foreground/75 block">
                                            {item.label}
                                        </span>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* Navigation cards */}
                    {cardItems.length > 0 && (
                        <div className="flex flex-col gap-medium md:[grid-template-columns:repeat(auto-fit,minmax(280px,1fr))] md:grid md:auto-rows-min">
                            {cardItems.map((item, idx) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{
                                        opacity: isExpanded ? 1 : 0,
                                        y: isExpanded ? 0 : 16,
                                    }}
                                    transition={{
                                        duration: 0.25,
                                        delay: isExpanded ? (simpleItems.length + idx) * 0.04 : 0,
                                    }}
                                    key={item.id || `${item.label}-${idx}`}
                                >
                                    <NavCard item={item} variant="mobile" onClose={closeMenu} />
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* CTA buttons + bottom controls */}
                    {ctaButtons && ctaButtons.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{
                                opacity: isExpanded ? 1 : 0,
                                y: isExpanded ? 0 : 16,
                            }}
                            transition={{
                                duration: 0.25,
                                delay: isExpanded
                                    ? (simpleItems.length + cardItems.length) * 0.04
                                    : 0,
                            }}
                            className="flex flex-col gap-small pt-[var(--space-xs)]"
                        >
                            {ctaButtons.map((btn, idx) => (
                                <div
                                    key={idx}
                                    className="[&>div]:w-full [&_a]:w-full"
                                    onClick={closeMenu}
                                >
                                    {btn}
                                </div>
                            ))}
                        </motion.div>
                    )}
                    {hasControls && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: isExpanded ? 1 : 0 }}
                            transition={{
                                duration: 0.2,
                                delay: isExpanded
                                    ? (simpleItems.length + cardItems.length) * 0.04 + 0.05
                                    : 0,
                            }}
                            className="flex items-center justify-center gap-small pt-[var(--space-sm)] mt-[var(--space-xs)] border-t border-border/40"
                        >
                            {languageSwitcher}
                        </motion.div>
                    )}
                </div>
            </motion.nav>
        </div>
    )
}
