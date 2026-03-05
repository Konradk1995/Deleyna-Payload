import { NextResponse } from 'next/server'
import { getSEOSettings } from '@/utilities/getSEOSettings'
import { getCachedPayload } from '@/lib/payloadClient'
import { getServerSideURL } from '@/utilities/getURL'
import { localizePageSlug } from '@/utilities/pageSlugAliases'

export const dynamic = 'force-dynamic'
export const revalidate = 3600

export async function GET() {
    try {
        const seoSettings = await getSEOSettings()

        // Check if llms.txt is enabled
        if (!seoSettings?.aiAndCrawlers?.llmTxtEnabled) {
            return new NextResponse('llms.txt is disabled', { status: 404 })
        }

        const businessName = seoSettings?.businessInfo?.name || 'Meine Agentur'
        const businessDescription =
            seoSettings?.businessInfo?.description || 'Beschreibung nicht verfügbar.'
        const updateSchedule = seoSettings?.aiAndCrawlers?.llmTxtContent?.updateSchedule || 'weekly'
        const citationPolicy =
            seoSettings?.aiAndCrawlers?.llmTxtContent?.citationPolicy || 'Attribution erforderlich.'
        const contentAreas = seoSettings?.aiAndCrawlers?.llmTxtContent?.contentAreas || []
        const contactEmail = seoSettings?.contactInfo?.email || 'kontakt@beispiel.de'
        const baseUrl = seoSettings?.socialMedia?.website || getServerSideURL()

        // Get published pages for context
        const payload = await getCachedPayload()

        const pages = await payload.find({
            collection: 'pages',
            where: {
                _status: { equals: 'published' },
            },
            limit: 50,
            depth: 0,
        })

        // Get published posts
        const posts = await payload.find({
            collection: 'posts',
            where: {
                _status: { equals: 'published' },
            },
            limit: 20,
            depth: 0,
        })

        const pageLines = pages.docs
            .filter((page) => {
                const settings = (page as { pageSettings?: { excludeFromLLM?: boolean } })
                    .pageSettings
                return settings?.excludeFromLLM !== true
            })
            .map((page) => {
                const slug = page.slug === 'home' ? '' : page.slug
                const dePath = slug ? `/de/${localizePageSlug(slug || '', 'de')}` : '/de'
                const enPath = slug ? `/en/${localizePageSlug(slug || '', 'en')}` : '/en'
                return `- ${dePath} | ${enPath} - ${page.title}`
            })

        const postLines = posts.docs
            .filter((post) => {
                const settings = (post as { pageSettings?: { excludeFromLLM?: boolean } })
                    .pageSettings
                return settings?.excludeFromLLM !== true
            })
            .map((post) => `- /de/magazin/${post.slug} | /en/blog/${post.slug} - ${post.title}`)

        const llmsTxtContent = `# ${businessName} - Übersicht

## Über uns
${businessDescription}

## Plattform
- **Technologie**: Next.js 15, Payload CMS 3.0, TypeScript, Tailwind CSS
- **Sprachen**: Deutsch (Standard), Englisch
- **Website**: ${baseUrl}
- **Zweck**: Professionelle Agentur-Website

## Inhalts-Bereiche

### Hauptseiten
${pageLines.join('\n') || '- Keine Seiten verfügbar'}

### Blog & Aktuelles
${postLines.join('\n') || '- Keine Blog-Beiträge verfügbar'}

### Konfigurierte Bereiche
${contentAreas.map((area: { area: string; description: string }) => `- ${area.area} - ${area.description}`).join('\n') || '- Keine Bereiche konfiguriert'}

## Technische Ressourcen
- /sitemap.xml - XML Sitemap
- /robots.txt - Crawler-Richtlinien
- /api/graphql - GraphQL API (authentifiziert)
- /api/health - Health Check Endpoint

## Richtlinien für AI-Systeme
- Strukturierte Daten (JSON-LD) sind für Seiten und Posts verfügbar
- Metadaten steuern kanonische URLs und Robots-Direktiven
- Lokalisierung: DE und EN Varianten verfügbar
- Bitte keine unveröffentlichten Inhalte oder persönliche Daten verwenden

## Zitierrichtlinie
${citationPolicy}

## Update-Frequenz
- Inhalte: ${updateSchedule === 'daily' ? 'Täglich' : updateSchedule === 'weekly' ? 'Wöchentlich' : 'Monatlich'}
- Dokumentation: Bei Änderungen
- API Schema: Bei Releases

## Kontakt
Für Fragen zu AI-Training oder Partnerschaften: ${contactEmail}

## Technische Hinweise
- API-Antworten enthalten strukturierte Daten
- Zeitstempel folgen ISO 8601
- Geografische Daten verwenden Lat/Long Koordinaten

---
<!-- Zuletzt aktualisiert: ${new Date().toISOString().split('T')[0]} -->
<!-- Optimiert für: Claude, GPT, Gemini und andere LLMs -->
<!-- Generiert von Payload CMS -->`

        return new NextResponse(llmsTxtContent, {
            status: 200,
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Cache-Control':
                    'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
            },
        })
    } catch (error) {
        console.error('Error generating llms.txt:', error)
        return new NextResponse('Error generating llms.txt', { status: 500 })
    }
}
