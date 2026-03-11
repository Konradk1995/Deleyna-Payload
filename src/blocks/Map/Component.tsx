import React from 'react'
import { cn } from '@/utilities/ui'

export type MapBlockProps = {
    location: string
    height?: 'small' | 'medium' | 'large'
    zoom?: number
    title?: string | null
    className?: string
}

export const MapBlock: React.FC<MapBlockProps> = ({
    location,
    height = 'medium',
    zoom = 14,
    title,
    className,
}) => {
    if (!location) return null

    // Encode location for Google Maps iframe
    const encodedLocation = encodeURIComponent(location)
    const mapUrl = `https://maps.google.com/maps?q=${encodedLocation}&z=${zoom}&output=embed`

    const heightClass = {
        small: 'h-80',
        medium: 'h-96',
        large: 'h-128',
    }[height]

    return (
        <section className={cn('section-padding-lg section-atmosphere', className)}>
            <div className="container">
                {title && (
                    <h3 className="mb-4 font-display-tight font-heading-4-bold text-foreground chrome-text hyphens-auto [overflow-wrap:anywhere] pb-1">
                        {title}
                    </h3>
                )}
                <div
                    className={cn(
                        'w-full overflow-hidden rounded-[var(--block-radius)] border border-border bg-muted shadow-sm',
                        heightClass,
                    )}
                >
                    <iframe
                        src={mapUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen={false}
                        loading="lazy"
                        title={`Map showing ${location}`}
                        referrerPolicy="no-referrer-when-downgrade"
                        className="w-full h-full grayscale-[25%] contrast-125 hover:grayscale-0 transition duration-500"
                    />
                </div>
            </div>
        </section>
    )
}
