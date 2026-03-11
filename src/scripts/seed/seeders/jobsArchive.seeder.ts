import type { Payload } from 'payload'

export async function jobsArchiveSeeder(payload: Payload) {
    console.log('📦 Seeding Jobs Archive global...')

    await payload.updateGlobal({
        slug: 'jobs-archive',
        data: {
            heroOverline: 'Jobs',
            heroHeadline: 'Offene Stellen',
            heroDescription:
                'Entdecke aktuelle Job-Angebote und Möglichkeiten bei Deleyna.',
            enabled: true,
            jobsPerPage: 12,
            emptyStateText: 'Aktuell keine offenen Stellen. Schau bald wieder vorbei!',
            showCta: true,
            ctaBadge: 'Job-Anfrage',
            ctaHeadline: 'Stellenangebot oder Kooperation',
            ctaDescription:
                'Sie haben eine offene Stelle oder suchen einen Kooperationspartner? Schicken Sie uns Ihre Anfrage.',
            ctaLink: {
                type: 'custom',
                url: '/job-anfrage',
                label: 'Job-Anfrage stellen',
                appearance: 'primary',
            },
            metaTitle: 'Jobs | Deleyna Talent Agency',
            metaDescription:
                'Aktuelle Job-Angebote und Ausschreibungen bei Deleyna. Jetzt bewerben oder eigene Stellen anfragen.',
        } as any,
        locale: 'de',
        context: { disableRevalidate: true },
    })

    await payload.updateGlobal({
        slug: 'jobs-archive',
        data: {
            heroOverline: 'Jobs',
            heroHeadline: 'Open Positions',
            heroDescription:
                'Discover current job openings and opportunities at Deleyna.',
            enabled: true,
            jobsPerPage: 12,
            emptyStateText: 'No open positions right now. Check back soon!',
            showCta: true,
            ctaBadge: 'Job Inquiry',
            ctaHeadline: 'Job Offer or Collaboration',
            ctaDescription:
                'Have an open position or looking for a collaboration partner? Send us your inquiry.',
            ctaLink: {
                type: 'custom',
                url: '/job-inquiry',
                label: 'Submit job inquiry',
                appearance: 'primary',
            },
            metaTitle: 'Jobs | Deleyna Talent Agency',
            metaDescription:
                'Current job listings and openings at Deleyna. Apply now or submit your own job inquiry.',
        } as any,
        locale: 'en',
        context: { disableRevalidate: true },
    })

    console.log('  ✅ Jobs Archive (DE + EN) set')
    return { created: true }
}
