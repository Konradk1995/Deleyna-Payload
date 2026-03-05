import { cn } from '@/utilities/ui'
import React from 'react'

interface ExperienceItem {
    title: string
    year?: string | null
}

interface ExperienceListProps {
    title: string
    items: ExperienceItem[]
    className?: string
}

/**
 * ExperienceList - Liste von Erfahrungen/Referenzen
 */
export function ExperienceList({ title, items, className }: ExperienceListProps) {
    if (!items || items.length === 0) return null

    return (
        <div className={cn(className)}>
            <h3 className="font-subtext-semibold mb-3 uppercase tracking-wider text-muted-foreground">
                {title}
            </h3>
            <ul className="space-y-2">
                {items.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                        <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-copper" />
                        <span className="text-foreground">
                            {item.title}
                            {item.year && (
                                <span className="text-muted-foreground ml-2">({item.year})</span>
                            )}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    )
}
