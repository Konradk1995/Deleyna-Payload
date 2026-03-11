import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { renderToBuffer, type DocumentProps } from '@react-pdf/renderer'
import React from 'react'
import { getTemplate } from '@/lib/sedcard/registry'
import { fetchImageBuffer } from '@/lib/sedcard/fetchImageBuffer'
import { getHairLabel, getEyeLabel, getLanguageLabel } from '@/lib/constants/talentOptions'
import type { SedcardData, AgencyInfo, SedcardImageSource } from '@/lib/sedcard/types'
import type { Talent, Media, TalentSkill } from '@/payload-types'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params
    const { searchParams } = request.nextUrl

    // Input validation
    const numericId = Number(id)
    if (!Number.isFinite(numericId) || numericId <= 0) {
        return NextResponse.json({ error: 'Invalid talent ID' }, { status: 400 })
    }

    const localeParam = searchParams.get('locale')
    const locale: 'de' | 'en' = localeParam === 'en' ? 'en' : 'de'
    const templateParam = searchParams.get('template') || ''

    try {
        const payload = await getPayload({ config })

        // Auth check: only authenticated users OR published talents
        const { user } = await payload.auth({ headers: request.headers })

        // Fetch talent, sedcard settings, and SEO global in parallel
        const [talent, settings, seoGlobal] = await Promise.all([
            payload.findByID({
                collection: 'talents',
                id: numericId,
                depth: 1,
                locale,
            }) as Promise<Talent>,
            payload.findGlobal({
                slug: 'sedcard-settings',
                depth: 1,
            }),
            payload.findGlobal({
                slug: 'seo',
                depth: 1,
            }),
        ])

        if (!talent) {
            return NextResponse.json({ error: 'Talent not found' }, { status: 404 })
        }

        // Block access to unpublished talents for unauthenticated users
        if (!user && talent._status !== 'published') {
            return NextResponse.json({ error: 'Talent not found' }, { status: 404 })
        }

        // Determine template
        const templateName =
            templateParam ||
            (talent.sedcardTemplate as string) ||
            (settings.defaultTemplate as string) ||
            'classic'

        const resolveMedia = (value: unknown): Media | null => {
            if (!value || typeof value !== 'object') return null
            return 'url' in value ? (value as Media) : null
        }

        // Fetch featured image buffer
        const featuredMedia = talent.featuredImage as Media | null
        const featuredImageUrl = featuredMedia?.url || null
        const featuredImage = featuredImageUrl
            ? await fetchImageBuffer(featuredImageUrl)
            : null

        // Fetch agency logo buffer
        const logoMedia = settings.agencyLogo as Media | null
        const logoUrl = logoMedia?.url || null
        const agencyLogo = logoUrl ? await fetchImageBuffer(logoUrl) : null

        // Extract agency info from SEO global
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const seo = seoGlobal as any
        const contactInfo = seo?.contactInfo || {}
        const businessInfo = seo?.businessInfo || {}
        const socialMedia = seo?.socialMedia || {}

        // Find Instagram URL from sameAs array
        const instagramEntry = socialMedia.sameAs?.find(
            (s: { platform?: string; url?: string }) => s.platform === 'instagram',
        )

        // Format address from components
        const addressParts = [
            contactInfo.streetAddress,
            [contactInfo.postalCode, contactInfo.addressLocality].filter(Boolean).join(' '),
            contactInfo.addressCountry,
        ].filter(Boolean)
        const formattedAddress = addressParts.length > 0 ? addressParts.join(', ') : null

        const agencyInfo: AgencyInfo = {
            name: businessInfo.name || null,
            email: contactInfo.email || null,
            phone: contactInfo.telephone || null,
            address: formattedAddress,
            website: socialMedia.website || null,
            instagram: instagramEntry?.url || null,
        }

        // Build sedcard gallery sources:
        // 1) Dedicated sedcard slots first, 2) fallback website gallery, 3) fallback featured image.
        const sedcardMedia = [
            talent.sedcardImage1,
            talent.sedcardImage2,
            talent.sedcardImage3,
            talent.sedcardImage4,
        ]
            .map(resolveMedia)
            .filter((media): media is Media => Boolean(media?.url))

        const websiteGalleryMedia = (talent.galleryImages || [])
            .map((item) => resolveMedia(item.image))
            .filter((media): media is Media => Boolean(media?.url))

        const uniqueUrls = new Set<string>()
        const galleryUrls: string[] = []

        const addUrl = (url: string | null | undefined) => {
            if (!url || uniqueUrls.has(url)) return
            uniqueUrls.add(url)
            galleryUrls.push(url)
        }

        for (const media of sedcardMedia) {
            addUrl(media.url)
        }
        for (const media of websiteGalleryMedia) {
            if (galleryUrls.length >= 4) break
            addUrl(media.url)
        }
        if (galleryUrls.length < 4) {
            addUrl(featuredImageUrl)
        }

        const galleryImages = (
            await Promise.all(galleryUrls.slice(0, 4).map((url) => fetchImageBuffer(url)))
        ).filter((img): img is SedcardImageSource => img !== null)

        // Map hair/eyes arrays to display labels for PDF
        const mappedMeasurements = talent.measurements
            ? {
                  ...talent.measurements,
                  hair: Array.isArray(talent.measurements.hair)
                      ? talent.measurements.hair.map((value) => getHairLabel(value, locale)).join(', ')
                      : talent.measurements.hair
                        ? getHairLabel(talent.measurements.hair, locale)
                        : null,
                  eyes: Array.isArray(talent.measurements.eyes)
                      ? talent.measurements.eyes.map((value) => getEyeLabel(value, locale)).join(', ')
                      : talent.measurements.eyes
                        ? getEyeLabel(talent.measurements.eyes, locale)
                        : null,
              }
            : null

        // Resolve skills relationship to titles
        const skillTitles: string[] = []
        if (Array.isArray(talent.skills)) {
            for (const s of talent.skills) {
                if (typeof s === 'object' && s !== null && 'title' in s) {
                    const rawTitle = (s as TalentSkill).title as unknown
                    if (typeof rawTitle === 'string' && rawTitle.trim()) {
                        skillTitles.push(rawTitle.trim())
                        continue
                    }
                    if (rawTitle && typeof rawTitle === 'object') {
                        const titleMap = rawTitle as Record<string, unknown>
                        const localized =
                            locale === 'en'
                                ? titleMap.en ?? titleMap.de
                                : titleMap.de ?? titleMap.en
                        if (typeof localized === 'string' && localized.trim()) {
                            skillTitles.push(localized.trim())
                        }
                    }
                }
            }
        }

        // Map language codes to labels
        const languageLabels: string[] = Array.isArray(talent.languages)
            ? talent.languages.map((code) => getLanguageLabel(code as string))
            : []

        // Build sedcard data
        const sedcardData: SedcardData = {
            name: talent.name,
            category: talent.category,
            locale,
            bio: talent.bio || null,
            measurements: mappedMeasurements,
            skills: skillTitles,
            languages: languageLabels,
            experience:
                talent.experience
                    ?.map((e) => ({ title: e.title, year: e.year || null }))
                    .filter((e) => e.title) || [],
            socialMedia: talent.socialMedia || null,
            bookingEmail: talent.bookingEmail || null,
            featuredImage,
            agencyLogo,
            footerText: (settings.footerText as string) || null,
            agencyInfo,
            galleryImages: galleryImages.length > 0 ? galleryImages : null,
        }

        // Render PDF
        const Template = getTemplate(templateName)
        const pdfElement = React.createElement(Template, {
            data: sedcardData,
        }) as React.ReactElement<DocumentProps>
        const pdfBuffer = await renderToBuffer(pdfElement)

        // Sanitize filename: Name + Date for easy identification
        const safeName = talent.name.replace(/[^a-zA-Z0-9-_ ]/g, '').replace(/\s+/g, '_')
        const dateStr = new Date().toISOString().slice(0, 10) // YYYY-MM-DD

        return new NextResponse(pdfBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="Sedcard_${safeName}_${dateStr}.pdf"`,
                'Cache-Control': 'no-store',
            },
        })
    } catch (error) {
        console.error('Sedcard PDF generation error:', error)
        return NextResponse.json(
            { error: 'Failed to generate sedcard PDF' },
            { status: 500 },
        )
    }
}
