import type { Payload } from 'payload'

type FooterPageRefs = {
    agbPageId: number | null
    aboutPageId: number | null
    becomeTalentPageId: number | null
    bookingPageId: number | null
    coachingPageId: number | null
    contactPageId: number | null
    educationPageId: number | null
    faqPageId: number | null
    homePageId: number | null
    imprintPageId: number | null
    privacyPageId: number | null
    servicesPageId: number | null
    testimonialsPageId: number | null
}

type ExistingFooterRows = {
    bottomLinks?: Array<{ id?: number | null } | null> | null
    columns?: Array<{
        id?: number | null
        links?: Array<{ id?: number | null } | null> | null
    } | null> | null
}

function pageOrUrlLink(
    pageId: number | null,
    fallbackUrl: string,
    label: string,
): {
    label: string
    page: number | null
    url: string | null
    newTab: boolean
} {
    if (pageId) {
        return {
            label,
            page: pageId,
            url: null,
            newTab: false,
        }
    }

    return {
        label,
        page: null,
        url: fallbackUrl,
        newTab: false,
    }
}

function withId<T extends Record<string, unknown>>(
    id: number | null | undefined,
    data: T,
): T & { id?: number } {
    if (typeof id === 'number') {
        return { id, ...data }
    }
    return data
}

function buildFooterData(
    locale: 'de' | 'en',
    refs: FooterPageRefs,
    existingRows?: ExistingFooterRows,
) {
    const localized = {
        de: {
            description: 'Elite-Vertretung für Tänzer & Models. Wo Kunst auf Gelegenheit trifft.',
            navigationAbout: 'Über uns',
            navigationBlog: 'Magazin',
            navigationTalents: 'Talente',
            navigationTestimonials: 'Testimonials',
            servicesBooking: 'Booking',
            servicesBecomeTalent: 'Talent werden',
            infoContact: 'Kontakt',
            infoImprint: 'Impressum',
            infoPrivacy: 'Datenschutz',
            infoTerms: 'AGB',
            contactTitle: 'Kontakt',
            contactAddress: 'Deleyna Talent Agency\nBerlin, Deutschland',
            copyright: '© {year} Deleyna. Alle Rechte vorbehalten.',
            bottomPrivacy: 'Datenschutz',
            bottomImprint: 'Impressum',
            bottomTerms: 'AGB',
        },
        en: {
            description: 'Elite representation for dancers & models. Where art meets opportunity.',
            navigationAbout: 'About us',
            navigationBlog: 'Magazine',
            navigationTalents: 'Talents',
            navigationTestimonials: 'Testimonials',
            servicesBooking: 'Booking request',
            servicesBecomeTalent: 'Become a talent',
            infoContact: 'Contact',
            infoImprint: 'Imprint',
            infoPrivacy: 'Privacy',
            infoTerms: 'Terms',
            contactTitle: 'Contact',
            contactAddress: 'Deleyna Talent Agency\nBerlin, Germany',
            copyright: '© {year} Deleyna. All rights reserved.',
            bottomPrivacy: 'Privacy',
            bottomImprint: 'Imprint',
            bottomTerms: 'Terms',
        },
    }[locale]

    return {
        description: localized.description,
        columns: [
            withId(existingRows?.columns?.[0]?.id, {
                title: 'Navigation',
                links: [
                    withId(
                        existingRows?.columns?.[0]?.links?.[0]?.id,
                        pageOrUrlLink(refs.homePageId, '/', 'Home'),
                    ),
                    withId(
                        existingRows?.columns?.[0]?.links?.[1]?.id,
                        pageOrUrlLink(refs.aboutPageId, '/about', localized.navigationAbout),
                    ),
                    withId(existingRows?.columns?.[0]?.links?.[2]?.id, {
                        label: localized.navigationTalents,
                        page: null,
                        url: '/talents',
                        newTab: false,
                    }),
                    withId(existingRows?.columns?.[0]?.links?.[3]?.id, {
                        label: localized.navigationBlog,
                        page: null,
                        url: '/blog',
                        newTab: false,
                    }),
                    withId(
                        existingRows?.columns?.[0]?.links?.[4]?.id,
                        pageOrUrlLink(
                            refs.testimonialsPageId,
                            '/testimonials',
                            localized.navigationTestimonials,
                        ),
                    ),
                ],
            }),
            withId(existingRows?.columns?.[1]?.id, {
                title: 'Services',
                links: [
                    withId(
                        existingRows?.columns?.[1]?.links?.[0]?.id,
                        pageOrUrlLink(refs.servicesPageId, '/services', 'Services'),
                    ),
                    withId(
                        existingRows?.columns?.[1]?.links?.[1]?.id,
                        pageOrUrlLink(refs.educationPageId, '/education', 'Education'),
                    ),
                    withId(
                        existingRows?.columns?.[1]?.links?.[2]?.id,
                        pageOrUrlLink(refs.coachingPageId, '/coaching', 'Coaching'),
                    ),
                    withId(
                        existingRows?.columns?.[1]?.links?.[3]?.id,
                        pageOrUrlLink(refs.bookingPageId, '/booking', localized.servicesBooking),
                    ),
                    withId(
                        existingRows?.columns?.[1]?.links?.[4]?.id,
                        pageOrUrlLink(
                            refs.becomeTalentPageId,
                            '/talent-werden',
                            localized.servicesBecomeTalent,
                        ),
                    ),
                ],
            }),
            withId(existingRows?.columns?.[2]?.id, {
                title: 'Info',
                links: [
                    withId(
                        existingRows?.columns?.[2]?.links?.[0]?.id,
                        pageOrUrlLink(refs.faqPageId, '/faq', 'FAQ'),
                    ),
                    withId(
                        existingRows?.columns?.[2]?.links?.[1]?.id,
                        pageOrUrlLink(refs.contactPageId, '/contact', localized.infoContact),
                    ),
                    withId(existingRows?.columns?.[2]?.links?.[2]?.id, {
                        label: 'Jobs',
                        page: null,
                        url: '/jobs',
                        newTab: false,
                    }),
                    withId(
                        existingRows?.columns?.[2]?.links?.[3]?.id,
                        pageOrUrlLink(refs.privacyPageId, '/privacy', localized.infoPrivacy),
                    ),
                    withId(
                        existingRows?.columns?.[2]?.links?.[4]?.id,
                        pageOrUrlLink(refs.imprintPageId, '/imprint', localized.infoImprint),
                    ),
                    withId(
                        existingRows?.columns?.[2]?.links?.[5]?.id,
                        pageOrUrlLink(refs.agbPageId, '/agb', localized.infoTerms),
                    ),
                ],
            }),
        ],
        contact: {
            showContact: true,
            title: localized.contactTitle,
            email: 'info@deleyna.com',
            phone: '+49 30 123 456 78',
            address: localized.contactAddress,
        },
        socialLinks: [
            { platform: 'instagram', url: 'https://instagram.com/deleyna' },
            { platform: 'linkedin', url: 'https://linkedin.com/company/deleyna' },
            { platform: 'youtube', url: 'https://youtube.com/@deleyna' },
        ],
        copyright: localized.copyright,
        bottomLinks: [
            withId(existingRows?.bottomLinks?.[0]?.id, {
                label: localized.bottomPrivacy,
                page: refs.privacyPageId,
                url: refs.privacyPageId ? null : '/privacy',
            }),
            withId(existingRows?.bottomLinks?.[1]?.id, {
                label: localized.bottomImprint,
                page: refs.imprintPageId,
                url: refs.imprintPageId ? null : '/imprint',
            }),
            withId(existingRows?.bottomLinks?.[2]?.id, {
                label: localized.bottomTerms,
                page: refs.agbPageId,
                url: refs.agbPageId ? null : '/agb',
            }),
        ],
        showCookieSettings: true,
    }
}

export async function footerSeeder(payload: Payload) {
    console.log('📦 Seeding footer...')

    try {
        const pages = await payload.find({
            collection: 'pages',
            limit: 50,
            depth: 0,
        })

        const findPageId = (slug: string) => pages.docs.find((p) => p.slug === slug)?.id ?? null
        const warnMissing = (slug: string, fallbackUrl: string) => {
            if (!findPageId(slug)) {
                console.warn(
                    `  ⚠️ Footer seed: page "${slug}" not found, using fallback URL "${fallbackUrl}"`,
                )
            }
        }

        const homePageId = findPageId('home')
        const aboutPageId = findPageId('about')
        const servicesPageId = findPageId('services')
        const educationPageId = findPageId('education')
        const coachingPageId = findPageId('coaching')
        const bookingPageId = findPageId('booking')
        const becomeTalentPageId = findPageId('talent-werden')
        const faqPageId = findPageId('faq')
        const contactPageId = findPageId('contact')
        const privacyPageId = findPageId('privacy')
        const imprintPageId = findPageId('imprint')
        const agbPageId = findPageId('agb')
        const testimonialsPageId = findPageId('testimonials')

        warnMissing('home', '/')
        warnMissing('about', '/about')
        warnMissing('services', '/services')
        warnMissing('education', '/education')
        warnMissing('coaching', '/coaching')
        warnMissing('booking', '/booking')
        warnMissing('talent-werden', '/talent-werden')
        warnMissing('faq', '/faq')
        warnMissing('contact', '/contact')
        warnMissing('privacy', '/privacy')
        warnMissing('imprint', '/imprint')
        warnMissing('agb', '/agb')
        warnMissing('testimonials', '/testimonials')

        const refs: FooterPageRefs = {
            homePageId,
            aboutPageId,
            servicesPageId,
            educationPageId,
            coachingPageId,
            bookingPageId,
            becomeTalentPageId,
            faqPageId,
            contactPageId,
            privacyPageId,
            imprintPageId,
            agbPageId,
            testimonialsPageId,
        }

        const deDoc = await payload.updateGlobal({
            slug: 'footer',
            locale: 'de',
            data: buildFooterData('de', refs) as any,
            context: { disableRevalidate: true },
        })

        await payload.updateGlobal({
            slug: 'footer',
            locale: 'en',
            data: buildFooterData('en', refs, deDoc as ExistingFooterRows) as any,
            context: { disableRevalidate: true },
        })

        console.log('  ✅ Created/Updated footer global (DE/EN)')
        return { created: true, skipped: false }
    } catch (error) {
        console.error('  ❌ Error seeding footer:', error)
        throw error
    }
}
