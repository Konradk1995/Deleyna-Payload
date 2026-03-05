import type { Payload } from 'payload'

export async function talentsArchiveSeeder(payload: Payload) {
    console.log('📦 Seeding Talents Archive global...')

    const seededMedia = await payload.find({
        collection: 'media',
        where: { filename: { contains: 'seed-editorial-' } },
        sort: 'filename',
        limit: 50,
        depth: 0,
    })
    const mediaIDs = seededMedia.docs.map((m) => m.id)
    const heroMedia = mediaIDs.length > 0 ? mediaIDs[2] : undefined

    await payload.updateGlobal({
        slug: 'talents-archive',
        data: {
            heroHeadline: 'Unsere Talente',
            heroDescription:
                'Entdecken Sie unsere kuratierten Tänzer und Models – von Bühne bis Kampagne.',
            heroMedia,
            showFilters: true,
            filterLabels: {
                all: 'Alle',
                dancers: 'Tänzer',
                models: 'Models',
            },
            showCta: true,
            ctaHeadline: 'Du bist ein Talent?',
            ctaDescription: 'Wir freuen uns auf deine Bewerbung. Schreib uns oder sende dein Portfolio.',
            ctaButton: [
                {
                    link: {
                        type: 'custom',
                        url: '/kontakt',
                        label: 'Jetzt bewerben',
                    },
                },
            ],
            metaTitle: 'Talente | Deleyna Talent Agency',
            metaDescription:
                'Entdecken Sie unsere Talente: Tänzer und Models für Bühne, Kampagnen und Events.',
        } as any,
        locale: 'de',
        context: { disableRevalidate: true },
    })

    await payload.updateGlobal({
        slug: 'talents-archive',
        data: {
            heroHeadline: 'Our Talents',
            heroDescription:
                'Discover our curated dancers and models – from stage to campaign.',
            heroMedia,
            showFilters: true,
            filterLabels: {
                all: 'All',
                dancers: 'Dancers',
                models: 'Models',
            },
            showCta: true,
            ctaHeadline: 'Are you a talent?',
            ctaDescription: 'We look forward to your application. Write to us or send your portfolio.',
            ctaButton: [
                {
                    link: {
                        type: 'custom',
                        url: '/contact',
                        label: 'Apply now',
                    },
                },
            ],
            metaTitle: 'Talents | Deleyna Talent Agency',
            metaDescription:
                'Discover our talents: dancers and models for stage, campaigns and events.',
        } as any,
        locale: 'en',
        context: { disableRevalidate: true },
    })

    console.log('  ✅ Talents Archive (DE + EN) set')
    return { created: true }
}
