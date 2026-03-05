'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'

const TURNSTILE_SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js'

declare global {
    interface Window {
        turnstile?: {
            render: (
                container: string | HTMLElement,
                options: {
                    sitekey: string
                    callback?: (token: string) => void
                    'expired-callback'?: () => void
                    'error-callback'?: () => void
                    theme?: 'light' | 'dark' | 'auto'
                    size?: 'normal' | 'compact' | 'flexible'
                    appearance?: 'always' | 'execute' | 'interaction-only'
                    language?: string
                },
            ) => string
            remove: (widgetId: string) => void
        }
    }
}

export type TurnstileWidgetProps = {
    siteKey: string
    onVerify: (token: string) => void
    onExpire?: () => void
    onError?: () => void
    theme?: 'light' | 'dark' | 'auto'
    size?: 'normal' | 'compact' | 'flexible'
    /** 'interaction-only' = unsichtbar bis Cloudflare eine Challenge anzeigt */
    appearance?: 'always' | 'execute' | 'interaction-only'
    locale?: string
    className?: string
}

/**
 * Cloudflare Turnstile Widget – cookie-frei, DSGVO-freundlich.
 * Zeigt nur bei Bedarf eine Challenge (interaction-only), sonst unsichtbar.
 */
export function TurnstileWidget({
    siteKey,
    onVerify,
    onExpire,
    onError,
    theme = 'auto',
    size = 'normal',
    appearance = 'interaction-only',
    locale,
    className,
}: TurnstileWidgetProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const widgetIdRef = useRef<string | null>(null)
    const [scriptLoaded, setScriptLoaded] = useState(false)
    const [mounted, setMounted] = useState(false)

    const onVerifyRef = useRef(onVerify)
    const onExpireRef = useRef(onExpire)
    const onErrorRef = useRef(onError)
    onVerifyRef.current = onVerify
    onExpireRef.current = onExpire
    onErrorRef.current = onError

    // Script einmal laden
    useEffect(() => {
        if (typeof document === 'undefined') return
        if (document.querySelector(`script[src="${TURNSTILE_SCRIPT_URL}"]`)) {
            setScriptLoaded(true)
            return
        }
        const script = document.createElement('script')
        script.src = TURNSTILE_SCRIPT_URL
        script.async = true
        script.defer = true
        script.onload = () => setScriptLoaded(true)
        document.head.appendChild(script)
    }, [])

    useEffect(() => {
        setMounted(true)
    }, [])

    const renderWidget = useCallback(() => {
        if (!containerRef.current || !window.turnstile || !siteKey) return
        if (widgetIdRef.current) {
            try {
                window.turnstile.remove(widgetIdRef.current)
            } catch {
                // ignore
            }
        }
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
            sitekey: siteKey,
            callback: (token) => onVerifyRef.current(token),
            'expired-callback': () => onExpireRef.current?.(),
            'error-callback': () => onErrorRef.current?.(),
            theme,
            size,
            appearance,
            language: locale === 'de' ? 'de' : locale === 'en' ? 'en' : undefined,
        })
    }, [siteKey, theme, size, appearance, locale])

    useEffect(() => {
        if (!mounted || !scriptLoaded) return
        renderWidget()
        return () => {
            if (widgetIdRef.current && window.turnstile) {
                try {
                    window.turnstile.remove(widgetIdRef.current)
                } catch {
                    // ignore
                }
                widgetIdRef.current = null
            }
        }
    }, [mounted, scriptLoaded, renderWidget])

    if (!siteKey) return null

    return (
        <div
            ref={containerRef}
            className={className}
            aria-label="Sicherheitsprüfung"
        />
    )
}
