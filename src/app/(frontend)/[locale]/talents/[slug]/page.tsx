import { getPayload } from 'payload'
import config from '@/payload.config'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { getCachedDocument } from '@/utilities/getDocument'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import { ArrowLeft, Mail, Instagram } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { AddToSelectionButton } from '@/components/Dancefloor/AddToDancefloorButton'
import { MeasurementsBox } from '@/components/MeasurementsBox'
import { SkillTags } from '@/components/SkillTags'
import { ExperienceList } from '@/components/ExperienceList'
import { TalentSchema } from '@/components/seo'
import { QuickStats } from '@/components/TalentDetail/QuickStats'
import { GalleryLightbox } from '@/components/TalentDetail/GalleryLightbox'
import { SedcardDownloadButton } from '@/components/TalentDetail/SedcardDownloadButton'
import { getSedcardSettings } from '@/utilities/getSedcardSettings'

import { getHairLabel, getEyeLabel, getLanguageLabel } from '@/lib/constants/talentOptions'

import type { Metadata } from 'next'
import type { Talent, TalentSkill } from '@/payload-types'

interface PageProps {
    params: Promise<{ locale: string; slug: string }>
}

// Generate metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug, locale } = await params
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })
    const localeKey = locale === 'en' ? 'en' : 'de'
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
    const canonical = `${baseUrl}/${localeKey}/${localeKey === 'de' ? 'talente' : 'talents'}/${slug}`
    const t = i18n[localeKey]

    const { isEnabled: isDraft } = await draftMode()

    try {
        const result = await payload.find({
            collection: 'talents',
            depth: 0,
            draft: isDraft,
            locale: locale as 'de' | 'en',
            select: {
                name: true,
                bio: true,
                seo: true,
            },
            where: {
                slug: { equals: slug },
                ...(isDraft ? {} : { _status: { equals: 'published' } }),
            },
            limit: 1,
        })

        const talent = result.docs[0]
        if (!talent) {
            return {
                title: t.metaTalentNotFound,
            }
        }

        return {
            title: talent.seo?.metaTitle || `${talent.name} - ${t.sedcard}`,
            description: talent.seo?.metaDescription || talent.bio?.substring(0, 160),
            alternates: {
                canonical,
                languages: {
                    de: `${baseUrl}/de/talente/${slug}`,
                    en: `${baseUrl}/en/talents/${slug}`,
                },
            },
        }
    } catch {
        return {
            title: t.metaTalentFallback,
            alternates: {
                canonical,
                languages: {
                    de: `${baseUrl}/de/talente/${slug}`,
                    en: `${baseUrl}/en/talents/${slug}`,
                },
            },
        }
    }
}

// Generate static params
export async function generateStaticParams() {
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    try {
        const result = await payload.find({
            collection: 'talents',
            depth: 0,
            select: {
                slug: true,
            },
            where: {
                _status: { equals: 'published' },
            },
            limit: 100,
        })

        return result.docs.map((talent) => ({
            slug: talent.slug || '',
        }))
    } catch {
        return []
    }
}

const i18n = {
    de: {
        metaTalentNotFound: 'Talent nicht gefunden',
        metaTalentFallback: 'Talent',
        sedcard: 'Sedcard',
        backToTalents: 'Zurück zu den Talenten',
        aboutMe: 'Über mich',
        measurements: 'Maße',
        skillsAndLanguages: 'Skills & Sprachen',
        experience: 'Erfahrung',
        gallery: 'Galerie',
        book: 'Buchen',
        skills: 'Skills',
        languages: 'Sprachen',
        noImage: 'Kein Bild',
        categoryDancer: 'Tänzer/in',
        categoryModel: 'Model',
        categoryBoth: 'Tänzer/in & Model',
        height: 'Größe',
        bust: 'Brust',
        waist: 'Taille',
        hips: 'Hüfte',
        shoeSize: 'Schuhgröße',
        hair: 'Haare',
        eyes: 'Augen',
        shoe: 'Schuh',
        size: 'Konfektion',
        galleryAltSuffix: 'Galerie',
        bookingSubjectPrefix: 'Buchungsanfrage',
        sedcardPdfTitle: 'Sedcard als PDF',
        sedcardPdfDescription:
            'Kompaktes Portfolio mit Bildern, Maßen und Erfahrung für schnelles Sharing mit Produktionen und Kunden.',
    },
    en: {
        metaTalentNotFound: 'Talent not found',
        metaTalentFallback: 'Talent',
        sedcard: 'Sedcard',
        backToTalents: 'Back to Talents',
        aboutMe: 'About',
        measurements: 'Measurements',
        skillsAndLanguages: 'Skills & Languages',
        experience: 'Experience',
        gallery: 'Gallery',
        book: 'Book',
        skills: 'Skills',
        languages: 'Languages',
        noImage: 'No image',
        categoryDancer: 'Dancer',
        categoryModel: 'Model',
        categoryBoth: 'Dancer & Model',
        height: 'Height',
        bust: 'Bust',
        waist: 'Waist',
        hips: 'Hips',
        shoeSize: 'Shoe size',
        hair: 'Hair',
        eyes: 'Eyes',
        shoe: 'Shoe',
        size: 'Size',
        galleryAltSuffix: 'Gallery',
        bookingSubjectPrefix: 'Booking request',
        sedcardPdfTitle: 'Sedcard as PDF',
        sedcardPdfDescription:
            'Compact portfolio with images, measurements and experience for fast sharing with productions and clients.',
    },
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

export default async function TalentDetailPage({ params }: PageProps) {
    const { slug, locale } = await params
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })
    const { isEnabled: isDraft } = await draftMode()
    const localeKey = locale === 'en' ? 'en' : 'de'
    const t = i18n[localeKey]

    let talent: Talent | null = null

    try {
        if (isDraft) {
            const result = await payload.find({
                collection: 'talents',
                draft: true,
                locale: locale as 'de' | 'en',
                where: { slug: { equals: slug } },
                limit: 1,
                depth: 1,
            })
            talent = result.docs[0] || null
        } else {
            talent = await getCachedDocument<Talent>('talents', slug, {
                locale,
                depth: 1,
            })
        }
    } catch (error) {
        console.error('Error fetching talent:', error)
    }

    if (!talent) {
        notFound()
    }

    // Fetch sedcard settings for conditional download button
    const sedcardSettings = await getSedcardSettings()

    const imageUrl =
        typeof talent.featuredImage === 'object' && talent.featuredImage?.url
            ? talent.featuredImage.url
            : null

    // Map hair/eyes arrays to display labels
    const hairDisplay = Array.isArray(talent.measurements?.hair)
        ? talent.measurements.hair.map((value) => getHairLabel(value, localeKey)).join(', ')
        : talent.measurements?.hair
          ? getHairLabel(talent.measurements.hair, localeKey)
          : undefined
    const eyesDisplay = Array.isArray(talent.measurements?.eyes)
        ? talent.measurements.eyes.map((value) => getEyeLabel(value, localeKey)).join(', ')
        : talent.measurements?.eyes
          ? getEyeLabel(talent.measurements.eyes, localeKey)
          : undefined

    const measurements = talent.measurements
        ? [
              { label: t.height, value: talent.measurements.height },
              { label: t.bust, value: talent.measurements.bust },
              { label: t.waist, value: talent.measurements.waist },
              { label: t.hips, value: talent.measurements.hips },
              { label: t.shoeSize, value: talent.measurements.shoeSize },
              { label: t.hair, value: hairDisplay },
              { label: t.eyes, value: eyesDisplay },
          ]
        : []

    const quickStats = talent.measurements
        ? [
              { label: t.height, value: talent.measurements.height },
              { label: t.shoe, value: talent.measurements.shoeSize },
              { label: t.size, value: talent.measurements.confectionSize },
              { label: t.hair, value: hairDisplay },
              { label: t.eyes, value: eyesDisplay },
          ]
        : []

    // Resolve skills relationship to title strings
    const skills: string[] = []
    if (Array.isArray(talent.skills)) {
        for (const s of talent.skills) {
            if (typeof s === 'object' && s !== null && 'title' in s) {
                const localizedTitle = resolveLocalizedText((s as TalentSkill).title, localeKey)
                if (localizedTitle) skills.push(localizedTitle)
            }
        }
    }

    // Map language codes to labels
    const languages: string[] = Array.isArray(talent.languages)
        ? talent.languages.map((code) => getLanguageLabel(code as string))
        : []
    const experience =
        talent.experience
            ?.map((e) => ({
                title: e.title,
                year: e.year,
            }))
            .filter((e) => e.title) || []

    const instagramHandle = talent.socialMedia?.instagram

    // Prepare gallery images for lightbox
    const galleryImages = (talent.galleryImages || [])
        .map((item, index) => {
            const imgUrl = typeof item.image === 'object' && item.image?.url ? item.image.url : null
            if (!imgUrl) return null
            const imgAlt =
                (typeof item.image === 'object' && item.image?.alt) ||
                item.caption ||
                `${talent.name} - ${t.galleryAltSuffix} ${index + 1}`
            return { url: imgUrl, alt: imgAlt, caption: item.caption }
        })
        .filter(Boolean) as { url: string; alt: string; caption?: string | null }[]

    const categoryLabels = {
        dancer: t.categoryDancer,
        model: t.categoryModel,
        both: t.categoryBoth,
    } as const

    return (
        <>
            {/* Schema.org Structured Data */}
            <TalentSchema
                name={talent.name}
                slug={talent.slug || ''}
                locale={localeKey}
                category={talent.category}
                description={talent.bio || undefined}
                imageUrl={imageUrl || undefined}
                skills={skills}
                socialMedia={{ instagram: instagramHandle || undefined }}
                measurements={
                    talent.measurements
                        ? {
                              ...talent.measurements,
                              hair: hairDisplay || null,
                              eyes: eyesDisplay || null,
                          }
                        : undefined
                }
            />

            <section className="padding-large section-atmosphere">
                <div className="container">
                    {/* Back Link (chrome-grace style) */}
                    <Link
                        href="/talents"
                        className="overline mb-8 inline-flex items-center gap-2 text-copper hover:opacity-80 transition-opacity"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        {t.backToTalents}
                    </Link>

                    {/* Main Content: stacks on mobile, side-by-side on lg */}
                    <div className="grid gap-8 lg:gap-12 lg:grid-cols-2">
                        {/* Image — full-width on mobile, sticky on desktop */}
                        <div className="relative">
                            <div className="lg:sticky lg:top-24">
                                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-muted glass-morphism border border-border">
                                    {imageUrl ? (
                                        <Image
                                            src={imageUrl}
                                            alt={talent.name}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 1024px) 100vw, 50vw"
                                            priority
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-muted-foreground">
                                            {t.noImage}
                                        </div>
                                    )}
                                    {/* Category Badge */}
                                    <div className="absolute left-4 top-4">
                                        <span className="rounded-full bg-background/90 px-4 py-2 text-sm font-medium text-foreground backdrop-blur-sm border border-border">
                                            {categoryLabels[talent.category]}
                                        </span>
                                    </div>
                                    {/* Add to selection (icon overlay) */}
                                    <AddToSelectionButton
                                        talent={{
                                            id: String(talent.id),
                                            name: talent.name,
                                            slug: talent.slug ?? '',
                                        }}
                                        variant="icon"
                                        tone="onMedia"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right: Info — flows below image on mobile */}
                        <div>
                            {/* Header (chrome-grace style) */}
                            <div className="mb-4">
                                <span className="overline mb-2 block text-copper">{t.sedcard}</span>
                                <h1 className="font-display-tight font-heading-1-bold leading-[1.04] tracking-tight text-balance hyphens-auto [overflow-wrap:anywhere] pb-[0.03em]">
                                    <span className="font-display text-foreground">
                                        {talent.name.split(' ')[0]}
                                    </span>{' '}
                                    <span className="font-display chrome-text">
                                        {talent.name.split(' ').slice(1).join(' ') || talent.name}
                                    </span>
                                </h1>
                            </div>

                            {/* Quick Stats Bar */}
                            <QuickStats items={quickStats} className="mb-8" />

                            {/* Sedcard download card */}
                            {sedcardSettings.enableFrontendDownload && (
                                <div className="mb-8 rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm">
                                    <p className="overline mb-2 text-copper">{t.sedcard}</p>
                                    <h3 className="font-heading-5-bold text-foreground">
                                        {t.sedcardPdfTitle}
                                    </h3>
                                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                        {t.sedcardPdfDescription}
                                    </p>
                                    <div className="mt-4">
                                        <SedcardDownloadButton
                                            talentId={talent.id}
                                            talentName={talent.name}
                                            locale={locale}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* About */}
                            {talent.bio && (
                                <div className="mb-8">
                                    <h3 className="chrome-text mb-3 font-heading-5-bold">
                                        {t.aboutMe}
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {talent.bio}
                                    </p>
                                </div>
                            )}

                            {/* Measurements */}
                            {measurements.length > 0 && (
                                <div className="mb-8">
                                    <h3 className="chrome-text mb-3 font-heading-5-bold">
                                        {t.measurements}
                                    </h3>
                                    <MeasurementsBox measurements={measurements} />
                                </div>
                            )}

                            {/* Skills & Languages */}
                            {(skills.length > 0 || languages.length > 0) && (
                                <div className="mb-8">
                                    <h3 className="chrome-text mb-3 font-heading-5-bold">
                                        {t.skillsAndLanguages}
                                    </h3>
                                    <SkillTags title={t.skills} tags={skills} className="mb-4" />
                                    <SkillTags
                                        title={t.languages}
                                        tags={languages}
                                        variant="accent"
                                    />
                                </div>
                            )}

                            {/* Experience */}
                            {experience.length > 0 && (
                                <div className="mb-8">
                                    <h3 className="chrome-text mb-3 font-heading-5-bold">
                                        {t.experience}
                                    </h3>
                                    <ExperienceList title="" items={experience} />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Gallery Section with Lightbox */}
                    {galleryImages.length > 0 && (
                        <div className="mt-16">
                            <h3 className="chrome-text mb-6 font-heading-4-bold">
                                {t.gallery}
                            </h3>
                            <GalleryLightbox images={galleryImages} talentName={talent.name} />
                        </div>
                    )}

                    {/* Bottom CTA Bar — booking, selection, social */}
                    <div className="mt-12 flex flex-col items-center gap-4 border-t border-border pt-8 sm:flex-row sm:flex-wrap sm:justify-center">
                        {/* Primary: Book */}
                        {talent.bookingEmail && (
                            <Button
                                asChild
                                variant="accent"
                                size="lg"
                                className="w-full sm:w-auto rounded-full px-8"
                            >
                                <a
                                    href={`mailto:${talent.bookingEmail}?subject=${t.bookingSubjectPrefix}: ${talent.name}`}
                                >
                                    <Mail className="mr-2 h-4 w-4" />
                                    {t.book} {talent.name.split(' ')[0]}
                                </a>
                            </Button>
                        )}

                        {/* Secondary: Add to Selection */}
                        <AddToSelectionButton
                            talent={{
                                id: String(talent.id),
                                name: talent.name,
                                slug: talent.slug ?? '',
                            }}
                            variant="pill"
                        />

                        {instagramHandle && (
                            <Button
                                asChild
                                variant="ghost"
                                size="lg"
                                className="w-full sm:w-auto rounded-full px-8"
                            >
                                <a
                                    href={`https://instagram.com/${instagramHandle.replace('@', '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Instagram className="mr-2 h-4 w-4" />
                                    {instagramHandle}
                                </a>
                            </Button>
                        )}
                    </div>
                </div>
            </section>

            {/* Mobile sticky booking CTA */}
            {talent.bookingEmail && (
                <div className="fixed bottom-0 inset-x-0 z-50 border-t border-border bg-background/95 backdrop-blur-sm p-3 sm:hidden">
                    <Button asChild variant="accent" size="lg" className="w-full rounded-full">
                        <a
                            href={`mailto:${talent.bookingEmail}?subject=${t.bookingSubjectPrefix}: ${talent.name}`}
                        >
                            <Mail className="mr-2 h-4 w-4" />
                            {t.book} {talent.name.split(' ')[0]}
                        </a>
                    </Button>
                </div>
            )}
        </>
    )
}
