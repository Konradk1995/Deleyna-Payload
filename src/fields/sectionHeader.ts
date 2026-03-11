import type { Field } from 'payload'
import { link } from './link'

interface SectionHeaderFieldsOptions {
    /** Include badge field (default: true) */
    badge?: boolean
    /** Include titleHighlight field (default: true) */
    titleHighlight?: boolean
    /** Include heading level selector h1/h2/h3 (default: false — defaults to h2) */
    headingLevel?: boolean
    /** Include description field (default: true) */
    description?: boolean
    /** Use richText for description instead of textarea (default: false) */
    richDescription?: boolean
    /** Override the description field name (default: 'description') */
    descriptionFieldName?: string
    /** Include optional CTA button (default: false) */
    cta?: boolean
}

/**
 * Reusable section header field group for blocks.
 *
 * Generates fields in the standard order:
 *   badge → title → headingLevel → titleHighlight → description → cta
 *
 * Usage in block config:
 * ```ts
 * fields: [
 *   ...sectionHeaderFields(),
 *   // ... block-specific fields
 * ]
 * ```
 */
export function sectionHeaderFields(options: SectionHeaderFieldsOptions = {}): Field[] {
    const {
        badge = true,
        titleHighlight = true,
        headingLevel = false,
        description = true,
        richDescription = false,
        descriptionFieldName = 'description',
        cta = false,
    } = options

    const fields: Field[] = []

    if (badge) {
        fields.push({
            name: 'badge',
            type: 'text',
            localized: true,
            label: { de: 'Badge', en: 'Badge' },
            admin: {
                description: {
                    de: 'Kleines Label über der Überschrift (z.B. "SO FUNKTIONIERT\'S")',
                    en: 'Small label above the headline (e.g. "HOW IT WORKS")',
                },
            },
        })
    }

    fields.push({
        name: 'title',
        type: 'text',
        localized: true,
        label: { de: 'Titel', en: 'Title' },
        admin: {
            description: {
                de: 'Überschrift der Section — leer lassen zum Ausblenden',
                en: 'Section headline — leave empty to hide',
            },
        },
    })

    if (headingLevel) {
        fields.push({
            name: 'headingLevel',
            type: 'select',
            defaultValue: 'h2',
            label: { de: 'Überschriften-Ebene', en: 'Heading level' },
            options: [
                { label: 'H1', value: 'h1' },
                { label: 'H2', value: 'h2' },
                { label: 'H3', value: 'h3' },
            ],
            admin: {
                description: {
                    de: 'Überschriften-Ebene für SEO-Hierarchie (Standard: H2)',
                    en: 'Heading level for SEO hierarchy (default: H2)',
                },
                width: '50%',
            },
        })
    }

    if (titleHighlight) {
        fields.push({
            name: 'titleHighlight',
            type: 'text',
            localized: true,
            label: { de: 'Hervorhebung', en: 'Highlight' },
            admin: {
                description: {
                    de: 'Wort oder Phrase in Akzentfarbe hervorheben',
                    en: 'Word or phrase to highlight in accent colour',
                },
            },
        })
    }

    if (description) {
        if (richDescription) {
            fields.push({
                name: descriptionFieldName,
                type: 'richText',
                localized: true,
                label: { de: 'Beschreibung', en: 'Description' },
                admin: {
                    description: {
                        de: 'Optionaler Beschreibungstext unter der Überschrift',
                        en: 'Optional description text below the headline',
                    },
                },
            })
        } else {
            fields.push({
                name: descriptionFieldName,
                type: 'textarea',
                localized: true,
                label: { de: 'Beschreibung', en: 'Description' },
                admin: {
                    description: {
                        de: 'Optionaler Beschreibungstext unter der Überschrift',
                        en: 'Optional description text below the headline',
                    },
                },
            })
        }
    }

    if (cta) {
        fields.push(
            link({
                overrides: {
                    name: 'cta',
                    label: { de: 'CTA-Button (optional)', en: 'CTA button (optional)' },
                    admin: {
                        description: {
                            de: 'Optionaler Button unter der Section',
                            en: 'Optional button below the section',
                        },
                    },
                },
                optionalLink: true,
                appearances: false,
            }),
        )
    }

    return fields
}
