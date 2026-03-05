import { getCachedPayload } from '@/lib/payloadClient'
import { unstable_cache } from 'next/cache'

type RedirectItem = {
    from: string
    to?: {
        url?: string
        reference?: {
            relationTo: string
            value: string | { slug?: string; [key: string]: unknown }
        }
    }
    [key: string]: unknown
}

export async function getRedirects(depth = 1): Promise<RedirectItem[]> {
    try {
        const payload = await getCachedPayload()

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { docs: redirects } = await (payload as any).find({
            collection: 'redirects',
            depth,
            limit: 0,
            pagination: false,
        })

        return redirects as RedirectItem[]
    } catch {
        // Redirects collection may not exist yet
        return []
    }
}

/**
 * Cached redirects fetch. All redirects are cached together under the 'redirects' tag.
 * Revalidated via revalidateRedirects hook when a redirect is changed.
 */
export const getCachedRedirects = () =>
    unstable_cache(async () => getRedirects(), ['redirects'], {
        tags: ['redirects'],
    })
