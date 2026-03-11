import type { Field } from 'payload'

import {
    FixedToolbarFeature,
    HeadingFeature,
    InlineToolbarFeature,
    lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '@/fields/linkGroup'

/**
 * Hero field config with 7 variants (inspired by weess).
 * Each variant shows only its relevant fields via admin.condition.
 */

const heroTypes = [
    { label: { de: 'Kein Hero', en: 'No hero' }, value: 'none' },
    {
        label: { de: 'High Impact (Vollbild)', en: 'High impact (fullscreen)' },
        value: 'highImpact',
    },
    {
        label: { de: 'Medium Impact (mit Bild)', en: 'Medium impact (with image)' },
        value: 'mediumImpact',
    },
    { label: { de: 'Low Impact (nur Text)', en: 'Low impact (text only)' }, value: 'lowImpact' },
    { label: { de: 'Zentriert mit Video', en: 'Centred with video' }, value: 'centeredVideo' },
    { label: { de: 'Text Links + Bild', en: 'Text left + image' }, value: 'textLeftAligned' },
    {
        label: { de: 'Text Zentriert + Hintergrund', en: 'Text centred + background' },
        value: 'textMiddleAligned',
    },
]

const isType =
    (...types: string[]) =>
    (_: unknown, { type }: Record<string, unknown> = {}) =>
        types.includes(type as string)

const isNotNone = (_: unknown, { type }: Record<string, unknown> = {}) => type !== 'none'

export const hero: Field = {
    name: 'hero',
    type: 'group',
    localized: true,
    fields: [
        {
            name: 'type',
            type: 'select',
            defaultValue: 'lowImpact',
            label: { de: 'Hero Typ', en: 'Hero type' },
            options: heroTypes,
            required: true,
        },

        // Badge / Overline (alle ausser none)
        {
            name: 'badge',
            type: 'text',
            label: { de: 'Badge / Overline', en: 'Badge / overline' },
            localized: true,
            admin: {
                condition: isNotNone,
                description: {
                    de: 'z.B. "NEU" oder "Talent Agency" – kleiner Text über der Headline',
                    en: 'e.g. "NEW" or "Talent Agency" – small text above the headline',
                },
            },
        },

        // Explicit headline (H1) and subtext — simple alternative to RichText
        {
            name: 'headline',
            type: 'text',
            label: { de: 'Überschrift (H1)', en: 'Headline (H1)' },
            localized: true,
            admin: {
                condition: isNotNone,
                description: {
                    de: 'Hauptüberschrift der Hero-Section. Wird als H1 ausgegeben.',
                    en: 'Main headline of the hero section. Rendered as H1.',
                },
            },
        },
        {
            name: 'subtext',
            type: 'textarea',
            label: { de: 'Untertitel / Subtext', en: 'Subtitle / subtext' },
            localized: true,
            admin: {
                condition: isNotNone,
                description: {
                    de: 'Kurzer Text unter der Überschrift.',
                    en: 'Short text below the headline.',
                },
            },
        },

        // RichText (all types except none) — for extended content alongside Headline/Subtext
        {
            name: 'richText',
            type: 'richText',
            localized: true,
            editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                    return [
                        ...rootFeatures,
                        HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                        FixedToolbarFeature(),
                        InlineToolbarFeature(),
                    ]
                },
            }),
            label: { de: 'Zusätzlicher Rich-Text', en: 'Additional rich text' },
            admin: {
                condition: isNotNone,
                description: {
                    de: 'Optional: weitere Absätze oder H2/H3. Wenn Überschrift (H1) gesetzt ist, hier nur Zusatzinhalt.',
                    en: 'Optional: additional paragraphs or H2/H3. If headline (H1) is set, use for extra content only.',
                },
            },
        },

        // Headline Highlight (alle ausser none) - wie weess
        {
            name: 'headlineHighlight',
            type: 'text',
            label: { de: 'Hervorgehobenes Wort', en: 'Highlighted word' },
            localized: true,
            admin: {
                condition: isNotNone,
                description: {
                    de: 'Dieses Wort wird in der Headline in der Akzentfarbe hervorgehoben (optional)',
                    en: 'This word is highlighted in the headline in the accent colour (optional)',
                },
            },
        },

        // Links (alle ausser none)
        linkGroup({
            overrides: {
                maxRows: 2,
                localized: true,
                admin: {
                    condition: isNotNone,
                },
            },
        }),

        // Media Image oder Video (highImpact, mediumImpact, textLeftAligned, textMiddleAligned)
        {
            name: 'media',
            type: 'upload',
            admin: {
                condition: isType(
                    'highImpact',
                    'mediumImpact',
                    'textLeftAligned',
                    'textMiddleAligned',
                ),
                description: {
                    de: 'Bild oder Video als Hintergrund/Inhalt (Desktop). Für Video: MP4/WebM hochladen.',
                    en: 'Image or video for background/content (Desktop). For video: upload MP4/WebM.',
                },
            },
            relationTo: 'media',
        },
        {
            name: 'mediaMobile',
            type: 'upload',
            label: { de: 'Mobile Media (optional)', en: 'Mobile Media (optional)' },
            admin: {
                condition: isType(
                    'highImpact',
                    'mediumImpact',
                    'textLeftAligned',
                    'textMiddleAligned',
                ),
                description: {
                    de: 'Optional: Separates Bild oder Video für mobile Geräte (z.B. Hochformat).',
                    en: 'Optional: Separate image or video for mobile devices (e.g. portrait).',
                },
            },
            relationTo: 'media',
        },

        // Hero-Logo (optional, z. B. zentrales DELEYNA-Logo; highImpact, textMiddleAligned)
        {
            name: 'heroLogo',
            type: 'upload',
            label: { de: 'Hero-Logo', en: 'Hero logo' },
            admin: {
                condition: isType('highImpact', 'textMiddleAligned'),
                description: {
                    de: 'Optional: Bild/Logo zentral über oder unter der Headline (z. B. Metallic-Logo).',
                    en: 'Optional: Image/logo centred above or below the headline (e.g. metallic logo).',
                },
            },
            relationTo: 'media',
            filterOptions: {
                mimeType: { contains: 'image' },
            },
        },

        // Background Style (highImpact, textMiddleAligned)
        {
            name: 'backgroundStyle',
            type: 'select',
            label: { de: 'Hintergrund-Stil', en: 'Background style' },
            defaultValue: 'dark',
            options: [
                { label: { de: 'Dunkel', en: 'Dark' }, value: 'dark' },
                { label: { de: 'Hell', en: 'Light' }, value: 'light' },
                { label: { de: 'Gradient', en: 'Gradient' }, value: 'gradient' },
            ],
            admin: {
                condition: isType('highImpact', 'textMiddleAligned'),
            },
        },

        // Alignment (lowImpact, textLeftAligned)
        {
            name: 'alignment',
            type: 'select',
            label: { de: 'Ausrichtung', en: 'Alignment' },
            defaultValue: 'left',
            options: [
                { label: { de: 'Links', en: 'Left' }, value: 'left' },
                { label: { de: 'Zentriert', en: 'Centre' }, value: 'center' },
            ],
            admin: {
                condition: isType('lowImpact'),
            },
        },

        // Right side option (textLeftAligned)
        {
            name: 'rightSide',
            type: 'select',
            label: { de: 'Rechte Seite', en: 'Right side' },
            defaultValue: 'image',
            options: [
                { label: { de: 'Bild', en: 'Image' }, value: 'image' },
                { label: { de: 'Features Liste', en: 'Features list' }, value: 'features' },
                { label: { de: 'Aus', en: 'Off' }, value: 'off' },
            ],
            admin: {
                condition: isType('textLeftAligned'),
            },
        },

        // Features list (textLeftAligned when rightSide = features)
        {
            name: 'features',
            type: 'array',
            label: { de: 'Features', en: 'Features' },
            maxRows: 6,
            admin: {
                condition: (_, { type, rightSide } = {}) =>
                    type === 'textLeftAligned' && rightSide === 'features',
            },
            fields: [
                {
                    name: 'feature',
                    type: 'text',
                    required: true,
                    localized: true,
                },
            ],
        },

        // Scroll Indicator (highImpact)
        {
            name: 'showScrollIndicator',
            type: 'checkbox',
            label: { de: 'Scroll-Indikator anzeigen', en: 'Show scroll indicator' },
            defaultValue: true,
            admin: {
                condition: isType('highImpact', 'centeredVideo', 'textMiddleAligned'),
            },
        },

        // Video Fields (centeredVideo)
        {
            name: 'video',
            type: 'relationship',
            relationTo: 'media',
            label: { de: 'Video (Desktop)', en: 'Video (Desktop)' },
            admin: {
                condition: isType('centeredVideo', 'video'),
                description: {
                    de: 'Optimiertes MP4/WebM-Hintergrundvideo hochladen.',
                    en: 'Upload an optimised MP4/WebM background video.',
                },
            },
            filterOptions: {
                mimeType: { contains: 'video' },
            },
        },
        {
            name: 'videoMobile',
            type: 'relationship',
            relationTo: 'media',
            label: { de: 'Video (Mobile)', en: 'Video (Mobile)' },
            admin: {
                condition: isType('centeredVideo', 'video'),
                description: {
                    de: 'Optional: Video im Hochformat für mobile Geräte.',
                    en: 'Optional: Video in portrait format for mobile devices.',
                },
            },
            filterOptions: {
                mimeType: { contains: 'video' },
            },
        },
        {
            type: 'row',
            fields: [
                {
                    name: 'videoUrl',
                    type: 'text',
                    label: {
                        de: 'Externe Video URL (Desktop)',
                        en: 'External video URL (Desktop)',
                    },
                    admin: {
                        condition: isType('centeredVideo', 'video'),
                        description: {
                            de: 'Wird verwendet, wenn kein Desktop-Upload vorhanden.',
                            en: 'Used when no desktop upload is provided.',
                        },
                        width: '50%',
                    },
                },
                {
                    name: 'videoUrlMobile',
                    type: 'text',
                    label: { de: 'Externe Video URL (Mobile)', en: 'External video URL (Mobile)' },
                    admin: {
                        condition: isType('centeredVideo', 'video'),
                        description: {
                            de: 'Wird verwendet, wenn kein Mobile-Upload vorhanden.',
                            en: 'Used when no mobile upload is provided.',
                        },
                        width: '50%',
                    },
                },
                {
                    name: 'posterImage',
                    label: { de: 'Poster-Bild (Desktop)', en: 'Poster image (Desktop)' },
                    type: 'upload',
                    relationTo: 'media',
                    admin: {
                        condition: isType('centeredVideo', 'video'),
                        width: '34%',
                    },
                    filterOptions: {
                        mimeType: { contains: 'image' },
                    },
                },
                {
                    name: 'posterImageMobile',
                    label: { de: 'Poster-Bild (Mobile)', en: 'Poster image (Mobile)' },
                    type: 'upload',
                    relationTo: 'media',
                    admin: {
                        condition: isType('centeredVideo', 'video'),
                        width: '34%',
                    },
                    filterOptions: {
                        mimeType: { contains: 'image' },
                    },
                },
            ],
        },
        {
            type: 'row',
            admin: {
                condition: isType('centeredVideo', 'video'),
            },
            fields: [
                {
                    name: 'muted',
                    type: 'checkbox',
                    label: { de: 'Stumm', en: 'Muted' },
                    defaultValue: true,
                },
                {
                    name: 'loop',
                    type: 'checkbox',
                    label: { de: 'Loop', en: 'Loop' },
                    defaultValue: true,
                },
                {
                    name: 'autoPlay',
                    type: 'checkbox',
                    label: { de: 'Auto Play', en: 'Auto play' },
                    defaultValue: true,
                },
                {
                    name: 'playsInline',
                    type: 'checkbox',
                    label: { de: 'Plays Inline', en: 'Plays inline' },
                    defaultValue: true,
                },
            ],
        },
    ],
    label: false,
}
