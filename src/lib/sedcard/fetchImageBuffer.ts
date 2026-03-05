/**
 * Fetches a media URL and returns data + format for @react-pdf/renderer.
 * Handles both absolute and relative URLs.
 */
import type { SedcardImageSource } from './types'

export async function fetchImageBuffer(url: string): Promise<SedcardImageSource | null> {
    try {
        const absoluteUrl = url.startsWith('http')
            ? url
            : `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}${url}`

        const response = await fetch(absoluteUrl, { cache: 'no-store' })
        if (!response.ok) return null

        const contentType = response.headers.get('content-type') || ''
        const format: SedcardImageSource['format'] = contentType.includes('png') ? 'png' : 'jpg'

        const arrayBuffer = await response.arrayBuffer()
        return {
            data: Buffer.from(arrayBuffer),
            format,
        }
    } catch {
        return null
    }
}
