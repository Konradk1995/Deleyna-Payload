'use client'

import React from 'react'
import { ArrowDown } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { cn } from '@/utilities/ui'

interface ScrollIndicatorProps {
    /** Ziel-Anker für smooth scroll (z. B. #main-content) */
    targetId?: string
    className?: string
    locale?: string
}

/**
 * Scroll-Indicator – Hinweis nach unten scrollen unter dem Hero.
 * Respects prefers-reduced-motion, locale-aware aria-label.
 */
export function ScrollIndicator({ targetId = 'main-content', className, locale }: ScrollIndicatorProps) {
    const shouldReduceMotion = useReducedMotion()

    const handleClick = () => {
        const el = document.getElementById(targetId)
        el?.scrollIntoView({ behavior: shouldReduceMotion ? 'auto' : 'smooth' })
    }

    return (
        <motion.button
            type="button"
            onClick={handleClick}
            aria-label={locale === 'en' ? 'Scroll to content' : 'Zum Inhalt scrollen'}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={shouldReduceMotion ? { duration: 0 } : { delay: 2 }}
            className={cn(
                'absolute bottom-10 left-1/2 z-10 -translate-x-1/2 cursor-pointer rounded-full p-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                className,
            )}
        >
            <motion.div
                animate={shouldReduceMotion ? {} : { y: [0, 10, 0] }}
                transition={shouldReduceMotion ? { duration: 0 } : { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                className="flex flex-col items-center gap-2"
            >
                <span className="text-xs text-muted-foreground/60 tracking-widest uppercase">
                    Scroll
                </span>
                <ArrowDown className="text-muted-foreground/40" size={18} aria-hidden="true" />
            </motion.div>
        </motion.button>
    )
}
