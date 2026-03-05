import type { MetadataRoute } from 'next'
import { getSEOSettings, getDefaultSEOSettings } from '@/utilities/getSEOSettings'
import { getServerSideURL } from '@/utilities/getURL'
import type { AIAndCrawlersSettings } from '@/types/seo'

const BASE_DISALLOW_PATHS = ['/404', '/401', '/admin', '/admin/*', '/api/*']

// LLM User Agents
const LLM_USER_AGENTS = [
    'GPTBot',
    'OAI-SearchBot',
    'ChatGPT-User',
    'ClaudeBot',
    'anthropic-ai',
    'PerplexityBot',
    'CCBot',
    'meta-externalagent',
    'Meta-ExternalAgent',
    'YouBot',
    'DuckAssistBot',
    'cohere-ai',
]

// Search Engine User Agents
const SEARCH_ENGINE_USER_AGENTS = [
    'Googlebot',
    'Google-Extended',
    'Bingbot',
    'Applebot',
    'Applebot-Extended',
    'Amazonbot',
]

type RobotsRuleInternal = {
    userAgent: string
    allow: Set<string>
    disallow: Set<string>
}

type NormalizedRobotsRule = {
    userAgent: string | string[]
    allow?: string | string[]
    disallow?: string | string[]
    crawlDelay?: number
}

type CustomDirective = {
    userAgent?: string
    allow?: Array<{ path: string }>
    disallow?: Array<{ path: string }>
}

export default async function robots(): Promise<MetadataRoute.Robots> {
    const seoSettings = await getSEOSettings()
    const defaults = getDefaultSEOSettings()

    const baseUrl = seoSettings?.socialMedia?.website || getServerSideURL()

    const aiSettings = seoSettings?.aiAndCrawlers ?? defaults.aiAndCrawlers
    const rulesMap = new Map<string, RobotsRuleInternal>()

    // Base rule for all crawlers
    upsertRule(rulesMap, '*', {
        allow: ['/'],
        disallow: BASE_DISALLOW_PATHS,
    })

    applyLLMRules(rulesMap, aiSettings)
    applySearchBotRules(rulesMap)

    const customDirectives = (seoSettings?.aiAndCrawlers?.robotsSettings?.customDirectives ??
        defaults.aiAndCrawlers?.robotsSettings?.customDirectives ??
        []) as CustomDirective[]

    customDirectives.forEach((directive) => {
        const userAgent = directive.userAgent?.trim() || '*'
        const allow = extractPaths(directive.allow)
        const disallow = extractPaths(directive.disallow)

        if (allow.length || disallow.length) {
            upsertRule(rulesMap, userAgent, { allow, disallow })
        }
    })

    const sitemapEntries = new Set<string>()
    if (seoSettings?.sitemapsIndexing?.enabled !== false) {
        sitemapEntries.add(`${baseUrl}/sitemap.xml`)
    }

    const additionalSitemaps = seoSettings?.sitemapsIndexing?.additionalSitemaps || []
    additionalSitemaps
        .map((entry) => (typeof entry === 'object' && entry.url ? entry.url.trim() : ''))
        .filter(Boolean)
        .forEach((url) => sitemapEntries.add(url))

    const rulesList: NormalizedRobotsRule[] = Array.from(rulesMap.values()).map((rule) => {
        const allow = Array.from(rule.allow)
        const disallow = Array.from(rule.disallow)

        const normalized: NormalizedRobotsRule = {
            userAgent: rule.userAgent,
        }

        if (allow.length === 1) {
            normalized.allow = allow[0]
        } else if (allow.length > 1) {
            normalized.allow = allow
        }

        if (disallow.length === 1) {
            normalized.disallow = disallow[0]
        } else if (disallow.length > 1) {
            normalized.disallow = disallow
        }

        return normalized
    })

    return {
        rules: rulesList as MetadataRoute.Robots['rules'],
        ...(sitemapEntries.size ? { sitemap: Array.from(sitemapEntries) } : {}),
    }
}

function applyLLMRules(
    map: Map<string, RobotsRuleInternal>,
    aiSettings: AIAndCrawlersSettings | undefined,
): void {
    const allowAITraining = aiSettings?.allowAITraining !== false
    const llmAllowPaths = new Set<string>()

    if (allowAITraining) {
        llmAllowPaths.add('/')

        const contentAreas = aiSettings?.llmTxtContent?.contentAreas || []
        contentAreas
            .map((entry) => entry?.area?.trim())
            .filter((area): area is string => Boolean(area))
            .forEach((area) => llmAllowPaths.add(area))
    }

    LLM_USER_AGENTS.forEach((agent) => {
        if (allowAITraining) {
            upsertRule(map, agent, { allow: Array.from(llmAllowPaths) })
        } else {
            upsertRule(map, agent, { disallow: ['/'] })
        }
    })
}

function applySearchBotRules(map: Map<string, RobotsRuleInternal>): void {
    SEARCH_ENGINE_USER_AGENTS.forEach((agent) => {
        upsertRule(map, agent, { allow: ['/'] })
    })
}

function upsertRule(
    map: Map<string, RobotsRuleInternal>,
    userAgent: string,
    update: { allow?: string[]; disallow?: string[] },
): void {
    if (!map.has(userAgent)) {
        map.set(userAgent, {
            userAgent,
            allow: new Set<string>(),
            disallow: new Set<string>(),
        })
    }

    const rule = map.get(userAgent)!

    update.allow?.forEach((path) => {
        if (!path) return
        rule.allow.add(path)
    })

    update.disallow?.forEach((path) => {
        if (!path) return
        rule.disallow.add(path)
    })
}

function extractPaths(entries?: CustomDirective['allow']): string[] {
    if (!Array.isArray(entries)) {
        return []
    }

    const unique = new Set<string>()

    entries.forEach((entry) => {
        const value = entry?.path?.trim()
        if (value) {
            unique.add(value)
        }
    })

    return Array.from(unique)
}
