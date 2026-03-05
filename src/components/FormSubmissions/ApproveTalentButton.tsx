'use client'

import React, { useState, useCallback } from 'react'
import { useDocumentInfo, useLocale } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'

const i18n = {
    de: {
        confirm:
            'Talent aus dieser Bewerbung erstellen und direkt freigeben? Du kannst danach jederzeit weiter bearbeiten.',
        failed: 'Genehmigung fehlgeschlagen',
        unknownError: 'Unbekannter Fehler',
        creating: 'Wird erstellt...',
        cta: 'Talent erstellen & genehmigen',
    },
    en: {
        confirm:
            'Create a talent from this application and approve it right away? You can still edit it afterwards.',
        failed: 'Approval failed',
        unknownError: 'Unknown error',
        creating: 'Creating...',
        cta: 'Create & approve talent',
    },
} as const

export const ApproveTalentButton: React.FC = () => {
    const { id } = useDocumentInfo()
    const router = useRouter()
    const localeObj = useLocale()
    const localeCode = (typeof localeObj === 'string' ? localeObj : localeObj?.code) || 'de'
    const lang = localeCode === 'en' ? 'en' : 'de'
    const t = i18n[lang]
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleApprove = useCallback(async () => {
        if (!id || isLoading) return

        const confirmed = window.confirm(t.confirm)
        if (!confirmed) return

        setIsLoading(true)
        setError(null)

        try {
            const res = await fetch('/api/approve-talent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ submissionId: id }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || t.failed)
            }

            router.push(`/admin/collections/talents/${data.talentId}`)
        } catch (err) {
            setError(err instanceof Error ? err.message : t.unknownError)
        } finally {
            setIsLoading(false)
        }
    }, [id, isLoading, router, t.confirm, t.failed, t.unknownError])

    return (
        <div style={{ marginBottom: '16px' }}>
            <button
                type="button"
                onClick={handleApprove}
                disabled={isLoading}
                style={{
                    width: '100%',
                    padding: '10px 16px',
                    backgroundColor: 'var(--theme-success-500)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: isLoading ? 'wait' : 'pointer',
                    opacity: isLoading ? 0.7 : 1,
                    transition: 'opacity 0.2s ease',
                }}
            >
                {isLoading ? t.creating : t.cta}
            </button>
            {error && (
                <p
                    style={{
                        marginTop: '8px',
                        fontSize: '12px',
                        color: 'var(--theme-error-500)',
                    }}
                >
                    {error}
                </p>
            )}
        </div>
    )
}
