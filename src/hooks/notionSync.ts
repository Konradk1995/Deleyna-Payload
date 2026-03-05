/**
 * Notion sync hooks for the Talents collection.
 *
 * Reads config from the NotionSettings global (CMS Admin Panel).
 * Falls back to env vars NOTION_API_KEY / NOTION_TALENTS_DB_ID if CMS fields are empty.
 * Silently skips if sync is disabled or credentials are missing.
 */
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, Payload } from 'payload'
import { after } from 'next/server'
import type { NotionConfig } from '../lib/notion/syncTalentToNotion'

type NotionSettingsData = {
    enabled?: boolean
    apiKey?: string
    databaseId?: string
    syncOnPublish?: boolean
    archiveOnDelete?: boolean
}

async function getNotionConfig(payload: Payload): Promise<{
    config: NotionConfig
    syncOnPublish: boolean
    archiveOnDelete: boolean
} | null> {
    try {
        const settings = (await payload.findGlobal({
            slug: 'notion-settings',
        })) as NotionSettingsData

        if (!settings.enabled) return null

        const apiKey = settings.apiKey || process.env.NOTION_API_KEY || ''
        const databaseId = settings.databaseId || process.env.NOTION_TALENTS_DB_ID || ''

        if (!apiKey || !databaseId) return null

        return {
            config: { apiKey, databaseId },
            syncOnPublish: settings.syncOnPublish !== false,
            archiveOnDelete: settings.archiveOnDelete !== false,
        }
    } catch {
        return null
    }
}

export const notionAfterChange: CollectionAfterChangeHook = ({ doc, req: { context, payload } }) => {
    if (context.disableRevalidate) return doc

    after(async () => {
        try {
            const notion = await getNotionConfig(payload)
            if (!notion || !notion.syncOnPublish) return

            const { syncTalentToNotion } = await import('../lib/notion/syncTalentToNotion')
            await syncTalentToNotion(doc, notion.config)
        } catch (error) {
            console.error('[Notion] afterChange sync error:', error)
        }
    })

    return doc
}

export const notionAfterDelete: CollectionAfterDeleteHook = ({ doc, req: { context, payload } }) => {
    if (context.disableRevalidate) return doc

    after(async () => {
        try {
            const notion = await getNotionConfig(payload)
            if (!notion || !notion.archiveOnDelete) return

            const { archiveTalentInNotion } = await import('../lib/notion/syncTalentToNotion')
            await archiveTalentInNotion(doc.id, notion.config)
        } catch (error) {
            console.error('[Notion] afterDelete sync error:', error)
        }
    })

    return doc
}
