'use client'

import React, { useState } from 'react'
import { useDocumentInfo, useLocale } from '@payloadcms/ui'

const baseUrl =
    process.env.NEXT_PUBLIC_SERVER_URL ||
    (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000')

const buttonStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    fontSize: '13px',
    fontWeight: 500,
    lineHeight: '20px',
    borderRadius: '4px',
    border: '1px solid var(--theme-elevation-300)',
    backgroundColor: 'var(--theme-elevation-50)',
    color: 'var(--theme-elevation-800)',
    cursor: 'pointer',
    transition: 'background-color 150ms ease',
    whiteSpace: 'nowrap',
}

const labels = {
    de: { download: 'Sedcard herunterladen (PDF)', generating: 'Wird erstellt…' },
    en: { download: 'Download Sedcard (PDF)', generating: 'Generating…' },
}

export function SedcardDownloadButton() {
    const { id, collectionSlug } = useDocumentInfo()
    const locale = useLocale()
    const [loading, setLoading] = useState(false)

    if (collectionSlug !== 'talents' || !id) return null

    const localeCode = typeof locale === 'object' && locale?.code ? locale.code : locale || 'de'
    const t = labels[localeCode === 'en' ? 'en' : 'de']

    const handleDownload = async () => {
        setLoading(true)
        try {
            const res = await fetch(
                `${baseUrl}/api/talents/${encodeURIComponent(String(id))}/sedcard?locale=${encodeURIComponent(String(localeCode))}`,
            )
            if (!res.ok) throw new Error('Download failed')

            const blob = await res.blob()
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `Sedcard_${id}.pdf`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
        } catch (err) {
            console.error('Sedcard download error:', err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            type="button"
            onClick={handleDownload}
            disabled={loading}
            style={{
                ...buttonStyle,
                opacity: loading ? 0.6 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = 'var(--theme-elevation-100)'
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--theme-elevation-50)'
            }}
        >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>{loading ? t.generating : t.download}</span>
        </button>
    )
}
