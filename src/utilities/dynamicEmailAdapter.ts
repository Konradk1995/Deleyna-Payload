import type { EmailAdapter, SendEmailOptions } from 'payload'
import { APIError } from 'payload'
import { getIntegrationCredentials } from './getIntegrationCredentials'

/**
 * Dynamic Resend email adapter that reads credentials from CMS (form-settings)
 * at send time, with .env fallback. This allows admins to configure/change
 * Resend API keys in the Payload admin panel without restarting the server.
 */
export const dynamicResendAdapter: EmailAdapter = () => ({
    name: 'dynamic-resend',
    defaultFromAddress: process.env.RESEND_FROM_ADDRESS || 'noreply@example.com',
    defaultFromName: process.env.RESEND_FROM_NAME || 'Deleyna',
    sendEmail: async (message: SendEmailOptions) => {
        const { resend } = await getIntegrationCredentials()
        const apiKey = resend.apiKey
        const fromAddress = resend.fromAddress
        const fromName = resend.fromName

        if (!apiKey) {
            throw new APIError(
                'E-Mail kann nicht gesendet werden: Kein Resend API Key konfiguriert. '
                + 'Bitte in Formulareinstellungen oder .env setzen.',
                503,
            )
        }

        const from = resolveFrom(message.from, fromName, fromAddress)
        const to = resolveAddresses(message.to)

        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from,
                to,
                cc: resolveAddresses(message.cc),
                bcc: resolveAddresses(message.bcc),
                reply_to: resolveAddresses(message.replyTo),
                subject: message.subject ?? '',
                html: message.html?.toString() || '',
                text: message.text?.toString() || '',
            }),
        })

        const data = await res.json()

        if ('id' in data) {
            return data
        }

        const statusCode = (data as { statusCode?: number }).statusCode || res.status
        let errorMsg = `Error sending email: ${statusCode}`
        if ((data as { name?: string }).name && (data as { message?: string }).message) {
            errorMsg += ` ${(data as { name: string }).name} - ${(data as { message: string }).message}`
        }
        throw new APIError(errorMsg, statusCode)
    },
})

function resolveFrom(
    address: SendEmailOptions['from'],
    defaultName: string,
    defaultAddress: string,
): string {
    if (!address) return `${defaultName} <${defaultAddress}>`
    if (typeof address === 'string') return address
    return `${address.name} <${address.address}>`
}

function resolveAddresses(
    addresses: SendEmailOptions['to'],
): string | string[] | undefined {
    if (!addresses) return undefined
    if (typeof addresses === 'string') return addresses
    if (Array.isArray(addresses)) {
        return addresses.map((a) => (typeof a === 'string' ? a : a.address))
    }
    return [(addresses as { address: string }).address]
}
