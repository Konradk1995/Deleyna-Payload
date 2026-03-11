/**
 * Fetches a media URL and returns data + format for @react-pdf/renderer.
 * Converts unsupported formats (WebP, AVIF, etc.) to JPEG.
 * @react-pdf/renderer only supports PNG and JPEG.
 */
import sharp from 'sharp'
import type { SedcardImageSource } from './types'

async function tryFetch(url: string): Promise<Buffer | null> {
    try {
        const response = await fetch(url, {
            cache: 'no-store',
            signal: AbortSignal.timeout(15_000),
        })
        if (!response.ok) return null

        const arrayBuffer = await response.arrayBuffer()
        if (arrayBuffer.byteLength === 0) return null

        return Buffer.from(arrayBuffer)
    } catch {
        return null
    }
}

async function toSedcardImage(rawBuffer: Buffer): Promise<SedcardImageSource | null> {
    try {
        const metadata = await sharp(rawBuffer).metadata()
        const format = metadata.format

        // If already JPEG or PNG, use as-is
        if (format === 'jpeg' || format === 'jpg') {
            return { data: rawBuffer, format: 'jpg' }
        }
        if (format === 'png') {
            return { data: rawBuffer, format: 'png' }
        }

        // Convert anything else (webp, avif, tiff, etc.) to JPEG
        const jpegBuffer = await sharp(rawBuffer)
            .jpeg({ quality: 90, mozjpeg: true })
            .toBuffer()
        return { data: jpegBuffer, format: 'jpg' }
    } catch (error) {
        console.warn('[sedcard] Image conversion error:', error)
        return null
    }
}

export async function fetchImageBuffer(url: string): Promise<SedcardImageSource | null> {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

    // Build the absolute URL
    const absoluteUrl = url.startsWith('http') ? url : `${serverUrl}${url}`

    // Try the primary URL first
    let rawBuffer = await tryFetch(absoluteUrl)

    // Fallback: if S3/MinIO URL failed, try via Payload API proxy
    if (!rawBuffer && url.startsWith('http')) {
        try {
            const urlObj = new URL(url)
            const filename = urlObj.pathname.split('/').pop()
            if (filename) {
                rawBuffer = await tryFetch(`${serverUrl}/api/media/file/${filename}`)
            }
        } catch {
            // URL parsing failed, skip fallback
        }
    }

    if (!rawBuffer) {
        console.warn(`[sedcard] Could not fetch image: ${url}`)
        return null
    }

    return toSedcardImage(rawBuffer)
}
