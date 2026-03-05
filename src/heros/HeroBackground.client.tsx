'use client'

import React from 'react'
import { motion, useReducedMotion } from 'motion/react'

export const HeroBackground: React.FC = () => {
    const shouldReduceMotion = useReducedMotion()

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {/* Animated background blobs */}
            <motion.div
                animate={
                    shouldReduceMotion
                        ? { x: 0, y: 0, scale: 1 }
                        : { x: [0, 30, -20, 0], y: [0, -20, 20, 0], scale: [1, 1.06, 0.96, 1] }
                }
                transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-1/4 -left-24 size-80 rounded-full bg-copper/28 blur-3xl md:size-128 md:blur-3xl"
            />
            <motion.div
                animate={
                    shouldReduceMotion
                        ? { x: 0, y: 0, scale: 1 }
                        : { x: [0, -20, 30, 0], y: [0, 30, -10, 0], scale: [1, 0.95, 1.06, 1] }
                }
                transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                className="absolute top-1/3 -right-20 w-64 h-64 rounded-full bg-accent/25 blur-3xl md:w-96 md:h-96 md:blur-3xl"
            />
            <motion.div
                animate={
                    shouldReduceMotion ? { x: 0, y: 0 } : { x: [0, 20, -30, 0], y: [0, -10, 30, 0] }
                }
                transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
                className="absolute bottom-1/4 left-1/3 hidden size-80 rounded-full bg-secondary/16 blur-3xl md:block"
            />

            {/* Noise texture overlay */}
            <div
                className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
                style={{
                    backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
                }}
            />

            {/* Radial fade — softer so blobs stay visible longer */}
            <div className="absolute inset-0 bg-hero-fade" />
        </div>
    )
}
