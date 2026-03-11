import { getPayload } from 'payload'
import type { Where } from 'payload'
import config from '@/payload.config'
import { Link } from '@/i18n/navigation'
import NextLink from 'next/link'
import Image from 'next/image'
import { CalendarDays, Clock3, MapPin, Users } from 'lucide-react'

import { SectionHeader } from '@/components/SectionHeader'
import { Pagination } from '@/components/Pagination'
import { Breadcrumb } from '@/components/Breadcrumb'
import { CMSLink } from '@/components/CMSLink'
import { BlogListSchema } from '@/components/seo/BlogListSchema'
import { getCachedGlobal } from '@/utilities/getGlobals'

import type { Metadata } from 'next'
import type { Post, Media, Category, Talent } from '@/payload-types'

export const revalidate = 3600

type PageProps = {
    params: Promise<{ locale: string }>
    searchParams?: Promise<{
        category?: string | string[]
        page?: string | string[]
    }>
}

type PostWithClass = Post & {
    postType?: 'article' | 'class' | 'news' | null
    classDetails?: {
        classDate?: string | null
        studioName?: string | Record<string, string> | null
        studioCity?: string | Record<string, string> | null
        danceStyle?: string | Record<string, string> | null
        level?: string | null
        duration?: string | Record<string, string> | null
        maxParticipants?: number | null
        instructorTalents?: Array<number | Talent> | null
    } | null
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { locale } = await params
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
    const canonical = `${baseUrl}/${locale}/${locale === 'de' ? 'magazin' : 'blog'}`

    try {
        const archive = await getCachedGlobal('posts-archive', 1, locale)

        let ogImageUrl: string | undefined
        // Priority: archive ogImage > global logo
        const archiveOg = archive?.ogImage
        if (archiveOg && typeof archiveOg === 'object') {
            const url = (archiveOg as Media).url
            if (url) ogImageUrl = url.startsWith('http') ? url : `${baseUrl}${url}`
        }
        if (!ogImageUrl) {
            try {
                const seo = await getCachedGlobal('seo', 1, locale)
                const logo = seo?.socialMedia?.logo
                if (logo && typeof logo === 'object') {
                    const url = (logo as Media).url
                    if (url) ogImageUrl = url.startsWith('http') ? url : `${baseUrl}${url}`
                }
            } catch {
                /* ignore */
            }
        }

        const title = archive?.metaTitle || (locale === 'de' ? 'Magazin' : 'Blog')
        const description = archive?.metaDescription || undefined
        const keywords = (archive as any)?.metaKeywords as string | undefined

        return {
            title,
            description,
            ...(keywords ? { keywords } : {}),
            authors: [{ name: 'Deleyna' }],
            robots: { index: !((archive as any)?.noIndex === true), follow: true },
            alternates: {
                canonical,
                languages: {
                    de: `${baseUrl}/de/magazin`,
                    en: `${baseUrl}/en/blog`,
                    'x-default': `${baseUrl}/de/magazin`,
                },
            },
            openGraph: {
                type: 'website',
                title,
                description,
                url: canonical,
                siteName: 'Deleyna',
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
    } catch {
        const title = locale === 'de' ? 'Magazin' : 'Blog'
        return {
            title,
            alternates: {
                canonical,
                languages: {
                    de: `${baseUrl}/de/magazin`,
                    en: `${baseUrl}/en/blog`,
                },
            },
        }
    }
}

function formatDate(date: string, locale: string): string {
    return new Date(date).toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}

function formatDateTime(date: string, locale: string): string {
    return new Date(date).toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

function readLocalizedValue(value: unknown, locale: string): string {
    if (!value) return ''
    if (typeof value === 'string') return value
    if (typeof value === 'object') {
        const map = value as Record<string, string | null | undefined>
        return map[locale] || map.de || map.en || ''
    }
    return ''
}

function classLevelLabel(level: string | null | undefined, locale: string): string {
    if (!level) return ''
    const labels: Record<string, { de: string; en: string }> = {
        open: { de: 'Offenes Level', en: 'Open level' },
        beginner: { de: 'Anfänger', en: 'Beginner' },
        intermediate: { de: 'Intermediate', en: 'Intermediate' },
        advanced: { de: 'Advanced', en: 'Advanced' },
    }
    return labels[level]?.[locale === 'de' ? 'de' : 'en'] || level
}

function postTypeBadge(
    postType: 'article' | 'class' | 'news' | null | undefined,
    locale: string,
): string {
    if (postType === 'class') return locale === 'de' ? 'Tanzkurs' : 'Dance class'
    if (postType === 'news') return locale === 'de' ? 'Neuigkeiten' : 'News'
    return locale === 'de' ? 'Artikel' : 'Article'
}

function readQueryValue(value: string | string[] | undefined): string {
    if (Array.isArray(value)) return value[0] || ''
    return value || ''
}

function buildFilterPath(locale: string, category: string): string {
    const base = `/${locale}/${locale === 'de' ? 'magazin' : 'blog'}`
    if (category === 'all') return base
    return `${base}?category=${encodeURIComponent(category)}`
}

export default async function BlogPage({ params, searchParams }: PageProps) {
    const { locale } = await params
    const query = (await searchParams) || {}
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let archive: any = null
    try {
        archive = await payload.findGlobal({
            slug: 'posts-archive',
            locale: locale as 'de' | 'en',
        })
    } catch {
        // defaults
    }

    const postsPerPage = archive?.postsPerPage || 12

    let categories: Category[] = []
    try {
        const catResult = await payload.find({
            collection: 'categories',
            locale: locale as 'de' | 'en',
            limit: 50,
            sort: 'title',
            depth: 0,
        })
        categories = catResult.docs
    } catch {
        // ignore
    }

    const categoryParamRaw = readQueryValue(query.category)
    const categoryParam = categoryParamRaw || 'all'

    const selectedCategory = categories.find((cat) => cat.slug === categoryParam)
    const selectedCategoryID = selectedCategory?.id

    // ── Featured post: always the latest published post ──
    let featuredPost: PostWithClass | null = null
    if (archive?.showFeatured !== false) {
        try {
            const featuredResult = await payload.find({
                collection: 'posts',
                depth: 1,
                locale: locale as 'de' | 'en',
                where: { _status: { equals: 'published' } },
                sort: '-publishedAt',
                limit: 1,
            })
            featuredPost = (featuredResult.docs[0] as PostWithClass) || null
        } catch {
            // ignore
        }
    }

    // ── Filtered posts (excluding featured) ──
    const where: Where[] = [{ _status: { equals: 'published' } }]
    if (featuredPost) {
        where.push({ id: { not_equals: featuredPost.id } })
    }
    if (selectedCategoryID != null) {
        where.push({ categories: { in: [selectedCategoryID] } })
    }

    const pageParamRaw = readQueryValue(query.page)
    const currentPage = Math.max(1, parseInt(pageParamRaw, 10) || 1)

    let posts: PostWithClass[] = []
    let totalPages = 1
    try {
        const result = await payload.find({
            collection: 'posts',
            depth: 1,
            locale: locale as 'de' | 'en',
            where: { and: where },
            sort: '-publishedAt',
            limit: postsPerPage,
            page: currentPage,
        })
        posts = result.docs as PostWithClass[]
        totalPages = result.totalPages
    } catch (error) {
        console.error('Error fetching posts:', error)
    }

    const heroHeadline = archive?.heroHeadline || (locale === 'de' ? 'Magazin' : 'Blog')
    const heroDescription = archive?.heroDescription || undefined
    const blogTitle = archive?.heroHeadline || (locale === 'de' ? 'Magazin' : 'Blog')

    return (
        <>
            <BlogListSchema
                locale={locale}
                posts={posts}
                title={blogTitle}
                description={heroDescription}
            />

            {/* ── Breadcrumb ── */}
            <div className="container mt-6 mb-2">
                <Breadcrumb
                    items={[
                        { label: locale === 'de' ? 'Startseite' : 'Home', href: '/' },
                        { label: locale === 'de' ? 'Magazin' : 'Blog' },
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
                        overline={locale === 'de' ? 'Magazin' : 'Blog'}
                        title={heroHeadline}
                        description={heroDescription}
                        centered
                        size="lg"
                        titleClassName="chrome-text"
                        as="h1"
                    />
                </div>
            </section>

            {/* ── Featured post ── */}
            {featuredPost && (
                <section className="padding-large section-atmosphere">
                    <div className="container">
                        <Link
                            href={{
                                pathname: '/blog/[slug]',
                                params: { slug: featuredPost.slug || '' },
                            }}
                            aria-label={featuredPost.title}
                            className="group grid overflow-hidden rounded-[var(--block-radius)] border border-border/70 bg-card/85 backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:border-copper/30 hover:shadow-copper-glow md:grid-cols-[1.4fr_1fr]"
                        >
                            <div className="relative min-h-72 bg-muted">
                                {typeof featuredPost.featuredImage === 'object' &&
                                (featuredPost.featuredImage as Media)?.url ? (
                                    <Image
                                        src={(featuredPost.featuredImage as Media).url!}
                                        alt={
                                            (featuredPost.featuredImage as Media).alt ||
                                            featuredPost.title ||
                                            'Featured post'
                                        }
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 65vw, 54vw"
                                        priority
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                                        {locale === 'de' ? 'Featured Story' : 'Featured story'}
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col justify-between padding-large">
                                <div>
                                    <span className="badge-pill badge-pill-copper mb-3">
                                        {postTypeBadge(featuredPost.postType, locale)}
                                    </span>
                                    <h2 className="mb-3 font-heading-3-bold leading-tight text-foreground">
                                        {featuredPost.title}
                                    </h2>
                                    {featuredPost.excerpt && (
                                        <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                                            {featuredPost.excerpt}
                                        </p>
                                    )}
                                </div>
                                {featuredPost.publishedAt && (
                                    <time className="mt-6 text-xs text-muted-foreground">
                                        {formatDate(featuredPost.publishedAt, locale)}
                                    </time>
                                )}
                            </div>
                        </Link>
                    </div>
                </section>
            )}

            {/* ── Category filters ── */}
            {archive?.showCategories !== false && categories.length > 0 && (
                <section className="py-8 md:py-10 section-atmosphere">
                    <div className="container">
                        <div className="flex flex-wrap items-center justify-center gap-2">
                            <NextLink
                                href={buildFilterPath(locale, 'all')}
                                scroll={false}
                                {...(categoryParam === 'all' ? { 'aria-current': 'page' as const } : {})}
                                className={
                                    categoryParam === 'all'
                                        ? 'pill-filter pill-filter-active'
                                        : 'pill-filter pill-filter-default'
                                }
                            >
                                {locale === 'de' ? 'Alle' : 'All'}
                            </NextLink>
                            {categories.map((cat) => {
                                const catSlug = typeof cat.slug === 'string' ? cat.slug : ''
                                if (!catSlug) return null
                                const isActive = catSlug === categoryParam
                                return (
                                    <NextLink
                                        key={cat.id}
                                        href={buildFilterPath(locale, catSlug)}
                                        scroll={false}
                                        {...(isActive ? { 'aria-current': 'page' as const } : {})}
                                        className={
                                            isActive
                                                ? 'pill-filter pill-filter-active'
                                                : 'pill-filter pill-filter-default'
                                        }
                                    >
                                        {cat.title}
                                    </NextLink>
                                )
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* ── Post grid ── */}
            <section className="padding-large section-atmosphere relative">
                <div
                    className="pointer-events-none absolute left-1/2 bottom-0 h-72 w-[34rem] -translate-x-1/2 rounded-full bg-copper/8 blur-[110px]"
                    aria-hidden="true"
                />
                <div className="container relative">
                    {posts.length > 0 ? (
                        <div className="grid gap-6 sm:grid-cols-2 lg:gap-8 lg:grid-cols-3">
                            {posts.map((post, index) => {
                                const image =
                                    typeof post.featuredImage === 'object'
                                        ? (post.featuredImage as Media)
                                        : null
                                const postCategories = Array.isArray(post.categories)
                                    ? post.categories
                                          .map((c) =>
                                              typeof c === 'object' ? (c as Category) : null,
                                          )
                                          .filter(Boolean)
                                    : []
                                const isClassPost = post.postType === 'class'
                                const isNewsPost = post.postType === 'news'
                                const classDetails = post.classDetails
                                const studioName = readLocalizedValue(
                                    classDetails?.studioName,
                                    locale,
                                )
                                const studioCity = readLocalizedValue(
                                    classDetails?.studioCity,
                                    locale,
                                )
                                const danceStyle = readLocalizedValue(
                                    classDetails?.danceStyle,
                                    locale,
                                )
                                const duration = readLocalizedValue(classDetails?.duration, locale)
                                const level = classLevelLabel(classDetails?.level, locale)
                                const classDate = classDetails?.classDate
                                    ? formatDateTime(classDetails.classDate, locale)
                                    : ''
                                const instructors = Array.isArray(classDetails?.instructorTalents)
                                    ? classDetails.instructorTalents
                                          .map((entry) => {
                                              if (typeof entry !== 'object' || entry === null)
                                                  return null
                                              return readLocalizedValue(
                                                  (entry as Talent).name,
                                                  locale,
                                              )
                                          })
                                          .filter(Boolean)
                                    : []

                                return (
                                    <Link
                                        key={post.id}
                                        href={{
                                            pathname: '/blog/[slug]',
                                            params: { slug: post.slug || '' },
                                        }}
                                        aria-label={post.title}
                                        className="group flex flex-col overflow-hidden rounded-[var(--block-radius)] border border-border/70 bg-card/82 backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:border-copper/30 hover:bg-foreground/5 hover:shadow-copper-glow"
                                    >
                                        <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                                            {image?.url ? (
                                                <Image
                                                    src={image.url}
                                                    alt={
                                                        image.alt || post.title || 'Blog post'
                                                    }
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                    priority={index < 3}
                                                />
                                            ) : (
                                                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                                                    {locale === 'de' ? 'Magazin' : 'Blog'}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-1 flex-col p-5">
                                            {(postCategories.length > 0 ||
                                                isClassPost ||
                                                isNewsPost) && (
                                                <div className="mb-2.5 flex flex-wrap gap-1.5">
                                                    {postCategories.map((cat) => (
                                                        <span
                                                            key={(cat as Category).id}
                                                            className="badge-pill badge-pill-sm badge-pill-surface"
                                                        >
                                                            {(cat as Category).title}
                                                        </span>
                                                    ))}
                                                    {(isClassPost || isNewsPost) && (
                                                        <span className="badge-pill badge-pill-sm badge-pill-copper">
                                                            {postTypeBadge(post.postType, locale)}
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            <h3 className="mb-2 line-clamp-2 font-heading-6-bold transition-colors group-hover:text-primary">
                                                {post.title}
                                            </h3>

                                            {post.excerpt && !isClassPost && (
                                                <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                                                    {post.excerpt}
                                                </p>
                                            )}

                                            {isClassPost && classDetails && (
                                                <div className="mb-3 space-y-1.5 rounded-lg border border-copper/20 bg-copper/5 p-2.5 text-xs">
                                                    {classDate && (
                                                        <p className="flex items-center gap-1.5 text-foreground/90">
                                                            <CalendarDays
                                                                className="h-3 w-3 shrink-0 text-copper"
                                                                aria-hidden="true"
                                                            />
                                                            {classDate}
                                                        </p>
                                                    )}
                                                    {(studioName || studioCity) && (
                                                        <p className="flex items-center gap-1.5 text-foreground/90">
                                                            <MapPin
                                                                className="h-3 w-3 shrink-0 text-copper"
                                                                aria-hidden="true"
                                                            />
                                                            {[studioName, studioCity]
                                                                .filter(Boolean)
                                                                .join(' · ')}
                                                        </p>
                                                    )}
                                                    {(danceStyle || level || duration) && (
                                                        <p className="flex items-center gap-1.5 text-foreground/90">
                                                            <Clock3
                                                                className="h-3 w-3 shrink-0 text-copper"
                                                                aria-hidden="true"
                                                            />
                                                            {[danceStyle, level, duration]
                                                                .filter(Boolean)
                                                                .join(' · ')}
                                                        </p>
                                                    )}
                                                    {classDetails.maxParticipants != null && (
                                                        <p className="flex items-center gap-1.5 text-foreground/90">
                                                            <Users
                                                                className="h-3 w-3 shrink-0 text-copper"
                                                                aria-hidden="true"
                                                            />
                                                            {locale === 'de'
                                                                ? `Max. ${classDetails.maxParticipants} Teilnehmer`
                                                                : `Max ${classDetails.maxParticipants} participants`}
                                                        </p>
                                                    )}
                                                    {instructors.length > 0 && (
                                                        <p className="text-muted-foreground">
                                                            {locale === 'de' ? 'Mit' : 'With'}{' '}
                                                            {instructors.join(', ')}
                                                        </p>
                                                    )}
                                                </div>
                                            )}

                                            <div className="mt-auto">
                                                {post.publishedAt && (
                                                    <time className="text-xs text-muted-foreground">
                                                        {formatDate(post.publishedAt, locale)}
                                                    </time>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="py-16 text-center text-muted-foreground">
                            {locale === 'de'
                                ? 'Noch keine Beiträge vorhanden.'
                                : 'No posts yet.'}
                        </div>
                    )}

                    <Pagination
                        page={currentPage}
                        totalPages={totalPages}
                        basePath={locale === 'de' ? '/magazin' : '/blog'}
                    />
                </div>
            </section>

            {/* ── CTA ── */}
            {archive?.showCta && (
                <section className="padding-large section-atmosphere bg-muted/30 border-t border-border">
                    <div className="container mx-auto max-w-2xl text-center">
                        {archive.ctaHeadline && (
                            <h2 className="chrome-text mb-4 font-display text-3xl font-bold md:text-4xl">
                                {archive.ctaHeadline}
                            </h2>
                        )}
                        {archive.ctaDescription && (
                            <p className="mb-8 leading-relaxed text-muted-foreground">
                                {archive.ctaDescription}
                            </p>
                        )}
                        {archive.ctaLink && (
                            <CMSLink {...archive.ctaLink} />
                        )}
                    </div>
                </section>
            )}
        </>
    )
}
