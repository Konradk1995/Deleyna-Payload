import { cache } from 'react'
import { getPayload, type Payload } from 'payload'
import configPromise from '@payload-config'

/**
 * Cached Payload Client
 *
 * Lazily initializes a Payload client and memoizes it per request lifecycle.
 * Payload's getPayload is relatively expensive because it boots the
 * underlying connection pool. Wrapping it in React.cache lets us
 * reuse the same instance across React server components and route handlers
 * without repeatedly creating new clients.
 *
 * @example
 * ```ts
 * const payload = await getCachedPayload()
 * const posts = await payload.find({ collection: 'posts' })
 * ```
 */
export const getCachedPayload = cache(async (): Promise<Payload> => {
    return getPayload({ config: configPromise })
})

/**
 * Get Payload client with custom config
 * Use this when you need a different configuration
 */
export const getPayloadWithConfig = cache(
    async (config: Parameters<typeof getPayload>[0]['config']): Promise<Payload> => {
        return getPayload({ config })
    },
)
