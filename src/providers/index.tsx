'use client'

import React from 'react'
import { ThemeProvider } from './Theme'
import { CookieConsentProvider } from './CookieConsent'

interface ProvidersProps {
    children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
    return (
        <ThemeProvider>
            <CookieConsentProvider>{children}</CookieConsentProvider>
        </ThemeProvider>
    )
}
