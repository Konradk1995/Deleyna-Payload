/**
 * Cloudflare Turnstile – Server-seitige Token-Verifizierung
 * Cookie-frei, DSGVO-freundlich. Docs: https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
 */

import { getIntegrationCredentials } from './getIntegrationCredentials'

const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

export interface TurnstileVerifyResult {
    success: boolean
    'error-codes'?: string[]
    message?: string
}

/**
 * Verifiziert ein Turnstile-Token bei Cloudflare.
 * Token ist einmalig gültig und läuft nach 300 Sekunden ab.
 */
export async function verifyTurnstileToken(token: string): Promise<boolean> {
    const { turnstile } = await getIntegrationCredentials()
    const secret = turnstile.secretKey
    if (!secret || !token || token.length < 10) {
        return false
    }

    try {
        const formData = new URLSearchParams()
        formData.append('secret', secret)
        formData.append('response', token)

        const res = await fetch(TURNSTILE_VERIFY_URL, {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })

        const data = (await res.json()) as TurnstileVerifyResult
        return data.success === true
    } catch {
        return false
    }
}

/** Prüft, ob Turnstile aktiviert ist (Secret Key gesetzt). */
export async function isTurnstileEnabled(): Promise<boolean> {
    const { turnstile } = await getIntegrationCredentials()
    return turnstile.enabled && Boolean(turnstile.secretKey.trim())
}
