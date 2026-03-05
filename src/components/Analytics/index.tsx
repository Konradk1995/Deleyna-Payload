'use client'

import React, { useEffect } from 'react'
import Script from 'next/script'
import { useCookieConsent } from '@/providers/CookieConsent'

interface AnalyticsProps {
    /** Google Analytics 4 Measurement ID (e.g., G-XXXXXXXXXX) */
    ga4MeasurementId?: string
    /** Google Tag Manager Container ID (e.g., GTM-XXXXXXX) */
    gtmContainerId?: string
    /** Rybbit Analytics Site ID */
    rybbitSiteId?: string
    /** Rybbit Script URL */
    rybbitScriptUrl?: string
    /** Whether to require cookie consent for GA4 */
    requireConsentGA?: boolean
    /** Whether to require cookie consent for GTM */
    requireConsentGTM?: boolean
    /** Whether to require cookie consent for Rybbit */
    requireConsentRybbit?: boolean
}

/**
 * Analytics Component
 *
 * Handles loading of various analytics scripts based on cookie consent.
 * Supports Google Analytics 4, Google Tag Manager, and Rybbit Analytics.
 */
export function Analytics({
    ga4MeasurementId,
    gtmContainerId,
    rybbitSiteId,
    rybbitScriptUrl = 'https://app.rybbit.io/api/script.js',
    requireConsentGA = true,
    requireConsentGTM = true,
    requireConsentRybbit = true,
}: AnalyticsProps): React.ReactElement {
    const { preferences, isReady } = useCookieConsent()

    const hasAnalyticsConsent = preferences?.analytics === true
    const shouldLoadGA = Boolean(ga4MeasurementId) && (!requireConsentGA || hasAnalyticsConsent)
    const shouldLoadGTM = Boolean(gtmContainerId) && (!requireConsentGTM || hasAnalyticsConsent)
    const shouldLoadRybbit =
        Boolean(rybbitSiteId) && (!requireConsentRybbit || hasAnalyticsConsent)

    // Initialize Google Analytics consent mode
    useEffect(() => {
        if (typeof window === 'undefined') return

        // Define gtag function if it doesn't exist
        if (typeof (window as unknown as { gtag?: unknown }).gtag === 'undefined') {
            ;(window as unknown as { dataLayer: unknown[] }).dataLayer =
                (window as unknown as { dataLayer?: unknown[] }).dataLayer || []

            function gtag(...args: unknown[]) {
                ;(window as unknown as { dataLayer: unknown[] }).dataLayer.push(args)
            }

            ;(window as unknown as { gtag: typeof gtag }).gtag = gtag

            // Set default consent state
            gtag('consent', 'default', {
                analytics_storage: 'denied',
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied',
                functionality_storage: 'granted',
                security_storage: 'granted',
            })
        }
    }, [])

    // Don't load scripts until consent is ready
    if (!isReady) {
        return <></>
    }

    return (
        <>
            {/* Google Tag Manager - Load early if GTM is configured */}
            {shouldLoadGTM && gtmContainerId && (
                <>
                    <Script
                        id="gtm-script"
                        strategy="lazyOnload"
                        dangerouslySetInnerHTML={{
                            __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${gtmContainerId}');
              `,
                        }}
                    />
                    {/* GTM noscript fallback - rendered in body */}
                    <noscript>
                        <iframe
                            src={`https://www.googletagmanager.com/ns.html?id=${gtmContainerId}`}
                            height="0"
                            width="0"
                            style={{ display: 'none', visibility: 'hidden' }}
                        />
                    </noscript>
                </>
            )}

            {/* Google Analytics 4 - Only if not using GTM */}
            {shouldLoadGA && ga4MeasurementId && !gtmContainerId && (
                <>
                    <Script
                        src={`https://www.googletagmanager.com/gtag/js?id=${ga4MeasurementId}`}
                        strategy="lazyOnload"
                    />
                <Script
                    id="ga4-config"
                    strategy="lazyOnload"
                    dangerouslySetInnerHTML={{
                        __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                window.__ga4MeasurementId = '${ga4MeasurementId}';
                gtag('config', '${ga4MeasurementId}', {
                  page_path: window.location.pathname,
                });
              `,
                    }}
                />
            </>
        )}

            {/* Rybbit Analytics - Privacy-friendly alternative */}
            {shouldLoadRybbit && rybbitSiteId && (
                <Script
                    src={rybbitScriptUrl}
                    data-site-id={rybbitSiteId}
                    strategy="lazyOnload"
                />
            )}
        </>
    )
}

/**
 * Track a custom event in Google Analytics
 */
export function trackEvent(
    eventName: string,
    eventParams?: Record<string, string | number | boolean>,
): void {
    if (typeof window === 'undefined') return

    const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag

    if (typeof gtag === 'function') {
        gtag('event', eventName, eventParams)
    }
}

/**
 * Track a page view in Google Analytics
 */
export function trackPageView(url: string, title?: string): void {
    if (typeof window === 'undefined') return

    const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag
    const measurementId = (window as unknown as { __ga4MeasurementId?: string })
        .__ga4MeasurementId

    if (typeof gtag === 'function' && measurementId) {
        gtag('config', measurementId, {
            page_path: url,
            page_title: title,
        })
    }
}
