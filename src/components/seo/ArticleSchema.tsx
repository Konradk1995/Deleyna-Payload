import React from 'react'
import { JsonLdScripts } from './JsonLdScripts'

interface ArticleSchemaProps {
    title: string
    slug: string
    locale: string
    description?: string
    imageUrl?: string
    publishedAt?: string
    updatedAt?: string
    authorName?: string
    categories?: string[]
}

export function ArticleSchema({
    title,
    slug,
    locale,
    description,
    imageUrl,
    publishedAt,
    updatedAt,
    authorName,
    categories,
}: ArticleSchemaProps) {
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
    const postSegment = locale === 'de' ? 'magazin' : 'blog'
    const url = `${baseUrl}/${locale}/${postSegment}/${slug}`
    const homeUrl = `${baseUrl}/${locale}`
    const homeName = locale === 'de' ? 'Startseite' : 'Home'
    const blogName = locale === 'de' ? 'Magazin' : 'Blog'

    const schemas: object[] = []

    // Article Schema
    const article: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        '@id': `${url}#article`,
        headline: title,
        url,
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    }

    if (description) article.description = description
    if (imageUrl) article.image = imageUrl
    if (publishedAt) article.datePublished = publishedAt
    if (updatedAt) article.dateModified = updatedAt
    if (authorName) {
        article.author = { '@type': 'Person', name: authorName }
    }
    article.publisher = {
        '@type': 'Organization',
        name: 'Deleyna Talent Agency',
        url: baseUrl,
    }
    if (categories && categories.length > 0) {
        article.keywords = categories.join(', ')
    }

    schemas.push(article)

    // BreadcrumbList
    schemas.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: homeName,
                item: homeUrl,
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: blogName,
                item: `${baseUrl}/${locale}/${postSegment}`,
            },
            {
                '@type': 'ListItem',
                position: 3,
                name: title,
                item: url,
            },
        ],
    })

    return <JsonLdScripts keyPrefix={`article-${slug}`} schemas={schemas} />
}
