'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Check, ChevronDown, SlidersHorizontal, X } from 'lucide-react'
import { cn } from '@/utilities/ui'

export interface FilterState {
    category: string
    hair: string[]
    eyes: string[]
    skills: string[]
}

interface FilterOption {
    label: string
    value: string
}

interface AdvancedFiltersProps {
    filterLabels?: { all?: string; dancers?: string; models?: string }
    hairOptions: FilterOption[]
    eyeOptions: FilterOption[]
    skillOptions?: FilterOption[]
    showHairFilter?: boolean
    showEyeFilter?: boolean
    showSkillsFilter?: boolean
    value: FilterState
    onChange: (state: FilterState) => void
    locale?: string
    resultCount?: number
    totalCount?: number
}

export function AdvancedFilters({
    filterLabels,
    hairOptions,
    eyeOptions,
    skillOptions = [],
    showHairFilter = true,
    showEyeFilter = true,
    showSkillsFilter = false,
    value,
    onChange,
    locale = 'de',
    resultCount,
    totalCount,
}: AdvancedFiltersProps) {
    const [mobileOpen, setMobileOpen] = useState(false)

    const allLabel = filterLabels?.all || (locale === 'de' ? 'Alle' : 'All')

    const categoryOptions = [
        { label: allLabel, value: 'all' },
        { label: filterLabels?.dancers || (locale === 'de' ? 'Tänzer' : 'Dancers'), value: 'dancer' },
        { label: filterLabels?.models || 'Models', value: 'model' },
    ]

    const activeCount =
        (value.category !== 'all' ? 1 : 0) +
        (value.hair.length > 0 ? 1 : 0) +
        (value.eyes.length > 0 ? 1 : 0) +
        (value.skills.length > 0 ? 1 : 0)

    const clearAll = () => onChange({ category: 'all', hair: [], eyes: [], skills: [] })

    const hasHair = showHairFilter && hairOptions.length > 0
    const hasEyes = showEyeFilter && eyeOptions.length > 0
    const hasSkills = showSkillsFilter && skillOptions.length > 0

    // Result text
    const resultText =
        resultCount !== undefined && totalCount !== undefined
            ? resultCount === totalCount
                ? `${totalCount} ${locale === 'de' ? 'Talente' : 'Talents'}`
                : `${resultCount} ${locale === 'de' ? 'von' : 'of'} ${totalCount}`
            : null

    return (
        <div role="search" aria-label={locale === 'de' ? 'Talente filtern' : 'Filter talents'}>
            {/* Desktop: compact category + filter dropdowns */}
            <div className="hidden md:block">
                <div className="surface-pill p-3 md:p-4">
                    <div className="flex flex-wrap items-center gap-2 md:gap-2.5">
                        <Pills
                            options={categoryOptions}
                            activeValue={value.category}
                            onChange={(v) => onChange({ ...value, category: v })}
                            label={locale === 'de' ? 'Kategorie' : 'Category'}
                        />

                        {(hasHair || hasEyes || hasSkills) && (
                            <div className="mx-1 h-5 w-px bg-border/60" aria-hidden="true" />
                        )}

                        {hasHair && (
                            <FilterDropdown
                                label={locale === 'de' ? 'Haare' : 'Hair'}
                                options={hairOptions}
                                selected={value.hair}
                                onChange={(v) => onChange({ ...value, hair: v })}
                                locale={locale}
                            />
                        )}

                        {hasEyes && (
                            <FilterDropdown
                                label={locale === 'de' ? 'Augen' : 'Eyes'}
                                options={eyeOptions}
                                selected={value.eyes}
                                onChange={(v) => onChange({ ...value, eyes: v })}
                                locale={locale}
                            />
                        )}

                        {hasSkills && (
                            <FilterDropdown
                                label="Skills"
                                options={skillOptions}
                                selected={value.skills}
                                onChange={(v) => onChange({ ...value, skills: v })}
                                locale={locale}
                            />
                        )}

                        {activeCount > 0 && (
                            <button
                                type="button"
                                onClick={clearAll}
                                aria-label={locale === 'de' ? 'Alle Filter zurücksetzen' : 'Clear all filters'}
                                className="ml-1 inline-flex items-center gap-1 rounded-full border border-copper/25 bg-copper/10 px-3 py-1.5 text-xs font-medium text-copper transition-opacity hover:opacity-80"
                            >
                                <X className="h-3 w-3" aria-hidden="true" />
                                {locale === 'de' ? 'Reset' : 'Clear'}
                            </button>
                        )}

                        {resultText && (
                            <span
                                className="ml-auto rounded-full border border-border/50 bg-card/75 px-3 py-1 text-xs text-muted-foreground tabular-nums"
                                aria-live="polite"
                                aria-atomic="true"
                            >
                                {resultText}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile: toggle button + collapsible */}
            <div className="md:hidden">
                <div className="flex items-center justify-between">
                    <button
                        type="button"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-expanded={mobileOpen}
                        aria-controls="mobile-filter-panel"
                        className={cn(
                            'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition',
                            activeCount > 0
                                ? 'border-copper/50 bg-copper/10 text-copper'
                                : 'border-border bg-card/80 text-muted-foreground',
                        )}
                    >
                        <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
                        Filter
                        {activeCount > 0 && (
                            <span
                                className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-copper px-1 text-[10px] font-bold text-white"
                                aria-label={`${activeCount} ${locale === 'de' ? 'aktive Filter' : 'active filters'}`}
                            >
                                {activeCount}
                            </span>
                        )}
                    </button>

                    {resultText && (
                        <span className="text-xs text-muted-foreground tabular-nums" aria-live="polite" aria-atomic="true">
                            {resultText}
                        </span>
                    )}
                </div>

                {mobileOpen && (
                    <div id="mobile-filter-panel" className="surface-pill mt-3 space-y-4 p-4" role="group" aria-label={locale === 'de' ? 'Filteroptionen' : 'Filter options'}>
                        <Pills
                            options={categoryOptions}
                            activeValue={value.category}
                            onChange={(v) => onChange({ ...value, category: v })}
                            label={locale === 'de' ? 'Kategorie' : 'Category'}
                        />

                        {hasHair && (
                            <FilterChecklist
                                label={locale === 'de' ? 'Haare' : 'Hair'}
                                options={hairOptions}
                                selected={value.hair}
                                onChange={(v) => onChange({ ...value, hair: v })}
                            />
                        )}

                        {hasEyes && (
                            <FilterChecklist
                                label={locale === 'de' ? 'Augen' : 'Eyes'}
                                options={eyeOptions}
                                selected={value.eyes}
                                onChange={(v) => onChange({ ...value, eyes: v })}
                            />
                        )}

                        {hasSkills && (
                            <FilterChecklist
                                label="Skills"
                                options={skillOptions}
                                selected={value.skills}
                                onChange={(v) => onChange({ ...value, skills: v })}
                            />
                        )}

                        {activeCount > 0 && (
                            <button
                                type="button"
                                onClick={clearAll}
                                aria-label={locale === 'de' ? 'Filter zurücksetzen' : 'Clear filters'}
                                className="flex items-center gap-1 text-xs text-copper hover:opacity-70"
                            >
                                <X className="h-3 w-3" aria-hidden="true" />
                                {locale === 'de' ? 'Filter zurücksetzen' : 'Clear filters'}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

/** Inline pill buttons (single select) */
function Pills({
    options,
    activeValue,
    onChange,
    label,
}: {
    options: { label: string; value: string }[]
    activeValue: string
    onChange: (v: string) => void
    label: string
}) {
    return (
        <div
            className="inline-flex flex-wrap rounded-full border border-border/60 bg-card/70 p-1"
            role="radiogroup"
            aria-label={label}
        >
            {options.map((opt) => {
                const active = activeValue === opt.value
                return (
                    <button
                        key={opt.value}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => onChange(opt.value)}
                        className={cn(
                            'rounded-full px-3.5 py-1.5 text-xs font-semibold transition duration-200',
                            active
                                ? 'bg-accent text-accent-foreground shadow-sm'
                                : 'bg-transparent text-muted-foreground hover:text-foreground',
                        )}
                    >
                        {opt.label}
                    </button>
                )
            })}
        </div>
    )
}

function FilterDropdown({
    label,
    options,
    selected,
    onChange,
    locale,
}: {
    label: string
    options: FilterOption[]
    selected: string[]
    onChange: (v: string[]) => void
    locale: string
}) {
    const [open, setOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    const toggle = (val: string) => {
        if (selected.includes(val)) {
            onChange(selected.filter((s) => s !== val))
        } else {
            onChange([...selected, val])
        }
    }

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Escape' && open) {
                setOpen(false)
            }
        },
        [open],
    )

    useEffect(() => {
        if (open) {
            document.addEventListener('keydown', handleKeyDown)
            const handleClickOutside = (e: MouseEvent) => {
                if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                    setOpen(false)
                }
            }
            document.addEventListener('mousedown', handleClickOutside)
            return () => {
                document.removeEventListener('keydown', handleKeyDown)
                document.removeEventListener('mousedown', handleClickOutside)
            }
        }
    }, [open, handleKeyDown])

    const triggerLabel =
        selected.length > 0 ? `${label} · ${selected.length}` : `${label}`

    const listboxId = `filter-listbox-${label.toLowerCase().replace(/\s+/g, '-')}`

    return (
        <div className="relative" ref={containerRef}>
            <button
                type="button"
                onClick={() => setOpen(!open)}
                aria-expanded={open}
                aria-haspopup="listbox"
                aria-controls={open ? listboxId : undefined}
                className={cn(
                    'inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition',
                    selected.length > 0
                        ? 'border-copper/35 bg-copper/10 text-copper'
                        : 'border-border/60 bg-card/70 text-foreground/80 hover:border-border',
                )}
            >
                {triggerLabel}
                <ChevronDown
                    className={cn('h-3.5 w-3.5 transition-transform', open && 'rotate-180')}
                    aria-hidden="true"
                />
            </button>

            {open && (
                <div
                    id={listboxId}
                    role="listbox"
                    aria-label={label}
                    aria-multiselectable="true"
                    className="absolute left-0 top-[calc(100%+0.55rem)] z-20 w-72 rounded-2xl border border-border/70 bg-card/95 p-3 shadow-xl backdrop-blur-md"
                >
                    <div className="mb-2 flex items-center justify-between">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                            {label}
                        </p>
                        {selected.length > 0 && (
                            <button
                                type="button"
                                onClick={() => onChange([])}
                                aria-label={`${locale === 'de' ? 'Zurücksetzen' : 'Clear'} ${label}`}
                                className="text-[10px] font-medium text-copper hover:opacity-80"
                            >
                                {locale === 'de' ? 'Zurücksetzen' : 'Clear'}
                            </button>
                        )}
                    </div>

                    <div className="max-h-56 space-y-1 overflow-auto pr-1">
                        {options.map((opt) => {
                            const active = selected.includes(opt.value)
                            return (
                                <button
                                    key={opt.value}
                                    type="button"
                                    role="option"
                                    aria-selected={active}
                                    onClick={() => toggle(opt.value)}
                                    className={cn(
                                        'flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-xs transition',
                                        active
                                            ? 'border-copper/35 bg-copper/10 text-copper'
                                            : 'border-border/55 bg-card/60 text-foreground/80 hover:border-border',
                                    )}
                                >
                                    <span className="truncate">{opt.label}</span>
                                    <span
                                        className={cn(
                                            'ml-2 inline-flex h-4 w-4 items-center justify-center rounded border',
                                            active
                                                ? 'border-copper/55 bg-copper/15 text-copper'
                                                : 'border-border/70 text-transparent',
                                        )}
                                        aria-hidden="true"
                                    >
                                        <Check className="h-3 w-3" />
                                    </span>
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}

function FilterChecklist({
    label,
    options,
    selected,
    onChange,
}: {
    label: string
    options: FilterOption[]
    selected: string[]
    onChange: (v: string[]) => void
}) {
    const toggle = (val: string) => {
        if (selected.includes(val)) {
            onChange(selected.filter((s) => s !== val))
        } else {
            onChange([...selected, val])
        }
    }

    return (
        <fieldset>
            <legend className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {label}
            </legend>
            <div className="grid grid-cols-2 gap-2" role="group">
                {options.map((opt) => {
                    const active = selected.includes(opt.value)
                    return (
                        <button
                            key={opt.value}
                            type="button"
                            role="checkbox"
                            aria-checked={active}
                            onClick={() => toggle(opt.value)}
                            className={cn(
                                'inline-flex items-center justify-between rounded-xl border px-3 py-2 text-xs font-medium transition',
                                active
                                    ? 'border-copper/45 bg-copper/10 text-copper'
                                    : 'border-border/60 bg-card/70 text-foreground/80',
                            )}
                        >
                            <span className="truncate">{opt.label}</span>
                            <span
                                className={cn(
                                    'ml-2 inline-flex h-4 w-4 items-center justify-center rounded border',
                                    active
                                        ? 'border-copper/55 bg-copper/15 text-copper'
                                        : 'border-border/70 text-transparent',
                                )}
                                aria-hidden="true"
                            >
                                <Check className="h-3 w-3" />
                            </span>
                        </button>
                    )
                })}
            </div>
        </fieldset>
    )
}
