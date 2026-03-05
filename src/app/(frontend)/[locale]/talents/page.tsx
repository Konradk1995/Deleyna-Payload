import { getPayload } from 'payload'
import config from '@/payload.config'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import { ArrowLeft, Sparkles, Star, Users } from 'lucide-react'

import { TalentGrid } from '@/components/TalentGrid'
import { TalentsListSchema } from '@/components/seo'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { FeaturedTalentsBlockComponent } from '@/blocks/FeaturedTalents/Component'
import { Button } from '@/components/ui/button'
import { resolveLink } from '@/utilities/resolveLink'
import { HAIR_OPTIONS, EYE_OPTIONS, getEyeLabel, getHairLabel } from '@/lib/constants/talentOptions'
import type { Metadata } from 'next'
import type { Locale } from '@/i18n/config'
import type { Media, Talent, TalentSkill } from '@/payload-types'

export const revalidate = 3600

type PageProps = {
    params: Promise<{ locale: string }>
}

type TalentListItem = {
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
}

function resolveLocalizedText(value: unknown, locale: 'de' | 'en'): string {
    if (typeof value === 'string') return value
    if (value && typeof value === 'object') {
        const map = value as Record<string, unknown>
        const localized = locale === 'en' ? map.en ?? map.de : map.de ?? map.en
        return typeof localized === 'string' ? localized : ''
    }
    return ''
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { locale } = await params
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
    const canonical = `${baseUrl}/${locale}/${locale === 'de' ? 'talente' : 'talents'}`

    try {
        const archive = await payload.findGlobal({
            slug: 'talents-archive',
            locale: locale as 'de' | 'en',
        })

        const title = archive?.metaTitle || (locale === 'de' ? 'Unsere Talente' : 'Our Talent')
        const description =
            archive?.metaDescription ||
            (locale === 'de'
                ? 'Entdecken Sie unsere kuratierten Talente'
                : 'Discover our curated talent roster')

        let ogImageUrl: string | undefined
        try {
            const seo = await payload.findGlobal({ slug: 'seo', locale: locale as 'de' | 'en' })
            const logo = seo?.socialMedia?.logo
            if (logo && typeof logo === 'object') {
                const url = (logo as Media).url
                if (url) ogImageUrl = url.startsWith('http') ? url : `${baseUrl}${url}`
            }
        } catch { /* ignore */ }

        return {
            title,
            description,
            alternates: {
                canonical,
                languages: {
                    de: `${baseUrl}/de/talente`,
                    en: `${baseUrl}/en/talents`,
                },
            },
            openGraph: {
                type: 'website',
                title,
                description,
                url: canonical,
                locale: locale === 'de' ? 'de_DE' : 'en_US',
                ...(ogImageUrl ? { images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }] } : {}),
            },
            twitter: {
                card: 'summary_large_image',
                title,
                description,
                ...(ogImageUrl ? { images: [ogImageUrl] } : {}),
            },
        }
    } catch {
        return {
            title: locale === 'de' ? 'Unsere Talente' : 'Our Talent',
            alternates: {
                canonical,
                languages: {
                    de: `${baseUrl}/de/talente`,
                    en: `${baseUrl}/en/talents`,
                },
            },
        }
    }
}

export default async function TalentsPage({ params }: PageProps) {
    const { locale } = await params
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    // Fetch archive global for CMS-controlled content
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let archive: any = null
    try {
        archive = await payload.findGlobal({
            slug: 'talents-archive',
            locale: locale as 'de' | 'en',
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
            locale: locale as 'de' | 'en',
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
                            locale as 'de' | 'en',
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

    // CMS content with defaults
    const heroHeadline =
        archive?.heroHeadline || (locale === 'de' ? 'Unsere Talente' : 'Our Talent')
    const heroDescription =
        archive?.heroDescription ||
        (locale === 'de'
            ? 'Entdecken Sie unsere kuratierten Tänzer und Models.'
            : 'Discover our curated roster of exceptional dancers and models.')
    const heroImage =
        typeof archive?.heroImage === 'object' && archive?.heroImage?.url ? archive.heroImage : null
    const showFilters = archive?.showFilters ?? true
    const showHairFilter = archive?.showHairFilter ?? true
    const showEyeFilter = archive?.showEyeFilter ?? true
    const showSkillsFilter = archive?.showSkillsFilter ?? true
    const filterLabels = archive?.filterLabels || {
        all: locale === 'de' ? 'Alle' : 'All',
        dancers: locale === 'de' ? 'Tänzer' : 'Dancers',
        models: 'Models',
    }
    const showCta = archive?.showCta ?? true
    const ctaHeadline =
        archive?.ctaHeadline || (locale === 'de' ? 'Du bist ein Talent?' : 'Are you a talent?')
    const ctaDescription =
        archive?.ctaDescription ||
        (locale === 'de'
            ? 'Bewirb dich jetzt und werde Teil unserer Agentur.'
            : 'Apply now and become part of our agency.')
    const ctaButtonEntry =
        Array.isArray(archive?.ctaButton) && archive.ctaButton[0] ? archive.ctaButton[0] : null
    const ctaLink = ctaButtonEntry?.link ? resolveLink(ctaButtonEntry.link, locale) : null
    const ctaButtonHref = ctaLink?.href ?? (locale === 'de' ? '/kontakt' : '/contact')
    const ctaButtonLabel = ctaLink?.label ?? (locale === 'de' ? 'Jetzt bewerben' : 'Apply Now')

    // CMS blocks
    const layoutBlocks = archive?.layout || null

    const dancerCount = talents.filter(
        (talent) => talent.category === 'dancer' || talent.category === 'both',
    ).length
    const modelCount = talents.filter(
        (talent) => talent.category === 'model' || talent.category === 'both',
    ).length

    const featuredSpotlights = talents.filter((talent) => talent.featured).slice(0, 2)
    const heroSpotlights = featuredSpotlights.length >= 2 ? featuredSpotlights : talents.slice(0, 2)

    const formatCategory = (category: 'dancer' | 'model' | 'both') => {
        if (locale === 'de') {
            if (category === 'both') return 'Tänzer/in & Model'
            if (category === 'dancer') return 'Tänzer/in'
            return 'Model'
        }
        if (category === 'both') return 'Dancer & Model'
        if (category === 'dancer') return 'Dancer'
        return 'Model'
    }

    return (
        <>
            {/* Schema.org Structured Data */}
            <TalentsListSchema talents={talents} totalCount={talents.length} locale={locale} />

            {/* 1. Talent Showcase (if enabled and has talents) */}
            {showcaseEnabled && showcaseTalents.length > 0 && (
                <FeaturedTalentsBlockComponent
                    blockType="featuredTalents"
                    talents={showcaseTalents}
                    layout="premium"
                    size="hero"
                    randomize={true}
                    locale={locale}
                    title={heroHeadline}
                    overline={locale === 'de' ? 'Unsere Talente' : 'Our Talents'}
                />
            )}

            {/* 2. CMS Content Blocks (if any) */}
            {layoutBlocks && layoutBlocks.length > 0 && (
                <RenderBlocks blocks={layoutBlocks} locale={locale} />
            )}

            {/* 3. Hero Section (intro to grid) */}
            <section className="padding-section-hero section-atmosphere relative overflow-hidden">
                <div className="hero-grid pointer-events-none absolute inset-0 opacity-25" />
                <div className="pointer-events-none absolute -left-32 top-8 h-72 w-72 rounded-full bg-copper/10 blur-3xl" />
                <div className="pointer-events-none absolute -right-32 bottom-10 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />

                <div className="container">
                        <div className="surface-pill relative overflow-hidden padding-large">
                        <div className="hero-dots pointer-events-none absolute inset-0 opacity-20" />

                        <div className="relative z-10 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
                            <div>
                                <Link
                                    href="/"
                                    className="overline mb-6 inline-flex items-center gap-2 text-copper hover:opacity-80 transition-opacity"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    {locale === 'de' ? 'Zurück' : 'Back'}
                                </Link>

                                <p className="overline-copper mb-4 inline-flex items-center gap-2">
                                    <Sparkles className="h-3.5 w-3.5" />
                                    {locale === 'de' ? 'Unser Roster' : 'Our Roster'}
                                </p>

                                <h1 className="chrome-text font-display-tight font-heading-1-bold leading-[1.04] tracking-tight text-balance hyphens-auto [overflow-wrap:anywhere] pb-[0.03em]">
                                    {heroHeadline}
                                </h1>

                                <p className="mt-6 max-w-2xl text-balance text-base leading-relaxed text-foreground/75 md:text-lg">
                                    {heroDescription}
                                </p>

                                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                                    <div className="surface-pill-soft flex items-center gap-3 px-4 py-3">
                                        <Users className="h-4 w-4 text-copper" />
                                        <div>
                                            <p className="badge-pill badge-pill-sm badge-pill-surface">
                                                {locale === 'de' ? 'Talente' : 'Talents'}
                                            </p>
                                            <p className="text-lg font-semibold tabular-nums">
                                                {talents.length}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="surface-pill-soft flex items-center gap-3 px-4 py-3">
                                        <Sparkles className="h-4 w-4 text-copper" />
                                        <div>
                                            <p className="badge-pill badge-pill-sm badge-pill-surface">
                                                {locale === 'de' ? 'Tanz' : 'Dance'}
                                            </p>
                                            <p className="text-lg font-semibold tabular-nums">
                                                {dancerCount}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="surface-pill-soft flex items-center gap-3 px-4 py-3">
                                        <Star className="h-4 w-4 text-copper" />
                                        <div>
                                            <p className="badge-pill badge-pill-sm badge-pill-surface">
                                                {locale === 'de' ? 'Model' : 'Model'}
                                            </p>
                                            <p className="text-lg font-semibold tabular-nums">
                                                {modelCount}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-border/70 bg-card/70 shadow-xl">
                                    {heroImage ? (
                                        <Image
                                            src={heroImage.url}
                                            alt={heroImage.alt || heroHeadline}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 1024px) 100vw, 42vw"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 chrome-gradient opacity-45" />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
                                </div>

                                {heroSpotlights[0] && (
                                    <div className="surface-pill-soft absolute -left-3 top-4 max-w-[68%] px-4 py-3 sm:-left-5">
                                        <p className="badge-pill badge-pill-sm badge-pill-surface">
                                            {locale === 'de' ? 'Spotlight' : 'Spotlight'}
                                        </p>
                                        <p className="mt-1 truncate text-sm font-semibold">
                                            {heroSpotlights[0].name}
                                        </p>
                                        <p className="text-xs text-copper">
                                            {formatCategory(heroSpotlights[0].category)}
                                        </p>
                                    </div>
                                )}

                                {heroSpotlights[1] && (
                                    <div className="surface-pill-soft absolute -bottom-3 right-3 max-w-[72%] px-4 py-3 sm:-bottom-5 sm:right-5">
                                        <p className="badge-pill badge-pill-sm badge-pill-surface">
                                            {locale === 'de' ? 'Featured' : 'Featured'}
                                        </p>
                                        <p className="mt-1 truncate text-sm font-semibold">
                                            {heroSpotlights[1].name}
                                        </p>
                                        <p className="text-xs text-copper">
                                            {formatCategory(heroSpotlights[1].category)}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Talent Grid with Advanced Filters */}
            <section className="padding-large section-atmosphere">
                <div className="container">
                    <TalentGrid
                        talents={talents}
                        showFilters={showFilters}
                        filterLabels={filterLabels}
                        locale={locale as Locale}
                        showHairFilter={showHairFilter}
                        showEyeFilter={showEyeFilter}
                        showSkillsFilter={showSkillsFilter}
                        hairOptions={hairFilterOptions}
                        eyeOptions={eyeFilterOptions}
                        skillOptions={skillFilterOptions}
                    />
                </div>
            </section>

            {/* 5. CTA Section */}
            {showCta && (
                <section className="padding-large section-atmosphere bg-muted/30">
                    <div className="container">
                        <div className="mx-auto max-w-3xl text-center">
                            <h2 className="chrome-text mb-4 font-heading-3-bold">
                                {ctaHeadline}
                            </h2>
                            {ctaDescription && (
                                <p className="text-muted-foreground mb-8 leading-relaxed">
                                    {ctaDescription}
                                </p>
                            )}
                            <Button
                                asChild
                                variant="primary"
                                size="lg"
                                className="rounded-full px-8"
                            >
                                <Link href={ctaButtonHref as never}>{ctaButtonLabel}</Link>
                            </Button>
                        </div>
                    </div>
                </section>
            )}
        </>
    )
}
