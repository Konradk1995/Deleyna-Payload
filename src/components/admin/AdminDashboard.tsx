'use client'

import React, { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useLocale } from '@payloadcms/ui'

interface DashboardStats {
    unreadSubmissions: number
    pendingApplications: number
    totalTalents: number
    draftTalents: number
    recentSubmissions: Array<{
        id: string | number
        category?: string
        createdAt: string
        submissionData?: Array<{ field: string; value: string }>
    }>
}

const categoryLabels: Record<string, { de: string; en: string }> = {
    contact: { de: 'Kontakt', en: 'Contact' },
    talent_booking: { de: 'Buchung', en: 'Booking' },
    become_talent: { de: 'Bewerbung', en: 'Application' },
    job_inquiry: { de: 'Job-Anfrage', en: 'Job inquiry' },
    other: { de: 'Sonstiges', en: 'Other' },
}

const categoryColors: Record<string, string> = {
    contact: '#6B7280',
    talent_booking: '#6D28D9',
    become_talent: '#1D4ED8',
    job_inquiry: '#B45309',
    other: '#9CA3AF',
}

const dashboardI18n = {
    de: {
        errorLoadFailed: 'Dashboard-Daten konnten nicht vollständig geladen werden.',
        errorUnknown: 'Unbekannter Fehler beim Laden des Dashboards.',
        loading: 'Dashboard lädt…',
        lastUpdated: 'Zuletzt aktualisiert',
        refreshing: 'Aktualisiert…',
        refresh: 'Aktualisieren',
        categories: {
            all: 'Alle',
            become_talent: 'Talent werden',
            talent_booking: 'Booking',
            contact: 'Kontakt',
            job_inquiry: 'Job',
            other: 'Sonstiges',
        },
        cards: {
            unreadSubmissions: 'Ungelesene Anfragen',
            pendingApplications: 'Offene Bewerbungen',
            totalTalents: 'Talents gesamt',
            draftTalents: 'Talent-Entwürfe',
        },
        shortcuts: {
            becomeTalent: 'Talent werden',
            bookingRequests: 'Booking-Anfragen',
            contactRequests: 'Kontaktanfragen',
            allTalents: 'Alle Talents',
        },
        latestSubmissions: 'Letzte Einsendungen',
        viewAll: 'Alle anzeigen',
        noEntriesInCategory: 'Keine Einträge in dieser Kategorie in den letzten Einsendungen.',
        quickLinks: {
            newTalent: '+ Neues Talent',
            newPost: '+ Neuer Beitrag',
            newPage: '+ Neue Seite',
            editHeader: 'Header bearbeiten',
            editFooter: 'Footer bearbeiten',
        },
    },
    en: {
        errorLoadFailed: 'Dashboard data could not be fully loaded.',
        errorUnknown: 'Unknown error while loading dashboard.',
        loading: 'Loading dashboard…',
        lastUpdated: 'Last updated',
        refreshing: 'Refreshing…',
        refresh: 'Refresh',
        categories: {
            all: 'All',
            become_talent: 'Become a talent',
            talent_booking: 'Booking',
            contact: 'Contact',
            job_inquiry: 'Job',
            other: 'Other',
        },
        cards: {
            unreadSubmissions: 'Unread submissions',
            pendingApplications: 'Open applications',
            totalTalents: 'Total talents',
            draftTalents: 'Talent drafts',
        },
        shortcuts: {
            becomeTalent: 'Become a talent',
            bookingRequests: 'Booking requests',
            contactRequests: 'Contact requests',
            allTalents: 'All talents',
        },
        latestSubmissions: 'Latest submissions',
        viewAll: 'View all',
        noEntriesInCategory: 'No entries in this category among recent submissions.',
        quickLinks: {
            newTalent: '+ New talent',
            newPost: '+ New post',
            newPage: '+ New page',
            editHeader: 'Edit header',
            editFooter: 'Edit footer',
        },
    },
} as const

function getSubmitterName(
    data: Array<{ field: string; value: string }> | undefined,
    lang: 'de' | 'en',
): string {
    if (!data) return lang === 'en' ? 'Unknown' : 'Unbekannt'
    const get = (keys: string[]) =>
        data.find((item) => keys.some((k) => item.field.toLowerCase().includes(k)))?.value || ''
    const first = get(['firstname', 'vorname', 'first_name'])
    const last = get(['lastname', 'nachname', 'last_name'])
    const name = `${first} ${last}`.trim() || get(['name', 'fullname'])
    return name || get(['email', 'e-mail']) || (lang === 'en' ? 'Unknown' : 'Unbekannt')
}

function timeAgo(dateStr: string, lang: 'de' | 'en'): string {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return lang === 'en' ? 'just now' : 'gerade eben'
    if (mins < 60) return lang === 'en' ? `${mins} min ago` : `vor ${mins} Min.`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return lang === 'en' ? `${hours}h ago` : `vor ${hours} Std.`
    const days = Math.floor(hours / 24)
    if (days === 1) return lang === 'en' ? 'yesterday' : 'gestern'
    return lang === 'en' ? `${days} days ago` : `vor ${days} Tagen`
}

export const AdminDashboard: React.FC = () => {
    const localeObj = useLocale()
    const localeCode = (typeof localeObj === 'string' ? localeObj : localeObj?.code) || 'de'
    const lang = localeCode === 'en' ? 'en' : 'de'
    const t = dashboardI18n[lang]
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [loading, setLoading] = useState(true)
    const [loadingRefresh, setLoadingRefresh] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [lastUpdated, setLastUpdated] = useState<string | null>(null)
    const [activeCategory, setActiveCategory] = useState<string>('all')

    const fetchStats = useCallback(
        async (mode: 'initial' | 'refresh' = 'initial') => {
            if (mode === 'refresh') setLoadingRefresh(true)
            setErrorMessage(null)
            try {
                const [notifRes, submissionsRes, talentsRes, pendingRes] = await Promise.all([
                    fetch('/api/globals/notifications'),
                    fetch('/api/form-submissions?limit=12&sort=-createdAt&depth=0'),
                    fetch('/api/talents?limit=0&depth=0'),
                    fetch(
                        '/api/form-submissions?limit=0&depth=0&where[category][equals]=become_talent&where[applicationStatus][equals]=pending',
                    ),
                ])

                const responses = [notifRes, submissionsRes, talentsRes, pendingRes]
                if (responses.some((res) => !res.ok)) {
                    throw new Error(t.errorLoadFailed)
                }

                const notif = await notifRes.json()
                const submissions = await submissionsRes.json()
                const talents = await talentsRes.json()
                const pending = await pendingRes.json()

                const draftTalents = (talents.docs || []).filter(
                    (entry: { _status?: string }) => entry._status === 'draft',
                ).length

                setStats({
                    unreadSubmissions:
                        (notif.unreadFormSubmissionsDe || 0) +
                        (notif.unreadFormSubmissionsEn || 0),
                    pendingApplications: pending.totalDocs || 0,
                    totalTalents: talents.totalDocs || 0,
                    draftTalents,
                    recentSubmissions: submissions.docs || [],
                })
                setLastUpdated(new Date().toISOString())
            } catch (error) {
                setErrorMessage(error instanceof Error ? error.message : t.errorUnknown)
            } finally {
                setLoading(false)
                setLoadingRefresh(false)
            }
        },
        [t.errorLoadFailed, t.errorUnknown],
    )

    useEffect(() => {
        fetchStats('initial')
    }, [fetchStats])

    if (loading) {
        return (
            <div style={{ padding: '24px 0' }}>
                <div
                    style={{
                        height: '200px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--theme-elevation-50)',
                        animation: 'pulse 2s infinite',
                    }}
                />
            </div>
        )
    }

    if (!stats) return null

    const categoryFilters = [
        { key: 'all', label: t.categories.all },
        { key: 'become_talent', label: t.categories.become_talent },
        { key: 'talent_booking', label: t.categories.talent_booking },
        { key: 'contact', label: t.categories.contact },
        { key: 'job_inquiry', label: t.categories.job_inquiry },
        { key: 'other', label: t.categories.other },
    ]

    const recentCategoryCounts: Record<string, number> = {}
    for (const submission of stats.recentSubmissions) {
        const key = submission.category || 'other'
        recentCategoryCounts[key] = (recentCategoryCounts[key] || 0) + 1
    }

    const filteredRecentSubmissions =
        activeCategory === 'all'
            ? stats.recentSubmissions
            : stats.recentSubmissions.filter(
                  (sub) => (sub.category || 'other') === activeCategory,
              )

    const cards = [
        {
            label: t.cards.unreadSubmissions,
            value: stats.unreadSubmissions,
            color: stats.unreadSubmissions > 0 ? '#EF4444' : '#22C55E',
            href: '/admin/collections/form-submissions?where[read][equals]=false',
            icon: '✉️',
        },
        {
            label: t.cards.pendingApplications,
            value: stats.pendingApplications,
            color: stats.pendingApplications > 0 ? '#F59E0B' : '#22C55E',
            href: '/admin/collections/form-submissions?where[category][equals]=become_talent&where[applicationStatus][equals]=pending',
            icon: '📋',
        },
        {
            label: t.cards.totalTalents,
            value: stats.totalTalents,
            color: '#6366F1',
            href: '/admin/collections/talents',
            icon: '⭐',
        },
        {
            label: t.cards.draftTalents,
            value: stats.draftTalents,
            color: stats.draftTalents > 0 ? '#F59E0B' : '#6B7280',
            href: '/admin/collections/talents?where[_status][equals]=draft',
            icon: '📝',
        },
    ]

    return (
        <div style={{ padding: '0 0 32px' }}>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '14px',
                    gap: '12px',
                    flexWrap: 'wrap',
                }}
            >
                <div style={{ fontSize: '12px', color: 'var(--theme-elevation-500)' }}>
                    {lastUpdated
                        ? `${t.lastUpdated}: ${new Date(lastUpdated).toLocaleString(
                              lang === 'en' ? 'en-US' : 'de-DE',
                          )}`
                        : t.loading}
                </div>
                <button
                    type="button"
                    onClick={() => fetchStats('refresh')}
                    disabled={loadingRefresh}
                    style={{
                        border: '1px solid var(--theme-elevation-200)',
                        background: 'var(--theme-elevation-50)',
                        color: 'var(--theme-elevation-700)',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: 600,
                        padding: '7px 10px',
                        cursor: loadingRefresh ? 'wait' : 'pointer',
                        opacity: loadingRefresh ? 0.65 : 1,
                    }}
                >
                    {loadingRefresh ? t.refreshing : t.refresh}
                </button>
            </div>

            {errorMessage && (
                <div
                    style={{
                        marginBottom: '16px',
                        border: '1px solid #fca5a5',
                        background: '#fef2f2',
                        color: '#991b1b',
                        borderRadius: '10px',
                        padding: '10px 12px',
                        fontSize: '13px',
                    }}
                >
                    {errorMessage}
                </div>
            )}

            {/* Stats Cards */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '16px',
                    marginBottom: '24px',
                }}
            >
                {cards.map((card) => (
                    <a
                        key={card.label}
                        href={card.href}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '14px',
                            padding: '18px 20px',
                            backgroundColor: 'var(--theme-elevation-50)',
                            border: '1px solid var(--theme-elevation-150)',
                            borderRadius: '10px',
                            textDecoration: 'none',
                            transition: 'border-color 0.15s, box-shadow 0.15s',
                            cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'var(--theme-elevation-300)'
                            e.currentTarget.style.boxShadow =
                                '0 2px 8px rgba(0,0,0,0.06)'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'var(--theme-elevation-150)'
                            e.currentTarget.style.boxShadow = 'none'
                        }}
                    >
                        <span style={{ fontSize: '28px' }}>{card.icon}</span>
                        <div>
                            <div
                                style={{
                                    fontSize: '28px',
                                    fontWeight: 700,
                                    color: card.color,
                                    lineHeight: 1,
                                }}
                            >
                                {card.value}
                            </div>
                            <div
                                style={{
                                    fontSize: '13px',
                                    color: 'var(--theme-elevation-500)',
                                    marginTop: '2px',
                                }}
                            >
                                {card.label}
                            </div>
                        </div>
                    </a>
                ))}
            </div>

            {/* Form category shortcuts */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '12px',
                    marginBottom: '22px',
                }}
            >
                {[
                    {
                        label: t.shortcuts.becomeTalent,
                        href: '/admin/collections/form-submissions?where[category][equals]=become_talent',
                    },
                    {
                        label: t.shortcuts.bookingRequests,
                        href: '/admin/collections/form-submissions?where[category][equals]=talent_booking',
                    },
                    {
                        label: t.shortcuts.contactRequests,
                        href: '/admin/collections/form-submissions?where[category][equals]=contact',
                    },
                    {
                        label: t.shortcuts.allTalents,
                        href: '/admin/collections/talents',
                    },
                ].map((item) => (
                    <a
                        key={item.label}
                        href={item.href}
                        style={{
                            padding: '12px 14px',
                            borderRadius: '10px',
                            backgroundColor: 'var(--theme-elevation-50)',
                            border: '1px solid var(--theme-elevation-150)',
                            color: 'var(--theme-elevation-700)',
                            textDecoration: 'none',
                            fontSize: '13px',
                            fontWeight: 600,
                            transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'var(--theme-elevation-300)'
                            e.currentTarget.style.color = 'var(--theme-elevation-900)'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'var(--theme-elevation-150)'
                            e.currentTarget.style.color = 'var(--theme-elevation-700)'
                        }}
                    >
                        {item.label} →
                    </a>
                ))}
            </div>

            {/* Recent Submissions */}
            {stats.recentSubmissions.length > 0 && (
                <div
                    style={{
                        backgroundColor: 'var(--theme-elevation-50)',
                        border: '1px solid var(--theme-elevation-150)',
                        borderRadius: '10px',
                        overflow: 'hidden',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '14px 20px',
                            borderBottom: '1px solid var(--theme-elevation-150)',
                        }}
                    >
                        <h3
                            style={{
                                margin: 0,
                                fontSize: '14px',
                                fontWeight: 600,
                                color: 'var(--theme-elevation-800)',
                            }}
                        >
                            {t.latestSubmissions}
                        </h3>
                        <Link
                            href="/admin/collections/form-submissions"
                            style={{
                                fontSize: '12px',
                                color: 'var(--theme-elevation-500)',
                                textDecoration: 'none',
                            }}
                        >
                            {t.viewAll} →
                        </Link>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            gap: '8px',
                            flexWrap: 'wrap',
                            padding: '12px 20px',
                            borderBottom: '1px solid var(--theme-elevation-120)',
                        }}
                    >
                        {categoryFilters.map((filter) => {
                            const count =
                                filter.key === 'all'
                                    ? stats.recentSubmissions.length
                                    : recentCategoryCounts[filter.key] || 0
                            const active = activeCategory === filter.key
                            return (
                                <button
                                    key={filter.key}
                                    type="button"
                                    onClick={() => setActiveCategory(filter.key)}
                                    style={{
                                        border: active
                                            ? '1px solid var(--theme-elevation-700)'
                                            : '1px solid var(--theme-elevation-200)',
                                        background: active
                                            ? 'var(--theme-elevation-150)'
                                            : 'var(--theme-elevation-50)',
                                        color: active
                                            ? 'var(--theme-elevation-900)'
                                            : 'var(--theme-elevation-600)',
                                        fontSize: '12px',
                                        fontWeight: 600,
                                        lineHeight: 1,
                                        borderRadius: '999px',
                                        padding: '8px 11px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {filter.label} ({count})
                                </button>
                            )
                        })}
                    </div>
                    <div>
                        {filteredRecentSubmissions.map((sub, i) => {
                            const name = getSubmitterName(sub.submissionData, lang)
                            const cat = sub.category || 'other'
                            return (
                                <a
                                    key={sub.id}
                                    href={`/admin/collections/form-submissions/${sub.id}`}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '12px 20px',
                                        borderBottom:
                                            i < filteredRecentSubmissions.length - 1
                                                ? '1px solid var(--theme-elevation-100)'
                                                : 'none',
                                        textDecoration: 'none',
                                        transition: 'background-color 0.1s',
                                        cursor: 'pointer',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor =
                                            'var(--theme-elevation-100)'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = 'transparent'
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                        }}
                                    >
                                        <span
                                            style={{
                                                display: 'inline-block',
                                                padding: '2px 8px',
                                                borderRadius: '100px',
                                                fontSize: '11px',
                                                fontWeight: 500,
                                                backgroundColor: `${categoryColors[cat] || '#9CA3AF'}18`,
                                                color: categoryColors[cat] || '#9CA3AF',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            {categoryLabels[cat]?.[lang] || cat}
                                        </span>
                                        <span
                                            style={{
                                                fontSize: '14px',
                                                color: 'var(--theme-elevation-800)',
                                                fontWeight: 500,
                                            }}
                                        >
                                            {name}
                                        </span>
                                    </div>
                                    <span
                                        style={{
                                            fontSize: '12px',
                                            color: 'var(--theme-elevation-400)',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {timeAgo(sub.createdAt, lang)}
                                    </span>
                                </a>
                            )
                        })}
                        {filteredRecentSubmissions.length === 0 && (
                            <div
                                style={{
                                    padding: '16px 20px',
                                    fontSize: '13px',
                                    color: 'var(--theme-elevation-500)',
                                }}
                            >
                                {t.noEntriesInCategory}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Quick Links */}
            <div
                style={{
                    display: 'flex',
                    gap: '10px',
                    marginTop: '20px',
                    flexWrap: 'wrap',
                }}
            >
                {[
                    { label: t.quickLinks.newTalent, href: '/admin/collections/talents/create' },
                    { label: t.quickLinks.newPost, href: '/admin/collections/posts/create' },
                    { label: t.quickLinks.newPage, href: '/admin/collections/pages/create' },
                    { label: t.quickLinks.editHeader, href: '/admin/globals/header' },
                    { label: t.quickLinks.editFooter, href: '/admin/globals/footer' },
                ].map((link) => (
                    <a
                        key={link.label}
                        href={link.href}
                        style={{
                            padding: '8px 16px',
                            fontSize: '13px',
                            fontWeight: 500,
                            color: 'var(--theme-elevation-600)',
                            backgroundColor: 'var(--theme-elevation-50)',
                            border: '1px solid var(--theme-elevation-150)',
                            borderRadius: '6px',
                            textDecoration: 'none',
                            transition: 'all 0.15s',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'var(--theme-elevation-300)'
                            e.currentTarget.style.color = 'var(--theme-elevation-800)'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'var(--theme-elevation-150)'
                            e.currentTarget.style.color = 'var(--theme-elevation-600)'
                        }}
                    >
                        {link.label}
                    </a>
                ))}
            </div>
        </div>
    )
}
