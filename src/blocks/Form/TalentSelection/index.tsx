'use client'

import React, { useEffect } from 'react'
import { useParams } from 'next/navigation'
import type { FieldValues, UseFormRegister, UseFormSetValue } from 'react-hook-form'
import { useSelection } from '@/providers/Dancefloor'
import { Label } from '@/components/ui/label'
import { Width } from '../Width'
import { localizeFieldLabel, requiredScreenReaderText } from '../fieldI18n'

const emptyMessages = {
    de: 'Keine Talente ausgewählt. Du kannst trotzdem anfragen und unten dein gewünschtes Profil beschreiben.',
    en: 'No talents selected. You can still submit and describe your preferred profile below.',
}

interface TalentSelectionProps {
    name: string
    label?: string
    required?: boolean
    width?: string
    setValue: UseFormSetValue<FieldValues>
    register: UseFormRegister<FieldValues>
}

export const TalentSelection: React.FC<TalentSelectionProps> = ({
    name,
    label,
    required,
    width,
    setValue,
    register,
}) => {
    const params = useParams()
    const locale = typeof params?.locale === 'string' ? params.locale : 'de'
    const { talents } = useSelection()
    const localizedLabel = localizeFieldLabel(label, locale === 'en' ? 'en' : 'de')

    const serialized =
        talents.length > 0 ? talents.map((t) => `${t.name} (ID: ${t.id})`).join(', ') : ''

    useEffect(() => {
        setValue(name, serialized)
    }, [name, serialized, setValue])

    return (
        <Width width={width}>
            <input type="hidden" {...register(name)} value={serialized} readOnly />
            <Label className="text-foreground">
                {localizedLabel || (locale === 'en' ? 'Selected Talents' : 'Ausgewählte Talente')}
                {required && (
                    <span className="text-destructive">
                        *{' '}
                        <span className="sr-only">
                            {requiredScreenReaderText(locale === 'en' ? 'en' : 'de')}
                        </span>
                    </span>
                )}
            </Label>
            {talents.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-1 duration-500">
                    {talents.map((t) => (
                        <span
                            key={t.id}
                            className="inline-flex items-center gap-1.5 rounded-full border border-copper/20 bg-copper/5 px-4 py-2 text-sm font-semibold text-copper shadow-sm backdrop-blur-sm transition hover:bg-copper/10"
                        >
                            <span className="h-1.5 w-1.5 rounded-full bg-copper shadow-copper-glow" />
                            {t.name}
                        </span>
                    ))}
                </div>
            ) : (
                <div className="mt-3 rounded-2xl border border-dashed border-border/60 bg-muted/20 p-6 text-center animate-in fade-in duration-500">
                    <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                        {emptyMessages[locale as keyof typeof emptyMessages] || emptyMessages.de}
                    </p>
                </div>
            )}
        </Width>
    )
}
