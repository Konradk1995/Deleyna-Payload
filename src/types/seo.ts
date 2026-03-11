/**
 * Centralized SEO Type Definitions
 * Provides type safety for all SEO-related components and utilities
 */

import type { Media } from '@/payload-types'

// ============================================
// Base SEO Settings Structure
// ============================================

export interface SEOSettings {
    favicon?: Media | number | string | null
    appleTouchIcon?: Media | number | string | null
    businessInfo: BusinessInfo
    contactInfo: ContactInfo
    socialMedia: SocialMediaInfo
    aiAndCrawlers: AIAndCrawlersSettings
    schemaTemplates: SchemaTemplateSettings
    analytics: AnalyticsSettings
    sitemapsIndexing: SitemapSettings
}

// ============================================
// Business Information
// ============================================

export interface BusinessInfo {
    name: string
    description: string
    businessType: BusinessType[]
    foundingDate: string
    priceRange: PriceRange
    areaServed: string
}

export type BusinessType =
    | 'LocalBusiness'
    | 'ProfessionalService'
    | 'Organization'
    | 'SoftwareApplication'

export type PriceRange = '€' | '€€' | '€€€' | '€€€€'

// ============================================
// Contact Information
// ============================================

export interface ContactInfo {
    email: string
    telephone: string
    address?: Address
    geo?: GeoCoordinates
}

export interface Address {
    streetAddress?: string
    addressLocality?: string
    addressRegion?: string
    postalCode?: string
    addressCountry: string
}

export interface GeoCoordinates {
    latitude: number
    longitude: number
}

// ============================================
// Social Media Information
// ============================================

export interface SocialMediaInfo {
    website?: string
    logo?: Media | number | string
    sameAs?: SocialMediaLink[]
}

export interface SocialMediaLink {
    platform: SocialPlatform
    url: string
}

export type SocialPlatform =
    | 'facebook'
    | 'twitter'
    | 'instagram'
    | 'linkedin'
    | 'youtube'
    | 'tiktok'
    | 'github'
    | 'other'

// ============================================
// AI and Crawlers Settings
// ============================================

export interface AIAndCrawlersSettings {
    allowAITraining: boolean
    llmTxtEnabled: boolean
    llmTxtContent?: LLMTxtContent
    robotsSettings?: RobotsSettings
}

export interface LLMTxtContent {
    updateSchedule: 'daily' | 'weekly' | 'monthly'
    citationPolicy?: string
    contentAreas?: ContentArea[]
}

export interface ContentArea {
    area: string
    description: string
}

export interface RobotsSettings {
    customDirectives?: RobotDirective[]
}

export interface RobotDirective {
    userAgent: string
    allow?: PathRule[]
    disallow?: PathRule[]
}

export interface PathRule {
    path: string
}

export interface RobotsData {
    index?: 'index' | 'noindex' | null
    follow?: 'follow' | 'nofollow' | null
    cache?: 'cache' | 'nocache' | null
    aiTraining?: boolean | null
}

// ============================================
// Schema Template Settings
// ============================================

export interface SchemaTemplateSettings {
    websiteSchema?: WebsiteSchemaSettings
    pageDefaults?: PageDefaultsSettings
    articleDefaults?: ArticleDefaultsSettings
}

export interface WebsiteSchemaSettings {
    enableSearch?: boolean
    searchEndpoint?: string
    language?: string
}

export interface PageDefaultsSettings {
    includeBreadcrumbs?: boolean
    includeOrganization?: boolean
    includeWebsite?: boolean
}

export interface ArticleDefaultsSettings {
    defaultAuthor?: string
    includeAuthor?: boolean
    includePublisher?: boolean
    defaultSection?: string
}

// ============================================
// Analytics Settings
// ============================================

export interface AnalyticsSettings {
    rybbit?: RybbitSettings
    googleAnalytics?: GoogleAnalyticsSettings
    googleTagManager?: GTMSettings
}

export interface RybbitSettings {
    enabled?: boolean
    siteId?: string
    scriptUrl?: string
}

export interface GoogleAnalyticsSettings {
    enabled?: boolean
    measurementId?: string
    requireConsent?: boolean
}

export interface GTMSettings {
    enabled?: boolean
    containerId?: string
}

// ============================================
// Sitemap Settings
// ============================================

export interface SitemapSettings {
    enabled?: boolean
    includePages?: boolean
    includePosts?: boolean
    includeCategories?: boolean
    changeFrequency?: ChangeFrequency
    priority?: number
    excludePaths?: ExcludePath[]
    additionalSitemaps?: AdditionalSitemap[]
}

export type ChangeFrequency =
    | 'always'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'never'

export interface ExcludePath {
    path: string
}

export interface AdditionalSitemap {
    url: string
}

// ============================================
// Sitemap Entry
// ============================================

export interface SitemapEntry {
    url: string
    lastModified?: Date | string
    changeFrequency?: ChangeFrequency
    priority?: number
    alternates?: {
        languages?: Record<string, string>
    }
}

// ============================================
// Structured Data Types
// ============================================

export interface SiteBusinessData {
    name: string
    description: string
    url: string
    logo?: string
    email?: string
    telephone?: string
    address?: Address
    geo?: GeoCoordinates
    foundingDate?: string
    priceRange?: string
    areaServed?: string
    contactPoint?: ContactPoint
    sameAs: string[]
    businessType: BusinessType[]
}

export interface ContactPoint {
    telephone: string
    contactType: string
    areaServed: string
    availableLanguage: string[]
}

export interface SiteWebSiteData {
    name: string
    description: string
    url: string
    searchAction?: SearchAction
    language: string
}

export interface SearchAction {
    target: string
    queryInput: string
}

// ============================================
// Default Values
// ============================================

export const DEFAULT_BUSINESS_INFO: BusinessInfo = {
    name: 'Deleyna Talent Agency',
    description: 'Deleyna vermittelt Tänzer und Models für Kampagnen, Events, Editorial und Education in Berlin und international.',
    businessType: ['ProfessionalService'],
    foundingDate: '2024',
    priceRange: '€€',
    areaServed: 'Berlin, Deutschland, International',
}

export const DEFAULT_CONTACT_INFO: ContactInfo = {
    email: 'info@deleyna.com',
    telephone: '',
    address: {
        addressCountry: 'DE',
    },
}

export const DEFAULT_ROBOTS_DATA: RobotsData = {
    index: 'index',
    follow: 'follow',
    cache: 'cache',
    aiTraining: true,
}

export const DEFAULT_SITEMAP_CONFIG: SitemapSettings = {
    enabled: true,
    includePages: true,
    includePosts: true,
    includeCategories: false,
    changeFrequency: 'weekly',
    priority: 0.5,
    excludePaths: [],
    additionalSitemaps: [],
}


export const DEFAULT_AI_CRAWLERS: AIAndCrawlersSettings = {
    allowAITraining: true,
    llmTxtEnabled: true,
    llmTxtContent: {
        updateSchedule: 'weekly',
        citationPolicy:
            'Attribution erforderlich. Link zur Originalquelle wenn möglich. Keine persönlichen Daten verwenden.',
        contentAreas: [
            { area: '/blog/*', description: 'Blog-Artikel und News' },
            { area: '/leistungen/*', description: 'Unsere Dienstleistungen' },
        ],
    },
    robotsSettings: {
        customDirectives: [],
    },
}

export const DEFAULT_SCHEMA_TEMPLATES: SchemaTemplateSettings = {
    websiteSchema: {
        enableSearch: true,
        searchEndpoint: '/suche?q={search_term_string}',
        language: 'de-DE',
    },
    pageDefaults: {
        includeBreadcrumbs: true,
        includeOrganization: true,
        includeWebsite: true,
    },
    articleDefaults: {
        defaultAuthor: 'Redaktion',
        includeAuthor: true,
        includePublisher: true,
        defaultSection: 'Allgemein',
    },
}

// ============================================
// Type Guards
// ============================================

export function isValidSEOSettings(data: unknown): data is SEOSettings {
    return (
        typeof data === 'object' &&
        data !== null &&
        'businessInfo' in data &&
        typeof (data as Record<string, unknown>).businessInfo === 'object'
    )
}

export function isValidBusinessInfo(data: unknown): data is BusinessInfo {
    return (
        typeof data === 'object' &&
        data !== null &&
        'name' in data &&
        typeof (data as Record<string, unknown>).name === 'string' &&
        'description' in data &&
        typeof (data as Record<string, unknown>).description === 'string'
    )
}

export function isValidRobotsData(data: unknown): data is RobotsData {
    if (typeof data !== 'object' || data === null) {
        return false
    }

    const robots = data as Record<string, unknown>

    return (
        (!robots.index || ['index', 'noindex'].includes(robots.index as string)) &&
        (!robots.follow || ['follow', 'nofollow'].includes(robots.follow as string)) &&
        (!robots.cache || ['cache', 'nocache'].includes(robots.cache as string)) &&
        (robots.aiTraining === undefined || typeof robots.aiTraining === 'boolean')
    )
}

export function isMedia(value: unknown): value is Media {
    return typeof value === 'object' && value !== null && 'url' in value
}

// ============================================
// Utility Types
// ============================================

export type SafeAccess<T> = T extends object
    ? {
          readonly [K in keyof T]: T[K] extends object ? SafeAccess<T[K]> : T[K]
      }
    : T

export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}
