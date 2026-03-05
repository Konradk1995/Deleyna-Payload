import React from 'react'
import { getServerSideURL } from '@/utilities/getURL'
import { JsonLdScripts } from './JsonLdScripts'

interface TalentItem {
    name: string
    slug: string
    category: 'dancer' | 'model' | 'both'
    imageUrl?: string
}

interface TalentsListSchemaProps {
    talents: TalentItem[]
    totalCount: number
    locale?: string
}

/**
 * TalentsListSchema - Schema.org für die Talent-Übersichtsseite
 *
 * Enthält:
 * - CollectionPage
 * - ItemList
 * - BreadcrumbList
 */
export function TalentsListSchema({ talents, totalCount, locale = 'de' }: TalentsListSchemaProps) {
    const siteUrl = getServerSideURL()
    const isGerman = locale === 'de'
    const talentBasePath = locale === 'de' ? 'talente' : 'talents'
    const pageUrl = `${siteUrl}/${locale}/${talentBasePath}`

    const collectionPageSchema = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        '@id': pageUrl,
        url: pageUrl,
        name: isGerman ? 'Unser Talent-Roster' : 'Our talent roster',
        description: isGerman
            ? 'Entdecke unser kuratiertes Roster aus Tänzerinnen, Tänzern und Models.'
            : 'Discover our curated roster of exceptional dancers and models.',
        isPartOf: {
            '@type': 'WebSite',
            '@id': `${siteUrl}/#website`,
        },
        about: {
            '@type': 'Thing',
            name: isGerman ? 'Tänzer und Models' : 'Dancers and models',
        },
        numberOfItems: totalCount,
    }

    const itemListSchema = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: talents.map((talent, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: `${siteUrl}/${locale}/${talentBasePath}/${talent.slug}`,
            name: talent.name,
            ...(talent.imageUrl && { image: talent.imageUrl }),
        })),
        numberOfItems: talents.length,
    }

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: isGerman ? 'Startseite' : 'Home',
                item: `${siteUrl}/${locale}`,
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: isGerman ? 'Talente' : 'Talents',
                item: pageUrl,
            },
        ],
    }

    return (
        <JsonLdScripts
            keyPrefix={`${pageUrl}/talents-list`}
            schemas={[collectionPageSchema, itemListSchema, breadcrumbSchema]}
        />
    )
}
