import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor, FixedToolbarFeature, HeadingFeature } from '@payloadcms/richtext-lexical'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import {
    incrementNotificationCounter,
    decrementNotificationCounter,
} from './hooks/notificationCounter'
import { revalidateRedirects } from './hooks/revalidateRedirects'
import path from 'path'
import { buildConfig, type Field } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { s3Storage } from '@payloadcms/storage-s3'
import { dynamicResendAdapter } from './utilities/dynamicEmailAdapter'

// Collections
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Categories } from './collections/Categories'
import { Talents } from './collections/Talents'
import { TalentSkills } from './collections/TalentSkills'

// Globals
import { SEO } from './globals/SEO'
import { CookieBanner } from './globals/CookieBanner'
import { ThemeSettings } from './globals/ThemeSettings'
import { Header } from './globals/Header'
import { Footer } from './globals/Footer'
import { TalentsArchive } from './globals/TalentsArchive'
import { PostsArchive } from './globals/PostsArchive'
import { Notifications } from './globals/Notifications'
import { FormSettings } from './globals/FormSettings'
import { SedcardSettings } from './globals/SedcardSettings'
import { NotionSettings } from './globals/NotionSettings'

// Lokalisierung
import localization from './i18n/localization'
import { getRequiredEnv } from './lib/env'
import {
    buildTalentApplicationResult,
    extractSubmissionFields,
    formatApplicationValidationNotes,
} from './utilities/talentApplication'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
    admin: {
        user: Users.slug,
        importMap: {
            baseDir: path.resolve(dirname),
        },
        components: {
            header: ['@/components/admin/FormSubmissionBanner'],
            afterDashboard: ['@/components/admin/AdminDashboard#AdminDashboard'],
            graphics: {
                Icon: '@/components/admin/Icon#AdminIcon',
                Logo: '@/components/admin/Logo#AdminLogo',
            },
        },
        meta: {
            titleSuffix: ' | Deleyna',
        },
        livePreview: {
            collections: ['pages', 'posts', 'talents'],
            url: ({ data, collectionConfig, locale }) => {
                const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
                const slug = typeof data?.slug === 'string' ? data.slug : ''
                const locObj = locale as string | { code?: string }
                const localePrefix = typeof locObj === 'string' ? locObj : locObj?.code || 'de'
                const postSegment = localePrefix === 'de' ? 'magazin' : 'blog'
                const talentSegment = localePrefix === 'de' ? 'talente' : 'talents'

                if (collectionConfig?.slug === 'posts') {
                    return `${baseUrl}/${localePrefix}/${postSegment}/${slug}`
                }
                if (collectionConfig?.slug === 'talents') {
                    return `${baseUrl}/${localePrefix}/${talentSegment}/${slug}`
                }
                if (collectionConfig?.slug === 'pages') {
                    if (!slug || slug === 'home') return `${baseUrl}/${localePrefix}`
                    return `${baseUrl}/${localePrefix}/${slug}`
                }
                return `${baseUrl}/${localePrefix}/${slug}`
            },
            breakpoints: [
                { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
                { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
                { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
            ],
        },
        // Security: Auto-logout after inactivity
        autoLogin: false,
    },
    collections: [
        // Inhalte (Content)
        Pages,
        Media,
        // Blog
        Posts,
        Categories,
        // Talent
        Talents,
        TalentSkills,
        // Admin
        Users,
    ],
    globals: [
        // Blog
        PostsArchive,
        // Talent
        TalentsArchive,
        SedcardSettings,
        // Formulare (Forms)
        FormSettings,
        // Einstellungen (Settings)
        Header,
        Footer,
        SEO,
        ThemeSettings,
        CookieBanner,
        // Integrationen
        NotionSettings,
        // Admin
        Notifications,
    ],
    editor: lexicalEditor(),
    secret: getRequiredEnv('PAYLOAD_SECRET'),
    typescript: {
        outputFile: path.resolve(dirname, 'payload-types.ts'),
    },
    db: postgresAdapter({
        pool: {
            connectionString: getRequiredEnv('DATABASE_URL'),
            // Connection pool security
            max: 20, // Max connections
            idleTimeoutMillis: 30000, // 30 seconds idle timeout
            connectionTimeoutMillis: 10000, // 10 second connection timeout
        },
    }),
    sharp,
    plugins: [
        // Redirects FIRST so "Einstellungen" group appears before "Formulare"
        redirectsPlugin({
            collections: ['pages', 'posts', 'talents'],
            overrides: {
                admin: {
                    group: { de: 'Einstellungen', en: 'Settings' },
                },
                hooks: {
                    afterChange: [revalidateRedirects],
                },
            },
        }),
        formBuilderPlugin({
            fields: {
                payment: false,
                // Custom block for talent selection display in forms
                talentSelection: {
                    slug: 'talentSelection',
                    labels: {
                        singular: { de: 'Talent-Auswahl', en: 'Talent Selection' },
                        plural: { de: 'Talent-Auswahl Felder', en: 'Talent Selection Fields' },
                    },
                    fields: [
                        {
                            type: 'row',
                            fields: [
                                {
                                    name: 'name',
                                    type: 'text',
                                    label: { de: 'Feldname', en: 'Field Name' },
                                    required: true,
                                    defaultValue: 'talentSelection',
                                    admin: { width: '50%' },
                                },
                                {
                                    name: 'label',
                                    type: 'text',
                                    label: { de: 'Beschriftung', en: 'Label' },
                                    defaultValue: 'Ausgewählte Talente',
                                    localized: true,
                                    admin: { width: '50%' },
                                },
                            ],
                        },
                        {
                            name: 'width',
                            type: 'number',
                            label: { de: 'Feldbreite (%)', en: 'Field Width (%)' },
                        },
                        {
                            name: 'required',
                            type: 'checkbox',
                            label: { de: 'Pflichtfeld', en: 'Required' },
                        },
                    ],
                } as never,
                // Page break marker for multi-step wizard forms
                pageBreak: {
                    slug: 'pageBreak',
                    labels: {
                        singular: { de: 'Seitenumbruch', en: 'Page Break' },
                        plural: { de: 'Seitenumbrüche', en: 'Page Breaks' },
                    },
                    fields: [
                        {
                            name: 'stepTitle',
                            type: 'text',
                            label: { de: 'Step-Titel', en: 'Step Title' },
                            localized: true,
                        },
                    ],
                } as never,
                // Upload field for talent applications (client-side upload + server compression)
                imageUpload: {
                    slug: 'imageUpload',
                    labels: {
                        singular: { de: 'Bild-Upload', en: 'Image upload' },
                        plural: { de: 'Bild-Upload Felder', en: 'Image upload fields' },
                    },
                    fields: [
                        {
                            type: 'row',
                            fields: [
                                {
                                    name: 'name',
                                    type: 'text',
                                    label: { de: 'Feldname', en: 'Field name' },
                                    required: true,
                                    defaultValue: 'portfolioImages',
                                    admin: { width: '50%' },
                                },
                                {
                                    name: 'label',
                                    type: 'text',
                                    label: { de: 'Beschriftung', en: 'Label' },
                                    localized: true,
                                    defaultValue: 'Portfolio-Bilder',
                                    admin: { width: '50%' },
                                },
                            ],
                        },
                        {
                            type: 'row',
                            fields: [
                                {
                                    name: 'maxFiles',
                                    type: 'number',
                                    label: { de: 'Max. Dateien', en: 'Max files' },
                                    defaultValue: 6,
                                    admin: { width: '33%' },
                                },
                                {
                                    name: 'maxFileSizeMB',
                                    type: 'number',
                                    label: { de: 'Max. MB pro Datei', en: 'Max MB per file' },
                                    defaultValue: 8,
                                    admin: { width: '33%' },
                                },
                                {
                                    name: 'width',
                                    type: 'number',
                                    label: { de: 'Feldbreite (%)', en: 'Field width (%)' },
                                    admin: { width: '33%' },
                                },
                            ],
                        },
                        {
                            type: 'row',
                            fields: [
                                {
                                    name: 'minWidth',
                                    type: 'number',
                                    label: { de: 'Mindestbreite (px)', en: 'Minimum width (px)' },
                                    defaultValue: 1000,
                                    admin: { width: '50%' },
                                },
                                {
                                    name: 'minHeight',
                                    type: 'number',
                                    label: { de: 'Mindesthöhe (px)', en: 'Minimum height (px)' },
                                    defaultValue: 1400,
                                    admin: { width: '50%' },
                                },
                            ],
                        },
                        {
                            name: 'helpText',
                            type: 'text',
                            label: { de: 'Hilfetext', en: 'Help text' },
                            localized: true,
                        },
                        {
                            name: 'required',
                            type: 'checkbox',
                            label: { de: 'Pflichtfeld', en: 'Required' },
                        },
                    ],
                } as never,
            },
            formSubmissionOverrides: {
                admin: {
                    group: { de: 'Formulare', en: 'Forms' },
                    components: {
                        beforeListTable: [
                            '@/components/admin/FormSubmissionsListControls#FormSubmissionsListControls',
                        ],
                    },
                    defaultColumns: [
                        'createdAt',
                        'categoryBadge',
                        'submitterInfo',
                        'messagePreview',
                        'read',
                        'applicationStatusCell',
                    ],
                    useAsTitle: 'id',
                    listSearchableFields: ['id'],
                    description: {
                        de: 'Alle Formular-Einsendungen: Kontaktanfragen, Buchungen, Talent-Bewerbungen',
                        en: 'All form submissions: contact requests, bookings, talent applications',
                    },
                },
                defaultSort: '-createdAt',
                access: {
                    update: ({ req: { user } }: { req: { user: unknown } }) => !!user,
                },
                hooks: {
                    beforeChange: [
                        async ({ data, operation, req }) => {
                            if (operation === 'create' && data?.form) {
                                // Handle both number ID and populated object
                                const formId =
                                    typeof data.form === 'number'
                                        ? data.form
                                        : typeof data.form === 'object' &&
                                            data.form !== null &&
                                            'id' in data.form
                                          ? (data.form as { id: number }).id
                                          : null
                                if (formId) {
                                    try {
                                        const formDoc = await req.payload.findByID({
                                            collection: 'forms',
                                            id: formId,
                                            depth: 0,
                                            req,
                                        })
                                        const cat = (formDoc as { formCategory?: string })
                                            ?.formCategory
                                        if (typeof cat === 'string')
                                            (data as { category?: string }).category = cat
                                    } catch {
                                        // ignore
                                    }
                                }
                            }
                            return data
                        },
                    ],
                    afterChange: [
                        async ({ doc, req, operation }) => {
                            if (operation === 'create') {
                                await incrementNotificationCounter(
                                    req,
                                    doc?.locale || req.locale || 'de',
                                )
                            }
                            return doc
                        },
                        async ({ doc, previousDoc, req, operation }) => {
                            if (
                                operation === 'update' &&
                                doc?.read === true &&
                                previousDoc?.read !== true
                            ) {
                                await decrementNotificationCounter(req, doc?.locale || 'de')
                            }
                            return doc
                        },
                        async ({ doc, previousDoc, req, operation, context }) => {
                            if (operation !== 'update') return doc
                            if (context?.skipTalentAutoCreate) return doc
                            if (doc?.category !== 'become_talent') return doc
                            if (doc?.applicationStatus !== 'approved') return doc
                            if (previousDoc?.applicationStatus === 'approved') return doc
                            if (doc?.linkedTalent) return doc

                            try {
                                const fields = extractSubmissionFields(doc?.submissionData)
                                const { talentData, validationWarnings } =
                                    buildTalentApplicationResult(fields, {
                                        publish: true,
                                        slugSuffix: String(doc.id),
                                    })
                                const submissionLocale = doc?.locale === 'en' ? 'en' : 'de'

                                const talent = await req.payload.create({
                                    collection: 'talents',
                                    data: talentData,
                                    locale: submissionLocale,
                                    draft: false,
                                    req,
                                })

                                await req.payload.update({
                                    collection: 'form-submissions',
                                    id: doc.id,
                                    data: {
                                        linkedTalent: talent.id,
                                        applicationValidationNotes:
                                            formatApplicationValidationNotes(validationWarnings),
                                    },
                                    context: {
                                        ...context,
                                        skipTalentAutoCreate: true,
                                    },
                                    req,
                                })
                            } catch (error) {
                                console.error(
                                    'Auto-create talent on application approval failed:',
                                    error,
                                )
                            }

                            return doc
                        },
                    ],
                },
                fields: ({ defaultFields }: { defaultFields: Field[] }) =>
                    [
                        ...defaultFields,
                        {
                            name: 'category',
                            type: 'select',
                            label: { de: 'Kategorie', en: 'Category' },
                            admin: {
                                position: 'sidebar',
                                description: {
                                    de: 'Wird automatisch aus der Formular-Kategorie übernommen. Filtert z. B. Talent-Anfragen vs. „Talent werden“.',
                                    en: 'Set automatically from the form category. Filter e.g. talent requests vs. become a talent.',
                                },
                            },
                            options: [
                                {
                                    label: { de: 'Kontakt / Allgemein', en: 'Contact / General' },
                                    value: 'contact',
                                },
                                {
                                    label: {
                                        de: 'Talent-Anfrage / Buchung',
                                        en: 'Talent request / Booking',
                                    },
                                    value: 'talent_booking',
                                },
                                {
                                    label: { de: 'Talent werden', en: 'Become a talent' },
                                    value: 'become_talent',
                                },
                                {
                                    label: { de: 'Job-Anfrage', en: 'Job inquiry' },
                                    value: 'job_inquiry',
                                },
                                { label: { de: 'Sonstiges', en: 'Other' }, value: 'other' },
                            ],
                        },
                        {
                            name: 'locale',
                            type: 'select',
                            defaultValue: 'de',
                            label: { de: 'Sprache der Einsendung', en: 'Submission language' },
                            options: [
                                { label: { de: 'Deutsch', en: 'German' }, value: 'de' },
                                { label: { de: 'Englisch', en: 'English' }, value: 'en' },
                            ],
                            admin: {
                                position: 'sidebar',
                            },
                        },
                        {
                            name: 'read',
                            type: 'checkbox',
                            label: { de: 'Gelesen', en: 'Read' },
                            defaultValue: false,
                            admin: {
                                position: 'sidebar',
                                components: {
                                    Cell: '@/components/FormSubmissions/ReadStatusCell#ReadStatusCell',
                                },
                            },
                        },
                        {
                            name: 'submitterInfo',
                            type: 'ui',
                            label: { de: 'Absender', en: 'Submitter' },
                            admin: {
                                components: {
                                    Cell: '@/components/FormSubmissions/SubmitterInfoCell#SubmitterInfoCell',
                                },
                            },
                        },
                        {
                            name: 'categoryBadge',
                            type: 'ui',
                            label: { de: 'Typ', en: 'Type' },
                            admin: {
                                components: {
                                    Cell: '@/components/FormSubmissions/CategoryBadgeCell#CategoryBadgeCell',
                                },
                            },
                        },
                        {
                            name: 'messagePreview',
                            type: 'ui',
                            admin: {
                                components: {
                                    Cell: '@/components/FormSubmissions/MessagePreviewCell#MessagePreviewCell',
                                },
                            },
                            label: { de: 'Vorschau', en: 'Preview' },
                        },
                        {
                            name: 'submissionOverview',
                            type: 'ui',
                            label: { de: 'Übersicht', en: 'Overview' },
                            admin: {
                                components: {
                                    Field: '@/components/FormSubmissions/SubmissionDetailView#SubmissionDetailView',
                                },
                            },
                        },
                        // --- Application approval fields (only for become_talent) ---
                        {
                            name: 'applicationStatus',
                            type: 'select',
                            label: { de: 'Bewerbungsstatus', en: 'Application status' },
                            defaultValue: 'pending',
                            options: [
                                { label: { de: 'Ausstehend', en: 'Pending' }, value: 'pending' },
                                { label: { de: 'Genehmigt', en: 'Approved' }, value: 'approved' },
                                { label: { de: 'Abgelehnt', en: 'Rejected' }, value: 'rejected' },
                            ],
                            admin: {
                                position: 'sidebar',
                                condition: (data) => data?.category === 'become_talent',
                            },
                        },
                        {
                            name: 'rejectionReason',
                            type: 'textarea',
                            label: { de: 'Ablehnungsgrund', en: 'Rejection reason' },
                            admin: {
                                position: 'sidebar',
                                condition: (data) =>
                                    data?.category === 'become_talent' &&
                                    data?.applicationStatus === 'rejected',
                            },
                        },
                        {
                            name: 'linkedTalent',
                            type: 'relationship',
                            relationTo: 'talents',
                            label: { de: 'Verknuepftes Talent', en: 'Linked talent' },
                            admin: {
                                position: 'sidebar',
                                readOnly: true,
                                condition: (data) =>
                                    data?.category === 'become_talent' &&
                                    data?.applicationStatus === 'approved',
                            },
                        },
                        {
                            name: 'applicationValidationNotes',
                            type: 'textarea',
                            label: {
                                de: 'Validierungs-Hinweise (Auto-Mapping)',
                                en: 'Validation notes (auto-mapping)',
                            },
                            admin: {
                                position: 'sidebar',
                                readOnly: true,
                                condition: (data) => data?.category === 'become_talent',
                                description: {
                                    de: 'Automatisch erzeugte Hinweise zu auffälligen Eingaben (z. B. Maße außerhalb plausibler Bereiche).',
                                    en: 'Automatically generated notes for suspicious inputs (e.g. measurements outside plausible ranges).',
                                },
                            },
                        },
                        {
                            name: 'approveAction',
                            type: 'ui',
                            label: { de: 'Talent genehmigen', en: 'Approve talent' },
                            admin: {
                                position: 'sidebar',
                                condition: (data) =>
                                    data?.category === 'become_talent' &&
                                    data?.applicationStatus === 'pending',
                                components: {
                                    Field: '@/components/FormSubmissions/ApproveTalentButton#ApproveTalentButton',
                                },
                            },
                        },
                        {
                            name: 'rejectAction',
                            type: 'ui',
                            label: { de: 'Bewerbung ablehnen', en: 'Reject application' },
                            admin: {
                                position: 'sidebar',
                                condition: (data) =>
                                    data?.category === 'become_talent' &&
                                    data?.applicationStatus === 'pending',
                                components: {
                                    Field: '@/components/FormSubmissions/RejectTalentButton#RejectTalentButton',
                                },
                            },
                        },
                        {
                            name: 'applicationStatusCell',
                            type: 'ui',
                            label: { de: 'Bewerbung', en: 'Application' },
                            admin: {
                                components: {
                                    Cell: '@/components/FormSubmissions/ApplicationStatusCell#ApplicationStatusCell',
                                },
                            },
                        },
                    ] as Field[],
            },
            formOverrides: {
                admin: {
                    group: { de: 'Formulare', en: 'Forms' },
                    description: {
                        de: 'Formulare für Kontakt, Talent-Anfragen, „Talent werden“ etc.',
                        en: 'Forms for contact, talent requests, "become a talent" etc.',
                    },
                },
                fields: ({ defaultFields }: { defaultFields: Field[] }) => {
                    const mapped = defaultFields.map((field) => {
                        if ('name' in field && field.name === 'confirmationMessage') {
                            return {
                                ...field,
                                editor: lexicalEditor({
                                    features: ({ rootFeatures }) => {
                                        return [
                                            ...rootFeatures,
                                            FixedToolbarFeature(),
                                            HeadingFeature({
                                                enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'],
                                            }),
                                        ]
                                    },
                                }),
                            }
                        }
                        return field
                    })
                    return [
                        ...mapped,
                        {
                            name: 'formCategory',
                            type: 'select',
                            label: { de: 'Kategorie', en: 'Category' },
                            defaultValue: 'contact',
                            options: [
                                {
                                    label: { de: 'Kontakt / Allgemein', en: 'Contact / General' },
                                    value: 'contact',
                                },
                                {
                                    label: {
                                        de: 'Talent-Anfrage / Buchung',
                                        en: 'Talent request / Booking',
                                    },
                                    value: 'talent_booking',
                                },
                                {
                                    label: {
                                        de: 'Talent werden (Registrierung)',
                                        en: 'Become a talent (Registration)',
                                    },
                                    value: 'become_talent',
                                },
                                {
                                    label: { de: 'Job-Anfrage', en: 'Job inquiry' },
                                    value: 'job_inquiry',
                                },
                                { label: { de: 'Sonstiges', en: 'Other' }, value: 'other' },
                            ],
                            admin: {
                                position: 'sidebar',
                                description: {
                                    de: 'Ermöglicht Filterung der Einsendungen nach Art (z. B. Talent-Anfragen vs. „Talent werden“).',
                                    en: 'Allows filtering submissions by type (e.g. talent requests vs. become a talent).',
                                },
                            },
                        },
                    ] as Field[]
                },
            },
        }),
        s3Storage({
            collections: {
                media: {
                    prefix: 'media',
                },
            },
            bucket: process.env.S3_BUCKET || '',
            config: {
                credentials: {
                    accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
                    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
                },
                region: process.env.S3_REGION,
                endpoint: process.env.S3_ENDPOINT,
                forcePathStyle: true,
            },
        }),
    ],

    // Jobs API mit CRON_SECRET Schutz
    jobs: {
        access: {
            run: ({ req }) => {
                if (req.user) return true
                const secret = process.env.CRON_SECRET
                if (!secret) return false
                return req.headers.get('authorization') === `Bearer ${secret}`
            },
        },
    },

    // Lokalisierung DE/EN
    localization: localization,

    // GraphQL - disabled in production for security (enable if needed)
    graphQL: {
        schemaOutputFile: path.resolve(dirname, 'generated-schema.graphql'),
        disable: process.env.NODE_ENV === 'production' && process.env.ENABLE_GRAPHQL !== 'true',
    },

    // CORS - strict origin control
    cors: [process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'].filter(Boolean),

    // CSRF Protection
    csrf: [process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'].filter(
        Boolean,
    ) as string[],

    // Rate limiting on upload
    upload: {
        limits: {
            fileSize: 10 * 1024 * 1024, // 10MB max file size
        },
    },

    // Security: Cookie settings
    cookiePrefix: 'payload',

    // Email: Dynamic adapter reads credentials from CMS (form-settings) with .env fallback.
    // Always active so verify/forgotPassword work when configured via admin panel.
    email: dynamicResendAdapter,

    // Telemetry disabled
    telemetry: false,

    // Debug disabled in production
    debug: process.env.NODE_ENV !== 'production',
})
