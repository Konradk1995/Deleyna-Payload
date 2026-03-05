'use client'

import React from 'react'
import { useLocale } from '@payloadcms/ui'

interface ApplicationStatusCellProps {
    rowData: {
        category?: string
        applicationStatus?: string
    }
}

const statusConfig = {
    pending: {
        label: { de: 'Ausstehend', en: 'Pending' },
        bg: 'var(--theme-warning-100)',
        color: 'var(--theme-warning-700)',
        dot: 'var(--theme-warning-500)',
    },
    approved: {
        label: { de: 'Genehmigt', en: 'Approved' },
        bg: 'var(--theme-success-100)',
        color: 'var(--theme-success-700)',
        dot: 'var(--theme-success-500)',
    },
    rejected: {
        label: { de: 'Abgelehnt', en: 'Rejected' },
        bg: 'var(--theme-error-100)',
        color: 'var(--theme-error-700)',
        dot: 'var(--theme-error-500)',
    },
} as const

export const ApplicationStatusCell: React.FC<ApplicationStatusCellProps> = ({ rowData }) => {
    const localeObj = useLocale()
    const localeCode = (typeof localeObj === 'string' ? localeObj : localeObj?.code) || 'de'
    const lang = localeCode === 'en' ? 'en' : 'de'

    if (rowData?.category !== 'become_talent') return null

    const status = (rowData?.applicationStatus as keyof typeof statusConfig) || 'pending'
    const config = statusConfig[status] ?? statusConfig.pending

    return (
        <span
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '3px 10px',
                borderRadius: '100px',
                fontSize: '12px',
                fontWeight: 500,
                backgroundColor: config.bg,
                color: config.color,
            }}
        >
            <span
                style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: config.dot,
                }}
            />
            {config.label[lang]}
        </span>
    )
}
