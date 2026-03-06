import type { CollectionConfig } from 'payload'
import { adminOnly, adminOrSelf, authenticated } from '../access'
import {
    generateVerifyEmailHTML,
    generateForgotPasswordHTML,
} from '../utilities/emailTemplates'

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
        tokenExpiration: 7200,
        maxLoginAttempts: 5,
        lockTime: 600 * 1000,
        cookies: {
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
        },
        verify: {
            generateEmailHTML: (args: { token: string; user: Record<string, unknown> }) =>
                generateVerifyEmailHTML({
                    token: args.token,
                    user: {
                        email: String(args.user.email ?? ''),
                        name: args.user.name ? String(args.user.name) : undefined,
                    },
                }),
        },
        forgotPassword: {
            generateEmailHTML: (args?: { token?: string; user?: Record<string, unknown> }) =>
                generateForgotPasswordHTML({
                    token: args?.token ?? '',
                    user: {
                        email: String(args?.user?.email ?? ''),
                        name: args?.user?.name ? String(args.user.name) : undefined,
                    },
                }),
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
