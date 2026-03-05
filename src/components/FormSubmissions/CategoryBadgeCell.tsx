'use client'

import React from 'react'
import { useLocale } from '@payloadcms/ui'

interface CategoryBadgeCellProps {
    rowData: {
        category?: string
    }
}

const categoryConfig: Record<
    string,
    { label: { de: string; en: string }; bg: string; color: string }
> = {
    contact: {
        label: { de: 'Kontakt', en: 'Contact' },
        bg: 'var(--theme-elevation-150)',
        color: 'var(--theme-elevation-700)',
    },
    talent_booking: {
        label: { de: 'Buchung', en: 'Booking' },
        bg: '#EDE9FE',
        color: '#6D28D9',
    },
    become_talent: {
        label: { de: 'Bewerbung', en: 'Application' },
        bg: '#DBEAFE',
        color: '#1D4ED8',
    },
    job_inquiry: {
        label: { de: 'Job-Anfrage', en: 'Job inquiry' },
        bg: '#FEF3C7',
        color: '#B45309',
    },
    other: {
        label: { de: 'Sonstiges', en: 'Other' },
        bg: 'var(--theme-elevation-100)',
        color: 'var(--theme-elevation-500)',
    },
}

export const CategoryBadgeCell: React.FC<CategoryBadgeCellProps> = ({ rowData }) => {
    const localeObj = useLocale()
    const localeCode = (typeof localeObj === 'string' ? localeObj : localeObj?.code) || 'de'
    const lang = localeCode === 'en' ? 'en' : 'de'
    const category = rowData?.category || ''
    const config = categoryConfig[category] || categoryConfig.other

    if (!category) {
        return <span style={{ color: 'var(--theme-elevation-400)', fontStyle: 'italic' }}>-</span>
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
            {config.label[lang]}
        </span>
    )
}
