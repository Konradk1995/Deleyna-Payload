'use client'

import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'

import { useInView } from '@/hooks/useInView'
import { cn } from '@/utilities/ui'

/* ------------------------------------------------------------------ */
/*  Animated circle – fills when in view                                */
/* ------------------------------------------------------------------ */

export const AnimatedCircle: React.FC<{
    number: string
    size?: 'sm' | 'md'
}> = ({ number, size = 'md' }) => {
    const { ref, inView: isInView } = useInView({ threshold: 0.5, triggerOnce: false })

    const sizeClass =
        size === 'sm' ? 'h-10 w-10 text-sm md:h-12 md:w-12 md:text-base' : 'h-12 w-12 text-lg'

    return (
        <div
            ref={ref}
            className={cn(
                'relative z-10 flex flex-shrink-0 items-center justify-center rounded-full font-bold transition-[border-color,background-color,color,transform] duration-500 ease-out',
                sizeClass,
                isInView
                    ? 'border-2 border-primary bg-primary text-primary-foreground scale-105'
                    : 'border-2 border-primary bg-background text-primary scale-100',
            )}
            aria-hidden="true"
        >
            {number}
            {/* Single pulse ring on activation */}
            <span
                className={cn(
                    'absolute inset-0 rounded-full border-2 border-primary transition-[transform,opacity] duration-700 ease-out',
                    isInView ? 'scale-150 opacity-0' : 'scale-100 opacity-0',
                )}
                aria-hidden="true"
            />
        </div>
    )
}

/* ------------------------------------------------------------------ */
/*  Scroll progress line (mobile vertical timeline)                     */
/* ------------------------------------------------------------------ */

export const ScrollProgressLine: React.FC<{
    children: React.ReactNode
}> = ({ children }) => {
    const containerRef = useRef<HTMLDivElement>(null)

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start 0.7', 'end 0.5'],
    })

    const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1])

    return (
        <div ref={containerRef} className="relative lg:hidden">
            {/* Background line (faded) */}
            <div
                className="absolute bottom-0 left-[19px] top-0 w-0.5 bg-border/40 md:left-[23px]"
                aria-hidden="true"
            />
            {/* Progress line (fills on scroll) */}
            <motion.div
                className="absolute left-[19px] top-0 w-0.5 origin-top bg-primary md:left-[23px]"
                style={{ scaleY, height: '100%' }}
                aria-hidden="true"
            />
            {children}
        </div>
    )
}
