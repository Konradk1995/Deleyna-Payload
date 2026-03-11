import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { after } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

/**
 * Revalidation hooks for published content.
 * Revalidation läuft in after(), damit sie nicht während des Renders (z. B. Admin Create-View) ausgeführt wird.
 * Supports context.disableRevalidate für Bulk-Operationen (seed, import).
 * Locale-aware: revalidates BOTH locale paths on content change.
 */

const LOCALES = ['de', 'en'] as const

/** Localized path segments: next-intl rewrites these in middleware */
const LOCALIZED_PATHS: Record<string, Record<string, string>> = {
    de: { '/talents': '/talente', '/blog': '/magazin', '/jobs': '/jobs' },
    en: {},
}

type RevalidateConfig = {
    /** URL path prefix for detail pages, e.g. '/talents' -> /talents/[slug] */
    pathPrefix?: string
    /** Optional listing path to revalidate (e.g. '/talents') */
    listingPath?: string
    /** Tag to revalidate for sitemap etc. */
    tag?: string
}

function scheduleRevalidate(fn: () => void) {
    after(fn)
}

export const revalidateAfterChange =
    ({ pathPrefix = '', listingPath, tag }: RevalidateConfig = {}): CollectionAfterChangeHook =>
    ({ doc, previousDoc, req: { context } }) => {
        if (context.disableRevalidate) return doc

        scheduleRevalidate(() => {
            /** Revalidate both the canonical path AND any localized alias */
            const pathFor = (p: string) =>
                LOCALES.forEach((locale) => {
                    revalidatePath(`/${locale}${p}`)
                    // Also revalidate localized path (e.g. /de/talente for /de/talents)
                    const localizedPrefix = Object.entries(LOCALIZED_PATHS[locale] || {}).find(
                        ([from]) => p.startsWith(from),
                    )
                    if (localizedPrefix) {
                        const [from, to] = localizedPrefix
                        revalidatePath(`/${locale}${p.replace(from, to)}`)
                    }
                })
            if (doc._status === 'published') {
                const slug = doc.slug as string | undefined
                if (slug) {
                    const detailPath = pathPrefix ? `${pathPrefix}/${slug}` : `/${slug}`
                    pathFor(detailPath)
                }
                if (listingPath) pathFor(listingPath)
                pathFor('/')
            }
            if (previousDoc?._status === 'published' && doc._status !== 'published') {
                const oldSlug = previousDoc.slug as string | undefined
                if (oldSlug) {
                    const detailPath = pathPrefix ? `${pathPrefix}/${oldSlug}` : `/${oldSlug}`
                    pathFor(detailPath)
                }
                if (listingPath) pathFor(listingPath)
            }
            revalidateTag('sitemap')
            if (tag) {
                revalidateTag(tag)
                // Invalidate document-level unstable_cache entries
                const slug = doc.slug as string | undefined
                if (slug) {
                    LOCALES.forEach((locale) => {
                        revalidateTag(`${tag}_${slug}_${locale}`)
                    })
                }
            }
        })

        return doc
    }

export const revalidateAfterDelete =
    ({ pathPrefix = '', listingPath, tag }: RevalidateConfig = {}): CollectionAfterDeleteHook =>
    ({ doc, req: { context } }) => {
        if (context.disableRevalidate) return doc

        scheduleRevalidate(() => {
            const pathFor = (p: string) =>
                LOCALES.forEach((locale) => {
                    revalidatePath(`/${locale}${p}`)
                    const localizedPrefix = Object.entries(LOCALIZED_PATHS[locale] || {}).find(
                        ([from]) => p.startsWith(from),
                    )
                    if (localizedPrefix) {
                        const [from, to] = localizedPrefix
                        revalidatePath(`/${locale}${p.replace(from, to)}`)
                    }
                })
            const slug = doc.slug as string | undefined
            if (slug) {
                const detailPath = pathPrefix ? `${pathPrefix}/${slug}` : `/${slug}`
                pathFor(detailPath)
            }
            if (listingPath) pathFor(listingPath)
            pathFor('/')
            revalidateTag('sitemap')
            if (tag) {
                revalidateTag(tag)
                const slug = doc.slug as string | undefined
                if (slug) {
                    LOCALES.forEach((locale) => {
                        revalidateTag(`${tag}_${slug}_${locale}`)
                    })
                }
            }
        })

        return doc
    }
