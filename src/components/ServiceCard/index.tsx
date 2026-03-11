import { cn } from '@/utilities/ui'
import React from 'react'

interface ServiceCardProps {
    icon?: React.ReactNode
    title: string
    description: string
    className?: string
}

/**
 * ServiceCard – Karte für Services/Features.
 * Nutzt Card aus @/components/ui für einheitliches Look & Feel (BLOCK-STANDARDS).
 */
export function ServiceCard({ icon, title, description, className }: ServiceCardProps) {
    return (
        <div
            className={cn(
                'group h-full rounded-[var(--block-radius-xl)] glass-morphism hover:bg-foreground/[0.03] transition duration-500 border-border/40 hover:border-copper/30 hover:shadow-copper-glow padding-large',
                className,
            )}
        >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-chrome-mid/20 to-copper/20 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition duration-500 shadow-sm group-hover:shadow-copper-glow/50">
                {icon ? (
                    <div className="text-foreground [&>svg]:h-7 [&>svg]:w-7 transition-colors group-hover:text-copper">
                        {icon}
                    </div>
                ) : (
                    <div className="h-7 w-7 bg-foreground opacity-20 rounded-full" />
                )}
            </div>

            <h3 className="font-heading-5-bold mb-4 group-hover:chrome-text transition duration-300">
                {title}
            </h3>

            <p className="font-normal-text-regular text-muted-foreground leading-relaxed hyphens-auto text-balance">
                {description}
            </p>
        </div>
    )
}
