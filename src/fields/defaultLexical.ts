import type { TextFieldSingleValidation } from 'payload'
import {
    BoldFeature,
    ItalicFeature,
    LinkFeature,
    ParagraphFeature,
    lexicalEditor,
    UnderlineFeature,
    HeadingFeature,
    OrderedListFeature,
    UnorderedListFeature,
    BlockquoteFeature,
    type LinkFields,
} from '@payloadcms/richtext-lexical'

/**
 * Default Lexical Editor Configuration
 * Used for rich text fields throughout the CMS
 */
export const defaultLexical = lexicalEditor({
    features: [
        ParagraphFeature(),
        HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
        UnderlineFeature(),
        BoldFeature(),
        ItalicFeature(),
        OrderedListFeature(),
        UnorderedListFeature(),
        BlockquoteFeature(),
        LinkFeature({
            enabledCollections: ['pages', 'posts'],
            fields: ({ defaultFields }) => {
                const defaultFieldsWithoutUrl = defaultFields.filter((field) => {
                    if ('name' in field && field.name === 'url') return false
                    return true
                })

                return [
                    ...defaultFieldsWithoutUrl,
                    {
                        name: 'url',
                        type: 'text',
                        admin: {
                            condition: (_data, siblingData) => siblingData?.linkType !== 'internal',
                        },
                        label: ({ t }) => t('fields:enterURL'),
                        required: true,
                        validate: ((value, options) => {
                            if ((options?.siblingData as LinkFields)?.linkType === 'internal') {
                                return true
                            }
                            return value ? true : 'URL is required'
                        }) as TextFieldSingleValidation,
                    },
                ]
            },
        }),
    ],
})

/**
 * Minimal Lexical Editor for simple text
 */
export const minimalLexical = lexicalEditor({
    features: [ParagraphFeature(), BoldFeature(), ItalicFeature(), UnderlineFeature()],
})
