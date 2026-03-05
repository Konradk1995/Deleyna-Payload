'use client'

import React, { useEffect, useState } from 'react'
import { useLocale } from '@payloadcms/ui'
import Link from 'next/link'

const i18n = {
    de: {
        unread: (n: number) => `${n} ungelesene Einsendung${n > 1 ? 'en' : ''}`,
    },
    en: {
        unread: (n: number) => `${n} unread submission${n > 1 ? 's' : ''}`,
    },
}

export default function FormSubmissionBanner() {
    const [count, setCount] = useState(0)
    const localeObj = useLocale()
    const localeCode = (typeof localeObj === 'string' ? localeObj : localeObj?.code) || 'de'
    const lang = localeCode === 'en' ? 'en' : 'de'

    useEffect(() => {
        const fetchCount = async () => {
            try {
                const response = await fetch('/api/globals/notifications')
                if (response.ok) {
                    const data = await response.json()
                    const fieldName =
                        lang === 'en' ? 'unreadFormSubmissionsEn' : 'unreadFormSubmissionsDe'
                    setCount(data[fieldName] ?? 0)
                }
            } catch {
                /* ignore */
            }
        }
        fetchCount()
        const interval = setInterval(fetchCount, 30000)
        const onFocus = () => fetchCount()
        window.addEventListener('focus', onFocus)
        return () => {
            clearInterval(interval)
            window.removeEventListener('focus', onFocus)
        }
    }, [lang])

    if (count === 0) return null

    return (
        <Link
            href={`/admin/collections/form-submissions`}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                padding: '10px 24px',
                fontSize: '13px',
                fontWeight: 500,
                textDecoration: 'none',
                color: 'var(--theme-text)',
                backgroundColor: 'var(--theme-elevation-50)',
                borderBottom: '1px solid var(--theme-elevation-150)',
            }}
        >
            <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ opacity: 0.6 }}
            >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
            </svg>
            <span>
                <strong>{count}</strong> {i18n[lang].unread(count).replace(`${count} `, '')}
            </span>
            <span style={{ opacity: 0.5 }}>&rarr;</span>
        </Link>
    )
}
