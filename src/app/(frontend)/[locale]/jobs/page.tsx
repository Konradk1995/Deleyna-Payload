import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import { Briefcase, MapPin, CalendarDays } from 'lucide-react'

import { SectionHeader } from '@/components/SectionHeader'
import { Breadcrumb } from '@/components/Breadcrumb'
import { FormBlock } from '@/blocks/Form/Component'
import { JobListSchema } from '@/components/seo/JobPostingSchema'
import { CMSLink } from '@/components/CMSLink'

import type { Metadata } from 'next'
import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'
import type { Media } from '@/payload-types'

export const revalidate = 3600

type PageProps = {
    params: Promise<{ locale: string }>
}

async function getArchiveData(locale: string) {
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    const archive = await payload.findGlobal({
        slug: 'jobs-archive',
        locale: locale as 'de' | 'en',
    })

    return { payload, archive }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { locale } = await params
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

    let archive: any = null
    try {
        const { archive: a } = await getArchiveData(locale)
        archive = a
    } catch {
        // fallback
    }

    const title = archive?.metaTitle || (locale === 'de' ? 'Jobs – Deleyna' : 'Jobs – Deleyna')
    const description =
        archive?.metaDescription ||
        (locale === 'de'
            ? 'Aktuelle Job-Angebote und Ausschreibungen bei Deleyna. Jetzt bewerben oder eigene Stellen anfragen.'
            : 'Current job listings and openings at Deleyna. Apply now or submit your own job inquiry.')
    const keywords = (archive as any)?.metaKeywords as string | undefined

    // Resolve OG image: archive ogImage > global logo
    let ogImageUrl: string | undefined
    const archiveOg = archive?.ogImage
    if (archiveOg && typeof archiveOg === 'object') {
        const url = (archiveOg as Media).url
        if (url) ogImageUrl = url.startsWith('http') ? url : `${baseUrl}${url}`
    }
    if (!ogImageUrl) {
        try {
            const payloadConfig = await config
            const payload = await getPayload({ config: payloadConfig })
            const seo = await payload.findGlobal({ slug: 'seo', locale: locale as 'de' | 'en' })
            const logo = seo?.socialMedia?.logo
            if (logo && typeof logo === 'object') {
                const url = (logo as Media).url
                if (url) ogImageUrl = url.startsWith('http') ? url : `${baseUrl}${url}`
            }
        } catch {
            /* ignore */
        }
    }

    return {
        title,
        description,
        ...(keywords ? { keywords } : {}),
        authors: [{ name: 'Deleyna' }],
        robots: { index: !((archive as any)?.noIndex === true), follow: true },
        alternates: {
            canonical: `${baseUrl}/${locale}/jobs`,
            languages: {
                de: `${baseUrl}/de/jobs`,
                en: `${baseUrl}/en/jobs`,
                'x-default': `${baseUrl}/de/jobs`,
            },
        },
        openGraph: {
            title,
            description,
            url: `${baseUrl}/${locale}/jobs`,
            siteName: 'Deleyna',
            type: 'website',
            locale: locale === 'de' ? 'de_DE' : 'en_US',
            ...(ogImageUrl
                ? { images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }] }
                : {}),
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            ...(ogImageUrl ? { images: [ogImageUrl] } : {}),
        },
    }
}

function formatDate(date: string, locale: string): string {
    return new Date(date).toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}

function jobTypeLabel(type: string | null | undefined, locale: string): string {
    const labels: Record<string, { de: string; en: string }> = {
        fulltime: { de: 'Vollzeit', en: 'Full-time' },
        parttime: { de: 'Teilzeit', en: 'Part-time' },
        freelance: { de: 'Freelance', en: 'Freelance' },
        internship: { de: 'Praktikum', en: 'Internship' },
        minijob: { de: 'Mini-Job', en: 'Mini job' },
    }
    if (!type) return ''
    return labels[type]?.[locale === 'de' ? 'de' : 'en'] || type
}

export default async function JobsPage({ params }: PageProps) {
    const { locale } = await params
    const { payload, archive } = await getArchiveData(locale)

    // If archive is disabled, return 404
    if (archive?.enabled === false) {
        notFound()
    }

    const jobsPerPage = (archive as any)?.jobsPerPage || 12

    // Fetch published jobs
    let jobs: any[] = []
    try {
        const result = await payload.find({
            collection: 'jobs',
            depth: 1,
            locale: locale as 'de' | 'en',
            where: { _status: { equals: 'published' } },
            sort: '-publishedAt',
            limit: jobsPerPage,
        })
        jobs = result.docs
    } catch {
        // collection may not exist yet
    }

    // Fetch job-anfrage form for the inquiry section
    let jobForm: FormType | null = null
    if ((archive as any)?.showCta) {
        try {
            const formResult = await payload.find({
                collection: 'forms',
                locale: locale as 'de' | 'en',
                where: { formCategory: { equals: 'job_inquiry' } },
                limit: 1,
                depth: 0,
            })
            jobForm = (formResult.docs[0] as unknown as FormType) || null
        } catch {
            // ignore
        }
    }

    const heroOverline = (archive as any)?.heroOverline || 'Jobs'
    const heroHeadline =
        (archive as any)?.heroHeadline ||
        (locale === 'de' ? 'Offene Stellen' : 'Open Positions')
    const heroDescription =
        (archive as any)?.heroDescription ||
        (locale === 'de'
            ? 'Entdecke aktuelle Job-Angebote und Möglichkeiten bei Deleyna.'
            : 'Discover current job openings and opportunities at Deleyna.')
    const emptyStateText =
        (archive as any)?.emptyStateText ||
        (locale === 'de'
            ? 'Aktuell keine offenen Stellen. Schau bald wieder vorbei!'
            : 'No open positions right now. Check back soon!')

    const archiveTitle = (archive as any)?.metaTitle || `Jobs – Deleyna`
    const archiveDescription =
        (archive as any)?.metaDescription || heroDescription

    return (
        <>
            <JobListSchema
                locale={locale}
                jobs={jobs}
                title={archiveTitle}
                description={archiveDescription}
            />

            {/* ── Breadcrumb ── */}
            <div className="container mt-6 mb-2">
                <Breadcrumb
                    items={[
                        { label: locale === 'de' ? 'Startseite' : 'Home', href: '/' },
                        { label: 'Jobs' },
                    ]}
                />
            </div>

            {/* ── Hero ── */}
            <section className="padding-section-hero-tight section-atmosphere relative">
                <div
                    className="pointer-events-none absolute left-1/2 top-0 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-copper/10 blur-[120px]"
                    aria-hidden="true"
                />
                <div className="container relative">
                    <SectionHeader
                        overline={heroOverline}
                        title={heroHeadline}
                        description={heroDescription}
                        centered
                        size="lg"
                        titleClassName="chrome-text"
                        as="h1"
                    />
                </div>
            </section>

            {/* ── Job listings ── */}
            <section className="padding-large section-atmosphere relative">
                <div
                    className="pointer-events-none absolute left-1/2 bottom-0 h-72 w-[34rem] -translate-x-1/2 rounded-full bg-copper/8 blur-[110px]"
                    aria-hidden="true"
                />
                <div className="container relative">
                    {jobs.length > 0 ? (
                        <div className="grid gap-6 sm:grid-cols-2 lg:gap-8 lg:grid-cols-3">
                            {jobs.map((job, index) => {
                                const image =
                                    typeof job.featuredImage === 'object'
                                        ? (job.featuredImage as Media)
                                        : null
                                const deadline = job.applicationDeadline
                                    ? formatDate(job.applicationDeadline, locale)
                                    : null
                                const isExpired =
                                    job.applicationDeadline &&
                                    new Date(job.applicationDeadline) < new Date()

                                return (
                                    <Link
                                        key={job.id}
                                        href={{
                                            pathname: '/jobs/[slug]',
                                            params: { slug: job.slug || '' },
                                        }}
                                        aria-label={job.title}
                                        className="group flex flex-col overflow-hidden rounded-[var(--block-radius)] border border-border/70 bg-card/82 backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:border-copper/30 hover:bg-foreground/5 hover:shadow-copper-glow"
                                    >
                                        {image?.url && (
                                            <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                                                <Image
                                                    src={image.url}
                                                    alt={image.alt || job.title || 'Job'}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                    priority={index < 3}
                                                />
                                            </div>
                                        )}
                                        <div className="flex flex-1 flex-col p-5">
                                            <div className="mb-2.5 flex flex-wrap gap-1.5">
                                                {job.jobType && (
                                                    <span className="badge-pill badge-pill-sm badge-pill-copper">
                                                        {jobTypeLabel(job.jobType, locale)}
                                                    </span>
                                                )}
                                                {isExpired && (
                                                    <span className="badge-pill badge-pill-sm badge-pill-surface text-destructive">
                                                        {locale === 'de' ? 'Abgelaufen' : 'Expired'}
                                                    </span>
                                                )}
                                            </div>

                                            <h3 className="mb-2 line-clamp-2 font-heading-6-bold transition-colors group-hover:text-primary">
                                                {job.title}
                                            </h3>

                                            {job.excerpt && (
                                                <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                                                    {job.excerpt}
                                                </p>
                                            )}

                                            <div className="mt-auto space-y-1.5 text-xs text-muted-foreground">
                                                {job.location && (
                                                    <p className="flex items-center gap-1.5">
                                                        <MapPin className="h-3 w-3 shrink-0 text-copper" aria-hidden="true" />
                                                        {job.location}
                                                    </p>
                                                )}
                                                {job.company && (
                                                    <p className="flex items-center gap-1.5">
                                                        <Briefcase className="h-3 w-3 shrink-0 text-copper" aria-hidden="true" />
                                                        {job.company}
                                                    </p>
                                                )}
                                                {deadline && (
                                                    <p className="flex items-center gap-1.5">
                                                        <CalendarDays className="h-3 w-3 shrink-0 text-copper" aria-hidden="true" />
                                                        {locale === 'de' ? 'Frist:' : 'Deadline:'}{' '}
                                                        {deadline}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="py-16 text-center text-muted-foreground">
                            {emptyStateText}
                        </div>
                    )}
                </div>
            </section>

            {/* ── CTA / Job inquiry ── */}
            {(archive as any)?.showCta && (
                <>
                    {jobForm ? (
                        <Suspense fallback={null}>
                            <FormBlock
                                blockType="formBlock"
                                badge={(archive as any)?.ctaBadge || (locale === 'de' ? 'Job-Anfrage' : 'Job Inquiry')}
                                title={
                                    (archive as any)?.ctaHeadline ||
                                    (locale === 'de'
                                        ? 'Stellenangebot oder Kooperation'
                                        : 'Job Offer or Collaboration')
                                }
                                description={
                                    (archive as any)?.ctaDescription ||
                                    (locale === 'de'
                                        ? 'Sie haben eine offene Stelle oder suchen einen Kooperationspartner? Schicken Sie uns Ihre Anfrage.'
                                        : 'Have an open position or looking for a collaboration partner? Send us your inquiry.')
                                }
                                form={jobForm as any}
                                enableIntro={false}
                            />
                        </Suspense>
                    ) : (archive as any)?.ctaLink?.label ? (
                        <section className="section-padding-lg section-atmosphere">
                            <div className="container text-center">
                                <SectionHeader
                                    overline={(archive as any)?.ctaBadge}
                                    title={(archive as any)?.ctaHeadline}
                                    description={(archive as any)?.ctaDescription}
                                    centered
                                    as="h2"
                                />
                                <CMSLink {...(archive as any).ctaLink} />
                            </div>
                        </section>
                    ) : null}
                </>
            )}
        </>
    )
}
