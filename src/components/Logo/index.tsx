import { cn } from '@/utilities/ui'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import React from 'react'

interface LogoProps {
    href?: string | null
    className?: string
    imageClassName?: string
    size?: 'sm' | 'md' | 'lg' | 'hero'
    priority?: boolean
}

// Konsistente Größen nach dem Design System
const logoSizes = {
    sm: { width: 60, height: 24 }, // Header/Footer
    md: { width: 80, height: 32 }, // Standard
    lg: { width: 120, height: 48 }, // Featured
    hero: { width: 320, height: 128 }, // Hero Section
}

/**
 * Logo - Deleyna Logo Komponente
 * Die SVG-Farben werden natürlich beibehalten (keine Inversion)
 */
export function Logo({
    href = '/',
    className,
    imageClassName,
    size = 'sm',
    priority = false,
}: LogoProps) {
    const { width, height } = logoSizes[size]

    const logo = (
        <Image
            src="/logo.svg"
            alt="Deleyna Talent Agency"
            width={width}
            height={height}
            className={cn('h-auto w-auto', imageClassName)}
            priority={priority}
        />
    )

    if (href) {
        return (
            <Link href={href as never} className={cn('inline-block', className)}>
                {logo}
            </Link>
        )
    }

    return <div className={cn('inline-block flex-shrink-0', className)}>{logo}</div>
}
