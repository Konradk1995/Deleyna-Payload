'use client'

import React from 'react'
import { ArrowDown } from 'lucide-react'
import { motion } from 'motion/react'
import { cn } from '@/utilities/ui'

interface ScrollIndicatorProps {
    /** Ziel-Anker für smooth scroll (z. B. #main-content) */
    targetId?: string
    className?: string
}

/**
 * Scroll-Indicator – Hinweis „Nach unten scrollen“ unter dem Hero.
 * BLOCK-STANDARDS: Design-Tokens, aria-label für A11y.
 */
export function ScrollIndicator({ targetId = 'main-content', className }: ScrollIndicatorProps) {
    const handleClick = () => {
        const el = document.getElementById(targetId)
        el?.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <motion.button
            type="button"
            onClick={handleClick}
            aria-label="Zum Inhalt scrollen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className={cn(
                'absolute bottom-10 left-1/2 z-10 -translate-x-1/2 cursor-pointer focus-visible:outline-none',
                className,
            )}
        >
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                className="flex flex-col items-center gap-2"
            >
                <span className="text-xs text-muted-foreground/60 tracking-widest uppercase">
                    Scroll
                </span>
                <ArrowDown className="text-muted-foreground/40" size={18} aria-hidden />
            </motion.div>
        </motion.button>
    )
}
