import { getServerSideURL } from '@/utilities/getURL'
import { JsonLdScripts } from './JsonLdScripts'

const BASE_URL = getServerSideURL()

const EMPLOYMENT_TYPE_MAP: Record<string, string> = {
    fulltime: 'FULL_TIME',
    parttime: 'PART_TIME',
    freelance: 'CONTRACTOR',
    internship: 'INTERN',
    minijob: 'PART_TIME',
}

interface JobData {
    title: string
    slug: string
    excerpt?: string | null
    jobType?: string | null
    location?: string | null
    company?: string | null
    compensation?: string | null
    applicationDeadline?: string | null
    applicationUrl?: string | null
    publishedAt?: string | null
    updatedAt?: string | null
}

/* ------------------------------------------------------------------ */
/*  Single job detail page                                            */
/* ------------------------------------------------------------------ */

interface JobPostingSchemaProps {
    job: JobData
    locale: string
}

export function JobPostingSchema({ job, locale }: JobPostingSchemaProps) {
    const jobUrl = `${BASE_URL}/${locale}/jobs/${job.slug}`

    const schemas: object[] = []

    const posting: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': 'JobPosting',
        '@id': `${jobUrl}#jobposting`,
        title: job.title,
        url: jobUrl,
        hiringOrganization: buildHiringOrganization(job.company),
    }

    if (job.excerpt) posting.description = job.excerpt
    if (job.publishedAt) posting.datePosted = job.publishedAt
    if (job.applicationDeadline) posting.validThrough = job.applicationDeadline
    if (job.jobType && EMPLOYMENT_TYPE_MAP[job.jobType]) {
        posting.employmentType = EMPLOYMENT_TYPE_MAP[job.jobType]
    }
    if (job.location) {
        posting.jobLocation = {
            '@type': 'Place',
            address: {
                '@type': 'PostalAddress',
                addressLocality: job.location,
            },
        }
    }
    if (job.compensation) {
        posting.baseSalary = {
            '@type': 'MonetaryAmount',
            currency: 'EUR',
            value: {
                '@type': 'QuantitativeValue',
                value: job.compensation,
            },
        }
    }
    if (job.applicationUrl) {
        posting.directApply = true
    }

    schemas.push(posting)

    // BreadcrumbList
    schemas.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        '@id': `${jobUrl}#breadcrumb`,
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: locale === 'de' ? 'Startseite' : 'Home',
                item: `${BASE_URL}/${locale}`,
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'Jobs',
                item: `${BASE_URL}/${locale}/jobs`,
            },
            {
                '@type': 'ListItem',
                position: 3,
                name: job.title,
                item: jobUrl,
            },
        ],
    })

    return <JsonLdScripts schemas={schemas} keyPrefix={`job-${job.slug}`} />
}

/* ------------------------------------------------------------------ */
/*  Jobs archive / list page                                          */
/* ------------------------------------------------------------------ */

interface JobListSchemaProps {
    locale: string
    jobs: JobData[]
    title: string
    description?: string
}

export function JobListSchema({ locale, jobs, title, description }: JobListSchemaProps) {
    const pageUrl = `${BASE_URL}/${locale}/jobs`

    const schemas = [
        {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            '@id': `${pageUrl}#webpage`,
            name: title,
            description,
            url: pageUrl,
            isPartOf: {
                '@type': 'WebSite',
                '@id': `${BASE_URL}#website`,
            },
        },
        {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            '@id': `${pageUrl}#itemlist`,
            name: title,
            numberOfItems: jobs.length,
            itemListElement: jobs.map((job, index) => {
                const jobUrl = `${BASE_URL}/${locale}/jobs/${job.slug}`

                const item: Record<string, unknown> = {
                    '@type': 'JobPosting',
                    title: job.title,
                    url: jobUrl,
                    hiringOrganization: buildHiringOrganization(job.company),
                }

                if (job.publishedAt) item.datePosted = job.publishedAt
                if (job.applicationDeadline) item.validThrough = job.applicationDeadline
                if (job.jobType && EMPLOYMENT_TYPE_MAP[job.jobType]) {
                    item.employmentType = EMPLOYMENT_TYPE_MAP[job.jobType]
                }
                if (job.location) {
                    item.jobLocation = {
                        '@type': 'Place',
                        address: {
                            '@type': 'PostalAddress',
                            addressLocality: job.location,
                        },
                    }
                }

                return {
                    '@type': 'ListItem',
                    position: index + 1,
                    url: jobUrl,
                    item,
                }
            }),
        },
        {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            '@id': `${pageUrl}#breadcrumb`,
            itemListElement: [
                {
                    '@type': 'ListItem',
                    position: 1,
                    name: locale === 'de' ? 'Startseite' : 'Home',
                    item: `${BASE_URL}/${locale}`,
                },
                {
                    '@type': 'ListItem',
                    position: 2,
                    name: title,
                    item: pageUrl,
                },
            ],
        },
    ]

    return <JsonLdScripts schemas={schemas} keyPrefix="job-list" />
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function buildHiringOrganization(company?: string | null) {
    return {
        '@type': 'Organization',
        name: company || 'Deleyna Talent Agency',
        url: company ? undefined : BASE_URL,
    }
}
