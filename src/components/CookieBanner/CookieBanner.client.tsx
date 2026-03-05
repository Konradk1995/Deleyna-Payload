'use client'

import React, { useEffect, useState } from 'react'
import { useCookieConsent } from '@/providers/CookieConsent'
import { Button } from '@/components/ui/button'
import { cn } from '@/utilities/ui'

interface CookieBannerProps {
    locale?: string
    triggerPlacement?: 'footer' | 'floating' | 'floating-right'
    title?: string
    description?: string
    acceptLabel?: string
    rejectLabel?: string
    settingsLabel?: string
    saveLabel?: string
    modalTitle?: string
    modalDescription?: string
    necessaryLabel?: string
    necessaryDescription?: string
    analyticsEnabled?: boolean
    analyticsLabel?: string
    analyticsDescription?: string
    marketingEnabled?: boolean
    marketingLabel?: string
    marketingDescription?: string
    privacyPolicyUrl?: string
    privacyPolicyLabel?: string
    imprintUrl?: string
    imprintLabel?: string
}

export function CookieBanner({
    locale = 'de',
    triggerPlacement = 'floating',
    title,
    description,
    acceptLabel,
    rejectLabel,
    settingsLabel,
    saveLabel,
    modalTitle,
    modalDescription,
    necessaryLabel,
    necessaryDescription,
    analyticsEnabled: analyticsCategoryEnabled = true,
    analyticsLabel,
    analyticsDescription,
    marketingEnabled: marketingCategoryEnabled = false,
    marketingLabel,
    marketingDescription,
    privacyPolicyUrl,
    privacyPolicyLabel,
    imprintUrl,
    imprintLabel,
}: CookieBannerProps): React.ReactElement | null {
    const {
        isReady,
        hasConsented,
        acceptAll,
        rejectAll,
        openPreferences,
        isPreferencesOpen,
        savePreferences,
        preferences,
        closePreferences,
    } = useCookieConsent()

    const [analyticsPreferenceEnabled, setAnalyticsPreferenceEnabled] = useState(
        preferences?.analytics ?? false,
    )
    const [marketingPreferenceEnabled, setMarketingPreferenceEnabled] = useState(
        preferences?.marketing ?? false,
    )
    const isGerman = locale !== 'en'

    const resolvedTitle = title || (isGerman ? 'Cookie-Einstellungen' : 'Cookie settings')
    const resolvedDescription =
        description ||
        (isGerman
            ? 'Wir verwenden Cookies, um dir die bestmögliche Erfahrung auf unserer Website zu bieten. Einige Cookies sind für den Betrieb der Website erforderlich, während andere uns helfen, die Website zu verbessern.'
            : 'We use cookies to provide the best possible experience on our website. Some cookies are required for site functionality, while others help us improve the site.')
    const resolvedAcceptLabel = acceptLabel || (isGerman ? 'Alle akzeptieren' : 'Accept all')
    const resolvedRejectLabel = rejectLabel || (isGerman ? 'Nur notwendige' : 'Only necessary')
    const resolvedSettingsLabel = settingsLabel || (isGerman ? 'Einstellungen' : 'Settings')
    const resolvedSaveLabel = saveLabel || (isGerman ? 'Auswahl speichern' : 'Save preferences')
    const resolvedCancelLabel = isGerman ? 'Abbrechen' : 'Cancel'
    const resolvedModalTitle = modalTitle || (isGerman ? 'Cookie-Einstellungen verwalten' : 'Manage cookie settings')
    const resolvedModalDescription =
        modalDescription ||
        (isGerman
            ? 'Hier kannst du deine Cookie-Präferenzen anpassen. Notwendige Cookies sind für die Grundfunktionen der Website erforderlich.'
            : 'Here you can adjust your cookie preferences. Necessary cookies are required for core website functionality.')
    const resolvedNecessaryLabel = necessaryLabel || (isGerman ? 'Notwendige Cookies' : 'Necessary cookies')
    const resolvedNecessaryDescription =
        necessaryDescription ||
        (isGerman
            ? 'Diese Cookies sind für den Betrieb der Website erforderlich.'
            : 'These cookies are required for the operation of the website.')
    const resolvedAnalyticsLabel = analyticsLabel || (isGerman ? 'Analyse-Cookies' : 'Analytics cookies')
    const resolvedAnalyticsDescription =
        analyticsDescription ||
        (isGerman
            ? 'Helfen uns zu verstehen, wie Besucher unsere Website nutzen.'
            : 'Help us understand how visitors use our website.')
    const resolvedMarketingLabel = marketingLabel || (isGerman ? 'Marketing-Cookies' : 'Marketing cookies')
    const resolvedMarketingDescription =
        marketingDescription ||
        (isGerman
            ? 'Werden verwendet, um Werbung relevanter für Sie zu gestalten.'
            : 'Used to make advertising more relevant to you.')
    const resolvedPrivacyPolicyLabel = privacyPolicyLabel || (isGerman ? 'Datenschutzerklärung' : 'Privacy policy')
    const resolvedPrivacyPolicyUrl = privacyPolicyUrl || (isGerman ? '/de/datenschutz' : '/en/privacy-policy')
    const resolvedImprintLabel = imprintLabel || (isGerman ? 'Impressum' : 'Imprint')

    useEffect(() => {
        setAnalyticsPreferenceEnabled(preferences?.analytics ?? false)
        setMarketingPreferenceEnabled(preferences?.marketing ?? false)
    }, [preferences, isPreferencesOpen])

    useEffect(() => {
        if (!isPreferencesOpen) return
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                closePreferences()
            }
        }
        document.addEventListener('keydown', onKeyDown)
        document.body.style.overflow = 'hidden'

        return () => {
            document.removeEventListener('keydown', onKeyDown)
            document.body.style.overflow = ''
        }
    }, [closePreferences, isPreferencesOpen])

    const shouldShowFloatingTrigger =
        hasConsented &&
        !isPreferencesOpen &&
        (triggerPlacement === 'floating' || triggerPlacement === 'floating-right')

    const floatingTriggerLabel = isGerman ? 'Cookie-Einstellungen öffnen' : 'Open cookie settings'

    // Don't render banner until ready or after consent.
    // Preferences modal can still open via trigger.
    if (!isReady) {
        return null
    }

    const handleSavePreferences = () => {
        savePreferences({
            analytics: analyticsCategoryEnabled ? analyticsPreferenceEnabled : false,
            marketing: marketingCategoryEnabled ? marketingPreferenceEnabled : false,
        })
    }

    // Preferences Modal
    if (isPreferencesOpen) {
        return (
            <div
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
                role="dialog"
                aria-modal="true"
                aria-labelledby="cookie-settings-title"
            >
                <div className="surface-pill w-full max-w-lg p-6 shadow-xl">
                    <h2 id="cookie-settings-title" className="mb-4 text-xl font-semibold text-foreground">
                        {resolvedModalTitle}
                    </h2>
                    <p className="mb-4 text-sm text-muted-foreground">{resolvedModalDescription}</p>

                    <div className="space-y-4">
                        {/* Necessary Cookies - Always enabled */}
                        <div className="surface-pill-soft flex items-center justify-between p-4">
                            <div>
                                <h3 className="font-medium text-foreground">{resolvedNecessaryLabel}</h3>
                                <p className="text-sm text-muted-foreground">{resolvedNecessaryDescription}</p>
                            </div>
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    checked
                                    disabled
                                    className="h-5 w-10 cursor-not-allowed appearance-none rounded-full bg-primary opacity-60"
                                />
                            </div>
                        </div>

                        {/* Analytics Cookies */}
                        {analyticsCategoryEnabled && (
                            <div className="surface-pill-soft flex items-center justify-between p-4">
                                <div>
                                    <h3 className="font-medium text-foreground">{resolvedAnalyticsLabel}</h3>
                                    <p className="text-sm text-muted-foreground">{resolvedAnalyticsDescription}</p>
                                </div>
                                <label className="relative inline-flex cursor-pointer items-center">
                                    <input
                                        type="checkbox"
                                        checked={analyticsPreferenceEnabled}
                                        onChange={(e) => setAnalyticsPreferenceEnabled(e.target.checked)}
                                        className="peer sr-only"
                                    />
                                    <div className="peer h-6 w-11 rounded-full bg-muted after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-border after:bg-background after:transition after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary"></div>
                                </label>
                            </div>
                        )}

                        {/* Marketing Cookies */}
                        {marketingCategoryEnabled && (
                            <div className="surface-pill-soft flex items-center justify-between p-4">
                                <div>
                                    <h3 className="font-medium text-foreground">{resolvedMarketingLabel}</h3>
                                    <p className="text-sm text-muted-foreground">{resolvedMarketingDescription}</p>
                                </div>
                                <label className="relative inline-flex cursor-pointer items-center">
                                    <input
                                        type="checkbox"
                                        checked={marketingPreferenceEnabled}
                                        onChange={(e) => setMarketingPreferenceEnabled(e.target.checked)}
                                        className="peer sr-only"
                                    />
                                    <div className="peer h-6 w-11 rounded-full bg-muted after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-border after:bg-background after:transition after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary"></div>
                                </label>
                            </div>
                        )}
                    </div>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                        <Button
                            type="button"
                            onClick={closePreferences}
                            variant="outline"
                        >
                            {resolvedCancelLabel}
                        </Button>
                        <Button
                            type="button"
                            onClick={handleSavePreferences}
                            variant="primary"
                        >
                            {resolvedSaveLabel}
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    // Main Banner (non-blocking; does not block LCP)
    return (
        <>
            {!hasConsented && (
                <div
                    className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 p-4 shadow-lg backdrop-blur-md md:p-6"
                    role="region"
                    aria-label={resolvedTitle}
                >
                    <div className="mx-auto max-w-6xl">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="flex-1">
                                <h2 className="mb-1 text-lg font-semibold text-foreground">
                                    {resolvedTitle}
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    {resolvedDescription}{' '}
                                    <a
                                        href={resolvedPrivacyPolicyUrl}
                                        className="text-primary underline hover:no-underline"
                                    >
                                        {resolvedPrivacyPolicyLabel}
                                    </a>
                                    {imprintUrl && (
                                        <>
                                            {' · '}
                                            <a
                                                href={imprintUrl}
                                                className="text-primary underline hover:no-underline"
                                            >
                                                {resolvedImprintLabel}
                                            </a>
                                        </>
                                    )}
                                </p>
                            </div>

                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                <Button type="button" onClick={openPreferences} variant="outline">
                                    {resolvedSettingsLabel}
                                </Button>
                                <Button type="button" onClick={rejectAll} variant="outline">
                                    {resolvedRejectLabel}
                                </Button>
                                <Button type="button" onClick={acceptAll} variant="primary">
                                    {resolvedAcceptLabel}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {shouldShowFloatingTrigger && (
                <Button
                    type="button"
                    onClick={openPreferences}
                    variant="outline"
                    aria-label={floatingTriggerLabel}
                    className={cn(
                        'fixed bottom-4 z-50 rounded-full border-border/70 bg-card/92 px-4 py-2 text-xs shadow-lg backdrop-blur-md md:bottom-6',
                        triggerPlacement === 'floating' ? 'left-4 md:left-6' : 'right-4 md:right-6',
                    )}
                >
                    {resolvedSettingsLabel}
                </Button>
            )}
        </>
    )
}
