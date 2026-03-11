'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { HAIR_OPTIONS, EYE_OPTIONS } from '@/lib/constants/talentOptions'
import { useLocale } from '@payloadcms/ui'

const CSS_OVERRIDE = `
/* ══════════════════════════════════════════
   Talent Card View — Admin Panel Override
   Payload DOM: <table> <tbody> <tr.row-N> <td.cell-X> <span> .file > .thumbnail + .file__filename
   ══════════════════════════════════════════ */

/* ── Kill horizontal scroll ── */
.talent-cards-view .collection-list,
.talent-cards-view .collection-list__wrap {
    overflow-x: hidden !important;
}

/* ── Layout reset ── */
.talent-cards-view .table {
    display: block !important;
    border: none !important;
    background: transparent !important;
    padding: 0 !important;
    width: 100% !important;
    overflow: hidden !important;
}

.talent-cards-view table {
    display: block !important;
    border: none !important;
    background: transparent !important;
    width: 100% !important;
    overflow: hidden !important;
}

.talent-cards-view thead {
    display: none !important;
}

/* ── Grid on tbody ── */
.talent-cards-view tbody {
    display: grid !important;
    gap: 14px !important;
    grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)) !important;
    width: 100% !important;
    padding: 0 !important;
    margin: 0 !important;
}

/* ── Card = each tr ── */
.talent-cards-view tbody tr {
    display: flex !important;
    flex-direction: column !important;
    border-radius: 10px !important;
    background: var(--theme-elevation-0) !important;
    border: 1px solid var(--theme-elevation-150) !important;
    overflow: hidden !important;
    padding: 0 !important;
    min-height: 0 !important;
    position: relative !important;
    transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease !important;
}

.talent-cards-view tbody tr:hover {
    transform: translateY(-3px) !important;
    box-shadow: 0 12px 28px -8px rgba(0,0,0,0.18) !important;
    border-color: var(--theme-elevation-250) !important;
    z-index: 5 !important;
}

/* ── All cells base (td) ── */
.talent-cards-view tbody td {
    display: block !important;
    padding: 0 !important;
    width: 100% !important;
    min-width: 0 !important;
    border: none !important;
    vertical-align: top !important;
}

/* ── Featured image cell ── */
.talent-cards-view td.cell-featuredImage {
    order: -10 !important;
    aspect-ratio: 4 / 5 !important;
    height: auto !important;
    background: var(--theme-elevation-100) !important;
    overflow: hidden !important;
    position: relative !important;
}

/* Wrapper (span or a or button) + .file fill the cell */
.talent-cards-view td.cell-featuredImage > * {
    display: block !important;
    width: 100% !important;
    height: 100% !important;
    position: absolute !important;
    inset: 0 !important;
    overflow: hidden !important;
}

.talent-cards-view td.cell-featuredImage .file {
    display: block !important;
    width: 100% !important;
    height: 100% !important;
    position: absolute !important;
    inset: 0 !important;
}

/* Hide only the filename text */
.talent-cards-view td.cell-featuredImage .file__filename {
    display: none !important;
}

/* Thumbnail — fill cell, override Payload's --size-small (40px) */
.talent-cards-view td.cell-featuredImage .thumbnail {
    width: 100% !important;
    height: 100% !important;
    max-height: none !important;
    max-width: none !important;
    position: absolute !important;
    inset: 0 !important;
    border-radius: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
    display: block !important;
}

/* Image covers the cell */
.talent-cards-view td.cell-featuredImage .thumbnail img {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
    position: absolute !important;
    inset: 0 !important;
    border-radius: 0 !important;
    max-width: none !important;
    max-height: none !important;
    margin: 0 !important;
    transition: transform 0.35s ease !important;
}

/* SVG fallback (failed load) */
.talent-cards-view td.cell-featuredImage .thumbnail svg {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
    position: absolute !important;
    inset: 0 !important;
}

/* Hover zoom on image */
.talent-cards-view tbody tr:hover td.cell-featuredImage .thumbnail img {
    transform: scale(1.05) !important;
}

/* ── Name cell ── */
.talent-cards-view td.cell-name {
    order: -5 !important;
    padding: 10px 12px 1px !important;
    font-size: 0.85rem !important;
    font-weight: 700 !important;
    color: var(--theme-elevation-900) !important;
    letter-spacing: -0.01em !important;
    line-height: 1.2 !important;
}

.talent-cards-view td.cell-name a {
    color: inherit !important;
    text-decoration: none !important;
}

/* Stretch name link over entire card so clicking anywhere opens edit */
.talent-cards-view td.cell-name a::after {
    content: '' !important;
    position: absolute !important;
    inset: 0 !important;
    z-index: 10 !important;
}

.talent-cards-view tbody tr {
    cursor: pointer !important;
}

/* ── Category cell ── */
.talent-cards-view td.cell-category {
    order: -4 !important;
    padding: 3px 12px 4px !important;
}

.talent-cards-view td.cell-category span {
    display: inline-block !important;
    border-radius: 999px !important;
    font-weight: 600 !important;
    font-size: 0.62rem !important;
    padding: 2px 8px !important;
    background: var(--theme-elevation-100) !important;
    color: var(--theme-elevation-600) !important;
    text-transform: uppercase !important;
    letter-spacing: 0.04em !important;
}

/* ── isCoach cell — hide in card view (replaced by JS-injected badge) ── */
.talent-cards-view td.cell-isCoach {
    display: none !important;
}

/* ── JS-injected Coach badge — floating on image ── */
.talent-cards-view .coach-badge-injected {
    position: absolute !important;
    top: 8px !important;
    left: 8px !important;
    z-index: 15 !important;
    background: linear-gradient(135deg, #b87333, #d4956a) !important;
    border-radius: 6px !important;
    padding: 3px 10px !important;
    font-size: 0.6rem !important;
    font-weight: 700 !important;
    color: #fff !important;
    letter-spacing: 0.06em !important;
    text-transform: uppercase !important;
    box-shadow: 0 2px 8px rgba(184,115,51,0.4) !important;
    pointer-events: none !important;
}

/* ── Hide ALL cells except image, name, category, select ── */
/* Info is injected via JS instead of relying on column selection */
.talent-cards-view tbody td:not(.cell-featuredImage):not(.cell-name):not(.cell-category):not(.cell-_select) {
    display: none !important;
}

/* ── JS-injected info bar ── */
.talent-cards-view .talent-card-info {
    order: 3 !important;
    padding: 6px 12px 10px !important;
    display: flex !important;
    flex-wrap: wrap !important;
    gap: 4px 8px !important;
    font-size: 0.65rem !important;
    color: var(--theme-elevation-500) !important;
    border-top: 1px solid var(--theme-elevation-100) !important;
}

.talent-cards-view .talent-card-info .info-item {
    display: inline-flex !important;
    align-items: center !important;
    gap: 3px !important;
    white-space: nowrap !important;
}

.talent-cards-view .talent-card-info .info-label {
    font-weight: 700 !important;
    color: var(--theme-elevation-400) !important;
    text-transform: uppercase !important;
    letter-spacing: 0.04em !important;
    font-size: 0.58rem !important;
}

.talent-cards-view .talent-card-info .info-value {
    color: var(--theme-elevation-600) !important;
}

/* ── Checkbox — floating on hover ── */
.talent-cards-view td.cell-_select {
    position: absolute !important;
    top: 8px !important;
    right: 8px !important;
    left: auto !important;
    width: auto !important;
    z-index: 20 !important;
    background: var(--theme-elevation-0) !important;
    border-radius: 8px !important;
    padding: 4px !important;
    box-shadow: 0 2px 6px rgba(0,0,0,0.12) !important;
    opacity: 0 !important;
    transition: opacity 0.15s ease, transform 0.15s ease !important;
    transform: scale(0.9) !important;
}

.talent-cards-view tbody tr:hover td.cell-_select,
.talent-cards-view td.cell-_select:has(input:checked) {
    opacity: 1 !important;
    transform: scale(1) !important;
}

/* ── Responsive ── */
@media (min-width: 1200px) {
    .talent-cards-view tbody {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)) !important;
    }
}

@media (min-width: 1600px) {
    .talent-cards-view tbody {
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)) !important;
    }
}

/* ── Filter controls ── */
.talents-admin-filter-controls {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    flex: 1;
    min-width: 0;
}

.talents-admin-filter-controls select {
    min-width: 170px;
}

.talents-admin-height-range {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-left: 8px;
}

@media (max-width: 900px) {
    .talents-admin-filter-controls {
        width: 100%;
    }

    .talents-admin-height-range {
        margin-left: 0;
    }
}
`

type SkillOption = {
    id: number | string
    title?: string | { de?: string; en?: string }
    slug?: string
    skillGroup?: string
}

const i18n = {
    de: {
        allTalents: 'Alle Talents',
        dancers: 'Dancers',
        models: 'Models',
        dancerModel: 'Dancer & Model',
        coaches: 'Coaches',
        list: 'Liste',
        cards: 'Cards',
        filters: 'Filter',
        skill: 'Style / Skill',
        allSkills: 'Alle Skills',
        hair: 'Haarfarbe',
        eye: 'Augenfarbe',
        allHair: 'Alle Haarfarben',
        allEyes: 'Alle Augenfarben',
        height: 'Größe (cm)',
        min: 'Min',
        max: 'Max',
        reset: 'Filter zurücksetzen',
        stylePresets: 'Schnellwahl',
        commercial: 'Commercial',
        hiphop: 'Hip Hop',
        editorial: 'Editorial',
        groupDance: 'Tanz',
        groupModeling: 'Modeling',
        groupActing: 'Schauspiel',
        groupFitness: 'Fitness',
        groupOther: 'Sonstiges',
    },
    en: {
        allTalents: 'All talents',
        dancers: 'Dancers',
        models: 'Models',
        dancerModel: 'Dancer & Model',
        coaches: 'Coaches',
        list: 'List',
        cards: 'Cards',
        filters: 'Filters',
        skill: 'Style / Skill',
        allSkills: 'All skills',
        hair: 'Hair colour',
        eye: 'Eye colour',
        allHair: 'All hair colours',
        allEyes: 'All eye colours',
        height: 'Height (cm)',
        min: 'Min',
        max: 'Max',
        reset: 'Reset filters',
        stylePresets: 'Quick picks',
        commercial: 'Commercial',
        hiphop: 'Hip Hop',
        editorial: 'Editorial',
        groupDance: 'Dance',
        groupModeling: 'Modeling',
        groupActing: 'Acting',
        groupFitness: 'Fitness',
        groupOther: 'Other',
    },
} as const

type TalentCardInfo = {
    id: string
    isCoach?: boolean
    measurements?: { height?: string; hair?: string; eyes?: string }
}

export const TalentsListControls: React.FC = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const localeObj = useLocale()
    const localeCode = (typeof localeObj === 'string' ? localeObj : localeObj?.code) || 'de'
    const lang = localeCode === 'en' ? 'en' : 'de'
    const t = i18n[lang]
    const [viewMode, setViewMode] = useState<'list' | 'cards'>('list')
    const [skills, setSkills] = useState<SkillOption[]>([])

    // Check current category filter
    const currentWhere = searchParams.get('where[category][equals]')
    const currentCoach = searchParams.get('where[isCoach][equals]')
    const activeTab = currentCoach === 'true' ? 'coach' : currentWhere || 'all'

    // Additional filters
    const currentSkill = searchParams.get('where[skills][in]') || ''
    const currentHair = searchParams.get('where[measurements.hair][in]') || ''
    const currentEyes = searchParams.get('where[measurements.eyes][in]') || ''
    const currentHeightMin = searchParams.get('where[heightNum][greater_than_equal]') || ''
    const currentHeightMax = searchParams.get('where[heightNum][less_than_equal]') || ''

    const [heightMin, setHeightMin] = useState(currentHeightMin)
    const [heightMax, setHeightMax] = useState(currentHeightMax)

    // Sync input state if URL changes externally
    useEffect(() => {
        setHeightMin(currentHeightMin)
        setHeightMax(currentHeightMax)
    }, [currentHeightMin, currentHeightMax])

    const resolveSkillTitle = useCallback(
        (skill: SkillOption): string => {
            if (typeof skill.title === 'string' && skill.title.trim()) return skill.title
            if (skill.title && typeof skill.title === 'object') {
                const localized =
                    (skill.title[lang] as string | undefined) ||
                    (skill.title.de as string | undefined) ||
                    (skill.title.en as string | undefined)
                if (localized?.trim()) return localized.trim()
            }
            return skill.slug || String(skill.id)
        },
        [lang],
    )

    const resolveSkillGroupLabel = useCallback(
        (group: string | undefined) => {
            if (group === 'dance') return t.groupDance
            if (group === 'modeling') return t.groupModeling
            if (group === 'acting') return t.groupActing
            if (group === 'fitness') return t.groupFitness
            return t.groupOther
        },
        [t.groupActing, t.groupDance, t.groupFitness, t.groupModeling, t.groupOther],
    )

    const loadSkills = useCallback(async () => {
        try {
            const res = await fetch('/api/talent-skills?limit=200&depth=0&sort=slug')
            if (!res.ok) return
            const data = await res.json()
            const docs = Array.isArray(data?.docs) ? (data.docs as SkillOption[]) : []
            setSkills(docs)
        } catch {
            // ignore in admin controls
        }
    }, [])

    useEffect(() => {
        loadSkills()
    }, [loadSkills])

    useEffect(() => {
        const savedView = localStorage.getItem('payload-talents-view') || 'list'
        setViewMode(savedView as 'list' | 'cards')
    }, [])

    useEffect(() => {
        const body = document.body
        const html = document.documentElement

        if (viewMode === 'cards') {
            body.classList.add('talent-cards-view')
            html.classList.add('talent-cards-view')
        } else {
            body.classList.remove('talent-cards-view')
            html.classList.remove('talent-cards-view')
        }
        localStorage.setItem('payload-talents-view', viewMode)

        return () => {
            body.classList.remove('talent-cards-view')
            html.classList.remove('talent-cards-view')
        }
    }, [viewMode])

    const [talentMap, setTalentMap] = useState<Map<string, TalentCardInfo>>(new Map())

    useEffect(() => {
        if (viewMode !== 'cards') return
        let cancelled = false

        const fetchTalents = async () => {
            try {
                const res = await fetch(
                    '/api/talents?limit=200&depth=0&select[isCoach]=true&select[measurements]=true',
                )
                if (!res.ok) return
                const data = await res.json()
                const map = new Map<string, TalentCardInfo>()
                for (const doc of data?.docs || []) {
                    map.set(String(doc.id), {
                        id: String(doc.id),
                        isCoach: doc.isCoach,
                        measurements: doc.measurements,
                    })
                }
                if (!cancelled) setTalentMap(map)
            } catch {
                // ignore
            }
        }
        fetchTalents()
        return () => { cancelled = true }
    }, [viewMode, searchParams])

    // Inject coach badges + info into card rows
    useEffect(() => {
        if (viewMode !== 'cards' || talentMap.size === 0) return

        const hairLabels: Record<string, string> = Object.fromEntries(
            HAIR_OPTIONS.map((o) => [o.value, o.label.split(' / ')[lang === 'en' ? 1 : 0] || o.label]),
        )
        const eyeLabels: Record<string, string> = Object.fromEntries(
            EYE_OPTIONS.map((o) => [o.value, o.label.split(' / ')[lang === 'en' ? 1 : 0] || o.label]),
        )

        const injectInfo = () => {
            const rows = document.querySelectorAll<HTMLElement>('tbody tr[data-id]')
            rows.forEach((row) => {
                const id = row.getAttribute('data-id') || ''
                const talent = talentMap.get(id)

                // Clean up previous injections
                row.querySelector('.coach-badge-injected')?.remove()
                row.querySelector('.talent-card-info')?.remove()

                if (!talent) return

                // Coach badge
                if (talent.isCoach) {
                    const badge = document.createElement('div')
                    badge.className = 'coach-badge-injected'
                    badge.textContent = 'Coach'
                    row.appendChild(badge)
                }

                // Info bar
                const m = talent.measurements
                const infoItems: [string, string][] = []

                if (m?.height) infoItems.push(['↕', m.height])
                if (m?.hair && hairLabels[m.hair]) infoItems.push(['Hair', hairLabels[m.hair]])
                if (m?.eyes && eyeLabels[m.eyes]) infoItems.push(['Eyes', eyeLabels[m.eyes]])

                if (infoItems.length > 0) {
                    const info = document.createElement('div')
                    info.className = 'talent-card-info'
                    for (const [label, value] of infoItems) {
                        const item = document.createElement('span')
                        item.className = 'info-item'
                        const lbl = document.createElement('span')
                        lbl.className = 'info-label'
                        lbl.textContent = label
                        const val = document.createElement('span')
                        val.className = 'info-value'
                        val.textContent = value
                        item.append(lbl, val)
                        info.appendChild(item)
                    }
                    row.appendChild(info)
                }
            })
        }

        const timer = setTimeout(injectInfo, 150)
        const observer = new MutationObserver(() => setTimeout(injectInfo, 80))

        const tbody = document.querySelector('.collection-list tbody')
        if (tbody) observer.observe(tbody, { childList: true })

        return () => {
            clearTimeout(timer)
            observer.disconnect()
            document.querySelectorAll('.coach-badge-injected, .talent-card-info').forEach((el) => el.remove())
        }
    }, [viewMode, talentMap, lang])

    const handleTabChange = (category: string) => {
        const params = new URLSearchParams(searchParams.toString())
        // Clear both filters first
        params.delete('where[category][equals]')
        params.delete('where[isCoach][equals]')

        if (category === 'coach') {
            params.set('where[isCoach][equals]', 'true')
        } else if (category !== 'all') {
            params.set('where[category][equals]', category)
        }
        // Reset to first page
        params.delete('page')
        router.push(`?${params.toString()}`)
    }

    const handleFilterChange = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (value) {
            params.set(key, value)
        } else {
            params.delete(key)
        }
        params.delete('page')
        router.push(`?${params.toString()}`)
    }

    const localizeSplitLabel = useCallback(
        (rawLabel: string) => {
            const parts = rawLabel
                .split(' / ')
                .map((p) => p.trim())
                .filter(Boolean)
            if (parts.length < 2) return rawLabel
            return lang === 'en' ? parts[parts.length - 1] : parts[0]
        },
        [lang],
    )

    const skillPresets = useMemo(
        () => [
            { slug: 'commercial', label: t.commercial },
            { slug: 'hip-hop', label: t.hiphop },
            { slug: 'editorial', label: t.editorial },
        ],
        [t.commercial, t.editorial, t.hiphop],
    )

    const presetSkillEntries = useMemo(
        () =>
            skillPresets.flatMap((preset) => {
                const skill = skills.find((item) => item.slug === preset.slug)
                if (!skill) return []
                return [{ ...preset, skill }]
            }),
        [skillPresets, skills],
    )

    const resetFilters = useCallback(() => {
        const params = new URLSearchParams(searchParams.toString())
        params.delete('where[skills][in]')
        params.delete('where[measurements.hair][in]')
        params.delete('where[measurements.eyes][in]')
        params.delete('where[heightNum][greater_than_equal]')
        params.delete('where[heightNum][less_than_equal]')
        params.delete('where[isCoach][equals]')
        params.delete('page')
        setHeightMin('')
        setHeightMax('')
        router.push(`?${params.toString()}`)
    }, [router, searchParams])

    const inputStyle = {
        padding: '7px 11px',
        borderRadius: '8px',
        border: '1px solid var(--theme-elevation-200)',
        background: 'var(--theme-elevation-0)',
        fontSize: '12px',
        fontWeight: 500,
        color: 'var(--theme-elevation-800)',
        outline: 'none',
    }

    return (
        <div style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <style dangerouslySetInnerHTML={{ __html: CSS_OVERRIDE }} />

            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px',
                    background: 'var(--theme-elevation-50)',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1px solid var(--theme-elevation-150)',
                }}
            >
                {/* Tabs */}
                <div style={{ display: 'flex', gap: '8px' }}>
                    {[
                        { id: 'all', label: t.allTalents },
                        { id: 'dancer', label: t.dancers },
                        { id: 'model', label: t.models },
                        { id: 'both', label: t.dancerModel },
                        { id: 'coach', label: t.coaches },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => handleTabChange(tab.id)}
                            style={{
                                padding: '6px 16px',
                                borderRadius: '999px',
                                fontSize: '13px',
                                fontWeight: 500,
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                border:
                                    activeTab === tab.id
                                        ? '1px solid var(--theme-elevation-800)'
                                        : '1px solid var(--theme-elevation-200)',
                                background:
                                    activeTab === tab.id
                                        ? 'var(--theme-elevation-800)'
                                        : 'transparent',
                                color:
                                    activeTab === tab.id
                                        ? 'var(--theme-bg)'
                                        : 'var(--theme-elevation-600)',
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* View Toggle */}
                <div
                    style={{
                        display: 'flex',
                        gap: '4px',
                        background: 'var(--theme-elevation-100)',
                        padding: '4px',
                        borderRadius: '8px',
                    }}
                >
                    <button
                        type="button"
                        onClick={() => setViewMode('list')}
                        title={t.list}
                        style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: 'none',
                            fontSize: '13px',
                            fontWeight: 500,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            background:
                                viewMode === 'list' ? 'var(--theme-elevation-0)' : 'transparent',
                            color:
                                viewMode === 'list'
                                    ? 'var(--theme-elevation-900)'
                                    : 'var(--theme-elevation-500)',
                            boxShadow: viewMode === 'list' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                        }}
                    >
                        {t.list}
                    </button>
                    <button
                        type="button"
                        onClick={() => setViewMode('cards')}
                        title={t.cards}
                        style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: 'none',
                            fontSize: '13px',
                            fontWeight: 500,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            background:
                                viewMode === 'cards' ? 'var(--theme-elevation-0)' : 'transparent',
                            color:
                                viewMode === 'cards'
                                    ? 'var(--theme-elevation-900)'
                                    : 'var(--theme-elevation-500)',
                            boxShadow: viewMode === 'cards' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                        }}
                    >
                        {t.cards}
                    </button>
                </div>
            </div>

            {/* Advanced Filters */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px',
                    background: 'var(--theme-elevation-50)',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1px solid var(--theme-elevation-150)',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '13px',
                        fontWeight: 500,
                        color: 'var(--theme-elevation-600)',
                    }}
                >
                    {t.filters}:
                </div>

                <div className="talents-admin-filter-controls">
                    <select
                        style={inputStyle}
                        value={currentSkill}
                        onChange={(e) => handleFilterChange('where[skills][in]', e.target.value)}
                    >
                        <option value="">
                            {t.skill}: {t.allSkills}
                        </option>
                        {skills.map((skill) => (
                            <option key={skill.id} value={String(skill.id)}>
                                {resolveSkillGroupLabel(skill.skillGroup)} ·{' '}
                                {resolveSkillTitle(skill)}
                            </option>
                        ))}
                    </select>

                    <select
                        style={inputStyle}
                        value={currentHair}
                        onChange={(e) =>
                            handleFilterChange('where[measurements.hair][in]', e.target.value)
                        }
                    >
                        <option value="">
                            {t.hair}: {t.allHair}
                        </option>
                        {HAIR_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {localizeSplitLabel(opt.label)}
                            </option>
                        ))}
                    </select>

                    <select
                        style={inputStyle}
                        value={currentEyes}
                        onChange={(e) =>
                            handleFilterChange('where[measurements.eyes][in]', e.target.value)
                        }
                    >
                        <option value="">
                            {t.eye}: {t.allEyes}
                        </option>
                        {EYE_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {localizeSplitLabel(opt.label)}
                            </option>
                        ))}
                    </select>

                    <div className="talents-admin-height-range">
                        <span style={{ fontSize: '13px', color: 'var(--theme-elevation-500)' }}>
                            {t.height}:
                        </span>
                        <input
                            type="number"
                            placeholder={t.min}
                            style={{ ...inputStyle, width: '70px' }}
                            value={heightMin}
                            onChange={(e) => setHeightMin(e.target.value)}
                            onBlur={() =>
                                handleFilterChange(
                                    'where[heightNum][greater_than_equal]',
                                    heightMin,
                                )
                            }
                            onKeyDown={(e) =>
                                e.key === 'Enter' &&
                                handleFilterChange(
                                    'where[heightNum][greater_than_equal]',
                                    heightMin,
                                )
                            }
                        />
                        <span style={{ color: 'var(--theme-elevation-300)' }}>-</span>
                        <input
                            type="number"
                            placeholder={t.max}
                            style={{ ...inputStyle, width: '70px' }}
                            value={heightMax}
                            onChange={(e) => setHeightMax(e.target.value)}
                            onBlur={() =>
                                handleFilterChange('where[heightNum][less_than_equal]', heightMax)
                            }
                            onKeyDown={(e) =>
                                e.key === 'Enter' &&
                                handleFilterChange('where[heightNum][less_than_equal]', heightMax)
                            }
                        />
                    </div>
                </div>

                {presetSkillEntries.length > 0 && (
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            flexWrap: 'wrap',
                            width: '100%',
                            marginTop: '4px',
                        }}
                    >
                        <span
                            style={{
                                fontSize: '12px',
                                color: 'var(--theme-elevation-500)',
                                minWidth: '90px',
                            }}
                        >
                            {t.stylePresets}:
                        </span>
                        {presetSkillEntries.map((entry) => {
                            const isActive = currentSkill === String(entry.skill.id)
                            return (
                                <button
                                    key={entry.slug}
                                    type="button"
                                    onClick={() =>
                                        handleFilterChange(
                                            'where[skills][in]',
                                            isActive ? '' : String(entry.skill.id),
                                        )
                                    }
                                    style={{
                                        padding: '6px 11px',
                                        borderRadius: '999px',
                                        border: isActive
                                            ? '1px solid var(--theme-success-600)'
                                            : '1px solid var(--theme-elevation-200)',
                                        background: isActive
                                            ? 'var(--theme-success-100)'
                                            : 'var(--theme-elevation-0)',
                                        color: isActive
                                            ? 'var(--theme-success-700)'
                                            : 'var(--theme-elevation-700)',
                                        fontSize: '12px',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                    }}
                                >
                                    {entry.label}
                                </button>
                            )
                        })}
                    </div>
                )}

                {/* Clear all filters button if active */}
                {(currentSkill ||
                    currentHair ||
                    currentEyes ||
                    currentHeightMin ||
                    currentHeightMax) && (
                    <button
                        type="button"
                        onClick={resetFilters}
                        style={{
                            padding: '7px 12px',
                            background: 'var(--theme-error-50)',
                            border: '1px solid var(--theme-error-300)',
                            borderRadius: '8px',
                            fontSize: '12px',
                            cursor: 'pointer',
                            fontWeight: 600,
                            color: 'var(--theme-error-700)',
                            marginLeft: 'auto',
                        }}
                    >
                        {t.reset}
                    </button>
                )}
            </div>
        </div>
    )
}
