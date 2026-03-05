import React, { Suspense } from 'react'

import type { FormBlock as FormBlockType } from '@/payload-types'
import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'

import { getIntegrationCredentials } from '@/utilities/getIntegrationCredentials'
import { FormClient } from './FormClient'
import { FormSkeleton } from './FormSkeleton'
import { SectionHeader } from '@/components/SectionHeader'

export type FormBlockProps = FormBlockType

export const FormBlock: React.FC<FormBlockProps> = async (props) => {
    const { enableIntro, form, introContent, overline, titleLine1, titleHighlight, description } =
        props

    if (!form || typeof form !== 'object') {
        return null
    }

    let turnstileEnabled = false
    let turnstileSiteKey = ''
    try {
        const creds = await getIntegrationCredentials()
        turnstileEnabled =
            creds.turnstile.enabled &&
            Boolean(creds.turnstile.siteKey.trim()) &&
            Boolean(creds.turnstile.secretKey.trim())
        turnstileSiteKey = creds.turnstile.siteKey
    } catch {
        // Fallback: Form ohne Turnstile
    }

    return (
        <section className="section-padding section-atmosphere relative" aria-label="Formular">
            <div className="pointer-events-none absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-copper/8 blur-[105px]" />
            <div className="pointer-events-none absolute -right-20 bottom-1/4 h-64 w-64 rounded-full bg-copper/7 blur-[95px]" />
            <div className="container relative">
                {(overline || titleLine1 || description) && (
                    <SectionHeader
                        overline={overline || undefined}
                        title={titleLine1 || ''}
                        titleHighlight={titleHighlight}
                        description={description || undefined}
                        centered={true}
                        className="mb-12"
                    />
                )}
                <Suspense fallback={<FormSkeleton fieldCount={form.fields?.length || 3} />}>
                    <FormClient
                        enableIntro={enableIntro ?? false}
                        form={form as unknown as FormType}
                        introContent={introContent || undefined}
                        turnstileEnabled={turnstileEnabled}
                        turnstileSiteKey={turnstileSiteKey}
                    />
                </Suspense>
            </div>
        </section>
    )
}
