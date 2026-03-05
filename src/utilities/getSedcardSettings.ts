import { getPayload } from 'payload'
import config from '@payload-config'

export interface SedcardSettingsData {
    enableFrontendDownload: boolean
    defaultTemplate: string
    agencyLogoUrl?: string | null
    footerText?: string | null
}

const cache: { data: SedcardSettingsData | null; ts: number } = { data: null, ts: 0 }
const CACHE_MS = 60_000

export async function getSedcardSettings(): Promise<SedcardSettingsData> {
    const now = Date.now()
    if (cache.data && now - cache.ts < CACHE_MS) {
        return cache.data
    }
    try {
        const payload = await getPayload({ config })
        const global = await payload.findGlobal({
            slug: 'sedcard-settings',
            depth: 1,
        })

        const logo = global.agencyLogo
        const logoUrl = typeof logo === 'object' && logo?.url ? logo.url : null

        const data: SedcardSettingsData = {
            enableFrontendDownload: Boolean(global.enableFrontendDownload),
            defaultTemplate: (global.defaultTemplate as string) || 'classic',
            agencyLogoUrl: logoUrl,
            footerText: (global.footerText as string) || null,
        }
        cache.data = data
        cache.ts = now
        return data
    } catch {
        const fallback: SedcardSettingsData = {
            enableFrontendDownload: false,
            defaultTemplate: 'classic',
        }
        cache.data = fallback
        cache.ts = now
        return fallback
    }
}
