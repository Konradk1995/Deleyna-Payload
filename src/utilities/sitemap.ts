/**
 * Sitemap Generation Utilities
 * Generates XML Sitemaps based on Payload CMS settings
 */

import { getCachedPayload } from '@/lib/payloadClient'
import { getSEOSettings, getDefaultSEOSettings } from './getSEOSettings'
import { getServerSideURL } from './getURL'
import { localizePageSlug } from './pageSlugAliases'
import type { SitemapEntry, ChangeFrequency } from '@/types/seo'

export type { SitemapEntry }

export interface SitemapConfig {
    baseUrl: string
    enabled: boolean
    includePages: boolean
    includePosts: boolean
    includeCategories: boolean
    includeTalents: boolean
    changeFrequency: ChangeFrequency
    priority: number
    excludePaths: string[]
}

type SupportedLocale = 'de' | 'en'

const SEGMENTS = {
    blog: { de: 'magazin', en: 'blog' },
    talents: { de: 'talente', en: 'talents' },
    categories: { de: 'kategorien', en: 'categories' },
} as const

type BasePageSettings = {
    noIndex?: boolean
    excludeFromSitemap?: boolean
}

function buildLocalizedPath(locale: SupportedLocale, segments: string[]): string {
    const cleanedSegments = segments
        .map((segment) => String(segment || '').trim())
        .filter(Boolean)
        .map((segment) => segment.replace(/^\/+|\/+$/g, ''))
    const joined = cleanedSegments.join('/')
    return joined ? `/${locale}/${joined}` : `/${locale}`
}

function buildAbsoluteUrl(baseUrl: string, path: string): string {
    const url = new URL(path, `${baseUrl.replace(/\/+$/, '')}/`)
    return url.toString().replace(/\/+$/, '')
}

function toWildcardRegExp(pattern: string): RegExp {
    const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*')
    return new RegExp(`^${escaped}$`)
}

function isExcludedPath(path: string, excludePaths: string[]): boolean {
    const normalizedPath = path.trim().replace(/\/+$/, '') || '/'

    return excludePaths.some((entry) => {
        const pattern = entry.trim()
        if (!pattern) return false

        const normalizedPattern = pattern.replace(/\/+$/, '') || '/'
        if (normalizedPath.includes(normalizedPattern)) {
            return true
        }

        return toWildcardRegExp(normalizedPattern).test(normalizedPath)
    })
}

function isAnyPathExcluded(paths: string[], excludePaths: string[]): boolean {
    return paths.some((path) => isExcludedPath(path, excludePaths))
}

/**
 * Get sitemap configuration from CMS
 */
export async function getSitemapConfig(): Promise<SitemapConfig> {
    try {
        const seoSettings = await getSEOSettings()
        const defaults = getDefaultSEOSettings()

        const sitemapSettings = seoSettings?.sitemapsIndexing || defaults.sitemapsIndexing!
        const socialMedia = seoSettings?.socialMedia || defaults.socialMedia!

        const baseUrl = normalizeBaseUrl(socialMedia.website || getServerSideURL())
        const excludePaths = Array.isArray(sitemapSettings.excludePaths)
            ? sitemapSettings.excludePaths.map((item) => item.path).filter(Boolean)
            : []

        return {
            baseUrl,
            enabled: sitemapSettings.enabled ?? true,
            includePages: sitemapSettings.includePages ?? true,
            includePosts: sitemapSettings.includePosts ?? true,
            includeCategories: sitemapSettings.includeCategories ?? false,
            includeTalents: true,
            changeFrequency: sitemapSettings.changeFrequency || 'weekly',
            priority: typeof sitemapSettings.priority === 'number' ? sitemapSettings.priority : 0.5,
            excludePaths,
        }
    } catch (error) {
        console.error('Error fetching sitemap configuration:', error)
        const baseUrl = normalizeBaseUrl(getServerSideURL())

        return {
            baseUrl,
            enabled: true,
            includePages: true,
            includePosts: true,
            includeCategories: false,
            includeTalents: true,
            changeFrequency: 'weekly',
            priority: 0.5,
            excludePaths: [],
        }
    }
}

function normalizeBaseUrl(candidate?: string): string {
    const fallback = getServerSideURL()
    const value = candidate?.trim() || fallback
    const withProtocol = value.startsWith('http') ? value : `https://${value}`

    try {
        const url = new URL(withProtocol)
        return url.origin.replace(/\/+$/, '')
    } catch {
        try {
            const fallbackUrl = new URL(
                fallback.startsWith('http') ? fallback : `https://${fallback}`,
            )
            return fallbackUrl.origin.replace(/\/+$/, '')
        } catch {
            return 'https://example.com'
        }
    }
}

const SUPPORTED_LOCALES: SupportedLocale[] = ['de', 'en']

/**
 * Get all pages for sitemap
 */
export async function getPages(configOverride?: SitemapConfig): Promise<SitemapEntry[]> {
    try {
        const payload = await getCachedPayload()
        const sitemapConfig = configOverride ?? (await getSitemapConfig())

        const pages = await payload.find({
            collection: 'pages',
            where: {
                _status: { equals: 'published' },
            },
            limit: 1000,
            depth: 0,
        })

        return pages.docs
            .filter((page) => {
                const pageSettings = (page as unknown as { pageSettings?: BasePageSettings })
                    .pageSettings
                if (pageSettings?.noIndex || pageSettings?.excludeFromSitemap) return false

                const rawSlug = typeof page.slug === 'string' ? page.slug : ''
                if (!rawSlug) return false
                const slug = rawSlug === 'home' ? '' : rawSlug

                const dePath = slug
                    ? buildLocalizedPath('de', [localizePageSlug(slug, 'de')])
                    : '/de'
                const enPath = slug
                    ? buildLocalizedPath('en', [localizePageSlug(slug, 'en')])
                    : '/en'
                const canonicalPath = slug ? `/${slug}` : '/'

                return !isAnyPathExcluded(
                    [canonicalPath, dePath, enPath],
                    sitemapConfig.excludePaths,
                )
            })
            .flatMap((page) => {
                const slug = page.slug === 'home' ? '' : page.slug || ''

                return SUPPORTED_LOCALES.map((locale) => ({
                    url: buildAbsoluteUrl(
                        sitemapConfig.baseUrl,
                        slug === ''
                            ? `/${locale}`
                            : buildLocalizedPath(locale, [localizePageSlug(slug, locale)]),
                    ),
                    lastModified: page.updatedAt,
                    changeFrequency: sitemapConfig.changeFrequency,
                    priority: sitemapConfig.priority,
                    alternates: {
                        languages: {
                            de: buildAbsoluteUrl(
                                sitemapConfig.baseUrl,
                                slug === ''
                                    ? '/de'
                                    : buildLocalizedPath('de', [localizePageSlug(slug, 'de')]),
                            ),
                            en: buildAbsoluteUrl(
                                sitemapConfig.baseUrl,
                                slug === ''
                                    ? '/en'
                                    : buildLocalizedPath('en', [localizePageSlug(slug, 'en')]),
                            ),
                            'x-default': buildAbsoluteUrl(
                                sitemapConfig.baseUrl,
                                slug === ''
                                    ? '/de'
                                    : buildLocalizedPath('de', [localizePageSlug(slug, 'de')]),
                            ),
                        },
                    },
                }))
            })
    } catch (error) {
        console.error('Error fetching pages for sitemap:', error)
        return []
    }
}

/**
 * Get all posts for sitemap
 */
export async function getPosts(configOverride?: SitemapConfig): Promise<SitemapEntry[]> {
    try {
        const payload = await getCachedPayload()
        const sitemapConfig = configOverride ?? (await getSitemapConfig())

        const posts = await payload.find({
            collection: 'posts',
            where: {
                _status: { equals: 'published' },
            },
            limit: 1000,
            depth: 0,
        })

        return posts.docs
            .filter((post) => {
                const pageSettings = (post as unknown as { pageSettings?: BasePageSettings })
                    .pageSettings
                if (pageSettings?.noIndex || pageSettings?.excludeFromSitemap) return false
                if (!post.slug) return false

                const dePath = buildLocalizedPath('de', [SEGMENTS.blog.de, post.slug])
                const enPath = buildLocalizedPath('en', [SEGMENTS.blog.en, post.slug])
                const legacyPath = `/${SEGMENTS.blog.en}/${post.slug}`

                return !isAnyPathExcluded([dePath, enPath, legacyPath], sitemapConfig.excludePaths)
            })
            .flatMap((post) => {
                return SUPPORTED_LOCALES.map((locale) => ({
                    url: buildAbsoluteUrl(
                        sitemapConfig.baseUrl,
                        buildLocalizedPath(locale, [SEGMENTS.blog[locale], post.slug || '']),
                    ),
                    lastModified: post.updatedAt,
                    changeFrequency: 'monthly' as ChangeFrequency,
                    priority: 0.6,
                    alternates: {
                        languages: {
                            de: buildAbsoluteUrl(
                                sitemapConfig.baseUrl,
                                buildLocalizedPath('de', [SEGMENTS.blog.de, post.slug || '']),
                            ),
                            en: buildAbsoluteUrl(
                                sitemapConfig.baseUrl,
                                buildLocalizedPath('en', [SEGMENTS.blog.en, post.slug || '']),
                            ),
                            'x-default': buildAbsoluteUrl(
                                sitemapConfig.baseUrl,
                                buildLocalizedPath('de', [SEGMENTS.blog.de, post.slug || '']),
                            ),
                        },
                    },
                }))
            })
    } catch (error) {
        console.error('Error fetching posts for sitemap:', error)
        return []
    }
}

/**
 * Get all categories for sitemap
 */
export async function getCategories(configOverride?: SitemapConfig): Promise<SitemapEntry[]> {
    try {
        const payload = await getCachedPayload()
        const sitemapConfig = configOverride ?? (await getSitemapConfig())

        const categories = await (
            payload as unknown as {
                find: (args: { collection: string; limit: number; depth: number }) => Promise<{
                    docs: Array<{ slug: string; updatedAt: string }>
                }>
            }
        ).find({
            collection: 'categories',
            limit: 1000,
            depth: 0,
        })

        return categories.docs
            .filter((category) => {
                const dePath = buildLocalizedPath('de', [SEGMENTS.categories.de, category.slug])
                const enPath = buildLocalizedPath('en', [SEGMENTS.categories.en, category.slug])
                return !isAnyPathExcluded([dePath, enPath], sitemapConfig.excludePaths)
            })
            .flatMap((category) => {
                return SUPPORTED_LOCALES.map((locale) => ({
                    url: buildAbsoluteUrl(
                        sitemapConfig.baseUrl,
                        buildLocalizedPath(locale, [SEGMENTS.categories[locale], category.slug]),
                    ),
                    lastModified: category.updatedAt,
                    changeFrequency: 'monthly' as ChangeFrequency,
                    priority: 0.4,
                    alternates: {
                        languages: {
                            de: buildAbsoluteUrl(
                                sitemapConfig.baseUrl,
                                buildLocalizedPath('de', [SEGMENTS.categories.de, category.slug]),
                            ),
                            en: buildAbsoluteUrl(
                                sitemapConfig.baseUrl,
                                buildLocalizedPath('en', [SEGMENTS.categories.en, category.slug]),
                            ),
                            'x-default': buildAbsoluteUrl(
                                sitemapConfig.baseUrl,
                                buildLocalizedPath('de', [SEGMENTS.categories.de, category.slug]),
                            ),
                        },
                    },
                }))
            })
    } catch (error) {
        console.error('Error fetching categories for sitemap:', error)
        return []
    }
}

/**
 * Get all talents for sitemap
 */
export async function getTalents(configOverride?: SitemapConfig): Promise<SitemapEntry[]> {
    try {
        const payload = await getCachedPayload()
        const sitemapConfig = configOverride ?? (await getSitemapConfig())

        const talents = await payload.find({
            collection: 'talents',
            where: {
                _status: { equals: 'published' },
            },
            limit: 1000,
            depth: 0,
        })

        return talents.docs
            .filter((talent) => {
                if (!talent.slug) return false

                const dePath = buildLocalizedPath('de', [SEGMENTS.talents.de, talent.slug])
                const enPath = buildLocalizedPath('en', [SEGMENTS.talents.en, talent.slug])
                const legacyPath = `/${SEGMENTS.talents.en}/${talent.slug}`

                return !isAnyPathExcluded([dePath, enPath, legacyPath], sitemapConfig.excludePaths)
            })
            .flatMap((talent) => {
                return SUPPORTED_LOCALES.map((locale) => ({
                    url: buildAbsoluteUrl(
                        sitemapConfig.baseUrl,
                        buildLocalizedPath(locale, [SEGMENTS.talents[locale], talent.slug || '']),
                    ),
                    lastModified: talent.updatedAt,
                    changeFrequency: 'weekly' as ChangeFrequency,
                    priority: 0.7,
                    alternates: {
                        languages: {
                            de: buildAbsoluteUrl(
                                sitemapConfig.baseUrl,
                                buildLocalizedPath('de', [SEGMENTS.talents.de, talent.slug || '']),
                            ),
                            en: buildAbsoluteUrl(
                                sitemapConfig.baseUrl,
                                buildLocalizedPath('en', [SEGMENTS.talents.en, talent.slug || '']),
                            ),
                            'x-default': buildAbsoluteUrl(
                                sitemapConfig.baseUrl,
                                buildLocalizedPath('de', [SEGMENTS.talents.de, talent.slug || '']),
                            ),
                        },
                    },
                }))
            })
    } catch (error) {
        console.error('Error fetching talents for sitemap:', error)
        return []
    }
}

/**
 * Generate complete sitemap entries
 */
export async function generateSitemapEntries(): Promise<SitemapEntry[]> {
    const sitemapConfig = await getSitemapConfig()
    const now = new Date()
    let entries: SitemapEntry[] = []

    if (!sitemapConfig.enabled) {
        return [{ url: sitemapConfig.baseUrl, lastModified: now }]
    }

    // Home pages
    SUPPORTED_LOCALES.forEach((locale) => {
        entries.push({
            url: buildAbsoluteUrl(sitemapConfig.baseUrl, `/${locale}`),
            lastModified: now,
            changeFrequency: 'daily',
            priority: 1.0,
            alternates: {
                languages: {
                    de: buildAbsoluteUrl(sitemapConfig.baseUrl, '/de'),
                    en: buildAbsoluteUrl(sitemapConfig.baseUrl, '/en'),
                    'x-default': buildAbsoluteUrl(sitemapConfig.baseUrl, '/de'),
                },
            },
        })
    })

    if (sitemapConfig.includePages) {
        const pages = await getPages(sitemapConfig)
        entries.push(...pages)
    }

    if (sitemapConfig.includePosts) {
        const posts = await getPosts(sitemapConfig)
        entries.push(...posts)

        const blogListingPaths = { de: SEGMENTS.blog.de, en: SEGMENTS.blog.en }
        if (!isAnyPathExcluded([`/${blogListingPaths.de}`, `/${blogListingPaths.en}`], sitemapConfig.excludePaths)) {
            SUPPORTED_LOCALES.forEach((locale) => {
                entries.push({
                    url: buildAbsoluteUrl(sitemapConfig.baseUrl, buildLocalizedPath(locale, [blogListingPaths[locale]])),
                    lastModified: now,
                    changeFrequency: 'weekly',
                    priority: 0.8,
                    alternates: {
                        languages: {
                            de: buildAbsoluteUrl(sitemapConfig.baseUrl, buildLocalizedPath('de', [blogListingPaths.de])),
                            en: buildAbsoluteUrl(sitemapConfig.baseUrl, buildLocalizedPath('en', [blogListingPaths.en])),
                            'x-default': buildAbsoluteUrl(sitemapConfig.baseUrl, buildLocalizedPath('de', [blogListingPaths.de])),
                        },
                    },
                })
            })
        }
    }

    if (sitemapConfig.includeCategories) {
        const categories = await getCategories(sitemapConfig)
        entries.push(...categories)
    }

    if (sitemapConfig.includeTalents) {
        const talents = await getTalents(sitemapConfig)
        entries.push(...talents)

        const talentListingPaths = { de: SEGMENTS.talents.de, en: SEGMENTS.talents.en }
        if (!isAnyPathExcluded([`/${talentListingPaths.de}`, `/${talentListingPaths.en}`], sitemapConfig.excludePaths)) {
            SUPPORTED_LOCALES.forEach((locale) => {
                entries.push({
                    url: buildAbsoluteUrl(sitemapConfig.baseUrl, buildLocalizedPath(locale, [talentListingPaths[locale]])),
                    lastModified: now,
                    changeFrequency: 'weekly',
                    priority: 0.8,
                    alternates: {
                        languages: {
                            de: buildAbsoluteUrl(sitemapConfig.baseUrl, buildLocalizedPath('de', [talentListingPaths.de])),
                            en: buildAbsoluteUrl(sitemapConfig.baseUrl, buildLocalizedPath('en', [talentListingPaths.en])),
                            'x-default': buildAbsoluteUrl(sitemapConfig.baseUrl, buildLocalizedPath('de', [talentListingPaths.de])),
                        },
                    },
                })
            })
        }
    }

    // Deduplicate
    entries = deduplicateEntries(entries)
    entries.sort((a, b) => a.url.localeCompare(b.url))

    return entries
}

/**
 * Generate XML sitemap content
 */
export function generateSitemapXML(entries: SitemapEntry[]): string {
    const xmlEntries = entries
        .map((entry) => {
            const alternatesXml = entry.alternates?.languages
                ? Object.entries(entry.alternates.languages)
                      .map(
                          ([lang, url]) =>
                              `    <xhtml:link rel="alternate" hreflang="${lang}" href="${escapeXml(url)}" />`,
                      )
                      .join('\n')
                : ''

            return `  <url>
    <loc>${escapeXml(sanitizeUrl(entry.url))}</loc>
${entry.lastModified ? `    <lastmod>${new Date(entry.lastModified).toISOString().split('T')[0]}</lastmod>` : ''}
${entry.changeFrequency ? `    <changefreq>${entry.changeFrequency}</changefreq>` : ''}
${entry.priority !== undefined ? `    <priority>${entry.priority}</priority>` : ''}
${alternatesXml}
  </url>`
        })
        .join('\n')

    return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${xmlEntries}
</urlset>`
}

/**
 * Generate sitemap index XML (for multiple sitemaps)
 */
export function generateSitemapIndexXML(sitemaps: Array<{ loc: string; lastmod?: Date }>): string {
    const xmlEntries = sitemaps
        .map((sitemap) => {
            const lastmod = sitemap.lastmod
                ? new Date(sitemap.lastmod).toISOString().split('T')[0]
                : undefined

            return `  <sitemap>
    <loc>${escapeXml(sitemap.loc)}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}
  </sitemap>`
        })
        .join('\n')

    return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlEntries}
</sitemapindex>`
}

/**
 * Split entries into multiple sitemaps if needed
 */
export function splitSitemapEntries(
    entries: SitemapEntry[],
    maxUrls: number = 50000,
): SitemapEntry[][] {
    if (entries.length <= maxUrls) {
        return [entries]
    }

    const chunks: SitemapEntry[][] = []
    for (let i = 0; i < entries.length; i += maxUrls) {
        chunks.push(entries.slice(i, i + maxUrls))
    }
    return chunks
}

function escapeXml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
}

function normalizeUrlForComparison(url: string): string {
    try {
        const parsed = new URL(url)
        const normalizedPath = parsed.pathname.replace(/\/+$|\/+(?=\?|#)/g, '') || ''
        return `${parsed.origin}${normalizedPath}`
    } catch {
        return url.replace(/\/+$|\/+(?=\?|#)/g, '')
    }
}

function deduplicateEntries(entries: SitemapEntry[]): SitemapEntry[] {
    const seen = new Set<string>()

    return entries.filter((entry) => {
        const key = normalizeUrlForComparison(entry.url)
        if (seen.has(key)) {
            return false
        }
        seen.add(key)
        return true
    })
}

function sanitizeUrl(url: string): string {
    return url.replace(/\s+/g, '').trim()
}

/**
 * Get canonical URL for a page
 */
export function getCanonicalUrl(baseUrl: string, slug: string, customCanonical?: string): string {
    if (customCanonical) {
        return customCanonical.startsWith('http') ? customCanonical : `${baseUrl}${customCanonical}`
    }

    if (slug === 'home') {
        return baseUrl
    }

    return `${baseUrl}/${slug}`
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
    try {
        new URL(url)
        return true
    } catch {
        return false
    }
}
