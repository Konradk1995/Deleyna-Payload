'use client'

import React from 'react'
import { useCookieConsent } from '@/providers/CookieConsent'
import { Button } from '@/components/ui/button'

interface CookieSettingsButtonProps {
    children?: React.ReactNode
    className?: string
    locale?: string
}

/**
 * A button that opens the cookie preferences modal
 * Can be placed in footer or settings page
 */
export function CookieSettingsButton({
    children,
    className = '',
    locale = 'de',
}: CookieSettingsButtonProps): React.ReactElement {
    const { openPreferences } = useCookieConsent()
    const fallbackLabel = locale === 'en' ? 'Cookie settings' : 'Cookie-Einstellungen'

    return (
        <Button
            onClick={openPreferences}
            variant="link"
            size="clear"
            className={`text-sm text-muted-foreground underline hover:text-foreground hover:no-underline ${className}`}
            type="button"
        >
            {children ?? fallbackLabel}
        </Button>
    )
}
