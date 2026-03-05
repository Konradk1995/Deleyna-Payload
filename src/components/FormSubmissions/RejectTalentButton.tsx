'use client'

import React, { useState, useCallback } from 'react'
import { useDocumentInfo, useForm, useLocale } from '@payloadcms/ui'

const i18n = {
    de: {
        noReason: 'Keine Angabe',
        updateFailed: 'Aktualisierung fehlgeschlagen',
        unknownError: 'Unbekannter Fehler',
        rejectApplication: 'Bewerbung ablehnen',
        rejectionReasonOptional: 'Ablehnungsgrund (optional)',
        rejectionPlaceholder: 'z.B. Nicht genügend Erfahrung, Profil passt nicht...',
        rejecting: 'Wird abgelehnt...',
        reject: 'Ablehnen',
        cancel: 'Abbrechen',
    },
    en: {
        noReason: 'No reason provided',
        updateFailed: 'Update failed',
        unknownError: 'Unknown error',
        rejectApplication: 'Reject application',
        rejectionReasonOptional: 'Rejection reason (optional)',
        rejectionPlaceholder: 'e.g. Not enough experience, profile is not a match...',
        rejecting: 'Rejecting...',
        reject: 'Reject',
        cancel: 'Cancel',
    },
} as const

export const RejectTalentButton: React.FC = () => {
    const { id } = useDocumentInfo()
    const { submit } = useForm()
    const localeObj = useLocale()
    const localeCode = (typeof localeObj === 'string' ? localeObj : localeObj?.code) || 'de'
    const lang = localeCode === 'en' ? 'en' : 'de'
    const t = i18n[lang]
    const [showReason, setShowReason] = useState(false)
    const [reason, setReason] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleReject = useCallback(async () => {
        if (!id || isLoading) return

        setIsLoading(true)
        setError(null)

        try {
            const res = await fetch(`/api/form-submissions/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    applicationStatus: 'rejected',
                    rejectionReason: reason || t.noReason,
                }),
            })

            if (!res.ok) {
                throw new Error(t.updateFailed)
            }

            // Refresh the form to show updated status
            await submit()
            window.location.reload()
        } catch (err) {
            setError(err instanceof Error ? err.message : t.unknownError)
        } finally {
            setIsLoading(false)
        }
    }, [id, isLoading, reason, submit, t.noReason, t.updateFailed, t.unknownError])

    if (!showReason) {
        return (
            <div style={{ marginBottom: '8px' }}>
                <button
                    type="button"
                    onClick={() => setShowReason(true)}
                    style={{
                        width: '100%',
                        padding: '8px 16px',
                        backgroundColor: 'transparent',
                        color: 'var(--theme-error-500)',
                        border: '1px solid var(--theme-error-300)',
                        borderRadius: '4px',
                        fontSize: '13px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--theme-error-100)'
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                >
                    {t.rejectApplication}
                </button>
            </div>
        )
    }

    return (
        <div
            style={{
                marginBottom: '12px',
                padding: '12px',
                border: '1px solid var(--theme-error-200)',
                borderRadius: '6px',
                backgroundColor: 'var(--theme-error-50, #FEF2F2)',
            }}
        >
            <label
                style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'var(--theme-error-700)',
                    marginBottom: '6px',
                }}
            >
                {t.rejectionReasonOptional}
            </label>
            <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={t.rejectionPlaceholder}
                rows={3}
                style={{
                    width: '100%',
                    padding: '8px',
                    fontSize: '13px',
                    border: '1px solid var(--theme-elevation-200)',
                    borderRadius: '4px',
                    backgroundColor: 'var(--theme-elevation-0)',
                    color: 'var(--theme-elevation-800)',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    marginBottom: '8px',
                }}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
                <button
                    type="button"
                    onClick={handleReject}
                    disabled={isLoading}
                    style={{
                        flex: 1,
                        padding: '8px',
                        backgroundColor: 'var(--theme-error-500)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: isLoading ? 'wait' : 'pointer',
                        opacity: isLoading ? 0.7 : 1,
                    }}
                >
                    {isLoading ? t.rejecting : t.reject}
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setShowReason(false)
                        setReason('')
                    }}
                    style={{
                        padding: '8px 12px',
                        backgroundColor: 'transparent',
                        color: 'var(--theme-elevation-500)',
                        border: '1px solid var(--theme-elevation-200)',
                        borderRadius: '4px',
                        fontSize: '13px',
                        cursor: 'pointer',
                    }}
                >
                    {t.cancel}
                </button>
            </div>
            {error && (
                <p
                    style={{
                        marginTop: '6px',
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
