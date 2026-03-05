'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'

import { cn } from '@/utilities/ui'

type TocItem = { id: string; label: string }

type Props = {
    tocLabel: string
    items: TocItem[]
    className?: string
}

export const TocNav: React.FC<Props> = ({ tocLabel, items, className }) => {
    const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null)
    const observerRef = useRef<IntersectionObserver | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault()
        const el = document.getElementById(id)
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }, [])

    useEffect(() => {
        if (items.length === 0) return

        observerRef.current = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id)
                        break
                    }
                }
            },
            {
                root: null,
                rootMargin: '-20% 0px -70% 0px',
                threshold: 0,
            },
        )

        items.forEach((item) => {
            const el = document.getElementById(item.id)
            if (el) observerRef.current?.observe(el)
        })

        return () => {
            observerRef.current?.disconnect()
        }
    }, [items])

    if (items.length === 0) return null

    return (
        <div ref={containerRef} className={cn('lg:sticky lg:top-24', className)}>
            <p className="font-subtext-semibold text-muted-foreground mb-4">{tocLabel}</p>
            <nav aria-label={tocLabel}>
                <ol className="list-none space-y-1 pl-0">
                    {items.map((item, index) => (
                        <li key={item.id}>
                            <a
                                href={`#${item.id}`}
                                onClick={(e) => handleClick(e, item.id)}
                                className={cn(
                                    'block rounded-md py-2 px-3 text-sm transition-colors',
                                    activeId === item.id
                                        ? 'bg-muted font-medium text-foreground'
                                        : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                                )}
                            >
                                <span className="text-muted-foreground/80 mr-2">{index + 1}.</span>
                                {item.label}
                            </a>
                        </li>
                    ))}
                </ol>
            </nav>
        </div>
    )
}
