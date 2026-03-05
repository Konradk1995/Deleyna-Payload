'use client'
import React, { useState, useId } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/utilities/ui'

type FAQAccordionProps = {
    items: Array<{
        question?: string | null
        answerElement: React.ReactNode
    }>
    layout?: 'accordion' | 'list' | 'twoColumn' | null
}

export function FAQAccordion({ items, layout = 'accordion' }: FAQAccordionProps) {
    const [openIndices, setOpenIndices] = useState<Set<number>>(
        () => new Set(layout === 'list' ? items.map((_, i) => i) : []),
    )
    const baseId = useId()

    const toggle = (index: number) => {
        setOpenIndices((prev) => {
            const next = new Set(prev)
            if (next.has(index)) {
                next.delete(index)
            } else {
                next.add(index)
            }
            return next
        })
    }

    const isTwoColumn = layout === 'twoColumn'

    return (
        <div
            className={cn(
                'space-y-3 md:space-y-4',
                isTwoColumn && 'md:grid md:grid-cols-2 md:gap-5 md:space-y-0',
            )}
        >
            {items.map((item, index) => {
                if (!item.question) return null
                const isOpen = openIndices.has(index)
                const panelId = `${baseId}-panel-${index}`
                const triggerId = `${baseId}-trigger-${index}`

                return (
                    <div
                        key={index}
                        className="overflow-hidden rounded-2xl border border-border/60 bg-card/65 backdrop-blur-sm"
                    >
                        <button
                            id={triggerId}
                            type="button"
                            onClick={() => toggle(index)}
                            aria-expanded={isOpen}
                            aria-controls={panelId}
                            className="flex w-full cursor-pointer items-center justify-between gap-4 padding-medium text-left font-medium text-foreground transition-colors hover:bg-muted/60"
                        >
                            <span className="pr-2 leading-snug">{item.question}</span>
                            <ChevronDown
                                className={cn(
                                    'h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300',
                                    isOpen && 'rotate-180',
                                )}
                                aria-hidden="true"
                            />
                        </button>
                        <div
                            id={panelId}
                            role="region"
                            aria-labelledby={triggerId}
                            className={cn(
                                'grid transition-[grid-template-rows] duration-300 ease-out',
                                isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                            )}
                        >
                            <div className="overflow-hidden">
                                <div className="padding-medium pt-0 text-body-regular text-muted-foreground">
                                    {item.answerElement}
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
