import React, { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'
import { Mail, MapPin, Instagram, Phone } from 'lucide-react'
import type { ContactBlock as ContactBlockProps } from '@/payload-types'
import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'
import { SectionHeader } from '@/components/SectionHeader'
import { FormClient } from '@/blocks/Form/FormClient'
import { FormSkeleton } from '@/blocks/Form/FormSkeleton'
import { cn } from '@/utilities/ui'

export const ContactBlockComponent: React.FC<
    ContactBlockProps & { id?: string; className?: string; locale?: string }
> = async (props) => {
    const {
        overline,
        title,
        form,
        emailLabel,
        email,
        phoneLabel,
        phone,
        addressLabel,
        address,
        socialLabel,
        socialUrl,
        socialText,
        className,
        locale = 'de',
    } = props

    const t = await getTranslations({ locale, namespace: 'contactBlock' })
    const fallbackTitle = t('title')
    const fallbackEmailLabel = t('emailLabel')
    const fallbackPhoneLabel = t('phoneLabel')
    const fallbackAddressLabel = t('addressLabel')
    const fallbackSocialLabel = t('socialLabel')

    let turnstileEnabled = false
    let turnstileSiteKey = ''
    try {
        const { getIntegrationCredentials } = await import('@/utilities/getIntegrationCredentials')
        const creds = await getIntegrationCredentials()
        turnstileEnabled =
            creds.turnstile.enabled &&
            Boolean(creds.turnstile.siteKey.trim()) &&
            Boolean(creds.turnstile.secretKey.trim())
        turnstileSiteKey = creds.turnstile.siteKey
    } catch {
        // Fallback: Form ohne Turnstile
    }

    const hasContactInfo = email || address || phone || (socialUrl && socialText)
    const formData = form && typeof form === 'object' ? (form as unknown as FormType) : null

    return (
        <section
            id="contact"
            className={cn('padding-large section-atmosphere relative', className)}
        >
            <div
                aria-hidden
                className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-copper/5 blur-3xl"
            />

            <div className="container relative z-10">
                <SectionHeader
                    overline={overline ?? undefined}
                    title={title ?? fallbackTitle}
                    titleClassName="chrome-text"
                />

                <div className="grid grid-cols-1 gap-medium lg:grid-cols-2 lg:items-start">
                    {hasContactInfo && (
                        <div className="space-y-8 lg:sticky lg:top-32">
                            {email && (
                                <div className="flex items-start gap-4">
                                    <div className="glass-morphism rounded-xl flex h-12 w-12 flex-shrink-0 items-center justify-center text-foreground">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <div className="pt-1.5 break-all">
                                        <h3 className="font-semibold text-foreground">
                                            {emailLabel ?? fallbackEmailLabel}
                                        </h3>
                                        <a
                                            href={`mailto:${email}`}
                                            className="text-muted-foreground transition-colors hover:text-copper"
                                        >
                                            {email}
                                        </a>
                                    </div>
                                </div>
                            )}
                            {phone && (
                                <div className="flex items-start gap-4">
                                    <div className="glass-morphism rounded-xl flex h-12 w-12 flex-shrink-0 items-center justify-center text-foreground">
                                        <Phone className="h-5 w-5" />
                                    </div>
                                    <div className="pt-1.5 break-all">
                                        <h3 className="font-semibold text-foreground">
                                            {phoneLabel ?? fallbackPhoneLabel}
                                        </h3>
                                        <a
                                            href={`tel:${phone.replace(/\s+/g, '')}`}
                                            className="text-muted-foreground transition-colors hover:text-copper"
                                        >
                                            {phone}
                                        </a>
                                    </div>
                                </div>
                            )}
                            {address && (
                                <div className="flex items-start gap-4">
                                    <div className="glass-morphism rounded-xl flex h-12 w-12 flex-shrink-0 items-center justify-center text-foreground">
                                        <MapPin className="h-5 w-5" />
                                    </div>
                                    <div className="pt-1.5 break-words">
                                        <h3 className="font-semibold text-foreground">
                                            {addressLabel ?? fallbackAddressLabel}
                                        </h3>
                                        <p className="whitespace-pre-line text-muted-foreground">
                                            {address}
                                        </p>
                                    </div>
                                </div>
                            )}
                            {socialUrl && socialText && (
                                <div className="flex items-start gap-4">
                                    <div className="glass-morphism rounded-xl flex h-12 w-12 flex-shrink-0 items-center justify-center text-foreground">
                                        <Instagram className="h-5 w-5" />
                                    </div>
                                    <div className="pt-1.5 break-all">
                                        <h3 className="font-semibold text-foreground">
                                            {socialLabel ?? fallbackSocialLabel}
                                        </h3>
                                        <a
                                            href={socialUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-muted-foreground transition-colors hover:text-copper"
                                        >
                                            {socialText}
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {formData && (
                        <div className="w-full">
                            <Suspense
                                fallback={
                                    <FormSkeleton fieldCount={formData.fields?.length || 3} />
                                }
                            >
                                <FormClient
                                    enableIntro={false}
                                    form={formData}
                                    turnstileEnabled={turnstileEnabled}
                                    turnstileSiteKey={turnstileSiteKey}
                                    wrapWithCard={false}
                                />
                            </Suspense>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}
