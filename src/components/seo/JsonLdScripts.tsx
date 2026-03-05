import React from 'react'

type JsonLdObject = Record<string, unknown>

function isJsonLdObject(value: unknown): value is JsonLdObject {
    return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function normalizeSchemas(input: unknown): JsonLdObject[] {
    if (!input) return []
    const values = Array.isArray(input) ? input : [input]
    return values.filter(isJsonLdObject)
}

interface JsonLdScriptsProps {
    schemas: unknown
    keyPrefix?: string
}

/**
 * Shared JSON-LD renderer for SEO components.
 * Ensures only object payloads are rendered as application/ld+json scripts.
 */
export function JsonLdScripts({ schemas, keyPrefix = 'jsonld' }: JsonLdScriptsProps) {
    const normalized = normalizeSchemas(schemas)

    if (normalized.length === 0) {
        return null
    }

    return (
        <>
            {normalized.map((schema, index) => (
                <script
                    key={`${keyPrefix}-${index}`}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
                />
            ))}
        </>
    )
}

