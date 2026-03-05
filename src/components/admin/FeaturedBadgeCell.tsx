'use client'

import React from 'react'

interface FeaturedBadgeCellProps {
    cellData: boolean
}

export const FeaturedBadgeCell: React.FC<FeaturedBadgeCellProps> = ({ cellData }) => {
    if (!cellData) return null

    return (
        <span
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '2px 8px',
                borderRadius: '100px',
                fontSize: '11px',
                fontWeight: 600,
                backgroundColor: '#FEF3C7',
                color: '#B45309',
            }}
        >
            ★ Featured
        </span>
    )
}
