import type { Config } from '@/payload-types'
import { getCachedPayload } from '@/lib/payloadClient'
import { unstable_cache } from 'next/cache'
import { resolveLocale } from '@/utilities/locale'

type Collection = keyof Config['collections']

/**
 * Cached published document fetch with tag-based revalidation.
 * Uses collection-level tags aligned with revalidateAfterChange hooks.
 * For draft/preview content, use direct payload.find() instead.
 */
export async function getCachedDocument<T = Record<string, unknown>>(
    collection: Collection,
    slug: string,
    options: { locale?: string; depth?: number } = {},
): Promise<T | null> {
    const resolvedLocale = resolveLocale(options.locale)
    const depth = options.depth ?? 2

    const fetcher = unstable_cache(
        async () => {
            const payload = await getCachedPayload()
            const result = await payload.find({
                collection,
                depth,
                locale: resolvedLocale as 'de' | 'en',
                where: {
                    slug: { equals: slug },
                    _status: { equals: 'published' },
                },
                limit: 1,
            })
            return result.docs[0] || null
        },
        [collection, slug, resolvedLocale, String(depth)],
        {
            tags: [
                collection, // collection-level tag (matched by hooks)
                `${collection}_${slug}_${resolvedLocale}`, // document-level tag
            ],
        },
    )

    return fetcher() as Promise<T | null>
}
