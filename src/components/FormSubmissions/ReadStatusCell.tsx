'use client'

import React, { useState } from 'react'
import { useLocale } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'

interface ReadStatusCellProps {
    cellData: boolean
    rowData: {
        id: string | number
    }
}

const i18n = {
    de: {
        read: 'Gelesen',
        new: 'Neu',
        markAsUnread: 'Als ungelesen markieren',
        markAsRead: 'Als gelesen markieren',
    },
    en: {
        read: 'Read',
        new: 'New',
        markAsUnread: 'Mark as unread',
        markAsRead: 'Mark as read',
    },
}

export const ReadStatusCell: React.FC<ReadStatusCellProps> = ({ cellData, rowData }) => {
    const [isRead, setIsRead] = useState(cellData === true)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const localeObj = useLocale()
    const localeCode = (typeof localeObj === 'string' ? localeObj : localeObj?.code) || 'de'
    const lang = localeCode === 'en' ? 'en' : 'de'

    const toggleStatus = async (e: React.MouseEvent) => {
        e.stopPropagation()
        if (isLoading) return

        setIsLoading(true)
        const newStatus = !isRead

        try {
            const res = await fetch(`/api/form-submissions/${rowData.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ read: newStatus }),
            })

            if (!res.ok) throw new Error('Update failed')

            setIsRead(newStatus)
            router.refresh()
        } catch (error) {
            console.error('Fehler beim Aktualisieren:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <button
            onClick={toggleStatus}
            type="button"
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '3px 10px',
                borderRadius: '100px',
                fontSize: '12px',
                fontWeight: 500,
                backgroundColor: isRead ? 'var(--theme-success-100)' : 'var(--theme-warning-100)',
                color: isRead ? 'var(--theme-success-700)' : 'var(--theme-warning-700)',
                border: 'none',
                cursor: 'pointer',
                opacity: isLoading ? 0.7 : 1,
                transition: 'all 0.2s ease',
            }}
            title={isRead ? i18n[lang].markAsUnread : i18n[lang].markAsRead}
        >
            <span
                style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: isRead ? 'var(--theme-success-500)' : 'var(--theme-warning-500)',
                }}
            />
            {isRead ? i18n[lang].read : i18n[lang].new}
        </button>
    )
}
