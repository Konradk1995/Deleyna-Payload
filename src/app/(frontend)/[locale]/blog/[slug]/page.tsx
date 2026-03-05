import { getPayload } from 'payload'
import config from '@/payload.config'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { getCachedDocument } from '@/utilities/getDocument'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import { ArrowLeft, CalendarDays, Clock3, ExternalLink, MapPin, Users } from 'lucide-react'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { ArticleSchema } from '@/components/seo'
import { generateMeta } from '@/utilities/generateMeta'

import type { Metadata } from 'next'
import type { Post, Media, Category, Talent } from '@/payload-types'

const ALLOWED_MAP_ORIGINS = [
    'https://www.google.com',
    'https://maps.google.com',
    'https://www.openstreetmap.org',
]

function isAllowedMapUrl(url: string | null | undefined): boolean {
    if (!url || typeof url !== 'string') return false
    try {
        const parsed = new URL(url.trim())
        if (parsed.protocol !== 'https:') return false
        return ALLOWED_MAP_ORIGINS.some((origin) => parsed.origin === origin)
    } catch {
        return false
    }
}

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
            collection: 'posts',
            depth: 0,
            draft: isDraft,
            locale: locale as 'de' | 'en',
            where: {
                slug: { equals: slug },
                ...(isDraft ? {} : { _status: { equals: 'published' } }),
            },
            limit: 1,
        })

        const post = result.docs[0]
        if (!post) return { title: locale === 'de' ? 'Beitrag nicht gefunden' : 'Post not found' }

        return generateMeta({ doc: post, locale })
    } catch {
        return { title: locale === 'de' ? 'Magazin' : 'Blog' }
    }
}

export async function generateStaticParams() {
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    try {
        const result = await payload.find({
            collection: 'posts',
            depth: 0,
            select: { slug: true },
            where: { _status: { equals: 'published' } },
            limit: 100,
        })

        return result.docs.map((post) => ({ slug: post.slug || '' }))
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

type PostWithClass = Post & {
    postType?: 'article' | 'class' | 'news' | null
    classDetails?: {
        classDate?: string | null
        classEndDate?: string | null
        studioName?: string | Record<string, string> | null
        studioCity?: string | Record<string, string> | null
        studioAddress?: string | Record<string, string> | null
        danceStyle?: string | Record<string, string> | null
        level?: string | null
        duration?: string | Record<string, string> | null
        priceInfo?: string | Record<string, string> | null
        maxParticipants?: number | null
        bookingUrl?: string | null
        mapEmbedUrl?: string | null
        instructorTalents?: Array<number | Talent> | null
    } | null
}

function postTypeBadge(
    postType: 'article' | 'class' | 'news' | null | undefined,
    locale: string,
): string {
    if (postType === 'class') return locale === 'de' ? 'Tanzkurs' : 'Dance class'
    if (postType === 'news') return locale === 'de' ? 'Neuigkeiten' : 'News'
    return locale === 'de' ? 'Artikel' : 'Article'
}

export default async function BlogPostPage({ params }: PageProps) {
    const { locale, slug } = await params
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })
    const { isEnabled: isDraft } = await draftMode()

    let post: PostWithClass | null = null

    try {
        if (isDraft) {
            const result = await payload.find({
                collection: 'posts',
                draft: true,
                locale: locale as 'de' | 'en',
                where: { slug: { equals: slug } },
                limit: 1,
                depth: 2,
            })
            post = (result.docs[0] as PostWithClass) || null
        } else {
            post = await getCachedDocument<PostWithClass>('posts', slug, {
                locale,
                depth: 2,
            })
        }
    } catch (error) {
        console.error('Error fetching post:', error)
    }

    if (!post) notFound()

    const featuredImage =
        typeof post.featuredImage === 'object' ? (post.featuredImage as Media) : null
    const categories = Array.isArray(post.categories)
        ? (post.categories
              .map((c) => (typeof c === 'object' ? (c as Category) : null))
              .filter(Boolean) as Category[])
        : []
    const showTypeBadge = post.postType === 'class' || post.postType === 'news'
    const isClassPost = post.postType === 'class'
    const classDetails = post.classDetails
    const studioName = readLocalizedValue(classDetails?.studioName, locale)
    const studioCity = readLocalizedValue(classDetails?.studioCity, locale)
    const studioAddress = readLocalizedValue(classDetails?.studioAddress, locale)
    const danceStyle = readLocalizedValue(classDetails?.danceStyle, locale)
    const duration = readLocalizedValue(classDetails?.duration, locale)
    const priceInfo = readLocalizedValue(classDetails?.priceInfo, locale)
    const level = classLevelLabel(classDetails?.level, locale)
    const classStart = classDetails?.classDate ? formatDateTime(classDetails.classDate, locale) : ''
    const classEnd = classDetails?.classEndDate
        ? formatDateTime(classDetails.classEndDate, locale)
        : ''
    const instructors = Array.isArray(classDetails?.instructorTalents)
        ? classDetails.instructorTalents
              .map((entry) => {
                  if (typeof entry !== 'object' || entry === null) return null
                  const talent = entry as Talent
                  return {
                      id: String(talent.id),
                      name: readLocalizedValue(talent.name, locale),
                      slug: typeof talent.slug === 'string' ? talent.slug : '',
                  }
              })
              .filter((entry): entry is { id: string; name: string; slug: string } =>
                  Boolean(entry?.name),
              )
        : []

    // Fetch related posts
    let relatedPosts: Post[] = []
    if (post.relatedPosts && post.relatedPosts.length > 0) {
        const relatedIds = post.relatedPosts.map((r) => (typeof r === 'object' ? r.id : r))
        try {
            const relResult = await payload.find({
                collection: 'posts',
                locale: locale as 'de' | 'en',
                depth: 1,
                where: {
                    id: { in: relatedIds },
                    _status: { equals: 'published' },
                },
                limit: 3,
            })
            relatedPosts = relResult.docs
        } catch {
            // ignore
        }
    }

    return (
        <article>
            {/* Schema.org Article + Breadcrumb Structured Data */}
            <ArticleSchema
                title={post.title || ''}
                slug={slug}
                locale={locale}
                description={post.excerpt || post.pageSettings?.metaDescription || undefined}
                imageUrl={featuredImage?.url || undefined}
                publishedAt={post.publishedAt || undefined}
                updatedAt={post.updatedAt}
                authorName={
                    typeof post.author === 'object' && post.author?.name
                        ? post.author.name
                        : undefined
                }
                categories={categories.map((c) => c.title).filter(Boolean) as string[]}
            />

            {/* Hero */}
            <section className="section-padding section-atmosphere">
                <div className="container max-w-5xl">
                    <Link
                        href="/blog"
                        className="overline mb-8 inline-flex items-center gap-2 text-copper hover:opacity-80 transition-opacity"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        {locale === 'de' ? 'Zurück zum Magazin' : 'Back to Blog'}
                    </Link>

                    {/* Categories */}
                    {(categories.length > 0 || showTypeBadge) && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {categories.map((cat) => (
                                <span
                                    key={cat.id}
                                    className="tag text-xs"
                                    style={cat.color ? { color: cat.color } : undefined}
                                >
                                    {cat.title}
                                </span>
                            ))}
                            {showTypeBadge && (
                                <span className="badge-pill badge-pill-sm badge-pill-copper">
                                    {postTypeBadge(post.postType, locale)}
                                </span>
                            )}
                        </div>
                    )}

                    <h1 className="chrome-text text-4xl font-bold font-display mb-6 tracking-tight md:text-5xl">
                        {post.title}
                    </h1>

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
                        {post.publishedAt && <time>{formatDate(post.publishedAt, locale)}</time>}
                        {typeof post.author === 'object' && post.author?.name && (
                            <>
                                <span>&middot;</span>
                                <span>{post.author.name}</span>
                            </>
                        )}
                    </div>

                    {/* Featured Image (chrome-grace: rounded-2xl) */}
                    {featuredImage?.url && (
                        <div className="relative aspect-[16/9] overflow-hidden rounded-[var(--block-radius)] mb-10 glass-morphism border border-border">
                            <Image
                                src={featuredImage.url}
                                alt={featuredImage.alt || post.title || ''}
                                fill
                                className="object-cover"
                                sizes="(max-width: 896px) 100vw, 896px"
                                priority
                            />
                        </div>
                    )}

                    {isClassPost && classDetails && (
                        <div className="mb-10 rounded-[var(--block-radius)] border border-copper/30 bg-copper/5 padding-medium">
                            <h2 className="mb-4 font-display text-2xl font-bold chrome-text">
                                {locale === 'de' ? 'Kursdetails' : 'Class details'}
                            </h2>
                            <div className="grid gap-3 sm:grid-cols-2">
                                {classStart && (
                                    <p className="flex items-start gap-2 text-sm text-foreground/90">
                                        <CalendarDays className="mt-0.5 h-4 w-4 text-copper" />
                                        <span>
                                            {locale === 'de' ? 'Beginn:' : 'Start:'} {classStart}
                                        </span>
                                    </p>
                                )}
                                {classEnd && (
                                    <p className="flex items-start gap-2 text-sm text-foreground/90">
                                        <CalendarDays className="mt-0.5 h-4 w-4 text-copper" />
                                        <span>
                                            {locale === 'de' ? 'Ende:' : 'End:'} {classEnd}
                                        </span>
                                    </p>
                                )}
                                {(studioName || studioCity) && (
                                    <p className="flex items-start gap-2 text-sm text-foreground/90">
                                        <MapPin className="mt-0.5 h-4 w-4 text-copper" />
                                        <span>
                                            {[studioName, studioCity].filter(Boolean).join(' · ')}
                                        </span>
                                    </p>
                                )}
                                {studioAddress && (
                                    <p className="flex items-start gap-2 text-sm text-foreground/90">
                                        <MapPin className="mt-0.5 h-4 w-4 text-copper" />
                                        <span>{studioAddress}</span>
                                    </p>
                                )}
                                {(danceStyle || level || duration) && (
                                    <p className="flex items-start gap-2 text-sm text-foreground/90">
                                        <Clock3 className="mt-0.5 h-4 w-4 text-copper" />
                                        <span>
                                            {[danceStyle, level, duration]
                                                .filter(Boolean)
                                                .join(' · ')}
                                        </span>
                                    </p>
                                )}
                                {classDetails.maxParticipants != null && (
                                    <p className="flex items-start gap-2 text-sm text-foreground/90">
                                        <Users className="mt-0.5 h-4 w-4 text-copper" />
                                        <span>
                                            {locale === 'de'
                                                ? `Max. ${classDetails.maxParticipants} Teilnehmer`
                                                : `Max ${classDetails.maxParticipants} participants`}
                                        </span>
                                    </p>
                                )}
                                {priceInfo && (
                                    <p className="text-sm text-foreground/90">
                                        {locale === 'de' ? 'Preis:' : 'Price:'} {priceInfo}
                                    </p>
                                )}
                            </div>

                            {instructors.length > 0 && (
                                <div className="mt-4">
                                    <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
                                        {locale === 'de'
                                            ? 'Instructor-Talente'
                                            : 'Instructor talents'}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {instructors.map((talent) =>
                                            talent.slug ? (
                                                <Link
                                                    key={talent.id}
                                                    href={{
                                                        pathname: '/talents/[slug]',
                                                        params: { slug: talent.slug },
                                                    }}
                                                    className="rounded-full border border-border px-3 py-1 text-xs font-medium text-foreground hover:border-copper/40 hover:text-copper transition-colors"
                                                >
                                                    {talent.name}
                                                </Link>
                                            ) : (
                                                <span
                                                    key={talent.id}
                                                    className="rounded-full border border-border px-3 py-1 text-xs font-medium text-foreground"
                                                >
                                                    {talent.name}
                                                </span>
                                            ),
                                        )}
                                    </div>
                                </div>
                            )}

                            {classDetails.bookingUrl && (
                                <div className="mt-5">
                                    <a
                                        href={classDetails.bookingUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 rounded-full border border-copper/40 bg-copper/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-copper transition-colors hover:bg-copper/20"
                                    >
                                        {locale === 'de' ? 'Jetzt buchen' : 'Book now'}
                                        <ExternalLink className="h-3.5 w-3.5" />
                                    </a>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Map Embed (optional) */}
                    {isClassPost &&
                        classDetails?.mapEmbedUrl &&
                        isAllowedMapUrl(classDetails.mapEmbedUrl) && (
                            <div className="mb-12">
                                <div className="overflow-hidden rounded-[var(--block-radius)] border border-border shadow-sm">
                                    <iframe
                                        title={
                                            studioName
                                                ? `${studioName} – ${locale === 'de' ? 'Karte' : 'Map'}`
                                                : locale === 'de'
                                                  ? 'Standortkarte'
                                                  : 'Location map'
                                        }
                                        src={classDetails.mapEmbedUrl.trim()}
                                        width="100%"
                                        height={350}
                                        className="block border-0"
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    />
                                </div>
                            </div>
                        )}
                </div>
            </section>

            {/* Content Blocks */}
            {post.content && (
                <div className="section-atmosphere">
                    <div className="container max-w-5xl">
                        <RenderBlocks blocks={post.content} locale={locale} />
                    </div>
                </div>
            )}

            {/* Related Posts (chrome-grace style) */}
            {relatedPosts.length > 0 && (
                <section className="section-padding section-atmosphere bg-muted/30 border-t border-border">
                    <div className="container max-w-5xl">
                        <h2 className="chrome-text text-2xl font-bold font-display mb-8">
                            {locale === 'de' ? 'Ähnliche Beiträge' : 'Related Posts'}
                        </h2>
                        <div className="grid gap-6 sm:grid-cols-3">
                            {relatedPosts.map((related) => {
                                const relImage =
                                    typeof related.featuredImage === 'object'
                                        ? (related.featuredImage as Media)
                                        : null
                                return (
                                    <Link
                                        key={related.id}
                                        href={{
                                            pathname: '/blog/[slug]',
                                            params: { slug: related.slug || '' },
                                        }}
                                        className="group block rounded-[var(--block-radius)] overflow-hidden border border-border glass-morphism transition hover:border-copper/30 hover:bg-foreground/5"
                                    >
                                        <div className="relative aspect-[16/9] bg-muted overflow-hidden">
                                            {relImage?.url && (
                                                <Image
                                                    src={relImage.url}
                                                    alt={relImage.alt || related.title || ''}
                                                    fill
                                                    className="object-cover transition-transform group-hover:scale-105"
                                                    sizes="33vw"
                                                    loading="lazy"
                                                />
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                                                {related.title}
                                            </h3>
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
