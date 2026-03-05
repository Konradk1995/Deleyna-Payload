import React from 'react'
import type { Page } from '@/payload-types'
import { generatePageStructuredData } from '@/utilities/generateMeta'
import { JsonLdScripts } from './JsonLdScripts'

function parseCustomSchemaMarkup(schemaMarkup: unknown): object[] {
    if (typeof schemaMarkup !== 'string' || schemaMarkup.trim() === '') {
        return []
    }

    try {
        const parsed = JSON.parse(schemaMarkup)
        if (Array.isArray(parsed)) {
            return parsed.filter((item): item is object => Boolean(item) && typeof item === 'object')
        }
        if (parsed && typeof parsed === 'object') {
            return [parsed]
        }
    } catch {
        return []
    }

    return []
}

export function PageStructuredData({
    page,
    url,
}: {
    page: Partial<Page>
    url: string
}) {
    const schemas = generatePageStructuredData(page, url)
    const pageSettings = (page as { pageSettings?: { schemaMarkup?: unknown; customSchema?: unknown } }).pageSettings
    const customSchemas = parseCustomSchemaMarkup(pageSettings?.schemaMarkup ?? pageSettings?.customSchema)
    const allSchemas = [...schemas, ...customSchemas]

    if (allSchemas.length === 0) {
        return null
    }

    return <JsonLdScripts keyPrefix={`${url}-page`} schemas={allSchemas} />
}
