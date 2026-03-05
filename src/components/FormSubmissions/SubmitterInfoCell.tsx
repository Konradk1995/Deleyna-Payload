'use client'

import React from 'react'

interface SubmitterInfoCellProps {
    rowData: {
        submissionData?: {
            field: string
            value: string
        }[]
    }
}

export const SubmitterInfoCell: React.FC<SubmitterInfoCellProps> = ({ rowData }) => {
    const data = rowData.submissionData || []

    const get = (keys: string[]) =>
        data.find((item) => keys.some((k) => item.field.toLowerCase().includes(k)))?.value || ''

    const firstName = get(['firstname', 'vorname', 'first_name', 'first-name'])
    const lastName = get(['lastname', 'nachname', 'last_name', 'last-name', 'surname'])
    const name =
        `${firstName} ${lastName}`.trim() || get(['name', 'fullname', 'full_name', 'full-name'])
    const email = get(['email', 'e-mail', 'mail'])

    if (!name && !email) {
        return <span style={{ color: 'var(--theme-elevation-400)', fontStyle: 'italic' }}>-</span>
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', lineHeight: 1.3 }}>
            {name && (
                <span style={{ fontWeight: 500, color: 'var(--theme-elevation-800)' }}>{name}</span>
            )}
            {email && (
                <span style={{ fontSize: '12px', color: 'var(--theme-elevation-500)' }}>
                    {email}
                </span>
            )}
        </div>
    )
}
