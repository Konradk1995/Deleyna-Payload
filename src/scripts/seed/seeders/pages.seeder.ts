import type { Payload } from 'payload'

/** Minimal Lexical root mit einem Absatz (für Hero-RichText). */
function minimalLexicalRoot(headlineText: string) {
    return {
        root: {
            type: 'root',
            children: [
                {
                    type: 'paragraph',
                    version: 1,
                    children: [
                        {
                            type: 'text',
                            version: 1,
                            text: headlineText,
                        },
                    ],
                    direction: 'ltr' as const,
                    format: '' as const,
                    indent: 0,
                },
            ],
            direction: 'ltr' as const,
            format: '' as const,
            indent: 0,
            version: 1,
        },
    }
}

export async function pagesSeeder(payload: Payload) {
    console.log('📦 Seeding pages...')

    const existing = await payload.find({
        collection: 'pages',
        where: { slug: { equals: 'home' } },
        limit: 1,
        depth: 0,
    })

    if (existing.docs.length > 0) {
        console.log('  ⏭️ Home page already exists, skipping')
        return { created: 0, skipped: 1, total: existing.totalDocs }
    }

    await payload.create({
        collection: 'pages',
        data: {
            title: 'Home',
            slug: 'home',
            hero: {
                type: 'highImpact',
                badge: 'Deleyna Talent Agency',
                richText: minimalLexicalRoot('Wo Kunst auf Gelegenheit trifft.'),
                headlineHighlight: 'Gelegenheit',
                showScrollIndicator: true,
                backgroundStyle: 'dark',
                alignment: 'center',
            },
            layout: [],
            pageSettings: {
                metaTitle: 'Deleyna Talent Agency – Home',
                metaDescription:
                    'Deleyna Talent Agency in Berlin: Booking, Management und Education für Tänzer und Models.',
                metaKeywords:
                    'deleyna, talent agency, berlin, tänzer, models, booking, management, education',
                includeBreadcrumbs: true,
                includeOrganization: true,
                schemaType: 'WebPage',
            },
            _status: 'published',
        } as any,
        context: { disableRevalidate: true },
    })

    console.log('  ✅ Created home page (slug: home)')
    return { created: 1, skipped: 0, total: 1 }
}
