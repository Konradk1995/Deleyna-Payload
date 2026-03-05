import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { checkRateLimitDistributed, getClientIP, RATE_LIMITS } from '@/utilities/rateLimit'
import { validateFormData, sanitizeEmail, hasSQLInjection } from '@/utilities/sanitize'
import { getFormSettings } from '@/utilities/getFormSettings'
import { isTurnstileEnabled, verifyTurnstileToken } from '@/utilities/verifyTurnstile'

export const dynamic = 'force-dynamic'

interface FormSubmission {
    formId: string
    data: Record<string, unknown>
    honeypot?: string
    turnstileToken?: string
}

interface FormResponse {
    success: boolean
    message: string
    submissionId?: string
    errors?: Array<{ field: string; message: string }>
}

/**
 * Form Submission Endpoint (fallback for ContactBlock when no FormSettings.contactForm is set)
 *
 * Security features:
 * - Rate limiting (10 req/min)
 * - Honeypot bot detection
 * - Input sanitization
 * - SQL injection detection
 *
 * Saves submissions to Payload form-submissions collection.
 *
 * POST /api/form/submit
 */
export async function POST(request: NextRequest): Promise<NextResponse<FormResponse>> {
    const clientIP = getClientIP(request.headers)
    const rateLimit = await checkRateLimitDistributed(`form:${clientIP}`, RATE_LIMITS.form)

    if (!rateLimit.success) {
        return NextResponse.json(
            {
                success: false,
                message: 'Zu viele Anfragen. Bitte versuche es später erneut.',
            },
            { status: 429, headers: rateLimit.headers },
        )
    }

    try {
        const body = (await request.json()) as FormSubmission

        // Honeypot check
        if (body.honeypot && body.honeypot.length > 0) {
            return NextResponse.json(
                {
                    success: true,
                    message: 'Formular erfolgreich gesendet',
                    submissionId: `fake_${Date.now()}`,
                },
                { status: 200, headers: rateLimit.headers },
            )
        }

        let requiresTurnstile = false
        try {
            const formSettings = await getFormSettings('de')
            requiresTurnstile = Boolean(formSettings.enableTurnstile) && (await isTurnstileEnabled())
        } catch {
            requiresTurnstile = false
        }

        if (requiresTurnstile) {
            const token =
                typeof body.turnstileToken === 'string' ? body.turnstileToken.trim() : ''
            if (!token || token.length < 10) {
                return NextResponse.json(
                    {
                        success: false,
                        message: 'Sicherheitsprüfung fehlgeschlagen. Bitte versuche es erneut.',
                        errors: [
                            {
                                field: 'turnstile',
                                message:
                                    'Sicherheitsprüfung fehlgeschlagen. Bitte versuche es erneut.',
                            },
                        ],
                    },
                    { status: 400, headers: rateLimit.headers },
                )
            }

            const verified = await verifyTurnstileToken(token)
            if (!verified) {
                return NextResponse.json(
                    {
                        success: false,
                        message: 'Sicherheitsprüfung fehlgeschlagen. Bitte versuche es erneut.',
                        errors: [
                            {
                                field: 'turnstile',
                                message:
                                    'Sicherheitsprüfung fehlgeschlagen. Bitte versuche es erneut.',
                            },
                        ],
                    },
                    { status: 400, headers: rateLimit.headers },
                )
            }
        }

        if (!body.formId || typeof body.formId !== 'string') {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Form ID ist erforderlich',
                    errors: [{ field: 'formId', message: 'Form ID ist erforderlich' }],
                },
                { status: 400, headers: rateLimit.headers },
            )
        }

        if (!body.data || typeof body.data !== 'object' || Object.keys(body.data).length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Formulardaten sind erforderlich',
                    errors: [{ field: 'data', message: 'Formulardaten sind erforderlich' }],
                },
                { status: 400, headers: rateLimit.headers },
            )
        }

        // Sanitize and validate
        const { isValid, sanitizedData, errors } = validateFormData(body.data)

        if (!isValid) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Ungültige Formulardaten',
                    errors: errors.map((e) => ({ field: 'data', message: e })),
                },
                { status: 400, headers: rateLimit.headers },
            )
        }

        // SQL injection check
        for (const [key, value] of Object.entries(sanitizedData)) {
            if (typeof value === 'string' && hasSQLInjection(value)) {
                console.warn(`SQL injection attempt detected from ${clientIP} in field ${key}`)
                return NextResponse.json(
                    {
                        success: false,
                        message: 'Ungültige Eingabe erkannt',
                        errors: [{ field: key, message: 'Ungültige Zeichen erkannt' }],
                    },
                    { status: 400, headers: rateLimit.headers },
                )
            }
        }

        // Email validation
        if (sanitizedData.email && typeof sanitizedData.email === 'string') {
            const sanitizedEmail = sanitizeEmail(sanitizedData.email)
            if (!sanitizedEmail) {
                return NextResponse.json(
                    {
                        success: false,
                        message: 'Ungültige E-Mail-Adresse',
                        errors: [{ field: 'email', message: 'Bitte gib eine gültige E-Mail-Adresse ein' }],
                    },
                    { status: 400, headers: rateLimit.headers },
                )
            }
            sanitizedData.email = sanitizedEmail
        }

        // Find a matching form by formId (string slug or title match)
        const payload = await getPayload({ config })

        let formDocId: number | null = null

        // Try to find the "Kontakt / Allgemein" form as fallback
        try {
            const formSearch = await payload.find({
                collection: 'forms',
                where: {
                    or: [
                        { title: { equals: body.formId } },
                        { title: { equals: 'Kontakt / Allgemein' } },
                    ],
                },
                limit: 1,
                depth: 0,
            })
            if (formSearch.docs.length > 0) {
                formDocId = formSearch.docs[0].id
            }
        } catch {
            // No form found — still save as generic submission
        }

        // Build submission data array
        const submissionData = Object.entries(sanitizedData).map(([field, value]) => ({
            field,
            value: String(value ?? ''),
        }))

        // Save to form-submissions
        const submission = await payload.create({
            collection: 'form-submissions',
            data: {
                form: formDocId ?? (undefined as unknown as number),
                submissionData,
            },
        })

        return NextResponse.json(
            {
                success: true,
                message: 'Formular erfolgreich gesendet',
                submissionId: String(submission.id),
            },
            { status: 200, headers: rateLimit.headers },
        )
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.error('Form submission error:', error)
        }

        return NextResponse.json(
            {
                success: false,
                message: 'Ein Fehler ist aufgetreten. Bitte versuche es später erneut.',
            },
            { status: 500 },
        )
    }
}
