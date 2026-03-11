import type { Payload } from 'payload'

/** Skill definitions to seed into talent-skills collection (DE + EN) */
const skillDefinitions = [
    { titleDE: 'Contemporary', titleEN: 'Contemporary', slug: 'contemporary', skillGroup: 'dance' as const },
    { titleDE: 'Hip-Hop', titleEN: 'Hip-Hop', slug: 'hip-hop', skillGroup: 'dance' as const },
    { titleDE: 'Ballett', titleEN: 'Ballet', slug: 'ballet', skillGroup: 'dance' as const },
    { titleDE: 'Commercial', titleEN: 'Commercial', slug: 'commercial', skillGroup: 'other' as const },
    { titleDE: 'Editorial', titleEN: 'Editorial', slug: 'editorial', skillGroup: 'modeling' as const },
    { titleDE: 'Laufsteg', titleEN: 'Runway', slug: 'runway', skillGroup: 'modeling' as const },
    { titleDE: 'Fitness', titleEN: 'Fitness', slug: 'fitness', skillGroup: 'fitness' as const },
    { titleDE: 'High Fashion', titleEN: 'High Fashion', slug: 'high-fashion', skillGroup: 'modeling' as const },
    { titleDE: 'Beauty', titleEN: 'Beauty', slug: 'beauty', skillGroup: 'modeling' as const },
    { titleDE: 'E-Commerce', titleEN: 'E-Commerce', slug: 'e-commerce', skillGroup: 'modeling' as const },
    { titleDE: 'Zeitgenössischer Tanz', titleEN: 'Contemporary Dance', slug: 'contemporary-dance', skillGroup: 'dance' as const },
    { titleDE: 'Musikvideos', titleEN: 'Music Videos', slug: 'music-videos', skillGroup: 'other' as const },
    { titleDE: 'Performance Kunst', titleEN: 'Performance Art', slug: 'performance-art', skillGroup: 'other' as const },
    { titleDE: 'Pole Dance', titleEN: 'Pole Dance', slug: 'pole-dance', skillGroup: 'dance' as const },
    { titleDE: 'Vogueing', titleEN: 'Vogueing', slug: 'vogueing', skillGroup: 'dance' as const },
    { titleDE: 'Waacking', titleEN: 'Waacking', slug: 'waacking', skillGroup: 'dance' as const },
    { titleDE: 'Jazz Funk', titleEN: 'Jazz Funk', slug: 'jazz-funk', skillGroup: 'dance' as const },
    { titleDE: 'Afro Dance', titleEN: 'Afro Dance', slug: 'afro-dance', skillGroup: 'dance' as const },
    { titleDE: 'Katalog', titleEN: 'Catalog', slug: 'catalog', skillGroup: 'modeling' as const },
    { titleDE: 'Bademode', titleEN: 'Swimwear', slug: 'swimwear', skillGroup: 'modeling' as const },
]

const talents = [
    {
        name: 'Maya Chen',
        slug: 'maya-chen',
        category: 'dancer' as const,
        bio: {
            de: 'Maya ist eine vielseitige Tänzerin mit über 8 Jahren Erfahrung in Contemporary und Hip-Hop. Sie hat auf Bühnen in ganz Europa performt und mit Top-Modemarken für deren Kampagnen-Choreografien zusammengearbeitet.',
            en: 'Maya is a versatile dancer with over 8 years of experience in contemporary and hip-hop styles. She has performed on stages across Europe and collaborated with top fashion brands for their campaign choreography.',
        },
        featured: true,
        isCoach: true,
        coachingDescription: {
            de: 'Private Coaching-Sessions in Contemporary & Hip-Hop. Von Grundlagen bis Choreografie — individuell auf dein Level abgestimmt.',
            en: 'Private coaching sessions in Contemporary & Hip-Hop. From basics to choreography — tailored to your level.',
        },
        sortOrder: 1,
        measurements: {
            height: '170 cm',
            bust: '84 cm',
            waist: '62 cm',
            hips: '89 cm',
            shoeSize: '38 EU',
            hair: ['black'],
            eyes: ['brown'],
        },
        skillSlugs: ['contemporary', 'hip-hop', 'ballet', 'commercial'],
        languages: ['en', 'mandarin', 'de'],
        experience: [
            { title: 'Berlin Fashion Week 2024', year: '2024' },
            { title: 'Nike "Move" Campaign', year: '2024' },
            { title: 'Adidas Originals', year: '2023' },
            { title: 'Contemporary Dance Berlin', year: '2023' },
        ],
        socialMedia: {
            instagram: '@mayachen.dance',
        },
        bookingEmail: 'maya@deleyna.com',
    },
    {
        name: 'Marcus Rivera',
        slug: 'marcus-rivera',
        category: 'model' as const,
        bio: {
            de: 'Marcus bringt Intensität und Emotion in jedes Shooting. Mit einem Hintergrund im Theater überzeugt er in Editorial- und Commercial-Modeling und erweckt Charaktere durch seine ausdrucksstarken Posen zum Leben.',
            en: 'Marcus brings intensity and emotion to every shoot. With a background in theater, he excels at editorial and commercial modeling, bringing characters to life through his expressive poses.',
        },
        featured: true,
        sortOrder: 2,
        measurements: {
            height: '188 cm',
            bust: '102 cm',
            waist: '81 cm',
            hips: '97 cm',
            shoeSize: '44 EU',
            hair: ['brown'],
            eyes: ['brown'],
        },
        skillSlugs: ['editorial', 'commercial', 'runway', 'fitness'],
        languages: ['en', 'es'],
        experience: [
            { title: 'GQ Magazine', year: '2024' },
            { title: 'Hugo Boss Campaign', year: '2024' },
            { title: 'Milan Fashion Week', year: '2023' },
        ],
        socialMedia: {
            instagram: '@marcusrivera',
        },
        bookingEmail: 'marcus@deleyna.com',
    },
    {
        name: 'Yuki Tanaka',
        slug: 'yuki-tanaka',
        category: 'model' as const,
        bio: {
            de: 'Yuki ist bekannt für ihre ätherische Schönheit und Vielseitigkeit. Von High-Fashion-Editorials bis zu Beauty-Kampagnen bringt sie eine einzigartige Eleganz mit, die weltweit begeistert.',
            en: 'Yuki is known for her ethereal beauty and versatility. From high fashion editorials to beauty campaigns, she brings a unique elegance that captivates audiences worldwide.',
        },
        featured: true,
        sortOrder: 3,
        measurements: {
            height: '175 cm',
            bust: '82 cm',
            waist: '60 cm',
            hips: '88 cm',
            shoeSize: '39 EU',
            hair: ['black'],
            eyes: ['brown'],
        },
        skillSlugs: ['high-fashion', 'beauty', 'commercial', 'e-commerce'],
        languages: ['ja', 'en', 'fr'],
        experience: [
            { title: 'Vogue Japan', year: '2024' },
            { title: 'Shiseido Beauty Campaign', year: '2024' },
            { title: 'Paris Fashion Week', year: '2023' },
            { title: 'Tokyo Girls Collection', year: '2023' },
        ],
        socialMedia: {
            instagram: '@yukitanaka.model',
        },
        bookingEmail: 'yuki@deleyna.com',
    },
    {
        name: 'Elena Voss',
        slug: 'elena-voss',
        category: 'both' as const,
        bio: {
            de: 'Elena verbindet nahtlos ihre Modeling- und Tanz-Hintergründe und schafft dynamische Performances, die die Grenze zwischen Mode und Kunst verwischen. Ihr einzigartiges Skillset macht sie perfekt für kreative Kampagnen.',
            en: 'Elena seamlessly combines her modeling and dance backgrounds, creating dynamic performances that blur the line between fashion and art. Her unique skillset makes her perfect for creative campaigns.',
        },
        featured: true,
        isCoach: true,
        coachingDescription: {
            de: 'Coaching für Tanz & Modeling-Posing. Perfekt für Performer, die beide Welten verbinden möchten — Bühne, Kamera, Laufsteg.',
            en: 'Coaching for dance & modeling posing. Perfect for performers who want to combine both worlds — stage, camera, runway.',
        },
        sortOrder: 4,
        measurements: {
            height: '178 cm',
            bust: '86 cm',
            waist: '64 cm',
            hips: '91 cm',
            shoeSize: '40 EU',
            hair: ['blonde'],
            eyes: ['blue'],
        },
        skillSlugs: [
            'contemporary-dance',
            'high-fashion',
            'commercial',
            'music-videos',
            'performance-art',
        ],
        languages: ['de', 'en', 'ru'],
        experience: [
            { title: 'Beyoncé World Tour', year: '2024' },
            { title: 'Dior Campaign', year: '2024' },
            { title: 'Berlin State Ballet', year: '2023' },
            { title: 'Elle Magazine Cover', year: '2023' },
        ],
        socialMedia: {
            instagram: '@elenavoss',
        },
        bookingEmail: 'elena@deleyna.com',
    },
    {
        name: 'Aisha Johnson',
        slug: 'aisha-johnson',
        category: 'dancer' as const,
        bio: {
            de: 'Aisha ist eine kraftvolle Tänzerin aus London, spezialisiert auf Hip-Hop, Vogueing und Afro Dance. Bekannt für ihre scharfe Ausführung und magnetische Bühnenpräsenz hat sie mit großen Künstlern und Marken in ganz Europa gearbeitet.',
            en: 'Aisha is a powerhouse dancer from London, specializing in Hip-Hop, Vogueing and Afro Dance. Known for her sharp execution and magnetic stage presence, she has worked with major artists and brands across Europe.',
        },
        featured: true,
        isCoach: true,
        coachingDescription: {
            de: 'Privat-Coaching in Hip-Hop, Vogueing & Afro Dance. Fokus auf Technik, Musikalität und Bühnenpräsenz.',
            en: 'Private coaching in Hip-Hop, Vogueing & Afro Dance. Focus on technique, musicality and stage presence.',
        },
        sortOrder: 5,
        measurements: {
            height: '168 cm',
            bust: '85 cm',
            waist: '63 cm',
            hips: '92 cm',
            shoeSize: '38 EU',
            hair: ['black'],
            eyes: ['brown'],
        },
        skillSlugs: ['hip-hop', 'vogueing', 'afro-dance', 'commercial', 'music-videos'],
        languages: ['en', 'fr'],
        experience: [
            { title: 'Rihanna Savage X Fenty Show', year: '2025' },
            { title: 'Nike "Own the Floor" Campaign', year: '2024' },
            { title: 'Wireless Festival London', year: '2024' },
            { title: 'Vogue Ball Berlin', year: '2023' },
        ],
        socialMedia: {
            instagram: '@aishaj.dance',
        },
        bookingEmail: 'aisha@deleyna.com',
    },
    {
        name: 'Luca Moretti',
        slug: 'luca-moretti',
        category: 'model' as const,
        bio: {
            de: 'Luca bringt mühelose Eleganz auf den Laufsteg und in Editorial-Arbeiten. In Mailand geboren, in Berlin aufgewachsen – seine europäische Vielseitigkeit und markante Präsenz machen ihn zum Favoriten für Luxus- und Streetwear-Kampagnen.',
            en: 'Luca brings effortless elegance to the runway and editorial work. Born in Milan, raised in Berlin, his European versatility and striking presence have made him a favorite for luxury and streetwear campaigns alike.',
        },
        featured: false,
        sortOrder: 6,
        measurements: {
            height: '191 cm',
            bust: '100 cm',
            waist: '79 cm',
            hips: '95 cm',
            shoeSize: '45 EU',
            hair: ['brown'],
            eyes: ['green'],
        },
        skillSlugs: ['runway', 'editorial', 'high-fashion', 'catalog', 'e-commerce'],
        languages: ['it', 'de', 'en'],
        experience: [
            { title: 'Prada Menswear Campaign', year: '2025' },
            { title: 'Berlin Fashion Week', year: '2024' },
            { title: 'Zalando Editorial', year: '2024' },
            { title: 'GQ Italia Feature', year: '2023' },
        ],
        socialMedia: {
            instagram: '@lucamoretti.model',
        },
        bookingEmail: 'luca@deleyna.com',
    },
    {
        name: 'Sofia Petrov',
        slug: 'sofia-petrov',
        category: 'both' as const,
        bio: {
            de: 'Sofia vereint klassische Ballettausbildung mit High-Fashion-Sensibilität. Ihre anmutige Bewegung und fotogene Schönheit machen sie ideal für Editorial-Kampagnen, die sowohl Kunstfertigkeit als auch Eleganz verlangen.',
            en: 'Sofia merges classical ballet training with high fashion sensibility. Her graceful movement and photogenic beauty make her ideal for editorial campaigns that demand both artistry and elegance.',
        },
        featured: true,
        sortOrder: 7,
        measurements: {
            height: '174 cm',
            bust: '83 cm',
            waist: '59 cm',
            hips: '87 cm',
            shoeSize: '38 EU',
            hair: ['blonde'],
            eyes: ['blue'],
        },
        skillSlugs: ['ballet', 'contemporary', 'beauty', 'high-fashion', 'swimwear'],
        languages: ['de', 'ru', 'en'],
        experience: [
            { title: 'Berlin State Ballet Soloist', year: '2024' },
            { title: "L'Oréal Beauty Campaign", year: '2024' },
            { title: 'Vogue Germany Editorial', year: '2023' },
            { title: 'Dior Cruise Show', year: '2023' },
        ],
        socialMedia: {
            instagram: '@sofiapetrov.art',
        },
        bookingEmail: 'sofia@deleyna.com',
    },
    {
        name: 'James Park',
        slug: 'james-park',
        category: 'dancer' as const,
        bio: {
            de: 'James ist ein Contemporary- und Jazz-Funk-Tänzer aus Seoul, der jetzt in Berlin lebt. Sein fließender Bewegungsstil und kreative Improvisation haben ihm Plätze in internationalen Produktionen und Musikvideos eingebracht.',
            en: 'James is a contemporary and jazz funk dancer from Seoul, now based in Berlin. His fluid movement style and creative improvisation have earned him spots in international productions and music videos.',
        },
        featured: false,
        sortOrder: 8,
        measurements: {
            height: '180 cm',
            bust: '96 cm',
            waist: '76 cm',
            hips: '92 cm',
            shoeSize: '42 EU',
            hair: ['black'],
            eyes: ['brown'],
        },
        skillSlugs: [
            'contemporary-dance',
            'jazz-funk',
            'waacking',
            'performance-art',
            'pole-dance',
        ],
        languages: ['ko', 'en', 'de'],
        experience: [
            { title: 'BLACKPINK World Tour (Backup Dancer)', year: '2025' },
            { title: 'Tanztheater Berlin Ensemble', year: '2024' },
            { title: 'Adidas "Impossible Is Nothing"', year: '2024' },
            { title: 'Seoul Arts Center Contemporary Showcase', year: '2023' },
        ],
        socialMedia: {
            instagram: '@jamespark.move',
        },
        bookingEmail: 'james@deleyna.com',
    },
]

function getCategoryLabel(category: 'dancer' | 'model' | 'both', locale: 'de' | 'en'): string {
    if (locale === 'de') {
        if (category === 'dancer') return 'Tänzer/in'
        if (category === 'model') return 'Model'
        return 'Tänzer/in & Model'
    }

    if (category === 'dancer') return 'Dancer'
    if (category === 'model') return 'Model'
    return 'Dancer & Model'
}

function buildTalentSeo(
    name: string,
    category: 'dancer' | 'model' | 'both',
): {
    metaTitle: { de: string; en: string }
    metaDescription: { de: string; en: string }
} {
    const deCategory = getCategoryLabel(category, 'de')
    const enCategory = getCategoryLabel(category, 'en')

    return {
        metaTitle: {
            de: `${name} | Deleyna Talent Agency`,
            en: `${name} | Deleyna Talent Agency`,
        },
        metaDescription: {
            de: `${name} ist als ${deCategory} bei Deleyna Talent Agency vertreten. Profil, Maße und Booking-Anfrage online.`,
            en: `${name} is represented as a ${enCategory} at Deleyna Talent Agency. View profile, measurements and booking request online.`,
        },
    }
}

export async function talentsSeeder(payload: Payload) {
    console.log('📦 Seeding talent skills...')

    // 1. Seed TalentSkills first
    const skillIdMap = new Map<string, number>()

    for (const skill of skillDefinitions) {
        try {
            const existing = await payload.find({
                collection: 'talent-skills',
                where: { slug: { equals: skill.slug } },
            })

            if (existing.docs.length > 0) {
                const id = existing.docs[0].id
                await payload.update({
                    collection: 'talent-skills',
                    id,
                    locale: 'de',
                    data: { title: skill.titleDE, skillGroup: skill.skillGroup },
                    context: { disableRevalidate: true },
                })
                await payload.update({
                    collection: 'talent-skills',
                    id,
                    locale: 'en',
                    data: { title: skill.titleEN },
                    context: { disableRevalidate: true },
                })
                skillIdMap.set(skill.slug, id)
                continue
            }

            const created = await payload.create({
                collection: 'talent-skills',
                locale: 'de',
                data: { title: skill.titleDE, slug: skill.slug, skillGroup: skill.skillGroup },
                context: { disableRevalidate: true },
            })
            await payload.update({
                collection: 'talent-skills',
                id: created.id,
                locale: 'en',
                data: { title: skill.titleEN },
                context: { disableRevalidate: true },
            })
            skillIdMap.set(skill.slug, created.id)
            console.log(`  ✅ Created skill: ${skill.titleDE} / ${skill.titleEN}`)
        } catch (error) {
            console.error(`  ❌ Error creating skill ${skill.titleDE}:`, error)
        }
    }

    // Resolve seeded media assets for visual-first talent cards and detail pages
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
    const cutoutSeed = await payload.find({
        collection: 'media',
        where: {
            filename: { equals: 'seed-cutout-talent-01.png' },
        },
        limit: 1,
        depth: 0,
    })
    const cutoutSeedId = cutoutSeed.docs[0]?.id

    // 2. Seed talents
    console.log('📦 Seeding talents...')

    let created = 0
    let updated = 0

    for (const [talentIndex, { skillSlugs, coachingDescription, ...talent }] of talents.entries()) {
        try {
            const existing = await payload.find({
                collection: 'talents',
                where: { slug: { equals: talent.slug } },
            })

            // Resolve skill slugs to IDs
            const skillIds = skillSlugs
                .map((slug) => skillIdMap.get(slug))
                .filter((id): id is number => id !== undefined)

            // Image assignment strategy:
            // - Each talent gets a unique featured image (cover/hero for detail page + PDF left side)
            // - Sedcard images 1-4 are DIFFERENT from featured (for the 2×2 grid on PDF right side)
            // - Gallery images are for the website detail page only
            // With 8 seed images and 8 talents, we rotate but ensure featured ≠ sedcard slots
            const totalMedia = mediaIDs.length || 8
            const featuredImage = pickMedia(talentIndex % totalMedia)
            const galleryIDs = [
                pickMedia((talentIndex + 1) % totalMedia),
                pickMedia((talentIndex + 2) % totalMedia),
                pickMedia((talentIndex + 3) % totalMedia),
            ].filter((id): id is number => typeof id === 'number')
            // Sedcard: offset by 1-4 from featured so they're always different images
            const sedcardIDs = [
                pickMedia((talentIndex + 1) % totalMedia), // Full body
                pickMedia((talentIndex + 3) % totalMedia), // Close-up
                pickMedia((talentIndex + 5) % totalMedia), // Action/Movement
                pickMedia((talentIndex + 7) % totalMedia), // Free choice
            ].filter((id): id is number => typeof id === 'number')

            const talentSeo = buildTalentSeo(talent.name, talent.category)
            const { bio, isCoach, ...talentRest } = talent
            const talentData: any = {
                ...talentRest,
                bio: bio.de,
                isCoach: isCoach || false,
                coachingDescription: coachingDescription?.de || null,
                skills: skillIds,
                seo: {
                    metaTitle: talentSeo.metaTitle.de,
                    metaDescription: talentSeo.metaDescription.de,
                },
                featuredImage,
                // One dedicated transparent cutout for slider QA (center card on home)
                cutoutImage: talentRest.slug === 'maya-chen' && cutoutSeedId ? cutoutSeedId : null,
                galleryImages: galleryIDs.map((id, index) => ({
                    image: id,
                    caption: `Redaktionell ${index + 1}`,
                })),
                sedcardImage1: sedcardIDs[0],
                sedcardImage2: sedcardIDs[1],
                sedcardImage3: sedcardIDs[2],
                sedcardImage4: sedcardIDs[3],
                _status: 'published',
            }

            // EN locale data: bio + gallery captions + SEO + coaching
            const enLocaleData: any = {
                bio: bio.en,
                ...(coachingDescription?.en ? { coachingDescription: coachingDescription.en } : {}),
                seo: {
                    metaTitle: talentSeo.metaTitle.en,
                    metaDescription: talentSeo.metaDescription.en,
                },
                galleryImages: galleryIDs.map((id, index) => ({
                    image: id,
                    caption: `Editorial ${index + 1}`,
                })),
            }

            if (existing.docs.length > 0) {
                await payload.update({
                    collection: 'talents',
                    id: existing.docs[0].id,
                    data: talentData,
                    context: {
                        disableRevalidate: true,
                    },
                })
                await payload.update({
                    collection: 'talents',
                    id: existing.docs[0].id,
                    locale: 'en',
                    data: enLocaleData,
                    context: {
                        disableRevalidate: true,
                    },
                })
                console.log(`  🔄 Updated ${talent.name}`)
                updated++
            } else {
                const createdDoc = await payload.create({
                    collection: 'talents',
                    data: talentData,
                    context: {
                        disableRevalidate: true,
                    },
                })
                await payload.update({
                    collection: 'talents',
                    id: createdDoc.id,
                    locale: 'en',
                    data: enLocaleData,
                    context: {
                        disableRevalidate: true,
                    },
                })
                console.log(`  ✅ Created ${talent.name}`)
                created++
            }
        } catch (error) {
            console.error(`  ❌ Error creating ${talent.name}:`, error)
        }
    }

    return { created, updated, skipped: 0, total: talents.length }
}
