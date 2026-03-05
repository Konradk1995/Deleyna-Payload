import type { Access, FieldAccess } from 'payload'

/**
 * Access Control Functions
 * Diese Funktionen werden für sichere Zugriffssteuerung verwendet.
 * WICHTIG: Bei Local API immer overrideAccess: false setzen!
 */

// Jeder hat Zugriff (öffentlich)
export const anyone: Access = () => true

// Nur authentifizierte Benutzer
export const authenticated: Access = ({ req: { user } }) => Boolean(user)

// Nur Admins haben Zugriff
export const adminOnly: Access = ({ req: { user } }) => {
    return Boolean(user?.roles?.includes('admin'))
}

// Nur Admins oder Editoren
export const adminOrEditor: Access = ({ req: { user } }) => {
    if (!user) return false
    return user.roles?.includes('admin') || user.roles?.includes('editor')
}

// Admin oder eigenes Dokument
export const adminOrSelf: Access = ({ req: { user } }) => {
    if (!user) return false
    if (user.roles?.includes('admin')) return true

    // Query constraint für row-level security
    return {
        id: { equals: user.id },
    }
}

// Veröffentlichte Inhalte oder authentifizierte Benutzer
export const publishedOrAuthenticated: Access = ({ req: { user } }) => {
    if (user) return true

    return {
        _status: { equals: 'published' },
    }
}

// Nur Admins können Felder bearbeiten
export const adminFieldAccess: FieldAccess = ({ req: { user } }) => {
    return Boolean(user?.roles?.includes('admin'))
}

// Admin oder Editor kann Felder bearbeiten
export const editorFieldAccess: FieldAccess = ({ req: { user } }) => {
    if (!user) return false
    return user.roles?.includes('admin') || user.roles?.includes('editor')
}
