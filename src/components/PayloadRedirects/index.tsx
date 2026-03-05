import type React from 'react'
import type { Page, Post, Talent } from '@/payload-types'

import { getCachedDocument } from '@/utilities/getDocument'
import { getCachedRedirects } from '@/utilities/getRedirects'
import { resolveLocale, withLocalePath } from '@/utilities/locale'
import { notFound, redirect } from 'next/navigation'

interface Props {
    disableNotFound?: boolean
    locale?: string
    url: string
}

/**
 * SSR-based dynamic redirects component.
 * Checks the Payload redirects collection and redirects if a match is found.
 * Falls through to notFound() if no redirect and disableNotFound is false.
 */
export const PayloadRedirects: React.FC<Props> = async ({ disableNotFound, locale, url }) => {
    const redirects = await getCachedRedirects()()
    const resolvedLocale = resolveLocale(locale)

    const redirectItem = redirects.find((r) => r.from === url)

    if (redirectItem) {
        if (redirectItem.to?.url) {
            redirect(withLocalePath(redirectItem.to.url, resolvedLocale))
        }

        const ref = redirectItem.to?.reference
        if (ref) {
            let redirectUrl: string

            if (typeof ref.value === 'string') {
                const document = (await getCachedDocument(
                    ref.relationTo as 'pages' | 'posts' | 'talents',
                    ref.value,
                    { locale: resolvedLocale },
                )) as Page | Post | Talent | null
                const slug = document?.slug === 'home' ? '' : (document?.slug ?? '')
                redirectUrl = getReferencePath(
                    ref.relationTo as 'pages' | 'posts' | 'talents',
                    slug,
                    resolvedLocale,
                )
            } else {
                const slug =
                    typeof ref.value === 'object'
                        ? ref.value?.slug === 'home'
                            ? ''
                            : (ref.value?.slug ?? '')
                        : ''
                redirectUrl = getReferencePath(
                    ref.relationTo as 'pages' | 'posts' | 'talents',
                    slug,
                    resolvedLocale,
                )
            }

            if (redirectUrl) redirect(redirectUrl)
        }
    }

    if (disableNotFound) return null

    notFound()
}

function getReferencePath(
    relationTo: 'pages' | 'posts' | 'talents',
    slug: string,
    locale: string,
): string {
    if (relationTo === 'pages') {
        return withLocalePath(slug ? `/${slug}` : '/', locale)
    }

    const basePath =
        relationTo === 'talents'
            ? locale === 'de'
                ? '/talente'
                : '/talents'
            : locale === 'de'
              ? '/magazin'
              : '/blog'

    return withLocalePath(slug ? `${basePath}/${slug}` : basePath, locale)
}
