import { getPayload } from 'payload'
import config from '@payload-config'

export interface FormSettingsData {
    enableTurnstile?: boolean
    enableAutoReply?: boolean
    autoReplyEmailField?: string
    autoReplySubject?: string
    autoReplyBody?: string
    /** Wenn gesetzt: Kontaktblock speichert in Form-Einsendungen (submitFormAction). */
    contactFormId?: number | null
}

const cache: { data: FormSettingsData | null; ts: number } = { data: null, ts: 0 }
const CACHE_MS = 60_000

/**
 * Lädt die Formulareinstellungen (Turnstile, Auto-Reply).
 * Kurz gecacht, damit nicht bei jeder Form-Aktion neu geladen wird.
 */
export async function getFormSettings(locale?: 'de' | 'en'): Promise<FormSettingsData> {
    const now = Date.now()
    if (cache.data && now - cache.ts < CACHE_MS) {
        return cache.data
    }
    try {
        const payload = await getPayload({ config })
        const global = await payload.findGlobal({
            slug: 'form-settings',
            locale: locale || 'de',
        })
        const rawContactForm = (global as { contactForm?: number | { id: number } })?.contactForm
        const contactFormId =
            typeof rawContactForm === 'number' ? rawContactForm : rawContactForm?.id ?? null

        const data: FormSettingsData = {
            enableTurnstile: Boolean((global as { enableTurnstile?: boolean })?.enableTurnstile),
            enableAutoReply: Boolean((global as { enableAutoReply?: boolean })?.enableAutoReply),
            autoReplyEmailField:
                ((global as { autoReplyEmailField?: string })?.autoReplyEmailField as string)?.trim() || 'email',
            autoReplySubject: (global as { autoReplySubject?: string })?.autoReplySubject as string | undefined,
            autoReplyBody: (global as { autoReplyBody?: string })?.autoReplyBody as string | undefined,
            contactFormId: contactFormId ?? undefined,
        }
        cache.data = data
        cache.ts = now
        return data
    } catch {
        cache.data = {
            enableTurnstile: false,
            enableAutoReply: false,
            autoReplyEmailField: 'email',
        }
        cache.ts = now
        return cache.data
    }
}
