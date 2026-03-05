export const HAIR_OPTIONS = [
    { label: 'Schwarz / Black', value: 'black' },
    { label: 'Braun / Brown', value: 'brown' },
    { label: 'Blond / Blonde', value: 'blonde' },
    { label: 'Rot / Red', value: 'red' },
    { label: 'Auburn', value: 'auburn' },
    { label: 'Grau / Gray', value: 'gray' },
    { label: 'Weiß / White', value: 'white' },
    { label: 'Highlights', value: 'highlights' },
    { label: 'Andere / Other', value: 'other' },
] as const

export const EYE_OPTIONS = [
    { label: 'Braun / Brown', value: 'brown' },
    { label: 'Blau / Blue', value: 'blue' },
    { label: 'Grün / Green', value: 'green' },
    { label: 'Hazel', value: 'hazel' },
    { label: 'Grau / Gray', value: 'gray' },
    { label: 'Bernstein / Amber', value: 'amber' },
] as const

export const LANGUAGE_OPTIONS = [
    { label: 'Deutsch', value: 'de' },
    { label: 'English', value: 'en' },
    { label: 'Français', value: 'fr' },
    { label: 'Español', value: 'es' },
    { label: 'Italiano', value: 'it' },
    { label: 'Português', value: 'pt' },
    { label: 'Русский', value: 'ru' },
    { label: 'Türkçe', value: 'tr' },
    { label: 'Polski', value: 'pl' },
    { label: 'Nederlands', value: 'nl' },
    { label: '中文', value: 'zh' },
    { label: '日本語', value: 'ja' },
    { label: '한국어', value: 'ko' },
    { label: 'العربية', value: 'ar' },
    { label: 'हिन्दी', value: 'hi' },
    { label: 'Mandarin', value: 'mandarin' },
] as const

type TalentOptionLocale = 'de' | 'en'

const HAIR_LABELS: Record<string, Record<TalentOptionLocale, string>> = {
    black: { de: 'Schwarz', en: 'Black' },
    brown: { de: 'Braun', en: 'Brown' },
    blonde: { de: 'Blond', en: 'Blonde' },
    red: { de: 'Rot', en: 'Red' },
    auburn: { de: 'Auburn', en: 'Auburn' },
    gray: { de: 'Grau', en: 'Gray' },
    white: { de: 'Weiß', en: 'White' },
    highlights: { de: 'Highlights', en: 'Highlights' },
    other: { de: 'Andere', en: 'Other' },
}

const EYE_LABELS: Record<string, Record<TalentOptionLocale, string>> = {
    brown: { de: 'Braun', en: 'Brown' },
    blue: { de: 'Blau', en: 'Blue' },
    green: { de: 'Grün', en: 'Green' },
    hazel: { de: 'Hazel', en: 'Hazel' },
    gray: { de: 'Grau', en: 'Gray' },
    amber: { de: 'Bernstein', en: 'Amber' },
}

function normalizeOptionToken(value: string): string {
    return value.trim().toLowerCase()
}

function resolveCanonicalValue(
    value: string,
    localizedLabels: Record<string, Record<TalentOptionLocale, string>>,
): string | null {
    const normalized = normalizeOptionToken(value)
    if (!normalized) return null

    for (const option of [...HAIR_OPTIONS, ...EYE_OPTIONS]) {
        if (option.value === normalized) return option.value
    }

    for (const [optionValue, labels] of Object.entries(localizedLabels)) {
        const bilingual = `${labels.de} / ${labels.en}`
        if (
            normalizeOptionToken(labels.de) === normalized ||
            normalizeOptionToken(labels.en) === normalized ||
            normalizeOptionToken(bilingual) === normalized
        ) {
            return optionValue
        }
    }

    // Handle mixed labels like "Braun / Brown" or "Brown/Braun" robustly.
    if (normalized.includes('/')) {
        const parts = normalized
            .split('/')
            .map((part) => part.trim())
            .filter(Boolean)

        for (const part of parts) {
            const nested = resolveCanonicalValue(part, localizedLabels)
            if (nested) return nested
        }
    }

    return null
}

/** Map a value code back to its human-readable label */
export function getHairLabel(value: string, locale: TalentOptionLocale = 'de'): string {
    const canonical = resolveCanonicalValue(value, HAIR_LABELS)
    if (!canonical) return value
    return HAIR_LABELS[canonical]?.[locale] ?? value
}

export function getEyeLabel(value: string, locale: TalentOptionLocale = 'de'): string {
    const canonical = resolveCanonicalValue(value, EYE_LABELS)
    if (!canonical) return value
    return EYE_LABELS[canonical]?.[locale] ?? value
}

export function getLanguageLabel(value: string): string {
    return LANGUAGE_OPTIONS.find((o) => o.value === value)?.label ?? value
}
