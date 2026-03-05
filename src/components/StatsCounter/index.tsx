'use client'

import { cn } from '@/utilities/ui'
import React, { useEffect, useRef, useState } from 'react'

interface StatsCounterProps {
    value: number
    suffix?: string
    label: string
    className?: string
    duration?: number
}

/**
 * StatsCounter - Animierte Statistik-Zahl
 *
 * Verwendet für:
 * - Stats Section (150+ Talents, 40+ Years, etc.)
 */
export function StatsCounter({
    value,
    suffix = '',
    label,
    className,
    duration = 2000,
}: StatsCounterProps) {
    const [count, setCount] = useState(0)
    const [isVisible, setIsVisible] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                    observer.disconnect()
                }
            },
            { threshold: 0.1 },
        )

        if (ref.current) {
            observer.observe(ref.current)
        }

        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        if (!isVisible) return

        const startTime = Date.now()
        const endTime = startTime + duration

        const tick = () => {
            const now = Date.now()
            const progress = Math.min((now - startTime) / duration, 1)
            const easeOutQuart = 1 - Math.pow(1 - progress, 4)

            setCount(Math.floor(easeOutQuart * value))

            if (now < endTime) {
                requestAnimationFrame(tick)
            } else {
                setCount(value)
            }
        }

        requestAnimationFrame(tick)
    }, [isVisible, value, duration])

    return (
        <div
            ref={ref}
            className={cn(
                'surface-pill relative text-center transition duration-500 hover:-translate-y-1 hover:bg-foreground/[0.03] group',
                'padding-large',
                className,
            )}
        >
            {/* Ambient Glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-copper/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="relative z-10">
                <div className="font-heading-3-bold chrome-text md:font-heading-2-bold mb-2 leading-none">
                    {count}
                    {suffix && <span className="chrome-text ml-0.5">{suffix}</span>}
                </div>
                <div className="font-subtext-semibold hyphens-auto break-words [overflow-wrap:anywhere] px-1 text-[0.68rem] leading-snug text-muted-foreground tracking-[0.08em] sm:text-[0.75rem] sm:tracking-[0.12em]">
                    {label}
                </div>
            </div>
        </div>
    )
}

/**
 * StatsGrid - Grid für mehrere Stats
 */
interface StatsGridProps {
    stats: Array<{
        value: number
        suffix?: string
        label: string
    }>
    className?: string
}

export function StatsGrid({ stats, className }: StatsGridProps) {
    return (
        <div
            className={cn(
                'grid grid-cols-2 block-grid-gap',
                className,
            )}
        >
            {stats.map((stat, index) => (
                <StatsCounter
                    key={index}
                    value={stat.value}
                    suffix={stat.suffix}
                    label={stat.label}
                />
            ))}
        </div>
    )
}
