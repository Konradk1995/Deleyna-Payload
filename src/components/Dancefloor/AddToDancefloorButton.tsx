'use client'

import React from 'react'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useSelection } from '@/providers/Dancefloor'
import type { SelectionTalent } from '@/providers/Dancefloor'
import { cn } from '@/utilities/ui'

interface AddToSelectionButtonProps {
    talent: SelectionTalent
    variant?: 'icon' | 'pill'
    tone?: 'surface' | 'onMedia'
    className?: string
}

export function AddToSelectionButton({
    talent,
    variant = 'icon',
    tone = 'surface',
    className,
}: AddToSelectionButtonProps) {
    const t = useTranslations('selection')
    const { addTalent, removeTalent, isSelected } = useSelection()
    const selected = isSelected(talent.id)

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (selected) {
            removeTalent(talent.id)
        } else {
            addTalent(talent)
        }
    }

    const handlePointerDown = (e: React.PointerEvent) => {
        e.preventDefault()
        e.stopPropagation()
    }

    if (variant === 'pill') {
        const pillBaseClass =
            tone === 'onMedia'
                ? 'border-on-media/35 bg-[rgb(var(--media-overlay))/0.28] text-on-media hover:border-copper/60 hover:bg-[rgb(var(--media-overlay))/0.42]'
                : 'border-border/70 bg-card/90 hover:border-copper/60 hover:bg-copper/15'

        return (
            <button
                type="button"
                onClick={handleClick}
                onPointerDown={handlePointerDown}
                aria-label={selected ? t('ariaRemove') : t('ariaAdd')}
                className={cn(
                    'font-display-tight inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold tracking-tight transition duration-200',
                    'backdrop-blur-sm',
                    pillBaseClass,
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2',
                    selected && 'border-copper bg-copper/20 text-copper',
                    className,
                )}
            >
                {selected ? (
                    <>
                        <BookmarkCheck className="h-4 w-4" />
                        {t('onSelection')}
                    </>
                ) : (
                    <>
                        <Bookmark className="h-4 w-4" />
                        {t('addToSelection')}
                    </>
                )}
            </button>
        )
    }

    return (
        <button
            type="button"
            onClick={handleClick}
            onPointerDown={handlePointerDown}
            aria-label={selected ? t('ariaRemove') : t('ariaAdd')}
            className={cn(
                'absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full',
                tone === 'onMedia'
                    ? 'border border-white/30 bg-[rgb(var(--media-overlay))/0.56] text-on-media shadow-md'
                    : 'border border-border/80 bg-card/90 shadow-md',
                'backdrop-blur-sm transition duration-200 hover:scale-110',
                tone === 'onMedia'
                    ? 'hover:border-copper/60 hover:bg-[rgb(var(--media-overlay))/0.72]'
                    : 'hover:border-copper/60 hover:bg-copper/20',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2',
                selected &&
                    (tone === 'onMedia'
                        ? 'border-copper bg-[rgb(var(--media-overlay))/0.82] text-copper'
                        : 'border-copper bg-copper/25 text-copper'),
                className,
            )}
        >
            {selected ? (
                <BookmarkCheck className="h-5 w-5" />
            ) : (
                <Bookmark className="h-5 w-5" />
            )}
        </button>
    )
}

/** @deprecated Use AddToSelectionButton */
export const AddToDancefloorButton = AddToSelectionButton
