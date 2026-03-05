'use client'

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { resolveLocale, withLocalePath } from '@/utilities/locale'
import { cn } from '@/utilities/ui'
import { Button } from '@/components/ui/button'

export const Pagination: React.FC<{
    basePath?: string
    className?: string
    page: number
    totalPages: number
}> = ({ basePath = '/blog', className, page, totalPages }) => {
    const router = useRouter()
    const params = useParams()
    const paramLocale = typeof params?.locale === 'string' ? params.locale : undefined
    const locale = resolveLocale(paramLocale)

    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1
    const hasExtraPrevPages = page - 1 > 1
    const hasExtraNextPages = page + 1 < totalPages

    const getPageHref = (pageNumber: number) => {
        const localizedPath = withLocalePath(basePath, locale)
        return pageNumber <= 1 ? localizedPath : `${localizedPath}/page/${pageNumber}`
    }

    if (totalPages <= 1) return null

    return (
        <nav className={cn('my-12 flex items-center justify-center gap-1', className)} aria-label="Pagination">
            {/* Previous */}
            <Button
                disabled={!hasPrevPage}
                onClick={() => router.push(getPageHref(page - 1))}
                variant="outline"
                size="sm"
                className="px-3"
                aria-label={locale === 'en' ? 'Previous page' : 'Vorherige Seite'}
            >
                &larr;
            </Button>

            {hasExtraPrevPages && (
                <span className="flex h-10 w-10 items-center justify-center text-sm text-muted-foreground">&hellip;</span>
            )}

            {hasPrevPage && (
                <Button
                    onClick={() => router.push(getPageHref(page - 1))}
                    variant="outline"
                    size="icon"
                    className="h-10 w-10"
                >
                    {page - 1}
                </Button>
            )}

            {/* Current */}
            <Button
                type="button"
                variant="primary"
                size="icon"
                className="h-10 w-10"
                aria-current="page"
            >
                {page}
            </Button>

            {hasNextPage && (
                <Button
                    onClick={() => router.push(getPageHref(page + 1))}
                    variant="outline"
                    size="icon"
                    className="h-10 w-10"
                >
                    {page + 1}
                </Button>
            )}

            {hasExtraNextPages && (
                <span className="flex h-10 w-10 items-center justify-center text-sm text-muted-foreground">&hellip;</span>
            )}

            {/* Next */}
            <Button
                disabled={!hasNextPage}
                onClick={() => router.push(getPageHref(page + 1))}
                variant="outline"
                size="sm"
                className="px-3"
                aria-label={locale === 'en' ? 'Next page' : 'Nächste Seite'}
            >
                &rarr;
            </Button>
        </nav>
    )
}
