import { getPayload } from 'payload'
import config from '@/payload.config'
import { resolveLocalizedText } from '@/utilities/resolveLocalizedText'
import { HAIR_OPTIONS, EYE_OPTIONS, getHairLabel, getEyeLabel } from '@/lib/constants/talentOptions'
import type { Talent, TalentSkill, TalentsArchive } from '@/payload-types'

export type TalentListItem = {
    id: string
    name: string
    slug: string
    category: 'dancer' | 'model' | 'both'
    imageUrl?: string
    cutoutImageUrl?: string
    cardStyle?: 'sage' | 'peach' | 'cream' | '' | null
    hair?: string[]
    eyes?: string[]
    skills?: string[]
    height?: string
    featured?: boolean
    isCoach?: boolean
}

export async function fetchTalentsData(locale: 'de' | 'en') {
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    // Fetch archive global for CMS-controlled content
    let archive: TalentsArchive | null = null
    try {
        archive = await payload.findGlobal({
            slug: 'talents-archive',
            locale,
            depth: 2,
        })
    } catch {
        // Use defaults
    }

    // Fetch all published talents with measurements + skills for filtering
    let talents: TalentListItem[] = []

    try {
        const talentsResult = await payload.find({
            collection: 'talents',
            locale,
            depth: 1,
            select: {
                name: true,
                slug: true,
                category: true,
                featuredImage: true,
                cutoutImage: true,
                cardStyle: true,
                measurements: true,
                skills: true,
                featured: true,
                isCoach: true,
            },
            where: {
                _status: { equals: 'published' },
            },
            sort: 'sortOrder',
            limit: 100,
        })

        talents = talentsResult.docs.map((talent) => {
            // Resolve skills relationship to title strings
            const skillTitles: string[] = []
            if (Array.isArray(talent.skills)) {
                for (const s of talent.skills) {
                    if (typeof s === 'object' && s !== null && 'title' in s) {
                        const localizedTitle = resolveLocalizedText(
                            (s as TalentSkill).title,
                            locale,
                        )
                        if (localizedTitle) skillTitles.push(localizedTitle)
                    }
                }
            }

            return {
                id: String(talent.id),
                name: talent.name,
                slug: talent.slug || '',
                category: talent.category as 'dancer' | 'model' | 'both',
                imageUrl:
                    typeof talent.featuredImage === 'object' && talent.featuredImage?.url
                        ? talent.featuredImage.url
                        : undefined,
                cutoutImageUrl:
                    typeof talent.cutoutImage === 'object' && talent.cutoutImage?.url
                        ? talent.cutoutImage.url
                        : undefined,
                cardStyle: talent.cardStyle ?? undefined,
                hair: Array.isArray(talent.measurements?.hair)
                    ? talent.measurements.hair
                    : undefined,
                eyes: Array.isArray(talent.measurements?.eyes)
                    ? talent.measurements.eyes
                    : undefined,
                skills: skillTitles.length > 0 ? skillTitles : undefined,
                height: talent.measurements?.height || undefined,
                featured: talent.featured || false,
                isCoach: talent.isCoach || false,
            }
        })
    } catch (error) {
        console.error('Error fetching talents:', error)
    }

    // Showcase talents
    const showcaseEnabled = archive?.showcaseEnabled ?? true
    const showcaseMode = archive?.showcaseMode || 'featured'
    const showcaseMaxSlides = archive?.showcaseMaxSlides || 8

    let showcaseTalents: TalentListItem[] = []
    if (showcaseEnabled) {
        if (showcaseMode === 'manual' && Array.isArray(archive?.showcaseTalents)) {
            // Manual: resolve relationship IDs to talent data
            const manualIds = archive.showcaseTalents.map((t: Talent | number) =>
                typeof t === 'object' ? String(t.id) : String(t),
            )
            showcaseTalents = manualIds
                .map((id: string) => talents.find((t) => t.id === id))
                .filter(Boolean)
                .slice(0, showcaseMaxSlides) as TalentListItem[]
        } else {
            // Auto: use featured talents
            showcaseTalents = talents.filter((t) => t.featured).slice(0, showcaseMaxSlides)
        }
    }

    // Derive unique hair and eye values for filter pills (using constants for labels)
    const usedHairValues = new Set(talents.flatMap((t) => t.hair || []))
    const hairFilterOptions = HAIR_OPTIONS.filter((o) => usedHairValues.has(o.value)).map((o) => ({
        label: getHairLabel(o.value, locale === 'en' ? 'en' : 'de'),
        value: o.value,
    }))

    const usedEyeValues = new Set(talents.flatMap((t) => t.eyes || []))
    const eyeFilterOptions = EYE_OPTIONS.filter((o) => usedEyeValues.has(o.value)).map((o) => ({
        label: getEyeLabel(o.value, locale === 'en' ? 'en' : 'de'),
        value: o.value,
    }))

    // Derive unique skill values from talent data
    const usedSkills = [...new Set(talents.flatMap((t) => t.skills || []))].sort()
    const skillFilterOptions = usedSkills.map((s) => ({ label: s, value: s }))

    const dancerCount = talents.filter(
        (talent) => talent.category === 'dancer' || talent.category === 'both',
    ).length
    const modelCount = talents.filter(
        (talent) => talent.category === 'model' || talent.category === 'both',
    ).length

    const featuredSpotlights = talents.filter((talent) => talent.featured).slice(0, 2)
    const heroSpotlights = featuredSpotlights.length >= 2 ? featuredSpotlights : talents.slice(0, 2)

    return {
        archive,
        talents,
        showcaseEnabled,
        showcaseTalents,
        hairFilterOptions,
        eyeFilterOptions,
        skillFilterOptions,
        dancerCount,
        modelCount,
        heroSpotlights,
    }
}
