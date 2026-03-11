'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useLocale } from '@payloadcms/ui'

type Counts = {
    total: number
    unread: number
    pending: number
    byCategory: Record<
        'contact' | 'talent_booking' | 'become_talent' | 'job_inquiry' | 'class_inquiry' | 'other',
        number
    >
    byLocale: Record<'de' | 'en', number>
}

const i18n = {
    de: {
        overview: 'Übersicht',
        total: 'Gesamt',
        unread: 'Ungelesen',
        pending: 'Offen (Talent werden)',
        filterByCategory: 'Nach Kategorie',
        readState: 'Lesestatus',
        status: 'Status',
        language: 'Sprache',
        sort: 'Sortierung',
        reset: 'Alle Filter zurücksetzen',
        all: 'Alle',
        readAll: 'Alle',
        readOnlyUnread: 'Nur ungelesen',
        readOnlyRead: 'Nur gelesen',
        statusAll: 'Alle',
        statusPending: 'Ausstehend',
        statusApproved: 'Genehmigt',
        statusRejected: 'Abgelehnt',
        localeAll: 'Alle',
        localeDe: 'Deutsch',
        localeEn: 'Englisch',
        sortNewest: 'Neueste zuerst',
        sortOldest: 'Älteste zuerst',
        categories: {
            contact: 'Kontakt',
            talent_booking: 'Buchung',
            become_talent: 'Talent werden',
            job_inquiry: 'Job',
            class_inquiry: 'Kursanfrage',
            other: 'Sonstiges',
        },
    },
    en: {
        overview: 'Overview',
        total: 'Total',
        unread: 'Unread',
        pending: 'Pending (Become a talent)',
        filterByCategory: 'By category',
        readState: 'Read state',
        status: 'Status',
        language: 'Language',
        sort: 'Sort',
        reset: 'Reset all filters',
        all: 'All',
        readAll: 'All',
        readOnlyUnread: 'Unread only',
        readOnlyRead: 'Read only',
        statusAll: 'All',
        statusPending: 'Pending',
        statusApproved: 'Approved',
        statusRejected: 'Rejected',
        localeAll: 'All',
        localeDe: 'German',
        localeEn: 'English',
        sortNewest: 'Newest first',
        sortOldest: 'Oldest first',
        categories: {
            contact: 'Contact',
            talent_booking: 'Booking',
            become_talent: 'Become a talent',
            job_inquiry: 'Job',
            class_inquiry: 'Class inquiry',
            other: 'Other',
        },
    },
} as const

const categories = ['contact', 'talent_booking', 'become_talent', 'job_inquiry', 'class_inquiry', 'other'] as const

async function fetchCount(query: string): Promise<number> {
    try {
        const res = await fetch(`/api/form-submissions?limit=0&depth=0${query}`)
        if (!res.ok) return 0
        const data = await res.json()
        return Number(data?.totalDocs || 0)
    } catch {
        return 0
    }
}

export const FormSubmissionsListControls: React.FC = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const localeObj = useLocale()
    const localeCode = (typeof localeObj === 'string' ? localeObj : localeObj?.code) || 'de'
    const lang = localeCode === 'en' ? 'en' : 'de'
    const t = i18n[lang]

    const [counts, setCounts] = useState<Counts>({
        total: 0,
        unread: 0,
        pending: 0,
        byCategory: {
            contact: 0,
            talent_booking: 0,
            become_talent: 0,
            job_inquiry: 0,
            class_inquiry: 0,
            other: 0,
        },
        byLocale: { de: 0, en: 0 },
    })

    const categoryFilter = searchParams.get('where[category][equals]') || 'all'
    const readFilter = searchParams.get('where[read][equals]') || 'all'
    const statusFilter = searchParams.get('where[applicationStatus][equals]') || 'all'
    const localeFilter = searchParams.get('where[locale][equals]') || 'all'
    const sortFilter = searchParams.get('sort') || '-createdAt'

    const updateFilter = useCallback(
        (key: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString())
            if (!value || value === 'all') {
                params.delete(key)
            } else {
                params.set(key, value)
            }
            params.delete('page')
            router.push(`?${params.toString()}`)
        },
        [router, searchParams],
    )

    const resetAll = useCallback(() => {
        const params = new URLSearchParams(searchParams.toString())
        params.delete('where[category][equals]')
        params.delete('where[read][equals]')
        params.delete('where[applicationStatus][equals]')
        params.delete('where[locale][equals]')
        params.delete('sort')
        params.delete('page')
        router.push(`?${params.toString()}`)
    }, [router, searchParams])

    const loadCounts = useCallback(async () => {
        const [
            total,
            unread,
            pending,
            contact,
            talentBooking,
            becomeTalent,
            jobInquiry,
            classInquiry,
            other,
            localeDe,
            localeEn,
        ] = await Promise.all([
            fetchCount(''),
            fetchCount('&where[read][equals]=false'),
            fetchCount(
                '&where[category][equals]=become_talent&where[applicationStatus][equals]=pending',
            ),
            fetchCount('&where[category][equals]=contact'),
            fetchCount('&where[category][equals]=talent_booking'),
            fetchCount('&where[category][equals]=become_talent'),
            fetchCount('&where[category][equals]=job_inquiry'),
            fetchCount('&where[category][equals]=class_inquiry'),
            fetchCount('&where[category][equals]=other'),
            fetchCount('&where[locale][equals]=de'),
            fetchCount('&where[locale][equals]=en'),
        ])

        setCounts({
            total,
            unread,
            pending,
            byCategory: {
                contact,
                talent_booking: talentBooking,
                become_talent: becomeTalent,
                job_inquiry: jobInquiry,
                class_inquiry: classInquiry,
                other,
            },
            byLocale: { de: localeDe, en: localeEn },
        })
    }, [])

    useEffect(() => {
        loadCounts()
        const interval = setInterval(loadCounts, 30000)
        const onFocus = () => loadCounts()
        window.addEventListener('focus', onFocus)
        return () => {
            clearInterval(interval)
            window.removeEventListener('focus', onFocus)
        }
    }, [loadCounts])

    const selectStyle: React.CSSProperties = {
        minWidth: '180px',
        padding: '7px 10px',
        borderRadius: '8px',
        border: '1px solid var(--theme-elevation-200)',
        background: 'var(--theme-elevation-0)',
        color: 'var(--theme-elevation-800)',
        fontSize: '12px',
        fontWeight: 500,
    }

    return (
        <div
            style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}
        >
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '10px',
                }}
            >
                {[
                    { label: t.total, value: counts.total, color: 'var(--theme-elevation-900)' },
                    { label: t.unread, value: counts.unread, color: 'var(--theme-warning-700)' },
                    { label: t.pending, value: counts.pending, color: 'var(--theme-success-700)' },
                ].map((item) => (
                    <div
                        key={item.label}
                        style={{
                            padding: '12px 14px',
                            borderRadius: '12px',
                            border: '1px solid var(--theme-elevation-150)',
                            background: 'var(--theme-elevation-50)',
                        }}
                    >
                        <div
                            style={{
                                fontSize: '11px',
                                fontWeight: 600,
                                color: 'var(--theme-elevation-500)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.04em',
                            }}
                        >
                            {item.label}
                        </div>
                        <div
                            style={{
                                fontSize: '24px',
                                lineHeight: 1.1,
                                fontWeight: 700,
                                color: item.color,
                            }}
                        >
                            {item.value}
                        </div>
                    </div>
                ))}
            </div>

            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    background: 'var(--theme-elevation-50)',
                    border: '1px solid var(--theme-elevation-150)',
                    borderRadius: '12px',
                    padding: '12px',
                }}
            >
                <div
                    style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        color: 'var(--theme-elevation-700)',
                    }}
                >
                    {t.overview}
                </div>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                        gap: '10px',
                    }}
                >
                    <label
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                            fontSize: '11px',
                            fontWeight: 700,
                            color: 'var(--theme-elevation-500)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em',
                        }}
                    >
                        {t.filterByCategory}
                        <select
                            style={selectStyle}
                            value={categoryFilter}
                            onChange={(e) =>
                                updateFilter('where[category][equals]', e.target.value)
                            }
                        >
                            <option value="all">
                                {t.all} ({counts.total})
                            </option>
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {t.categories[category]} ({counts.byCategory[category]})
                                </option>
                            ))}
                        </select>
                    </label>

                    <label
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                            fontSize: '11px',
                            fontWeight: 700,
                            color: 'var(--theme-elevation-500)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em',
                        }}
                    >
                        {t.readState}
                        <select
                            style={selectStyle}
                            value={readFilter}
                            onChange={(e) => updateFilter('where[read][equals]', e.target.value)}
                        >
                            <option value="all">{t.readAll}</option>
                            <option value="false">{t.readOnlyUnread}</option>
                            <option value="true">{t.readOnlyRead}</option>
                        </select>
                    </label>

                    <label
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                            fontSize: '11px',
                            fontWeight: 700,
                            color: 'var(--theme-elevation-500)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em',
                        }}
                    >
                        {t.status}
                        <select
                            style={selectStyle}
                            value={statusFilter}
                            onChange={(e) =>
                                updateFilter('where[applicationStatus][equals]', e.target.value)
                            }
                        >
                            <option value="all">{t.statusAll}</option>
                            <option value="pending">{t.statusPending}</option>
                            <option value="approved">{t.statusApproved}</option>
                            <option value="rejected">{t.statusRejected}</option>
                        </select>
                    </label>

                    <label
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                            fontSize: '11px',
                            fontWeight: 700,
                            color: 'var(--theme-elevation-500)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em',
                        }}
                    >
                        {t.language}
                        <select
                            style={selectStyle}
                            value={localeFilter}
                            onChange={(e) => updateFilter('where[locale][equals]', e.target.value)}
                        >
                            <option value="all">{t.localeAll}</option>
                            <option value="de">
                                {t.localeDe} ({counts.byLocale.de})
                            </option>
                            <option value="en">
                                {t.localeEn} ({counts.byLocale.en})
                            </option>
                        </select>
                    </label>

                    <label
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                            fontSize: '11px',
                            fontWeight: 700,
                            color: 'var(--theme-elevation-500)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em',
                        }}
                    >
                        {t.sort}
                        <select
                            style={selectStyle}
                            value={sortFilter}
                            onChange={(e) => updateFilter('sort', e.target.value)}
                        >
                            <option value="-createdAt">{t.sortNewest}</option>
                            <option value="createdAt">{t.sortOldest}</option>
                        </select>
                    </label>
                </div>

                {(categoryFilter !== 'all' ||
                    readFilter !== 'all' ||
                    statusFilter !== 'all' ||
                    localeFilter !== 'all' ||
                    sortFilter !== '-createdAt') && (
                    <button
                        type="button"
                        onClick={resetAll}
                        style={{
                            alignSelf: 'flex-end',
                            marginTop: '2px',
                            padding: '7px 10px',
                            borderRadius: '8px',
                            border: '1px solid var(--theme-error-300)',
                            color: 'var(--theme-error-700)',
                            background: 'var(--theme-error-50)',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                        }}
                    >
                        {t.reset}
                    </button>
                )}
            </div>
        </div>
    )
}
