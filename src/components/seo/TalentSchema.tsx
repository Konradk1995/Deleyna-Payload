import React from 'react'
import { getServerSideURL } from '@/utilities/getURL'
import { JsonLdScripts } from './JsonLdScripts'

interface TalentSchemaProps {
    name: string
    slug: string
    locale?: 'de' | 'en'
    category: 'dancer' | 'model' | 'both'
    description?: string
    imageUrl?: string
    skills?: string[]
    socialMedia?: {
        instagram?: string
    }
    measurements?: {
        height?: string | number | null
        bust?: string | number | null
        waist?: string | number | null
        hips?: string | number | null
        hair?: string | null
        eyes?: string | null
    }
}

/**
 * TalentSchema - Schema.org für Talent Sedcard Seiten
 *
 * Enthält:
 * - Person (mit Performer-Erweiterung)
 * - ProfilePage
 */
export function TalentSchema({
    name,
    slug,
    locale = 'de',
    category,
    description,
    imageUrl,
    skills = [],
    socialMedia,
    measurements,
}: TalentSchemaProps) {
    const siteUrl = getServerSideURL()
    const talentsSegment = locale === 'de' ? 'talente' : 'talents'
    const homeLabel = locale === 'de' ? 'Startseite' : 'Home'
    const talentsLabel = locale === 'de' ? 'Talente' : 'Talents'
    const talentUrl = `${siteUrl}/${locale}/${talentsSegment}/${slug}`

    // Determine person type based on category
    const getPersonTypes = () => {
        const types = ['Person']
        if (category === 'dancer' || category === 'both') {
            types.push('Dancer')
        }
        // Note: Model isn't a schema.org type, but we can use occupation
        return types
    }

    const personSchema = {
        '@context': 'https://schema.org',
        '@type': getPersonTypes(),
        '@id': `${talentUrl}/#person`,
        name,
        url: talentUrl,
        ...(imageUrl && { image: imageUrl }),
        ...(description && { description }),
        ...(skills.length > 0 && { knowsAbout: skills }),
        ...(socialMedia?.instagram && {
            sameAs: [`https://instagram.com/${socialMedia.instagram.replace('@', '')}`],
        }),
        // Job title based on category
        jobTitle:
            category === 'both'
                ? 'Professional Dancer & Model'
                : category === 'dancer'
                  ? 'Professional Dancer'
                  : 'Professional Model',
        // Affiliated with agency
        worksFor: {
            '@type': 'Organization',
            '@id': `${siteUrl}/#organization`,
            name: 'Deleyna Talent Agency',
        },
        ...(measurements && {
            // Height in cm
            ...(measurements.height && {
                height: {
                    '@type': 'QuantitativeValue',
                    value: measurements.height,
                    unitCode: 'CMT',
                },
            }),
        }),
    }

    const profilePageSchema = {
        '@context': 'https://schema.org',
        '@type': 'ProfilePage',
        '@id': talentUrl,
        url: talentUrl,
        name: `${name} - Sedcard`,
        mainEntity: {
            '@id': `${talentUrl}/#person`,
        },
        isPartOf: {
            '@type': 'WebSite',
            '@id': `${siteUrl}/#website`,
        },
        ...(description && { description }),
        ...(imageUrl && { primaryImageOfPage: imageUrl }),
    }

    // BreadcrumbList for navigation
    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: homeLabel,
                item: `${siteUrl}/${locale}`,
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: talentsLabel,
                item: `${siteUrl}/${locale}/${talentsSegment}`,
            },
            {
                '@type': 'ListItem',
                position: 3,
                name: name,
                item: talentUrl,
            },
        ],
    }

    return (
        <JsonLdScripts
            keyPrefix={`${talentUrl}/talent`}
            schemas={[personSchema, profilePageSchema, breadcrumbSchema]}
        />
    )
}
