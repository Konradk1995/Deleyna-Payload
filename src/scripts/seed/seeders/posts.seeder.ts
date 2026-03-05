import type { Payload } from 'payload'
import type { User } from '@/payload-types'

function lexicalParagraph(text: string) {
    return {
        type: 'paragraph',
        version: 1,
        children: [{ type: 'text', version: 1, text }],
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
    }
}

function lexicalRoot(paragraphs: string[]) {
    return {
        root: {
            type: 'root',
            children: paragraphs.map((text) => lexicalParagraph(text)),
            direction: 'ltr' as const,
            format: '' as const,
            indent: 0,
            version: 1,
        },
    }
}

async function ensureCategory(
    payload: Payload,
    args: {
        slug: string
        color: string
        titleDE: string
        titleEN: string
        descriptionDE?: string
        descriptionEN?: string
    },
): Promise<number> {
    const found = await payload.find({
        collection: 'categories',
        where: { slug: { equals: args.slug } },
        limit: 1,
        depth: 0,
    })

    if (found.docs.length > 0) {
        const id = found.docs[0].id
        await payload.update({
            collection: 'categories',
            id,
            locale: 'de',
            data: {
                title: args.titleDE,
                description: args.descriptionDE,
                color: args.color,
            },
            context: { disableRevalidate: true },
        })
        await payload.update({
            collection: 'categories',
            id,
            locale: 'en',
            data: {
                title: args.titleEN,
                description: args.descriptionEN,
                color: args.color,
            },
            context: { disableRevalidate: true },
        })
        return id
    }

    const created = await payload.create({
        collection: 'categories',
        locale: 'de',
        data: {
            title: args.titleDE,
            slug: args.slug,
            description: args.descriptionDE,
            color: args.color,
        },
        context: { disableRevalidate: true },
    })

    await payload.update({
        collection: 'categories',
        id: created.id,
        locale: 'en',
        data: {
            title: args.titleEN,
            description: args.descriptionEN,
            color: args.color,
        },
        context: { disableRevalidate: true },
    })

    return created.id
}

export async function postsSeeder(payload: Payload) {
    console.log('📦 Seeding blog posts (articles + news + dance classes)...')

    const users = await payload.find({
        collection: 'users',
        limit: 1,
        depth: 0,
    })

    const author = users.docs[0] as User | undefined
    if (!author) {
        console.log('  ⚠️  No user found for post author, skipping posts seeding')
        return { created: 0, skipped: 0, total: 0 }
    }

    const talents = await payload.find({
        collection: 'talents',
        where: { _status: { equals: 'published' } },
        sort: 'sortOrder',
        limit: 2,
        depth: 0,
    })
    const instructorIDs = talents.docs.map((t) => t.id)

    const seededMedia = await payload.find({
        collection: 'media',
        where: {
            filename: { contains: 'seed-editorial-' },
        },
        sort: 'filename',
        limit: 50,
        depth: 0,
    })
    const mediaIDs = seededMedia.docs.map((m) => m.id)
    const pickMedia = (index: number) =>
        mediaIDs.length > 0 ? mediaIDs[index % mediaIDs.length] : undefined

    const newsCategoryID = await ensureCategory(payload, {
        slug: 'news',
        color: '#C4956A',
        titleDE: 'News',
        titleEN: 'News',
        descriptionDE: 'News und Updates rund um Deleyna.',
        descriptionEN: 'News and updates around Deleyna.',
    })

    const classesCategoryID = await ensureCategory(payload, {
        slug: 'dance-classes',
        color: '#E8A86D',
        titleDE: 'Tanzkurse',
        titleEN: 'Dance Classes',
        descriptionDE: 'Workshops und offene Klassen mit Talents aus unserem Roster.',
        descriptionEN: 'Workshops and open classes with talents from our roster.',
    })

    const insightsCategoryID = await ensureCategory(payload, {
        slug: 'insights',
        color: '#B4B4B4',
        titleDE: 'Einblicke',
        titleEN: 'Insights',
        descriptionDE: 'Behind-the-scenes und Know-how aus Agentur und Training.',
        descriptionEN: 'Behind the scenes and know-how from agency and training.',
    })

    const posts = [
        {
            slug: 'new-class-drops-berlin-spring-2026',
            de: {
                title: 'Neue Dance Classes in Berlin: Spring 2026',
                excerpt:
                    'Wir erweitern unser Berlin-Lineup mit neuen Open Classes, Heels und Contemporary Sessions mit Talents aus unserem Roster.',
                content: [
                    'Berlin bekommt ab März 2026 ein neues Class-Programm mit mehreren offenen Slots pro Woche.',
                    'Neben Open Level Sessions kommen fokussierte Heels- und Contemporary-Formate dazu.',
                    'Jede Class wird von Talents aus unserem Roster begleitet, damit Technik und Ausdruck auf dem gleichen Level wachsen.',
                ],
            },
            en: {
                title: 'New dance classes in Berlin: Spring 2026',
                excerpt:
                    'We are expanding our Berlin lineup with new open classes, heels and contemporary sessions led by talents from our roster.',
                content: [
                    'Starting March 2026, Berlin gets a new class program with multiple open slots each week.',
                    'Alongside open level sessions, we are adding focused heels and contemporary formats.',
                    'Each class is led by talents from our roster to grow technique and expression at the same pace.',
                ],
            },
            postType: 'news' as const,
            categoryIDs: [newsCategoryID, classesCategoryID],
            metaDE: {
                title: 'Neue Dance Classes Berlin Spring 2026 | Deleyna',
                description: 'Neue Open Classes, Heels und Contemporary Sessions in Berlin ab März 2026 mit Deleyna Talents.',
            },
            metaEN: {
                title: 'New Dance Classes Berlin Spring 2026 | Deleyna',
                description: 'New open classes, heels and contemporary sessions in Berlin starting March 2026 with Deleyna talents.',
            },
        },
        {
            slug: 'heels-open-class-berlin-march-14-2026',
            de: {
                title: 'Heels Open Class am 14. März in Berlin',
                excerpt:
                    'Eine intensive 90-Minuten Session in Berlin-Mitte. Fokus auf Performance, Musicality und Stage Presence.',
                content: [
                    'Diese Open Class richtet sich an Tänzerinnen und Tänzer, die ihre Performance in Heels auf das nächste Level bringen wollen.',
                    'Der Fokus liegt auf sauberer Technik, Körperlinien, Übergängen und Confidence in Kombinationen.',
                    'Nach dem Training gibt es eine kurze Q&A-Runde mit unserem Instructor Talent.',
                ],
            },
            en: {
                title: 'Heels open class on March 14 in Berlin',
                excerpt:
                    'An intensive 90-minute session in Berlin Mitte. Focus on performance, musicality and stage presence.',
                content: [
                    'This open class is designed for dancers who want to level up their heels performance.',
                    'We focus on clean technique, body lines, transitions and confidence in choreography.',
                    'After class, there is a short Q&A with our instructor talent.',
                ],
            },
            postType: 'class' as const,
            categoryIDs: [classesCategoryID],
            metaDE: {
                title: 'Heels Open Class 14. März Berlin | Deleyna',
                description: '90-Minuten Heels Session in Berlin-Mitte: Performance, Musicality und Stage Presence.',
            },
            metaEN: {
                title: 'Heels Open Class March 14 Berlin | Deleyna',
                description: '90-minute heels session in Berlin Mitte: performance, musicality and stage presence.',
            },
            classDetailsDE: {
                classDate: '2026-03-14T18:00:00.000Z',
                classEndDate: '2026-03-14T19:30:00.000Z',
                studioName: 'Pulse Studio Berlin',
                studioCity: 'Berlin',
                studioAddress: 'Torstraße 120, 10119 Berlin',
                danceStyle: 'Heels',
                level: 'open' as const,
                duration: '90 Minuten',
                priceInfo: '25€ Drop-In',
                maxParticipants: 24,
                bookingUrl: 'https://example.com/booking/heels-berlin',
                instructorTalents: instructorIDs,
            },
            classDetailsEN: {
                classDate: '2026-03-14T18:00:00.000Z',
                classEndDate: '2026-03-14T19:30:00.000Z',
                studioName: 'Pulse Studio Berlin',
                studioCity: 'Berlin',
                studioAddress: 'Torstraße 120, 10119 Berlin',
                danceStyle: 'Heels',
                level: 'open' as const,
                duration: '90 minutes',
                priceInfo: '€25 drop-in',
                maxParticipants: 24,
                bookingUrl: 'https://example.com/booking/heels-berlin',
                instructorTalents: instructorIDs,
            },
        },
        {
            slug: 'how-to-prepare-for-casting-day',
            de: {
                title: 'Casting Day: So bereitest du dich richtig vor',
                excerpt:
                    'Drei Bereiche entscheiden am Casting Day: Präsenz, Vorbereitung und Klarheit in deiner Performance.',
                content: [
                    'Ein starkes Casting beginnt nicht im Raum, sondern in der Vorbereitung: Musik, Look und Energie müssen zusammenpassen.',
                    'Plane vorab 2 bis 3 klare Qualitäten, die du zeigen willst, statt alles auf einmal zu performen.',
                    'Halte deine Kombinationen sauber, bleib anpassungsfähig und gib der Jury eine klare Story von dir als Talent.',
                ],
            },
            en: {
                title: 'Casting day: how to prepare the right way',
                excerpt:
                    'Three areas decide your casting day impact: presence, preparation and clarity in your performance.',
                content: [
                    'A strong casting starts before you enter the room: music, look and energy must work together.',
                    'Plan 2 to 3 clear qualities you want to show instead of trying to show everything at once.',
                    'Keep your combinations clean, stay adaptable and give the jury a clear story of you as talent.',
                ],
            },
            postType: 'article' as const,
            categoryIDs: [insightsCategoryID],
            metaDE: {
                title: 'Casting Day Vorbereitung | Deleyna Insights',
                description: 'Drei Bereiche entscheiden am Casting Day: Präsenz, Vorbereitung und Klarheit in der Performance.',
            },
            metaEN: {
                title: 'Casting Day Preparation | Deleyna Insights',
                description: 'Three areas decide your casting day: presence, preparation and clarity in performance.',
            },
        },
        {
            slug: 'contemporary-lab-neukoelln-april-02-2026',
            de: {
                title: 'Contemporary Lab am 02. April in Neukölln',
                excerpt:
                    'Neue Open Class in Berlin-Neukölln mit Fokus auf Floorwork, Qualität in Transitions und Storytelling.',
                content: [
                    'Das Contemporary Lab ist ein 75-Minuten-Format für Tänzer:innen, die ihre Bewegungsqualität vertiefen wollen.',
                    'Wir arbeiten mit klaren Task-Phasen: Technik, Improvisation und Performance-Run.',
                    'Die Session endet mit Video-Feedback, damit du deinen Fortschritt direkt siehst.',
                ],
            },
            en: {
                title: 'Contemporary lab on April 2 in Neukölln',
                excerpt:
                    'New open class in Berlin Neukölln focused on floorwork, transition quality and storytelling.',
                content: [
                    'The Contemporary Lab is a 75-minute format for dancers who want to deepen movement quality.',
                    'We work through clear phases: technique, improvisation and performance run.',
                    'The session closes with video feedback so you can immediately see your progress.',
                ],
            },
            postType: 'class' as const,
            categoryIDs: [classesCategoryID],
            metaDE: {
                title: 'Contemporary Lab Neukölln 02. April | Deleyna',
                description: 'Open Class in Berlin-Neukölln: Floorwork, Transitions und Storytelling in 75 Minuten.',
            },
            metaEN: {
                title: 'Contemporary Lab Neukölln April 2 | Deleyna',
                description: 'Open class in Berlin Neukölln: floorwork, transition quality and storytelling in 75 minutes.',
            },
            classDetailsDE: {
                classDate: '2026-04-02T18:30:00.000Z',
                classEndDate: '2026-04-02T19:45:00.000Z',
                studioName: 'Studio 27 Neukölln',
                studioCity: 'Berlin',
                studioAddress: 'Weserstraße 27, 12047 Berlin',
                danceStyle: 'Contemporary',
                level: 'intermediate' as const,
                duration: '75 Minuten',
                priceInfo: '22€ Drop-In',
                maxParticipants: 20,
                bookingUrl: 'https://example.com/booking/contemporary-lab',
                instructorTalents: instructorIDs,
            },
            classDetailsEN: {
                classDate: '2026-04-02T18:30:00.000Z',
                classEndDate: '2026-04-02T19:45:00.000Z',
                studioName: 'Studio 27 Neukölln',
                studioCity: 'Berlin',
                studioAddress: 'Weserstraße 27, 12047 Berlin',
                danceStyle: 'Contemporary',
                level: 'intermediate' as const,
                duration: '75 minutes',
                priceInfo: '€22 drop-in',
                maxParticipants: 20,
                bookingUrl: 'https://example.com/booking/contemporary-lab',
                instructorTalents: instructorIDs,
            },
        },
        {
            slug: 'new-studio-partnership-in-berlin-west',
            de: {
                title: 'Neue Studio-Partnerschaft in Berlin-West',
                excerpt:
                    'Deleyna startet eine neue Zusammenarbeit mit einem Berliner Studio für regelmäßige Class Nights und Talent Sessions.',
                content: [
                    'Ab April erweitern wir unser Wochenprogramm um kuratierte Class Nights in Berlin-West.',
                    'Das neue Setup verbindet offene Community-Klassen mit professionellen Talent-Sessions.',
                    'Damit schaffen wir mehr Sichtbarkeit für unser Roster und mehr Zugang für neue Tänzer:innen.',
                ],
            },
            en: {
                title: 'New studio partnership in Berlin West',
                excerpt:
                    'Deleyna launches a new collaboration with a Berlin studio for recurring class nights and talent sessions.',
                content: [
                    'Starting in April, we expand our weekly program with curated class nights in Berlin West.',
                    'The new setup combines open community classes with professional talent sessions.',
                    'This gives our roster more visibility and opens up access for new dancers.',
                ],
            },
            postType: 'news' as const,
            categoryIDs: [newsCategoryID],
            metaDE: {
                title: 'Neue Studio-Partnerschaft Berlin-West | Deleyna News',
                description: 'Deleyna startet regelmäßige Class Nights und Talent Sessions in einem neuen Berliner Partner-Studio.',
            },
            metaEN: {
                title: 'New Studio Partnership Berlin West | Deleyna News',
                description: 'Deleyna launches recurring class nights and talent sessions at a new Berlin partner studio.',
            },
        },
        {
            slug: 'commercial-intensive-berlin-april-18-2026',
            de: {
                title: 'Commercial Intensive am 18. April in Berlin',
                excerpt:
                    'Ein halbtägiges Intensiv-Format für Camera Performance, Energiewechsel und schnelle Pickups.',
                content: [
                    'Das Intensive richtet sich an Tänzer:innen, die in Commercial-Projekten arbeiten oder dort einsteigen wollen.',
                    'Trainiert werden dynamische Richtungswechsel, saubere Formationen und Camera Awareness.',
                    'Zum Abschluss gibt es ein kurzes Mock-Casting, um die Live-Situation realistisch zu simulieren.',
                ],
            },
            en: {
                title: 'Commercial intensive on April 18 in Berlin',
                excerpt:
                    'A half-day intensive format for camera performance, energy shifts and fast pickups.',
                content: [
                    'The intensive is for dancers working in commercial projects or preparing to enter that space.',
                    'We train dynamic directional changes, clean formations and camera awareness.',
                    'The session ends with a short mock casting to simulate the real environment.',
                ],
            },
            postType: 'class' as const,
            categoryIDs: [classesCategoryID, insightsCategoryID],
            metaDE: {
                title: 'Commercial Intensive 18. April Berlin | Deleyna',
                description: 'Halbtägiges Intensiv-Format für Camera Performance, Energiewechsel und schnelle Pickups.',
            },
            metaEN: {
                title: 'Commercial Intensive April 18 Berlin | Deleyna',
                description: 'Half-day intensive for camera performance, energy shifts and fast pickups.',
            },
            classDetailsDE: {
                classDate: '2026-04-18T11:00:00.000Z',
                classEndDate: '2026-04-18T15:00:00.000Z',
                studioName: 'The Yard Berlin',
                studioCity: 'Berlin',
                studioAddress: 'Müllenhoffstraße 17, 10967 Berlin',
                danceStyle: 'Commercial',
                level: 'advanced' as const,
                duration: '4 Stunden',
                priceInfo: '79€ Intensive',
                maxParticipants: 30,
                bookingUrl: 'https://example.com/booking/commercial-intensive',
                instructorTalents: instructorIDs,
            },
            classDetailsEN: {
                classDate: '2026-04-18T11:00:00.000Z',
                classEndDate: '2026-04-18T15:00:00.000Z',
                studioName: 'The Yard Berlin',
                studioCity: 'Berlin',
                studioAddress: 'Müllenhoffstraße 17, 10967 Berlin',
                danceStyle: 'Commercial',
                level: 'advanced' as const,
                duration: '4 hours',
                priceInfo: '€79 intensive',
                maxParticipants: 30,
                bookingUrl: 'https://example.com/booking/commercial-intensive',
                instructorTalents: instructorIDs,
            },
        },
        {
            slug: 'q2-roster-updates-and-new-talents',
            de: {
                title: 'Q2 Roster Update: Neue Talente im Agency Lineup',
                excerpt:
                    'Im zweiten Quartal erweitern wir unser Roster um neue Gesichter aus Dance und Model.',
                content: [
                    'Unser Q2 Update bringt neue Talente mit starken Performance- und Editorial-Profilen.',
                    'Der Fokus liegt auf Vielseitigkeit: Stage, Camera, Event und Kampagne.',
                    'In den kommenden Wochen folgen individuelle Spotlights und Class-Termine mit den neuen Artists.',
                ],
            },
            en: {
                title: 'Q2 roster update: new talents in the agency lineup',
                excerpt: 'In Q2 we are expanding the roster with new faces from dance and model.',
                content: [
                    'Our Q2 update introduces new talents with strong performance and editorial profiles.',
                    'The focus is versatility: stage, camera, event and campaign.',
                    'Over the coming weeks, individual spotlights and class dates with the new artists will follow.',
                ],
            },
            postType: 'news' as const,
            categoryIDs: [newsCategoryID, insightsCategoryID],
            metaDE: {
                title: 'Q2 Roster Update: Neue Talente | Deleyna News',
                description: 'Neue Talente mit starken Performance- und Editorial-Profilen erweitern das Deleyna Roster in Q2.',
            },
            metaEN: {
                title: 'Q2 Roster Update: New Talents | Deleyna News',
                description: 'New talents with strong performance and editorial profiles join the Deleyna roster in Q2.',
            },
        },
    ]

    let created = 0
    let updated = 0

    for (const [index, entry] of posts.entries()) {
        const existing = await payload.find({
            collection: 'posts',
            where: { slug: { equals: entry.slug } },
            limit: 1,
            depth: 0,
        })

        const featuredImage = pickMedia(index * 2)
        const galleryMedia = [
            pickMedia(index * 2 + 1),
            pickMedia(index * 2 + 2),
            pickMedia(index * 2 + 3),
        ].filter((id): id is number => typeof id === 'number')

        const baseContentDE: any[] = [
            {
                blockType: 'content' as const,
                layout: 'narrow' as const,
                backgroundColor: 'white' as const,
                content: lexicalRoot(entry.de.content),
            },
            ...(galleryMedia.length > 0
                ? [
                      {
                          blockType: 'gallery' as const,
                          variant: 'lightbox' as const,
                          columns: '3' as const,
                          images: galleryMedia.map((id, galleryIndex) => ({
                              image: id,
                              caption: `Editorial ${galleryIndex + 1}`,
                          })),
                      },
                  ]
                : []),
        ]

        const baseContentEN: any[] = [
            {
                blockType: 'content' as const,
                layout: 'narrow' as const,
                backgroundColor: 'white' as const,
                content: lexicalRoot(entry.en.content),
            },
            ...(galleryMedia.length > 0
                ? [
                      {
                          blockType: 'gallery' as const,
                          variant: 'lightbox' as const,
                          columns: '3' as const,
                          images: galleryMedia.map((id, galleryIndex) => ({
                              image: id,
                              caption: `Editorial ${galleryIndex + 1}`,
                          })),
                      },
                  ]
                : []),
        ]

        if (existing.docs.length > 0) {
            const docId = existing.docs[0].id

            await payload.update({
                collection: 'posts',
                id: docId,
                locale: 'de',
                data: {
                    title: entry.de.title,
                    slug: entry.slug,
                    excerpt: entry.de.excerpt,
                    featuredImage,
                    postType: entry.postType,
                    categories: entry.categoryIDs,
                    author: author.id,
                    classDetails: entry.postType === 'class' ? entry.classDetailsDE : undefined,
                    content: baseContentDE,
                    _status: 'published',
                    publishedAt: new Date().toISOString(),
                    ...(entry.metaDE ? { pageSettings: { metaTitle: entry.metaDE.title, metaDescription: entry.metaDE.description } } : {}),
                },
                context: { disableRevalidate: true },
            })

            await payload.update({
                collection: 'posts',
                id: docId,
                locale: 'en',
                data: {
                    title: entry.en.title,
                    excerpt: entry.en.excerpt,
                    featuredImage,
                    postType: entry.postType,
                    classDetails: entry.postType === 'class' ? entry.classDetailsEN : undefined,
                    content: baseContentEN,
                    ...(entry.metaEN ? { pageSettings: { metaTitle: entry.metaEN.title, metaDescription: entry.metaEN.description } } : {}),
                },
                context: { disableRevalidate: true },
            })

            updated++
            console.log(`  🔄 Updated post: ${entry.slug}`)
            continue
        }

        const deCreated = await payload.create({
            collection: 'posts',
            locale: 'de',
            data: {
                title: entry.de.title,
                slug: entry.slug,
                excerpt: entry.de.excerpt,
                featuredImage,
                postType: entry.postType,
                categories: entry.categoryIDs,
                author: author.id,
                classDetails: entry.postType === 'class' ? entry.classDetailsDE : undefined,
                content: baseContentDE,
                _status: 'published',
                publishedAt: new Date().toISOString(),
                ...(entry.metaDE ? { pageSettings: { metaTitle: entry.metaDE.title, metaDescription: entry.metaDE.description } } : {}),
            },
            context: { disableRevalidate: true },
        })

        await payload.update({
            collection: 'posts',
            id: deCreated.id,
            locale: 'en',
            data: {
                title: entry.en.title,
                excerpt: entry.en.excerpt,
                featuredImage,
                postType: entry.postType,
                classDetails: entry.postType === 'class' ? entry.classDetailsEN : undefined,
                content: baseContentEN,
                ...(entry.metaEN ? { pageSettings: { metaTitle: entry.metaEN.title, metaDescription: entry.metaEN.description } } : {}),
            },
            context: { disableRevalidate: true },
        })

        created++
        console.log(`  ✅ Created post: ${entry.slug}`)
    }

    return { created, updated, skipped: 0, total: posts.length }
}
