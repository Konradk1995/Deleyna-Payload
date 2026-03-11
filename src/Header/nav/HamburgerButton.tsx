import React from 'react'
import { Menu, X } from 'lucide-react'
import { useLocale } from 'next-intl'
import { cn } from '@/utilities/ui'

const labels = {
    de: { open: 'Menü öffnen', close: 'Menü schließen' },
    en: { open: 'Open menu', close: 'Close menu' },
} as const

interface HamburgerButtonProps {
    isOpen: boolean
    onToggle: () => void
}

export const HamburgerButton: React.FC<HamburgerButtonProps> = ({ isOpen, onToggle }) => {
    const locale = useLocale() as 'de' | 'en'
    const l = labels[locale] ?? labels.de

    return (
        <button
            type="button"
            className={cn(
                'relative flex h-11 w-11 items-center justify-center rounded-full text-foreground/80 transition-colors duration-200',
                'hover:bg-foreground/8 hover:text-foreground',
                'active:scale-95',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper/40',
            )}
            onClick={onToggle}
            aria-label={isOpen ? l.close : l.open}
        >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
    )
}
