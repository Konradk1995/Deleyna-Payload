import type { Metadata } from 'next'
import type { Page, Post, Media } from '@/payload-types'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { localizePageSlug } from '@/utilities/pageSlugAliases'
import { getServerSideURL } from '@/utilities/getURL'

const BASE_URL = getServerSideURL()

interface GenerateMetaArgs {
    doc: Partial<Page> | Partial<Post> | null
    locale?: string
}

function getResolvedSlug(
    slug: unknown,
    locale: 'de' | 'en',
): string {
    if (!slug) return ''
    if (typeof slug === 'string') return slug
    if (typeof slug === 'object') {
        const localized = slug as Record<string, string | undefined | null>
        return localized[locale] || localized.de || localized.en || ''
    }
    return ''
}

/**
 * Generiert Next.js Metadata aus Page/Post Dokumenten
 */
export async function generateMeta({ doc, locale = 'de' }: GenerateMetaArgs): Promise<Metadata> {
    if (!doc) {
        return {
            title: 'Seite nicht gefunden',
        }
    }

    let siteName = 'Agentur'
    let defaultDescription = ''
    let defaultOgImage: string | undefined

    try {
        const payloadConfig = await config
        const payload = await getPayload({ config: payloadConfig })

        const seoSettings = await payload.findGlobal({
            slug: 'seo',
            locale: locale as 'de' | 'en',
        })

        siteName = seoSettings?.businessInfo?.name || siteName
        defaultDescription = seoSettings?.businessInfo?.description || ''

        if (seoSettings?.socialMedia?.logo && typeof seoSettings.socialMedia.logo === 'object') {
            defaultOgImage = (seoSettings.socialMedia.logo as Media).url || undefined
        }
    } catch (error) {
        console.error('Error fetching SEO settings:', error)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pageSettings = (doc as any).pageSettings || {}

    // Titel
    const title = pageSettings.metaTitle || doc.title || ''
    const fullTitle = title ? `${title} | ${siteName}` : siteName

    // Beschreibung
    const description = pageSettings.metaDescription || defaultDescription

    // OG Image
    let ogImage = defaultOgImage
    if (pageSettings.ogImage && typeof pageSettings.ogImage === 'object') {
        ogImage = (pageSettings.ogImage as Media).url || undefined
    }

    // Canonical URL
    const resolvedLocale: 'de' | 'en' = locale === 'en' ? 'en' : 'de'
    const slug = getResolvedSlug(doc.slug, resolvedLocale)
    const isLikelyPage =
        typeof doc === 'object' &&
        doc !== null &&
        ('layout' in doc || 'hero' in doc || 'template' in doc)
    const isLikelyPost =
        typeof doc === 'object' &&
        doc !== null &&
        ('author' in doc ||
            'categories' in doc ||
            'postType' in doc ||
            'featuredImage' in doc ||
            'excerpt' in doc)
    const isHome = slug === '' || slug === 'home'
    const blogSegment = resolvedLocale === 'de' ? 'magazin' : 'blog'
    const localizedPageSlug =
        isHome || !isLikelyPage ? slug : localizePageSlug(slug, resolvedLocale)
    const canonicalFallback = isHome
        ? `${BASE_URL}/${resolvedLocale}`
        : isLikelyPost
          ? `${BASE_URL}/${resolvedLocale}/${blogSegment}/${slug}`
          : `${BASE_URL}/${resolvedLocale}/${localizedPageSlug}`
    const canonicalUrl = pageSettings.canonicalUrl || canonicalFallback
    const localizedDe = isLikelyPost
        ? isHome
            ? ''
            : `magazin/${slug}`
        : isHome || !isLikelyPage
          ? slug
          : localizePageSlug(slug, 'de')
    const localizedEn = isLikelyPost
        ? isHome
            ? ''
            : `blog/${slug}`
        : isHome || !isLikelyPage
          ? slug
          : localizePageSlug(slug, 'en')

    // Robots
    const noIndex = pageSettings.noIndex === true
    const noFollow = pageSettings.noFollow === true

    return {
        title: fullTitle,
        description,
        keywords: pageSettings.metaKeywords,
        authors: [{ name: siteName }],
        robots: {
            index: !noIndex,
            follow: !noFollow,
        },
        alternates: {
            canonical: canonicalUrl,
            languages: {
                de: isHome ? `${BASE_URL}/de` : `${BASE_URL}/de/${localizedDe}`,
                en: isHome ? `${BASE_URL}/en` : `${BASE_URL}/en/${localizedEn}`,
                'x-default': isHome ? `${BASE_URL}/de` : `${BASE_URL}/de/${localizedDe}`,
            },
        },
        openGraph: {
            type: 'website',
            locale: locale === 'de' ? 'de_DE' : 'en_US',
            url: canonicalUrl,
            title: pageSettings.ogTitle || title,
            description: pageSettings.ogDescription || description,
            siteName,
            images: ogImage
                ? [
                      {
                          url: ogImage.startsWith('http') ? ogImage : `${BASE_URL}${ogImage}`,
                          width: 1200,
                          height: 630,
                          alt: title,
                      },
                  ]
                : undefined,
        },
        twitter: {
            card: 'summary_large_image',
            title: pageSettings.ogTitle || title,
            description: pageSettings.ogDescription || description,
            images: ogImage
                ? [ogImage.startsWith('http') ? ogImage : `${BASE_URL}${ogImage}`]
                : undefined,
        },
    }
}

export function generatePageStructuredData(
    doc: Partial<Page>,
    url: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    seoSettings?: any,
) {
    const schemas: object[] = []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pageSettings = (doc as any).pageSettings || {}
    const schemaType = pageSettings.schemaType || 'WebPage'
    const includeBreadcrumbs = pageSettings.includeBreadcrumbs ?? true
    const includeOrganization =
        pageSettings.includeOrganization ??
        seoSettings?.schemaTemplates?.pageDefaults?.includeOrganization ??
        seoSettings?.schemaTemplates?.includeOrganization ??
        false

    // WebPage Schema
    schemas.push({
        '@context': 'https://schema.org',
        '@type': schemaType,
        '@id': `${url}#webpage`,
        name: String(pageSettings.metaTitle || doc.title || ''),
        description: pageSettings.metaDescription,
        url,
        datePublished: (doc as typeof doc & { publishedAt?: string }).publishedAt || doc.createdAt,
        dateModified: doc.updatedAt,
    })

    if (includeBreadcrumbs) {
        const urlObject = new URL(url, BASE_URL)
        const segments = urlObject.pathname.split('/').filter(Boolean)
        const localeSegment: 'de' | 'en' = segments[0] === 'en' ? 'en' : 'de'
        const homeUrl = `${BASE_URL}/${localeSegment}`
        const itemListElement: Array<{ '@type': 'ListItem'; position: number; name: string; item: string }> = [
            {
                '@type': 'ListItem',
                position: 1,
                name: localeSegment === 'de' ? 'Startseite' : 'Home',
                item: homeUrl,
            },
        ]

        if (url !== homeUrl) {
            itemListElement.push({
                '@type': 'ListItem',
                position: 2,
                name: String(pageSettings.metaTitle || doc.title || 'Page'),
                item: url,
            })
        }

        schemas.push({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            '@id': `${url}#breadcrumb`,
            itemListElement,
        })
    }

    // Organization Schema wenn aktiviert
    if (includeOrganization) {
        const organizationName = seoSettings?.businessInfo?.name || 'Deleyna Talent Agency'
        const organizationUrl = seoSettings?.socialMedia?.website || BASE_URL
        schemas.push({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            '@id': `${BASE_URL}#organization`,
            name: organizationName,
            url: organizationUrl,
            logo: seoSettings?.socialMedia?.logo?.url,
        })
    }

    return schemas
}
