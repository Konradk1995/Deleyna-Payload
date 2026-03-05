import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'

import { getPathname } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'

type StaticPathname = Exclude<keyof typeof routing.pathnames, `${string}[${string}]${string}`>

const isStaticPathname = (value: string): value is StaticPathname =>
    Object.hasOwn(routing.pathnames, value)

const handleI18nRouting = createMiddleware(routing)

export default function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Pathname an Layout weitergeben, damit Root-Layout für /admin kein doppeltes Document rendert
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-pathname', pathname)

    // Admin: keine i18n-Umleitung, nur Header setzen und durchlassen
    if (pathname.startsWith('/admin')) {
        return NextResponse.next({ request: { headers: requestHeaders } })
    }

    const hasLocale = routing.locales.some(
        (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
    )

    if (!hasLocale) {
        const cookieName =
            typeof routing.localeCookie === 'object' && routing.localeCookie?.name
                ? routing.localeCookie.name
                : 'NEXT_LOCALE'
        const cookieLocale = request.cookies.get(cookieName)?.value
        const preferredLocale = routing.locales.includes(
            cookieLocale as (typeof routing.locales)[number],
        )
            ? (cookieLocale as (typeof routing.locales)[number])
            : routing.defaultLocale
        const localizedPathname = isStaticPathname(pathname)
            ? getPathname({
                  locale: preferredLocale,
                  href: pathname,
              })
            : pathname === '/'
              ? `/${preferredLocale}`
              : `/${preferredLocale}${pathname}`
        const url = request.nextUrl.clone()
        url.pathname = localizedPathname
        const res = NextResponse.redirect(url)
        res.headers.set('x-pathname', pathname)
        return res
    }

    // Request mit x-pathname weitergeben, damit Root-Layout den Pfad kennt
    const reqWithPath = new NextRequest(request.url, { headers: requestHeaders })
    const response = handleI18nRouting(reqWithPath)

    // OPTIMIZATION: Next.js sets `Cache-Control: no-store` when using draftMode() or headers() in layouts.
    // This explicitly prevents bfcache (back/forward cache) on mobile Safari and Chrome.
    // We overwrite it for HTML navigation responses.
    const isPageRequest =
        !pathname.includes('.') && !pathname.startsWith('/api') && !pathname.startsWith('/admin')
    if (isPageRequest) {
        if (response.headers.get('cache-control')?.includes('no-store')) {
            response.headers.set('Cache-Control', 'public, max-age=0, must-revalidate')
        }
    }

    return response
}

export const config = {
    // Skip all paths that should not be internationalized.
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (svg, png, jpg, webp, etc.)
         */
        '/((?!api|_next/static|_next/image|favicon\\.ico|sitemap.*\\.xml|robots\\.txt|llms\\.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js|woff2?|json|xsl)$).*)',
    ],
}
