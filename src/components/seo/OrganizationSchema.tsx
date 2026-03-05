import React from 'react'
import { getServerSideURL } from '@/utilities/getURL'
import { JsonLdScripts } from './JsonLdScripts'

interface OrganizationSchemaProps {
    name?: string
    url?: string
    logo?: string
    description?: string
    email?: string
    phone?: string
    address?: {
        street?: string
        city?: string
        postalCode?: string
        country?: string
    }
    socialProfiles?: string[]
}

/**
 * OrganizationSchema - Schema.org für die Startseite
 *
 * Enthält:
 * - Organization
 * - WebSite
 * - LocalBusiness (Talent Agency)
 */
export function OrganizationSchema({
    name = 'Deleyna Talent Agency',
    url = getServerSideURL(),
    logo,
    description = 'Elite representation for dancers & models. Where artistry meets opportunity.',
    email = 'hello@deleyna.com',
    phone,
    address,
    socialProfiles = [],
}: OrganizationSchemaProps) {
    const organizationSchema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': `${url}/#organization`,
        name,
        url,
        ...(logo && { logo }),
        description,
        ...(email && { email }),
        ...(phone && { telephone: phone }),
        ...(address && {
            address: {
                '@type': 'PostalAddress',
                streetAddress: address.street,
                addressLocality: address.city,
                postalCode: address.postalCode,
                addressCountry: address.country,
            },
        }),
        ...(socialProfiles.length > 0 && { sameAs: socialProfiles }),
    }

    const webSiteSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${url}/#website`,
        url,
        name,
        description,
        publisher: {
            '@id': `${url}/#organization`,
        },
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `${url}/talents?q={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
        },
    }

    const localBusinessSchema = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        '@id': `${url}/#localbusiness`,
        name,
        url,
        ...(logo && { image: logo }),
        description,
        ...(email && { email }),
        ...(phone && { telephone: phone }),
        ...(address && {
            address: {
                '@type': 'PostalAddress',
                streetAddress: address.street,
                addressLocality: address.city,
                postalCode: address.postalCode,
                addressCountry: address.country,
            },
        }),
        priceRange: '$$$',
        // Talent/Model Agency specific
        additionalType: 'https://schema.org/EmploymentAgency',
    }

    return (
        <JsonLdScripts
            keyPrefix={`${url}/organization`}
            schemas={[organizationSchema, webSiteSchema, localBusinessSchema]}
        />
    )
}
