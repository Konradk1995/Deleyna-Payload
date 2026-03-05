import { randomUUID } from 'crypto'
import { promises as fs } from 'fs'
import os from 'os'
import path from 'path'
import sharp from 'sharp'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { checkRateLimitDistributed, getClientIP, RATE_LIMITS } from '@/utilities/rateLimit'
import { getFormSettings } from '@/utilities/getFormSettings'
import { isTurnstileEnabled, verifyTurnstileToken } from '@/utilities/verifyTurnstile'

export const dynamic = 'force-dynamic'

const ALLOWED_IMAGE_MIMES = new Set(['image/jpeg', 'image/png', 'image/webp'])
const DEFAULT_MIN_WIDTH = 1000
const DEFAULT_MIN_HEIGHT = 1400
const DEFAULT_MAX_MB = 8
const DEFAULT_OUTPUT_FORMAT = 'auto'
const ABSOLUTE_REQUEST_LIMIT_MB = 25

type Locale = 'de' | 'en'
type OutputFormat = 'auto' | 'jpeg' | 'webp'

function parseLocale(value: FormDataEntryValue | null): Locale {
    return typeof value === 'string' && value.toLowerCase() === 'en' ? 'en' : 'de'
}

function parseNumberWithFallback(
    value: FormDataEntryValue | null,
    fallback: number,
    min: number,
    max: number,
): number {
    const parsed = Number(value)
    if (!Number.isFinite(parsed)) return fallback
    return Math.min(max, Math.max(min, parsed))
}

function msg(locale: Locale, de: string, en: string): string {
    return locale === 'en' ? en : de
}

function parseOutputFormat(value: string | undefined): OutputFormat {
    if (value === 'jpeg' || value === 'webp' || value === 'auto') return value
    return DEFAULT_OUTPUT_FORMAT
}

function shouldEncodeWebP(metadata: sharp.Metadata, outputFormat: OutputFormat): boolean {
    if (outputFormat === 'webp') return true
    if (outputFormat === 'jpeg') return false
    return metadata.hasAlpha === true
}

export async function POST(request: NextRequest) {
    const rawContentLength = request.headers.get('content-length')
    const maxWholeRequestBytes = ABSOLUTE_REQUEST_LIMIT_MB * 1024 * 1024

    if (!rawContentLength) {
        return NextResponse.json(
            {
                success: false,
                message:
                    'Request size header is missing. / Größen-Header der Anfrage fehlt.',
            },
            { status: 411 },
        )
    }

    const contentLength = Number(rawContentLength)
    if (!Number.isFinite(contentLength) || contentLength <= 0) {
        return NextResponse.json(
            {
                success: false,
                message: 'Invalid request size header. / Ungültiger Größen-Header der Anfrage.',
            },
            { status: 400 },
        )
    }

    if (contentLength > maxWholeRequestBytes) {
        return NextResponse.json(
            {
                success: false,
                message: 'Anfrage zu groß. Bitte lade kleinere Dateien hoch.',
            },
            { status: 413 },
        )
    }

    const clientIP = getClientIP(request.headers)
    const rateLimit = await checkRateLimitDistributed(`talent-upload:${clientIP}`, {
        ...RATE_LIMITS.form,
        maxRequests: 20,
    })

    if (!rateLimit.success) {
        return NextResponse.json(
            {
                success: false,
                message: 'Zu viele Uploads. Bitte versuche es später erneut.',
            },
            { status: 429, headers: rateLimit.headers },
        )
    }

    const formData = await request.formData()
    const locale = parseLocale(formData.get('locale'))
    const honeypot = String(formData.get('_honey') || '')
    if (honeypot.trim().length > 0) {
        return NextResponse.json(
            {
                success: true,
                file: null,
            },
            { headers: rateLimit.headers },
        )
    }

    const formSettings = await getFormSettings(locale)
    const turnstileRequired = Boolean(formSettings.enableTurnstile) && (await isTurnstileEnabled())

    const turnstileToken = String(formData.get('turnstileToken') || '')
    if (turnstileRequired) {
        if (!turnstileToken || turnstileToken.length < 10) {
            return NextResponse.json(
                {
                    success: false,
                    message: msg(
                        locale,
                        'Bitte bestätige zuerst die Sicherheitsprüfung (Turnstile), bevor du Bilder hochlädst.',
                        'Please complete the security check (Turnstile) before uploading images.',
                    ),
                },
                { status: 400, headers: rateLimit.headers },
            )
        }

        const verified = await verifyTurnstileToken(turnstileToken)
        if (!verified) {
            return NextResponse.json(
                {
                    success: false,
                    message: msg(
                        locale,
                        'Sicherheitsprüfung ungültig. Bitte lade die Seite neu und versuche es erneut.',
                        'Security check is invalid. Please refresh and try again.',
                    ),
                },
                { status: 400, headers: rateLimit.headers },
            )
        }
    }

    const file = formData.get('file')
    if (!(file instanceof File)) {
        return NextResponse.json(
            {
                success: false,
                message: msg(locale, 'Keine Datei empfangen.', 'No file received.'),
            },
            { status: 400, headers: rateLimit.headers },
        )
    }

    if (!ALLOWED_IMAGE_MIMES.has(file.type)) {
        return NextResponse.json(
            {
                success: false,
                message: msg(
                    locale,
                    'Nur JPG, PNG oder WEBP sind erlaubt.',
                    'Only JPG, PNG, or WEBP files are allowed.',
                ),
            },
            { status: 400, headers: rateLimit.headers },
        )
    }

    const minWidth = parseNumberWithFallback(formData.get('minWidth'), DEFAULT_MIN_WIDTH, 200, 4000)
    const minHeight = parseNumberWithFallback(
        formData.get('minHeight'),
        DEFAULT_MIN_HEIGHT,
        200,
        5000,
    )
    const maxFileSizeMB = parseNumberWithFallback(
        formData.get('maxFileSizeMB'),
        DEFAULT_MAX_MB,
        1,
        DEFAULT_MAX_MB,
    )
    const maxBytes = maxFileSizeMB * 1024 * 1024

    if (file.size > maxBytes) {
        return NextResponse.json(
            {
                success: false,
                message: msg(
                    locale,
                    `Datei ist zu groß. Maximal ${maxFileSizeMB} MB erlaubt.`,
                    `File is too large. Maximum allowed size is ${maxFileSizeMB} MB.`,
                ),
            },
            { status: 400, headers: rateLimit.headers },
        )
    }

    const sourceBuffer = Buffer.from(await file.arrayBuffer())

    const metadata = await sharp(sourceBuffer).metadata()
    const width = metadata.width || 0
    const height = metadata.height || 0

    if (width < minWidth || height < minHeight) {
        return NextResponse.json(
            {
                success: false,
                message: msg(
                    locale,
                    `Bild zu klein. Mindestgröße: ${minWidth}x${minHeight}px.`,
                    `Image too small. Minimum size is ${minWidth}x${minHeight}px.`,
                ),
            },
            { status: 400, headers: rateLimit.headers },
        )
    }

    const outputFormat = parseOutputFormat(process.env.TALENT_UPLOAD_OUTPUT_FORMAT)
    const encodeWebP = shouldEncodeWebP(metadata, outputFormat)
    const outputExtension = encodeWebP ? 'webp' : 'jpg'
    const normalizedPipeline = sharp(sourceBuffer).rotate().resize({
        width: 2400,
        height: 2400,
        fit: 'inside',
        withoutEnlargement: true,
    })

    const compressedBuffer = encodeWebP
        ? await normalizedPipeline
              .webp({
                  quality: 84,
              })
              .toBuffer()
        : await normalizedPipeline
              .jpeg({
                  quality: 84,
                  mozjpeg: true,
              })
              .toBuffer()

    const tempFilePath = path.join(
        os.tmpdir(),
        `talent-application-${randomUUID()}.${outputExtension}`,
    )

    try {
        await fs.writeFile(tempFilePath, compressedBuffer)

        const payload = await getPayload({ config })
        const created = await payload.create({
            collection: 'media',
            filePath: tempFilePath,
            locale,
            data: {
                alt: msg(locale, 'Talent-Bewerbungsbild', 'Talent application image'),
                caption: msg(
                    locale,
                    'Über Bewerbungsformular hochgeladen',
                    'Uploaded via talent application form',
                ),
            },
        })

        return NextResponse.json(
            {
                success: true,
                file: {
                    id: created.id,
                    url: created.url,
                    filename: created.filename,
                    width: created.width,
                    height: created.height,
                    size: created.filesize,
                },
            },
            { headers: rateLimit.headers },
        )
    } catch (error) {
        console.error('Talent application upload failed:', error)
        return NextResponse.json(
            {
                success: false,
                message: msg(
                    locale,
                    'Upload fehlgeschlagen. Bitte versuche es erneut.',
                    'Upload failed. Please try again.',
                ),
            },
            { status: 500, headers: rateLimit.headers },
        )
    } finally {
        await fs.unlink(tempFilePath).catch(() => undefined)
    }
}
