import type { CollectionConfig } from 'payload'
import { adminOrEditor, publishedOrAuthenticated } from '../access'
import { slugField } from '../fields'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'
import { notionAfterChange, notionAfterDelete } from '../hooks/notionSync'
import { populatePublishedAt } from '../hooks/populatePublishedAt'
import { HAIR_OPTIONS, EYE_OPTIONS, LANGUAGE_OPTIONS } from '../lib/constants/talentOptions'

function parseMeasurementNumber(value: unknown): number | null {
    if (typeof value !== 'string') return null
    const trimmed = value.trim()
    if (!trimmed) return null

    const normalized = trimmed.replace(/,/g, '.').replace(/[^0-9.]/g, '')
    if (!normalized) return null

    const parsed = Number.parseFloat(normalized)
    return Number.isFinite(parsed) ? parsed : null
}

function validateMeasurementRange(
    value: unknown,
    config: { min: number; max: number; labelDE: string; labelEN: string },
): true | string {
    if (value === undefined || value === null || value === '') return true

    const parsed = parseMeasurementNumber(value)
    if (parsed === null) {
        return `${config.labelDE}: Bitte Zahl eingeben / ${config.labelEN}: Please enter a number`
    }

    if (parsed < config.min || parsed > config.max) {
        return `${config.labelDE}: ${config.min}-${config.max} / ${config.labelEN}: ${config.min}-${config.max}`
    }

    return true
}

function hasMediaReference(value: unknown): boolean {
    if (typeof value === 'number') return true
    if (typeof value === 'string') return value.trim().length > 0
    if (value && typeof value === 'object') return true
    return false
}

export const Talents: CollectionConfig = {
    slug: 'talents',
    labels: {
        singular: { de: 'Talent', en: 'Talent' },
        plural: { de: 'Talents', en: 'Talents' },
    },
    defaultPopulate: {
        name: true,
        slug: true,
        category: true,
        featuredImage: true,
        cutoutImage: true,
        bio: true,
        measurements: true,
        cardStyle: true,
        featured: true,
    },
    admin: {
        useAsTitle: 'name',
        listSearchableFields: ['name', 'slug', 'category', 'bookingEmail'],
        defaultColumns: [
            'name',
            'featuredImage',
            'category',
            'isCoach',
            'measurements.height',
            'measurements.hair',
            'measurements.eyes',
            'bookingEmail',
            'featured',
            '_status',
        ],
        group: { de: 'Talent', en: 'Talent' },
        description: {
            de: 'Tänzer, Models und andere Talente verwalten',
            en: 'Manage dancers, models and other talents',
        },
        livePreview: {
            url: ({ data, locale }) => {
                const locObj = locale as string | { code?: string }
                const localePrefix = typeof locObj === 'string' ? locObj : (locObj?.code ?? 'de')
                const talentSegment = localePrefix === 'de' ? 'talente' : 'talents'
                return `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/${localePrefix}/${talentSegment}/${data.slug || ''}`
            },
        },
        components: {
            beforeListTable: ['@/components/admin/TalentsListControls#TalentsListControls'],
            edit: {
                beforeDocumentControls: [
                    '@/components/admin/ViewOnSite#ViewOnSite',
                    '@/components/admin/SedcardDownloadButton#SedcardDownloadButton',
                ],
            },
        },
    },
    defaultSort: 'sortOrder',
    access: {
        read: publishedOrAuthenticated,
        create: adminOrEditor,
        update: adminOrEditor,
        delete: adminOrEditor,
    },
    versions: {
        drafts: {
            autosave: {
                interval: 300,
            },
            schedulePublish: true,
        },
        maxPerDoc: 10,
    },
    fields: [
        {
            type: 'tabs',
            tabs: [
                {
                    label: { de: 'Grunddaten', en: 'Basic info' },
                    fields: [
                        {
                            type: 'row',
                            fields: [
                                {
                                    name: 'name',
                                    type: 'text',
                                    required: true,
                                    index: true,
                                    admin: {
                                        width: '50%',
                                    },
                                },
                                {
                                    name: 'category',
                                    type: 'select',
                                    required: true,
                                    index: true,
                                    defaultValue: 'dancer',
                                    admin: {
                                        width: '50%',
                                        components: {
                                            Cell: '@/components/admin/TalentCategoryCell#TalentCategoryCell',
                                        },
                                    },
                                    options: [
                                        { label: { de: 'Dancer', en: 'Dancer' }, value: 'dancer' },
                                        { label: { de: 'Model', en: 'Model' }, value: 'model' },
                                        {
                                            label: { de: 'Dancer & Model', en: 'Dancer & Model' },
                                            value: 'both',
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            type: 'row',
                            fields: [
                                {
                                    name: 'featuredImage',
                                    type: 'upload',
                                    relationTo: 'media',
                                    admin: {
                                        width: '50%',
                                        disableListFilter: true,
                                        style: { flex: '1 1 50%' },
                                        description: {
                                            de: 'Hauptbild / Cover (Portrait, mind. 1200×1600 px). Wird als großes Hero-Bild links in der Sedcard verwendet. Bitte KEIN freigestelltes (Cutout) Bild verwenden.',
                                            en: 'Main image / cover (portrait, min 1200×1600 px). Used as the large hero image on the left side of the sedcard. Please do NOT use a cutout image here.',
                                        },
                                    },
                                },
                                {
                                    name: 'cutoutImage',
                                    type: 'upload',
                                    relationTo: 'media',
                                    admin: {
                                        width: '50%',
                                        style: { flex: '1 1 50%' },
                                        description: {
                                            de: 'Freigestelltes Bild (PNG mit Transparenz) für den Home-Slider (Premium-Layout). Das Talent sollte mittig stehen ("wie auf einer Plattform"). Bitte NICHT für die Sedcard verwenden.',
                                            en: 'Cutout image (PNG with transparency) for the home slider (premium layout). Talent should be centered ("like on a platform"). Please do NOT use for the sedcard.',
                                        },
                                    },
                                },
                            ],
                        },
                        {
                            name: 'galleryImages',
                            type: 'array',
                            label: { de: 'Website-Galerie', en: 'Website gallery' },
                            admin: {
                                disableListFilter: true,
                                description: {
                                    de: 'Zusätzliche Bilder für die Talent-Detailseite (Website). Nicht für die Sedcard-PDF — dafür den Tab „Sedcard" nutzen.',
                                    en: 'Additional images for the talent detail page (website). Not for the sedcard PDF — use the "Sedcard" tab for that.',
                                },
                                components: {
                                    RowLabel: '@/components/admin/RowLabels#CaptionRowLabel',
                                },
                            },
                            fields: [
                                {
                                    name: 'image',
                                    type: 'upload',
                                    relationTo: 'media',
                                    required: true,
                                },
                                {
                                    name: 'caption',
                                    type: 'text',
                                },
                            ],
                        },
                        {
                            name: 'bio',
                            type: 'textarea',
                            required: true,
                            localized: true,
                            admin: {
                                description: {
                                    de: 'Kurze Biografie (max. 500 Zeichen)',
                                    en: 'Short biography (max. 500 characters)',
                                },
                            },
                            maxLength: 500,
                        },
                    ],
                },
                {
                    label: { de: 'Maße', en: 'Measurements' },
                    fields: [
                        {
                            name: 'measurements',
                            type: 'group',
                            label: { de: 'Körpermaße', en: 'Body measurements' },
                            fields: [
                                {
                                    type: 'row',
                                    fields: [
                                        {
                                            name: 'height',
                                            type: 'text',
                                            label: { de: 'Größe', en: 'Height' },
                                            validate: (value: unknown) =>
                                                validateMeasurementRange(value, {
                                                    min: 130,
                                                    max: 230,
                                                    labelDE: 'Größe',
                                                    labelEN: 'Height',
                                                }),
                                            admin: {
                                                placeholder: 'z.B. 170 cm',
                                                width: '33%',
                                            },
                                        },
                                        {
                                            name: 'bust',
                                            type: 'text',
                                            label: { de: 'Brust', en: 'Bust' },
                                            validate: (value: unknown) =>
                                                validateMeasurementRange(value, {
                                                    min: 50,
                                                    max: 180,
                                                    labelDE: 'Brust',
                                                    labelEN: 'Bust',
                                                }),
                                            admin: {
                                                placeholder: 'z.B. 84 cm',
                                                width: '33%',
                                            },
                                        },
                                        {
                                            name: 'waist',
                                            type: 'text',
                                            label: { de: 'Taille', en: 'Waist' },
                                            validate: (value: unknown) =>
                                                validateMeasurementRange(value, {
                                                    min: 40,
                                                    max: 150,
                                                    labelDE: 'Taille',
                                                    labelEN: 'Waist',
                                                }),
                                            admin: {
                                                placeholder: 'z.B. 62 cm',
                                                width: '33%',
                                            },
                                        },
                                    ],
                                },
                                {
                                    type: 'row',
                                    fields: [
                                        {
                                            name: 'hips',
                                            type: 'text',
                                            label: { de: 'Hüfte', en: 'Hips' },
                                            validate: (value: unknown) =>
                                                validateMeasurementRange(value, {
                                                    min: 50,
                                                    max: 190,
                                                    labelDE: 'Hüfte',
                                                    labelEN: 'Hips',
                                                }),
                                            admin: {
                                                placeholder: 'z.B. 89 cm',
                                                width: '33%',
                                            },
                                        },
                                        {
                                            name: 'shoeSize',
                                            type: 'text',
                                            label: { de: 'Schuhgröße', en: 'Shoe size' },
                                            validate: (value: unknown) =>
                                                validateMeasurementRange(value, {
                                                    min: 20,
                                                    max: 55,
                                                    labelDE: 'Schuhgröße',
                                                    labelEN: 'Shoe size',
                                                }),
                                            admin: {
                                                placeholder: 'z.B. 38 EU',
                                                width: '33%',
                                            },
                                        },
                                        {
                                            name: 'confectionSize',
                                            type: 'text',
                                            label: { de: 'Konfektionsgröße', en: 'Clothing size' },
                                            admin: {
                                                placeholder: 'z.B. S/36',
                                                width: '33%',
                                            },
                                        },
                                    ],
                                },
                                {
                                    type: 'row',
                                    fields: [
                                        {
                                            name: 'hair',
                                            type: 'select',
                                            hasMany: true,
                                            label: { de: 'Haarfarbe', en: 'Hair colour' },
                                            options: [...HAIR_OPTIONS],
                                            admin: {
                                                width: '50%',
                                            },
                                        },
                                        {
                                            name: 'eyes',
                                            type: 'select',
                                            hasMany: true,
                                            label: { de: 'Augenfarbe', en: 'Eye colour' },
                                            options: [...EYE_OPTIONS],
                                            admin: {
                                                width: '50%',
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                {
                    label: { de: 'Skills & Erfahrung', en: 'Skills & experience' },
                    fields: [
                        {
                            name: 'skills',
                            type: 'relationship',
                            relationTo: 'talent-skills',
                            hasMany: true,
                            label: { de: 'Fähigkeiten', en: 'Skills' },
                            admin: {
                                description: {
                                    de: 'Skills aus der Talent-Skills-Sammlung auswählen',
                                    en: 'Select skills from the Talent Skills collection',
                                },
                            },
                        },
                        {
                            name: 'coachingDescription',
                            type: 'textarea',
                            label: { de: 'Coaching-Angebot', en: 'Coaching offering' },
                            localized: true,
                            admin: {
                                condition: (data) => data?.isCoach === true,
                                description: {
                                    de: 'Kurze Beschreibung des Coaching-Angebots (z.B. Tanzstile, Levels, Privatstunden)',
                                    en: 'Short description of coaching offering (e.g. dance styles, levels, private lessons)',
                                },
                            },
                        },
                        {
                            name: 'languages',
                            type: 'select',
                            hasMany: true,
                            label: { de: 'Sprachen', en: 'Languages' },
                            options: [...LANGUAGE_OPTIONS],
                        },
                        {
                            name: 'experience',
                            type: 'array',
                            label: { de: 'Erfahrung & Referenzen', en: 'Experience & references' },
                            admin: {
                                description: {
                                    de: 'Bisherige Jobs, Shows, Kampagnen',
                                    en: 'Previous jobs, shows, campaigns',
                                },
                                components: {
                                    RowLabel: '@/components/admin/RowLabels#ExperienceRowLabel',
                                },
                            },
                            fields: [
                                {
                                    name: 'title',
                                    type: 'text',
                                    required: true,
                                    localized: true,
                                    admin: {
                                        placeholder: 'z.B. Berlin Fashion Week 2024',
                                    },
                                },
                                {
                                    name: 'year',
                                    type: 'text',
                                    localized: true,
                                    admin: {
                                        placeholder: '2024',
                                    },
                                },
                            ],
                        },
                    ],
                },
                {
                    label: { de: 'Kontakt & Social', en: 'Contact & social' },
                    fields: [
                        {
                            name: 'bookingEmail',
                            type: 'email',
                            label: { de: 'Booking E-Mail', en: 'Booking email' },
                            admin: {
                                description: {
                                    de: 'Wird für Buchungsanfragen verwendet',
                                    en: 'Used for booking enquiries',
                                },
                            },
                        },
                        {
                            name: 'socialMedia',
                            type: 'group',
                            label: { de: 'Social Media', en: 'Social media' },
                            admin: {
                                disableListFilter: true,
                            },
                            fields: [
                                {
                                    name: 'instagram',
                                    type: 'text',
                                    label: { de: 'Instagram Handle', en: 'Instagram handle' },
                                    admin: {
                                        placeholder: '@username',
                                    },
                                },
                                {
                                    name: 'tiktok',
                                    type: 'text',
                                    label: { de: 'TikTok Handle', en: 'TikTok handle' },
                                    admin: {
                                        placeholder: '@username',
                                    },
                                },
                                {
                                    name: 'website',
                                    type: 'text',
                                    label: { de: 'Website', en: 'Website' },
                                    admin: {
                                        placeholder: 'https://...',
                                    },
                                },
                            ],
                        },
                    ],
                },
                {
                    label: { de: 'Sedcard', en: 'Sedcard' },
                    description: {
                        de: 'Bilder für die Sedcard-PDF. Das Hauptbild (oben) wird als großes Hero-Bild links verwendet. Diese 3 Bilder erscheinen rechts im Grid. Alle Bilder werden automatisch zu JPEG konvertiert.',
                        en: 'Images for the sedcard PDF. The featured image (above) is used as the large hero on the left. These 3 images appear in the right grid. All images are automatically converted to JPEG.',
                    },
                    fields: [
                        {
                            type: 'row',
                            fields: [
                                {
                                    name: 'sedcardImage1',
                                    type: 'upload',
                                    relationTo: 'media',
                                    label: {
                                        de: 'Bild oben rechts – Ganzkörper',
                                        en: 'Top right – Full body',
                                    },
                                    admin: {
                                        width: '50%',
                                        description: {
                                            de: 'Querformat empfohlen, mind. 1200×800 px. Erscheint oben rechts im Grid (großes Bild). KEIN Cutout.',
                                            en: 'Landscape recommended, min 1200×800 px. Appears top-right in the grid (large image). NO cutout.',
                                        },
                                    },
                                },
                                {
                                    name: 'sedcardImage2',
                                    type: 'upload',
                                    relationTo: 'media',
                                    label: {
                                        de: 'Bild unten links – Close-Up',
                                        en: 'Bottom left – Close-up',
                                    },
                                    admin: {
                                        width: '50%',
                                        description: {
                                            de: 'Quadratisch oder Portrait, mind. 800×800 px. Erscheint unten links im Grid. KEIN Cutout.',
                                            en: 'Square or portrait, min 800×800 px. Appears bottom-left in the grid. NO cutout.',
                                        },
                                    },
                                },
                            ],
                        },
                        {
                            type: 'row',
                            fields: [
                                {
                                    name: 'sedcardImage3',
                                    type: 'upload',
                                    relationTo: 'media',
                                    label: {
                                        de: 'Bild unten rechts – Bewegung / Frei',
                                        en: 'Bottom right – Action / Free',
                                    },
                                    admin: {
                                        width: '50%',
                                        description: {
                                            de: 'Quadratisch oder Portrait, mind. 800×800 px. Erscheint unten rechts im Grid. KEIN Cutout.',
                                            en: 'Square or portrait, min 800×800 px. Appears bottom-right in the grid. NO cutout.',
                                        },
                                    },
                                },
                                {
                                    name: 'sedcardImage4',
                                    type: 'upload',
                                    relationTo: 'media',
                                    label: {
                                        de: 'Bild 4 – Reserve',
                                        en: 'Image 4 – Reserve',
                                    },
                                    admin: {
                                        width: '50%',
                                        description: {
                                            de: 'Optional. Wird nur verwendet wenn Bild 3 fehlt. Mind. 800×800 px. KEIN Cutout.',
                                            en: 'Optional. Only used if image 3 is missing. Min 800×800 px. NO cutout.',
                                        },
                                    },
                                },
                            ],
                        },
                        {
                            name: 'sedcardTemplate',
                            type: 'select',
                            label: { de: 'Sedcard-Template', en: 'Sedcard template' },
                            defaultValue: 'classic',
                            admin: {
                                disableListFilter: true,
                                disableListColumn: true,
                                description: {
                                    de: 'PDF-Vorlage für dieses Talent.',
                                    en: 'PDF template for this talent.',
                                },
                            },
                            options: [
                                { label: { de: 'Klassisch', en: 'Classic' }, value: 'classic' },
                            ],
                        },
                    ],
                },
                {
                    label: { de: 'SEO', en: 'SEO' },
                    fields: [
                        {
                            name: 'seo',
                            type: 'group',
                            label: { de: 'SEO Einstellungen', en: 'SEO settings' },
                            admin: {
                                disableListFilter: true,
                            },
                            fields: [
                                {
                                    name: 'metaTitle',
                                    type: 'text',
                                    localized: true,
                                    label: { de: 'Meta Titel', en: 'Meta title' },
                                    maxLength: 60,
                                    admin: {
                                        description: {
                                            de: 'Überschreibt den Standard-Titel (max. 60 Zeichen)',
                                            en: 'Overrides the default title (max. 60 characters)',
                                        },
                                    },
                                },
                                {
                                    name: 'metaDescription',
                                    type: 'textarea',
                                    localized: true,
                                    label: { de: 'Meta Beschreibung', en: 'Meta description' },
                                    maxLength: 320,
                                    admin: {
                                        description: {
                                            de: 'Empfohlen sind 140-160 Zeichen für Snippets. Für Social/LLM-Kontext sind bis 320 erlaubt.',
                                            en: 'Recommended for snippets: 140-160 characters. Up to 320 allowed for social/LLM context.',
                                        },
                                    },
                                },
                                {
                                    name: 'metaKeywords',
                                    type: 'text',
                                    localized: true,
                                    label: { de: 'Keywords', en: 'Keywords' },
                                    admin: {
                                        description: { de: 'Komma-getrennte Keywords', en: 'Comma-separated keywords' },
                                    },
                                },
                                {
                                    name: 'ogImage',
                                    type: 'upload',
                                    relationTo: 'media',
                                    label: { de: 'Social Media Bild', en: 'Social media image' },
                                    admin: {
                                        description: { de: 'Bild für Social Media (empfohlen: 1200x630px). Fallback: Featured Image.', en: 'Image for social media (recommended: 1200x630px). Fallback: featured image.' },
                                    },
                                },
                                {
                                    name: 'noIndex',
                                    type: 'checkbox',
                                    defaultValue: false,
                                    label: { de: 'Nicht indexieren', en: 'No index' },
                                    admin: {
                                        description: { de: 'Diese Seite von Suchmaschinen ausschließen', en: 'Exclude this page from search engines' },
                                    },
                                },
                                {
                                    name: 'canonicalUrl',
                                    type: 'text',
                                    label: { de: 'Kanonische URL', en: 'Canonical URL' },
                                    admin: {
                                        description: { de: 'Optionale kanonische URL (für Duplikate)', en: 'Optional canonical URL (for duplicate content)' },
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        // Sidebar Fields
        slugField(),
        {
            name: 'featured',
            type: 'checkbox',
            label: { de: 'Featured Talent', en: 'Featured talent' },
            defaultValue: false,
            admin: {
                position: 'sidebar',
                description: { de: 'Auf der Startseite anzeigen', en: 'Show on homepage' },
                components: {
                    Cell: '@/components/admin/FeaturedBadgeCell#FeaturedBadgeCell',
                },
            },
        },
        {
            name: 'isCoach',
            type: 'checkbox',
            label: { de: 'Coach / Privat-Coaching', en: 'Coach / Private coaching' },
            defaultValue: false,
            admin: {
                position: 'sidebar',
                description: {
                    de: 'Dieses Talent bietet Coaching oder Privatstunden an und kann in Coaching-Anfragen ausgewählt werden.',
                    en: 'This talent offers coaching or private lessons and can be selected in coaching inquiries.',
                },
            },
        },
        {
            name: 'sortOrder',
            type: 'number',
            label: { de: 'Sortierung', en: 'Sort order' },
            defaultValue: 0,
            admin: {
                position: 'sidebar',
                description: {
                    de: 'Niedrigere Zahlen = weiter oben',
                    en: 'Lower numbers = higher in list',
                },
            },
        },
        {
            name: 'cardStyle',
            type: 'select',
            label: { de: 'Karten-Stil (Talent-Übersicht)', en: 'Card style (talents overview)' },
            admin: {
                position: 'sidebar',
                disableListFilter: true,
                disableListColumn: true,
                description: {
                    de: 'Hintergrundfarbe der Karte (chrome-grace-talent Stil). Leer = automatisch.',
                    en: 'Card background colour (chrome-grace-talent style). Empty = automatic.',
                },
            },
            options: [
                { label: { de: 'Automatisch', en: 'Automatic' }, value: '' },
                { label: { de: 'Sage', en: 'Sage' }, value: 'sage' },
                { label: { de: 'Peach', en: 'Peach' }, value: 'peach' },
                { label: { de: 'Cream', en: 'Cream' }, value: 'cream' },
            ],
        },
        {
            name: 'heightNum',
            type: 'number',
            admin: {
                hidden: true,
            },
        },
    ],
    hooks: {
        beforeChange: [
            populatePublishedAt,
            ({ data, originalDoc, req }) => {
                const nextStatus =
                    (data as { _status?: unknown } | undefined)?._status ??
                    (originalDoc as { _status?: unknown } | undefined)?._status

                if (nextStatus === 'published') {
                    const hasExplicitFeaturedImage = Boolean(
                        data && Object.prototype.hasOwnProperty.call(data, 'featuredImage'),
                    )
                    const featuredImage = hasExplicitFeaturedImage
                        ? (data as { featuredImage?: unknown }).featuredImage
                        : (originalDoc as { featuredImage?: unknown } | undefined)?.featuredImage

                    if (!hasMediaReference(featuredImage)) {
                        throw new Error(
                            'Vor Veröffentlichung ist ein Hauptbild erforderlich. / A featured image is required before publishing.',
                        )
                    }
                }

                const locale = req.locale === 'en' ? 'en' : 'de'
                const category = ((data?.category as string | undefined) ||
                    (originalDoc as { category?: string } | undefined)?.category ||
                    'both') as 'dancer' | 'model' | 'both'
                const localizedCategory =
                    locale === 'de'
                        ? category === 'dancer'
                            ? 'Tänzer/in'
                            : category === 'model'
                              ? 'Model'
                              : 'Tänzer/in & Model'
                        : category === 'dancer'
                          ? 'Dancer'
                          : category === 'model'
                            ? 'Model'
                            : 'Dancer & Model'

                const resolveLocalizedValue = (value: unknown): string => {
                    if (typeof value === 'string') return value.trim()
                    if (value && typeof value === 'object') {
                        const current = (value as Record<string, unknown>)[locale]
                        if (typeof current === 'string') return current.trim()
                    }
                    return ''
                }

                const metaTitleCurrent = resolveLocalizedValue(data?.seo?.metaTitle)
                if (!metaTitleCurrent && data?.name) {
                    data.seo = {
                        ...data.seo,
                        metaTitle: `${data.name} - Deleyna Talent Agency`,
                    }
                }

                const metaDescriptionCurrent = resolveLocalizedValue(data?.seo?.metaDescription)
                if (!metaDescriptionCurrent && data?.name) {
                    data.seo = {
                        ...data.seo,
                        metaDescription:
                            locale === 'de'
                                ? `${data.name} ist als ${localizedCategory} bei Deleyna Talent Agency vertreten. Profil, Maße und Booking-Anfrage online.`
                                : `${data.name} is represented as a ${localizedCategory} at Deleyna Talent Agency. View profile, measurements and booking request online.`,
                    }
                }
                if (data?.measurements?.height) {
                    // Extract digits for numeric filtering
                    const parsed = String(data.measurements.height)
                        .replace(/,/g, '.')
                        .replace(/[^0-9.]/g, '')
                    data.heightNum = parsed ? Number.parseFloat(parsed) : null
                } else {
                    data.heightNum = null
                }
                return data
            },
        ],
        afterChange: [
            revalidateAfterChange({
                pathPrefix: '/talents',
                listingPath: '/talents',
                tag: 'talents',
            }),
            notionAfterChange,
        ],
        afterDelete: [
            revalidateAfterDelete({
                pathPrefix: '/talents',
                listingPath: '/talents',
                tag: 'talents',
            }),
            notionAfterDelete,
        ],
    },
}
