import type { CollectionBeforeChangeHook } from 'payload'

/**
 * Sets publishedAt when a document is first published.
 * Shared across Pages, Posts, Talents.
 */
export const populatePublishedAt: CollectionBeforeChangeHook = ({ data }) => {
    if (data?._status === 'published' && !data?.publishedAt) {
        data.publishedAt = new Date().toISOString()
    }
    return data
}
