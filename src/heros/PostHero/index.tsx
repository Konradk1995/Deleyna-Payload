import React from 'react'
import type { Post } from '@/payload-types'
import { Media } from '@/components/Media'
import { formatDateTime } from '@/utilities/formatDateTime'

interface PostHeroProps {
    post: Post
}

export const PostHero: React.FC<PostHeroProps> = ({ post }) => {
    const { title, featuredImage, publishedAt, categories, tags } = post

    // Resolve category objects
    const categoryObjects = Array.isArray(categories)
        ? categories.map((c) => (typeof c === 'object' && c !== null ? c : null)).filter(Boolean)
        : []

    return (
        <section className="relative">
            {/* Hero Image */}
            {featuredImage && typeof featuredImage === 'object' && (
                <div className="relative aspect-[21/9] w-full overflow-hidden">
                    <Media resource={featuredImage} fill imgClassName="object-cover" priority />
                    <div className="media-fade-overlay absolute inset-0" />
                </div>
            )}

            {/* Content */}
            <div className="container relative">
                <div
                    className={
                        featuredImage ? 'relative z-10 -mt-20 md:-mt-24' : 'padding-section-hero'
                    }
                >
                    <div className="surface-pill mx-auto max-w-3xl padding-medium md:padding-large">
                        {/* Categories */}
                        {categoryObjects.length > 0 && (
                            <div className="mb-4 flex gap-2">
                                {categoryObjects.map((cat) => (
                                    <span
                                        key={cat!.id}
                                        className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                                    >
                                        {cat!.title}
                                    </span>
                                ))}
                            </div>
                        )}

                        <h1 className="font-display-tight font-heading-2-bold leading-none tracking-tight text-balance hyphens-auto [overflow-wrap:anywhere] pb-1 text-foreground">
                            {title}
                        </h1>

                        {publishedAt && (
                            <p className="mt-4 text-sm text-muted-foreground">
                                {formatDateTime(publishedAt)}
                            </p>
                        )}

                        {/* Tags */}
                        {tags && tags.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                                {tags.map((tag, i) => (
                                    <span
                                        key={i}
                                        className="inline-block rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}
