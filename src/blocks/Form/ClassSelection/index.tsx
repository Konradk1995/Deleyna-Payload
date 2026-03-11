'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import type { Control, FieldErrorsImpl, FieldValues, UseFormRegister, UseFormSetValue } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import { CalendarDays, Loader2, User } from 'lucide-react'

import { Label } from '@/components/ui/label'
import {
    Select as SelectComponent,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Width } from '../Width'
import { Error } from '../Error'
import { localizeFieldLabel, requiredScreenReaderText, requiredFieldMessage } from '../fieldI18n'

/* ── Types ── */

interface UpcomingClass {
    id: number
    title: string
    classDate: string
    studioCity?: string
    danceStyle?: string
}

interface Coach {
    id: number
    name: string
    category: string
    coachingDescription?: string
}

type InquiryType = 'class' | 'coaching'

interface ClassSelectionProps {
    name: string
    label?: string
    required?: boolean
    width?: string
    control: Control
    errors: Partial<FieldErrorsImpl>
    register: UseFormRegister<FieldValues>
    setValue: UseFormSetValue<FieldValues>
    locale?: 'de' | 'en'
}

/* ── i18n ── */

const i18n = {
    de: {
        inquiryTypeLabel: 'Art der Anfrage',
        classOption: 'Gruppenunterricht / Kurs',
        coachingOption: 'Privat-Coaching',
        classPlaceholder: 'Kurs auswählen...',
        coachPlaceholder: 'Coach auswählen...',
        loadingClasses: 'Kurse werden geladen...',
        loadingCoaches: 'Coaches werden geladen...',
        noClasses: 'Aktuell keine kommenden Kurse verfügbar.',
        noCoaches: 'Aktuell keine Coaches verfügbar.',
        fetchError: 'Daten konnten nicht geladen werden. Bitte versuche es erneut.',
        fallbackLabel: 'Kurs / Coaching auswählen',
    },
    en: {
        inquiryTypeLabel: 'Type of inquiry',
        classOption: 'Group class',
        coachingOption: 'Private coaching',
        classPlaceholder: 'Select a class...',
        coachPlaceholder: 'Select a coach...',
        loadingClasses: 'Loading classes...',
        loadingCoaches: 'Loading coaches...',
        noClasses: 'No upcoming classes available.',
        noCoaches: 'No coaches available.',
        fetchError: 'Failed to load data. Please try again.',
        fallbackLabel: 'Select class / coaching',
    },
}

/* ── Helpers ── */

function formatClassDate(dateStr: string, locale: string): string {
    return new Date(dateStr).toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
    })
}

function readLocalized(value: unknown, locale: string): string {
    if (!value) return ''
    if (typeof value === 'string') return value
    if (typeof value === 'object') {
        const map = value as Record<string, string | null | undefined>
        return map[locale] || map.de || map.en || ''
    }
    return ''
}

function categoryLabel(cat: string, locale: string): string {
    const labels: Record<string, { de: string; en: string }> = {
        dancer: { de: 'Tänzer/in', en: 'Dancer' },
        model: { de: 'Model', en: 'Model' },
        both: { de: 'Tänzer/in & Model', en: 'Dancer & Model' },
    }
    return labels[cat]?.[locale === 'de' ? 'de' : 'en'] || cat
}

/* ── Component ── */

export const ClassSelection: React.FC<ClassSelectionProps> = ({
    name,
    label,
    required,
    width,
    control,
    errors,
    setValue,
    locale: localeProp,
}) => {
    const params = useParams()
    const locale = localeProp || (typeof params?.locale === 'string' ? params.locale : 'de')
    const lang = locale === 'en' ? 'en' : 'de'
    const t = i18n[lang]
    const localizedLabel = localizeFieldLabel(label, lang) || t.fallbackLabel

    const [inquiryType, setInquiryType] = useState<InquiryType>('class')
    const [classes, setClasses] = useState<UpcomingClass[]>([])
    const [coaches, setCoaches] = useState<Coach[]>([])
    const [loadingClasses, setLoadingClasses] = useState(true)
    const [loadingCoaches, setLoadingCoaches] = useState(true)
    const [fetchError, setFetchError] = useState<string | null>(null)

    // Fetch upcoming classes
    useEffect(() => {
        let cancelled = false

        async function fetchClasses() {
            try {
                const now = new Date().toISOString()
                const res = await fetch(
                    `/api/posts?where[postType][equals]=class&where[classDetails.classDate][greater_than]=${encodeURIComponent(now)}&where[_status][equals]=published&sort=classDetails.classDate&limit=20&depth=0&locale=${lang}`,
                )
                if (!res.ok) return
                const data = await res.json()
                if (cancelled) return

                const upcoming: UpcomingClass[] = (data.docs || [])
                    .filter((p: Record<string, unknown>) => {
                        const d = p.classDetails as Record<string, unknown> | undefined
                        return d?.classDate
                    })
                    .map((p: Record<string, unknown>) => {
                        const d = p.classDetails as Record<string, unknown>
                        return {
                            id: p.id as number,
                            title: p.title as string,
                            classDate: d.classDate as string,
                            studioCity: readLocalized(d.studioCity, lang),
                            danceStyle: readLocalized(d.danceStyle, lang),
                        }
                    })
                setClasses(upcoming)
            } catch {
                if (!cancelled) setFetchError('classes')
            } finally {
                if (!cancelled) setLoadingClasses(false)
            }
        }

        fetchClasses()
        return () => { cancelled = true }
    }, [lang])

    // Fetch coaches (talents with isCoach=true)
    useEffect(() => {
        let cancelled = false

        async function fetchCoaches() {
            try {
                const res = await fetch(
                    `/api/talents?where[isCoach][equals]=true&where[_status][equals]=published&sort=name&limit=50&depth=0&locale=${lang}`,
                )
                if (!res.ok) return
                const data = await res.json()
                if (cancelled) return

                const list: Coach[] = (data.docs || []).map((t: Record<string, unknown>) => ({
                    id: t.id as number,
                    name: t.name as string,
                    category: (t.category as string) || '',
                    coachingDescription: readLocalized(t.coachingDescription, lang),
                }))
                setCoaches(list)
            } catch {
                if (!cancelled) setFetchError('coaches')
            } finally {
                if (!cancelled) setLoadingCoaches(false)
            }
        }

        fetchCoaches()
        return () => { cancelled = true }
    }, [lang])

    // Reset selection when switching type
    const handleTypeChange = (type: InquiryType) => {
        setInquiryType(type)
        setValue(name, '')
    }

    const isLoading = inquiryType === 'class' ? loadingClasses : loadingCoaches
    const loadingText = inquiryType === 'class' ? t.loadingClasses : t.loadingCoaches

    return (
        <Width width={width}>
            <Label className="text-foreground">
                {localizedLabel}
                {required && (
                    <span className="text-destructive">
                        * <span className="sr-only">{requiredScreenReaderText(lang)}</span>
                    </span>
                )}
            </Label>

            {/* Type toggle */}
            <div className="mt-2 flex gap-2">
                <button
                    type="button"
                    onClick={() => handleTypeChange('class')}
                    aria-pressed={inquiryType === 'class'}
                    className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
                        inquiryType === 'class'
                            ? 'border-copper/40 bg-copper/10 text-copper'
                            : 'border-border/60 bg-muted/20 text-muted-foreground hover:border-border hover:text-foreground'
                    }`}
                >
                    <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                    {t.classOption}
                </button>
                <button
                    type="button"
                    onClick={() => handleTypeChange('coaching')}
                    aria-pressed={inquiryType === 'coaching'}
                    className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
                        inquiryType === 'coaching'
                            ? 'border-copper/40 bg-copper/10 text-copper'
                            : 'border-border/60 bg-muted/20 text-muted-foreground hover:border-border hover:text-foreground'
                    }`}
                >
                    <User className="h-3.5 w-3.5" aria-hidden="true" />
                    {t.coachingOption}
                </button>
            </div>

            {/* Selection dropdown */}
            <div className="mt-3">
                {isLoading ? (
                    <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {loadingText}
                    </div>
                ) : fetchError ? (
                    <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-4 text-center text-sm text-destructive" role="alert">
                        {t.fetchError}
                    </div>
                ) : inquiryType === 'class' ? (
                    classes.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-border/60 bg-muted/20 p-4 text-center text-sm text-muted-foreground">
                            {t.noClasses}
                        </div>
                    ) : (
                        <Controller
                            control={control}
                            name={name}
                            rules={{ required: required ? requiredFieldMessage(lang) : false }}
                            render={({ field: { onChange, value } }) => (
                                <SelectComponent onValueChange={onChange} value={value || ''}>
                                    <SelectTrigger className="w-full" id={name}>
                                        <div className="flex items-center gap-2">
                                            <CalendarDays className="h-4 w-4 shrink-0 text-copper" />
                                            <SelectValue placeholder={t.classPlaceholder} />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {classes.map((cls) => {
                                            const dateLabel = formatClassDate(cls.classDate, lang)
                                            const meta = [cls.danceStyle, cls.studioCity].filter(Boolean).join(' · ')
                                            const val = `[Kurs] ${cls.title} — ${dateLabel}${meta ? ` (${meta})` : ''}`

                                            return (
                                                <SelectItem key={cls.id} value={val}>
                                                    <span className="flex flex-col">
                                                        <span className="font-medium">{cls.title}</span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {dateLabel}{meta ? ` · ${meta}` : ''}
                                                        </span>
                                                    </span>
                                                </SelectItem>
                                            )
                                        })}
                                    </SelectContent>
                                </SelectComponent>
                            )}
                        />
                    )
                ) : (
                    coaches.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-border/60 bg-muted/20 p-4 text-center text-sm text-muted-foreground">
                            {t.noCoaches}
                        </div>
                    ) : (
                        <Controller
                            control={control}
                            name={name}
                            rules={{ required: required ? requiredFieldMessage(lang) : false }}
                            render={({ field: { onChange, value } }) => (
                                <SelectComponent onValueChange={onChange} value={value || ''}>
                                    <SelectTrigger className="w-full" id={name}>
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 shrink-0 text-copper" />
                                            <SelectValue placeholder={t.coachPlaceholder} />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {coaches.map((coach) => {
                                            const catLabel = categoryLabel(coach.category, lang)
                                            const val = `[Coaching] ${coach.name} (${catLabel})`

                                            return (
                                                <SelectItem key={coach.id} value={val}>
                                                    <span className="flex flex-col">
                                                        <span className="font-medium">{coach.name}</span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {catLabel}
                                                            {coach.coachingDescription ? ` · ${coach.coachingDescription}` : ''}
                                                        </span>
                                                    </span>
                                                </SelectItem>
                                            )
                                        })}
                                    </SelectContent>
                                </SelectComponent>
                            )}
                        />
                    )
                )}
            </div>

            {errors[name] && <Error name={name} locale={lang} />}
        </Width>
    )
}
