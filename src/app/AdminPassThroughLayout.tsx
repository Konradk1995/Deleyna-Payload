import React from 'react'

/**
 * Für /admin: Kein eigenes Document. Payloads RootLayout rendert <html>/<body>.
 * Nur Pass-Through, damit kein doppeltes Document.
 */
export function AdminPassThroughLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
