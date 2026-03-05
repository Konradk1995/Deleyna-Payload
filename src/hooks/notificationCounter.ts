import type { PayloadRequest } from 'payload'

/** Locale key for unread counter (used when Notifications global exists) */
type UnreadField = 'unreadFormSubmissionsDe' | 'unreadFormSubmissionsEn'

/**
 * Increment the unread form submissions counter for a given locale.
 * Used in afterCreate hook on form submissions.
 * No-op if Notifications global is not configured.
 */
export async function incrementNotificationCounter(
    req: PayloadRequest,
    locale: string,
): Promise<void> {
    try {
        const notifications = await (req.payload.findGlobal as (args: { slug: string; req: PayloadRequest }) => Promise<Record<string, unknown>>)({ slug: 'notifications', req })
        const field: UnreadField = locale === 'en' ? 'unreadFormSubmissionsEn' : 'unreadFormSubmissionsDe'
        const current = (Number(notifications?.[field]) || 0) as number

        await (req.payload.updateGlobal as (args: { slug: string; data: Record<string, number>; req: PayloadRequest }) => Promise<unknown>)({
            slug: 'notifications',
            data: { [field]: current + 1 },
            req,
        })
    } catch {
        // Silently fail - notifications are non-critical
    }
}

/**
 * Decrement the unread form submissions counter for a given locale.
 * Used when a form submission is marked as "read".
 */
export async function decrementNotificationCounter(
    req: PayloadRequest,
    locale: string,
): Promise<void> {
    try {
        const notifications = await (req.payload.findGlobal as (args: { slug: string; req: PayloadRequest }) => Promise<Record<string, unknown>>)({ slug: 'notifications', req })
        const field: UnreadField = locale === 'en' ? 'unreadFormSubmissionsEn' : 'unreadFormSubmissionsDe'
        const current = (Number(notifications?.[field]) || 0) as number

        await (req.payload.updateGlobal as (args: { slug: string; data: Record<string, number>; req: PayloadRequest }) => Promise<unknown>)({
            slug: 'notifications',
            data: { [field]: Math.max(0, current - 1) },
            req,
        })
    } catch {
        // Silently fail
    }
}
