import React from 'react'
import { getTranslations } from 'next-intl/server'

import type { ImpressumBlock as ImpressumBlockProps } from '@/payload-types'

import RichText from '@/components/RichText'
import { Building2, FileText, Globe, Hash, Mail, Phone, Scale, User } from 'lucide-react'

const iconClass = 'w-5 h-5 text-primary flex-shrink-0'

type Props = ImpressumBlockProps & {
    disableInnerContainer?: boolean
    locale?: string
}

export const ImpressumBlock: React.FC<Props> = async ({
    headingCompany,
    headingContact,
    headingRepresentatives,
    headingRegister,
    headingContentResponsible,
    headingDisclaimer,
    headingLiabilityContent,
    headingLiabilityLinks,
    headingCopyright,
    headingEuDispute,
    companyName,
    street,
    postalCode,
    city,
    country,
    phone,
    email,
    website,
    representativesLabel,
    representativesNames,
    registerCourt,
    registerNumber,
    vatId,
    contentResponsibleName,
    liabilityContent,
    liabilityLinks,
    copyright: copyrightContent,
    euDisputeIntro,
    euDisputeUrl,
    euDisputeClosing,
    dateLabel,
    locale = 'de',
}) => {
    const t = await getTranslations({ locale, namespace: 'impressum' })

    const websiteHref: string | undefined = website
        ? website.startsWith('http')
            ? website
            : `https://${website}`
        : undefined

    const h = {
        company: headingCompany || t('company'),
        contact: headingContact || t('contact'),
        representatives: headingRepresentatives || t('representatives'),
        register: headingRegister || t('register'),
        contentResponsible: headingContentResponsible || t('contentResponsible'),
        disclaimer: headingDisclaimer || t('disclaimer'),
        liabilityContent: headingLiabilityContent || t('liabilityContent'),
        liabilityLinks: headingLiabilityLinks || t('liabilityLinks'),
        copyright: headingCopyright || t('copyright'),
        euDispute: headingEuDispute || t('euDispute'),
    }

    const cardClass = 'block-card-base rounded-2xl border border-border padding-large shadow-sm'

    return (
        <section className="section-padding section-atmosphere bg-muted" aria-label="Impressum">
            <div className="container">
                <div className="mx-auto flex max-w-4xl flex-col gap-5">
                    {/* Block 1: Unternehmensangaben + Kontakt */}
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <div className={cardClass}>
                            <div className="mb-4 flex items-center gap-3">
                                <Building2 className={iconClass} aria-hidden="true" />
                                <h3 className="font-heading-5-bold text-foreground">{h.company}</h3>
                            </div>
                            <address className="space-y-1 text-sm leading-relaxed text-muted-foreground not-italic">
                                {companyName && (
                                    <p className="font-semibold text-foreground">{companyName}</p>
                                )}
                                {street && <p>{street}</p>}
                                {(postalCode || city) && (
                                    <p>{[postalCode, city].filter(Boolean).join(' ')}</p>
                                )}
                                {country && <p>{country}</p>}
                            </address>
                        </div>

                        <div className={cardClass}>
                            <div className="mb-4 flex items-center gap-3">
                                <Mail className={iconClass} aria-hidden="true" />
                                <h3 className="font-heading-5-bold text-foreground">{h.contact}</h3>
                            </div>
                            <div className="space-y-3 text-sm">
                                {phone && (
                                    <p className="flex items-center gap-2 text-muted-foreground">
                                        <Phone className={iconClass} aria-hidden="true" />
                                        <a
                                            href={`tel:${phone.replace(/\s/g, '')}`}
                                            className="text-primary hover:underline"
                                        >
                                            {phone}
                                        </a>
                                    </p>
                                )}
                                {email && (
                                    <p className="flex items-center gap-2 text-muted-foreground">
                                        <Mail className={iconClass} aria-hidden="true" />
                                        <a
                                            href={`mailto:${email}`}
                                            className="text-primary hover:underline"
                                        >
                                            {email}
                                        </a>
                                    </p>
                                )}
                                {website && (
                                    <p className="flex items-center gap-2 text-muted-foreground">
                                        <Globe className={iconClass} aria-hidden="true" />
                                        <a
                                            href={websiteHref}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline"
                                        >
                                            {website}
                                        </a>
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Block 2: Vertretungsberechtigte + Registereintrag */}
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <div className={cardClass}>
                            <div className="mb-4 flex items-center gap-3">
                                <User className={iconClass} aria-hidden="true" />
                                <h3 className="font-heading-5-bold text-foreground">
                                    {h.representatives}
                                </h3>
                            </div>
                            <div className="text-sm text-muted-foreground">
                                {representativesLabel && (
                                    <p className="mb-2">{representativesLabel}</p>
                                )}
                                {representativesNames && representativesNames.length > 0 && (
                                    <ul className="space-y-1 font-semibold text-foreground">
                                        {representativesNames.map((rep, i) => (
                                            <li key={rep.id ?? i}>{rep.name}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>

                        <div className={cardClass}>
                            <div className="mb-4 flex items-center gap-3">
                                <FileText className={iconClass} aria-hidden="true" />
                                <h3 className="font-heading-5-bold text-foreground">
                                    {h.register}
                                </h3>
                            </div>
                            <div className="space-y-1 text-sm leading-relaxed text-muted-foreground">
                                {registerCourt && (
                                    <p>
                                        {t('registerCourt')}: {registerCourt}
                                    </p>
                                )}
                                {registerNumber && (
                                    <p>
                                        {t('registerNumber')}: {registerNumber}
                                    </p>
                                )}
                                {vatId && (
                                    <p>
                                        {t('vatId')}: {vatId}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Block 3: Verantwortlich für den Inhalt */}
                    {(contentResponsibleName || companyName) && (
                        <div className={cardClass}>
                            <div className="mb-4 flex items-center gap-3">
                                <Hash className={iconClass} aria-hidden="true" />
                                <h3 className="font-heading-5-bold text-foreground">
                                    {h.contentResponsible}
                                </h3>
                            </div>
                            <address className="not-italic text-muted-foreground text-sm leading-relaxed space-y-1">
                                {contentResponsibleName && (
                                    <p className="font-semibold text-foreground">
                                        {contentResponsibleName}
                                    </p>
                                )}
                                {companyName && <p>{companyName}</p>}
                                {street && <p>{street}</p>}
                                {(postalCode || city) && (
                                    <p>{[postalCode, city].filter(Boolean).join(' ')}</p>
                                )}
                                {country && <p>{country}</p>}
                            </address>
                        </div>
                    )}

                    {/* Block 4: Haftungsausschluss */}
                    {(liabilityContent || liabilityLinks || copyrightContent) && (
                        <div className={cardClass}>
                            <h3 className="font-heading-5-bold text-foreground mb-5">
                                {h.disclaimer}
                            </h3>
                            <div className="text-muted-foreground text-sm space-y-6">
                                {liabilityContent && (
                                    <div>
                                        <h3 className="font-semibold text-foreground mb-2">
                                            {h.liabilityContent}
                                        </h3>
                                        <RichText
                                            data={liabilityContent}
                                            enableGutter={false}
                                            enableProse={false}
                                            className="[&_p]:mb-2 [&_p]:leading-relaxed"
                                        />
                                    </div>
                                )}
                                {liabilityLinks && (
                                    <div>
                                        <h3 className="font-semibold text-foreground mb-2">
                                            {h.liabilityLinks}
                                        </h3>
                                        <RichText
                                            data={liabilityLinks}
                                            enableGutter={false}
                                            enableProse={false}
                                            className="[&_p]:mb-2 [&_p]:leading-relaxed"
                                        />
                                    </div>
                                )}
                                {copyrightContent && (
                                    <div>
                                        <h3 className="font-semibold text-foreground mb-2">
                                            {h.copyright}
                                        </h3>
                                        <RichText
                                            data={copyrightContent}
                                            enableGutter={false}
                                            enableProse={false}
                                            className="[&_p]:mb-2 [&_p]:leading-relaxed"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Block 5: EU-Streitschlichtung */}
                    {(euDisputeIntro || euDisputeUrl || euDisputeClosing) && (
                        <div className={cardClass}>
                            <div className="flex items-center gap-3 mb-4">
                                <Scale className={iconClass} aria-hidden="true" />
                                <h3 className="font-heading-5-bold text-foreground">
                                    {h.euDispute}
                                </h3>
                            </div>
                            <div className="text-muted-foreground text-sm space-y-4">
                                {euDisputeIntro && (
                                    <RichText
                                        data={euDisputeIntro}
                                        enableGutter={false}
                                        enableProse={false}
                                        className="[&_p]:mb-2 [&_p]:leading-relaxed"
                                    />
                                )}
                                {euDisputeUrl && (
                                    <p>
                                        <a
                                            href={euDisputeUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline break-all"
                                        >
                                            {euDisputeUrl}
                                        </a>
                                    </p>
                                )}
                                {euDisputeClosing && (
                                    <RichText
                                        data={euDisputeClosing}
                                        enableGutter={false}
                                        enableProse={false}
                                        className="[&_p]:mb-2 [&_p]:leading-relaxed"
                                    />
                                )}
                            </div>
                        </div>
                    )}

                    {/* Footer: Stand */}
                    {dateLabel && (
                        <p className="text-center text-muted-foreground text-sm mt-2">
                            {dateLabel}
                        </p>
                    )}
                </div>
            </div>
        </section>
    )
}
