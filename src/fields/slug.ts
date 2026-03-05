import type { Field } from 'payload'

interface SlugFieldOptions {
    fieldToUse?: string
    overrides?: Partial<Field>
}

export const slugField = ({
    fieldToUse = 'title',
    overrides = {},
}: SlugFieldOptions = {}): Field => {
    return {
        name: 'slug',
        type: 'text',
        required: true,
        unique: true,
        index: true,
        admin: {
            position: 'sidebar',
            description: { de: 'URL-freundlicher Pfad', en: 'URL-friendly path' },
        },
        hooks: {
            beforeValidate: [
                ({ value, data, operation }) => {
                    if (operation === 'create' && !value && data?.[fieldToUse]) {
                        return data[fieldToUse]
                            .toLowerCase()
                            .replace(/ä/g, 'ae')
                            .replace(/ö/g, 'oe')
                            .replace(/ü/g, 'ue')
                            .replace(/ß/g, 'ss')
                            .replace(/[^a-z0-9]+/g, '-')
                            .replace(/(^-|-$)/g, '')
                    }
                    return value
                },
            ],
        },
        ...overrides,
    } as Field
}
