import { NextResponse } from 'next/server'
import { generateSitemapEntries, generateSitemapXML } from '@/utilities/sitemap'

export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Revalidate every hour

export async function GET() {
    try {
        const entries = await generateSitemapEntries()
        const xml = generateSitemapXML(entries)

        return new NextResponse(xml, {
            headers: {
                'Content-Type': 'application/xml; charset=utf-8',
                'Cache-Control':
                    'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
            },
        })
    } catch (error) {
        console.error('Error generating sitemap:', error)

        // Fallback sitemap
        const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
        const fallback = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
  </url>
</urlset>`

        return new NextResponse(fallback, {
            headers: {
                'Content-Type': 'application/xml; charset=utf-8',
                'Cache-Control': 'public, max-age=300',
            },
        })
    }
}
