import { getPayload } from 'payload'
import config from '@/payload.config'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import { Briefcase, MapPin, CalendarDays, ExternalLink } from 'lucide-react'

import { Breadcrumb } from '@/components/Breadcrumb'
import { generateMeta } from '@/utilities/generateMeta'
import RichText from '@/components/RichText'
import { JobPostingSchema } from '@/components/seo/JobPostingSchema'

import type { Metadata } from 'next'
import type { Media } from '@/payload-types'

export const revalidate = 3600

type PageProps = {
    params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { locale, slug } = await params
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })
    const { isEnabled: isDraft } = await draftMode()

    try {
        const result = await payload.find({
            collection: 'jobs',
            depth: 0,
            draft: isDraft,
            locale: locale as 'de' | 'en',
            where: {
                slug: { equals: slug },
                ...(isDraft ? {} : { _status: { equals: 'published' } }),
            },
            limit: 1,
        })

        const job = result.docs[0]
        if (!job) return { title: locale === 'de' ? 'Job nicht gefunden' : 'Job not found' }

        return generateMeta({ doc: job, locale })
    } catch {
        return { title: 'Jobs' }
    }
}

export async function generateStaticParams() {
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    try {
        const result = await payload.find({
            collection: 'jobs',
            depth: 0,
            select: { slug: true },
            where: { _status: { equals: 'published' } },
            limit: 100,
        })
        return result.docs.map((job) => ({ slug: job.slug || '' }))
    } catch {
        return []
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

export default async function JobDetailPage({ params }: PageProps) {
    const { locale, slug } = await params
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })
    const { isEnabled: isDraft } = await draftMode()

    let job: any = null
    try {
        const result = await payload.find({
            collection: 'jobs',
            draft: isDraft,
            locale: locale as 'de' | 'en',
            where: {
                slug: { equals: slug },
                ...(isDraft ? {} : { _status: { equals: 'published' } }),
            },
            limit: 1,
            depth: 1,
        })
        job = result.docs[0] || null
    } catch {
        // ignore
    }

    if (!job) notFound()

    const featuredImage =
        typeof job.featuredImage === 'object' ? (job.featuredImage as Media) : null
    const deadline = job.applicationDeadline ? formatDate(job.applicationDeadline, locale) : null
    const isExpired =
        job.applicationDeadline && new Date(job.applicationDeadline) < new Date()

    // Fetch other jobs for "more jobs" section
    let otherJobs: any[] = []
    try {
        const otherResult = await payload.find({
            collection: 'jobs',
            locale: locale as 'de' | 'en',
            depth: 1,
            where: {
                id: { not_equals: job.id },
                _status: { equals: 'published' },
            },
            sort: '-publishedAt',
            limit: 3,
        })
        otherJobs = otherResult.docs
    } catch {
        // ignore
    }

    return (
        <article>
            <JobPostingSchema job={job} locale={locale} />

            <div className="container mt-6 mb-2">
                <Breadcrumb
                    items={[
                        { label: locale === 'de' ? 'Startseite' : 'Home', href: '/' },
                        { label: 'Jobs', href: '/jobs' },
                        { label: job.title || '' },
                    ]}
                />
            </div>

            <section className="padding-section-hero-tight section-atmosphere relative">
                <div
                    className="pointer-events-none absolute left-1/2 top-0 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-copper/10 blur-[120px]"
                    aria-hidden="true"
                />
                <div className="container relative max-w-4xl">

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 mb-4">
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

                    <h1 className="chrome-text font-display-tight text-4xl font-bold mb-6 md:text-5xl">
                        {job.title}
                    </h1>

                    {/* Meta info */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
                        {job.location && (
                            <span className="flex items-center gap-1.5">
                                <MapPin className="h-4 w-4 text-copper" aria-hidden="true" />
                                {job.location}
                            </span>
                        )}
                        {job.company && (
                            <span className="flex items-center gap-1.5">
                                <Briefcase className="h-4 w-4 text-copper" aria-hidden="true" />
                                {job.company}
                            </span>
                        )}
                        {deadline && (
                            <span className="flex items-center gap-1.5">
                                <CalendarDays className="h-4 w-4 text-copper" aria-hidden="true" />
                                {locale === 'de' ? 'Frist:' : 'Deadline:'} {deadline}
                            </span>
                        )}
                    </div>

                    {/* Featured image */}
                    {featuredImage?.url ? (
                        <div className="relative aspect-[16/9] overflow-hidden rounded-[var(--block-radius)] mb-10 glass-morphism border border-border">
                            <Image
                                src={featuredImage.url}
                                alt={featuredImage.alt || job.title || ''}
                                fill
                                className="object-cover"
                                sizes="(max-width: 896px) 100vw, 896px"
                                priority
                            />
                        </div>
                    ) : null}

                    {/* Compensation info */}
                    {job.compensation && (
                        <div className="mb-8 rounded-[var(--block-radius)] border border-copper/30 bg-copper/5 px-5 py-4">
                            <p className="text-sm font-medium text-foreground/90">
                                {locale === 'de' ? 'Vergütung:' : 'Compensation:'}{' '}
                                <span className="text-copper">{job.compensation}</span>
                            </p>
                        </div>
                    )}

                    {/* Description */}
                    {job.description && (
                        <div className="prose-content mb-10">
                            <RichText data={job.description} />
                        </div>
                    )}

                    {/* Requirements */}
                    {job.requirements && (
                        <div className="prose-content mb-10">
                            <RichText data={job.requirements} />
                        </div>
                    )}

                    {/* Benefits */}
                    {job.benefits && (
                        <div className="prose-content mb-10">
                            <RichText data={job.benefits} />
                        </div>
                    )}

                    {/* CTA */}
                    <div className="mt-10 flex flex-wrap gap-4">
                        {job.applicationUrl ? (
                            <a
                                href={job.applicationUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={locale === 'de' ? 'Jetzt bewerben (öffnet in neuem Tab)' : 'Apply now (opens in new tab)'}
                                className="inline-flex items-center gap-2 rounded-full border border-copper/40 bg-copper/10 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-copper transition-colors hover:bg-copper/20"
                            >
                                {locale === 'de' ? 'Jetzt bewerben' : 'Apply now'}
                                <ExternalLink className="h-4 w-4" />
                            </a>
                        ) : (
                            <Link
                                href={{ pathname: '/[...slug]', params: { slug: ['job-anfrage'] } }}
                                className="inline-flex items-center gap-2 rounded-full border border-copper/40 bg-copper/10 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-copper transition-colors hover:bg-copper/20"
                            >
                                {locale === 'de' ? 'Jetzt bewerben' : 'Apply now'}
                            </Link>
                        )}
                        <Link
                            href={{ pathname: '/jobs' }}
                            className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground/80 transition-colors hover:border-copper/30 hover:text-foreground"
                        >
                            {locale === 'de' ? 'Alle Jobs ansehen' : 'View all jobs'}
                        </Link>
                    </div>
                </div>
            </section>

            {/* Other jobs */}
            {otherJobs.length > 0 && (
                <section className="section-padding section-atmosphere bg-muted/30 border-t border-border">
                    <div className="container max-w-4xl">
                        <h2 className="chrome-text text-2xl font-bold font-display mb-8">
                            {locale === 'de' ? 'Weitere Jobs' : 'More Jobs'}
                        </h2>
                        <div className="grid gap-6 sm:grid-cols-3">
                            {otherJobs.map((other) => {
                                const otherImage =
                                    typeof other.featuredImage === 'object'
                                        ? (other.featuredImage as Media)
                                        : null
                                return (
                                    <Link
                                        key={other.id}
                                        href={{
                                            pathname: '/jobs/[slug]',
                                            params: { slug: other.slug || '' },
                                        }}
                                        aria-label={other.title}
                                        className="group block rounded-[var(--block-radius)] overflow-hidden border border-border glass-morphism transition hover:border-copper/30 hover:bg-foreground/5"
                                    >
                                        {otherImage?.url ? (
                                            <div className="relative aspect-[16/9] bg-muted overflow-hidden">
                                                <Image
                                                    src={otherImage.url}
                                                    alt={otherImage.alt || other.title || ''}
                                                    fill
                                                    className="object-cover transition-transform group-hover:scale-105"
                                                    sizes="33vw"
                                                    loading="lazy"
                                                />
                                            </div>
                                        ) : null}
                                        <div className="p-4">
                                            {other.jobType && (
                                                <span className="badge-pill badge-pill-sm badge-pill-copper mb-2 inline-block">
                                                    {jobTypeLabel(other.jobType, locale)}
                                                </span>
                                            )}
                                            <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                                                {other.title}
                                            </h3>
                                            {other.location && (
                                                <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                                                    <MapPin className="h-3 w-3 text-copper" aria-hidden="true" />
                                                    {other.location}
                                                </p>
                                            )}
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                </section>
            )}
        </article>
    )
}
