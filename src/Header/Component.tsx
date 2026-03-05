import { HeaderClient } from './Component.Client'
import localization from '@/i18n/localization'
import { getHeader } from '@/utilities/getGlobals'
import React from 'react'

import type { Post, Header } from '@/payload-types'
import { getCachedPayload } from '@/lib/payloadClient'

async function fetchLatestBlog(locale: 'de' | 'en'): Promise<Post | null> {
    try {
        const payload = await getCachedPayload()
        const result = await payload.find({
            collection: 'posts',
            where: {
                _status: { equals: 'published' },
            },
            limit: 1,
            depth: 1,
            sort: '-publishedAt',
            locale: locale,
            select: {
                slug: true,
                title: true,
                shortTitle: true,
                publishedAt: true,
                featuredImage: true,
            },
        })

        if (result.docs && result.docs.length > 0) {
            return result.docs[0] as Post
        }

        const defaultLocale = localization.defaultLocale as 'de' | 'en'
        if (locale !== defaultLocale) {
            const fallbackResult = await payload.find({
                collection: 'posts',
                where: {
                    _status: { equals: 'published' },
                },
                limit: 1,
                depth: 1,
                sort: '-publishedAt',
                locale: defaultLocale,
                select: {
                    slug: true,
                    title: true,
                    shortTitle: true,
                    publishedAt: true,
                    featuredImage: true,
                },
            })

            if (fallbackResult.docs && fallbackResult.docs.length > 0) {
                return fallbackResult.docs[0] as Post
            }
        }
    } catch (error) {
        console.error('Failed to fetch latest blog for header:', error)
    }

    return null
}

function createHeaderFallback(): Header {
    const timestamp = new Date().toISOString()

    return {
        id: 0,
        cardNavItems: [],
        ctaButtons: [],
        languageSwitcherPlacement: 'header',
        themeTogglePlacement: 'header',
        createdAt: timestamp,
        updatedAt: timestamp,
    }
}

export async function Header({ locale }: { locale: string }) {
    const headerData = await getHeader(locale)
    const safeHeaderData: Header = headerData ?? createHeaderFallback()

    const needsLatestBlog =
        Array.isArray(safeHeaderData.cardNavItems) &&
        safeHeaderData.cardNavItems.some(
            (item) => item && (item as { mediaDisplay?: string }).mediaDisplay === 'latestBlog',
        )

    const latestBlog = needsLatestBlog ? await fetchLatestBlog(locale as 'de' | 'en') : null

    return <HeaderClient data={safeHeaderData} latestBlog={latestBlog} />
}
