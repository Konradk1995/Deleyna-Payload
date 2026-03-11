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
    defaultPopulate: {
        name: true,
        email: true,
    },
    admin: {
        useAsTitle: 'email',
        listSearchableFields: ['name', 'email'],
        defaultColumns: ['email', 'name', 'roles', 'createdAt'],
        group: { de: 'Admin', en: 'Admin' },
        description: {
            de: 'Administratoren, Redakteure und Benutzer mit Rollen und Zugriffsrechten.',
            en: 'Administrators, editors and users with roles and access permissions.',
        },
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
        read: authenticated,
        create: adminOnly,
        update: adminOrSelf,
        delete: adminOnly,
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
            saveToJWT: true,
            options: [
                { label: { de: 'Admin', en: 'Admin' }, value: 'admin' },
                { label: { de: 'Editor', en: 'Editor' }, value: 'editor' },
                { label: { de: 'Benutzer', en: 'User' }, value: 'user' },
            ],
            access: {
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
