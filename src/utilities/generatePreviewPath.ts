import type { PayloadRequest } from 'payload'
import { resolveLocale, withLocalePath } from '@/utilities/locale'
import { localizePageSlug } from '@/utilities/pageSlugAliases'

type PreviewCollection = 'posts' | 'pages' | 'talents'
type LocalizedSlug = Record<string, string>

type Props = {
    collection: PreviewCollection
    slug: string | LocalizedSlug | null | undefined
    req: PayloadRequest
}

function getCollectionPrefix(collection: PreviewCollection, locale: string): string {
    if (collection === 'posts') return locale === 'de' ? '/magazin' : '/blog'
    if (collection === 'talents') return locale === 'de' ? '/talente' : '/talents'
    return ''
}

function resolveLocaleFromRequest(req: PayloadRequest): string {
    if (req.locale) return resolveLocale(req.locale)

    const query = (req as PayloadRequest & { query?: Record<string, unknown> }).query
    if (query?.locale) {
        const val = Array.isArray(query.locale) ? query.locale[0] : query.locale
        if (typeof val === 'string') return resolveLocale(val)
    }

    const searchParams = (req as PayloadRequest & { searchParams?: URLSearchParams }).searchParams
    if (searchParams?.get) {
        const val = searchParams.get('locale')
        if (val) return resolveLocale(val)
    }

    return resolveLocale(undefined)
}

function resolveSlugValue(slug: Props['slug'], locale: string): string | null {
    if (slug === undefined || slug === null) return null
    if (typeof slug === 'string') return slug
    if (typeof slug === 'object') {
        return slug[locale] ?? slug['de'] ?? Object.values(slug).find((v) => typeof v === 'string') ?? null
    }
    return null
}

export function generatePreviewPath({ collection, slug, req }: Props): string | null {
    const locale = resolveLocaleFromRequest(req)
    const resolvedSlug = resolveSlugValue(slug, locale)

    if (resolvedSlug === undefined || resolvedSlug === null) return null

    const slugForPath =
        collection === 'pages' ? localizePageSlug(resolvedSlug, locale) : resolvedSlug
    const encodedSlug = encodeURIComponent(slugForPath)
    const collectionPrefix = getCollectionPrefix(collection, locale)

    const rawPath =
        collection === 'pages' && slugForPath === 'home'
            ? '/'
            : `${collectionPrefix}/${encodedSlug}`

    const localizedPath = withLocalePath(rawPath, locale)

    const params = new URLSearchParams({
        slug: encodedSlug,
        collection,
        path: localizedPath,
        previewSecret: process.env.PREVIEW_SECRET || '',
    })

    return `/next/preview?${params.toString()}`
}
