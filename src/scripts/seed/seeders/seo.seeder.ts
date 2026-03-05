import type { Payload } from 'payload'

export async function seoSeeder(payload: Payload) {
    console.log('📦 Seeding SEO global (meta + schema defaults)...')

    try {
        await payload.updateGlobal({
            slug: 'seo',
            locale: 'de',
            data: {
                businessInfo: {
                    name: 'Deleyna Talent Agency',
                    description:
                        'Deleyna vermittelt Tänzer und Models für Kampagnen, Events, Editorial und Education in Berlin und international.',
                    businessType: 'ProfessionalService',
                    foundingDate: '2024',
                    priceRange: '€€€',
                },
                contactInfo: {
                    email: 'info@deleyna.com',
                    telephone: '+49 30 123 456 78',
                    streetAddress: 'Berlin',
                    addressLocality: 'Berlin',
                    postalCode: '10115',
                    addressCountry: 'DE',
                },
                socialMedia: {
                    website: 'https://deleyna.com',
                    sameAs: [
                        {
                            platform: 'instagram',
                            url: 'https://www.instagram.com/deleyna',
                        },
                    ],
                },
                aiAndCrawlers: {
                    allowAITraining: true,
                    llmTxtEnabled: true,
                    llmTxtContent: {
                        updateSchedule: 'weekly',
                        citationPolicy:
                            'Inhalte nur mit klarer Quellenangabe verwenden. Keine Marken- oder Bildnutzung ohne schriftliche Freigabe.',
                        contentAreasText: '/talente/*\n/magazin/*\n/services/*\n/education/*',
                    },
                    robotsExtraRules: 'Disallow: /admin\nAllow: /',
                },
                sitemapsIndexing: {
                    enabled: true,
                    includePages: true,
                    includePosts: true,
                    changeFrequency: 'weekly',
                    priority: 0.7,
                    excludePathsText: '/admin\n/api/*',
                },
                analytics: {
                    rybbit: {
                        enabled: false,
                    },
                    googleAnalytics: {
                        enabled: false,
                        requireConsent: true,
                    },
                    googleTagManager: {
                        enabled: false,
                    },
                },
                schemaTemplates: {
                    websiteSchema: {
                        enableSearch: true,
                        searchEndpoint: '/suche?q={search_term_string}',
                        language: 'de-DE',
                    },
                    includeBreadcrumbs: true,
                    includeOrganization: true,
                },
            },
            context: { disableRevalidate: true },
        })

        await payload.updateGlobal({
            slug: 'seo',
            locale: 'en',
            data: {
                businessInfo: {
                    name: 'Deleyna Talent Agency',
                    description:
                        'Deleyna represents dancers and models for campaigns, events, editorial and education in Berlin and internationally.',
                },
                aiAndCrawlers: {
                    llmTxtContent: {
                        citationPolicy:
                            'Use content only with clear attribution. No brand or image usage without written approval.',
                    },
                },
            },
            context: { disableRevalidate: true },
        })

        console.log('  ✅ SEO global updated (DE/EN)')
        return { updated: true }
    } catch (error) {
        console.error('  ❌ SEO seeding failed:', error)
        return { updated: false }
    }
}
