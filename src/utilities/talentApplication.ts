import type { Talent } from '@/payload-types'
import { EYE_OPTIONS, HAIR_OPTIONS } from '@/lib/constants/talentOptions'

type SubmissionEntry = {
    field?: string | null
    value?: unknown
}

type HairOption = NonNullable<NonNullable<Talent['measurements']>['hair']>[number]
type EyeOption = NonNullable<NonNullable<Talent['measurements']>['eyes']>[number]

const VALID_HAIR = new Set<string>(HAIR_OPTIONS.map((option) => option.value))
const VALID_EYES = new Set<string>(EYE_OPTIONS.map((option) => option.value))
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const HAIR_SYNONYMS: Record<string, HairOption> = {
    black: 'black',
    schwarz: 'black',
    brown: 'brown',
    braun: 'brown',
    blonde: 'blonde',
    blond: 'blonde',
    red: 'red',
    rot: 'red',
    auburn: 'auburn',
    gray: 'gray',
    grau: 'gray',
    white: 'white',
    weiss: 'white',
    highlights: 'highlights',
    other: 'other',
    andere: 'other',
}

const EYE_SYNONYMS: Record<string, EyeOption> = {
    brown: 'brown',
    braun: 'brown',
    blue: 'blue',
    blau: 'blue',
    green: 'green',
    grun: 'green',
    hazel: 'hazel',
    gray: 'gray',
    grau: 'gray',
    amber: 'amber',
    bernstein: 'amber',
}

export type TalentCreateData = Pick<Talent, 'name' | 'category' | 'bio' | 'slug'> &
    Partial<
        Pick<
            Talent,
            | 'bookingEmail'
            | 'measurements'
            | 'socialMedia'
            | '_status'
            | 'featuredImage'
            | 'galleryImages'
        >
    >

export type TalentApplicationBuildResult = {
    talentData: TalentCreateData
    validationWarnings: string[]
}

export function extractSubmissionFields(submissionData: unknown): Record<string, string> {
    const fields: Record<string, string> = {}
    if (!Array.isArray(submissionData)) return fields

    for (const rawEntry of submissionData as SubmissionEntry[]) {
        const field = typeof rawEntry?.field === 'string' ? rawEntry.field.trim() : ''
        if (!field) continue

        const rawValue = rawEntry?.value
        if (rawValue === null || rawValue === undefined) continue

        const value = String(rawValue).trim()
        if (!value) continue

        fields[field] = value
    }

    return fields
}

function mapCategory(rawCategory: string): 'dancer' | 'model' | 'both' {
    const value = rawCategory.toLowerCase()

    if (value === 'both') return 'both'
    if (value.includes('model') && (value.includes('danc') || value.includes('tanz'))) {
        return 'both'
    }
    if (value.includes('model')) return 'model'
    return 'dancer'
}

function normalizeTextToken(value: string): string {
    return value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/ß/g, 'ss')
        .trim()
}

function parseNumericValue(raw?: string): number | null {
    if (!raw) return null
    const normalized = raw.replace(/,/g, '.').replace(/[^0-9.]+/g, '')
    if (!normalized) return null

    const parsed = Number.parseFloat(normalized)
    return Number.isFinite(parsed) ? parsed : null
}

function formatMeasurement(value: number, suffix: 'cm' | 'EU', decimals: number): string {
    const formatted =
        decimals > 0
            ? value.toFixed(decimals).replace(/\.0+$/, '')
            : String(Math.round(value))

    return `${formatted} ${suffix}`
}

function normalizeMeasurementValue(
    rawValue: string | undefined,
    config: {
        label: string
        suffix: 'cm' | 'EU'
        min: number
        max: number
        decimals: number
    },
    warnings: string[],
): string {
    if (!rawValue) return ''

    const parsed = parseNumericValue(rawValue)
    if (parsed === null) {
        warnings.push(`${config.label}: keine gültige Zahl erkannt (Eingabe: "${rawValue}")`)
        return ''
    }

    if (parsed < config.min || parsed > config.max) {
        warnings.push(
            `${config.label}: außerhalb plausibler Range (${config.min}-${config.max} ${config.suffix}, Eingabe: "${rawValue}")`,
        )
        return ''
    }

    return formatMeasurement(parsed, config.suffix, config.decimals)
}

function normalizeHandle(value?: string): string {
    if (!value) return ''
    const trimmed = value.trim()
    if (!trimmed) return ''
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed
    if (trimmed.startsWith('@')) return trimmed
    return `@${trimmed}`
}

function normalizeWebsite(value?: string): string {
    if (!value) return ''
    const trimmed = value.trim()
    if (!trimmed) return ''
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed
    return `https://${trimmed}`
}

function toSlug(value: string, suffix?: string): string {
    const slugBase = value
        .toLowerCase()
        .replace(/ä/g, 'ae')
        .replace(/ö/g, 'oe')
        .replace(/ü/g, 'ue')
        .replace(/ß/g, 'ss')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

    const cleanSuffix = suffix
        ? suffix
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)/g, '')
        : ''

    if (slugBase && cleanSuffix) return `${slugBase}-${cleanSuffix}`
    if (slugBase) return slugBase
    return `talent-${Date.now().toString().slice(-6)}`
}

function toHairValues(value?: string): HairOption[] {
    if (!value) return []

    const tokens = value.split(/[,/;|]+/g)
    const mapped = tokens
        .map((token) => normalizeTextToken(token))
        .map((token) => HAIR_SYNONYMS[token] || (VALID_HAIR.has(token) ? (token as HairOption) : null))
        .filter((token): token is HairOption => Boolean(token))

    return Array.from(new Set(mapped))
}

function toEyeValues(value?: string): EyeOption[] {
    if (!value) return []

    const tokens = value.split(/[,/;|]+/g)
    const mapped = tokens
        .map((token) => normalizeTextToken(token))
        .map((token) => EYE_SYNONYMS[token] || (VALID_EYES.has(token) ? (token as EyeOption) : null))
        .filter((token): token is EyeOption => Boolean(token))

    return Array.from(new Set(mapped))
}

function parsePortfolioImageIds(raw?: string): number[] {
    if (!raw) return []

    try {
        const parsed = JSON.parse(raw) as unknown
        if (Array.isArray(parsed)) {
            return parsed
                .map((entry) => {
                    if (typeof entry === 'number') return entry
                    if (
                        entry &&
                        typeof entry === 'object' &&
                        'id' in entry &&
                        typeof (entry as { id?: unknown }).id === 'number'
                    ) {
                        return (entry as { id: number }).id
                    }
                    return null
                })
                .filter((id): id is number => typeof id === 'number')
        }
    } catch {
        // ignore and fallback
    }

    return raw
        .split(',')
        .map((token) => Number(token.trim()))
        .filter((num) => Number.isFinite(num) && num > 0)
}

export function buildTalentApplicationResult(
    fields: Record<string, string>,
    options?: { publish?: boolean; slugSuffix?: string },
): TalentApplicationBuildResult {
    const validationWarnings: string[] = []

    const firstName = fields.firstName || fields.vorname || ''
    const lastName = fields.lastName || fields.nachname || ''
    const fullName = `${firstName} ${lastName}`.trim()
    const fallbackName = fields.name?.trim() || ''
    const name = fullName || fallbackName || 'Neues Talent'
    const category = mapCategory(fields.category || fields.kategorie || '')

    const portfolioImageIds = parsePortfolioImageIds(fields.portfolioImages)
    const featuredImage = portfolioImageIds[0]
    const galleryImages = portfolioImageIds.slice(1, 7).map((id, index) => ({
        image: id,
        caption: `Application upload ${index + 1}`,
    }))

    const email = fields.email || fields['e-mail'] || ''
    const bookingEmail = EMAIL_REGEX.test(email) ? email : ''
    if (email && !bookingEmail) {
        validationWarnings.push(`E-Mail ungültig: "${email}"`)
    }

    if (!featuredImage) {
        validationWarnings.push('Keine Portfolio-Bilder erkannt.')
    }

    const height = normalizeMeasurementValue(
        fields.height || fields.groesse,
        {
            label: 'Größe',
            suffix: 'cm',
            min: 130,
            max: 230,
            decimals: 0,
        },
        validationWarnings,
    )

    const bust = normalizeMeasurementValue(
        fields.bust || fields.brust,
        {
            label: 'Brust',
            suffix: 'cm',
            min: 50,
            max: 180,
            decimals: 0,
        },
        validationWarnings,
    )

    const waist = normalizeMeasurementValue(
        fields.waist || fields.taille,
        {
            label: 'Taille',
            suffix: 'cm',
            min: 40,
            max: 150,
            decimals: 0,
        },
        validationWarnings,
    )

    const hips = normalizeMeasurementValue(
        fields.hips || fields.huefte || fields.hüfte,
        {
            label: 'Hüfte',
            suffix: 'cm',
            min: 50,
            max: 190,
            decimals: 0,
        },
        validationWarnings,
    )

    const shoeSize = normalizeMeasurementValue(
        fields.shoeSize || fields.schuhgroesse || fields.schuhgröße,
        {
            label: 'Schuhgröße',
            suffix: 'EU',
            min: 20,
            max: 55,
            decimals: 1,
        },
        validationWarnings,
    )

    const hair = toHairValues(fields.hairColor || fields.haarfarbe)
    const eyes = toEyeValues(fields.eyeColor || fields.augenfarbe)

    if ((fields.hairColor || fields.haarfarbe) && hair.length === 0) {
        validationWarnings.push(`Haarfarbe nicht gemappt: "${fields.hairColor || fields.haarfarbe}"`)
    }

    if ((fields.eyeColor || fields.augenfarbe) && eyes.length === 0) {
        validationWarnings.push(`Augenfarbe nicht gemappt: "${fields.eyeColor || fields.augenfarbe}"`)
    }

    const rawBio = fields.aboutYou || fields.ueberDich || fields.about || ''
    const bio = rawBio.trim() || 'Bewerbung über das Talent-Formular eingegangen.'

    const talentData: TalentCreateData = {
        name,
        slug: toSlug(name, options?.slugSuffix),
        category,
        bio,
        bookingEmail,
        measurements: {
            height,
            bust,
            waist,
            hips,
            shoeSize,
            confectionSize: (fields.confectionSize || fields.konfektionsgroesse || '').trim(),
            hair,
            eyes,
        },
        socialMedia: {
            instagram: normalizeHandle(fields.instagram),
            tiktok: normalizeHandle(fields.tiktok),
            website: normalizeWebsite(fields.website),
        },
        ...(featuredImage ? { featuredImage } : {}),
        ...(galleryImages.length > 0 ? { galleryImages } : {}),
        _status: options?.publish ? 'published' : 'draft',
    }

    return {
        talentData,
        validationWarnings,
    }
}

export function buildTalentDataFromApplication(
    fields: Record<string, string>,
    options?: { publish?: boolean; slugSuffix?: string },
): TalentCreateData {
    return buildTalentApplicationResult(fields, options).talentData
}

export function formatApplicationValidationNotes(warnings: string[]): string {
    if (warnings.length === 0) {
        return 'Keine Auffälligkeiten bei der automatischen Validierung.'
    }

    return warnings.map((warning) => `• ${warning}`).join('\n')
}
