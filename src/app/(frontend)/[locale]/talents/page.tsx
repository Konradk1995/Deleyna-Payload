import { Link } from '@/i18n/navigation'
import { toHref } from '@/utilities/typedHref'
import Image from 'next/image'
import { ArrowLeft, Sparkles, Star, Users } from 'lucide-react'

import { TalentGrid } from '@/components/TalentGrid'
import { TalentsListSchema } from '@/components/seo'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { FeaturedTalentsBlockComponent } from '@/blocks/FeaturedTalents/Component'
import { Button } from '@/components/ui/button'
import { Breadcrumb } from '@/components/Breadcrumb'
import { resolveLink } from '@/utilities/resolveLink'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { fetchTalentsData } from './page.data'
import type { Metadata } from 'next'
import type { Locale } from '@/i18n/config'
import type { Media } from '@/payload-types'

export const revalidate = 3600

type PageProps = {
    params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { locale } = await params
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
    const canonical = `${baseUrl}/${locale}/${locale === 'de' ? 'talente' : 'talents'}`

    try {
        const archive = await getCachedGlobal('talents-archive', 1, locale)

        const title = archive?.metaTitle || (locale === 'de' ? 'Unsere Talente' : 'Our Talent')
        const description =
            archive?.metaDescription ||
            (locale === 'de'
                ? 'Entdecken Sie unsere kuratierten Talente'
                : 'Discover our curated talent roster')
        const keywords = (archive as any)?.metaKeywords as string | undefined

        let ogImageUrl: string | undefined
        // Priority: archive ogImage > global logo
        const archiveOg = archive?.ogImage
        if (archiveOg && typeof archiveOg === 'object') {
            const url = (archiveOg as Media).url
            if (url) ogImageUrl = url.startsWith('http') ? url : `${baseUrl}${url}`
        }
        if (!ogImageUrl) {
            try {
                const seo = await getCachedGlobal('seo', 1, locale)
                const logo = seo?.socialMedia?.logo
                if (logo && typeof logo === 'object') {
                    const url = (logo as Media).url
                    if (url) ogImageUrl = url.startsWith('http') ? url : `${baseUrl}${url}`
                }
            } catch {
                /* ignore */
            }
        }

        return {
            title,
            description,
            ...(keywords ? { keywords } : {}),
            authors: [{ name: 'Deleyna' }],
            robots: { index: !((archive as any)?.noIndex === true), follow: true },
            alternates: {
                canonical,
                languages: {
                    de: `${baseUrl}/de/talente`,
                    en: `${baseUrl}/en/talents`,
                    'x-default': `${baseUrl}/de/talente`,
                },
            },
            openGraph: {
                type: 'website',
                title,
                description,
                url: canonical,
                siteName: 'Deleyna',
                locale: locale === 'de' ? 'de_DE' : 'en_US',
                ...(ogImageUrl
                    ? { images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }] }
                    : {}),
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

    const {
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
    } = await fetchTalentsData(locale as 'de' | 'en')

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

            {/* ── Breadcrumb ── */}
            <div className="container mt-6 mb-2">
                <Breadcrumb
                    items={[
                        { label: locale === 'de' ? 'Startseite' : 'Home', href: '/' },
                        { label: locale === 'de' ? 'Talente' : 'Talents' },
                    ]}
                />
            </div>

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
                    badge={locale === 'de' ? 'Unsere Talente' : 'Our Talents'}
                />
            )}

            {/* 2. CMS Content Blocks (if any) */}
            {layoutBlocks && layoutBlocks.length > 0 && (
                <RenderBlocks blocks={layoutBlocks} locale={locale} />
            )}

            {/* 3. Hero Section (intro to grid) */}
            <section className="padding-section-hero-tight section-atmosphere relative overflow-hidden">
                <div className="hero-grid pointer-events-none absolute inset-0 opacity-25" />
                <div className="pointer-events-none absolute -left-32 top-8 h-72 w-72 rounded-full bg-copper/10 blur-3xl" aria-hidden="true" />
                <div className="pointer-events-none absolute -right-32 bottom-10 h-72 w-72 rounded-full bg-accent/20 blur-3xl" aria-hidden="true" />

                <div className="container">
                    <div className="surface-pill relative overflow-hidden padding-large">
                        <div className="hero-dots pointer-events-none absolute inset-0 opacity-20" />

                        <div className="relative z-10 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
                            <div>
                                <Link
                                    href="/"
                                    className="overline mb-6 inline-flex items-center gap-2 text-copper hover:opacity-80 transition-opacity"
                                >
                                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                                    {locale === 'de' ? 'Zurück' : 'Back'}
                                </Link>

                                <p className="overline-copper mb-4 inline-flex items-center gap-2">
                                    <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                                    {locale === 'de' ? 'Unser Roster' : 'Our Roster'}
                                </p>

                                <h1 className="chrome-text font-display-tight font-heading-1-bold tracking-tight text-balance hyphens-auto [overflow-wrap:anywhere]">
                                    {heroHeadline}
                                </h1>

                                <p className="mt-6 max-w-2xl text-balance text-base leading-relaxed text-foreground/75 md:text-lg">
                                    {heroDescription}
                                </p>

                                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                                    <div className="surface-pill-soft flex items-center gap-3 px-4 py-3">
                                        <Users className="h-4 w-4 shrink-0 text-copper" aria-hidden="true" />
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
                                        <Sparkles className="h-4 w-4 shrink-0 text-copper" aria-hidden="true" />
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
                                        <Star className="h-4 w-4 shrink-0 text-copper" aria-hidden="true" />
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
                                    {heroImage?.url ? (
                                        <Image
                                            src={heroImage.url}
                                            alt={heroImage.alt || heroHeadline || 'Talent showcase'}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 1024px) 100vw, 42vw"
                                            priority
                                        />
                                    ) : (
                                        <div className="absolute inset-0 chrome-gradient opacity-45" />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-media-overlay/45 via-media-overlay/10 to-transparent" />
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
                        filterLabels={filterLabels as { all?: string; dancers?: string; models?: string }}
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
                            <h2 className="chrome-text mb-4 font-heading-3-bold">{ctaHeadline}</h2>
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
                                <Link href={toHref(ctaButtonHref)}>{ctaButtonLabel}</Link>
                            </Button>
                        </div>
                    </div>
                </section>
            )}
        </>
    )
}
