/**
 * Serialization utilities for stripping heavy Payload data
 * before passing to Client Components.
 *
 * This reduces HTML payload size and improves hydration performance.
 */

type MediaImage = {
    url?: string
    alt?: string
    sizes?: Record<string, { url?: string; width?: number; height?: number }>
}

/**
 * Serialize a Media object to only what the frontend needs.
 */
export function serializeMedia(media: unknown): { url: string; alt: string } | null {
    if (!media || typeof media !== 'object') return null
    const m = media as MediaImage
    return {
        url: m.url || '',
        alt: m.alt || '',
    }
}

/**
 * Serialize a Media object with specific size.
 */
export function serializeMediaWithSize(
    media: unknown,
    size: string,
): { url: string; alt: string; width?: number; height?: number } | null {
    if (!media || typeof media !== 'object') return null
    const m = media as MediaImage
    const sizeData = m.sizes?.[size]

    return {
        url: sizeData?.url || m.url || '',
        alt: m.alt || '',
        width: sizeData?.width,
        height: sizeData?.height,
    }
}

/**
 * Serialize a Talent document for listing pages.
 * Strips all heavy data, keeps only what the card needs.
 */
export function serializeTalentForCard(talent: Record<string, unknown>) {
    const featuredImage = talent.featuredImage as MediaImage | undefined

    return {
        id: talent.id as string,
        name: talent.name as string,
        slug: talent.slug as string,
        category: talent.category as string,
        featured: talent.featured as boolean,
        image: featuredImage
            ? {
                  url: featuredImage.sizes?.card?.url || featuredImage.url || '',
                  alt: featuredImage.alt || (talent.name as string),
              }
            : null,
    }
}

/**
 * Serialize a Post document for listing pages.
 */
export function serializePostForCard(post: Record<string, unknown>) {
    const featuredImage = post.featuredImage as MediaImage | undefined

    return {
        id: post.id as string,
        title: post.title as string,
        slug: post.slug as string,
        excerpt: (post.excerpt as string) || '',
        category: (post.category as string) || '',
        publishedAt: (post.publishedAt as string) || '',
        image: featuredImage
            ? {
                  url: featuredImage.sizes?.card?.url || featuredImage.url || '',
                  alt: featuredImage.alt || (post.title as string),
              }
            : null,
    }
}
