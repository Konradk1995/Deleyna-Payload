import React, { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'
import { Mail, MapPin, Instagram, Phone } from 'lucide-react'
import type { ContactBlock as ContactBlockProps } from '@/payload-types'
import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'
import { SectionHeader } from '@/components/SectionHeader'
import { ScrollFadeIn } from '@/components/ScrollFadeIn'
import { CMSLink } from '@/components/CMSLink'
import { FormClient } from '@/blocks/Form/FormClient'
import { FormSkeleton } from '@/blocks/Form/FormSkeleton'
import { cn } from '@/utilities/ui'

export const ContactBlockComponent: React.FC<
    ContactBlockProps & { id?: string; className?: string; locale?: string }
> = async (props) => {
    const {
        badge,
        title,
        headingLevel,
        form,
        emailLabel,
        email,
        phoneLabel,
        phone,
        whatsappLabel,
        whatsappNumber,
        whatsappText,
        addressLabel,
        address,
        socialLabel,
        socialUrl,
        socialText,
        cta,
        backgroundColor = 'white',
        className,
        locale = 'de',
    } = props

    const bgClass = backgroundColor === 'muted' ? 'bg-muted' : 'bg-background'

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
        // Fallback: form without Turnstile
    }

    const hasContactInfo = email || address || phone || whatsappNumber || (socialUrl && socialText)
    const formData = form && typeof form === 'object' ? (form as unknown as FormType) : null

    return (
        <section
            id="contact"
            className={cn('section-padding-lg section-atmosphere relative', bgClass, className)}
        >
            <div
                aria-hidden
                className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-copper/5 blur-3xl"
            />

            <div className="container relative z-10">
                <SectionHeader
                    overline={badge ?? undefined}
                    title={title ?? fallbackTitle}
                    as={(headingLevel as 'h1' | 'h2' | 'h3') || 'h2'}
                    titleClassName="chrome-text"
                />

                <div className="grid grid-cols-1 gap-medium lg:grid-cols-2 lg:items-start">
                    {hasContactInfo && (
                        <ScrollFadeIn animation="fade-up">
                        <div className="space-y-8 lg:sticky lg:top-32">
                            {email && (
                                <div className="flex items-start gap-4">
                                    <div className="glass-morphism rounded-[var(--block-radius)] flex h-12 w-12 flex-shrink-0 items-center justify-center text-foreground">
                                        <Mail className="h-5 w-5" aria-hidden="true" />
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
                                    <div className="glass-morphism rounded-[var(--block-radius)] flex h-12 w-12 flex-shrink-0 items-center justify-center text-foreground">
                                        <Phone className="h-5 w-5" aria-hidden="true" />
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
                            {whatsappNumber && (
                                <div className="flex items-start gap-4">
                                    <div className="glass-morphism rounded-[var(--block-radius)] flex h-12 w-12 flex-shrink-0 items-center justify-center text-foreground">
                                        <svg
                                            className="h-5 w-5"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                        </svg>
                                    </div>
                                    <div className="pt-1.5 break-all">
                                        <h3 className="font-semibold text-foreground">
                                            {whatsappLabel ?? 'WhatsApp'}
                                        </h3>
                                        <a
                                            href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}${whatsappText ? `?text=${encodeURIComponent(whatsappText)}` : ''}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-muted-foreground transition-colors hover:text-copper"
                                        >
                                            {whatsappNumber}
                                        </a>
                                    </div>
                                </div>
                            )}
                            {address && (
                                <div className="flex items-start gap-4">
                                    <div className="glass-morphism rounded-[var(--block-radius)] flex h-12 w-12 flex-shrink-0 items-center justify-center text-foreground">
                                        <MapPin className="h-5 w-5" aria-hidden="true" />
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
                                    <div className="glass-morphism rounded-[var(--block-radius)] flex h-12 w-12 flex-shrink-0 items-center justify-center text-foreground">
                                        <Instagram className="h-5 w-5" aria-hidden="true" />
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
                        </ScrollFadeIn>
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
                {cta && typeof cta === 'object' && cta.label && (
                    <div className="mt-10 text-center">
                        <CMSLink {...cta} />
                    </div>
                )}
            </div>
        </section>
    )
}
