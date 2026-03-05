import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimitDistributed, getClientIP, RATE_LIMITS } from '@/utilities/rateLimit'

export const dynamic = 'force-dynamic'

interface SubscribeRequest {
    email: string
    firstName?: string
    lastName?: string
    tags?: string[]
    source?: string
}

interface SubscribeResponse {
    success: boolean
    message: string
    alreadySubscribed?: boolean
}

/**
 * Newsletter Subscription Endpoint
 *
 * Handles newsletter subscriptions.
 * Can be extended to integrate with:
 * - Mailchimp
 * - Resend
 * - ConvertKit
 * - Buttondown
 * - etc.
 *
 * POST /api/newsletter/subscribe
 */
export async function POST(request: NextRequest): Promise<NextResponse<SubscribeResponse>> {
    try {
        // Rate limiting
        const clientIP = getClientIP(request.headers)
        const rateLimit = await checkRateLimitDistributed(
            `newsletter:${clientIP}`,
            RATE_LIMITS.newsletter,
        )

        if (!rateLimit.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Zu viele Anfragen. Bitte versuche es später erneut.',
                },
                { status: 429, headers: rateLimit.headers },
            )
        }

        const body = (await request.json()) as SubscribeRequest

        // Validate email
        if (!body.email) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'E-Mail-Adresse ist erforderlich',
                },
                { status: 400 },
            )
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(body.email)) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Bitte gib eine gültige E-Mail-Adresse ein',
                },
                { status: 400 },
            )
        }

        // Normalize email
        const normalizedEmail = body.email.toLowerCase().trim()

        // Here you would integrate with your email service provider
        // Example integrations:

        // 1. Resend (if API key is set via CMS or .env)
        const { getIntegrationCredentials } = await import('@/utilities/getIntegrationCredentials')
        const creds = await getIntegrationCredentials()
        const resendApiKey = creds.resend.apiKey
        if (resendApiKey && process.env.RESEND_AUDIENCE_ID) {
            try {
                const response = await fetch(
                    'https://api.resend.com/audiences/' +
                        process.env.RESEND_AUDIENCE_ID +
                        '/contacts',
                    {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${resendApiKey}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            email: normalizedEmail,
                            first_name: body.firstName,
                            last_name: body.lastName,
                            unsubscribed: false,
                        }),
                    },
                )

                if (response.ok) {
                    return NextResponse.json({
                        success: true,
                        message: 'Erfolgreich für den Newsletter angemeldet!',
                    })
                }

                // Handle already subscribed
                if (response.status === 409) {
                    return NextResponse.json({
                        success: true,
                        message: 'Du bist bereits für unseren Newsletter angemeldet.',
                        alreadySubscribed: true,
                    })
                }
            } catch (error) {
                console.error('Resend API error:', error)
                // Fall through to default response
            }
        }

        // 2. Mailchimp (if MAILCHIMP_API_KEY is set)
        const mailchimpApiKey = process.env.MAILCHIMP_API_KEY
        const mailchimpListId = process.env.MAILCHIMP_LIST_ID
        const mailchimpServer = process.env.MAILCHIMP_SERVER_PREFIX

        if (mailchimpApiKey && mailchimpListId && mailchimpServer) {
            try {
                const response = await fetch(
                    `https://${mailchimpServer}.api.mailchimp.com/3.0/lists/${mailchimpListId}/members`,
                    {
                        method: 'POST',
                        headers: {
                            Authorization: `apikey ${mailchimpApiKey}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            email_address: normalizedEmail,
                            status: 'pending', // Double opt-in
                            merge_fields: {
                                FNAME: body.firstName || '',
                                LNAME: body.lastName || '',
                            },
                            tags: body.tags || [],
                        }),
                    },
                )

                if (response.ok) {
                    return NextResponse.json({
                        success: true,
                        message: 'Bitte bestätige deine Anmeldung über den Link in der E-Mail.',
                    })
                }

                const data = await response.json()

                // Handle already subscribed
                if (data.title === 'Member Exists') {
                    return NextResponse.json({
                        success: true,
                        message: 'Du bist bereits für unseren Newsletter angemeldet.',
                        alreadySubscribed: true,
                    })
                }
            } catch (error) {
                console.error('Mailchimp API error:', error)
                // Fall through to default response
            }
        }

        // Default: Log subscription (for development/testing)
        if (process.env.NODE_ENV === 'development') {
            console.log('Newsletter subscription:', {
                email: normalizedEmail,
                firstName: body.firstName,
                lastName: body.lastName,
                tags: body.tags,
                source: body.source || 'website',
                timestamp: new Date().toISOString(),
            })
        }

        return NextResponse.json({
            success: true,
            message: 'Erfolgreich für den Newsletter angemeldet!',
        })
    } catch (error) {
        console.error('Newsletter subscription error:', error)

        return NextResponse.json(
            {
                success: false,
                message: 'Ein Fehler ist aufgetreten. Bitte versuche es später erneut.',
            },
            { status: 500 },
        )
    }
}
