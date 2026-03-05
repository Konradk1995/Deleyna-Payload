import React from 'react'
import { Menu, X } from 'lucide-react'
import { cn } from '@/utilities/ui'

interface HamburgerButtonProps {
    isOpen: boolean
    onToggle: () => void
}

export const HamburgerButton: React.FC<HamburgerButtonProps> = ({ isOpen, onToggle }) => {
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
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
        >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
    )
}
