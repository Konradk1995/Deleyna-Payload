/**
 * Sendet eine E-Mail über die Resend API (keine Cookies, für Auto-Antworten).
 * Liest Credentials aus CMS (form-settings) mit .env-Fallback.
 */

import { getIntegrationCredentials } from './getIntegrationCredentials'

const RESEND_API_URL = 'https://api.resend.com/emails'

export interface SendAutoReplyOptions {
    to: string
    subject: string
    body: string
    fromAddress?: string
    fromName?: string
}

export async function sendAutoReplyEmail(options: SendAutoReplyOptions): Promise<boolean> {
    const { resend } = await getIntegrationCredentials()

    const apiKey = resend.apiKey
    const defaultFrom = resend.fromAddress
    const defaultFromName = resend.fromName

    if (!apiKey || !defaultFrom) return false

    const from = options.fromAddress || defaultFrom
    const fromName = options.fromName || defaultFromName

    try {
        const res = await fetch(RESEND_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                from: `${fromName} <${from}>`,
                to: [options.to],
                subject: options.subject,
                text: options.body,
            }),
        })
        return res.ok
    } catch {
        return false
    }
}
