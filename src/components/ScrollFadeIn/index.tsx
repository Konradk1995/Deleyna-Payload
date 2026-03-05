'use client'

import React from 'react'
import { cn } from '@/utilities/ui'
import { useInView } from '@/hooks/useInView'

type Props = {
    children: React.ReactNode
    className?: string
    animation?:
        | 'fade-up'
        | 'fade-in'
        | 'scale'
        | 'slide-left'
        | 'slide-right'
        | 'fade-left'
        | 'fade-right'
    delay?: number
}

const animations = {
    'fade-up': { y: 32, x: 0, scale: 1 },
    'fade-in': { y: 0, x: 0, scale: 1 },
    scale: { y: 0, x: 0, scale: 0.95 },
    'slide-left': { y: 0, x: -32, scale: 1 },
    'slide-right': { y: 0, x: 32, scale: 1 },
    'fade-left': { y: 0, x: -32, scale: 1 },
    'fade-right': { y: 0, x: 32, scale: 1 },
}

/**
 * ScrollFadeIn – einheitliche Reveal-Animation für Sektionen/Blöcke.
 * Respektiert prefers-reduced-motion (Lighthouse, A11y).
 * Einmal nutzen statt eigene motion-Logik pro Block.
 */
export const ScrollFadeIn: React.FC<Props> = ({
    children,
    className,
    animation = 'fade-up',
    delay = 0,
}) => {
    const { ref, inView } = useInView({ threshold: 0.1, rootMargin: '0px', triggerOnce: true })
    const start = animations[animation]
    const transform = inView
        ? 'translate3d(0, 0, 0) scale(1)'
        : `translate3d(${start.x}px, ${start.y}px, 0) scale(${start.scale})`

    return (
        <div
            ref={ref}
            className={cn(className)}
            style={{
                opacity: inView ? 1 : 0,
                transform,
                transitionProperty: 'opacity, transform',
                transitionDuration: '700ms',
                transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
                transitionDelay: `${delay}ms`,
                willChange: inView ? undefined : 'opacity, transform',
            }}
        >
            {children}
        </div>
    )
}
