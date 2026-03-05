import { createCachedFunction, CACHE_TAGS } from '@/lib/cache'
import { getCachedPayload } from '@/lib/payloadClient'
import type {
    SEOSettings,
    SiteBusinessData,
    SiteWebSiteData,
    ContentArea,
    PathRule,
} from '@/types/seo'
import {
    DEFAULT_BUSINESS_INFO,
    DEFAULT_CONTACT_INFO,
    DEFAULT_SITEMAP_CONFIG,
    DEFAULT_AI_CRAWLERS,
    DEFAULT_SCHEMA_TEMPLATES,
} from '@/types/seo'
import { getServerSideURL } from './getURL'

/**
 * Internal function to fetch SEO settings from Payload
 */
const _getSEOSettings = async (locale?: string): Promise<Partial<SEOSettings>> => {
    try {
        const payload = await getCachedPayload()

        const seoSettings = await payload.findGlobal({
            slug: 'seo',
            locale: locale as 'en' | 'de' | undefined,
        })

        return normalizeSEOSettings(seoSettings)
    } catch (error) {
        console.warn(
            `Failed to fetch SEO settings${locale ? ` for locale ${locale}` : ''}, using defaults:`,
            error,
        )
        return getDefaultSEOSettings()
    }
}

/**
 * Cached version of getSEOSettings
 * Caches for 1 hour with SEO and globals tags
 */
export const getSEOSettings = createCachedFunction(
    _getSEOSettings,
    ['seo-settings'],
    [CACHE_TAGS.seo, CACHE_TAGS.globals],
    3600,
)

/**
 * Get default SEO settings
 */
export function getDefaultSEOSettings(): Partial<SEOSettings> {
    const baseUrl = getServerSideURL()

    return {
        businessInfo: {
            ...DEFAULT_BUSINESS_INFO,
        },
        contactInfo: {
            ...DEFAULT_CONTACT_INFO,
        },
        socialMedia: {
            website: baseUrl,
            sameAs: [],
        },
        aiAndCrawlers: {
            ...DEFAULT_AI_CRAWLERS,
        },
        schemaTemplates: {
            ...DEFAULT_SCHEMA_TEMPLATES,
        },
        sitemapsIndexing: {
            ...DEFAULT_SITEMAP_CONFIG,
        },
    }
}

/**
 * Normalize SEO settings from CMS data
 */
function normalizeSEOSettings(data: unknown): Partial<SEOSettings> {
    const defaults = getDefaultSEOSettings()

    if (!data || typeof data !== 'object') {
        return defaults
    }

    const source = data as Record<string, unknown>

    const aiSettings = (source.aiAndCrawlers ?? source.aiSettings ?? {}) as Record<string, unknown>
    const llmTxtGroup = (aiSettings?.llmTxtContent ?? {}) as Record<string, unknown>
    const sitemapGroup = (source.sitemapsIndexing ?? source.sitemaps ?? {}) as Record<
        string,
        unknown
    >

    // Primary: parse textarea fields (what the CMS actually stores)
    // Fallback: try legacy array fields
    const contentAreasFromText = parseContentAreasText(llmTxtGroup?.contentAreasText)
    const contentAreasResult =
        contentAreasFromText.length > 0
            ? contentAreasFromText
            : sanitizeContentAreas(
                  llmTxtGroup?.contentAreas,
                  defaults.aiAndCrawlers?.llmTxtContent?.contentAreas ?? [],
              )

    const robotsDirectivesFromText = parseRobotsExtraRulesText(aiSettings?.robotsExtraRules)
    const robotsDirectivesResult =
        robotsDirectivesFromText.length > 0
            ? robotsDirectivesFromText
            : sanitizeRobotDirectives(
                  (aiSettings?.robotsSettings as Record<string, unknown>)?.customDirectives,
              )

    const excludePathsFromText = parsePathRulesText(sitemapGroup?.excludePathsText)
    const excludePathsResult =
        excludePathsFromText.length > 0
            ? excludePathsFromText
            : sanitizePathRules(
                  sitemapGroup?.excludePaths ?? defaults.sitemapsIndexing?.excludePaths ?? [],
              )

    const normalized: Partial<SEOSettings> = {
        favicon:
            source.favicon !== undefined && source.favicon !== null
                ? (source.favicon as SEOSettings['favicon'])
                : undefined,
        appleTouchIcon:
            source.appleTouchIcon !== undefined && source.appleTouchIcon !== null
                ? (source.appleTouchIcon as SEOSettings['appleTouchIcon'])
                : undefined,
        businessInfo: mergeDeep(defaults.businessInfo, source.businessInfo),
        contactInfo: mergeDeep(defaults.contactInfo, source.contactInfo),
        socialMedia: mergeDeep(defaults.socialMedia, source.socialMedia),
        aiAndCrawlers: {
            allowAITraining:
                (aiSettings?.allowAITraining as boolean) ??
                defaults.aiAndCrawlers?.allowAITraining ??
                true,
            llmTxtEnabled:
                (aiSettings?.llmTxtEnabled as boolean) ??
                defaults.aiAndCrawlers?.llmTxtEnabled ??
                true,
            llmTxtContent: {
                updateSchedule:
                    (llmTxtGroup?.updateSchedule as 'daily' | 'weekly' | 'monthly') ??
                    defaults.aiAndCrawlers?.llmTxtContent?.updateSchedule ??
                    'weekly',
                citationPolicy:
                    (llmTxtGroup?.citationPolicy as string) ??
                    defaults.aiAndCrawlers?.llmTxtContent?.citationPolicy ??
                    '',
                contentAreas: contentAreasResult,
            },
            robotsSettings: {
                customDirectives: robotsDirectivesResult,
            },
        },
        schemaTemplates: mergeDeep(defaults.schemaTemplates, source.schemaTemplates),
        analytics: mergeDeep(defaults.analytics, source.analytics),
        sitemapsIndexing: {
            enabled:
                typeof sitemapGroup?.enabled === 'boolean'
                    ? sitemapGroup.enabled
                    : (defaults.sitemapsIndexing?.enabled ?? true),
            includePages:
                typeof sitemapGroup?.includePages === 'boolean'
                    ? sitemapGroup.includePages
                    : (defaults.sitemapsIndexing?.includePages ?? true),
            includePosts:
                typeof sitemapGroup?.includePosts === 'boolean'
                    ? sitemapGroup.includePosts
                    : (defaults.sitemapsIndexing?.includePosts ?? true),
            includeCategories:
                typeof sitemapGroup?.includeCategories === 'boolean'
                    ? sitemapGroup.includeCategories
                    : (defaults.sitemapsIndexing?.includeCategories ?? false),
            changeFrequency:
                (sitemapGroup?.changeFrequency as SEOSettings['sitemapsIndexing']['changeFrequency']) ??
                defaults.sitemapsIndexing?.changeFrequency ??
                'weekly',
            priority:
                typeof sitemapGroup?.priority === 'number'
                    ? sitemapGroup.priority
                    : (defaults.sitemapsIndexing?.priority ?? 0.5),
            excludePaths: excludePathsResult,
            additionalSitemaps: sanitizeAdditionalSitemaps(
                sitemapGroup?.additionalSitemaps ??
                    defaults.sitemapsIndexing?.additionalSitemaps ??
                    [],
            ),
        },
    }

    return normalized
}

function parsePathRulesText(input: unknown): PathRule[] {
    if (typeof input !== 'string' || !input.trim()) {
        return []
    }

    const seen = new Set<string>()
    return input
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => line.replace(/^[*-]\s*/, '').trim())
        .filter((line) => {
            if (seen.has(line)) return false
            seen.add(line)
            return true
        })
        .map((path) => ({ path }))
}

function parseContentAreasText(input: unknown): ContentArea[] {
    if (typeof input !== 'string' || !input.trim()) {
        return []
    }

    const areas: ContentArea[] = []
    const seen = new Set<string>()

    input
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .forEach((line) => {
            const normalized = line.replace(/^[*-]\s*/, '').trim()
            const [areaRaw, ...descParts] = normalized.split(/\s+-\s+/)
            const area = areaRaw?.trim()
            if (!area || seen.has(area)) return
            seen.add(area)
            areas.push({
                area,
                description: descParts.join(' - ').trim(),
            })
        })

    return areas
}

function parseRobotsExtraRulesText(
    input: unknown,
): Array<{ userAgent: string; allow?: PathRule[]; disallow?: PathRule[] }> {
    if (typeof input !== 'string' || !input.trim()) {
        return []
    }

    const directives = new Map<
        string,
        { userAgent: string; allow: Set<string>; disallow: Set<string> }
    >()
    let currentUserAgent = '*'

    const getDirective = (userAgent: string) => {
        if (!directives.has(userAgent)) {
            directives.set(userAgent, {
                userAgent,
                allow: new Set<string>(),
                disallow: new Set<string>(),
            })
        }
        return directives.get(userAgent)!
    }

    input
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .forEach((line) => {
            const separatorIndex = line.indexOf(':')
            if (separatorIndex < 0) return

            const key = line.slice(0, separatorIndex).trim().toLowerCase()
            const value = line.slice(separatorIndex + 1).trim()
            if (!value) return

            if (key === 'user-agent' || key === 'useragent') {
                currentUserAgent = value
                return
            }

            const directive = getDirective(currentUserAgent)
            if (key === 'allow') {
                directive.allow.add(value)
            }
            if (key === 'disallow') {
                directive.disallow.add(value)
            }
        })

    return Array.from(directives.values())
        .map((directive) => {
            const allow = Array.from(directive.allow).map((path) => ({ path }))
            const disallow = Array.from(directive.disallow).map((path) => ({ path }))

            const result: { userAgent: string; allow?: PathRule[]; disallow?: PathRule[] } = {
                userAgent: directive.userAgent,
            }
            if (allow.length) result.allow = allow
            if (disallow.length) result.disallow = disallow
            return result
        })
        .filter((directive) => Boolean(directive.allow?.length || directive.disallow?.length))
}

/**
 * Sanitize robot directives
 */
function sanitizeRobotDirectives(
    input: unknown,
): Array<{ userAgent: string; allow?: PathRule[]; disallow?: PathRule[] }> {
    if (!Array.isArray(input)) {
        return []
    }

    return input
        .map((directive) => {
            if (!directive || typeof directive !== 'object') {
                return null
            }

            const record = directive as Record<string, unknown>
            const userAgentValue = record.userAgent
            let userAgent = '*'

            if (typeof userAgentValue === 'string' && userAgentValue.trim()) {
                userAgent = userAgentValue.trim()
            }

            const allow = sanitizePathRules(record.allow ?? [])
            const disallow = sanitizePathRules(record.disallow ?? [])

            const result: { userAgent: string; allow?: PathRule[]; disallow?: PathRule[] } = {
                userAgent,
            }

            if (allow.length) {
                result.allow = allow
            }

            if (disallow.length) {
                result.disallow = disallow
            }

            return result
        })
        .filter(
            (entry): entry is { userAgent: string; allow?: PathRule[]; disallow?: PathRule[] } =>
                Boolean(entry),
        )
}

/**
 * Sanitize path rules
 */
function sanitizePathRules(input: unknown): PathRule[] {
    if (!input) {
        return []
    }

    if (!Array.isArray(input)) {
        if (typeof input === 'string' && input.trim()) {
            return [{ path: input.trim() }]
        }

        if (
            typeof input === 'object' &&
            typeof (input as Record<string, unknown>).path === 'string'
        ) {
            const trimmed = ((input as Record<string, unknown>).path as string).trim()
            return trimmed ? [{ path: trimmed }] : []
        }

        return []
    }

    const seen = new Set<string>()
    const rules: PathRule[] = []

    for (const entry of input) {
        let value: string | undefined

        if (typeof entry === 'string') {
            value = entry.trim()
        } else if (
            entry &&
            typeof entry === 'object' &&
            typeof (entry as Record<string, unknown>).path === 'string'
        ) {
            value = ((entry as Record<string, unknown>).path as string).trim()
        }

        if (!value || seen.has(value)) {
            continue
        }

        seen.add(value)
        rules.push({ path: value })
    }

    return rules
}

/**
 * Sanitize content areas
 */
function sanitizeContentAreas(input: unknown, fallback: ContentArea[]): ContentArea[] {
    if (!Array.isArray(input)) {
        return fallback
    }

    const areas: ContentArea[] = input
        .map((item) => {
            if (!item || typeof item !== 'object') {
                return null
            }

            const record = item as Record<string, unknown>
            const area = typeof record.area === 'string' ? record.area.trim() : ''
            const description =
                typeof record.description === 'string' ? record.description.trim() : ''

            if (!area) {
                return null
            }

            return { area, description }
        })
        .filter((area): area is ContentArea => Boolean(area))

    return areas.length ? areas : fallback
}

/**
 * Sanitize additional sitemaps
 */
function sanitizeAdditionalSitemaps(input: unknown): Array<{ url: string }> {
    if (!input) {
        return []
    }

    if (!Array.isArray(input)) {
        if (typeof input === 'string' && input.trim()) {
            return [{ url: input.trim() }]
        }
        return []
    }

    const urls: Array<{ url: string }> = []

    input.forEach((item) => {
        let url: string | undefined

        if (typeof item === 'string') {
            url = item.trim()
        } else if (item && typeof item === 'object') {
            if (typeof (item as Record<string, unknown>).url === 'string') {
                url = ((item as Record<string, unknown>).url as string).trim()
            }
        }

        if (url && !urls.some((u) => u.url === url)) {
            urls.push({ url })
        }
    })

    return urls
}

/**
 * Deep merge two objects
 */
function mergeDeep<T>(defaults: T | undefined, overrides: unknown): T {
    if (overrides === undefined || overrides === null) {
        return (defaults ?? {}) as T
    }

    if (Array.isArray(overrides)) {
        return overrides as T
    }

    if (typeof overrides !== 'object') {
        return overrides as T
    }

    const base: Record<string, unknown> =
        defaults && typeof defaults === 'object' && !Array.isArray(defaults)
            ? { ...(defaults as object) }
            : {}

    Object.entries(overrides as Record<string, unknown>).forEach(([key, value]) => {
        if (value === undefined || value === null) {
            return
        }

        if (Array.isArray(value)) {
            base[key] = value
            return
        }

        if (typeof value === 'object') {
            base[key] = mergeDeep(base[key], value)
            return
        }

        base[key] = value
    })

    return base as T
}

/**
 * Get business data for Schema.org
 */
export async function getBusinessDataForSchema(locale?: string): Promise<SiteBusinessData> {
    const seoSettings = await getSEOSettings(locale)
    const defaults = getDefaultSEOSettings()

    const businessInfo = seoSettings?.businessInfo || defaults.businessInfo!
    const contactInfo = seoSettings?.contactInfo || defaults.contactInfo!
    const socialMedia = seoSettings?.socialMedia || defaults.socialMedia!

    const baseUrl = socialMedia.website || getServerSideURL()

    return {
        name: businessInfo.name,
        description: businessInfo.description,
        url: baseUrl,
        logo:
            socialMedia.logo && typeof socialMedia.logo === 'object' && 'url' in socialMedia.logo
                ? `${baseUrl}${socialMedia.logo.url}`
                : `${baseUrl}/logo.png`,
        email: contactInfo.email,
        telephone: contactInfo.telephone,
        foundingDate: businessInfo.foundingDate,
        priceRange: businessInfo.priceRange,
        areaServed: businessInfo.areaServed,
        address: contactInfo.address,
        geo: contactInfo.geo,
        contactPoint: contactInfo.telephone
            ? {
                  telephone: contactInfo.telephone,
                  contactType: 'Customer Service',
                  areaServed: contactInfo.address?.addressCountry || 'DE',
                  availableLanguage: ['de', 'en'],
              }
            : undefined,
        sameAs: socialMedia.sameAs?.map((social) => social.url) || [],
        businessType: businessInfo.businessType,
    }
}

/**
 * Get website data for Schema.org
 */
export async function getWebsiteDataForSchema(locale?: string): Promise<SiteWebSiteData> {
    const seoSettings = await getSEOSettings(locale)
    const defaults = getDefaultSEOSettings()

    const businessInfo = seoSettings?.businessInfo || defaults.businessInfo!
    const socialMedia = seoSettings?.socialMedia || defaults.socialMedia!
    const schemaTemplates = seoSettings?.schemaTemplates || defaults.schemaTemplates!

    const baseUrl = socialMedia.website || getServerSideURL()

    return {
        name: businessInfo.name,
        description: businessInfo.description,
        url: baseUrl,
        searchAction: schemaTemplates.websiteSchema?.enableSearch
            ? {
                  target: `${baseUrl}${schemaTemplates.websiteSchema.searchEndpoint}`,
                  queryInput: 'required name=search_term_string',
              }
            : undefined,
        language: schemaTemplates.websiteSchema?.language || 'de-DE',
    }
}

/**
 * Check if AI training is allowed
 */
export async function isAITrainingAllowed(
    pageSettings?: { robots?: { aiTraining?: boolean } },
    locale?: string,
): Promise<boolean> {
    const seoSettings = await getSEOSettings(locale)

    // Page-level override takes precedence
    if (pageSettings?.robots?.aiTraining !== undefined) {
        return pageSettings.robots.aiTraining
    }

    // Fall back to global setting
    return seoSettings?.aiAndCrawlers?.allowAITraining ?? true
}
