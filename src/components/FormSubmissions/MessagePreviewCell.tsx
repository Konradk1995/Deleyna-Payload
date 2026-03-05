'use client'

import React from 'react'

interface MessagePreviewCellProps {
    rowData: {
        submissionData?: {
            field: string
            value: string
        }[]
    }
}

export const MessagePreviewCell: React.FC<MessagePreviewCellProps> = ({ rowData }) => {
    const submissionData = rowData.submissionData || []

    const messageField = submissionData.find((item) => {
        const field = item.field.toLowerCase()
        return (
            field.includes('message') ||
            field.includes('nachricht') ||
            field.includes('comment') ||
            field.includes('bemerkung') ||
            field.includes('text') ||
            field.includes('anfrage')
        )
    })

    const longTextField =
        !messageField &&
        submissionData.find(
            (item) => item.value && typeof item.value === 'string' && item.value.length > 50,
        )

    const displayItem = messageField || longTextField || submissionData[0]

    if (!displayItem || !displayItem.value) {
        return <span style={{ color: 'var(--theme-elevation-400)', fontStyle: 'italic' }}>-</span>
    }

    const text = String(displayItem.value)
    const truncated = text.length > 60 ? text.substring(0, 60) + '...' : text

    return (
        <span
            title={text}
            style={{
                display: 'block',
                maxWidth: '300px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                color: 'var(--theme-elevation-800)',
            }}
        >
            {truncated}
        </span>
    )
}
