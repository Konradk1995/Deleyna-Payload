import { getServerSideURL } from '@/utilities/getURL'
import { JsonLdScripts } from './JsonLdScripts'
import type { Post, Media } from '@/payload-types'

const BASE_URL = getServerSideURL()

interface BlogListSchemaProps {
    locale: string
    posts: Post[]
    title: string
    description?: string
}

export function BlogListSchema({ locale, posts, title, description }: BlogListSchemaProps) {
    const blogSegment = locale === 'de' ? 'magazin' : 'blog'
    const pageUrl = `${BASE_URL}/${locale}/${blogSegment}`

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
            numberOfItems: posts.length,
            itemListElement: posts.map((post, index) => {
                const postUrl = `${BASE_URL}/${locale}/${blogSegment}/${post.slug}`
                const image = typeof post.featuredImage === 'object' ? (post.featuredImage as Media) : null

                return {
                    '@type': 'ListItem',
                    position: index + 1,
                    url: postUrl,
                    item: {
                        '@type': 'Article',
                        headline: post.title,
                        url: postUrl,
                        ...(post.publishedAt ? { datePublished: post.publishedAt } : {}),
                        ...(post.updatedAt ? { dateModified: post.updatedAt } : {}),
                        ...(image?.url
                            ? {
                                  image: image.url.startsWith('http')
                                      ? image.url
                                      : `${BASE_URL}${image.url}`,
                              }
                            : {}),
                    },
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

    return <JsonLdScripts schemas={schemas} keyPrefix="blog-list" />
}
