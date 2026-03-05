'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { HAIR_OPTIONS, EYE_OPTIONS } from '@/lib/constants/talentOptions'
import { useLocale } from '@payloadcms/ui'

const CSS_OVERRIDE = `
.talent-cards-view .collections,
.talent-cards-view .collection-list,
.talent-cards-view .collection-list__wrap,
.talent-cards-view table,
.talent-cards-view .collections__card-list {
    width: 100% !important;
    max-width: none !important;
    min-width: 0 !important;
}

.talent-cards-view table {
    display: block !important;
    border: none !important;
    background: transparent !important;
    padding: 0 !important;
    width: 100% !important;
}

.talent-cards-view thead {
    display: none !important;
}

.talent-cards-view .collections__card-list,
.talent-cards-view table tbody,
.talent-cards-view [role='rowgroup'],
.talent-cards-view .collection-list .table [role='rowgroup'],
.talent-cards-view .collection-list .table-wrap [role='rowgroup'] {
    display: grid !important;
    gap: 24px !important;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)) !important;
    padding: 30px !important;
    margin: -30px !important;
    width: calc(100% + 60px) !important;
    overflow: visible !important;
}

/* Ensure intermediate containers don't break the grid or add constraints */
.talent-cards-view .collection-list .table-wrap,
.talent-cards-view .collection-list .table,
.talent-cards-view .render-table {
    display: contents !important;
}

.talent-cards-view table tr,
.talent-cards-view [role='rowgroup'] > [role='row'],
.talent-cards-view [role='row'] {
    display: flex !important;
    flex-direction: column !important;
    justify-content: flex-start !important;
    border-radius: 24px !important;
    background: rgba(255, 255, 255, 0.7) !important;
    box-shadow: 0 10px 30px -10px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.05) !important;
    backdrop-filter: blur(12px) !important;
    border: 1px solid rgba(255,255,255,0.5) !important;
    overflow: hidden !important;
    padding: 0 !important;
    min-height: 520px !important;
    position: relative !important;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
}

.talent-cards-view table tr:hover,
.talent-cards-view [role='row']:hover {
    transform: translateY(-8px) scale(1.02) !important;
    box-shadow: 0 30px 60px -12px rgba(0,0,0,0.15), 0 18px 36px -18px rgba(0,0,0,0.1) !important;
    background: rgba(255, 255, 255, 0.85) !important;
    z-index: 10 !important;
}

.talent-cards-view .table td,
.talent-cards-view [role='cell'],
.talent-cards-view .collection-list .table-wrap [role='row'] > [role='cell'] {
    display: block !important;
    padding: 0 !important;
    width: 100% !important;
    min-width: 0 !important;
}

.talent-cards-view .table td.cell-featuredImage,
.talent-cards-view [role='cell'].cell-featuredImage {
    order: -1 !important;
    height: 380px !important;
    width: 100% !important;
    background: #f8fafc !important;
    overflow: hidden !important;
    position: relative !important;
}

.talent-cards-view .table td.cell-featuredImage img,
.talent-cards-view [role='cell'].cell-featuredImage img {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
    transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) !important;
}

.talent-cards-view table tr:hover .cell-featuredImage img,
.talent-cards-view [role='row']:hover .cell-featuredImage img {
    transform: scale(1.08) !important;
}

.talent-cards-view .table td.cell-name,
.talent-cards-view [role='cell'].cell-name {
    padding: 24px 24px 12px 24px !important;
    font-size: 1.25rem !important;
    font-weight: 800 !important;
    color: #1a1a1a !important;
    letter-spacing: -0.03em !important;
    line-height: 1.2 !important;
}

.talent-cards-view .table td.cell-name a {
    color: inherit !important;
    text-decoration: none !important;
}

.talent-cards-view .table td:not(.cell-featuredImage):not(.cell-name):not(.cell-_select),
.talent-cards-view [role='cell']:not(.cell-featuredImage):not(.cell-name):not(.cell-_select) {
    padding: 8px 24px !important;
    border: none !important;
}

.talent-cards-view .table td:not(.cell-featuredImage):not(.cell-name):not(.cell-_select):before,
.talent-cards-view [role='cell']:not(.cell-featuredImage):not(.cell-name):not(.cell-_select):before {
    content: attr(data-header);
    display: block;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #64748b !important;
    margin-bottom: 2px;
}

/* Custom Badge Styling within Cards */
.talent-cards-view .cell-category span,
.talent-cards-view .cell-status span,
.talent-cards-view .cell-_status span {
    border-radius: 8px !important;
    font-weight: 600 !important;
    font-size: 0.75rem !important;
}

.talent-cards-view .table td.cell-_select,
.talent-cards-view [role='cell'].cell-_select {
    position: absolute !important;
    top: 16px !important;
    right: 16px !important;
    left: auto !important;
    z-index: 20 !important;
    background: rgba(255,255,255,0.9) !important;
    backdrop-filter: blur(8px) !important;
    border-radius: 12px !important;
    padding: 8px !important;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
    opacity: 0;
    transition: all 0.3s ease !important;
    transform: scale(0.8) !important;
}

.talent-cards-view table tr:hover .cell-_select,
.talent-cards-view [role='row']:hover .cell-_select,
.talent-cards-view .cell-_select:has(input:checked) {
    opacity: 1 !important;
    transform: scale(1) !important;
}

@media (min-width: 900px) {
    .talent-cards-view .collections__card-list,
    .talent-cards-view table tbody {
        grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)) !important;
    }
}

@media (min-width: 1280px) {
    .talent-cards-view .collections__card-list,
    .talent-cards-view table tbody {
        grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)) !important;
    }
}

@media (min-width: 1680px) {
    .talent-cards-view .collections__card-list,
    .talent-cards-view table tbody {
        grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)) !important;
    }
}

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
    const activeTab = currentWhere || 'all'

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

    const handleTabChange = (category: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (category === 'all') {
            params.delete('where[category][equals]')
        } else {
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
