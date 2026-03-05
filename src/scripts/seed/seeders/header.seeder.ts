import type { Payload } from 'payload'

function referencePage(id: number | undefined, fallbackUrl: string, label?: string): any {
    if (!id) {
        return {
            type: 'custom',
            url: fallbackUrl,
            label,
            newTab: false,
            trackClicks: false,
        }
    }

    return {
        type: 'reference',
        reference: {
            relationTo: 'pages',
            value: id,
        },
        url: null,
        archive: null,
        label,
        newTab: false,
        trackClicks: false,
    }
}

function archiveLink(archive: 'posts' | 'talents', label: string): any {
    return {
        type: 'archive',
        archive,
        url: null,
        reference: null,
        label,
        newTab: false,
        trackClicks: false,
    }
}

export async function headerSeeder(payload: Payload) {
    console.log('📦 Seeding header...')

    try {
        const pages = await payload.find({
            collection: 'pages',
            limit: 50,
            depth: 0,
        })

        const findPageId = (slug: string) => pages.docs.find((p) => p.slug === slug)?.id
        const warnMissing = (slug: string, fallbackUrl: string) => {
            if (!findPageId(slug)) {
                console.warn(
                    `  ⚠️ Header seed: page "${slug}" not found, using fallback URL "${fallbackUrl}"`,
                )
            }
        }

        const aboutPageId = findPageId('about')
        const contactPageId = findPageId('contact')
        const servicesPageId = findPageId('services')
        const bookingPageId = findPageId('booking')
        const talentBecomePageId = findPageId('talent-werden')
        const educationPageId = findPageId('education')
        const coachingPageId = findPageId('coaching')
        const faqPageId = findPageId('faq')
        const testimonialsPageId = findPageId('testimonials')

        warnMissing('about', '/about')
        warnMissing('contact', '/contact')
        warnMissing('services', '/services')
        warnMissing('booking', '/booking')
        warnMissing('talent-werden', '/talent-werden')
        warnMissing('education', '/education')
        warnMissing('coaching', '/coaching')
        warnMissing('faq', '/faq')
        warnMissing('testimonials', '/testimonials')

        const shared = {
            languageSwitcherPlacement: 'header-footer',
            themeTogglePlacement: 'header',
        } as const

        await payload.updateGlobal({
            slug: 'header',
            locale: 'de',
            data: {
                ...shared,
                cardNavItems: [
                    {
                        label: 'Agentur',
                        mediaDisplay: 'image',
                        links: [
                            {
                                link: referencePage(aboutPageId, '/about', 'Über uns'),
                                icon: 'Building2',
                            },
                            {
                                link: referencePage(coachingPageId, '/coaching', 'Coaching'),
                                icon: 'UserRound',
                            },
                            {
                                link: referencePage(
                                    testimonialsPageId,
                                    '/testimonials',
                                    'Testimonials',
                                ),
                                icon: 'MessageSquareQuote',
                            },
                            {
                                link: referencePage(faqPageId, '/faq', 'FAQ'),
                                icon: 'CircleHelp',
                            },
                        ],
                    },
                    {
                        label: 'Talente',
                        labelLink: archiveLink('talents', 'Talente'),
                        mediaDisplay: 'image',
                        links: [
                            {
                                link: archiveLink('talents', 'Alle Talente'),
                                icon: 'Users',
                            },
                            {
                                link: referencePage(
                                    talentBecomePageId,
                                    '/talent-werden',
                                    'Als Talent bewerben',
                                ),
                                icon: 'Sparkles',
                            },
                            {
                                link: referencePage(bookingPageId, '/booking', 'Booking-Anfrage'),
                                icon: 'CalendarCheck',
                            },
                        ],
                    },
                    {
                        label: 'Services',
                        labelLink: referencePage(servicesPageId, '/services', 'Services'),
                        mediaDisplay: 'image',
                        links: [
                            {
                                link: referencePage(educationPageId, '/education', 'Education'),
                                icon: 'GraduationCap',
                            },
                            {
                                link: referencePage(coachingPageId, '/coaching', 'Coaching'),
                                icon: 'UserRound',
                            },
                            {
                                link: referencePage(bookingPageId, '/booking', 'Booking-Anfrage'),
                                icon: 'CalendarCheck',
                            },
                        ],
                    },
                    {
                        label: 'Magazin',
                        labelLink: archiveLink('posts', 'Magazin'),
                        mediaDisplay: 'latestBlog',
                        links: [
                            {
                                link: archiveLink('posts', 'Alle Artikel'),
                                icon: 'BookOpen',
                            },
                        ],
                    },
                    {
                        label: 'Kontakt',
                        labelLink: referencePage(contactPageId, '/contact', 'Kontakt'),
                        mediaDisplay: 'image',
                        links: [
                            {
                                link: referencePage(contactPageId, '/contact', 'Kontakt aufnehmen'),
                                icon: 'Mail',
                            },
                            {
                                link: referencePage(faqPageId, '/faq', 'FAQ / Support'),
                                icon: 'CircleHelp',
                            },
                        ],
                    },
                ],
                ctaButtons: [
                    {
                        link: {
                            ...referencePage(bookingPageId, '/booking', 'Projekt anfragen'),
                            appearance: 'primary-pill',
                        },
                    },
                    {
                        link: {
                            ...referencePage(
                                talentBecomePageId,
                                '/talent-werden',
                                'Als Talent bewerben',
                            ),
                            appearance: 'secondary-glass',
                        },
                    },
                ],
            } as any,
            context: { disableRevalidate: true },
        })

        await payload.updateGlobal({
            slug: 'header',
            locale: 'en',
            data: {
                ...shared,
                cardNavItems: [
                    {
                        label: 'Agency',
                        mediaDisplay: 'image',
                        links: [
                            {
                                link: referencePage(aboutPageId, '/about', 'About us'),
                                icon: 'Building2',
                            },
                            {
                                link: referencePage(coachingPageId, '/coaching', 'Coaching'),
                                icon: 'UserRound',
                            },
                            {
                                link: referencePage(
                                    testimonialsPageId,
                                    '/testimonials',
                                    'Testimonials',
                                ),
                                icon: 'MessageSquareQuote',
                            },
                            {
                                link: referencePage(faqPageId, '/faq', 'FAQ'),
                                icon: 'CircleHelp',
                            },
                        ],
                    },
                    {
                        label: 'Talents',
                        labelLink: archiveLink('talents', 'Talents'),
                        mediaDisplay: 'image',
                        links: [
                            {
                                link: archiveLink('talents', 'All talents'),
                                icon: 'Users',
                            },
                            {
                                link: referencePage(
                                    talentBecomePageId,
                                    '/talent-werden',
                                    'Apply as talent',
                                ),
                                icon: 'Sparkles',
                            },
                            {
                                link: referencePage(bookingPageId, '/booking', 'Booking request'),
                                icon: 'CalendarCheck',
                            },
                        ],
                    },
                    {
                        label: 'Services',
                        labelLink: referencePage(servicesPageId, '/services', 'Services'),
                        mediaDisplay: 'image',
                        links: [
                            {
                                link: referencePage(educationPageId, '/education', 'Education'),
                                icon: 'GraduationCap',
                            },
                            {
                                link: referencePage(coachingPageId, '/coaching', 'Coaching'),
                                icon: 'UserRound',
                            },
                            {
                                link: referencePage(bookingPageId, '/booking', 'Booking Request'),
                                icon: 'CalendarCheck',
                            },
                        ],
                    },
                    {
                        label: 'Magazine',
                        labelLink: archiveLink('posts', 'Magazine'),
                        mediaDisplay: 'latestBlog',
                        links: [
                            {
                                link: archiveLink('posts', 'All Articles'),
                                icon: 'BookOpen',
                            },
                        ],
                    },
                    {
                        label: 'Contact',
                        labelLink: referencePage(contactPageId, '/contact', 'Contact'),
                        mediaDisplay: 'image',
                        links: [
                            {
                                link: referencePage(contactPageId, '/contact', 'Reach out'),
                                icon: 'Mail',
                            },
                            {
                                link: referencePage(faqPageId, '/faq', 'Support / FAQ'),
                                icon: 'CircleHelp',
                            },
                        ],
                    },
                ],
                ctaButtons: [
                    {
                        link: {
                            ...referencePage(bookingPageId, '/booking', 'Project request'),
                            appearance: 'primary-pill',
                        },
                    },
                    {
                        link: {
                            ...referencePage(
                                talentBecomePageId,
                                '/talent-werden',
                                'Apply as talent',
                            ),
                            appearance: 'secondary-glass',
                        },
                    },
                ],
            } as any,
            context: { disableRevalidate: true },
        })

        console.log('  ✅ Created/Updated header global (DE/EN)')
        return { created: true, skipped: false }
    } catch (error) {
        console.error('  ❌ Error seeding header:', error)
        throw error
    }
}
