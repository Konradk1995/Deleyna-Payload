'use client'

import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Check } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { FormProvider, useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { submitFormAction } from '@/app/(frontend)/actions/form-submit'
import RichText from '@/components/RichText'
import { TurnstileWidget } from '@/components/Turnstile'
import { fields } from './fields'
import { localizeOptionLabel } from './localizeOptionLabel'

type WizardField = {
    id?: string | number
    name?: string
    blockType?: string
    stepTitle?: string | Record<string, string> | null
    defaultValue?: unknown
    [key: string]: unknown
}

type WizardStep = {
    id: string
    title: string
    fields: WizardField[]
}

const formI18n = {
    de: {
        submitting: 'Wird gesendet...',
        errorGeneric: 'Etwas ist schiefgelaufen.',
        stepPrefix: 'Schritt',
        of: 'von',
        progress: 'Fortschritt',
        back: 'Zurück',
        next: 'Weiter',
        sentTitle: 'Danke, wir haben deine Anfrage erhalten.',
        turnstileHint: 'Bitte bestätige die Sicherheitsprüfung vor dem Absenden.',
        validationHint: 'Bitte prüfe die markierten Felder.',
    },
    en: {
        submitting: 'Submitting...',
        errorGeneric: 'Something went wrong.',
        stepPrefix: 'Step',
        of: 'of',
        progress: 'Progress',
        back: 'Back',
        next: 'Next',
        sentTitle: 'Thanks, we received your request.',
        turnstileHint: 'Please complete the security check before submitting.',
        validationHint: 'Please check the highlighted fields.',
    },
} as const

export type FormClientProps = {
    id?: string
    enableIntro: boolean
    form: FormType
    introContent?: DefaultTypedEditorState
    turnstileEnabled?: boolean
    turnstileSiteKey?: string
    wrapWithCard?: boolean
}

function resolveStepTitle(
    stepTitle: WizardField['stepTitle'],
    locale: 'de' | 'en',
    fallback: string,
): string {
    if (typeof stepTitle === 'string' && stepTitle.trim()) return stepTitle
    if (stepTitle && typeof stepTitle === 'object') {
        const localized =
            (stepTitle[locale] as string | undefined) ||
            (stepTitle.de as string | undefined) ||
            (stepTitle.en as string | undefined)
        if (localized?.trim()) return localized
    }
    return fallback
}

function buildWizardSteps(rawFields: WizardField[], locale: 'de' | 'en'): WizardStep[] {
    const steps: WizardStep[] = []
    let currentStep: WizardStep = {
        id: 'step-0',
        title: `${locale === 'de' ? 'Schritt' : 'Step'} 1`,
        fields: [],
    }

    for (const field of rawFields) {
        if (field.blockType === 'pageBreak') {
            if (currentStep.fields.length > 0) {
                steps.push(currentStep)
            }
            const fallback = `${locale === 'de' ? 'Schritt' : 'Step'} ${steps.length + 2}`
            currentStep = {
                id: String(field.id ?? `step-${steps.length + 1}`),
                title: resolveStepTitle(field.stepTitle, locale, fallback),
                fields: [],
            }
            continue
        }

        currentStep.fields.push(field)
    }

    if (currentStep.fields.length > 0) {
        steps.push(currentStep)
    }

    return steps.length > 0
        ? steps
        : [
              {
                  id: 'step-fallback',
                  title: `${locale === 'de' ? 'Schritt' : 'Step'} 1`,
                  fields: rawFields.filter((field) => field.blockType !== 'pageBreak'),
              },
          ]
}

function buildDefaultValues(rawFields: WizardField[]): Record<string, unknown> {
    const defaults: Record<string, unknown> = {}

    for (const field of rawFields) {
        if (!field.name) continue
        defaults[field.name] = field.defaultValue ?? ''
    }

    defaults._honey = ''
    return defaults
}

function serializeSubmissionValue(value: unknown): string {
    if (value === null || value === undefined) return ''
    if (typeof value === 'string') return value
    if (typeof value === 'number' || typeof value === 'boolean') return String(value)
    try {
        return JSON.stringify(value)
    } catch {
        return String(value)
    }
}

export const FormClient: React.FC<FormClientProps> = (props) => {
    const {
        enableIntro,
        form: formFromProps,
        form: {
            id: formID,
            confirmationMessage,
            confirmationType,
            redirect,
            submitButtonLabel,
        } = {},
        introContent,
        turnstileEnabled: turnstileEnabledProp = false,
        turnstileSiteKey: turnstileSiteKeyProp = '',
        wrapWithCard = true,
    } = props

    const TURNSTILE_ENABLED = turnstileEnabledProp && Boolean(turnstileSiteKeyProp?.trim())
    const TURNSTILE_SITE_KEY = turnstileSiteKeyProp?.trim() || ''

    const pathname = usePathname()
    const localeFromParams =
        typeof pathname?.split('/')[1] === 'string' ? pathname.split('/')[1] : undefined
    const locale: 'de' | 'en' = localeFromParams === 'en' ? 'en' : 'de'
    const t = formI18n[locale]
    const router = useRouter()

    const rawFields = useMemo(
        () => ((formFromProps?.fields || []) as unknown[]).filter(Boolean) as WizardField[],
        [formFromProps?.fields],
    )
    const defaultValues = useMemo(() => buildDefaultValues(rawFields), [rawFields])
    const steps = useMemo(() => buildWizardSteps(rawFields, locale), [rawFields, locale])
    const localizedSubmitButtonLabel = useMemo(
        () => localizeOptionLabel(submitButtonLabel, locale) || (locale === 'en' ? 'Submit' : 'Absenden'),
        [locale, submitButtonLabel],
    )

    const formMethods = useForm({
        defaultValues,
        mode: 'onBlur',
    })
    const {
        control,
        formState: { errors },
        handleSubmit,
        register,
        reset,
        trigger,
    } = formMethods

    const [isLoading, setIsLoading] = useState(false)
    const [hasSubmitted, setHasSubmitted] = useState<boolean>()
    const [error, setError] = useState<{ message: string; status?: string } | undefined>()
    const [pageUrl, setPageUrl] = useState('')
    const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
    const [currentStepIndex, setCurrentStepIndex] = useState(0)
    const formTopRef = useRef<HTMLDivElement | null>(null)
    const previousStepRef = useRef(0)

    const isMultiStep = steps.length > 1
    const currentStep = steps[currentStepIndex]
    const isLastStep = currentStepIndex === steps.length - 1
    const progressPercent = Math.round(((currentStepIndex + 1) / steps.length) * 100)

    useEffect(() => {
        reset(defaultValues)
    }, [defaultValues, reset])

    useEffect(() => {
        setCurrentStepIndex((prev) => Math.min(prev, Math.max(0, steps.length - 1)))
    }, [steps.length])

    useEffect(() => {
        const changedStep = previousStepRef.current !== currentStepIndex
        if (!changedStep) return

        formTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        previousStepRef.current = currentStepIndex
    }, [currentStepIndex])

    useEffect(() => {
        setPageUrl(window.location.href)
    }, [])

    const handleNext = async () => {
        const currentFields = (currentStep?.fields || [])
            .map((field) => field.name)
            .filter((name): name is string => Boolean(name))

        const isValid = await trigger(currentFields, { shouldFocus: true })
        if (isValid) {
            setCurrentStepIndex((prev) => Math.min(prev + 1, steps.length - 1))
        }
    }

    const handleBack = () => {
        setCurrentStepIndex((prev) => Math.max(prev - 1, 0))
    }

    const onInvalidSubmit = useCallback(() => {
        const errorFieldNames = new Set(Object.keys(formMethods.formState.errors || {}))
        if (errorFieldNames.size === 0) return

        const firstInvalidStepIndex = steps.findIndex((step) =>
            step.fields.some((field) => field.name && errorFieldNames.has(field.name)),
        )

        if (firstInvalidStepIndex >= 0 && firstInvalidStepIndex !== currentStepIndex) {
            setCurrentStepIndex(firstInvalidStepIndex)
        }

        setError({ message: t.validationHint })
    }, [currentStepIndex, formMethods.formState.errors, steps, t.validationHint])

    const onSubmit = useCallback(
        async (data: Record<string, unknown>) => {
            setIsLoading(true)
            setError(undefined)

            const dataToSend = Object.entries(data).map(([name, value]) => ({
                field: name,
                value: serializeSubmissionValue(value),
            }))

            try {
                const result = await submitFormAction(
                    Number(formID),
                    dataToSend,
                    locale,
                    TURNSTILE_ENABLED ? (turnstileToken ?? undefined) : undefined,
                )

                setIsLoading(false)

                if (!result.success) {
                    setError({ message: result.message || t.errorGeneric })
                    return
                }

                setHasSubmitted(true)

                if (confirmationType === 'redirect' && redirect?.url) {
                    router.push(redirect.url)
                }
            } catch (submitError) {
                console.warn(submitError)
                setIsLoading(false)
                setError({ message: t.errorGeneric })
            }
        },
        [
            confirmationType,
            formID,
            locale,
            redirect,
            router,
            t.errorGeneric,
            turnstileToken,
            TURNSTILE_ENABLED,
        ],
    )

    const trackingAttributes = pageUrl
        ? {
              'data-rybbit-event': 'form_submit',
              'data-rybbit-prop-url': pageUrl,
              'data-rybbit-prop-label': localizedSubmitButtonLabel,
              'data-rybbit-prop-appearance': 'default',
          }
        : {}

    const formContent = (
        <FormProvider {...formMethods}>
            {!isLoading && hasSubmitted && confirmationType === 'message' && (
                <div className="flex flex-col items-center justify-center padding-large text-center animate-in fade-in zoom-in-95 duration-500">
                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-copper shadow-copper-glow">
                        <Check className="h-10 w-10 text-on-media" />
                    </div>
                    <p className="mb-3 font-medium-text-regular text-foreground">{t.sentTitle}</p>
                    <div className="max-w-lg font-medium">
                        <RichText
                            data={confirmationMessage}
                            enableGutter={false}
                            className="text-foreground"
                        />
                    </div>
                </div>
            )}
            {isLoading && !hasSubmitted && (
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-copper/30 bg-copper/10 px-4 py-2 font-small-text-regular text-copper">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-copper" />
                    {t.submitting}
                </div>
            )}
            {error && (
                <div
                    className="mb-6 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 font-normal-text-regular text-destructive shadow-sm"
                    role="alert"
                >
                    {error.message}
                </div>
            )}
            {!hasSubmitted && (
                <form
                    id={String(formID)}
                    onSubmit={handleSubmit(onSubmit, onInvalidSubmit)}
                    className="space-y-6"
                >
                    <div ref={formTopRef} />
                    <input
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        aria-hidden="true"
                        className="pointer-events-none absolute left-[-9999px] h-0 w-0 opacity-0"
                        {...register('_honey')}
                    />

                    {isMultiStep && (
                        <div className="mb-10 rounded-2xl border border-border/60 bg-muted/20 p-4 md:p-5">
                            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                                <span className="text-foreground/80">{currentStep?.title}</span>
                                <span>
                                    {t.stepPrefix} {currentStepIndex + 1} {t.of} {steps.length}
                                </span>
                            </div>
                            <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-copper">
                                {t.progress}: {progressPercent}%
                            </div>
                            <div className="mb-4 flex gap-2">
                                {steps.map((step, stepIndex) => (
                                    <span
                                        key={step.id}
                                        className={`h-1.5 flex-1 rounded-full transition-colors ${
                                            stepIndex <= currentStepIndex
                                                ? 'bg-copper shadow-copper-glow'
                                                : 'bg-border/50'
                                        }`}
                                    />
                                ))}
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-border/30">
                                <div
                                    className="h-1.5 rounded-full bg-copper shadow-copper-glow transition duration-500 ease-out"
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                        </div>
                    )}

                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={currentStep?.id || `step-${currentStepIndex}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            className="grid grid-cols-12 gap-x-6 gap-y-6"
                        >
                            {currentStep?.fields.map((field, index) => {
                                const Field = fields?.[field.blockType as keyof typeof fields] as
                                    | React.FC<Record<string, unknown>>
                                    | undefined

                                if (!Field) return null

                                // Map Payload width to Tailwind col-span
                                const width = Number(field.width) || 100
                                let colSpan = 'col-span-12'
                                if (width <= 25) colSpan = 'col-span-12 md:col-span-3'
                                else if (width <= 33) colSpan = 'col-span-12 md:col-span-4'
                                else if (width <= 50) colSpan = 'col-span-12 md:col-span-6'
                                else if (width <= 66) colSpan = 'col-span-12 md:col-span-8'
                                else if (width <= 75) colSpan = 'col-span-12 md:col-span-9'

                                return (
                                    <div
                                        key={`${currentStepIndex}-${String(field.id ?? field.name ?? index)}`}
                                        className={colSpan}
                                    >
                                        <Field
                                            form={formFromProps}
                                            {...field}
                                            {...formMethods}
                                            control={control}
                                            errors={errors}
                                            register={register}
                                            locale={locale}
                                            turnstileEnabled={TURNSTILE_ENABLED}
                                            turnstileToken={turnstileToken}
                                        />
                                    </div>
                                )
                            })}
                        </motion.div>
                    </AnimatePresence>

                    {TURNSTILE_ENABLED && (
                        <div className="flex min-h-[70px] flex-col justify-center gap-2">
                            <TurnstileWidget
                                siteKey={TURNSTILE_SITE_KEY}
                                onVerify={setTurnstileToken}
                                onExpire={() => setTurnstileToken(null)}
                                onError={() => setTurnstileToken(null)}
                                appearance="execute"
                                theme="auto"
                                size="normal"
                                locale={locale}
                            />
                            {!turnstileToken && (
                                <p className="text-xs text-muted-foreground">{t.turnstileHint}</p>
                            )}
                        </div>
                    )}

                    <div className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
                        {isMultiStep && currentStepIndex > 0 ? (
                            <Button
                                type="button"
                                variant="outline"
                                className="order-2 w-full rounded-full border-border/50 bg-background/50 px-8 py-6 text-base font-medium transition duration-300 hover:bg-foreground/5 sm:order-1 sm:w-auto"
                                onClick={handleBack}
                            >
                                {t.back}
                            </Button>
                        ) : (
                            <div className="hidden sm:block" />
                        )}

                        <Button
                            type={isLastStep ? 'submit' : 'button'}
                            {...trackingAttributes}
                            className="order-1 w-full rounded-full bg-copper px-10 py-6 text-base font-semibold text-on-media shadow-copper-glow transition duration-300 hover:-translate-y-[2px] hover:bg-copper/90 active:translate-y-0 sm:order-2 sm:w-auto disabled:opacity-50"
                            onClick={!isLastStep ? handleNext : undefined}
                            disabled={
                                isLoading || (isLastStep && TURNSTILE_ENABLED && !turnstileToken)
                            }
                        >
                            {isLoading
                                ? t.submitting
                                : isLastStep
                                  ? localizedSubmitButtonLabel
                                  : t.next}
                        </Button>
                    </div>
                </form>
            )}
        </FormProvider>
    )

    return (
        <div className="mx-auto w-full">
            {enableIntro && introContent && !hasSubmitted && (
                <div className="mb-8 font-normal-text-regular text-muted-foreground md:mb-10 md:font-medium-text-regular">
                    <RichText data={introContent} />
                </div>
            )}

            {wrapWithCard ? (
                <div className="surface-pill rounded-[2rem] border border-border/70 bg-background/85 padding-large shadow-copper-glow backdrop-blur-md">
                    {formContent}
                </div>
            ) : (
                <div className="w-full">{formContent}</div>
            )}
        </div>
    )
}
