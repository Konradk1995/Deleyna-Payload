'use client'

import React from 'react'

export const HeroBackground: React.FC = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
            {/* Animated background blobs — CSS-only for GPU efficiency */}
            <div
                className="absolute top-1/4 -left-24 size-48 rounded-full bg-copper/28 blur-2xl md:size-128 md:blur-3xl motion-safe:animate-[blob-1_13s_ease-in-out_infinite] motion-reduce:animate-none"
            />
            <div
                className="absolute top-1/3 -right-20 size-40 rounded-full bg-accent/25 blur-2xl md:w-96 md:h-96 md:blur-3xl motion-safe:animate-[blob-2_15s_ease-in-out_2s_infinite] motion-reduce:animate-none"
            />
            <div
                className="absolute bottom-1/4 left-1/3 hidden size-80 rounded-full bg-secondary/16 blur-3xl md:block motion-safe:animate-[blob-3_18s_ease-in-out_4s_infinite] motion-reduce:animate-none"
            />

            {/* Noise texture overlay */}
            <div
                className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
                style={{
                    backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
                }}
            />

            {/* Radial fade — softer so blobs stay visible longer */}
            <div className="absolute inset-0 bg-hero-fade" />
        </div>
    )
}
