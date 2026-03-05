import type { GlobalConfig } from 'payload'
import { adminOnly } from '@/access'

export const NotionSettings: GlobalConfig = {
    slug: 'notion-settings',
    label: { de: 'Notion-Integration', en: 'Notion Integration' },
    access: {
        read: adminOnly,
        update: adminOnly,
    },
    admin: {
        group: { de: 'Integrationen', en: 'Integrations' },
        description: {
            de: 'Synchronisiere genehmigte Talents automatisch zu einer Notion-Datenbank.',
            en: 'Automatically sync approved talents to a Notion database.',
        },
    },
    fields: [
        {
            name: 'enabled',
            type: 'checkbox',
            label: { de: 'Notion-Sync aktivieren', en: 'Enable Notion sync' },
            defaultValue: false,
            admin: {
                description: {
                    de: 'Wenn aktiviert, werden veröffentlichte Talents automatisch zu Notion synchronisiert. Erfordert API-Key und Datenbank-ID.',
                    en: 'When enabled, published talents are automatically synced to Notion. Requires API key and database ID.',
                },
            },
        },
        {
            name: 'apiKey',
            type: 'text',
            label: { de: 'Notion API Key', en: 'Notion API Key' },
            admin: {
                description: {
                    de: 'Integration Token von https://www.notion.so/my-integrations. Alternativ in .env als NOTION_API_KEY setzen.',
                    en: 'Integration token from https://www.notion.so/my-integrations. Alternatively set as NOTION_API_KEY in .env.',
                },
                condition: (_, siblingData) => siblingData?.enabled === true,
            },
        },
        {
            name: 'databaseId',
            type: 'text',
            label: { de: 'Notion Datenbank-ID', en: 'Notion Database ID' },
            admin: {
                description: {
                    de: 'Die 32-stellige ID aus der Notion-Datenbank-URL. Alternativ in .env als NOTION_TALENTS_DB_ID setzen.',
                    en: 'The 32-character ID from the Notion database URL. Alternatively set as NOTION_TALENTS_DB_ID in .env.',
                },
                condition: (_, siblingData) => siblingData?.enabled === true,
            },
        },
        {
            name: 'syncOnPublish',
            type: 'checkbox',
            label: { de: 'Bei Veröffentlichung synchronisieren', en: 'Sync on publish' },
            defaultValue: true,
            admin: {
                description: {
                    de: 'Talent automatisch synchronisieren, wenn es veröffentlicht oder aktualisiert wird.',
                    en: 'Automatically sync talent when it is published or updated.',
                },
                condition: (_, siblingData) => siblingData?.enabled === true,
            },
        },
        {
            name: 'archiveOnDelete',
            type: 'checkbox',
            label: { de: 'Bei Löschen archivieren', en: 'Archive on delete' },
            defaultValue: true,
            admin: {
                description: {
                    de: 'Notion-Seite archivieren, wenn ein Talent gelöscht wird.',
                    en: 'Archive Notion page when a talent is deleted.',
                },
                condition: (_, siblingData) => siblingData?.enabled === true,
            },
        },
        {
            name: 'exportPanel',
            type: 'ui',
            admin: {
                components: {
                    Field: '@/components/admin/NotionExportPanel#NotionExportPanel',
                },
            },
        },
    ],
}
