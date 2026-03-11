'use client'

import React from 'react'
import { useFormFields, useLocale } from '@payloadcms/ui'

const fieldLabels: Record<string, { de: string; en: string }> = {
    firstName: { de: 'Vorname', en: 'First name' },
    vorname: { de: 'Vorname', en: 'First name' },
    lastName: { de: 'Nachname', en: 'Last name' },
    nachname: { de: 'Nachname', en: 'Last name' },
    name: { de: 'Name', en: 'Name' },
    email: { de: 'E-Mail', en: 'Email' },
    'e-mail': { de: 'E-Mail', en: 'Email' },
    phone: { de: 'Telefon', en: 'Phone' },
    telefon: { de: 'Telefon', en: 'Phone' },
    message: { de: 'Nachricht', en: 'Message' },
    nachricht: { de: 'Nachricht', en: 'Message' },
    company: { de: 'Firma', en: 'Company' },
    firma: { de: 'Firma', en: 'Company' },
    category: { de: 'Kategorie', en: 'Category' },
    kategorie: { de: 'Kategorie', en: 'Category' },
    height: { de: 'Größe', en: 'Height' },
    groesse: { de: 'Größe', en: 'Height' },
    hairColor: { de: 'Haarfarbe', en: 'Hair colour' },
    haarfarbe: { de: 'Haarfarbe', en: 'Hair colour' },
    eyeColor: { de: 'Augenfarbe', en: 'Eye colour' },
    augenfarbe: { de: 'Augenfarbe', en: 'Eye colour' },
    confectionSize: { de: 'Konfektionsgröße', en: 'Clothing size' },
    konfektionsgroesse: { de: 'Konfektionsgröße', en: 'Clothing size' },
    shoeSize: { de: 'Schuhgröße', en: 'Shoe size' },
    bust: { de: 'Brust', en: 'Bust' },
    waist: { de: 'Taille', en: 'Waist' },
    hips: { de: 'Hüfte', en: 'Hips' },
    instagram: { de: 'Instagram', en: 'Instagram' },
    tiktok: { de: 'TikTok', en: 'TikTok' },
    portfolioImages: { de: 'Portfolio-Bilder', en: 'Portfolio images' },
    aboutYou: { de: 'Über dich', en: 'About you' },
    ueberDich: { de: 'Über dich', en: 'About you' },
    about: { de: 'Über dich', en: 'About you' },
    subject: { de: 'Betreff', en: 'Subject' },
    betreff: { de: 'Betreff', en: 'Subject' },
    talentSelection: { de: 'Ausgewählte Talente', en: 'Selected talents' },
    eventDate: { de: 'Event-Datum', en: 'Event date' },
    eventDatum: { de: 'Event-Datum', en: 'Event date' },
    eventType: { de: 'Event-Typ', en: 'Event type' },
    eventArt: { de: 'Event-Typ', en: 'Event type' },
    budget: { de: 'Budget', en: 'Budget' },
    location: { de: 'Ort', en: 'Location' },
    ort: { de: 'Ort', en: 'Location' },
    website: { de: 'Website', en: 'Website' },
}

const i18n = {
    de: {
        heading: 'Eingesendete Daten',
        uploadedImages: (count: number) => `${count} Bild(er) hochgeladen`,
        categories: {
            contact: 'Kontakt / Allgemein',
            talent_booking: 'Talent-Anfrage / Buchung',
            become_talent: 'Talent werden',
            job_inquiry: 'Job-Anfrage',
            class_inquiry: 'Kursanfrage',
            other: 'Sonstiges',
        },
    },
    en: {
        heading: 'Submitted data',
        uploadedImages: (count: number) => `${count} image(s) uploaded`,
        categories: {
            contact: 'Contact / General',
            talent_booking: 'Talent request / Booking',
            become_talent: 'Become a talent',
            job_inquiry: 'Job inquiry',
            class_inquiry: 'Class inquiry',
            other: 'Other',
        },
    },
} as const

export const SubmissionDetailView: React.FC = () => {
    const submissionDataField = useFormFields(([fields]) => fields.submissionData)
    const categoryField = useFormFields(([fields]) => fields.category)
    const localeObj = useLocale()
    const localeCode = (typeof localeObj === 'string' ? localeObj : localeObj?.code) || 'de'
    const lang = localeCode === 'en' ? 'en' : 'de'
    const t = i18n[lang]

    const rawValue = submissionDataField?.value
    const entries = Array.isArray(rawValue)
        ? (rawValue as Array<{ field?: string; value?: string }>)
              .map((item) => {
                  const field =
                      (item as Record<string, unknown>)?.field ??
                      ((item as Record<string, unknown>)?.value as Record<string, unknown>)
                          ?.field ??
                      ''
                  const value =
                      (item as Record<string, unknown>)?.value ??
                      ((item as Record<string, unknown>)?.value as Record<string, unknown>)
                          ?.value ??
                      ''
                  return { field: String(field), value: String(value) }
              })
              .filter((e) => e.field && e.value)
        : []

    if (entries.length === 0) return null

    const category = typeof categoryField?.value === 'string' ? categoryField.value : ''

    const formatValue = (field: string, value: string): string => {
        if (field !== 'portfolioImages') return value
        try {
            const parsed = JSON.parse(value) as unknown
            if (Array.isArray(parsed)) {
                return t.uploadedImages(parsed.length)
            }
        } catch {
            // ignore
        }
        return value
    }

    const categoryColors: Record<string, { bg: string; color: string; label: string }> = {
        contact: { bg: '#F3F4F6', color: '#374151', label: t.categories.contact },
        talent_booking: { bg: '#EDE9FE', color: '#6D28D9', label: t.categories.talent_booking },
        become_talent: { bg: '#DBEAFE', color: '#1D4ED8', label: t.categories.become_talent },
        job_inquiry: { bg: '#FEF3C7', color: '#B45309', label: t.categories.job_inquiry },
        class_inquiry: { bg: '#D1FAE5', color: '#065F46', label: t.categories.class_inquiry },
        other: { bg: '#F3F4F6', color: '#6B7280', label: t.categories.other },
    }

    const catConfig = categoryColors[category]

    return (
        <div
            style={{
                backgroundColor: 'var(--theme-elevation-50)',
                border: '1px solid var(--theme-elevation-150)',
                borderRadius: '8px',
                padding: '20px',
                marginBottom: '24px',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '16px',
                    paddingBottom: '12px',
                    borderBottom: '1px solid var(--theme-elevation-150)',
                }}
            >
                <h3
                    style={{
                        margin: 0,
                        fontSize: '14px',
                        fontWeight: 600,
                        color: 'var(--theme-elevation-800)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                    }}
                >
                    {t.heading}
                </h3>
                {catConfig && (
                    <span
                        style={{
                            padding: '4px 12px',
                            borderRadius: '100px',
                            fontSize: '12px',
                            fontWeight: 500,
                            backgroundColor: catConfig.bg,
                            color: catConfig.color,
                        }}
                    >
                        {catConfig.label}
                    </span>
                )}
            </div>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                    gap: '12px',
                }}
            >
                {entries.map((entry, i) => {
                    const normalizedField = entry.field.trim()
                    const label =
                        fieldLabels[normalizedField]?.[lang] ||
                        fieldLabels[normalizedField.toLowerCase()]?.[lang] ||
                        normalizedField
                    const formattedValue = formatValue(entry.field, entry.value)
                    const isLong = formattedValue.length > 80

                    return (
                        <div
                            key={i}
                            style={{
                                gridColumn: isLong ? '1 / -1' : undefined,
                                padding: '10px 14px',
                                backgroundColor: 'var(--theme-elevation-0)',
                                borderRadius: '6px',
                                border: '1px solid var(--theme-elevation-100)',
                            }}
                        >
                            <div
                                style={{
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    color: 'var(--theme-elevation-500)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.3px',
                                    marginBottom: '4px',
                                }}
                            >
                                {label}
                            </div>
                            <div
                                style={{
                                    fontSize: '14px',
                                    color: 'var(--theme-elevation-800)',
                                    wordBreak: 'break-word',
                                    whiteSpace: isLong ? 'pre-wrap' : 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: isLong ? undefined : 'ellipsis',
                                }}
                            >
                                {formattedValue}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
