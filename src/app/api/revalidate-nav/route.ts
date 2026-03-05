import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import localization from '@/i18n/localization'

/**
 * API route to manually trigger cache revalidation for Global Navigation.
 * Protected by CRON_SECRET in production. Called internally after seeding or content changes.
 */
export async function GET(request: NextRequest) {
    const cronSecret = process.env.CRON_SECRET
    if (cronSecret) {
        const token = request.nextUrl.searchParams.get('secret')
        if (token !== cronSecret) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
    }

    try {
        for (const { code } of localization.locales) {
            // Revalidate Header & Footer tags used in getCachedGlobal
            revalidateTag(`global_header_${code}`)
            revalidateTag(`global_footer_${code}`)
        }

        // Also revalidate the layout which might be cached
        revalidateTag('layout')

        return NextResponse.json({
            revalidated: true,
            tags: ['header', 'footer', 'layout'],
            now: new Date().toISOString(),
        })
    } catch (error) {
        console.error('❌ API Revalidation failed:', error)
        return NextResponse.json({ error: 'Revalidation failed' }, { status: 500 })
    }
}
