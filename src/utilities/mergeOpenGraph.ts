import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'

type OpenGraphType = NonNullable<Metadata['openGraph']>

/**
 * Default OpenGraph configuration
 */
const defaultOpenGraph: OpenGraphType = {
    type: 'website',
    siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'Meine Website',
    images: [
        {
            url: `${getServerSideURL()}/og-image.png`,
            width: 1200,
            height: 630,
            alt: 'Open Graph Image',
        },
    ],
}

/**
 * Merge page-specific OpenGraph data with defaults
 */
export async function mergeOpenGraph(
    og?: Partial<OpenGraphType>,
    locale?: string,
): Promise<OpenGraphType> {
    const baseUrl = getServerSideURL()

    // Build URL with locale if provided
    const url = og?.url
        ? typeof og.url === 'string'
            ? og.url.startsWith('http')
                ? og.url
                : `${baseUrl}${locale ? `/${locale}` : ''}${og.url.startsWith('/') ? og.url : `/${og.url}`}`
            : og.url
        : baseUrl

    return {
        ...defaultOpenGraph,
        ...og,
        url,
        locale: locale || 'de_DE',
        images:
            og?.images && Array.isArray(og.images) && og.images.length > 0
                ? og.images
                : defaultOpenGraph.images,
    }
}

/**
 * Generate Twitter card metadata
 */
export function generateTwitterCard(og: OpenGraphType): Metadata['twitter'] {
    const firstImage = Array.isArray(og.images) && og.images[0]
    const imageUrl = firstImage
        ? typeof firstImage === 'string'
            ? firstImage
            : 'url' in firstImage
              ? firstImage.url
              : undefined
        : undefined

    return {
        card: 'summary_large_image',
        title: typeof og.title === 'string' ? og.title : undefined,
        description: og.description || undefined,
        images: imageUrl ? [imageUrl] : undefined,
    }
}
