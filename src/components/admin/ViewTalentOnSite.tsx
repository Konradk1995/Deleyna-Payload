'use client'

import React from 'react'
import { useDocumentInfo, useFormFields, useLocale } from '@payloadcms/ui'

const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000')

const linkStyle: React.CSSProperties = {
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
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'background-color 150ms ease',
    whiteSpace: 'nowrap',
}

const labels = {
    de: 'Zur Seite',
    en: 'View on site',
}

export default function ViewTalentOnSite() {
    const { collectionSlug } = useDocumentInfo()
    const slug = useFormFields(([fields]) => (fields?.slug?.value as string) ?? null)
    const locale = useLocale()

    if (collectionSlug !== 'talents' || !slug) return null

    const localeCodeRaw = typeof locale === 'object' && locale?.code ? locale.code : (locale || 'de')
    const localeCode = localeCodeRaw === 'en' ? 'en' : 'de'
    const talentPath = localeCode === 'de' ? 'talente' : 'talents'
    const href = `${baseUrl}/${localeCode}/${talentPath}/${slug}`
    const label = labels[localeCode]

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--theme-elevation-100)'
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--theme-elevation-50)'
            }}
        >
            <span>{label}</span>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
        </a>
    )
}
