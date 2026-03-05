import { getPayload } from 'payload'
import config from '@/payload.config'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import { enrichFeaturedTalentsBlocks } from '@/utilities/enrichFeaturedTalentsBlocks'
import { localizePageSlug, toCanonicalPageSlug } from '@/utilities/pageSlugAliases'
import { PageStructuredData } from '@/components/seo/PageStructuredData'
import { getCachedDocument } from '@/utilities/getDocument'

import type { Metadata } from 'next'
import type { Page } from '@/payload-types'

type PageProps = {
    params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { locale, slug } = await params
    const canonicalSlug = toCanonicalPageSlug(slug)
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })
    const { isEnabled: isDraft } = await draftMode()

    try {
        const result = await payload.find({
            collection: 'pages',
            depth: 0,
            draft: isDraft,
            locale: locale as 'de' | 'en',
            where: {
                slug: { equals: canonicalSlug },
                ...(isDraft ? {} : { _status: { equals: 'published' } }),
            },
            limit: 1,
        })

        const page = result.docs[0]
        if (!page) return { title: 'Page Not Found' }

        return generateMeta({ doc: page, locale })
    } catch {
        return { title: 'Page' }
    }
}

export async function generateStaticParams() {
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    try {
        const result = await payload.find({
            collection: 'pages',
            depth: 0,
            select: { slug: true },
            where: { _status: { equals: 'published' } },
            limit: 100,
        })

        const slugs = new Set<string>()

        for (const page of result.docs) {
            if (!page.slug || page.slug === 'home') continue

            const canonical = page.slug
            slugs.add(canonical)
            slugs.add(localizePageSlug(canonical, 'de'))
            slugs.add(localizePageSlug(canonical, 'en'))
        }

        return [...slugs].map((pageSlug) => ({ slug: pageSlug }))
    } catch {
        return []
    }
}

export default async function DynamicPage({ params }: PageProps) {
    const { locale, slug } = await params
    const canonicalSlug = toCanonicalPageSlug(slug)
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })
    const { isEnabled: isDraft } = await draftMode()

    // Don't match known routes
    const reservedSlugs = ['talents', 'talente', 'blog', 'magazin']
    if (reservedSlugs.includes(slug) || reservedSlugs.includes(canonicalSlug)) {
        notFound()
    }

    let page: Page | null = null

    try {
        if (isDraft) {
            const result = await payload.find({
                collection: 'pages',
                draft: true,
                locale: locale as 'de' | 'en',
                where: { slug: { equals: canonicalSlug } },
                limit: 1,
                depth: 2,
            })
            page = result.docs[0] || null
        } else {
            page = await getCachedDocument<Page>('pages', canonicalSlug, {
                locale,
                depth: 2,
            })
        }
    } catch (error) {
        console.error('Error fetching page:', error)
    }

    if (!page) notFound()

    let layout = page.layout ?? null
    try {
        layout = (await enrichFeaturedTalentsBlocks(layout, payload, locale)) ?? null
    } catch (err) {
        console.error('enrichFeaturedTalentsBlocks failed:', err)
    }

    const localizedSlug = localizePageSlug(canonicalSlug, locale)
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
    const fallbackUrl = `${baseUrl}/${locale}/${localizedSlug}`
    const pageUrl = page.pageSettings?.canonicalUrl || fallbackUrl

    return (
        <>
            <PageStructuredData page={page} url={pageUrl} />
            {/* Hero */}
            {page.hero && page.hero.type !== 'none' && <RenderHero {...page.hero} />}

            {/* Blocks */}
            {layout && layout.length > 0 && <RenderBlocks blocks={layout} locale={locale} />}
        </>
    )
}
