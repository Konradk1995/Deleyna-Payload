import type { GlobalConfig } from 'payload'
import { adminOnly } from '@/access'

export const FormSettings: GlobalConfig = {
    slug: 'form-settings',
    label: { de: 'Formulareinstellungen', en: 'Form settings' },
    access: {
        read: () => true,
        update: adminOnly,
    },
    admin: {
        group: { de: 'Formulare', en: 'Forms' },
        description: {
            de: 'Bot-Schutz (Turnstile) und automatische E-Mail-Antworten für Formulare.',
            en: 'Bot protection (Turnstile) and automatic email replies for forms.',
        },
    },
    fields: [
        {
            type: 'tabs',
            tabs: [
                {
                    label: { de: 'Kontaktblock', en: 'Contact block' },
                    fields: [
                        {
                            name: 'contactForm',
                            type: 'relationship',
                            relationTo: 'forms',
                            label: { de: 'Formular für Kontaktblock', en: 'Form for contact block' },
                            admin: {
                                description: {
                                    de: 'Wenn gesetzt, speichert der Kontaktblock Einsendungen in Formular-Einsendungen (mit Turnstile & Auto-Antwort). Formular sollte Felder z. B. firstName, lastName, email, subject, message haben.',
                                    en: 'When set, the contact block saves submissions to form submissions (with Turnstile & auto-reply). Form should have fields e.g. firstName, lastName, email, subject, message.',
                                },
                            },
                        },
                    ],
                },
                {
                    label: { de: 'Bot-Schutz', en: 'Bot protection' },
                    fields: [
                        {
                            name: 'enableTurnstile',
                            type: 'checkbox',
                            label: { de: 'Turnstile aktivieren', en: 'Enable Turnstile' },
                            defaultValue: false,
                            admin: {
                                description: {
                                    de: 'Cookie-freier Bot-Schutz (Cloudflare). Keys können hier oder in .env gesetzt werden.',
                                    en: 'Cookie-free bot protection (Cloudflare). Keys can be set here or in .env.',
                                },
                            },
                        },
                        {
                            name: 'turnstileSiteKey',
                            type: 'text',
                            label: { de: 'Turnstile Site Key', en: 'Turnstile Site Key' },
                            admin: {
                                description: {
                                    de: 'Überschreibt NEXT_PUBLIC_TURNSTILE_SITE_KEY aus .env',
                                    en: 'Overrides NEXT_PUBLIC_TURNSTILE_SITE_KEY from .env',
                                },
                                condition: (_, siblingData) => siblingData?.enableTurnstile === true,
                            },
                        },
                        {
                            name: 'turnstileSecretKey',
                            type: 'text',
                            label: { de: 'Turnstile Secret Key', en: 'Turnstile Secret Key' },
                            admin: {
                                description: {
                                    de: 'Überschreibt TURNSTILE_SECRET_KEY aus .env',
                                    en: 'Overrides TURNSTILE_SECRET_KEY from .env',
                                },
                                condition: (_, siblingData) => siblingData?.enableTurnstile === true,
                            },
                        },
                    ],
                },
                {
                    label: { de: 'Automatische E-Mail-Antwort', en: 'Auto-reply email' },
                    fields: [
                        {
                            name: 'enableAutoReply',
                            type: 'checkbox',
                            label: { de: 'Automatische Antwort senden', en: 'Send automatic reply' },
                            defaultValue: false,
                            admin: {
                                description: {
                                    de: 'Nach jeder Formular-Einsendung eine Bestätigungs-E-Mail senden. Keys können hier oder in .env gesetzt werden.',
                                    en: 'Send a confirmation email after each form submission. Keys can be set here or in .env.',
                                },
                            },
                        },
                        {
                            name: 'resendApiKey',
                            type: 'text',
                            label: { de: 'Resend API Key', en: 'Resend API Key' },
                            admin: {
                                description: {
                                    de: 'Überschreibt RESEND_API_KEY aus .env',
                                    en: 'Overrides RESEND_API_KEY from .env',
                                },
                                condition: (_, siblingData) => siblingData?.enableAutoReply === true,
                            },
                        },
                        {
                            name: 'resendFromAddress',
                            type: 'text',
                            label: { de: 'Resend Absender-Adresse', en: 'Resend From Address' },
                            admin: {
                                description: {
                                    de: 'Überschreibt RESEND_FROM_ADDRESS aus .env',
                                    en: 'Overrides RESEND_FROM_ADDRESS from .env',
                                },
                                condition: (_, siblingData) => siblingData?.enableAutoReply === true,
                            },
                        },
                        {
                            name: 'resendFromName',
                            type: 'text',
                            label: { de: 'Resend Absender-Name', en: 'Resend From Name' },
                            admin: {
                                description: {
                                    de: 'Überschreibt RESEND_FROM_NAME aus .env',
                                    en: 'Overrides RESEND_FROM_NAME from .env',
                                },
                                condition: (_, siblingData) => siblingData?.enableAutoReply === true,
                            },
                        },
                        {
                            name: 'autoReplyEmailField',
                            type: 'text',
                            label: { de: 'Name des E-Mail-Feldes', en: 'Email field name' },
                            defaultValue: 'email',
                            admin: {
                                description: {
                                    de: 'Feldname im Formular, der die E-Mail-Adresse des Absenders enthält (z. B. "email" oder "e-mail").',
                                    en: 'Form field name that contains the submitter\'s email (e.g. "email" or "e-mail").',
                                },
                                condition: (_, siblingData) => siblingData?.enableAutoReply === true,
                            },
                        },
                        {
                            name: 'autoReplySubject',
                            type: 'text',
                            label: { de: 'Betreff', en: 'Subject' },
                            required: true,
                            localized: true,
                            admin: {
                                description: { de: 'Platzhalter: {formName}', en: 'Placeholder: {formName}' },
                                condition: (_, siblingData) => siblingData?.enableAutoReply === true,
                            },
                        },
                        {
                            name: 'autoReplyBody',
                            type: 'textarea',
                            label: { de: 'Nachrichtentext', en: 'Message body' },
                            required: true,
                            localized: true,
                            admin: {
                                description: { de: 'Platzhalter: {formName}. Einzeilige Platzhalter.', en: 'Placeholder: {formName}. Single-line placeholders.' },
                                condition: (_, siblingData) => siblingData?.enableAutoReply === true,
                            },
                        },
                    ],
                },
                {
                    label: { de: 'Rate Limiting', en: 'Rate Limiting' },
                    fields: [
                        {
                            name: 'enableUpstash',
                            type: 'checkbox',
                            label: { de: 'Distributed Rate Limiting', en: 'Distributed Rate Limiting' },
                            defaultValue: false,
                            admin: {
                                description: {
                                    de: 'Distributed Rate Limiting mit Upstash Redis. Keys können hier oder in .env gesetzt werden.',
                                    en: 'Distributed rate limiting with Upstash Redis. Keys can be set here or in .env.',
                                },
                            },
                        },
                        {
                            name: 'upstashRedisUrl',
                            type: 'text',
                            label: { de: 'Upstash Redis URL', en: 'Upstash Redis URL' },
                            admin: {
                                description: {
                                    de: 'Überschreibt UPSTASH_REDIS_REST_URL aus .env',
                                    en: 'Overrides UPSTASH_REDIS_REST_URL from .env',
                                },
                                condition: (_, siblingData) => siblingData?.enableUpstash === true,
                            },
                        },
                        {
                            name: 'upstashRedisToken',
                            type: 'text',
                            label: { de: 'Upstash Redis Token', en: 'Upstash Redis Token' },
                            admin: {
                                description: {
                                    de: 'Überschreibt UPSTASH_REDIS_REST_TOKEN aus .env',
                                    en: 'Overrides UPSTASH_REDIS_REST_TOKEN from .env',
                                },
                                condition: (_, siblingData) => siblingData?.enableUpstash === true,
                            },
                        },
                    ],
                },
            ],
        },
    ],
}
