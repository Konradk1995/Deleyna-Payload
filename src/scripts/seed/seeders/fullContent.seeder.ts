import type { Payload } from 'payload'

// ─── Lexical helpers ─────────────────────────────────────────────────────────

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

function lexicalHeading(text: string, tag: 'h2' | 'h3' | 'h4' = 'h2') {
    return {
        type: 'heading',
        version: 1,
        tag,
        children: [{ type: 'text', version: 1, text }],
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
    }
}

function lexicalRoot(nodes: ReturnType<typeof lexicalParagraph>[]) {
    return {
        root: {
            type: 'root',
            children: nodes,
            direction: 'ltr' as const,
            format: '' as const,
            indent: 0,
            version: 1,
        },
    }
}

// ─── Page builder helpers ────────────────────────────────────────────────────

async function upsertPage(
    payload: Payload,
    slug: string,
    deData: Record<string, any>,
    enData: Record<string, any>,
    extra: Record<string, any> = {},
) {
    const preparedDeData = withPageSeoDefaults(
        ensureFaqAtBottom({ ...deData, ...extra }, slug, 'de'),
        slug,
        'de',
    )
    const preparedEnData = withPageSeoDefaults(ensureFaqAtBottom(enData, slug, 'en'), slug, 'en')

    const existing = await payload.find({
        collection: 'pages',
        where: { slug: { equals: slug } },
        limit: 1,
        depth: 0,
    })

    try {
        if (existing.docs.length > 0) {
            const id = existing.docs[0].id
            await payload.update({
                collection: 'pages',
                id,
                locale: 'de',
                data: { ...preparedDeData, _status: 'published' },
                context: { disableRevalidate: true },
            })
            await payload.update({
                collection: 'pages',
                id,
                locale: 'en',
                data: { ...preparedEnData, _status: 'published' },
                context: { disableRevalidate: true },
            })
            console.log(`  🔄 Updated page: ${slug}`)
            return id
        }

        const created = await payload.create({
            collection: 'pages',
            locale: 'de',
            data: { ...preparedDeData, slug, _status: 'published' } as any,
            context: { disableRevalidate: true },
        })

        await payload.update({
            collection: 'pages',
            id: created.id,
            locale: 'en',
            data: { ...preparedEnData, _status: 'published' },
            context: { disableRevalidate: true },
        })

        console.log(`  ✅ Created page: ${slug}`)
        return created.id
    } catch (err: any) {
        console.error(`  ❌ Error with page "${slug}":`, err?.data?.errors || err.message)
        return null
    }
}

type SeedLocale = 'de' | 'en'
type PageSchemaType =
    | 'WebPage'
    | 'Article'
    | 'FAQPage'
    | 'ContactPage'
    | 'AboutPage'
    | 'CollectionPage'

const pageTopicBySlug: Record<string, { de: string; en: string }> = {
    home: { de: 'Deleyna und unser Angebot', en: 'Deleyna and our offering' },
    about: { de: 'Deleyna und unser Team', en: 'Deleyna and our team' },
    services: { de: 'unsere Services', en: 'our services' },
    'talent-werden': {
        de: 'deiner Bewerbung als Talent',
        en: 'your talent application',
    },
    contact: { de: 'der Kontaktaufnahme', en: 'getting in touch' },
    booking: { de: 'Talent-Buchungen', en: 'talent bookings' },
    education: { de: 'Education-Programmen', en: 'education programs' },
    coaching: { de: 'Personal Coaching', en: 'personal coaching' },
    privacy: { de: 'Datenschutz bei Deleyna', en: 'privacy at Deleyna' },
    imprint: { de: 'dem Impressum', en: 'the imprint' },
    agb: { de: 'den AGB', en: 'the terms & conditions' },
    faq: { de: 'allgemeinen Fragen zu Deleyna', en: 'general questions about Deleyna' },
    testimonials: { de: 'Erfahrungen mit Deleyna', en: 'experiences with Deleyna' },
}

function createDefaultFaqBlock(slug: string, locale: SeedLocale, pageTitle?: string) {
    const topic = pageTopicBySlug[slug]?.[locale] ?? (pageTitle || slug)

    if (locale === 'de') {
        return {
            blockType: 'faq' as const,
            anchorId: 'faq',
            title: `FAQ zu ${topic}`,
            description:
                'Antworten auf die wichtigsten Fragen zu Leistungen, Ablauf und nächsten Schritten.',
            layout: 'accordion',
            generateSchema: true,
            items: [
                {
                    question: `Wie läuft die Zusammenarbeit bei ${topic} ab?`,
                    answer: lexicalRoot([
                        lexicalParagraph(
                            'Nach der Anfrage melden wir uns zeitnah, klären Ziel, Budget und Timing und schlagen einen klaren Ablauf mit den passenden nächsten Schritten vor.',
                        ),
                    ]),
                },
                {
                    question: 'Wie schnell erhalte ich Rückmeldung?',
                    answer: lexicalRoot([
                        lexicalParagraph(
                            'In der Regel erhältst du innerhalb von 24 bis 48 Stunden eine erste Rückmeldung mit einer Einschätzung und dem weiteren Vorgehen.',
                        ),
                    ]),
                },
                {
                    question: 'Kann das Angebot individuell angepasst werden?',
                    answer: lexicalRoot([
                        lexicalParagraph(
                            'Ja. Umfang, Einsatzzeiten, Teamzuschnitt und Budgetrahmen werden projektspezifisch abgestimmt.',
                        ),
                    ]),
                },
            ],
        }
    }

    return {
        blockType: 'faq' as const,
        anchorId: 'faq',
        title: `FAQ about ${topic}`,
        description: 'Key answers about process, scope, timing and next steps.',
        layout: 'accordion',
        generateSchema: true,
        items: [
            {
                question: `How does collaboration for ${topic} work?`,
                answer: lexicalRoot([
                    lexicalParagraph(
                        'After your inquiry, we quickly align on goals, budget and timeline, then propose a clear process and concrete next steps.',
                    ),
                ]),
            },
            {
                question: 'How fast can I expect a response?',
                answer: lexicalRoot([
                    lexicalParagraph(
                        'You usually receive an initial response within 24 to 48 hours with an assessment and recommended next actions.',
                    ),
                ]),
            },
            {
                question: 'Can the scope be tailored to my project?',
                answer: lexicalRoot([
                    lexicalParagraph(
                        'Yes. Scope, staffing, timing and budget are always adjusted to your specific project requirements.',
                    ),
                ]),
            },
        ],
    }
}

function ensureFaqAtBottom(data: Record<string, any>, slug: string, locale: SeedLocale) {
    const layout = Array.isArray(data?.layout) ? data.layout : []
    const nonFaqBlocks: Record<string, any>[] = []
    const faqBlocks: Record<string, any>[] = []

    for (const block of layout) {
        if (block?.blockType === 'faq') {
            faqBlocks.push({
                ...block,
                anchorId: block.anchorId || 'faq',
                generateSchema: true,
            })
        } else {
            nonFaqBlocks.push(block)
        }
    }

    if (faqBlocks.length === 0) {
        faqBlocks.push(createDefaultFaqBlock(slug, locale, data?.title))
    }

    return {
        ...data,
        layout: [...nonFaqBlocks, ...faqBlocks],
    }
}

const schemaTypeBySlug: Partial<Record<string, PageSchemaType>> = {
    home: 'WebPage',
    about: 'AboutPage',
    services: 'WebPage',
    'talent-werden': 'ContactPage',
    contact: 'ContactPage',
    booking: 'ContactPage',
    education: 'CollectionPage',
    coaching: 'WebPage',
    privacy: 'WebPage',
    imprint: 'WebPage',
    agb: 'WebPage',
    faq: 'FAQPage',
    testimonials: 'WebPage',
}

const seoKeywordsBySlug: Record<
    string,
    {
        de: string[]
        en: string[]
    }
> = {
    home: {
        de: ['tänzer berlin', 'modelagentur berlin', 'talent booking', 'dance agency'],
        en: ['dancers berlin', 'model agency berlin', 'talent booking', 'dance agency'],
    },
    about: {
        de: ['agentur team', 'talent management berlin', 'über deleyna'],
        en: ['agency team', 'talent management berlin', 'about deleyna'],
    },
    services: {
        de: ['talent vermittlung', 'booking service', 'kreativ produktion'],
        en: ['talent placement', 'booking service', 'creative production'],
    },
    'talent-werden': {
        de: ['talent bewerben', 'model bewerbung', 'tänzer bewerbung'],
        en: ['become talent', 'model application', 'dancer application'],
    },
    contact: {
        de: ['kontakt agentur', 'booking anfrage', 'talent anfrage'],
        en: ['agency contact', 'booking request', 'talent inquiry'],
    },
    booking: {
        de: ['talent booking', 'künstler buchen', 'projektanfrage'],
        en: ['talent booking', 'book artists', 'project request'],
    },
    education: {
        de: ['dance classes berlin', 'education programm', 'workshops'],
        en: ['dance classes berlin', 'education program', 'workshops'],
    },
    coaching: {
        de: ['personal coaching', 'dance coaching', 'karriere coaching'],
        en: ['personal coaching', 'dance coaching', 'career coaching'],
    },
    privacy: {
        de: ['datenschutz', 'privacy policy', 'dsgvo'],
        en: ['privacy policy', 'data protection', 'gdpr'],
    },
    imprint: {
        de: ['impressum', 'anbieterkennzeichnung', 'kontaktadresse'],
        en: ['imprint', 'legal notice', 'contact address'],
    },
    agb: {
        de: ['agb', 'terms', 'buchungsbedingungen'],
        en: ['terms', 'conditions', 'booking terms'],
    },
    faq: {
        de: ['faq', 'häufige fragen', 'hilfe'],
        en: ['faq', 'frequently asked questions', 'help'],
    },
    testimonials: {
        de: ['erfahrungen', 'bewertungen', 'referenzen', 'kundenstimmen', 'testimonials'],
        en: ['experiences', 'reviews', 'references', 'client voices', 'testimonials'],
    },
}

function buildSeoKeywords(slug: string, locale: SeedLocale): string {
    const base =
        locale === 'de'
            ? ['deleyna', 'talent agency', 'berlin', 'tänzer', 'models', 'booking', 'management']
            : ['deleyna', 'talent agency', 'berlin', 'dancers', 'models', 'booking', 'management']
    const specific = seoKeywordsBySlug[slug]?.[locale] ?? []
    return Array.from(new Set([...base, ...specific])).join(', ')
}

function buildDefaultSchemaMarkup(
    schemaType: PageSchemaType,
    title: string,
    description: string,
): string {
    return JSON.stringify(
        {
            '@context': 'https://schema.org',
            '@type': schemaType,
            name: title,
            description,
        },
        null,
        2,
    )
}

function withPageSeoDefaults(data: Record<string, any>, slug: string, locale: SeedLocale) {
    const existingSettings = (data.pageSettings as Record<string, any> | undefined) ?? {}
    const title = String(existingSettings.metaTitle || data.title || 'Deleyna Talent Agency')
    const description = String(
        existingSettings.metaDescription ||
            (locale === 'de'
                ? 'Deleyna Talent Agency in Berlin für Booking, Management und Education.'
                : 'Deleyna talent agency in Berlin for booking, management and education.'),
    )
    const schemaType = (existingSettings.schemaType ||
        schemaTypeBySlug[slug] ||
        'WebPage') as PageSchemaType
    const heroMedia =
        typeof data?.hero?.media === 'number' || typeof data?.hero?.media === 'string'
            ? data.hero.media
            : undefined

    return {
        ...data,
        pageSettings: {
            ...existingSettings,
            metaTitle: title,
            metaDescription: description,
            metaKeywords: existingSettings.metaKeywords || buildSeoKeywords(slug, locale),
            ogTitle: existingSettings.ogTitle || title,
            ogDescription: existingSettings.ogDescription || description,
            ogImage: existingSettings.ogImage || heroMedia,
            schemaType,
            includeBreadcrumbs: existingSettings.includeBreadcrumbs ?? true,
            includeOrganization: existingSettings.includeOrganization ?? true,
            schemaMarkup:
                existingSettings.schemaMarkup ||
                buildDefaultSchemaMarkup(schemaType, title, description),
            priority:
                typeof existingSettings.priority === 'number'
                    ? existingSettings.priority
                    : slug === 'home'
                      ? 1
                      : 0.7,
        },
    }
}

// The link() field in StepSection has required sub-fields (reference, label).
// Even when type='custom', Payload validates required fields.
// We need to pass a valid custom link to bypass this.
const stepCta = (url: string, label: string) => ({
    type: 'custom' as const,
    url,
    label,
    newTab: false,
    reference: null,
})

// ─── MAIN SEEDER ─────────────────────────────────────────────────────────────

export async function fullContentSeeder(payload: Payload) {
    console.log('📦 Seeding full website content (DE/EN)...')
    console.log('')

    // Get contact form for form blocks
    const contactForms = await payload.find({
        collection: 'forms',
        where: { title: { equals: 'Kontakt / Allgemein' } },
        limit: 1,
        depth: 0,
    })
    const contactFormId = contactForms.docs[0]?.id

    const becomeTalentForms = await payload.find({
        collection: 'forms',
        where: { title: { equals: 'Talent werden' } },
        limit: 1,
        depth: 0,
    })
    const becomeTalentFormId = becomeTalentForms.docs[0]?.id

    const bookingForms = await payload.find({
        collection: 'forms',
        where: { title: { equals: 'Talent-Anfrage / Buchung' } },
        limit: 1,
        depth: 0,
    })
    const bookingFormId = bookingForms.docs[0]?.id

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
    const hasSeedMedia = mediaIDs.length > 0
    const pickMedia = (index: number) =>
        mediaIDs.length > 0 ? mediaIDs[index % mediaIDs.length] : undefined
    const buildGalleryItems = (indices: number[], captions: string[]) =>
        indices
            .map((index, i) => {
                const image = pickMedia(index)
                if (!image) return null
                return {
                    image,
                    caption: captions[i] ?? `Editorial ${i + 1}`,
                }
            })
            .filter((item): item is { image: number; caption: string } => Boolean(item))

    // ─────────────────────────────────────────────────────────────────────────
    // 1. HOME PAGE
    // ─────────────────────────────────────────────────────────────────────────
    console.log('  📄 Home page...')
    await upsertPage(
        payload,
        'home',
        {
            title: 'Home',
            hero: {
                type: 'highImpact',
                badge: 'Deleyna Talent Agency',
                headline: 'Wo Kunst auf Gelegenheit trifft',
                headlineHighlight: 'Gelegenheit',
                subtext: 'Elite-Vertretung für Tänzer & Models in Berlin und europaweit.',
                media: pickMedia(0),
                richText: lexicalRoot([
                    lexicalParagraph(
                        'Wir verbinden außergewöhnliche Talente mit den besten Projekten der Branche.',
                    ),
                ]),
                showScrollIndicator: true,
                backgroundStyle: 'dark',
                alignment: 'center',
                links: [
                    {
                        link: {
                            type: 'custom',
                            url: '/booking',
                            label: 'Projekt anfragen',
                            appearance: 'primary',
                        },
                    },
                    {
                        link: {
                            type: 'custom',
                            url: '/talent-werden',
                            label: 'Als Talent bewerben',
                            appearance: 'outline',
                        },
                    },
                ],
            },
            layout: [
                {
                    blockType: 'marqueeBanner',
                    text: 'DESIGNED FOR MODERN BRANDS AND TALENTS',
                    appearance: 'solid',
                    speed: 'normal',
                },
                {
                    blockType: 'logoGrid',
                    variant: 'text',
                    headline: 'Vertrauen von Brands, Produktionen und Kreativteams',
                    clients: [
                        { name: 'Campaign Teams' },
                        { name: 'Fashion Productions' },
                        { name: 'Music Video Crews' },
                        { name: 'Event Agencies' },
                        { name: 'Creative Studios' },
                    ],
                },
                // Stats block
                {
                    blockType: 'stats',
                    overline: 'Deleyna in Zahlen',
                    title: 'Seit 2020 verbinden wir',
                    titleHighlight: 'Talent mit Erfolg',
                    description:
                        'Unser Netzwerk wächst stetig – und damit auch die Möglichkeiten für unsere Talente und Kunden.',
                    stats: [
                        { value: 50, suffix: '+', label: 'Aktive Talente' },
                        { value: 200, suffix: '+', label: 'Abgeschlossene Projekte' },
                        { value: 30, suffix: '+', label: 'Partner & Kunden' },
                        { value: 5, suffix: '', label: 'Länder' },
                    ],
                },
                // Featured Talents
                {
                    blockType: 'featuredTalents',
                    overline: 'Unsere Talente',
                    title: 'Ausgewählte Persönlichkeiten',
                    layout: 'premium',
                },
                ...(hasSeedMedia && pickMedia(0)
                    ? [
                          {
                              blockType: 'mediaContent' as const,
                              layout: 'mediaRight' as const,
                              media: pickMedia(0),
                              tagline: 'Portfolio',
                              headline: 'Editorial-Ästhetik mit klarer Handschrift',
                              body: lexicalRoot([
                                  lexicalParagraph(
                                      'Wir inszenieren Talente modern, reduziert und mit einer starken visuellen Identität zwischen Fashion, Dance und Campaign Work.',
                                  ),
                              ]),
                              links: [
                                  {
                                      link: {
                                          type: 'custom',
                                          url: '/talente',
                                          label: 'Portfolio ansehen',
                                          appearance: 'primary-pill',
                                      },
                                  },
                              ],
                          },
                      ]
                    : []),
                ...(hasSeedMedia
                    ? [
                          {
                              blockType: 'masonryGrid' as const,
                              variant: 'benefits' as const,
                              badge: 'Client Flow',
                              heading: 'Von Vision zu Booking in wenigen Tagen',
                              headlineHighlight: 'Booking',
                              backgroundColor: 'white' as const,
                              highlightCard: {
                                  title: 'In 48h erste Talentauswahl',
                                  description:
                                      'Kuratierte Vorschläge mit Look, Verfügbarkeit und Einsatzkontext statt endlosen Profil-Listen.',
                                  textTone: 'light' as const,
                                  backgroundMedia: pickMedia(4),
                                  link: {
                                      type: 'custom',
                                      url: '/booking',
                                      label: 'Projekt anfragen',
                                      newTab: false,
                                  },
                              },
                              tabsCard: {
                                  textTone: 'dark' as const,
                                  backgroundMedia: pickMedia(5),
                                  tabs: [
                                      {
                                          label: 'Commercial',
                                          title: 'Commercial & Brand',
                                          description:
                                              'Besetzung für Kampagnen, Social Ads und E-Commerce-Produktionen.',
                                      },
                                      {
                                          label: 'Events',
                                          title: 'Event & Live',
                                          description:
                                              'Showacts, Performances und Live-Momente mit zuverlässigem Set-Support.',
                                      },
                                      {
                                          label: 'Editorial',
                                          title: 'Editorial & Fashion',
                                          description:
                                              'Starke Persönlichkeiten für Visual Stories, die hängen bleiben.',
                                      },
                                  ],
                              },
                              cashflowCard: {
                                  title: 'Ein Ansprechpartner. Ein sauberer Prozess.',
                                  description:
                                      'Briefing, Matching, Abstimmung und Produktion werden zentral gesteuert.',
                                  textTone: 'dark' as const,
                                  backgroundMedia: pickMedia(6),
                              },
                              videoCard: {
                                  title: 'Bildsprache zuerst',
                                  description:
                                      'Unsere Arbeit lebt von Haltung, Bewegung und Präsenz vor der Kamera.',
                                  textTone: 'light' as const,
                                  backgroundMedia: pickMedia(7),
                                  link: {
                                      type: 'custom',
                                      url: '/talents',
                                      label: 'Portfolio öffnen',
                                      newTab: false,
                                  },
                              },
                          },
                      ]
                    : []),
                {
                    blockType: 'infoCards',
                    tagline: 'Unsere Services',
                    title: 'Talent Management & Booking',
                    backgroundColor: 'muted',
                    cards: [
                        {
                            title: 'Talent Management',
                            description:
                                'Persönliche Betreuung und Karriereentwicklung für Tänzer und Models.',
                        },
                        {
                            title: 'Booking & Vermittlung',
                            description:
                                'Professionelle Vermittlung für Fotoshootings, Events, Kampagnen und Produktionen.',
                        },
                        {
                            title: 'Kundenberatung',
                            description:
                                'Wir finden die perfekten Talente für Ihr Projekt – schnell und zuverlässig.',
                        },
                        {
                            title: 'Internationales Netzwerk',
                            description:
                                'Europaweit vernetzt mit Agenturen, Produktionsfirmen und Marken.',
                        },
                    ],
                    contentBelowCards: lexicalRoot([
                        lexicalParagraph(
                            'Von Talent Management über Booking bis hin zu individuellen Coaching-Programmen begleiten wir Talente und Kunden auf jedem Schritt.',
                        ),
                    ]),
                },
                // Step section - How it works
                {
                    blockType: 'stepSection',
                    layout: 'cards',
                    cardDisplay: 'number',
                    backgroundColor: 'muted',
                    badge: 'So funktioniert es',
                    headline: 'In 3 Schritten zum Projekt',
                    headlineHighlight: 'Projekt',
                    steps: [
                        {
                            number: '01',
                            title: 'Anfrage senden',
                            description:
                                'Beschreiben Sie Ihr Projekt und Ihre Vorstellungen. Wir melden uns innerhalb von 48 Stunden.',
                        },
                        {
                            number: '02',
                            title: 'Talent-Auswahl',
                            description:
                                'Wir schlagen passende Talente vor und stimmen Details wie Verfügbarkeit und Budget ab.',
                        },
                        {
                            number: '03',
                            title: 'Projekt-Umsetzung',
                            description:
                                'Von der Planung bis zum Set – wir begleiten den gesamten Prozess professionell.',
                        },
                    ],
                    cta: stepCta('/booking', 'Jetzt Anfrage starten'),
                    ctaPosition: 'center',
                },
                // Big text
                {
                    blockType: 'bigText',
                    headingLevel: 'h2',
                    lineOne: 'Wir glauben an die Kraft',
                    lineOneHighlight: 'Kraft',
                    lineTwo: 'authentischer Persönlichkeiten.',
                    lineTwoHighlight: 'Persönlichkeiten',
                },
                // Testimonials
                {
                    blockType: 'testimonial',
                    badge: 'Was unsere Partner sagen',
                    headline: 'Stimmen aus der Branche',
                    headlineHighlight: 'Branche',
                    backgroundColor: 'muted',
                    items: [
                        {
                            quote: 'Die Talente von Deleyna haben unsere Kampagne auf ein neues Level gebracht. Professionell, kreativ und absolut zuverlässig.',
                            author: 'Sarah M.',
                            role: 'Creative Director',
                            company: 'Vogue Productions',
                            ...(pickMedia(2) ? { media: pickMedia(2) } : {}),
                        },
                        {
                            quote: 'Schnelle Kommunikation, top Talent-Auswahl und eine Agentur, die wirklich versteht, was wir brauchen.',
                            author: 'Marcus K.',
                            role: 'Head of Events',
                            company: 'Stage Berlin',
                        },
                        {
                            quote: 'Mit Deleyna arbeiten wir seit zwei Jahren zusammen — jedes Projekt wird besser als das letzte.',
                            author: 'Lisa T.',
                            role: 'Producer',
                            company: 'Motion Studio',
                            ...(pickMedia(3) ? { media: pickMedia(3) } : {}),
                        },
                    ],
                },
                // Sticky Media
                ...(hasSeedMedia && pickMedia(1)
                    ? [
                          {
                              blockType: 'stickyMedia' as const,
                              badge: 'AGENTUR',
                              headline: 'Bewegung trifft Haltung',
                              headlineHighlight: 'Haltung',
                              subtitle:
                                  'Deleyna steht für eine neue Generation von Talent-Repräsentation: persönlich, visuell und mit klarer Positionierung in der Kreativbranche.',
                              media: pickMedia(1),
                              overlayOpacity: '40',
                          },
                      ]
                    : []),
                // CTA
                {
                    blockType: 'cta',
                    variant: 'background',
                    headline: 'Werde Teil von Deleyna',
                    text: 'Du bist Tänzer*in oder Model und suchst eine Agentur, die dich wirklich versteht? Bewirb dich jetzt.',
                    button: {
                        type: 'custom',
                        url: '/talent-werden',
                        label: 'Jetzt bewerben',
                        appearance: 'primary',
                    },
                },
                ...(hasSeedMedia
                    ? [
                          {
                              blockType: 'gallery' as const,
                              variant: 'lightbox' as const,
                              columns: '3' as const,
                              images: buildGalleryItems(
                                  [1, 2, 3, 4, 5, 6],
                                  [
                                      'Backstage Vibes',
                                      'Studio Session',
                                      'Editorial Mood',
                                      'Performance Energy',
                                      'Campaign Motion',
                                      'On Set',
                                  ],
                              ),
                          },
                      ]
                    : []),
                // Slider – featured talents
                {
                    blockType: 'slider',
                    cardStyle: 'featured',
                    sourceCollection: 'talents',
                    badgeField: 'category',
                    header: {
                        eyebrow: 'Talente',
                        heading: 'Entdecke unser Roster',
                        description:
                            'Ausgewählte Persönlichkeiten aus Dance und Model für Kampagnen, Editorial und Live-Projekte.',
                    },
                    itemsLimit: 8,
                    sortBy: 'title',
                },
                // Slider – latest blog
                {
                    blockType: 'slider',
                    cardStyle: 'compact',
                    sourceCollection: 'posts',
                    badgeField: 'category',
                    header: {
                        eyebrow: 'Magazin',
                        heading: 'Neueste Beiträge',
                        description:
                            'News, Insights und Dance Class Ankündigungen aus der Deleyna-Welt.',
                    },
                    itemsLimit: 6,
                    sortBy: 'publishedAt',
                },
            ],
            pageSettings: {
                metaTitle: 'Deleyna Talent Agency – Tänzer & Models aus Berlin',
                metaDescription:
                    'Deleyna ist die Talent-Agentur für Tänzer und Models in Berlin. Booking, Management und Education für die Kreativbranche.',
            },
        },
        {
            title: 'Home',
            hero: {
                type: 'highImpact',
                badge: 'Deleyna Talent Agency',
                headline: 'Where art meets opportunity',
                headlineHighlight: 'opportunity',
                subtext: 'Elite representation for dancers & models in Berlin and across Europe.',
                media: pickMedia(0),
                richText: lexicalRoot([
                    lexicalParagraph(
                        'We connect exceptional talents with the best projects in the industry.',
                    ),
                ]),
                showScrollIndicator: true,
                backgroundStyle: 'dark',
                alignment: 'center',
                links: [
                    {
                        link: {
                            type: 'custom',
                            url: '/booking',
                            label: 'Project request',
                            appearance: 'primary',
                        },
                    },
                    {
                        link: {
                            type: 'custom',
                            url: '/become-talent',
                            label: 'Apply as talent',
                            appearance: 'outline',
                        },
                    },
                ],
            },
            layout: [
                {
                    blockType: 'marqueeBanner',
                    text: 'DESIGNED FOR MODERN BRANDS AND TALENTS',
                    appearance: 'solid',
                    speed: 'normal',
                },
                {
                    blockType: 'logoGrid',
                    variant: 'text',
                    headline: 'Trusted by brands, productions and creative teams',
                    clients: [
                        { name: 'Campaign Teams' },
                        { name: 'Fashion Productions' },
                        { name: 'Music Video Crews' },
                        { name: 'Event Agencies' },
                        { name: 'Creative Studios' },
                    ],
                },
                {
                    blockType: 'stats',
                    overline: 'Deleyna in numbers',
                    title: 'Since 2020 we connect',
                    titleHighlight: 'talent with success',
                    description:
                        'Our network keeps growing – and so do the opportunities for our talents and clients.',
                    stats: [
                        { value: 50, suffix: '+', label: 'Active talents' },
                        { value: 200, suffix: '+', label: 'Completed projects' },
                        { value: 30, suffix: '+', label: 'Partners & clients' },
                        { value: 5, suffix: '', label: 'Countries' },
                    ],
                },
                {
                    blockType: 'featuredTalents',
                    overline: 'Our talents',
                    title: 'Featured personalities',
                    layout: 'premium',
                },
                ...(hasSeedMedia && pickMedia(0)
                    ? [
                          {
                              blockType: 'mediaContent' as const,
                              layout: 'mediaRight' as const,
                              media: pickMedia(0),
                              tagline: 'Portfolio',
                              headline: 'Editorial aesthetics with a clear signature',
                              body: lexicalRoot([
                                  lexicalParagraph(
                                      'We stage talent in a modern and focused way with a strong visual identity between fashion, dance and campaign work.',
                                  ),
                              ]),
                              links: [
                                  {
                                      link: {
                                          type: 'custom',
                                          url: '/talents',
                                          label: 'View portfolio',
                                          appearance: 'primary-pill',
                                      },
                                  },
                              ],
                          },
                      ]
                    : []),
                ...(hasSeedMedia
                    ? [
                          {
                              blockType: 'masonryGrid' as const,
                              variant: 'benefits' as const,
                              badge: 'Client Flow',
                              heading: 'From vision to booking in just days',
                              headlineHighlight: 'booking',
                              backgroundColor: 'white' as const,
                              highlightCard: {
                                  title: 'First curated shortlist in 48h',
                                  description:
                                      'We deliver relevant options with look, availability and fit instead of endless profile lists.',
                                  textTone: 'light' as const,
                                  backgroundMedia: pickMedia(4),
                                  link: {
                                      type: 'custom',
                                      url: '/booking',
                                      label: 'Start request',
                                      newTab: false,
                                  },
                              },
                              tabsCard: {
                                  textTone: 'dark' as const,
                                  backgroundMedia: pickMedia(5),
                                  tabs: [
                                      {
                                          label: 'Commercial',
                                          title: 'Commercial & Brand',
                                          description:
                                              'Casting for campaigns, social ads and e-commerce productions.',
                                      },
                                      {
                                          label: 'Events',
                                          title: 'Event & Live',
                                          description:
                                              'Show acts, performances and live moments with reliable set support.',
                                      },
                                      {
                                          label: 'Editorial',
                                          title: 'Editorial & Fashion',
                                          description:
                                              'Strong personalities for visual stories with real impact.',
                                      },
                                  ],
                              },
                              cashflowCard: {
                                  title: 'One contact. One clean process.',
                                  description:
                                      'Briefing, matching, alignment and production are coordinated centrally.',
                                  textTone: 'dark' as const,
                                  backgroundMedia: pickMedia(6),
                              },
                              videoCard: {
                                  title: 'Visual language first',
                                  description:
                                      'Our work is driven by presence, movement and camera character.',
                                  textTone: 'light' as const,
                                  backgroundMedia: pickMedia(7),
                                  link: {
                                      type: 'custom',
                                      url: '/talents',
                                      label: 'Open portfolio',
                                      newTab: false,
                                  },
                              },
                          },
                      ]
                    : []),
                {
                    blockType: 'infoCards',
                    tagline: 'What we offer',
                    title: 'Talent management & booking',
                    backgroundColor: 'muted',
                    cards: [
                        {
                            title: 'Talent management',
                            description:
                                'Personal support and career development for dancers and models.',
                        },
                        {
                            title: 'Booking & placement',
                            description:
                                'Professional placement for photoshoots, events, campaigns and productions.',
                        },
                        {
                            title: 'Client advisory',
                            description:
                                'We find the right talents for your project quickly and reliably.',
                        },
                        {
                            title: 'International network',
                            description:
                                'Connected across Europe with agencies, production companies and brands.',
                        },
                    ],
                    contentBelowCards: lexicalRoot([
                        lexicalParagraph(
                            'From talent management to booking and individual coaching programs, we support talents and clients at every stage.',
                        ),
                    ]),
                },
                {
                    blockType: 'stepSection',
                    layout: 'cards',
                    cardDisplay: 'number',
                    backgroundColor: 'muted',
                    badge: 'How it works',
                    headline: 'Your project in 3 steps',
                    headlineHighlight: 'steps',
                    steps: [
                        {
                            number: '01',
                            title: 'Send a request',
                            description:
                                'Describe your project and vision. We get back to you within 48 hours.',
                        },
                        {
                            number: '02',
                            title: 'Talent selection',
                            description:
                                'We suggest matching talents and align details like availability and budget.',
                        },
                        {
                            number: '03',
                            title: 'Project execution',
                            description:
                                'From planning to set – we accompany the entire process professionally.',
                        },
                    ],
                    cta: stepCta('/booking', 'Start your request'),
                    ctaPosition: 'center',
                },
                {
                    blockType: 'bigText',
                    headingLevel: 'h2',
                    lineOne: 'We believe in the power',
                    lineOneHighlight: 'power',
                    lineTwo: 'of authentic personalities.',
                    lineTwoHighlight: 'personalities',
                },
                // Testimonials
                {
                    blockType: 'testimonial',
                    badge: 'What our partners say',
                    headline: 'Industry voices',
                    headlineHighlight: 'voices',
                    backgroundColor: 'muted',
                    items: [
                        {
                            quote: "Deleyna's talents took our campaign to the next level. Professional, creative and absolutely reliable.",
                            author: 'Sarah M.',
                            role: 'Creative Director',
                            company: 'Vogue Productions',
                            ...(pickMedia(2) ? { media: pickMedia(2) } : {}),
                        },
                        {
                            quote: 'Fast communication, excellent talent curation and an agency that truly understands what we need.',
                            author: 'Marcus K.',
                            role: 'Head of Events',
                            company: 'Stage Berlin',
                        },
                        {
                            quote: "We've been working with Deleyna for two years — every project gets better than the last.",
                            author: 'Lisa T.',
                            role: 'Producer',
                            company: 'Motion Studio',
                            ...(pickMedia(3) ? { media: pickMedia(3) } : {}),
                        },
                    ],
                },
                // Sticky Media
                ...(hasSeedMedia && pickMedia(1)
                    ? [
                          {
                              blockType: 'stickyMedia' as const,
                              badge: 'AGENCY',
                              headline: 'Movement meets attitude',
                              headlineHighlight: 'attitude',
                              subtitle:
                                  'Deleyna stands for a new generation of talent representation: personal, visual and with clear positioning in the creative industry.',
                              media: pickMedia(1),
                              overlayOpacity: '40',
                          },
                      ]
                    : []),
                {
                    blockType: 'cta',
                    variant: 'background',
                    headline: 'Become part of Deleyna',
                    text: 'You are a dancer or model looking for an agency that truly understands you? Apply now.',
                    button: {
                        type: 'custom',
                        url: '/become-talent',
                        label: 'Apply now',
                        appearance: 'primary',
                    },
                },
                ...(hasSeedMedia
                    ? [
                          {
                              blockType: 'gallery' as const,
                              variant: 'lightbox' as const,
                              columns: '3' as const,
                              images: buildGalleryItems(
                                  [1, 2, 3, 4, 5, 6],
                                  [
                                      'Backstage vibes',
                                      'Studio session',
                                      'Editorial mood',
                                      'Performance energy',
                                      'Campaign motion',
                                      'On set',
                                  ],
                              ),
                          },
                      ]
                    : []),
                {
                    blockType: 'slider',
                    cardStyle: 'featured',
                    sourceCollection: 'talents',
                    badgeField: 'category',
                    header: {
                        eyebrow: 'Talents',
                        heading: 'Explore our roster',
                        description:
                            'Featured personalities from dance and model for campaigns, editorial work and live projects.',
                    },
                    itemsLimit: 8,
                    sortBy: 'title',
                },
                {
                    blockType: 'slider',
                    cardStyle: 'compact',
                    sourceCollection: 'posts',
                    badgeField: 'category',
                    header: {
                        eyebrow: 'Magazine',
                        heading: 'Latest posts',
                        description:
                            'News, insights and dance class announcements from the Deleyna world.',
                    },
                    itemsLimit: 6,
                    sortBy: 'publishedAt',
                },
            ],
            pageSettings: {
                metaTitle: 'Deleyna Talent Agency – Dancers & Models from Berlin',
                metaDescription:
                    'Deleyna is the talent agency for dancers and models in Berlin. Booking, management and education for the creative industry.',
            },
        },
    )

    // ─────────────────────────────────────────────────────────────────────────
    // 2. ABOUT PAGE
    // ─────────────────────────────────────────────────────────────────────────
    console.log('  📄 About page...')
    await upsertPage(
        payload,
        'about',
        {
            title: 'Über uns',
            hero: {
                type: 'highImpact',
                badge: 'Über Deleyna',
                headline: 'Mehr als eine Agentur',
                headlineHighlight: 'Agentur',
                subtext: 'Wir sind eine Gemeinschaft von Künstlern, die gemeinsam wachsen.',
                media: pickMedia(7),
                backgroundStyle: 'dark',
                showScrollIndicator: true,
            },
            layout: [
                {
                    blockType: 'content',
                    layout: 'narrow',
                    backgroundColor: 'white',
                    content: lexicalRoot([
                        lexicalHeading('Unsere Geschichte'),
                        lexicalParagraph(
                            'Deleyna wurde 2020 in Berlin gegründet mit einer klaren Vision: eine Agentur zu schaffen, die Talente nicht nur vermittelt, sondern aktiv fördert und begleitet.',
                        ),
                        lexicalParagraph(
                            'Was als kleines Netzwerk von Tänzern begann, ist heute eine etablierte Talent-Agentur mit über 50 Künstlern aus ganz Europa.',
                        ),
                        lexicalHeading('Unsere Philosophie', 'h3'),
                        lexicalParagraph(
                            'Wir glauben daran, dass jedes Talent einzigartig ist. Deshalb setzen wir auf individuelle Betreuung, persönliche Entwicklungspläne und ein starkes Netzwerk, das Türen öffnet.',
                        ),
                        lexicalParagraph(
                            'Bei Deleyna steht die Persönlichkeit im Mittelpunkt – nicht nur die Performance. Wir suchen Menschen mit Charakter, Leidenschaft und dem Willen, zu wachsen.',
                        ),
                    ]),
                },
                ...(hasSeedMedia && pickMedia(7)
                    ? [
                          {
                              blockType: 'mediaContent' as const,
                              layout: 'mediaLeft' as const,
                              media: pickMedia(7),
                              tagline: 'Studio',
                              headline: 'Kreative Entwicklung mit klarem Fokus',
                              body: lexicalRoot([
                                  lexicalParagraph(
                                      'Unsere Arbeit verbindet Artist Development, visuelle Qualität und starke Positionierung für langfristige Karrierewege.',
                                  ),
                              ]),
                          },
                      ]
                    : []),
                {
                    blockType: 'stats',
                    overline: 'Deleyna in Zahlen',
                    title: 'Unsere Ergebnisse',
                    titleHighlight: 'sprechen',
                    description:
                        'Seit unserer Gründung haben wir kontinuierlich Talente mit erstklassigen Projekten verbunden.',
                    stats: [
                        { value: 50, suffix: '+', label: 'Talente im Roster' },
                        { value: 200, suffix: '+', label: 'Projekte umgesetzt' },
                        { value: 98, suffix: '%', label: 'Kundenzufriedenheit' },
                        { value: 2020, suffix: '', label: 'Gegründet' },
                    ],
                },
                {
                    blockType: 'team',
                    overline: 'Das Team',
                    title: 'Die Menschen hinter Deleyna',
                    members: [
                        {
                            name: 'Leyna Müller',
                            role: 'Gründerin & CEO',
                            image: pickMedia(0),
                            bio: 'Ehemalige professionelle Tänzerin mit über 15 Jahren Erfahrung in der Entertainment-Branche. Leyna gründete Deleyna mit der Vision, Talente ganzheitlich zu fördern.',
                        },
                        {
                            name: 'David Okafor',
                            role: 'Head of Booking',
                            image: pickMedia(1),
                            bio: 'Mit seinem Netzwerk in der europäischen Werbe- und Modebranche sorgt David dafür, dass unsere Talente die besten Projekte bekommen.',
                        },
                        {
                            name: 'Sarah Kim',
                            role: 'Talent Development',
                            image: pickMedia(2),
                            bio: 'Sarah unterstützt unsere Talente bei ihrer Weiterentwicklung – von Sedcard-Shootings bis zu Casting-Vorbereitung.',
                        },
                    ],
                },
                // Sticky Media - Studio vibes
                ...(hasSeedMedia && pickMedia(4)
                    ? [
                          {
                              blockType: 'stickyMedia' as const,
                              badge: 'STUDIO',
                              headline: 'Wo Kreativität zu Hause ist',
                              headlineHighlight: 'Kreativität',
                              subtitle:
                                  'Unser Studio in Berlin ist der Ort, an dem Ideen Gestalt annehmen – ob Shooting, Probe oder kreative Session.',
                              media: pickMedia(4),
                              overlayOpacity: '50',
                          },
                      ]
                    : []),
                ...(hasSeedMedia
                    ? [
                          {
                              blockType: 'gallery' as const,
                              variant: 'masonry' as const,
                              columns: '3' as const,
                              images: buildGalleryItems(
                                  [2, 4, 6, 0, 5, 3],
                                  [
                                      'Team Session',
                                      'Creative Direction',
                                      'Set Design',
                                      'Campaign Moment',
                                      'Rehearsal',
                                      'Portrait Study',
                                  ],
                              ),
                          },
                      ]
                    : []),
                {
                    blockType: 'cta',
                    variant: 'default',
                    headline: 'Arbeite mit uns',
                    text: 'Ob als Talent oder Kunde – wir freuen uns auf den Austausch.',
                    button: {
                        type: 'custom',
                        url: '/kontakt',
                        label: 'Kontakt aufnehmen',
                        appearance: 'primary',
                    },
                },
            ],
            pageSettings: {
                metaTitle: 'Über uns – Deleyna Talent Agency',
                metaDescription:
                    'Erfahre mehr über Deleyna, unsere Philosophie und das Team hinter der Talent-Agentur aus Berlin.',
            },
        },
        {
            title: 'About us',
            hero: {
                type: 'highImpact',
                badge: 'About Deleyna',
                headline: 'More than an agency',
                headlineHighlight: 'agency',
                subtext: 'We are a community of artists who grow together.',
                media: pickMedia(7),
                backgroundStyle: 'dark',
                showScrollIndicator: true,
            },
            layout: [
                {
                    blockType: 'content',
                    layout: 'narrow',
                    backgroundColor: 'white',
                    content: lexicalRoot([
                        lexicalHeading('Our story'),
                        lexicalParagraph(
                            "Deleyna was founded in Berlin in 2020 with a clear vision: to create an agency that doesn't just place talents, but actively supports and guides them.",
                        ),
                        lexicalParagraph(
                            'What started as a small network of dancers has grown into an established talent agency with over 50 artists from across Europe.',
                        ),
                        lexicalHeading('Our philosophy', 'h3'),
                        lexicalParagraph(
                            "We believe that every talent is unique. That's why we focus on individual support, personal development plans and a strong network that opens doors.",
                        ),
                        lexicalParagraph(
                            'At Deleyna, personality comes first – not just performance. We look for people with character, passion and the will to grow.',
                        ),
                    ]),
                },
                ...(hasSeedMedia && pickMedia(7)
                    ? [
                          {
                              blockType: 'mediaContent' as const,
                              layout: 'mediaLeft' as const,
                              media: pickMedia(7),
                              tagline: 'Studio',
                              headline: 'Creative development with strong focus',
                              body: lexicalRoot([
                                  lexicalParagraph(
                                      'Our approach combines artist development, visual quality and clear positioning for long-term careers.',
                                  ),
                              ]),
                          },
                      ]
                    : []),
                {
                    blockType: 'stats',
                    overline: 'Deleyna in numbers',
                    title: 'Our results',
                    titleHighlight: 'speak',
                    description:
                        'Since our founding, we have continuously connected talents with first-class projects.',
                    stats: [
                        { value: 50, suffix: '+', label: 'Talents in roster' },
                        { value: 200, suffix: '+', label: 'Projects completed' },
                        { value: 98, suffix: '%', label: 'Client satisfaction' },
                        { value: 2020, suffix: '', label: 'Founded' },
                    ],
                },
                {
                    blockType: 'team',
                    overline: 'The team',
                    title: 'The people behind Deleyna',
                    members: [
                        {
                            name: 'Leyna Müller',
                            role: 'Founder & CEO',
                            image: pickMedia(0),
                            bio: 'Former professional dancer with over 15 years of experience in the entertainment industry. Leyna founded Deleyna with the vision of developing talents holistically.',
                        },
                        {
                            name: 'David Okafor',
                            role: 'Head of Booking',
                            image: pickMedia(1),
                            bio: 'With his network in the European advertising and fashion industry, David ensures our talents get the best projects.',
                        },
                        {
                            name: 'Sarah Kim',
                            role: 'Talent Development',
                            image: pickMedia(2),
                            bio: 'Sarah supports our talents in their development – from sedcard shoots to casting preparation.',
                        },
                    ],
                },
                // Sticky Media - Studio vibes
                ...(hasSeedMedia && pickMedia(4)
                    ? [
                          {
                              blockType: 'stickyMedia' as const,
                              badge: 'STUDIO',
                              headline: 'Where creativity lives',
                              headlineHighlight: 'creativity',
                              subtitle:
                                  'Our Berlin studio is where ideas take shape – whether it is a shoot, rehearsal or creative session.',
                              media: pickMedia(4),
                              overlayOpacity: '50',
                          },
                      ]
                    : []),
                ...(hasSeedMedia
                    ? [
                          {
                              blockType: 'gallery' as const,
                              variant: 'masonry' as const,
                              columns: '3' as const,
                              images: buildGalleryItems(
                                  [2, 4, 6, 0, 5, 3],
                                  [
                                      'Team session',
                                      'Creative direction',
                                      'Set design',
                                      'Campaign moment',
                                      'Rehearsal',
                                      'Portrait study',
                                  ],
                              ),
                          },
                      ]
                    : []),
                {
                    blockType: 'cta',
                    variant: 'default',
                    headline: 'Work with us',
                    text: 'Whether as a talent or client – we look forward to connecting.',
                    button: {
                        type: 'custom',
                        url: '/contact',
                        label: 'Get in touch',
                        appearance: 'primary',
                    },
                },
            ],
            pageSettings: {
                metaTitle: 'About us – Deleyna Talent Agency',
                metaDescription:
                    'Learn more about Deleyna, our philosophy and the team behind the talent agency from Berlin.',
            },
        },
    )

    // ─────────────────────────────────────────────────────────────────────────
    // 3. SERVICES PAGE
    // ─────────────────────────────────────────────────────────────────────────
    console.log('  📄 Services page...')
    await upsertPage(
        payload,
        'services',
        {
            title: 'Services',
            hero: {
                type: 'mediumImpact',
                badge: 'Services',
                headline: 'Was wir für Sie tun können',
                headlineHighlight: 'tun',
                subtext:
                    'Umfassende Dienstleistungen rund um Talent Management, Booking und kreative Produktion.',
                media: pickMedia(3),
            },
            layout: [
                {
                    blockType: 'marqueeBanner',
                    text: 'DESIGNED FOR MODERN BRANDS AND TALENTS',
                    appearance: 'solid',
                    speed: 'normal',
                },
                {
                    blockType: 'services',
                    overline: 'Leistungen',
                    title: 'Unsere Kernservices',
                    description:
                        'Wir bieten ein vollständiges Spektrum an Dienstleistungen für Talente und Kunden – von der Vermittlung bis zur Produktion.',
                    services: [
                        {
                            icon: 'users',
                            title: 'Talent Management',
                            description:
                                'Individuelle Karriereplanung, Sedcard-Erstellung, Casting-Vorbereitung und persönliche Betreuung für jedes Talent in unserem Roster.',
                        },
                        {
                            icon: 'calendar',
                            title: 'Booking & Vermittlung',
                            description:
                                'Professionelle Vermittlung für Fotoshootings, Musikvideos, Werbekampagnen, Events, Fashion Shows und TV-Produktionen.',
                        },
                        {
                            icon: 'handshake',
                            title: 'Kundenberatung',
                            description:
                                'Wir beraten Sie bei der Talent-Auswahl und sorgen für einen reibungslosen Ablauf – vom ersten Gespräch bis zum Wrap.',
                        },
                        {
                            icon: 'globe',
                            title: 'Internationale Vermittlung',
                            description:
                                'Dank unseres europäischen Netzwerks vermitteln wir Talente auch für internationale Projekte und Kampagnen.',
                        },
                    ],
                },
                {
                    blockType: 'stepSection',
                    layout: 'timeline',
                    backgroundColor: 'muted',
                    badge: 'Ablauf',
                    headline: 'So läuft eine Buchung ab',
                    headlineHighlight: 'Buchung',
                    steps: [
                        {
                            number: '01',
                            title: 'Briefing',
                            description:
                                'Sie beschreiben Ihr Projekt, Ihre Anforderungen und den gewünschten Zeitrahmen.',
                        },
                        {
                            number: '02',
                            title: 'Talent-Vorschlag',
                            description:
                                'Wir erstellen eine Auswahl passender Talente mit Sedcards und Verfügbarkeiten.',
                        },
                        {
                            number: '03',
                            title: 'Abstimmung',
                            description:
                                'Gemeinsam finalisieren wir die Auswahl, klären Details und organisieren die Logistik.',
                        },
                        {
                            number: '04',
                            title: 'Produktion',
                            description:
                                'Am Set sorgen wir für professionelle Betreuung und reibungslosen Ablauf.',
                        },
                    ],
                    resultTitle: 'Ergebnis',
                    resultDescription:
                        'Ein erfolgreiches Projekt mit den perfekten Talenten – termingerecht und budgetkonform.',
                    cta: stepCta('/booking', 'Anfrage starten'),
                },
                {
                    blockType: 'infoCards',
                    backgroundColor: 'white',
                    tagline: 'Für Kunden',
                    title: 'Warum Deleyna?',
                    cards: [
                        {
                            title: 'Kuratiertes Roster',
                            description:
                                'Wir arbeiten nur mit handverlesenen Talenten, die höchste Qualitätsstandards erfüllen.',
                        },
                        {
                            title: 'Schnelle Reaktionszeiten',
                            description:
                                'Innerhalb von 48 Stunden erhalten Sie passende Talent-Vorschläge für Ihr Projekt.',
                        },
                        {
                            title: 'Full-Service',
                            description:
                                'Von der Beratung über die Vermittlung bis zur Betreuung am Set – alles aus einer Hand.',
                        },
                        {
                            title: 'Transparente Konditionen',
                            description:
                                'Klare Kommunikation und faire Preise ohne versteckte Kosten.',
                        },
                    ],
                },
                ...(hasSeedMedia && pickMedia(3)
                    ? [
                          {
                              blockType: 'mediaContent' as const,
                              layout: 'mediaRight' as const,
                              media: pickMedia(3),
                              tagline: 'Production',
                              headline: 'Von Briefing bis Wrap professionell begleitet',
                              body: lexicalRoot([
                                  lexicalParagraph(
                                      'Wir liefern nicht nur Talente, sondern eine strukturierte Zusammenarbeit mit klaren Timelines, schnellen Abstimmungen und hoher Verlässlichkeit am Set.',
                                  ),
                              ]),
                          },
                      ]
                    : []),
                ...(hasSeedMedia
                    ? [
                          {
                              blockType: 'gallery' as const,
                              variant: 'grid' as const,
                              columns: '3' as const,
                              images: buildGalleryItems(
                                  [0, 1, 2, 3, 4, 5],
                                  [
                                      'Campaign Look',
                                      'Performance Shot',
                                      'Studio Frame',
                                      'Production Day',
                                      'Casting Moment',
                                      'Final Delivery',
                                  ],
                              ),
                          },
                      ]
                    : []),
                ...(bookingFormId
                    ? [
                          {
                              blockType: 'formBlock' as const,
                              form: bookingFormId,
                              enableIntro: true,
                              introContent: lexicalRoot([
                                  lexicalHeading('Talent anfragen', 'h2'),
                                  lexicalParagraph(
                                      'Beschreiben Sie Ihr Projekt und wir melden uns mit passenden Talent-Vorschlägen.',
                                  ),
                              ]),
                          },
                      ]
                    : []),
            ],
            pageSettings: {
                metaTitle: 'Services – Deleyna Talent Agency',
                metaDescription:
                    'Talent Management, Booking und Vermittlung für Tänzer und Models. Entdecken Sie unsere Services.',
            },
        },
        {
            title: 'Services',
            hero: {
                type: 'mediumImpact',
                badge: 'Services',
                headline: 'What we can do for you',
                headlineHighlight: 'do',
                subtext:
                    'Comprehensive services around talent management, booking and creative production.',
                media: pickMedia(3),
            },
            layout: [
                {
                    blockType: 'marqueeBanner',
                    text: 'DESIGNED FOR MODERN BRANDS AND TALENTS',
                    appearance: 'solid',
                    speed: 'normal',
                },
                {
                    blockType: 'services',
                    overline: 'Services',
                    title: 'Our core services',
                    description:
                        'We offer a complete range of services for talents and clients – from placement to production.',
                    services: [
                        {
                            icon: 'users',
                            title: 'Talent management',
                            description:
                                'Individual career planning, sedcard creation, casting preparation and personal support for every talent in our roster.',
                        },
                        {
                            icon: 'calendar',
                            title: 'Booking & placement',
                            description:
                                'Professional placement for photoshoots, music videos, ad campaigns, events, fashion shows and TV productions.',
                        },
                        {
                            icon: 'handshake',
                            title: 'Client advisory',
                            description:
                                'We advise you on talent selection and ensure a smooth process – from the first conversation to wrap.',
                        },
                        {
                            icon: 'globe',
                            title: 'International placement',
                            description:
                                'Thanks to our European network, we also place talents for international projects and campaigns.',
                        },
                    ],
                },
                {
                    blockType: 'stepSection',
                    layout: 'timeline',
                    backgroundColor: 'muted',
                    badge: 'Process',
                    headline: 'How a booking works',
                    headlineHighlight: 'booking',
                    steps: [
                        {
                            number: '01',
                            title: 'Briefing',
                            description:
                                'You describe your project, requirements and desired timeline.',
                        },
                        {
                            number: '02',
                            title: 'Talent proposal',
                            description:
                                'We create a selection of matching talents with sedcards and availability.',
                        },
                        {
                            number: '03',
                            title: 'Alignment',
                            description:
                                'Together we finalize the selection, clarify details and organize logistics.',
                        },
                        {
                            number: '04',
                            title: 'Production',
                            description:
                                'On set, we ensure professional support and smooth execution.',
                        },
                    ],
                    resultTitle: 'Result',
                    resultDescription:
                        'A successful project with the perfect talents – on time and within budget.',
                    cta: stepCta('/booking', 'Start a request'),
                },
                {
                    blockType: 'infoCards',
                    backgroundColor: 'white',
                    tagline: 'For clients',
                    title: 'Why Deleyna?',
                    cards: [
                        {
                            title: 'Curated roster',
                            description:
                                'We only work with hand-picked talents who meet the highest quality standards.',
                        },
                        {
                            title: 'Fast response times',
                            description:
                                'Within 48 hours you receive matching talent proposals for your project.',
                        },
                        {
                            title: 'Full service',
                            description:
                                'From consulting to placement to on-set support – everything from one source.',
                        },
                        {
                            title: 'Transparent conditions',
                            description:
                                'Clear communication and fair prices without hidden costs.',
                        },
                    ],
                },
                ...(hasSeedMedia && pickMedia(3)
                    ? [
                          {
                              blockType: 'mediaContent' as const,
                              layout: 'mediaRight' as const,
                              media: pickMedia(3),
                              tagline: 'Production',
                              headline: 'Professionally guided from briefing to wrap',
                              body: lexicalRoot([
                                  lexicalParagraph(
                                      'We do not just provide talent. We build a structured workflow with clear timelines, fast alignment and reliable execution on set.',
                                  ),
                              ]),
                          },
                      ]
                    : []),
                ...(hasSeedMedia
                    ? [
                          {
                              blockType: 'gallery' as const,
                              variant: 'grid' as const,
                              columns: '3' as const,
                              images: buildGalleryItems(
                                  [0, 1, 2, 3, 4, 5],
                                  [
                                      'Campaign look',
                                      'Performance shot',
                                      'Studio frame',
                                      'Production day',
                                      'Casting moment',
                                      'Final delivery',
                                  ],
                              ),
                          },
                      ]
                    : []),
                ...(bookingFormId
                    ? [
                          {
                              blockType: 'formBlock' as const,
                              form: bookingFormId,
                              enableIntro: true,
                              introContent: lexicalRoot([
                                  lexicalHeading('Request a talent', 'h2'),
                                  lexicalParagraph(
                                      'Describe your project and we will get back to you with matching talent proposals.',
                                  ),
                              ]),
                          },
                      ]
                    : []),
            ],
            pageSettings: {
                metaTitle: 'Services – Deleyna Talent Agency',
                metaDescription:
                    'Talent management, booking and placement for dancers and models. Discover our services.',
            },
        },
    )

    // ─────────────────────────────────────────────────────────────────────────
    // 4. TALENT WERDEN (Become a Talent)
    // ─────────────────────────────────────────────────────────────────────────
    console.log('  📄 Become a talent page...')
    await upsertPage(
        payload,
        'talent-werden',
        {
            title: 'Talent werden',
            hero: {
                type: 'textLeftAligned',
                badge: 'Bewirb dich',
                headline: 'Werde Teil unseres Rosters',
                headlineHighlight: 'Rosters',
                subtext: 'Du bist Tänzer*in oder Model? Zeig uns, was dich besonders macht.',
                media: pickMedia(2),
            },
            layout: [
                {
                    blockType: 'stepSection',
                    layout: 'flow',
                    backgroundColor: 'white',
                    badge: 'Der Weg zu Deleyna',
                    headline: 'So wirst du Teil von uns',
                    headlineHighlight: 'Teil',
                    steps: [
                        {
                            number: '01',
                            title: 'Bewerbung ausfüllen',
                            description:
                                'Fülle das Formular unten aus und erzähle uns von dir, deiner Erfahrung und deinen Zielen.',
                        },
                        {
                            number: '02',
                            title: 'Review durch unser Team',
                            description:
                                'Unser Team prüft deine Bewerbung und meldet sich innerhalb von 5 Werktagen bei dir.',
                        },
                        {
                            number: '03',
                            title: 'Kennenlernen & Onboarding',
                            description:
                                'Bei einem persönlichen Gespräch lernen wir uns kennen. Danach starten wir mit Sedcard-Shooting und Profilaufbau.',
                        },
                    ],
                    flowDescription:
                        'Innerhalb weniger Wochen bist du bereit für deine ersten Projekte.',
                    flowContainerStyle: 'card',
                    cta: stepCta('/kontakt', 'Fragen? Kontaktiere uns'),
                },
                ...(hasSeedMedia && pickMedia(2)
                    ? [
                          {
                              blockType: 'mediaContent' as const,
                              layout: 'mediaRight' as const,
                              media: pickMedia(2),
                              tagline: 'Showreel',
                              headline: 'Zeig Präsenz in Bild und Bewegung',
                              body: lexicalRoot([
                                  lexicalParagraph(
                                      'Für starke Bewerbungen zählen Ausdruck, Haltung und Bildqualität. Wir helfen dir, dein Profil klar und professionell zu präsentieren.',
                                  ),
                              ]),
                          },
                      ]
                    : []),
                {
                    blockType: 'infoCards',
                    backgroundColor: 'muted',
                    tagline: 'Was du bekommst',
                    title: 'Deine Vorteile bei Deleyna',
                    cards: [
                        {
                            title: 'Professionelle Sedcard',
                            description:
                                'Wir organisieren ein professionelles Shooting und erstellen deine Sedcard.',
                        },
                        {
                            title: 'Persönliche Betreuung',
                            description:
                                'Ein fester Ansprechpartner begleitet dich bei allen Fragen und Buchungen.',
                        },
                        {
                            title: 'Zugang zu Top-Projekten',
                            description:
                                'Profitiere von unserem Netzwerk und werde für hochwertige Projekte gebucht.',
                        },
                        {
                            title: 'Weiterentwicklung',
                            description:
                                'Workshops, Coaching und Feedback helfen dir, kontinuierlich zu wachsen.',
                        },
                    ],
                },
                ...(becomeTalentFormId
                    ? [
                          {
                              blockType: 'formBlock' as const,
                              form: becomeTalentFormId,
                              enableIntro: true,
                              introContent: lexicalRoot([
                                  lexicalHeading('Bewerbungsformular', 'h2'),
                                  lexicalParagraph(
                                      'Bitte fülle alle Felder sorgfältig aus. Je mehr wir über dich wissen, desto besser können wir einschätzen, ob wir zusammenpassen.',
                                  ),
                              ]),
                          },
                      ]
                    : []),
            ],
            pageSettings: {
                metaTitle: 'Talent werden – Deleyna Talent Agency',
                metaDescription:
                    'Bewirb dich als Tänzer*in oder Model bei Deleyna. Werde Teil unseres Rosters und starte deine Karriere.',
            },
        },
        {
            title: 'Become a talent',
            hero: {
                type: 'textLeftAligned',
                badge: 'Apply now',
                headline: 'Become part of our roster',
                headlineHighlight: 'roster',
                subtext: 'You are a dancer or model? Show us what makes you special.',
                media: pickMedia(2),
            },
            layout: [
                {
                    blockType: 'stepSection',
                    layout: 'flow',
                    backgroundColor: 'white',
                    badge: 'The path to Deleyna',
                    headline: 'How to join us',
                    headlineHighlight: 'join',
                    steps: [
                        {
                            number: '01',
                            title: 'Fill out application',
                            description:
                                'Complete the form below and tell us about yourself, your experience and your goals.',
                        },
                        {
                            number: '02',
                            title: 'Review by our team',
                            description:
                                'Our team reviews your application and gets back to you within 5 business days.',
                        },
                        {
                            number: '03',
                            title: 'Meet & onboarding',
                            description:
                                'In a personal meeting we get to know each other. Then we start with sedcard shooting and profile setup.',
                        },
                    ],
                    flowDescription: "Within a few weeks you'll be ready for your first projects.",
                    flowContainerStyle: 'card',
                    cta: stepCta('/contact', 'Questions? Contact us'),
                },
                ...(hasSeedMedia && pickMedia(2)
                    ? [
                          {
                              blockType: 'mediaContent' as const,
                              layout: 'mediaRight' as const,
                              media: pickMedia(2),
                              tagline: 'Showreel',
                              headline: 'Present presence through image and movement',
                              body: lexicalRoot([
                                  lexicalParagraph(
                                      'Strong applications are built on expression, camera presence and visual quality. We help you position your profile clearly and professionally.',
                                  ),
                              ]),
                          },
                      ]
                    : []),
                {
                    blockType: 'infoCards',
                    backgroundColor: 'muted',
                    tagline: 'What you get',
                    title: 'Your benefits at Deleyna',
                    cards: [
                        {
                            title: 'Professional sedcard',
                            description:
                                'We organize a professional shoot and create your sedcard.',
                        },
                        {
                            title: 'Personal support',
                            description:
                                'A dedicated contact person accompanies you with all questions and bookings.',
                        },
                        {
                            title: 'Access to top projects',
                            description:
                                'Benefit from our network and get booked for high-quality projects.',
                        },
                        {
                            title: 'Development',
                            description:
                                'Workshops, coaching and feedback help you grow continuously.',
                        },
                    ],
                },
                ...(becomeTalentFormId
                    ? [
                          {
                              blockType: 'formBlock' as const,
                              form: becomeTalentFormId,
                              enableIntro: true,
                              introContent: lexicalRoot([
                                  lexicalHeading('Application form', 'h2'),
                                  lexicalParagraph(
                                      'Please fill out all fields carefully. The more we know about you, the better we can assess if we are a good match.',
                                  ),
                              ]),
                          },
                      ]
                    : []),
            ],
            pageSettings: {
                metaTitle: 'Become a talent – Deleyna Talent Agency',
                metaDescription:
                    'Apply as a dancer or model at Deleyna. Become part of our roster and start your career.',
            },
        },
    )

    // ─────────────────────────────────────────────────────────────────────────
    // 5. CONTACT PAGE
    // ─────────────────────────────────────────────────────────────────────────
    console.log('  📄 Contact page...')
    await upsertPage(
        payload,
        'contact',
        {
            title: 'Kontakt',
            hero: {
                type: 'lowImpact',
                badge: 'Kontakt',
                headline: 'Sprechen wir über Ihr Projekt',
                headlineHighlight: 'Projekt',
                subtext:
                    'Ob Buchungsanfrage, Kooperation oder allgemeine Fragen – wir sind für Sie da.',
            },
            layout: [
                {
                    blockType: 'marqueeBanner',
                    text: 'GET IN TOUCH WITH DELYNA',
                    appearance: 'solid',
                    speed: 'fast',
                },
                ...(hasSeedMedia && pickMedia(1)
                    ? [
                          {
                              blockType: 'mediaContent' as const,
                              layout: 'mediaLeft' as const,
                              media: pickMedia(1),
                              tagline: 'Agency Contact',
                              headline: 'Schnelle Abstimmung statt langer Wege',
                              body: lexicalRoot([
                                  lexicalParagraph(
                                      'Ob Kunde oder Talent: Unser Team antwortet schnell, strukturiert und mit klaren nächsten Schritten für dein Anliegen.',
                                  ),
                              ]),
                              links: [
                                  {
                                      link: {
                                          type: 'custom',
                                          url: '/booking',
                                          label: 'Projekt anfragen',
                                          appearance: 'primary-pill',
                                      },
                                  },
                              ],
                          },
                      ]
                    : []),
                {
                    blockType: 'contact',
                    overline: 'Kontakt',
                    title: 'Schreiben Sie uns',
                    form: contactFormId || undefined,
                    emailLabel: 'E-Mail',
                    email: 'info@deleyna.com',
                    phoneLabel: 'Telefon',
                    phone: '+49 30 123 456 78',
                    addressLabel: 'Adresse',
                    address: 'Deleyna Talent Agency\nBerlin, Deutschland',
                    socialLabel: 'Social Media',
                    socialUrl: 'https://instagram.com/deleyna',
                    socialText: '@deleyna',
                },
                {
                    blockType: 'faq',
                    anchorId: 'faq',
                    title: 'Häufige Fragen',
                    description:
                        'Antworten auf die wichtigsten Fragen rund um Buchungen und Zusammenarbeit.',
                    layout: 'accordion',
                    generateSchema: true,
                    items: [
                        {
                            question: 'Wie kann ich ein Talent buchen?',
                            answer: lexicalRoot([
                                lexicalParagraph(
                                    'Senden Sie uns eine Anfrage über das Kontaktformular oder per E-Mail. Beschreiben Sie Ihr Projekt, den gewünschten Zeitraum und die Art des Talents. Wir melden uns innerhalb von 48 Stunden mit passenden Vorschlägen.',
                                ),
                            ]),
                        },
                        {
                            question: 'Was kostet eine Buchung?',
                            answer: lexicalRoot([
                                lexicalParagraph(
                                    'Die Kosten hängen vom Umfang des Projekts, der Anzahl der Talente und der Dauer ab. Kontaktieren Sie uns für ein individuelles Angebot – wir beraten Sie transparent und unverbindlich.',
                                ),
                            ]),
                        },
                        {
                            question: 'Kann ich mich als Talent bewerben?',
                            answer: lexicalRoot([
                                lexicalParagraph(
                                    'Ja! Besuche unsere Seite "Talent werden" und fülle das Bewerbungsformular aus. Wir suchen Tänzer*innen und Models mit Erfahrung und Leidenschaft.',
                                ),
                            ]),
                        },
                        {
                            question: 'In welchen Städten seid ihr aktiv?',
                            answer: lexicalRoot([
                                lexicalParagraph(
                                    'Unser Sitz ist in Berlin, aber wir vermitteln Talente europaweit. Wir arbeiten regelmäßig mit Kunden in Berlin, Hamburg, München, Wien und weiteren Städten zusammen.',
                                ),
                            ]),
                        },
                        {
                            question: 'Wie lange dauert es, bis ich eine Antwort bekomme?',
                            answer: lexicalRoot([
                                lexicalParagraph(
                                    'Wir antworten in der Regel innerhalb von 48 Stunden auf Buchungsanfragen. Bei Talent-Bewerbungen kann es bis zu 5 Werktage dauern.',
                                ),
                            ]),
                        },
                    ],
                },
            ],
            pageSettings: {
                metaTitle: 'Kontakt – Deleyna Talent Agency',
                metaDescription:
                    'Nehmen Sie Kontakt auf mit Deleyna. Buchungsanfragen, Kooperationen und allgemeine Fragen – wir freuen uns auf Ihre Nachricht.',
                schemaType: 'ContactPage',
            },
        },
        {
            title: 'Contact',
            hero: {
                type: 'lowImpact',
                badge: 'Contact',
                headline: "Let's talk about your project",
                headlineHighlight: 'project',
                subtext:
                    'Whether booking request, cooperation or general questions – we are here for you.',
            },
            layout: [
                {
                    blockType: 'marqueeBanner',
                    text: 'GET IN TOUCH WITH DELYNA',
                    appearance: 'solid',
                    speed: 'fast',
                },
                ...(hasSeedMedia && pickMedia(1)
                    ? [
                          {
                              blockType: 'mediaContent' as const,
                              layout: 'mediaLeft' as const,
                              media: pickMedia(1),
                              tagline: 'Agency Contact',
                              headline: 'Fast alignment, clear next steps',
                              body: lexicalRoot([
                                  lexicalParagraph(
                                      'Whether client or talent, our team responds quickly with a structured process and clear recommendations.',
                                  ),
                              ]),
                              links: [
                                  {
                                      link: {
                                          type: 'custom',
                                          url: '/booking',
                                          label: 'Project request',
                                          appearance: 'primary-pill',
                                      },
                                  },
                              ],
                          },
                      ]
                    : []),
                {
                    blockType: 'contact',
                    overline: 'Contact',
                    title: 'Get in touch',
                    form: contactFormId || undefined,
                    emailLabel: 'Email',
                    email: 'info@deleyna.com',
                    phoneLabel: 'Phone',
                    phone: '+49 30 123 456 78',
                    addressLabel: 'Address',
                    address: 'Deleyna Talent Agency\nBerlin, Germany',
                    socialLabel: 'Social media',
                    socialUrl: 'https://instagram.com/deleyna',
                    socialText: '@deleyna',
                },
                {
                    blockType: 'faq',
                    anchorId: 'faq',
                    title: 'Frequently asked questions',
                    description:
                        'Answers to the most important questions about bookings and collaboration.',
                    layout: 'accordion',
                    generateSchema: true,
                    items: [
                        {
                            question: 'How can I book a talent?',
                            answer: lexicalRoot([
                                lexicalParagraph(
                                    'Send us a request via the contact form or email. Describe your project, desired timeline and type of talent. We will get back to you within 48 hours with matching proposals.',
                                ),
                            ]),
                        },
                        {
                            question: 'What does a booking cost?',
                            answer: lexicalRoot([
                                lexicalParagraph(
                                    'Costs depend on the scope of the project, number of talents and duration. Contact us for an individual quote – we advise transparently and without obligation.',
                                ),
                            ]),
                        },
                        {
                            question: 'Can I apply as a talent?',
                            answer: lexicalRoot([
                                lexicalParagraph(
                                    'Yes! Visit our "Become a talent" page and fill out the application form. We are looking for dancers and models with experience and passion.',
                                ),
                            ]),
                        },
                        {
                            question: 'In which cities are you active?',
                            answer: lexicalRoot([
                                lexicalParagraph(
                                    'Our headquarters are in Berlin, but we place talents across Europe. We regularly work with clients in Berlin, Hamburg, Munich, Vienna and other cities.',
                                ),
                            ]),
                        },
                        {
                            question: 'How long until I get a response?',
                            answer: lexicalRoot([
                                lexicalParagraph(
                                    'We typically respond within 48 hours to booking requests. For talent applications it may take up to 5 business days.',
                                ),
                            ]),
                        },
                    ],
                },
            ],
            pageSettings: {
                metaTitle: 'Contact – Deleyna Talent Agency',
                metaDescription:
                    'Get in touch with Deleyna. Booking requests, cooperations and general questions – we look forward to your message.',
                schemaType: 'ContactPage',
            },
        },
    )

    // ─────────────────────────────────────────────────────────────────────────
    // 6. BOOKING PAGE (clients requesting talent)
    // ─────────────────────────────────────────────────────────────────────────
    console.log('  📄 Booking request page...')
    await upsertPage(
        payload,
        'booking',
        {
            title: 'Booking',
            hero: {
                type: 'highImpact',
                badge: 'Booking',
                headline: 'Talent-Anfrage für Ihr Projekt',
                headlineHighlight: 'Talent-Anfrage',
                subtext:
                    'Sie suchen Tänzer*innen oder Models für Kampagne, Event oder Produktion? Stellen Sie jetzt Ihre Anfrage.',
                media: pickMedia(5),
                backgroundStyle: 'dark',
                showScrollIndicator: true,
            },
            layout: [
                {
                    blockType: 'marqueeBanner',
                    text: 'DESIGNED FOR MODERN BRANDS AND TALENTS',
                    appearance: 'solid',
                    speed: 'normal',
                },
                {
                    blockType: 'infoCards',
                    backgroundColor: 'muted',
                    tagline: 'Für Kunden',
                    title: 'So läuft Ihre Anfrage ab',
                    cards: [
                        {
                            title: 'Briefing',
                            description:
                                'Sie senden uns alle Eckdaten zu Projekt, Zeitraum und gewünschtem Talentprofil.',
                        },
                        {
                            title: 'Kuratiertes Matching',
                            description:
                                'Wir schlagen passende Talente aus unserem Roster mit Sedcards und Verfügbarkeiten vor.',
                        },
                        {
                            title: 'Booking & Umsetzung',
                            description:
                                'Nach Freigabe koordinieren wir die Details und begleiten die Produktion professionell.',
                        },
                    ],
                },
                ...(hasSeedMedia && pickMedia(3)
                    ? [
                          {
                              blockType: 'mediaContent' as const,
                              layout: 'mediaRight' as const,
                              media: pickMedia(3),
                              tagline: 'Booking',
                              headline: 'Klarer Casting-Prozess für schnelle Entscheidungen',
                              body: lexicalRoot([
                                  lexicalParagraph(
                                      'Du erhältst schnell kuratierte Vorschläge mit relevanten Profilen, Verfügbarkeiten und transparenter Kalkulation.',
                                  ),
                              ]),
                          },
                      ]
                    : []),
                ...(bookingFormId
                    ? [
                          {
                              blockType: 'formBlock' as const,
                              form: bookingFormId,
                              enableIntro: true,
                              introContent: lexicalRoot([
                                  lexicalHeading('Booking-Anfrage', 'h2'),
                                  lexicalParagraph(
                                      'Bitte beschreiben Sie kurz Ihr Projekt. Unser Team meldet sich in der Regel innerhalb von 48 Stunden mit passenden Talenten.',
                                  ),
                              ]),
                          },
                      ]
                    : []),
                {
                    blockType: 'cta',
                    variant: 'default',
                    headline: 'Lieber direkt sprechen?',
                    text: 'Für dringende Produktionen erreichen Sie uns auch direkt per E-Mail oder Telefon.',
                    button: {
                        type: 'custom',
                        url: '/kontakt',
                        label: 'Kontakt aufnehmen',
                        appearance: 'primary',
                    },
                },
            ],
            pageSettings: {
                metaTitle: 'Booking-Anfrage – Deleyna Talent Agency',
                metaDescription:
                    'Talent-Anfrage für Kampagnen, Events und Produktionen. Jetzt passende Tänzer und Models bei Deleyna anfragen.',
                schemaType: 'ContactPage',
            },
        },
        {
            title: 'Booking',
            hero: {
                type: 'highImpact',
                badge: 'Booking',
                headline: 'Talent request for your project',
                headlineHighlight: 'Talent request',
                subtext:
                    'Looking for dancers or models for a campaign, event or production? Send your request now.',
                media: pickMedia(5),
                backgroundStyle: 'dark',
                showScrollIndicator: true,
            },
            layout: [
                {
                    blockType: 'marqueeBanner',
                    text: 'DESIGNED FOR MODERN BRANDS AND TALENTS',
                    appearance: 'solid',
                    speed: 'normal',
                },
                {
                    blockType: 'infoCards',
                    backgroundColor: 'muted',
                    tagline: 'For clients',
                    title: 'How your request works',
                    cards: [
                        {
                            title: 'Briefing',
                            description:
                                'You send all core details about your project, timeline and desired talent profile.',
                        },
                        {
                            title: 'Curated matching',
                            description:
                                'We suggest suitable talents from our roster with sedcards and availability.',
                        },
                        {
                            title: 'Booking & execution',
                            description:
                                'After approval, we coordinate details and support the production professionally.',
                        },
                    ],
                },
                ...(hasSeedMedia && pickMedia(3)
                    ? [
                          {
                              blockType: 'mediaContent' as const,
                              layout: 'mediaRight' as const,
                              media: pickMedia(3),
                              tagline: 'Booking',
                              headline: 'A clear casting flow for fast decisions',
                              body: lexicalRoot([
                                  lexicalParagraph(
                                      'You receive curated options quickly with relevant profiles, availability and transparent budgeting.',
                                  ),
                              ]),
                          },
                      ]
                    : []),
                ...(bookingFormId
                    ? [
                          {
                              blockType: 'formBlock' as const,
                              form: bookingFormId,
                              enableIntro: true,
                              introContent: lexicalRoot([
                                  lexicalHeading('Booking request', 'h2'),
                                  lexicalParagraph(
                                      'Please describe your project briefly. Our team usually responds within 48 hours with matching talent options.',
                                  ),
                              ]),
                          },
                      ]
                    : []),
                {
                    blockType: 'cta',
                    variant: 'default',
                    headline: 'Prefer to talk directly?',
                    text: 'For urgent productions, you can also reach us directly by email or phone.',
                    button: {
                        type: 'custom',
                        url: '/contact',
                        label: 'Get in touch',
                        appearance: 'primary',
                    },
                },
            ],
            pageSettings: {
                metaTitle: 'Booking Request – Deleyna Talent Agency',
                metaDescription:
                    'Talent request for campaigns, events and productions. Request matching dancers and models from Deleyna.',
                schemaType: 'ContactPage',
            },
        },
    )

    // ─────────────────────────────────────────────────────────────────────────
    // 7. EDUCATION PAGE
    // ─────────────────────────────────────────────────────────────────────────
    console.log('  📄 Education page...')
    await upsertPage(
        payload,
        'education',
        {
            title: 'Education',
            hero: {
                type: 'centeredVideo',
                badge: 'Education',
                headline: 'Lerne von den Besten',
                headlineHighlight: 'Besten',
                subtext:
                    'Workshops, Masterclasses und fortlaufende Kurse mit professionellen Tänzern und Choreographen.',
                videoUrl:
                    'https://videos.pexels.com/video-files/4066516/4066516-uhd_2560_1440_25fps.mp4',
                posterImage: pickMedia(6),
                muted: true,
                loop: true,
                autoPlay: true,
                playsInline: true,
                showScrollIndicator: true,
            },
            layout: [
                {
                    blockType: 'education',
                    overline: 'Programme',
                    title: 'Unsere Education-Programme',
                    description:
                        'Von Einsteiger-Workshops bis zu intensiven Masterclasses – wir bieten Formate für jedes Level.',
                    programs: [
                        {
                            icon: 'graduationCap',
                            title: 'Open Classes',
                            description:
                                'Offene Klassen für alle Level in verschiedenen Tanzstilen. Drop-in oder als Kurspaket buchbar.',
                            duration: 'Laufend',
                            level: 'Alle Level',
                        },
                        {
                            icon: 'users',
                            title: 'Masterclasses',
                            description:
                                'Intensive Sessions mit Top-Choreographen und Gastdozenten aus der internationalen Szene.',
                            duration: '2-4 Stunden',
                            level: 'Intermediate – Advanced',
                        },
                        {
                            icon: 'briefcase',
                            title: 'Industry Workshops',
                            description:
                                'Praxisnahe Workshops zu Themen wie Casting-Vorbereitung, Self-Marketing und Karriereplanung.',
                            duration: '1 Tag',
                            level: 'Alle Level',
                        },
                        {
                            icon: 'zap',
                            title: 'Intensives',
                            description:
                                'Mehrtägige Intensivprogramme mit Fokus auf Technik, Ausdruck und Performance.',
                            duration: '3-5 Tage',
                            level: 'Intermediate – Advanced',
                        },
                    ],
                    cta: {
                        type: 'custom',
                        url: '/kontakt',
                        label: 'Kurs anfragen',
                        appearance: 'primary',
                    },
                },
                // Audience MasonryGrid
                ...(hasSeedMedia
                    ? [
                          {
                              blockType: 'masonryGrid' as const,
                              variant: 'audience' as const,
                              badge: 'Für wen?',
                              heading: 'Unsere Programme richten sich an',
                              headlineHighlight: 'Programme',
                              sectionTone: 'dark' as const,
                              audienceCards: [
                                  {
                                      title: 'Tänzer:innen',
                                      description:
                                          'Von Open Level bis Advanced – entwickle deine Technik, deinen Ausdruck und deine Bühnenqualität.',
                                      backgroundMedia: pickMedia(0),
                                      size: 'large' as const,
                                      theme: 'dark' as const,
                                      linkStyle: 'default' as const,
                                      link: {
                                          type: 'custom' as const,
                                          url: '/talent-werden',
                                          label: 'Talent werden',
                                          newTab: false,
                                      },
                                  },
                                  {
                                      title: 'Models',
                                      description:
                                          'Bewegungscoaching und Camera-Training für authentische Posings und starke Setpräsenz.',
                                      backgroundMedia: pickMedia(3),
                                      size: 'medium' as const,
                                      theme: 'dark' as const,
                                      linkStyle: 'outline' as const,
                                      link: {
                                          type: 'custom' as const,
                                          url: '/coaching',
                                          label: 'Mehr erfahren',
                                          newTab: false,
                                      },
                                  },
                                  {
                                      title: 'Kreativteams',
                                      description:
                                          'Workshops für Produktionsteams zu Choreografie, Casting-Workflows und Talent-Briefings.',
                                      backgroundMedia: pickMedia(5),
                                      size: 'medium' as const,
                                      theme: 'light' as const,
                                      linkStyle: 'default' as const,
                                      link: {
                                          type: 'custom' as const,
                                          url: '/kontakt',
                                          label: 'Kontakt',
                                          newTab: false,
                                      },
                                  },
                                  {
                                      title: 'Einsteiger:innen',
                                      description:
                                          'Erste Schritte im professionellen Dance und Modeling mit persönlichem Mentoring.',
                                      backgroundMedia: pickMedia(7),
                                      size: 'large' as const,
                                      theme: 'dark' as const,
                                      linkStyle: 'default' as const,
                                      link: {
                                          type: 'custom' as const,
                                          url: '/education',
                                          label: 'Starten',
                                          newTab: false,
                                      },
                                  },
                              ],
                          },
                      ]
                    : []),
                {
                    blockType: 'infoCards',
                    backgroundColor: 'muted',
                    tagline: 'Deleyna Academy',
                    title: 'Deine Vorteile',
                    cards: [
                        {
                            title: 'Branchenexperten',
                            description:
                                'Lerne direkt von aktiven Tänzern, Choreographen und Models aus der Industrie.',
                        },
                        {
                            title: 'Networking',
                            description:
                                'Knüpfe wertvolle Kontakte zu anderen Talenten und kreativen Köpfen.',
                        },
                        {
                            title: 'Karriere-Boost',
                            description:
                                'Echte Insights, die dir helfen, bei Castings und Auditions zu überzeugen.',
                        },
                    ],
                },
                ...(hasSeedMedia && pickMedia(2)
                    ? [
                          {
                              blockType: 'mediaContent' as const,
                              layout: 'mediaLeft' as const,
                              media: pickMedia(2),
                              tagline: 'Die Vision',
                              headline: 'Wachse über dich hinaus',
                              body: lexicalRoot([
                                  lexicalParagraph(
                                      'Wir glauben, dass Talent gefördert werden muss. Unsere Education-Programme sind darauf ausgerichtet, dir nicht nur die Technik, sondern auch das Mindset für eine erfolgreiche Karriere mitzugeben.',
                                  ),
                              ]),
                          },
                      ]
                    : []),
                {
                    blockType: 'faq',
                    anchorId: 'faq',
                    title: 'Häufige Fragen zur Education',
                    description: 'Alles, was du zu unseren Workshops und Classes wissen musst.',
                    layout: 'accordion',
                    generateSchema: true,
                    items: [
                        {
                            question: 'Brauche ich Vorkenntnisse?',
                            answer: lexicalRoot([
                                lexicalParagraph(
                                    'Das kommt auf das Programm an. Open Classes und Einsteiger-Workshops benötigen keine Vorkenntnisse. Masterclasses richten sich an erfahrene Talente.',
                                ),
                            ]),
                        },
                        {
                            question: 'Bekomme ich am Ende ein Zertifikat?',
                            answer: lexicalRoot([
                                lexicalParagraph(
                                    'Ja, für alle Intensives und Industry Workshops stellen wir ein offizielles Teilnahmezertifikat von Deleyna aus.',
                                ),
                            ]),
                        },
                        {
                            question: 'Wie bewerbe ich mich?',
                            answer: lexicalRoot([
                                lexicalParagraph(
                                    'Du kannst dich direkt über unser Kontaktformular oder per E-Mail für die jeweiligen Programme anmelden.',
                                ),
                            ]),
                        },
                    ],
                },
                {
                    blockType: 'cta',
                    variant: 'default',
                    headline: 'Bereit für den nächsten Schritt?',
                    text: 'Melde dich jetzt für eines unserer Programme an und bringe deine Karriere aufs nächste Level.',
                    button: {
                        type: 'custom',
                        url: '/kontakt',
                        label: 'Jetzt anmelden',
                        appearance: 'primary',
                    },
                },
                {
                    blockType: 'slider',
                    cardStyle: 'compact',
                    sourceCollection: 'posts',
                    badgeField: 'category',
                    header: {
                        eyebrow: 'Termine',
                        heading: 'Aktuelle Classes',
                        description: 'Die nächsten Dance Classes und Workshops in Berlin.',
                    },
                    itemsLimit: 4,
                    sortBy: 'publishedAt',
                },
            ],
            pageSettings: {
                metaTitle: 'Education – Deleyna Talent Agency',
                metaDescription:
                    'Workshops, Masterclasses und Dance Classes mit professionellen Tänzern in Berlin.',
            },
        },
        {
            title: 'Education',
            hero: {
                type: 'centeredVideo',
                badge: 'Education',
                headline: 'Learn from the best',
                headlineHighlight: 'best',
                subtext:
                    'Workshops, masterclasses and ongoing courses with professional dancers and choreographers.',
                videoUrl:
                    'https://videos.pexels.com/video-files/4066516/4066516-uhd_2560_1440_25fps.mp4',
                posterImage: pickMedia(6),
                muted: true,
                loop: true,
                autoPlay: true,
                playsInline: true,
                showScrollIndicator: true,
            },
            layout: [
                {
                    blockType: 'education',
                    overline: 'Programs',
                    title: 'Our education programs',
                    description:
                        'From beginner workshops to intensive masterclasses – we offer formats for every level.',
                    programs: [
                        {
                            icon: 'graduationCap',
                            title: 'Open classes',
                            description:
                                'Open classes for all levels in various dance styles. Drop-in or bookable as course packages.',
                            duration: 'Ongoing',
                            level: 'All levels',
                        },
                        {
                            icon: 'users',
                            title: 'Masterclasses',
                            description:
                                'Intensive sessions with top choreographers and guest instructors from the international scene.',
                            duration: '2-4 hours',
                            level: 'Intermediate – Advanced',
                        },
                        {
                            icon: 'briefcase',
                            title: 'Industry workshops',
                            description:
                                'Practical workshops on topics like casting preparation, self-marketing and career planning.',
                            duration: '1 day',
                            level: 'All levels',
                        },
                        {
                            icon: 'zap',
                            title: 'Intensives',
                            description:
                                'Multi-day intensive programs focusing on technique, expression and performance.',
                            duration: '3-5 days',
                            level: 'Intermediate – Advanced',
                        },
                    ],
                    cta: {
                        type: 'custom',
                        url: '/contact',
                        label: 'Request a course',
                        appearance: 'primary',
                    },
                },
                // Audience MasonryGrid
                ...(hasSeedMedia
                    ? [
                          {
                              blockType: 'masonryGrid' as const,
                              variant: 'audience' as const,
                              badge: 'For whom?',
                              heading: 'Our programs are designed for',
                              headlineHighlight: 'programs',
                              sectionTone: 'dark' as const,
                              audienceCards: [
                                  {
                                      title: 'Dancers',
                                      description:
                                          'From open level to advanced – develop your technique, expression and stage quality.',
                                      backgroundMedia: pickMedia(0),
                                      size: 'large' as const,
                                      theme: 'dark' as const,
                                      linkStyle: 'default' as const,
                                      link: {
                                          type: 'custom' as const,
                                          url: '/become-talent',
                                          label: 'Become a talent',
                                          newTab: false,
                                      },
                                  },
                                  {
                                      title: 'Models',
                                      description:
                                          'Movement coaching and camera training for authentic posing and strong set presence.',
                                      backgroundMedia: pickMedia(3),
                                      size: 'medium' as const,
                                      theme: 'dark' as const,
                                      linkStyle: 'outline' as const,
                                      link: {
                                          type: 'custom' as const,
                                          url: '/coaching',
                                          label: 'Learn more',
                                          newTab: false,
                                      },
                                  },
                                  {
                                      title: 'Creative teams',
                                      description:
                                          'Workshops for production teams on choreography, casting workflows and talent briefings.',
                                      backgroundMedia: pickMedia(5),
                                      size: 'medium' as const,
                                      theme: 'light' as const,
                                      linkStyle: 'default' as const,
                                      link: {
                                          type: 'custom' as const,
                                          url: '/contact',
                                          label: 'Contact',
                                          newTab: false,
                                      },
                                  },
                                  {
                                      title: 'Beginners',
                                      description:
                                          'First steps in professional dance and modeling with personal mentoring.',
                                      backgroundMedia: pickMedia(7),
                                      size: 'large' as const,
                                      theme: 'dark' as const,
                                      linkStyle: 'default' as const,
                                      link: {
                                          type: 'custom' as const,
                                          url: '/education',
                                          label: 'Get started',
                                          newTab: false,
                                      },
                                  },
                              ],
                          },
                      ]
                    : []),
                {
                    blockType: 'infoCards',
                    backgroundColor: 'muted',
                    tagline: 'Deleyna Academy',
                    title: 'Your benefits',
                    cards: [
                        {
                            title: 'Industry experts',
                            description:
                                'Learn directly from active dancers, choreographers, and models from the industry.',
                        },
                        {
                            title: 'Networking',
                            description:
                                'Build valuable connections with other talents and creative minds.',
                        },
                        {
                            title: 'Career boost',
                            description:
                                'Real insights that help you succeed at castings and auditions.',
                        },
                    ],
                },
                ...(hasSeedMedia && pickMedia(2)
                    ? [
                          {
                              blockType: 'mediaContent' as const,
                              layout: 'mediaLeft' as const,
                              media: pickMedia(2),
                              tagline: 'The vision',
                              headline: 'Rise above yourself',
                              body: lexicalRoot([
                                  lexicalParagraph(
                                      'We believe that talent must be nurtured. Our education programs are designed to give you not only the technique but also the mindset for a successful career.',
                                  ),
                              ]),
                          },
                      ]
                    : []),
                {
                    blockType: 'faq',
                    anchorId: 'faq',
                    title: 'Frequently asked questions about Education',
                    description: 'Everything you need to know about our workshops and classes.',
                    layout: 'accordion',
                    generateSchema: true,
                    items: [
                        {
                            question: 'Do I need prior experience?',
                            answer: lexicalRoot([
                                lexicalParagraph(
                                    'That depends on the program. Open classes and beginner workshops require no prior experience. Masterclasses are aimed at experienced talents.',
                                ),
                            ]),
                        },
                        {
                            question: 'Will I get a certificate at the end?',
                            answer: lexicalRoot([
                                lexicalParagraph(
                                    'Yes, we issue an official Deleyna certificate of participation for all intensives and industry workshops.',
                                ),
                            ]),
                        },
                        {
                            question: 'How do I apply?',
                            answer: lexicalRoot([
                                lexicalParagraph(
                                    'You can apply directly via our contact form or by email for the respective programs.',
                                ),
                            ]),
                        },
                    ],
                },
                {
                    blockType: 'cta',
                    variant: 'default',
                    headline: 'Ready for the next step?',
                    text: 'Sign up for one of our programs now and take your career to the next level.',
                    button: {
                        type: 'custom',
                        url: '/contact',
                        label: 'Apply now',
                        appearance: 'primary',
                    },
                },
                {
                    blockType: 'slider',
                    cardStyle: 'compact',
                    sourceCollection: 'posts',
                    badgeField: 'category',
                    header: {
                        eyebrow: 'Schedule',
                        heading: 'Upcoming classes',
                        description: 'The next dance classes and workshops in Berlin.',
                    },
                    itemsLimit: 4,
                    sortBy: 'publishedAt',
                },
            ],
            pageSettings: {
                metaTitle: 'Education – Deleyna Talent Agency',
                metaDescription:
                    'Workshops, masterclasses and dance classes with professional dancers in Berlin.',
            },
        },
    )

    // ─────────────────────────────────────────────────────────────────────────
    // 8. COACHING PAGE
    // ─────────────────────────────────────────────────────────────────────────
    console.log('  📄 Coaching page...')
    await upsertPage(
        payload,
        'coaching',
        {
            title: 'Coaching',
            hero: {
                type: 'mediumImpact',
                badge: 'Personal Coaching',
                headline: 'Dein nächstes Level',
                headlineHighlight: 'Level',
                subtext:
                    'Individuelles Coaching für Tänzer und Models, die sich gezielt weiterentwickeln wollen.',
                media: pickMedia(6),
            },
            layout: [
                {
                    blockType: 'marqueeBanner',
                    text: 'DESIGNED FOR MODERN BRANDS AND TALENTS',
                    appearance: 'solid',
                    speed: 'normal',
                },
                {
                    blockType: 'coaching',
                    overline: 'Coaching',
                    title: 'Personal Coaching bei Deleyna',
                    description:
                        'Ob Casting-Vorbereitung, Technik-Training oder Karriereberatung – unsere Coaches unterstützen dich individuell und praxisnah.',
                    benefitsSubheading: 'Was du davon hast',
                    benefits: [
                        {
                            icon: 'award',
                            title: 'Casting-Sicherheit',
                            description:
                                'Gezielte Vorbereitung auf Castings und Auditions mit Feedback und Simulation.',
                        },
                        {
                            icon: 'trendingUp',
                            title: 'Technik-Verbesserung',
                            description:
                                'Individuelles Training für saubere Technik, Ausdruck und Bühnenpräsenz.',
                        },
                        {
                            icon: 'target',
                            title: 'Karriereplanung',
                            description:
                                'Gemeinsam entwickeln wir eine Strategie für deine nächsten Schritte in der Branche.',
                        },
                        {
                            icon: 'heart',
                            title: 'Mentales Coaching',
                            description:
                                'Umgang mit Nervosität, Selbstvertrauen aufbauen und deine Stärken erkennen.',
                        },
                    ],
                    coachesSubheading: 'Unsere Coaches',
                    coaches: [
                        { name: 'Leyna Müller', role: 'Performance & Karriere', available: true },
                        { name: 'David Okafor', role: 'Industry & Booking', available: true },
                        { name: 'Sarah Kim', role: 'Technik & Ausdruck', available: true },
                    ],
                    ctaText: 'Bereit für dein Coaching?',
                    cta: {
                        type: 'custom',
                        url: '/kontakt',
                        label: 'Coaching anfragen',
                        appearance: 'primary',
                    },
                },
                ...(hasSeedMedia && pickMedia(6)
                    ? [
                          {
                              blockType: 'mediaContent' as const,
                              layout: 'mediaLeft' as const,
                              media: pickMedia(6),
                              tagline: 'Performance',
                              headline: 'Technik, Ausdruck und Kamera-Präsenz gezielt ausbauen',
                              body: lexicalRoot([
                                  lexicalParagraph(
                                      'Unsere Coachings verbinden praktische Sessions mit konkretem Feedback für Castings, Set-Situationen und langfristige Entwicklung.',
                                  ),
                              ]),
                          },
                      ]
                    : []),
            ],
            pageSettings: {
                metaTitle: 'Personal Coaching – Deleyna Talent Agency',
                metaDescription:
                    'Individuelles Coaching für Tänzer und Models. Casting-Vorbereitung, Technik-Training und Karriereberatung bei Deleyna.',
            },
        },
        {
            title: 'Coaching',
            hero: {
                type: 'mediumImpact',
                badge: 'Personal Coaching',
                headline: 'Your next level',
                headlineHighlight: 'level',
                subtext: 'Individual coaching for dancers and models who want to develop further.',
                media: pickMedia(6),
            },
            layout: [
                {
                    blockType: 'marqueeBanner',
                    text: 'DESIGNED FOR MODERN BRANDS AND TALENTS',
                    appearance: 'solid',
                    speed: 'normal',
                },
                {
                    blockType: 'coaching',
                    overline: 'Coaching',
                    title: 'Personal coaching at Deleyna',
                    description:
                        'Whether casting preparation, technique training or career advice – our coaches support you individually and practically.',
                    benefitsSubheading: 'What you get',
                    benefits: [
                        {
                            icon: 'award',
                            title: 'Casting confidence',
                            description:
                                'Targeted preparation for castings and auditions with feedback and simulation.',
                        },
                        {
                            icon: 'trendingUp',
                            title: 'Technique improvement',
                            description:
                                'Individual training for clean technique, expression and stage presence.',
                        },
                        {
                            icon: 'target',
                            title: 'Career planning',
                            description:
                                'Together we develop a strategy for your next steps in the industry.',
                        },
                        {
                            icon: 'heart',
                            title: 'Mental coaching',
                            description:
                                'Dealing with nervousness, building self-confidence and recognizing your strengths.',
                        },
                    ],
                    coachesSubheading: 'Our coaches',
                    coaches: [
                        { name: 'Leyna Müller', role: 'Performance & career', available: true },
                        { name: 'David Okafor', role: 'Industry & booking', available: true },
                        { name: 'Sarah Kim', role: 'Technique & expression', available: true },
                    ],
                    ctaText: 'Ready for your coaching?',
                    cta: {
                        type: 'custom',
                        url: '/contact',
                        label: 'Request coaching',
                        appearance: 'primary',
                    },
                },
                ...(hasSeedMedia && pickMedia(6)
                    ? [
                          {
                              blockType: 'mediaContent' as const,
                              layout: 'mediaLeft' as const,
                              media: pickMedia(6),
                              tagline: 'Performance',
                              headline: 'Build technique, expression and camera presence',
                              body: lexicalRoot([
                                  lexicalParagraph(
                                      'Our coaching combines practical sessions with concrete feedback for castings, productions and long-term growth.',
                                  ),
                              ]),
                          },
                      ]
                    : []),
            ],
            pageSettings: {
                metaTitle: 'Personal Coaching – Deleyna Talent Agency',
                metaDescription:
                    'Individual coaching for dancers and models. Casting preparation, technique training and career advice at Deleyna.',
            },
        },
    )

    // ─────────────────────────────────────────────────────────────────────────
    // 9. PRIVACY / DATENSCHUTZ
    // ─────────────────────────────────────────────────────────────────────────
    console.log('  📄 Privacy page...')
    await upsertPage(
        payload,
        'privacy',
        {
            title: 'Datenschutz',
            template: 'default',
            hero: { type: 'none' },
            layout: [
                {
                    blockType: 'legalContent',
                    title: 'Datenschutzerklärung',
                    tocLabel: 'Inhaltsverzeichnis',
                    sections: [
                        {
                            heading: 'Verantwortliche Stelle',
                            content: lexicalRoot([
                                lexicalParagraph(
                                    'Verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist die Deleyna Talent Agency, Berlin, Deutschland.',
                                ),
                            ]),
                        },
                        {
                            heading: 'Erhebung und Verarbeitung personenbezogener Daten',
                            content: lexicalRoot([
                                lexicalParagraph(
                                    'Wir erheben personenbezogene Daten nur, wenn Sie uns diese im Rahmen einer Kontaktanfrage, Buchung oder Bewerbung freiwillig mitteilen.',
                                ),
                                lexicalParagraph(
                                    'Die Daten werden ausschließlich zur Bearbeitung Ihrer Anfrage und zur Durchführung vorvertraglicher bzw. vertraglicher Maßnahmen verwendet.',
                                ),
                            ]),
                        },
                        {
                            heading: 'Cookies und Einwilligungen',
                            content: lexicalRoot([
                                lexicalParagraph(
                                    'Unsere Website verwendet technisch notwendige Cookies. Optionale Analyse- und Marketing-Cookies werden nur nach Ihrer ausdrücklichen Einwilligung gesetzt.',
                                ),
                                lexicalParagraph(
                                    'Ihre Einstellungen können Sie jederzeit über den Cookie-Banner anpassen oder widerrufen.',
                                ),
                            ]),
                        },
                        {
                            heading: 'Kontaktformulare und Bewerbungen',
                            content: lexicalRoot([
                                lexicalParagraph(
                                    'Wenn Sie Formulare auf unserer Website nutzen, speichern wir die von Ihnen bereitgestellten Informationen zur Bearbeitung Ihres Anliegens.',
                                ),
                                lexicalParagraph(
                                    'Eine Weitergabe an Dritte erfolgt nur, wenn dies zur Vertragserfüllung erforderlich ist oder eine gesetzliche Verpflichtung besteht.',
                                ),
                            ]),
                        },
                        {
                            heading: 'Ihre Rechte',
                            content: lexicalRoot([
                                lexicalParagraph(
                                    'Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung und Datenübertragbarkeit nach Maßgabe der DSGVO.',
                                ),
                                lexicalParagraph(
                                    'Bei Fragen zum Datenschutz erreichen Sie uns unter datenschutz@deleyna.com.',
                                ),
                            ]),
                        },
                        {
                            heading: 'Hosting und Speicherdauer',
                            content: lexicalRoot([
                                lexicalParagraph(
                                    'Unsere Website wird auf Servern innerhalb der EU betrieben. Medien werden verschlüsselt in einem S3-kompatiblen Speicher abgelegt.',
                                ),
                                lexicalParagraph(
                                    'Wir speichern personenbezogene Daten nur so lange, wie es für den jeweiligen Zweck oder aufgrund gesetzlicher Aufbewahrungspflichten erforderlich ist.',
                                ),
                            ]),
                        },
                    ],
                    dateLabel: 'Stand: Februar 2026',
                },
            ],
            pageSettings: {
                metaTitle: 'Datenschutz – Deleyna',
                metaDescription: 'Datenschutzerklärung der Deleyna Talent Agency.',
                noIndex: true,
            },
        },
        {
            title: 'Privacy Policy',
            hero: { type: 'none' },
            layout: [
                {
                    blockType: 'legalContent',
                    title: 'Privacy Policy',
                    tocLabel: 'Table of contents',
                    sections: [
                        {
                            heading: 'Controller',
                            content: lexicalRoot([
                                lexicalParagraph(
                                    'The controller responsible for data processing on this website is Deleyna Talent Agency, Berlin, Germany.',
                                ),
                            ]),
                        },
                        {
                            heading: 'Collection and processing of personal data',
                            content: lexicalRoot([
                                lexicalParagraph(
                                    'We collect personal data only when you voluntarily provide it via contact requests, bookings, or applications.',
                                ),
                                lexicalParagraph(
                                    'Your data is used solely to handle your request and to carry out pre-contractual or contractual measures.',
                                ),
                            ]),
                        },
                        {
                            heading: 'Cookies and consent',
                            content: lexicalRoot([
                                lexicalParagraph(
                                    'Our website uses technically necessary cookies. Optional analytics and marketing cookies are set only with your explicit consent.',
                                ),
                                lexicalParagraph(
                                    'You can change or withdraw your consent at any time via the cookie banner.',
                                ),
                            ]),
                        },
                        {
                            heading: 'Contact forms and applications',
                            content: lexicalRoot([
                                lexicalParagraph(
                                    'When you use forms on our website, we store the information you provide to process your request.',
                                ),
                                lexicalParagraph(
                                    'Data is only shared with third parties if required to fulfill a contract or based on legal obligations.',
                                ),
                            ]),
                        },
                        {
                            heading: 'Your rights',
                            content: lexicalRoot([
                                lexicalParagraph(
                                    'You have rights to access, rectification, deletion, restriction of processing, and data portability according to GDPR.',
                                ),
                                lexicalParagraph(
                                    'For privacy inquiries, contact us at datenschutz@deleyna.com.',
                                ),
                            ]),
                        },
                        {
                            heading: 'Hosting and retention',
                            content: lexicalRoot([
                                lexicalParagraph(
                                    'Our website is hosted on servers within the EU. Uploaded media is stored encrypted in an S3-compatible storage.',
                                ),
                                lexicalParagraph(
                                    'We keep personal data only as long as necessary for its purpose or to comply with legal retention requirements.',
                                ),
                            ]),
                        },
                    ],
                    dateLabel: 'Last updated: February 2026',
                },
            ],
            pageSettings: {
                metaTitle: 'Privacy Policy – Deleyna',
                metaDescription: 'Privacy policy of Deleyna Talent Agency.',
                noIndex: true,
            },
        },
    )

    // ─────────────────────────────────────────────────────────────────────────
    // 10. IMPRINT / IMPRESSUM
    // ─────────────────────────────────────────────────────────────────────────
    console.log('  📄 Imprint page...')
    await upsertPage(
        payload,
        'imprint',
        {
            title: 'Impressum',
            template: 'default',
            hero: { type: 'none' },
            layout: [
                {
                    blockType: 'impressum',
                    companyName: 'Deleyna Talent Agency GmbH',
                    street: 'Musterstraße 12',
                    postalCode: '10115',
                    city: 'Berlin',
                    country: 'Deutschland',
                    phone: '+49 30 123 456 78',
                    email: 'info@deleyna.com',
                    website: 'www.deleyna.com',
                    representativesLabel: 'Geschäftsführung:',
                    representativesNames: [{ name: 'Leyna Müller' }],
                    registerCourt: 'Amtsgericht Berlin-Charlottenburg',
                    registerNumber: 'HRB 123456 B',
                    vatId: 'DE345678901',
                    contentResponsibleName: 'Leyna Müller',
                    liabilityContent: lexicalRoot([
                        lexicalParagraph(
                            'Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.',
                        ),
                        lexicalParagraph(
                            'Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen.',
                        ),
                    ]),
                    liabilityLinks: lexicalRoot([
                        lexicalParagraph(
                            'Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte keine Gewähr übernehmen.',
                        ),
                    ]),
                    copyright: lexicalRoot([
                        lexicalParagraph(
                            'Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht.',
                        ),
                    ]),
                    euDisputeIntro: lexicalRoot([
                        lexicalParagraph(
                            'Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit.',
                        ),
                    ]),
                    euDisputeUrl: 'https://ec.europa.eu/consumers/odr/',
                    euDisputeClosing: lexicalRoot([
                        lexicalParagraph(
                            'Wir sind nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.',
                        ),
                    ]),
                    dateLabel: 'Stand: Februar 2026',
                },
            ],
            pageSettings: {
                metaTitle: 'Impressum – Deleyna',
                metaDescription: 'Impressum der Deleyna Talent Agency.',
                noIndex: true,
            },
        },
        {
            title: 'Imprint',
            hero: { type: 'none' },
            layout: [
                {
                    blockType: 'impressum',
                    headingCompany: 'Company Information',
                    headingContact: 'Contact',
                    headingRepresentatives: 'Authorized Representatives',
                    headingRegister: 'Register Entry',
                    headingContentResponsible:
                        'Responsible for content according to § 55 para. 2 RStV',
                    headingDisclaimer: 'Disclaimer',
                    headingLiabilityContent: 'Liability for Content',
                    headingLiabilityLinks: 'Liability for Links',
                    headingCopyright: 'Copyright',
                    headingEuDispute: 'EU Dispute Resolution',
                    companyName: 'Deleyna Talent Agency GmbH',
                    street: 'Musterstraße 12',
                    postalCode: '10115',
                    city: 'Berlin',
                    country: 'Germany',
                    phone: '+49 30 123 456 78',
                    email: 'info@deleyna.com',
                    website: 'www.deleyna.com',
                    representativesLabel: 'Managing Director:',
                    representativesNames: [{ name: 'Leyna Müller' }],
                    registerCourt: 'Berlin-Charlottenburg Local Court',
                    registerNumber: 'HRB 123456 B',
                    vatId: 'DE345678901',
                    contentResponsibleName: 'Leyna Müller',
                    liabilityContent: lexicalRoot([
                        lexicalParagraph(
                            'As a service provider, we are responsible for our own content on these pages in accordance with § 7 para. 1 TMG and general laws.',
                        ),
                        lexicalParagraph(
                            'According to §§ 8 to 10 TMG, we are not obliged to monitor transmitted or stored third-party information.',
                        ),
                    ]),
                    liabilityLinks: lexicalRoot([
                        lexicalParagraph(
                            'Our website contains links to external third-party websites. We have no influence on their content and therefore cannot assume any liability for it.',
                        ),
                    ]),
                    copyright: lexicalRoot([
                        lexicalParagraph(
                            'Content and works created by the site operator on these pages are subject to German copyright law.',
                        ),
                    ]),
                    euDisputeIntro: lexicalRoot([
                        lexicalParagraph(
                            'The European Commission provides a platform for online dispute resolution (ODR).',
                        ),
                    ]),
                    euDisputeUrl: 'https://ec.europa.eu/consumers/odr/',
                    euDisputeClosing: lexicalRoot([
                        lexicalParagraph(
                            'We are neither obligated nor willing to participate in dispute resolution proceedings before a consumer arbitration board.',
                        ),
                    ]),
                    dateLabel: 'Last updated: February 2026',
                },
            ],
            pageSettings: {
                metaTitle: 'Imprint – Deleyna',
                metaDescription: 'Legal imprint of Deleyna Talent Agency.',
                noIndex: true,
            },
        },
    )

    // ─────────────────────────────────────────────────────────────────────────
    // 11. AGB / TERMS
    // ─────────────────────────────────────────────────────────────────────────
    console.log('  📄 AGB page...')
    await upsertPage(
        payload,
        'agb',
        {
            title: 'AGB',
            template: 'default',
            hero: { type: 'none' },
            layout: [
                {
                    blockType: 'legalContent',
                    title: 'Allgemeine Geschäftsbedingungen (AGB)',
                    tocLabel: 'Inhaltsverzeichnis',
                    sections: [
                        {
                            heading: 'Geltungsbereich',
                            content: lexicalRoot([
                                lexicalParagraph(
                                    'Diese Bedingungen gelten für alle Vermittlungs-, Beratungs- und Produktionsleistungen der Deleyna Talent Agency, sofern nicht schriftlich abweichend vereinbart.',
                                ),
                            ]),
                        },
                        {
                            heading: 'Vertragsabschluss',
                            content: lexicalRoot([
                                lexicalParagraph(
                                    'Ein Vertrag kommt durch schriftliche Bestätigung eines Angebots oder durch verbindliche Buchung zustande.',
                                ),
                                lexicalParagraph(
                                    'Mündliche Nebenabreden sind nur wirksam, wenn sie schriftlich bestätigt wurden.',
                                ),
                            ]),
                        },
                        {
                            heading: 'Leistungen und Vergütung',
                            content: lexicalRoot([
                                lexicalParagraph(
                                    'Leistungsumfang, Honorar, Nutzungsrechte und gegebenenfalls Reisekosten werden projektbezogen vereinbart.',
                                ),
                                lexicalParagraph(
                                    'Alle Preise verstehen sich, sofern nicht anders angegeben, zuzüglich gesetzlicher Umsatzsteuer.',
                                ),
                            ]),
                        },
                        {
                            heading: 'Stornierung und Ausfall',
                            content: lexicalRoot([
                                lexicalParagraph(
                                    'Bei kurzfristigen Absagen können Ausfallhonorare anfallen. Es gelten die im jeweiligen Angebot oder Vertrag definierten Stornobedingungen.',
                                ),
                            ]),
                        },
                        {
                            heading: 'Nutzungsrechte',
                            content: lexicalRoot([
                                lexicalParagraph(
                                    'Nutzungsrechte an Foto-, Video- und sonstigen Inhalten werden ausschließlich im vertraglich vereinbarten Umfang eingeräumt.',
                                ),
                                lexicalParagraph(
                                    'Jede darüber hinausgehende Nutzung bedarf einer gesonderten Vereinbarung.',
                                ),
                            ]),
                        },
                        {
                            heading: 'Haftung und Schlussbestimmungen',
                            content: lexicalRoot([
                                lexicalParagraph(
                                    'Die Haftung ist auf Vorsatz und grobe Fahrlässigkeit beschränkt. Bei leichter Fahrlässigkeit haftet Deleyna nur bei Verletzung wesentlicher Vertragspflichten und begrenzt auf den vorhersehbaren Schaden.',
                                ),
                                lexicalParagraph(
                                    'Es gilt deutsches Recht. Gerichtsstand ist, soweit gesetzlich zulässig, Berlin.',
                                ),
                            ]),
                        },
                    ],
                    dateLabel: 'Stand: Februar 2026',
                },
            ],
            pageSettings: {
                metaTitle: 'AGB – Deleyna',
                metaDescription: 'Allgemeine Geschäftsbedingungen der Deleyna Talent Agency.',
                noIndex: true,
            },
        },
        {
            title: 'Terms & Conditions',
            hero: { type: 'none' },
            layout: [
                {
                    blockType: 'legalContent',
                    title: 'Terms & Conditions',
                    tocLabel: 'Table of contents',
                    sections: [
                        {
                            heading: 'Scope',
                            content: lexicalRoot([
                                lexicalParagraph(
                                    'These terms apply to all placement, consulting and production services provided by Deleyna Talent Agency unless agreed otherwise in writing.',
                                ),
                            ]),
                        },
                        {
                            heading: 'Contract formation',
                            content: lexicalRoot([
                                lexicalParagraph(
                                    'A contract is formed upon written confirmation of an offer or a binding booking.',
                                ),
                                lexicalParagraph(
                                    'Any verbal side agreements are only valid after written confirmation.',
                                ),
                            ]),
                        },
                        {
                            heading: 'Services and remuneration',
                            content: lexicalRoot([
                                lexicalParagraph(
                                    'Scope of services, fees, usage rights and potential travel costs are agreed per project.',
                                ),
                                lexicalParagraph(
                                    'Unless otherwise stated, all prices are exclusive of statutory VAT.',
                                ),
                            ]),
                        },
                        {
                            heading: 'Cancellation and no-show',
                            content: lexicalRoot([
                                lexicalParagraph(
                                    'Short-notice cancellations may trigger cancellation fees. The cancellation terms specified in the offer or contract apply.',
                                ),
                            ]),
                        },
                        {
                            heading: 'Usage rights',
                            content: lexicalRoot([
                                lexicalParagraph(
                                    'Usage rights for photo, video and other material are granted only to the extent contractually agreed.',
                                ),
                                lexicalParagraph(
                                    'Any additional use requires a separate written agreement.',
                                ),
                            ]),
                        },
                        {
                            heading: 'Liability and final provisions',
                            content: lexicalRoot([
                                lexicalParagraph(
                                    'Liability is limited to intent and gross negligence. In cases of slight negligence, Deleyna is liable only for breaches of essential contractual obligations and limited to foreseeable typical damages.',
                                ),
                                lexicalParagraph(
                                    'German law applies. Place of jurisdiction, where legally permissible, is Berlin.',
                                ),
                            ]),
                        },
                    ],
                    dateLabel: 'Last updated: February 2026',
                },
            ],
            pageSettings: {
                metaTitle: 'Terms & Conditions – Deleyna',
                metaDescription: 'General terms and conditions of Deleyna Talent Agency.',
                noIndex: true,
            },
        },
    )

    // ─────────────────────────────────────────────────────────────────────────
    // 12. FAQ PAGE
    // ─────────────────────────────────────────────────────────────────────────
    console.log('  📄 FAQ page...')
    await upsertPage(
        payload,
        'faq',
        {
            title: 'FAQ',
            hero: {
                type: 'lowImpact',
                badge: 'FAQ',
                headline: 'Häufig gestellte Fragen',
                headlineHighlight: 'Fragen',
                subtext: 'Hier findest du Antworten auf die häufigsten Fragen rund um Deleyna.',
            },
            layout: [
                {
                    blockType: 'faq',
                    anchorId: 'allgemein',
                    title: 'Allgemein',
                    layout: 'accordion',
                    generateSchema: true,
                    items: [
                        {
                            question: 'Was ist Deleyna?',
                            answer: lexicalRoot([
                                lexicalParagraph(
                                    'Deleyna ist eine Talent-Agentur mit Sitz in Berlin, spezialisiert auf Tänzer und Models. Wir vermitteln Talente für Fotoshootings, Events, Kampagnen, TV-Produktionen und mehr.',
                                ),
                            ]),
                        },
                        {
                            question: 'Für wen ist Deleyna?',
                            answer: lexicalRoot([
                                lexicalParagraph(
                                    'Für Tänzer*innen und Models, die eine professionelle Vertretung suchen. Und für Kunden (Marken, Agenturen, Produktionsfirmen), die hochwertige Talente für ihre Projekte brauchen.',
                                ),
                            ]),
                        },
                        {
                            question: 'Wo seid ihr aktiv?',
                            answer: lexicalRoot([
                                lexicalParagraph(
                                    'Unser Hauptsitz ist Berlin. Wir vermitteln Talente europaweit und arbeiten mit Kunden in Deutschland, Österreich, der Schweiz und darüber hinaus.',
                                ),
                            ]),
                        },
                    ],
                },
                {
                    blockType: 'faq',
                    anchorId: 'talente',
                    title: 'Für Talente',
                    layout: 'accordion',
                    generateSchema: true,
                    items: [
                        {
                            question: 'Wie kann ich mich bewerben?',
                            answer: lexicalRoot([
                                lexicalParagraph(
                                    'Gehe auf unsere Seite "Talent werden" und fülle das Bewerbungsformular aus. Wir prüfen jede Bewerbung persönlich und melden uns innerhalb von 5 Werktagen.',
                                ),
                            ]),
                        },
                        {
                            question: 'Welche Voraussetzungen gibt es?',
                            answer: lexicalRoot([
                                lexicalParagraph(
                                    'Wir suchen Talente mit professioneller Erfahrung oder starkem Potenzial. Wichtig sind uns Zuverlässigkeit, Professionalität und die Bereitschaft, sich weiterzuentwickeln.',
                                ),
                            ]),
                        },
                        {
                            question: 'Bekomme ich eine Sedcard?',
                            answer: lexicalRoot([
                                lexicalParagraph(
                                    'Ja! Nach der Aufnahme in unser Roster organisieren wir ein professionelles Shooting und erstellen deine Sedcard.',
                                ),
                            ]),
                        },
                        {
                            question: 'Wie werde ich für Projekte gebucht?',
                            answer: lexicalRoot([
                                lexicalParagraph(
                                    'Wir erhalten Anfragen von Kunden und schlagen passende Talente vor. Wenn du ausgewählt wirst, klären wir gemeinsam alle Details und begleiten dich zum Set.',
                                ),
                            ]),
                        },
                    ],
                },
                {
                    blockType: 'faq',
                    anchorId: 'kunden',
                    title: 'Für Kunden',
                    layout: 'accordion',
                    generateSchema: true,
                    items: [
                        {
                            question: 'Wie buche ich ein Talent?',
                            answer: lexicalRoot([
                                lexicalParagraph(
                                    'Senden Sie uns eine Anfrage über das Kontaktformular oder per E-Mail. Beschreiben Sie Ihr Projekt und wir melden uns innerhalb von 48 Stunden mit passenden Vorschlägen.',
                                ),
                            ]),
                        },
                        {
                            question: 'Kann ich Talente vorher treffen?',
                            answer: lexicalRoot([
                                lexicalParagraph(
                                    'Ja, auf Wunsch arrangieren wir Kennenlern-Meetings oder Video-Calls vor der Buchung. So können Sie sicherstellen, dass die Chemie stimmt.',
                                ),
                            ]),
                        },
                        {
                            question: 'Was passiert bei Absage oder Verschiebung?',
                            answer: lexicalRoot([
                                lexicalParagraph(
                                    'Wir haben faire Stornierungsbedingungen. Je nach Vorlaufzeit und Umfang finden wir gemeinsam eine Lösung. Details besprechen wir im individuellen Vertrag.',
                                ),
                            ]),
                        },
                    ],
                },
                {
                    blockType: 'cta',
                    variant: 'default',
                    headline: 'Noch Fragen?',
                    text: 'Kontaktiere uns direkt – wir helfen gerne weiter.',
                    button: {
                        type: 'custom',
                        url: '/kontakt',
                        label: 'Kontakt aufnehmen',
                        appearance: 'primary',
                    },
                },
            ],
            pageSettings: {
                metaTitle: 'FAQ – Deleyna Talent Agency',
                metaDescription:
                    'Häufig gestellte Fragen rund um Deleyna, Buchungen, Bewerbungen und unsere Services.',
                schemaType: 'FAQPage',
            },
        },
        {
            title: 'FAQ',
            hero: {
                type: 'lowImpact',
                badge: 'FAQ',
                headline: 'Frequently asked questions',
                headlineHighlight: 'questions',
                subtext: 'Find answers to the most common questions about Deleyna.',
            },
            layout: [
                {
                    blockType: 'faq',
                    anchorId: 'general',
                    title: 'General',
                    layout: 'accordion',
                    generateSchema: true,
                    items: [
                        {
                            question: 'What is Deleyna?',
                            answer: lexicalRoot([
                                lexicalParagraph(
                                    'Deleyna is a talent agency based in Berlin, specializing in dancers and models. We place talents for photoshoots, events, campaigns, TV productions and more.',
                                ),
                            ]),
                        },
                        {
                            question: 'Who is Deleyna for?',
                            answer: lexicalRoot([
                                lexicalParagraph(
                                    'For dancers and models seeking professional representation. And for clients (brands, agencies, production companies) who need high-quality talents for their projects.',
                                ),
                            ]),
                        },
                        {
                            question: 'Where are you active?',
                            answer: lexicalRoot([
                                lexicalParagraph(
                                    'Our headquarters are in Berlin. We place talents across Europe and work with clients in Germany, Austria, Switzerland and beyond.',
                                ),
                            ]),
                        },
                    ],
                },
                {
                    blockType: 'faq',
                    anchorId: 'talents',
                    title: 'For talents',
                    layout: 'accordion',
                    generateSchema: true,
                    items: [
                        {
                            question: 'How can I apply?',
                            answer: lexicalRoot([
                                lexicalParagraph(
                                    'Go to our "Become a talent" page and fill out the application form. We personally review every application and get back to you within 5 business days.',
                                ),
                            ]),
                        },
                        {
                            question: 'What are the requirements?',
                            answer: lexicalRoot([
                                lexicalParagraph(
                                    'We look for talents with professional experience or strong potential. Important to us are reliability, professionalism and the willingness to develop.',
                                ),
                            ]),
                        },
                        {
                            question: 'Will I get a sedcard?',
                            answer: lexicalRoot([
                                lexicalParagraph(
                                    'Yes! After joining our roster, we organize a professional shoot and create your sedcard.',
                                ),
                            ]),
                        },
                        {
                            question: 'How do I get booked for projects?',
                            answer: lexicalRoot([
                                lexicalParagraph(
                                    'We receive requests from clients and suggest matching talents. If you are selected, we clarify all details together and accompany you to set.',
                                ),
                            ]),
                        },
                    ],
                },
                {
                    blockType: 'faq',
                    anchorId: 'clients',
                    title: 'For clients',
                    layout: 'accordion',
                    generateSchema: true,
                    items: [
                        {
                            question: 'How do I book a talent?',
                            answer: lexicalRoot([
                                lexicalParagraph(
                                    'Send us a request via the contact form or email. Describe your project and we will get back to you within 48 hours with matching proposals.',
                                ),
                            ]),
                        },
                        {
                            question: 'Can I meet talents beforehand?',
                            answer: lexicalRoot([
                                lexicalParagraph(
                                    'Yes, on request we arrange meet-and-greet meetings or video calls before booking. This way you can make sure the chemistry is right.',
                                ),
                            ]),
                        },
                        {
                            question: 'What happens in case of cancellation?',
                            answer: lexicalRoot([
                                lexicalParagraph(
                                    'We have fair cancellation terms. Depending on lead time and scope, we find a solution together. Details are discussed in the individual contract.',
                                ),
                            ]),
                        },
                    ],
                },
                {
                    blockType: 'cta',
                    variant: 'default',
                    headline: 'Still have questions?',
                    text: 'Contact us directly – we are happy to help.',
                    button: {
                        type: 'custom',
                        url: '/contact',
                        label: 'Get in touch',
                        appearance: 'primary',
                    },
                },
            ],
            pageSettings: {
                metaTitle: 'FAQ – Deleyna Talent Agency',
                metaDescription:
                    'Frequently asked questions about Deleyna, bookings, applications and our services.',
                schemaType: 'FAQPage',
            },
        },
    )

    // ─────────────────────────────────────────────────────────────────────────
    // 13. TESTIMONIALS PAGE
    // ─────────────────────────────────────────────────────────────────────────
    console.log('  📄 Testimonials page...')
    await upsertPage(
        payload,
        'testimonials',
        {
            title: 'Testimonials',
            hero: {
                type: 'mediumImpact',
                badge: 'Erfahrungen',
                headline: 'Das sagen unsere Partner',
                headlineHighlight: 'Partner',
                subtext:
                    'Echte Stimmen von Künstlern, Kunden und Produktionen, mit denen wir zusammenarbeiten.',
                media: pickMedia(2),
            },
            layout: [
                {
                    blockType: 'testimonial',
                    headline: 'Stimmen aus der Branche',
                    headlineHighlight: 'Branche',
                    backgroundColor: 'white',
                    items: [
                        {
                            quote: 'Die Talente von Deleyna haben unsere Kampagne auf ein neues Level gebracht. Professionell, kreativ und absolut zuverlässig.',
                            author: 'Sarah M.',
                            role: 'Creative Director',
                            company: 'Vogue Productions',
                            ...(pickMedia(2) ? { media: pickMedia(2) } : {}),
                        },
                        {
                            quote: 'Schnelle Kommunikation, top Talent-Auswahl und eine Agentur, die wirklich versteht, was wir brauchen.',
                            author: 'Marcus K.',
                            role: 'Head of Events',
                            company: 'Stage Berlin',
                        },
                        {
                            quote: 'Mit Deleyna arbeiten wir seit zwei Jahren zusammen — jedes Projekt wird besser als das letzte.',
                            author: 'Lisa T.',
                            role: 'Producer',
                            company: 'Motion Studio',
                            ...(pickMedia(3) ? { media: pickMedia(3) } : {}),
                        },
                        {
                            quote: 'Als Tänzer fühle ich mich hier zum ersten Mal wirklich verstanden. Das Management nimmt sich Zeit für meine persönliche Entwicklung.',
                            author: 'Julian R.',
                            role: 'Professional Dancer',
                            company: 'Deleyna Roster',
                        },
                        {
                            quote: 'Für unsere europaweite Kampagne brauchten wir 15 unterschiedliche Typen in kürzester Zeit. Deleyna hat geliefert - on point.',
                            author: 'Elena W.',
                            role: 'Casting Director',
                            company: 'Brand & Co.',
                            ...(pickMedia(5) ? { media: pickMedia(5) } : {}),
                        },
                        {
                            quote: 'Am Set war alles perfekt vorbereitet. Die Talente waren nicht nur pünktlich, sondern haben eine unglaubliche Energie mitgebracht.',
                            author: 'Tom S.',
                            role: 'Director of Photography',
                        },
                    ],
                },
                {
                    blockType: 'cta',
                    variant: 'default',
                    headline: 'Gemeinsam Großes schaffen',
                    text: 'Lassen Sie uns Ihr nächstes Projekt gemeinsam umsetzen.',
                    button: {
                        type: 'custom',
                        url: '/contact',
                        label: 'Kontakt aufnehmen',
                        appearance: 'primary',
                    },
                },
            ],
            pageSettings: {
                metaTitle: 'Testimonials – Deleyna Talent Agency',
                metaDescription:
                    'Lesen Sie, was Kunden, Talente und Produktionsfirmen über die Zusammenarbeit mit Deleyna sagen.',
            },
        },
        {
            title: 'Testimonials',
            hero: {
                type: 'mediumImpact',
                badge: 'Experiences',
                headline: 'What our partners say',
                headlineHighlight: 'partners',
                subtext: 'Real voices from artists, clients and productions we collaborate with.',
                media: pickMedia(2),
            },
            layout: [
                {
                    blockType: 'testimonial',
                    headline: 'Industry voices',
                    headlineHighlight: 'Industry',
                    backgroundColor: 'white',
                    items: [
                        {
                            quote: "Deleyna's talents took our campaign to the next level. Professional, creative and absolutely reliable.",
                            author: 'Sarah M.',
                            role: 'Creative Director',
                            company: 'Vogue Productions',
                            ...(pickMedia(2) ? { media: pickMedia(2) } : {}),
                        },
                        {
                            quote: 'Fast communication, excellent talent curation and an agency that truly understands what we need.',
                            author: 'Marcus K.',
                            role: 'Head of Events',
                            company: 'Stage Berlin',
                        },
                        {
                            quote: "We've been working with Deleyna for two years — every project gets better than the last.",
                            author: 'Lisa T.',
                            role: 'Producer',
                            company: 'Motion Studio',
                            ...(pickMedia(3) ? { media: pickMedia(3) } : {}),
                        },
                        {
                            quote: 'As a dancer, I feel truly understood here for the first time. The management takes time for my personal development.',
                            author: 'Julian R.',
                            role: 'Professional Dancer',
                            company: 'Deleyna Roster',
                        },
                        {
                            quote: 'For our europe-wide campaign we needed 15 different types in a very short time. Deleyna delivered - on point.',
                            author: 'Elena W.',
                            role: 'Casting Director',
                            company: 'Brand & Co.',
                            ...(pickMedia(5) ? { media: pickMedia(5) } : {}),
                        },
                        {
                            quote: 'On set everything was perfectly prepared. The talents were not only punctual, but brought an incredible energy.',
                            author: 'Tom S.',
                            role: 'Director of Photography',
                        },
                    ],
                },
                {
                    blockType: 'cta',
                    variant: 'default',
                    headline: 'Create something great together',
                    text: "Let's realize your next project together.",
                    button: {
                        type: 'custom',
                        url: '/contact',
                        label: 'Get in touch',
                        appearance: 'primary',
                    },
                },
            ],
            pageSettings: {
                metaTitle: 'Testimonials – Deleyna Talent Agency',
                metaDescription:
                    'Read what clients, talents and production companies say about collaborating with Deleyna.',
            },
        },
    )

    // ─────────────────────────────────────────────────────────────────────────
    // Update Globals: TalentsArchive + PostsArchive
    // ─────────────────────────────────────────────────────────────────────────
    console.log('  📄 Updating TalentsArchive...')
    try {
        await payload.updateGlobal({
            slug: 'talents-archive',
            locale: 'de',
            data: {
                showcaseEnabled: true,
                showcaseMode: 'featured',
                showcaseMaxSlides: 6,
                showcaseAutoplay: true,
                heroHeadline: 'Unsere Talente',
                heroDescription:
                    'Entdecken Sie unser kuratiertes Roster aus Tänzern und Models – bereit für Ihr nächstes Projekt.',
                showFilters: true,
                filterLabels: {
                    all: 'Alle',
                    dancers: 'Tänzer',
                    models: 'Models',
                },
                showHairFilter: true,
                showEyeFilter: true,
                showSkillsFilter: true,
                showCta: true,
                ctaHeadline: 'Das passende Talent nicht gefunden?',
                ctaDescription:
                    'Kontaktieren Sie uns – wir finden die perfekte Besetzung für Ihr Projekt.',
                ctaButton: [
                    {
                        link: {
                            type: 'custom',
                            url: '/kontakt',
                            label: 'Kontakt aufnehmen',
                            appearance: 'primary',
                            newTab: false,
                            reference: null,
                        },
                    },
                ],
                metaTitle: 'Talente – Deleyna Talent Agency',
                metaDescription:
                    'Entdecken Sie unser Roster aus professionellen Tänzern und Models. Jetzt Talent finden und buchen.',
            } as any,
            context: { disableRevalidate: true },
        })
        await payload.updateGlobal({
            slug: 'talents-archive',
            locale: 'en',
            data: {
                heroHeadline: 'Our talents',
                heroDescription:
                    'Discover our curated roster of dancers and models – ready for your next project.',
                filterLabels: {
                    all: 'All',
                    dancers: 'Dancers',
                    models: 'Models',
                },
                ctaHeadline: "Haven't found the right talent?",
                ctaDescription: 'Contact us – we find the perfect casting for your project.',
                ctaButton: [
                    {
                        link: {
                            type: 'custom',
                            url: '/contact',
                            label: 'Contact us',
                            appearance: 'primary',
                            newTab: false,
                            reference: null,
                        },
                    },
                ],
                metaTitle: 'Talents – Deleyna Talent Agency',
                metaDescription:
                    'Discover our roster of professional dancers and models. Find and book your talent now.',
            } as any,
            context: { disableRevalidate: true },
        })
        console.log('  ✅ Updated TalentsArchive (DE/EN)')
    } catch (e) {
        console.log('  ⚠️  TalentsArchive update error:', e)
    }

    console.log('  📄 Updating PostsArchive...')
    try {
        await payload.updateGlobal({
            slug: 'posts-archive',
            locale: 'de',
            data: {
                heroHeadline: 'Magazin',
                heroDescription:
                    'News, Insights, Dance Class Ankündigungen und Blicke hinter die Kulissen der Deleyna-Welt.',
                postsPerPage: 12,
                showCategories: true,
                showFeatured: true,
                showCta: true,
                ctaHeadline: 'Du möchtest auf dem Laufenden bleiben?',
                ctaDescription:
                    'Folge uns auf Instagram für die neuesten Updates, Behind-the-Scenes und Class-Ankündigungen.',
                metaTitle: 'Magazin – Deleyna Talent Agency',
                metaDescription:
                    'News, Insights und Dance Class Ankündigungen aus der Deleyna-Welt.',
            } as any,
            context: { disableRevalidate: true },
        })
        await payload.updateGlobal({
            slug: 'posts-archive',
            locale: 'en',
            data: {
                heroHeadline: 'Magazine',
                heroDescription:
                    'News, insights, dance class announcements and behind-the-scenes looks from the Deleyna world.',
                ctaHeadline: 'Want to stay up to date?',
                ctaDescription:
                    'Follow us on Instagram for the latest updates, behind-the-scenes and class announcements.',
                metaTitle: 'Magazine – Deleyna Talent Agency',
                metaDescription:
                    'News, insights and dance class announcements from the Deleyna world.',
            } as any,
            context: { disableRevalidate: true },
        })
        console.log('  ✅ Updated PostsArchive (DE/EN)')
    } catch (e) {
        console.log('  ⚠️  PostsArchive update error:', e)
    }

    // SEED COOKIE BANNER FOR DE/EN
    console.log('  🍪 Seeding Cookie Banner (DE/EN)...')
    try {
        const COOKIE_BANNER_DEFAULTS = {
            enabled: true,
            trigger: { placement: 'floating' },
            banner: {
                title: 'Cookie-Einstellungen',
                description:
                    'Wir verwenden Cookies, um dir die bestmögliche Erfahrung auf unserer Website zu bieten. Du kannst deine Einstellungen jederzeit anpassen.',
                acceptAllLabel: 'Alle akzeptieren',
                rejectLabel: 'Nur notwendige',
                settingsLabel: 'Einstellungen',
                saveLabel: 'Auswahl speichern',
            },
            modal: {
                title: 'Cookie-Einstellungen verwalten',
                description:
                    'Hier kannst du deine Cookie-Präferenzen anpassen. Notwendige Cookies sind für die Grundfunktionen der Website erforderlich.',
            },
            policies: { privacyPolicyLabel: 'Datenschutzerklärung' },
            necessary: {
                enabled: true,
                required: true,
                label: 'Notwendig',
                description:
                    'Diese Cookies sind für die Grundfunktionen der Website erforderlich und können nicht deaktiviert werden.',
            },
            analytics: {
                enabled: true,
                required: false,
                label: 'Analyse',
                description:
                    'Diese Cookies helfen uns zu verstehen, wie Besucher mit unserer Website interagieren.',
            },
            marketing: {
                enabled: false,
                required: false,
                label: 'Marketing',
                description:
                    'Diese Cookies werden verwendet, um Werbung relevanter für dich zu machen.',
            },
        }

        const COOKIE_BANNER_EN = {
            enabled: true,
            trigger: { placement: 'floating' },
            banner: {
                title: 'Cookie Settings',
                description:
                    'We use cookies to offer you the best possible website experience. You can adjust your preferences at any time.',
                acceptAllLabel: 'Accept All',
                rejectLabel: 'Essential Only',
                settingsLabel: 'Settings',
                saveLabel: 'Save Selection',
            },
            modal: {
                title: 'Manage Cookie Preferences',
                description:
                    'Here you can customize your cookie preferences. Essential cookies are required for the basic functionality of the website.',
            },
            policies: { privacyPolicyLabel: 'Privacy Policy' },
            necessary: {
                enabled: true,
                required: true,
                label: 'Essential',
                description:
                    'These cookies are required for basic website functionality and cannot be disabled.',
            },
            analytics: {
                enabled: true,
                required: false,
                label: 'Analytics',
                description:
                    'These cookies help us understand how visitors interact with our website.',
            },
            marketing: {
                enabled: false,
                required: false,
                label: 'Marketing',
                description: 'These cookies are used to make advertising more relevant to you.',
            },
        }

        await payload.updateGlobal({
            slug: 'cookie-banner',
            locale: 'de',
            data: COOKIE_BANNER_DEFAULTS as any,
            context: { disableRevalidate: true },
        })

        await payload.updateGlobal({
            slug: 'cookie-banner',
            locale: 'en',
            data: COOKIE_BANNER_EN as any,
            context: { disableRevalidate: true },
        })
        console.log('  ✅ Created/Updated cookie banner global (DE/EN)')
    } catch (e) {
        console.log('  ⚠️  Cookie Banner update error:', e)
    }

    // Footer is seeded separately in footerSeeder (after full content) to avoid schema drift.
    console.log('  ℹ️  Footer update skipped here (handled in footerSeeder)')

    console.log('')
    console.log('  🎉 Full content seeding complete!')
    console.log(
        '  Pages created/updated: home, about, services, talent-werden, contact, booking, education, coaching, privacy, imprint, agb, faq, testimonials',
    )
    console.log('  Globals updated: TalentsArchive (DE/EN), PostsArchive (DE/EN)')
}
