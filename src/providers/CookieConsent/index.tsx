'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const CONSENT_COOKIE = 'cookie-consent'
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365

export type CookiePreferences = {
    necessary: true
    analytics: boolean
    marketing: boolean
    updatedAt: string
}

export type CookieConsentContextValue = {
    isReady: boolean
    preferences: CookiePreferences | null
    hasConsented: boolean
    acceptAll: () => void
    rejectAll: () => void
    savePreferences: (update: Partial<Omit<CookiePreferences, 'necessary' | 'updatedAt'>>) => void
    openPreferences: () => void
    closePreferences: () => void
    isPreferencesOpen: boolean
}

const CookieConsentContext = createContext<CookieConsentContextValue | undefined>(undefined)

/**
 * Parse cookie preferences from document.cookie
 */
function parsePreferences(): CookiePreferences | null {
    if (typeof document === 'undefined') return null

    const cookie = document.cookie
        .split('; ')
        .find((entry) => entry.startsWith(`${CONSENT_COOKIE}=`))

    if (!cookie) return null

    try {
        const raw = decodeURIComponent(cookie.split('=').slice(1).join('='))
        const parsed = JSON.parse(raw) as Partial<CookiePreferences>

        if (!parsed || typeof parsed !== 'object') return null

        return {
            necessary: true,
            analytics: Boolean(parsed.analytics),
            marketing: Boolean(parsed.marketing),
            updatedAt: parsed.updatedAt || new Date().toISOString(),
        }
    } catch (error) {
        console.warn('Failed to parse cookie preferences', error)
        return null
    }
}

/**
 * Store cookie preferences in document.cookie
 */
function storePreferences(preferences: CookiePreferences): void {
    if (typeof document === 'undefined') return

    const value = encodeURIComponent(JSON.stringify(preferences))
    const secure = window.location.protocol === 'https:' ? '; Secure' : ''
    const cookie = `${CONSENT_COOKIE}=${value}; Path=/; Max-Age=${ONE_YEAR_SECONDS}; SameSite=Lax${secure}`

    document.cookie = cookie
}

/**
 * Update Google Tag Manager consent
 */
function updateGtagConsent(preferences: CookiePreferences): void {
    if (typeof window === 'undefined') return

    const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag

    if (typeof gtag !== 'function') return

    try {
        gtag('consent', 'update', {
            analytics_storage: preferences.analytics ? 'granted' : 'denied',
            ad_storage: preferences.marketing ? 'granted' : 'denied',
            ad_user_data: preferences.marketing ? 'granted' : 'denied',
            ad_personalization: preferences.marketing ? 'granted' : 'denied',
            functionality_storage: 'granted',
            security_storage: 'granted',
        })
    } catch (error) {
        console.warn('Failed to update gtag consent', error)
    }
}

interface CookieConsentProviderProps {
    children: React.ReactNode
}

export function CookieConsentProvider({
    children,
}: CookieConsentProviderProps): React.ReactElement {
    const [preferences, setPreferences] = useState<CookiePreferences | null>(null)
    const [isReady, setIsReady] = useState(false)
    const [isPreferencesOpen, setIsPreferencesOpen] = useState(false)

    // Load stored preferences on mount
    useEffect(() => {
        const stored = parsePreferences()
        if (stored) {
            setPreferences({ ...stored, necessary: true })
        }
        setIsReady(true)
    }, [])

    // Update HTML data attributes when preferences change
    useEffect(() => {
        if (typeof document === 'undefined') return

        const html = document.documentElement

        if (!preferences) {
            html.removeAttribute('data-analytics-consent')
            html.removeAttribute('data-marketing-consent')
            return
        }

        html.dataset.analyticsConsent = preferences.analytics ? 'granted' : 'denied'
        html.dataset.marketingConsent = preferences.marketing ? 'granted' : 'denied'
    }, [preferences])

    // Store preferences and update gtag when preferences change
    useEffect(() => {
        if (!isReady || !preferences) return

        const prefsWithTimestamp: CookiePreferences = {
            ...preferences,
            necessary: true,
            updatedAt: preferences.updatedAt || new Date().toISOString(),
        }

        storePreferences(prefsWithTimestamp)
        updateGtagConsent(prefsWithTimestamp)

        // Dispatch custom event for other components
        const event = new CustomEvent('cookie-consent:update', {
            detail: prefsWithTimestamp,
        })

        window.dispatchEvent(event)
    }, [preferences, isReady])

    const acceptAll = useCallback(() => {
        const next: CookiePreferences = {
            necessary: true,
            analytics: true,
            marketing: true,
            updatedAt: new Date().toISOString(),
        }
        setPreferences(next)
        setIsPreferencesOpen(false)
    }, [])

    const rejectAll = useCallback(() => {
        const next: CookiePreferences = {
            necessary: true,
            analytics: false,
            marketing: false,
            updatedAt: new Date().toISOString(),
        }
        setPreferences(next)
        setIsPreferencesOpen(false)
    }, [])

    const savePreferences = useCallback(
        (update: Partial<Omit<CookiePreferences, 'necessary' | 'updatedAt'>>) => {
            setPreferences((current) => ({
                necessary: true,
                analytics: update.analytics ?? current?.analytics ?? false,
                marketing: update.marketing ?? current?.marketing ?? false,
                updatedAt: new Date().toISOString(),
            }))
            setIsPreferencesOpen(false)
        },
        [],
    )

    const value = useMemo<CookieConsentContextValue>(
        () => ({
            isReady,
            preferences,
            hasConsented: preferences !== null,
            acceptAll,
            rejectAll,
            savePreferences,
            openPreferences: () => setIsPreferencesOpen(true),
            closePreferences: () => setIsPreferencesOpen(false),
            isPreferencesOpen,
        }),
        [acceptAll, rejectAll, savePreferences, isReady, preferences, isPreferencesOpen],
    )

    return <CookieConsentContext.Provider value={value}>{children}</CookieConsentContext.Provider>
}

export function useCookieConsent(): CookieConsentContextValue {
    const context = useContext(CookieConsentContext)

    if (!context) {
        throw new Error('useCookieConsent must be used within a CookieConsentProvider')
    }

    return context
}
