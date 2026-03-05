'use client'

import React, { useState } from 'react'
import { useLocale } from '@payloadcms/ui'

const baseUrl =
    process.env.NEXT_PUBLIC_SERVER_URL ||
    (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000')

const labels = {
    de: {
        title: 'CSV-Export für Notion',
        description:
            'Exportiere alle Talent-Daten als CSV-Datei. Diese kannst du direkt in Notion importieren über "Merge with CSV".',
        button: 'Talents als CSV exportieren',
        downloading: 'Exportiere…',
        success: 'CSV heruntergeladen!',
        error: 'Export fehlgeschlagen. Bitte erneut versuchen.',
        guideTitle: 'Notion einrichten',
        steps: [
            ['1. Integration erstellen', 'https://www.notion.so/my-integrations → „New integration" → Name vergeben → Token kopieren'],
            ['2. Datenbank erstellen', 'Neue Datenbank in Notion anlegen. Empfohlene Spalten: Name (Titel), Category, Status, Height, Bust, Waist, Hips, Skills, Languages, Booking Email, Bio DE, Bio EN, Payload ID, Profile URL'],
            ['3. Integration einladen', 'In der Datenbank oben rechts auf „..." → „Connections" → deine Integration auswählen'],
            ['4. Database-ID kopieren', 'Die 32-stellige ID aus der Notion-URL: notion.so/<workspace>/<DATABASE_ID>?v=...'],
            ['5. Hier konfigurieren', 'API Key und Database ID oben eintragen, Sync aktivieren — fertig!'],
        ],
        csvHint: 'Oder exportiere zuerst eine CSV und importiere sie manuell in Notion:',
    },
    en: {
        title: 'CSV Export for Notion',
        description:
            'Export all talent data as a CSV file. You can import it directly into Notion via "Merge with CSV".',
        button: 'Export talents as CSV',
        downloading: 'Exporting…',
        success: 'CSV downloaded!',
        error: 'Export failed. Please try again.',
        guideTitle: 'Set up Notion',
        steps: [
            ['1. Create integration', 'https://www.notion.so/my-integrations → "New integration" → set name → copy token'],
            ['2. Create database', 'Create a new database in Notion. Recommended columns: Name (title), Category, Status, Height, Bust, Waist, Hips, Skills, Languages, Booking Email, Bio DE, Bio EN, Payload ID, Profile URL'],
            ['3. Invite integration', 'In the database click "..." top-right → "Connections" → select your integration'],
            ['4. Copy Database ID', 'The 32-character ID from the Notion URL: notion.so/<workspace>/<DATABASE_ID>?v=...'],
            ['5. Configure here', 'Enter API Key and Database ID above, enable sync — done!'],
        ],
        csvHint: 'Or export a CSV first and import it manually into Notion:',
    },
}

const containerStyle: React.CSSProperties = {
    marginTop: '24px',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid var(--theme-elevation-150)',
    backgroundColor: 'var(--theme-elevation-50)',
}

const titleStyle: React.CSSProperties = {
    fontSize: '15px',
    fontWeight: 600,
    marginBottom: '8px',
    color: 'var(--theme-elevation-800)',
}

const stepContainerStyle: React.CSSProperties = {
    marginBottom: '20px',
    padding: '16px',
    borderRadius: '6px',
    border: '1px solid var(--theme-elevation-150)',
    backgroundColor: 'var(--theme-elevation-0)',
}

const stepTitleStyle: React.CSSProperties = {
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--theme-elevation-700)',
    marginBottom: '12px',
}

const stepStyle: React.CSSProperties = {
    fontSize: '12px',
    lineHeight: '1.6',
    color: 'var(--theme-elevation-600)',
    marginBottom: '6px',
    paddingLeft: '4px',
}

const stepLabelStyle: React.CSSProperties = {
    fontWeight: 600,
    color: 'var(--theme-elevation-800)',
}

const buttonStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    fontSize: '13px',
    fontWeight: 600,
    lineHeight: '20px',
    borderRadius: '6px',
    border: '1px solid var(--theme-elevation-300)',
    backgroundColor: 'var(--theme-elevation-50)',
    color: 'var(--theme-elevation-800)',
    cursor: 'pointer',
    transition: 'all 150ms ease',
    whiteSpace: 'nowrap',
}

const hintStyle: React.CSSProperties = {
    fontSize: '12px',
    color: 'var(--theme-elevation-500)',
    marginBottom: '10px',
    marginTop: '4px',
}

const feedbackStyle = (type: 'success' | 'error'): React.CSSProperties => ({
    fontSize: '12px',
    marginTop: '8px',
    color: type === 'success' ? 'var(--theme-success-500, #22c55e)' : 'var(--theme-error-500, #ef4444)',
})

export function NotionExportPanel() {
    const locale = useLocale()
    const localeCode =
        typeof locale === 'object' && locale?.code ? locale.code : locale || 'de'
    const t = labels[localeCode === 'en' ? 'en' : 'de']

    const [loading, setLoading] = useState(false)
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

    const handleExport = async () => {
        setLoading(true)
        setFeedback(null)
        try {
            const res = await fetch(`${baseUrl}/api/export-talents-csv`, {
                credentials: 'include',
            })
            if (!res.ok) throw new Error(`Status ${res.status}`)

            const blob = await res.blob()
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            const date = new Date().toISOString().slice(0, 10)
            a.download = `talents-export-${date}.csv`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
            setFeedback({ type: 'success', message: t.success })
        } catch {
            setFeedback({ type: 'error', message: t.error })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={containerStyle}>
            <div style={titleStyle}>{t.guideTitle}</div>

            <div style={stepContainerStyle}>
                <div style={stepTitleStyle}>
                    {localeCode === 'de' ? 'Schritt-für-Schritt Anleitung' : 'Step-by-step guide'}
                </div>
                {t.steps.map(([label, desc]) => (
                    <div key={label} style={stepStyle}>
                        <span style={stepLabelStyle}>{label}:</span>{' '}
                        {desc}
                    </div>
                ))}
            </div>

            <div style={hintStyle}>{t.csvHint}</div>

            <button
                type="button"
                onClick={handleExport}
                disabled={loading}
                style={{
                    ...buttonStyle,
                    opacity: loading ? 0.6 : 1,
                    cursor: loading ? 'not-allowed' : 'pointer',
                }}
                onMouseEnter={(e) => {
                    if (!loading)
                        e.currentTarget.style.backgroundColor = 'var(--theme-elevation-100)'
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--theme-elevation-50)'
                }}
            >
                <svg
                    width="16"
                    height="16"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                </svg>
                <span>{loading ? t.downloading : t.button}</span>
            </button>

            {feedback && (
                <div style={feedbackStyle(feedback.type)}>{feedback.message}</div>
            )}
        </div>
    )
}
