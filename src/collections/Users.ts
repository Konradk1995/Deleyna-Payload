import type { CollectionConfig } from 'payload'
import { adminOnly, adminOrSelf, authenticated } from '../access'

export const Users: CollectionConfig = {
    slug: 'users',
    labels: {
        singular: { de: 'Benutzer', en: 'User' },
        plural: { de: 'Benutzer', en: 'Users' },
    },
    admin: {
        useAsTitle: 'email',
        listSearchableFields: ['name', 'email'],
        defaultColumns: ['email', 'name', 'roles', 'createdAt'],
        group: { de: 'Admin', en: 'Admin' },
    },
    auth: {
        tokenExpiration: 7200, // 2 Stunden
        maxLoginAttempts: 5,
        lockTime: 600 * 1000, // 10 Minuten Sperre nach 5 Fehlversuchen
        cookies: {
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
        },
        verify: false, // Email verification (enable in production with email service)
        forgotPassword: {
            generateEmailHTML: undefined, // Configure with email service
        },
    },
    access: {
        // Nur authentifizierte Benutzer können Liste sehen
        read: authenticated,
        // Nur Admins können neue User erstellen
        create: adminOnly,
        // Admins können alle bearbeiten, User nur sich selbst
        update: adminOrSelf,
        // Nur Admins können User löschen
        delete: adminOnly,
        // Admin-Panel Zugriff
        admin: ({ req: { user } }) => {
            if (!user) return false
            return user.roles?.includes('admin') || user.roles?.includes('editor')
        },
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            label: { de: 'Name', en: 'Name' },
            required: true,
        },
        {
            name: 'roles',
            type: 'select',
            hasMany: true,
            defaultValue: ['user'],
            required: true,
            saveToJWT: true, // Wichtig für Performance - Rollen im JWT speichern
            options: [
                { label: { de: 'Admin', en: 'Admin' }, value: 'admin' },
                { label: { de: 'Editor', en: 'Editor' }, value: 'editor' },
                { label: { de: 'Benutzer', en: 'User' }, value: 'user' },
            ],
            access: {
                // Nur Admins können Rollen ändern
                update: ({ req: { user } }) => Boolean(user?.roles?.includes('admin')),
            },
        },
        {
            name: 'avatar',
            type: 'upload',
            relationTo: 'media',
        },
    ],
    timestamps: true,
}
