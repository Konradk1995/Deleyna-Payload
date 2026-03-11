import { getPayload } from 'payload'
import config from '@/payload.config'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { OrganizationSchema } from '@/components/seo'
import { PageStructuredData } from '@/components/seo/PageStructuredData'
import { enrichFeaturedTalentsBlocks } from '@/utilities/enrichFeaturedTalentsBlocks'
import { generateMeta } from '@/utilities/generateMeta'
import { getCachedDocument } from '@/utilities/getDocument'
import { getBusinessDataForSchema } from '@/utilities/getSEOSettings'

import type { Metadata } from 'next'
import type { Page } from '@/payload-types'

export const revalidate = 3600

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>
}): Promise<Metadata> {
    const { locale } = await params
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
                slug: { equals: 'home' },
                ...(isDraft ? {} : { _status: { equals: 'published' } }),
            },
            limit: 1,
        })
        const page = result.docs[0]
        if (!page) return { title: 'Home' }
        return generateMeta({ doc: page, locale })
    } catch {
        return { title: 'Home' }
    }
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })
    const { isEnabled: isDraft } = await draftMode()

    let page: Page | null = null

    try {
        if (isDraft) {
            const result = await payload.find({
                collection: 'pages',
                draft: true,
                locale: locale as 'de' | 'en',
                where: { slug: { equals: 'home' } },
                limit: 1,
                depth: 2,
            })
            page = result.docs[0] || null
        } else {
            page = await getCachedDocument<Page>('pages', 'home', {
                locale,
                depth: 2,
            })
        }
    } catch (error) {
        console.error('Error fetching home page:', error)
    }

    if (!page) notFound()

    let layout = page.layout ?? null
    try {
        layout = (await enrichFeaturedTalentsBlocks(layout, payload, locale)) ?? null
    } catch (err) {
        console.error('enrichFeaturedTalentsBlocks failed:', err)
    }

    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
    const pageUrl = page.pageSettings?.canonicalUrl || `${baseUrl}/${locale}`
    const businessData = await getBusinessDataForSchema(locale)

    return (
        <>
            <OrganizationSchema
                name={businessData.name}
                url={businessData.url}
                logo={businessData.logo}
                description={businessData.description}
                email={businessData.email}
                phone={businessData.telephone}
                address={{
                    street: businessData.address?.streetAddress,
                    city: businessData.address?.addressLocality,
                    postalCode: businessData.address?.postalCode,
                    country: businessData.address?.addressCountry,
                }}
                socialProfiles={businessData.sameAs}
            />
            <PageStructuredData page={page} url={pageUrl} />

            {page.hero && page.hero.type !== 'none' && <RenderHero {...page.hero} />}

            {layout && layout.length > 0 && <RenderBlocks blocks={layout} locale={locale} />}
        </>
    )
}
