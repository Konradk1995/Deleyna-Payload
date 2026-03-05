/**
 * Notion Integration – Syncs published Talents to a Notion database.
 *
 * Setup:
 * 1. Create a Notion Integration at https://www.notion.so/my-integrations
 * 2. Create a Notion Database with these properties:
 *    - Name (title)
 *    - Category (select: Dancer, Model, Dancer & Model)
 *    - Status (select: Published, Draft, Archived)
 *    - Height (number)
 *    - Bust (number)
 *    - Waist (number)
 *    - Hips (number)
 *    - Shoe Size (text)
 *    - Clothing Size (text)
 *    - Hair (multi_select)
 *    - Eyes (multi_select)
 *    - Skills (multi_select)
 *    - Languages (multi_select)
 *    - Booking Email (email)
 *    - Instagram (url)
 *    - TikTok (url)
 *    - Website (url)
 *    - Bio DE (rich_text)
 *    - Featured (checkbox)
 *    - Sort Order (number)
 *    - Payload ID (number) – used to link back, set as unique
 *    - Slug (rich_text)
 *    - Profile URL (url)
 *    - Last Synced (date)
 * 3. Share the database with your integration
 * 4. Configure in Admin → Notion-Integration or set env vars
 */

import { createRequire } from 'node:module'

export type NotionConfig = {
    apiKey: string
    databaseId: string
}

type NotionClientLike = {
    pages: {
        update: (args: Record<string, unknown>) => Promise<unknown>
        create: (args: Record<string, unknown>) => Promise<unknown>
    }
}

type NotionClientCtor = new (args: { auth: string }) => NotionClientLike

let cachedNotionClientCtor: NotionClientCtor | null | undefined

function getNotionClientCtor(): NotionClientCtor | null {
    if (cachedNotionClientCtor !== undefined) return cachedNotionClientCtor

    try {
        const require = createRequire(import.meta.url)
        const notionModule = require('@notionhq/client') as { Client?: NotionClientCtor }
        cachedNotionClientCtor = notionModule?.Client ?? null
    } catch {
        cachedNotionClientCtor = null
    }

    return cachedNotionClientCtor
}

function createNotionClient(apiKey: string): NotionClientLike | null {
    const NotionClient = getNotionClientCtor()
    if (!NotionClient) return null
    return new NotionClient({ auth: apiKey })
}

type TalentDoc = {
    id: number
    name?: string
    slug?: string
    category?: string
    _status?: string
    featured?: boolean
    sortOrder?: number
    bio?: string
    bookingEmail?: string
    measurements?: {
        height?: string
        bust?: string
        waist?: string
        hips?: string
        shoeSize?: string
        confectionSize?: string
        hair?: string[]
        eyes?: string[]
    }
    skills?: Array<{ title?: string; id?: number } | number>
    languages?: string[]
    socialMedia?: {
        instagram?: string
        tiktok?: string
        website?: string
    }
}

function parseMeasurement(value?: string): number | null {
    if (!value) return null
    const parsed = Number.parseFloat(value.replace(/,/g, '.').replace(/[^0-9.]/g, ''))
    return Number.isFinite(parsed) ? parsed : null
}

function truncate(text: string, max = 2000): string {
    return text.length > max ? text.slice(0, max) : text
}

function selectOptions(values?: string[]): Array<{ name: string }> {
    if (!values || !Array.isArray(values)) return []
    return values.filter(Boolean).map((v) => ({ name: String(v) }))
}

function resolveSkillNames(skills?: TalentDoc['skills']): Array<{ name: string }> {
    if (!skills || !Array.isArray(skills)) return []
    return skills
        .map((s) => {
            if (typeof s === 'object' && s !== null && 'title' in s) return s.title
            return null
        })
        .filter((name): name is string => Boolean(name))
        .map((name) => ({ name }))
}

/**
 * Find existing Notion page by Payload ID to upsert.
 * Uses REST API directly since @notionhq/client v5 removed databases.query.
 */
async function findExistingPage(
    config: NotionConfig,
    payloadId: number,
): Promise<string | null> {
    try {
        const response = await fetch(
            `https://api.notion.com/v1/databases/${config.databaseId}/query`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${config.apiKey}`,
                    'Notion-Version': '2022-06-28',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    filter: {
                        property: 'Payload ID',
                        number: { equals: payloadId },
                    },
                    page_size: 1,
                }),
            },
        )
        if (!response.ok) return null
        const data = (await response.json()) as { results?: Array<{ id: string }> }
        return data.results && data.results.length > 0 ? data.results[0].id : null
    } catch {
        return null
    }
}

function buildProperties(doc: TalentDoc, siteUrl: string) {
    const categoryMap: Record<string, string> = {
        dancer: 'Dancer',
        model: 'Model',
        both: 'Dancer & Model',
    }

    const profileUrl = doc.slug ? `${siteUrl}/de/talente/${doc.slug}` : undefined

    return {
        Name: { title: [{ text: { content: doc.name || 'Unnamed' } }] },
        Category: { select: { name: categoryMap[doc.category || 'both'] || 'Dancer & Model' } },
        Status: {
            select: { name: doc._status === 'published' ? 'Published' : 'Draft' },
        },
        'Payload ID': { number: doc.id },
        Slug: { rich_text: [{ text: { content: doc.slug || '' } }] },
        Featured: { checkbox: doc.featured || false },
        'Sort Order': { number: doc.sortOrder || 0 },
        'Booking Email': { email: doc.bookingEmail || null },
        Height: { number: parseMeasurement(doc.measurements?.height) },
        Bust: { number: parseMeasurement(doc.measurements?.bust) },
        Waist: { number: parseMeasurement(doc.measurements?.waist) },
        Hips: { number: parseMeasurement(doc.measurements?.hips) },
        'Shoe Size': {
            rich_text: [{ text: { content: doc.measurements?.shoeSize || '' } }],
        },
        'Clothing Size': {
            rich_text: [{ text: { content: doc.measurements?.confectionSize || '' } }],
        },
        Hair: { multi_select: selectOptions(doc.measurements?.hair) },
        Eyes: { multi_select: selectOptions(doc.measurements?.eyes) },
        Skills: { multi_select: resolveSkillNames(doc.skills) },
        Languages: { multi_select: selectOptions(doc.languages) },
        Instagram: {
            url: doc.socialMedia?.instagram
                ? `https://instagram.com/${doc.socialMedia.instagram.replace('@', '')}`
                : null,
        },
        TikTok: {
            url: doc.socialMedia?.tiktok
                ? `https://tiktok.com/@${doc.socialMedia.tiktok.replace('@', '')}`
                : null,
        },
        Website: { url: doc.socialMedia?.website || null },
        'Bio DE': {
            rich_text: [{ text: { content: truncate(typeof doc.bio === 'string' ? doc.bio : '') } }],
        },
        'Profile URL': { url: profileUrl || null },
        'Last Synced': { date: { start: new Date().toISOString() } },
    }
}

/**
 * Sync a single talent document to Notion (upsert).
 */
export async function syncTalentToNotion(doc: TalentDoc, config: NotionConfig): Promise<void> {
    const notion = createNotionClient(config.apiKey)
    if (!notion) return

    const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

    try {
        const existingPageId = await findExistingPage(config, doc.id)
        const properties = buildProperties(doc, siteUrl)

        if (existingPageId) {
            await notion.pages.update({
                page_id: existingPageId,
                properties,
                archived: doc._status !== 'published',
            })
        } else if (doc._status === 'published') {
            await notion.pages.create({
                parent: { database_id: config.databaseId },
                properties,
            })
        }
    } catch (error) {
        console.error(`[Notion] Failed to sync talent ${doc.id} (${doc.name}):`, error)
    }
}

/**
 * Remove a talent from Notion (archive the page).
 */
export async function archiveTalentInNotion(payloadId: number, config: NotionConfig): Promise<void> {
    const notion = createNotionClient(config.apiKey)
    if (!notion) return

    try {
        const existingPageId = await findExistingPage(config, payloadId)
        if (existingPageId) {
            await notion.pages.update({
                page_id: existingPageId,
                archived: true,
            })
        }
    } catch (error) {
        console.error(`[Notion] Failed to archive talent ${payloadId}:`, error)
    }
}
