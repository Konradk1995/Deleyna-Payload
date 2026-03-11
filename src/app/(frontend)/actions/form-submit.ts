'use server'

import { headers } from 'next/headers'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { verifyTurnstileToken, isTurnstileEnabled } from '@/utilities/verifyTurnstile'
import { getFormSettings } from '@/utilities/getFormSettings'
import { sendAutoReplyEmail } from '@/utilities/sendAutoReplyEmail'

interface FormSubmissionData {
  field: string
  value: string
}

interface SubmitFormResult {
  success: boolean
  message?: string
  errors?: string[]
}

// Simple in-memory rate limiter for server actions (for stricter limits use POST /api/form/submit)
const rateLimitMap = new Map<string, number[]>()
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX = 5

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const timestamps = (rateLimitMap.get(ip) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS)

  if (timestamps.length >= RATE_LIMIT_MAX) {
    rateLimitMap.set(ip, timestamps)
    return true
  }

  timestamps.push(now)
  rateLimitMap.set(ip, timestamps)
  return false
}

async function getClientIp(): Promise<string> {
  const h = await headers()
  return h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'unknown'
}

const rateLimitMessages: Record<string, string> = {
  de: 'Zu viele Anfragen. Bitte versuche es später erneut.',
  en: 'Too many submissions. Please try again later.',
}

const turnstileMessages: Record<string, string> = {
  de: 'Sicherheitsprüfung fehlgeschlagen. Bitte lade die Seite neu und versuche es erneut.',
  en: 'Security check failed. Please refresh the page and try again.',
}

const submitMessages = {
  de: {
    submitted: 'Formular erfolgreich gesendet',
    formIdMissing: 'Formular-ID fehlt',
    noData: 'Keine Formulardaten übermittelt',
    createFailed: 'Formularanfrage konnte nicht gespeichert werden',
    autoReplyFormName: 'Formular',
  },
  en: {
    submitted: 'Form submitted successfully',
    formIdMissing: 'Form ID is required',
    noData: 'No submission data provided',
    createFailed: 'Failed to create form submission',
    autoReplyFormName: 'Form',
  },
} as const

export async function submitFormAction(
  formId: number,
  submissionData: FormSubmissionData[],
  locale?: string | null,
  turnstileToken?: string | null,
): Promise<SubmitFormResult> {
  try {
    const lang = locale === 'en' ? 'en' : 'de'
    const msg = submitMessages[lang]
    const formSettings = await getFormSettings(locale === 'en' ? 'en' : 'de')

    // Turnstile nur, wenn in Einstellungen aktiviert UND Keys in .env gesetzt
    if (formSettings.enableTurnstile && (await isTurnstileEnabled())) {
      if (!turnstileToken || typeof turnstileToken !== 'string' || turnstileToken.length < 10) {
        const lang = locale === 'en' ? 'en' : 'de'
        return {
          success: false,
          message: turnstileMessages[lang],
        }
      }
      const valid = await verifyTurnstileToken(turnstileToken)
      if (!valid) {
        const lang = locale === 'en' ? 'en' : 'de'
        return {
          success: false,
          message: turnstileMessages[lang],
        }
      }
    }

    // Rate limit check
    const ip = await getClientIp()
    if (isRateLimited(ip)) {
      const lang = locale === 'en' ? 'en' : 'de'
      return {
        success: false,
        message: rateLimitMessages[lang],
      }
    }

    // Honeypot check
    const honeyField = submissionData.find((item) => item.field === '_honey')
    if (honeyField && honeyField.value) {
      // Return success to fool bots, but DO NOT save submission
      return {
        success: true,
        message: msg.submitted,
      }
    }

    const payload = await getPayload({ config: configPromise })

    // Validate required fields
    if (!formId) {
      return {
        success: false,
        message: msg.formIdMissing,
      }
    }

    if (!submissionData || submissionData.length === 0) {
      return {
        success: false,
        message: msg.noData,
      }
    }

    // Convert values to strings for submission and filter out honeypot
    const formattedData = submissionData
      .filter((item) => item.field !== '_honey')
      .map((item) => ({
        field: item.field,
        value: String(item.value),
      }))

    const data: { form: number; submissionData: typeof formattedData; locale?: 'de' | 'en' } = {
      form: formId,
      submissionData: formattedData,
    }
    if (locale === 'de' || locale === 'en') {
      data.locale = locale
    }

    const submission = await payload.create({
      collection: 'form-submissions',
      data,
    })

    if (!submission) {
      return {
        success: false,
        message: msg.createFailed,
      }
    }

    // Automatische E-Mail-Antwort, wenn in Einstellungen aktiviert
    if (formSettings.enableAutoReply && formSettings.autoReplySubject && formSettings.autoReplyBody) {
      const emailField = formSettings.autoReplyEmailField || 'email'
      const emailEntry = formattedData.find((i) => i.field === emailField)
      const toEmail = emailEntry?.value?.trim()
      if (toEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(toEmail)) {
        let formName: string = msg.autoReplyFormName
        try {
          const formDoc = await payload.findByID({
            collection: 'forms',
            id: formId,
            depth: 0,
          })
          formName = (formDoc as { title?: string })?.title || formName
        } catch {
          // ignore
        }
        const subject = (formSettings.autoReplySubject || '').replace(/\{formName\}/g, formName)
        const body = (formSettings.autoReplyBody || '').replace(/\{formName\}/g, formName)
        await sendAutoReplyEmail({ to: toEmail, subject, body })
      }
    }

    return {
      success: true,
      message: msg.submitted,
    }
  } catch (error) {
    console.error('Form submission error:', error instanceof Error ? error.message : 'Unknown')

    const lang = locale === 'en' ? 'en' : 'de'
    return {
      success: false,
      message:
        lang === 'de'
          ? 'Beim Absenden ist ein Fehler aufgetreten.'
          : 'An error occurred while submitting the form.',
    }
  }
}
