import React from 'react'
import { cn } from '@/utilities/ui'

interface QuickStatsProps {
    items: { label: string; value: string | null | undefined }[]
    className?: string
}

export function QuickStats({ items, className }: QuickStatsProps) {
    const valid = items.filter((i) => i.value)
    if (valid.length === 0) return null

    return (
        <div className={cn('flex flex-wrap gap-2', className)}>
            {valid.map((item, i) => (
                <span
                    key={i}
                    className="surface-pill inline-flex items-center gap-1.5 px-3 py-1.5 text-sm"
                >
                    <span className="font-subtext-semibold text-[10px] uppercase tracking-wider text-muted-foreground">
                        {item.label}
                    </span>
                    <span className="font-medium text-foreground">{item.value}</span>
                </span>
            ))}
        </div>
    )
}
