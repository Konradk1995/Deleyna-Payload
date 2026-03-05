import { getPayload } from 'payload'
import type { Where } from 'payload'
import config from '@/payload.config'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import { CalendarDays, Clock3, MapPin, Users } from 'lucide-react'

import { SectionHeader } from '@/components/SectionHeader'

// getServerSideURL available via '@/utilities/getURL' if needed
import type { Metadata } from 'next'
import type { Post, Media, Category, Talent } from '@/payload-types'

export const revalidate = 3600

type PageProps = {
    params: Promise<{ locale: string }>
    searchParams?: Promise<{ type?: string | string[]; category?: string | string[] }>
}

type FilterType = 'all' | 'article' | 'news' | 'class'

const ALLOWED_FILTER_TYPES = new Set<FilterType>(['all', 'article', 'news', 'class'])

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
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
    const canonical = `${baseUrl}/${locale}/${locale === 'de' ? 'magazin' : 'blog'}`

    try {
        const archive = await payload.findGlobal({
            slug: 'posts-archive',
            locale: locale as 'de' | 'en',
        })

        let ogImageUrl: string | undefined
        try {
            const seo = await payload.findGlobal({ slug: 'seo', locale: locale as 'de' | 'en' })
            const logo = seo?.socialMedia?.logo
            if (logo && typeof logo === 'object') {
                const url = (logo as Media).url
                if (url) ogImageUrl = url.startsWith('http') ? url : `${baseUrl}${url}`
            }
        } catch {
            /* ignore */
        }

        const title = archive?.metaTitle || (locale === 'de' ? 'Magazin' : 'Blog')
        const description = archive?.metaDescription || undefined

        return {
            title,
            description,
            alternates: {
                canonical,
                languages: {
                    de: `${baseUrl}/de/magazin`,
                    en: `${baseUrl}/en/blog`,
                },
            },
            openGraph: {
                type: 'website',
                title,
                description,
                url: canonical,
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

function buildBlogFilterHref(
    type: FilterType,
    category: string,
): { pathname: '/blog'; query?: Record<string, string> } {
    const query: Record<string, string> = {}
    if (type !== 'all') query.type = type
    if (category !== 'all') query.category = category

    if (Object.keys(query).length === 0) {
        return { pathname: '/blog' }
    }

    return { pathname: '/blog', query }
}

export default async function BlogPage({ params, searchParams }: PageProps) {
    const { locale } = await params
    const query = (await searchParams) || {}
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    // Fetch archive config
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

    const typeParamRaw = readQueryValue(query.type)
    const typeParam = ALLOWED_FILTER_TYPES.has(typeParamRaw as FilterType)
        ? (typeParamRaw as FilterType)
        : 'all'
    const categoryParamRaw = readQueryValue(query.category)
    const categoryParam = categoryParamRaw || 'all'

    const selectedCategory = categories.find((cat) => cat.slug === categoryParam)
    const selectedCategoryID = selectedCategory?.id

    const where: Where[] = [{ _status: { equals: 'published' } }]

    if (typeParam !== 'all') {
        where.push({ postType: { equals: typeParam } })
    }

    if (selectedCategoryID != null) {
        where.push({ categories: { in: [selectedCategoryID] } })
    }

    // Fetch posts
    let posts: PostWithClass[] = []
    try {
        const result = await payload.find({
            collection: 'posts',
            depth: 1,
            locale: locale as 'de' | 'en',
            where: { and: where },
            sort: '-publishedAt',
            limit: postsPerPage,
        })
        posts = result.docs as PostWithClass[]
    } catch (error) {
        console.error('Error fetching posts:', error)
    }

    const heroHeadline = archive?.heroHeadline || (locale === 'de' ? 'Magazin' : 'Blog')
    const heroDescription = archive?.heroDescription || undefined
    const showFeatured =
        archive?.showFeatured !== false && typeParam === 'all' && categoryParam === 'all'
    const featuredPost = showFeatured && posts.length > 0 ? posts[0] : null
    const restPosts = featuredPost ? posts.slice(1) : posts
    const classHighlights = restPosts.filter((post) => post.postType === 'class').slice(0, 2)
    const newsHighlights = restPosts.filter((post) => post.postType === 'news').slice(0, 2)

    const typeFilters: Array<{ key: FilterType; label: string }> = [
        { key: 'all', label: locale === 'de' ? 'Alle' : 'All' },
        { key: 'article', label: locale === 'de' ? 'Artikel' : 'Articles' },
        { key: 'news', label: locale === 'de' ? 'News' : 'News' },
        { key: 'class', label: locale === 'de' ? 'Klassen' : 'Classes' },
    ]

    return (
        <>
            <section className="padding-section-hero section-atmosphere relative">
                <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-copper/10 blur-[120px]" />
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

            {featuredPost && (
                <section className="padding-large section-atmosphere">
                    <div className="container">
                        <Link
                            href={{
                                pathname: '/blog/[slug]',
                                params: { slug: featuredPost.slug || '' },
                            }}
                            className="group grid overflow-hidden rounded-[1.9rem] border border-border/70 bg-card/85 backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:border-copper/30 hover:shadow-copper-glow md:grid-cols-[1.4fr_1fr]"
                        >
                            <div className="relative min-h-72 bg-muted">
                                {typeof featuredPost.featuredImage === 'object' &&
                                (featuredPost.featuredImage as Media)?.url ? (
                                    <Image
                                        src={(featuredPost.featuredImage as Media).url!}
                                        alt={
                                            (featuredPost.featuredImage as Media).alt ||
                                            featuredPost.title ||
                                            ''
                                        }
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, 60vw"
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

            <section className="pb-8 section-atmosphere">
                <div className="container space-y-4">
                    <div className="flex flex-wrap items-center justify-center gap-2">
                        {typeFilters.map((typeOption) => {
                            const isActive = typeOption.key === typeParam
                            return (
                                <Link
                                    key={typeOption.key}
                                    href={buildBlogFilterHref(typeOption.key, categoryParam)}
                                    className={
                                        isActive
                                            ? 'pill-filter pill-filter-active'
                                            : 'pill-filter pill-filter-default'
                                    }
                                >
                                    {typeOption.label}
                                </Link>
                            )
                        })}
                    </div>

                    {archive?.showCategories !== false && categories.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-2">
                            <Link
                                href={buildBlogFilterHref(typeParam, 'all')}
                                className={
                                    categoryParam === 'all'
                                        ? 'badge-pill badge-pill-sm badge-pill-copper'
                                        : 'badge-pill badge-pill-sm badge-pill-surface'
                                }
                            >
                                {locale === 'de' ? 'Alle Kategorien' : 'All categories'}
                            </Link>
                            {categories.map((cat) => {
                                const catSlug = typeof cat.slug === 'string' ? cat.slug : ''
                                const isActive = catSlug.length > 0 && catSlug === categoryParam
                                if (!catSlug) return null
                                return (
                                    <Link
                                        key={cat.id}
                                        href={buildBlogFilterHref(typeParam, catSlug)}
                                        className={
                                            isActive
                                                ? 'badge-pill badge-pill-sm badge-pill-copper'
                                                : 'badge-pill badge-pill-sm badge-pill-surface'
                                        }
                                    >
                                        {cat.title}
                                    </Link>
                                )
                            })}
                        </div>
                    )}
                </div>
            </section>

            {(classHighlights.length > 0 || newsHighlights.length > 0) && typeParam === 'all' && (
                <section className="pb-6 section-atmosphere">
                    <div className="container grid gap-4 lg:grid-cols-2">
                        {classHighlights.length > 0 && (
                            <div className="surface-pill border border-border/70 p-5 shadow-copper-glow">
                                <h2 className="mb-4 font-display text-xl font-bold chrome-text">
                                    {locale === 'de' ? 'Nächste Klassen' : 'Upcoming classes'}
                                </h2>
                                <div className="space-y-3">
                                    {classHighlights.map((post) => {
                                        const details = post.classDetails
                                        const studio = [
                                            readLocalizedValue(details?.studioName, locale),
                                            readLocalizedValue(details?.studioCity, locale),
                                        ]
                                            .filter(Boolean)
                                            .join(' · ')
                                        return (
                                            <Link
                                                key={post.id}
                                                href={{
                                                    pathname: '/blog/[slug]',
                                                    params: { slug: post.slug || '' },
                                                }}
                                                className="block rounded-xl border border-border/70 bg-card/70 p-3 transition-colors hover:border-copper/30 hover:bg-foreground/5"
                                            >
                                                <p className="line-clamp-1 text-sm font-semibold text-foreground">
                                                    {post.title}
                                                </p>
                                                <div className="mt-2 space-y-1.5 text-xs text-muted-foreground">
                                                    {details?.classDate && (
                                                        <p className="flex items-center gap-2">
                                                            <CalendarDays className="h-3.5 w-3.5 text-copper" />
                                                            {formatDateTime(
                                                                details.classDate,
                                                                locale,
                                                            )}
                                                        </p>
                                                    )}
                                                    {studio && (
                                                        <p className="flex items-center gap-2">
                                                            <MapPin className="h-3.5 w-3.5 text-copper" />
                                                            {studio}
                                                        </p>
                                                    )}
                                                </div>
                                            </Link>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {newsHighlights.length > 0 && (
                            <div className="surface-pill border border-border/70 p-5 shadow-copper-glow">
                                <h2 className="mb-4 font-display text-xl font-bold chrome-text">
                                    {locale === 'de' ? 'Neueste News' : 'Latest news'}
                                </h2>
                                <div className="space-y-3">
                                    {newsHighlights.map((post) => (
                                        <Link
                                            key={post.id}
                                            href={{
                                                pathname: '/blog/[slug]',
                                                params: { slug: post.slug || '' },
                                            }}
                                            className="block rounded-xl border border-border/70 bg-card/70 p-3 transition-colors hover:border-copper/30 hover:bg-foreground/5"
                                        >
                                            <p className="line-clamp-1 text-sm font-semibold text-foreground">
                                                {post.title}
                                            </p>
                                            {post.excerpt && (
                                                <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                                                    {post.excerpt}
                                                </p>
                                            )}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            )}

            <section className="padding-large section-atmosphere relative">
                <div className="pointer-events-none absolute left-1/2 bottom-0 h-72 w-[34rem] -translate-x-1/2 rounded-full bg-copper/8 blur-[110px]" />
                <div className="container relative">
                    {restPosts.length > 0 ? (
                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {restPosts.map((post, index) => {
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
                                        className="group block overflow-hidden rounded-[1.65rem] border border-border/70 bg-card/82 backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:border-copper/30 hover:bg-foreground/5 hover:shadow-copper-glow"
                                    >
                                        <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                                            {image?.url ? (
                                                <Image
                                                    src={image.url}
                                                    alt={image.alt || post.title || ''}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                    priority={index === 0}
                                                />
                                            ) : (
                                                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                                                    {locale === 'de' ? 'Magazin' : 'Blog'}
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-6">
                                            {(postCategories.length > 0 ||
                                                isClassPost ||
                                                isNewsPost) && (
                                                <div className="mb-3 flex flex-wrap gap-2">
                                                    {postCategories.map((cat) => (
                                                        <span
                                                            key={(cat as Category).id}
                                                            className="tag text-xs"
                                                            style={
                                                                (cat as Category).color
                                                                    ? {
                                                                          color: (cat as Category)
                                                                              .color!,
                                                                      }
                                                                    : undefined
                                                            }
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

                                            {post.excerpt && (
                                                <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">
                                                    {post.excerpt}
                                                </p>
                                            )}

                                            {isClassPost && classDetails && (
                                                <div className="mb-4 space-y-2 rounded-xl border border-copper/25 bg-copper/5 p-3">
                                                    {classDate && (
                                                        <p className="flex items-center gap-2 text-xs text-foreground/90">
                                                            <CalendarDays className="h-3.5 w-3.5 text-copper" />
                                                            {classDate}
                                                        </p>
                                                    )}
                                                    {(studioName || studioCity) && (
                                                        <p className="flex items-center gap-2 text-xs text-foreground/90">
                                                            <MapPin className="h-3.5 w-3.5 text-copper" />
                                                            {[studioName, studioCity]
                                                                .filter(Boolean)
                                                                .join(' · ')}
                                                        </p>
                                                    )}
                                                    {(danceStyle || level || duration) && (
                                                        <p className="flex items-center gap-2 text-xs text-foreground/90">
                                                            <Clock3 className="h-3.5 w-3.5 text-copper" />
                                                            {[danceStyle, level, duration]
                                                                .filter(Boolean)
                                                                .join(' · ')}
                                                        </p>
                                                    )}
                                                    {classDetails.maxParticipants != null && (
                                                        <p className="flex items-center gap-2 text-xs text-foreground/90">
                                                            <Users className="h-3.5 w-3.5 text-copper" />
                                                            {locale === 'de'
                                                                ? `Max. ${classDetails.maxParticipants} Teilnehmer`
                                                                : `Max ${classDetails.maxParticipants} participants`}
                                                        </p>
                                                    )}
                                                    {instructors.length > 0 && (
                                                        <p className="text-xs text-muted-foreground">
                                                            {locale === 'de' ? 'Mit' : 'With'}{' '}
                                                            {instructors.join(', ')}
                                                        </p>
                                                    )}
                                                </div>
                                            )}

                                            {post.publishedAt && (
                                                <time className="text-xs text-muted-foreground">
                                                    {formatDate(post.publishedAt, locale)}
                                                </time>
                                            )}
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="py-16 text-center text-muted-foreground">
                            {locale === 'de' ? 'Noch keine Beiträge vorhanden.' : 'No posts yet.'}
                        </div>
                    )}
                </div>
            </section>

            {archive?.showCta && (
                <section className="padding-large section-atmosphere bg-muted/30">
                    <div className="container mx-auto max-w-2xl text-center">
                        {archive.ctaHeadline && (
                            <h2 className="chrome-text mb-4 font-display text-3xl font-bold md:text-4xl">
                                {archive.ctaHeadline}
                            </h2>
                        )}
                        {archive.ctaDescription && (
                            <p className="leading-relaxed text-muted-foreground">
                                {archive.ctaDescription}
                            </p>
                        )}
                    </div>
                </section>
            )}
        </>
    )
}
