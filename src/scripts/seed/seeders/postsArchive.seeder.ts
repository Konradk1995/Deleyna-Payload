import type { Payload } from 'payload'

export async function postsArchiveSeeder(payload: Payload) {
    console.log('📦 Seeding Posts Archive global...')

    const seededMedia = await payload.find({
        collection: 'media',
        where: { filename: { contains: 'seed-editorial-' } },
        sort: 'filename',
        limit: 50,
        depth: 0,
    })
    const mediaIDs = seededMedia.docs.map((m) => m.id)
    const heroMedia = mediaIDs.length > 0 ? mediaIDs[5] : undefined

    await payload.updateGlobal({
        slug: 'posts-archive',
        data: {
            heroHeadline: 'Blog',
            heroDescription: 'News, Einblicke und Stories aus der Welt von Deleyna.',
            heroMedia,
            postsPerPage: 12,
            showCategories: true,
            showFeatured: true,
            showCta: false,
            metaTitle: 'Blog | Deleyna Talent Agency',
            metaDescription:
                'Blog und News von Deleyna – Talent Agency für Tänzer und Models.',
        } as any,
        locale: 'de',
        context: { disableRevalidate: true },
    })

    await payload.updateGlobal({
        slug: 'posts-archive',
        data: {
            heroHeadline: 'Blog',
            heroDescription: 'News, insights and stories from the Deleyna world.',
            heroMedia,
            postsPerPage: 12,
            showCategories: true,
            showFeatured: true,
            showCta: false,
            metaTitle: 'Blog | Deleyna Talent Agency',
            metaDescription:
                'Blog and news from Deleyna – talent agency for dancers and models.',
        } as any,
        locale: 'en',
        context: { disableRevalidate: true },
    })

    console.log('  ✅ Posts Archive (DE + EN) set')
    return { created: true }
}
