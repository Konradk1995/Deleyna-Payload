'use client'

import { useEffect, useRef, useState } from 'react'

interface UseInViewOptions {
    threshold?: number
    rootMargin?: string
    /** Only trigger once (default: true) */
    triggerOnce?: boolean
}

/**
 * Lightweight IntersectionObserver hook for scroll-triggered animations.
 * Respects prefers-reduced-motion.
 */
export function useInView({
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = true,
}: UseInViewOptions = {}) {
    const ref = useRef<HTMLDivElement>(null)
    const [inView, setInView] = useState(false)

    useEffect(() => {
        // Respect reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setInView(true)
            return
        }

        const element = ref.current
        if (!element) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true)
                    if (triggerOnce) {
                        observer.unobserve(element)
                    }
                } else if (!triggerOnce) {
                    setInView(false)
                }
            },
            { threshold, rootMargin },
        )

        observer.observe(element)

        return () => observer.disconnect()
    }, [threshold, rootMargin, triggerOnce])

    return { ref, inView }
}
