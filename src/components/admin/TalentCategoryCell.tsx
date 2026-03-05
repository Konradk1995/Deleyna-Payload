'use client'

import React from 'react'

interface TalentCategoryCellProps {
    cellData: string
}

const categories: Record<string, { label: string; bg: string; color: string }> = {
    dancer: { label: 'Dancer', bg: '#DBEAFE', color: '#1D4ED8' },
    model: { label: 'Model', bg: '#EDE9FE', color: '#6D28D9' },
    both: { label: 'Dancer & Model', bg: '#D1FAE5', color: '#059669' },
}

export const TalentCategoryCell: React.FC<TalentCategoryCellProps> = ({ cellData }) => {
    const config = categories[cellData]

    if (!config) {
        return <span style={{ color: 'var(--theme-elevation-400)' }}>{cellData || '-'}</span>
    }

    return (
        <span
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '3px 10px',
                borderRadius: '100px',
                fontSize: '12px',
                fontWeight: 500,
                backgroundColor: config.bg,
                color: config.color,
                whiteSpace: 'nowrap',
            }}
        >
            {config.label}
        </span>
    )
}
