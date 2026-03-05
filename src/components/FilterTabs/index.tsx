'use client'

import { cn } from '@/utilities/ui'
import React from 'react'
import { Button } from '@/components/ui/button'

interface FilterOption {
    label: string
    value: string
}

interface FilterTabsProps {
    options: FilterOption[]
    activeValue: string
    onChange: (value: string) => void
    className?: string
}

/**
 * FilterTabs - Horizontale Filter-Buttons
 *
 * Verwendet für:
 * - Talent-Liste (All, Dancers, Models)
 * - Blog-Kategorien
 */
export function FilterTabs({ options, activeValue, onChange, className }: FilterTabsProps) {
    return (
        <div className={cn('flex flex-wrap gap-2', className)} role="tablist">
            {options.map((option) => (
                <Button
                    key={option.value}
                    type="button"
                    role="tab"
                    aria-selected={activeValue === option.value}
                    onClick={() => onChange(option.value)}
                    variant={activeValue === option.value ? 'accent' : 'outline'}
                    size="sm"
                    className={cn(
                        'rounded-full',
                        activeValue !== option.value &&
                            'glass-morphism text-muted-foreground hover:bg-foreground/5 hover:text-foreground',
                    )}
                >
                    {option.label}
                </Button>
            ))}
        </div>
    )
}
