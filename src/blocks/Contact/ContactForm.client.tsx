'use client'

import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { submitFormAction } from '@/app/(frontend)/actions/form-submit'
import { TurnstileWidget } from '@/components/Turnstile'
import { useSelection } from '@/providers/Dancefloor'
import { cn } from '@/utilities/ui'

export type ContactFormState = {
    firstName: string
    lastName: string
    email: string
    subject: string
    message: string
}

type ContactFormProps = {
    contactFormId: number | null
    turnstileEnabled: boolean
    turnstileSiteKey: string
}

export function ContactForm({ contactFormId, turnstileEnabled, turnstileSiteKey }: ContactFormProps) {
    const params = useParams()
    const locale = typeof params?.locale === 'string' ? params.locale : 'de'
    const t = useTranslations('contact')
    const { talents: selectedTalents, clearSelection } = useSelection()
    const [formState, setFormState] = useState<ContactFormState>({
        firstName: '',
        lastName: '',
        email: '',
        subject: '',
        message: '',
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
    const [honeypot, setHoneypot] = useState('')

    const needsTurnstile = turnstileEnabled && turnstileSiteKey.length > 0
    const canSubmit = !needsTurnstile || Boolean(turnstileToken)
    const messageLength = formState.message.trim().length

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setSubmitStatus('idle')

        try {
            const messageWithSelection =
                selectedTalents.length > 0
                    ? `${locale === 'de' ? t('requestRefersToTalents') : t('requestRefersToTalents')}: ${selectedTalents.map((talent) => talent.name).join(', ')}.\n\n${formState.message}`
                    : formState.message

            if (contactFormId != null) {
                const submissionData = [
                    { field: 'firstName', value: formState.firstName },
                    { field: 'lastName', value: formState.lastName },
                    { field: 'email', value: formState.email },
                    { field: 'subject', value: formState.subject },
                    { field: 'message', value: messageWithSelection },
                    { field: '_honey', value: honeypot },
                    ...(selectedTalents.length > 0
                        ? [{ field: 'talentSelection', value: selectedTalents.map((t) => `${t.name} (ID: ${t.id})`).join(', ') }]
                        : []),
                ]
                const result = await submitFormAction(
                    contactFormId,
                    submissionData,
                    locale === 'en' ? 'en' : 'de',
                    turnstileToken ?? undefined,
                )
                if (result.success) {
                    setSubmitStatus('success')
                    setFormState({ firstName: '', lastName: '', email: '', subject: '', message: '' })
                    setTurnstileToken(null)
                    if (selectedTalents.length > 0) clearSelection()
                } else {
                    setSubmitStatus('error')
                }
            } else {
                const response = await fetch('/api/form/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        formId: 'contact',
                        honeypot,
                        turnstileToken: turnstileToken ?? undefined,
                        data: {
                            ...formState,
                            message: messageWithSelection,
                            ...(selectedTalents.length > 0
                                ? {
                                      talentSelection: selectedTalents
                                          .map((talent) => `${talent.name} (ID: ${talent.id})`)
                                          .join(', '),
                                  }
                                : {}),
                        },
                    }),
                })
                if (response.ok) {
                    setSubmitStatus('success')
                    setFormState({ firstName: '', lastName: '', email: '', subject: '', message: '' })
                    setHoneypot('')
                    setTurnstileToken(null)
                    if (selectedTalents.length > 0) clearSelection()
                } else {
                    setSubmitStatus('error')
                }
            }
        } catch {
            setSubmitStatus('error')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className={cn(
                'relative surface-pill space-y-4 padding-large transition-colors hover:border-copper/20',
            )}
        >
            <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="pointer-events-none absolute left-[-9999px] h-0 w-0 opacity-0"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
            />
            {selectedTalents.length > 0 && (
                <p className="font-small-text-regular rounded-xl border border-copper/30 bg-copper/10 px-4 py-2 text-copper">
                    {t('requestRefersTo')}: {selectedTalents.map((talent) => talent.name).join(', ')}
                </p>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label
                        htmlFor="contact-firstName"
                        className="font-small-text-regular text-muted-foreground"
                    >
                        {t('firstName')}
                    </Label>
                    <Input
                        id="contact-firstName"
                        type="text"
                        placeholder={t('firstName')}
                        value={formState.firstName}
                        onChange={(e) => setFormState({ ...formState, firstName: e.target.value })}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label
                        htmlFor="contact-lastName"
                        className="font-small-text-regular text-muted-foreground"
                    >
                        {t('lastName')}
                    </Label>
                    <Input
                        id="contact-lastName"
                        type="text"
                        placeholder={t('lastName')}
                        value={formState.lastName}
                        onChange={(e) => setFormState({ ...formState, lastName: e.target.value })}
                        required
                    />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="contact-email" className="font-small-text-regular text-muted-foreground">
                    {t('email')}
                </Label>
                <Input
                    id="contact-email"
                    type="email"
                    placeholder={t('email')}
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="contact-subject" className="font-small-text-regular text-muted-foreground">
                    {t('subject')}
                </Label>
                <Input
                    id="contact-subject"
                    type="text"
                    placeholder={t('subject')}
                    value={formState.subject}
                    onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="contact-message" className="font-small-text-regular text-muted-foreground">
                    {t('message')}
                </Label>
                <Textarea
                    id="contact-message"
                    placeholder={t('message')}
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    required
                    rows={5}
                />
                <p className="text-right text-xs text-muted-foreground">
                    {messageLength} {locale === 'en' ? 'characters' : 'Zeichen'}
                </p>
            </div>
            {needsTurnstile && (
                <div className="flex justify-center">
                    <TurnstileWidget
                        siteKey={turnstileSiteKey}
                        onVerify={setTurnstileToken}
                        onExpire={() => setTurnstileToken(null)}
                        onError={() => setTurnstileToken(null)}
                        appearance="execute"
                        locale={locale}
                    />
                </div>
            )}
            <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full rounded-full bg-foreground text-background hover:bg-foreground/90"
                disabled={isSubmitting || !canSubmit}
            >
                {isSubmitting ? t('sending') : t('sendMessage')}
            </Button>
            {submitStatus === 'success' && (
                <p
                    className="rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-center text-success"
                    role="status"
                    aria-live="polite"
                >
                    {t('successMessage')}
                </p>
            )}
            {submitStatus === 'error' && (
                <p
                    className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-center text-destructive"
                    role="alert"
                    aria-live="assertive"
                >
                    {t('errorMessage')}
                </p>
            )}
        </form>
    )
}
