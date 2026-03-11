import type { CollectionConfig } from 'payload'
import { adminOrEditor, anyone } from '../access'
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

export const Media: CollectionConfig = {
    slug: 'media',
    labels: {
        singular: { de: 'Medium', en: 'Media' },
        plural: { de: 'Medien', en: 'Media' },
    },
    admin: {
        useAsTitle: 'filename',
        listSearchableFields: ['filename', 'alt'],
        group: { de: 'Inhalte', en: 'Content' },
        description: {
            de: 'Bilder, Videos und Dateien für die Website. Alt-Text für SEO und Barrierefreiheit setzen.',
            en: 'Images, videos and files for the website. Set alt text for SEO and accessibility.',
        },
        defaultColumns: ['filename', 'alt', 'mimeType', 'createdAt'],
        components: {
            beforeListTable: ['@/components/admin/ConvertAllWebPButton#ConvertAllWebPButton'],
        },
    },
    folders: true,
    defaultPopulate: {
        alt: true,
        filename: true,
        url: true,
    },
    defaultSort: '-createdAt',
    access: {
        read: anyone,
        create: adminOrEditor,
        update: adminOrEditor,
        delete: adminOrEditor,
    },
    endpoints: [
        {
            path: '/:id/convert-webp',
            method: 'post',
            handler: async (req) => {
                const { id } = req.routeParams as { id: string }
                if (!id) return Response.json({ error: 'No ID provided' }, { status: 400 })

                const doc = await req.payload.findByID({
                    collection: 'media',
                    id,
                })

                if (!doc) return Response.json({ error: 'Not found' }, { status: 404 })

                // Skip non-convertible formats
                const mimeType = typeof doc.mimeType === 'string' ? doc.mimeType : ''
                if (!mimeType.startsWith('image/')) {
                    return Response.json({ error: 'Not an image' }, { status: 400 })
                }
                const skipMimes = ['image/webp', 'image/svg+xml', 'image/gif']
                if (skipMimes.includes(mimeType)) {
                    return Response.json({ error: `Cannot convert ${mimeType} to WebP` }, { status: 400 })
                }

                // File size guard (max 50MB input)
                const fileSize = Number(doc.filesize || 0)
                if (fileSize > 50 * 1024 * 1024) {
                    return Response.json({ error: 'File too large for conversion' }, { status: 400 })
                }

                // Locate the file in the staticDir (media)
                const filePath = path.join(process.cwd(), 'media', doc.filename as string)

                try {
                    let fileBuffer: Buffer

                    try {
                        fileBuffer = fs.readFileSync(filePath)
                    } catch (fsError) {
                        // Fallback: If not on local disk (e.g. wiped or external), try fetching by URL
                        if (doc.url) {
                            const host =
                                process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
                            const fullUrl = doc.url.startsWith('http')
                                ? doc.url
                                : `${host}${doc.url}`
                            const fetchRes = await fetch(fullUrl)
                            if (!fetchRes.ok)
                                throw new Error(`HTTP Error ${fetchRes.status} fetching ${fullUrl}`)
                            fileBuffer = Buffer.from(await fetchRes.arrayBuffer())
                        } else {
                            throw fsError
                        }
                    }

                    // Convert to WebP using Sharp manually
                    const webpBuffer = await sharp(fileBuffer).webp({ quality: 80 }).toBuffer()
                    const newFileName =
                        typeof doc.filename === 'string'
                            ? doc.filename.replace(/\.[^/.]+$/, '') + '.webp'
                            : 'image.webp'

                    const file = {
                        data: webpBuffer,
                        mimetype: 'image/webp',
                        name: newFileName,
                        size: Buffer.byteLength(webpBuffer),
                    }

                    await req.payload.update({
                        collection: 'media',
                        id,
                        data: {},
                        file,
                        overwriteExistingFiles: true,
                        req, // Pass req to reuse the existing transaction and avoid deadlocks
                    })

                    return Response.json({ success: true })
                } catch (error: unknown) {
                    const err = error instanceof Error ? error : new Error(String(error))
                    req.payload.logger.error(`Error converting to webp: ${err.message}`)
                    return Response.json(
                        { error: 'Conversion failed' },
                        { status: 500 },
                    )
                }
            },
        },
    ],
    hooks: {
        beforeChange: [
            ({ data }) => {
                if (!data) return data

                const mimeType = String((data as { mimeType?: unknown }).mimeType || '')
                const fileSize = Number((data as { filesize?: unknown }).filesize || 0)
                const imageWarningLimit = 400 * 1024
                const videoWarningLimit = 12 * 1024 * 1024

                let performanceNote = ''

                if (mimeType.startsWith('image/') && fileSize > imageWarningLimit) {
                    performanceNote =
                        'Large image: for best Lighthouse/LCP keep below ~400 KB when possible. / Großes Bild: für beste Lighthouse/LCP-Werte möglichst unter ~400 KB halten.'
                } else if (mimeType.startsWith('video/') && fileSize > videoWarningLimit) {
                    performanceNote =
                        'Large video: for smooth loading keep below ~12 MB when possible. / Großes Video: für schnelle Ladezeit möglichst unter ~12 MB halten.'
                }

                return {
                    ...data,
                    performanceNote,
                }
            },
        ],
    },
    upload: {
        staticDir: 'media',
        focalPoint: true,
        mimeTypes: ['image/*', 'video/*', 'application/pdf'],
        formatOptions: {
            format: 'webp',
            options: {
                quality: 85,
            },
        },
        imageSizes: [
            {
                name: 'thumbnail',
                width: 300,
                height: 300,
                position: 'centre',
            },
            {
                name: 'square',
                width: 500,
                height: 500,
                position: 'centre',
            },
            {
                name: 'small',
                width: 600,
                height: undefined,
            },
            {
                name: 'card',
                width: 768,
                height: 432,
                position: 'centre',
            },
            {
                name: 'medium',
                width: 900,
                height: undefined,
            },
            {
                name: 'large',
                width: 1400,
                height: undefined,
            },
            {
                name: 'hero',
                width: 1920,
                height: 1080,
                position: 'centre',
            },
            {
                name: 'og',
                width: 1200,
                height: 630,
                position: 'centre',
            },
        ],
        adminThumbnail: 'card',
    },
    fields: [
        {
            name: 'alt',
            type: 'text',
            localized: true,
            required: true,
            admin: {
                description: {
                    de: 'Beschreibender Alt-Text für Barrierefreiheit und SEO. Empfohlen: Bilder < 400 KB, Videos < 12 MB.',
                    en: 'Descriptive alt text for accessibility and SEO. Recommended: Images < 400 KB, Videos < 12 MB.',
                },
            },
        },
        {
            name: 'caption',
            type: 'text',
            admin: {
                description: { de: 'Optionale Bildunterschrift', en: 'Optional caption' },
            },
        },
        {
            name: 'performanceNote',
            type: 'textarea',
            admin: {
                readOnly: true,
                description: {
                    de: 'Automatischer Hinweis zur Dateigröße (Performance/Lighthouse).',
                    en: 'Automatic warning based on file size (performance/Lighthouse).',
                },
            },
        },
        {
            name: 'convertWebp',
            type: 'ui',
            admin: {
                position: 'sidebar',
                components: {
                    Field: '@/components/admin/WebPConvertButton#WebPConvertButton',
                },
            },
        },
    ],
}
