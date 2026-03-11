import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import React from 'react'
import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'

import { CookieConsentProvider } from '@/providers/CookieConsent'
import dynamic from 'next/dynamic'
import { SelectionWithProvider } from '@/components/Dancefloor/DancefloorWithProvider'
import { Analytics } from '@/components/Analytics'
const CookieBanner = dynamic(() => import('@/components/CookieBanner').then((m) => m.CookieBanner))
const LivePreviewListener = dynamic(() =>
    import('@/components/LivePreviewListener').then((m) => m.LivePreviewListener),
)
import { getSEOSettings } from '@/utilities/getSEOSettings'
import { getCookieBanner, getThemeSettings } from '@/utilities/getGlobals'
import { localizePageSlug } from '@/utilities/pageSlugAliases'
import { Header } from '@/Header'
import { Footer } from '@/Footer/Component'
import { locales, type Locale } from '@/i18n/config'
import type { Page, Media } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'

import '@/app/(frontend)/globals.css'

const satoshi = localFont({
    src: [
        { path: '../fonts/Satoshi-Regular.woff2', weight: '400', style: 'normal' },
        { path: '../fonts/Satoshi-Medium.woff2', weight: '500', style: 'normal' },
        { path: '../fonts/Satoshi-Bold.woff2', weight: '700', style: 'normal' },
    ],
    variable: '--font-sans',
    display: 'swap',
})

const zodiak = localFont({
    src: [
        { path: '../fonts/Zodiak-Regular.woff2', weight: '400', style: 'normal' },
        { path: '../fonts/Zodiak-Bold.woff2', weight: '700', style: 'normal' },
    ],
    variable: '--font-display',
    display: 'swap',
})

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    themeColor: [
        { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
        { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    ],
}

async function getFrontendIcons(): Promise<Metadata['icons']> {
    const base = getServerSideURL()
    try {
        const seo = await getSEOSettings()
        const iconUrl =
            seo?.favicon && typeof seo.favicon === 'object' && seo.favicon?.url
                ? (seo.favicon as Media).url?.startsWith('http')
                    ? (seo.favicon as Media).url
                    : `${base}${(seo.favicon as Media).url}`
                : undefined
        const appleUrl =
            seo?.appleTouchIcon &&
            typeof seo.appleTouchIcon === 'object' &&
            (seo.appleTouchIcon as Media)?.url
                ? (seo.appleTouchIcon as Media).url?.startsWith('http')
                    ? (seo.appleTouchIcon as Media).url
                    : `${base}${(seo.appleTouchIcon as Media).url}`
                : undefined
        if (iconUrl || appleUrl) {
            return {
                ...(iconUrl && { icon: iconUrl }),
                ...(appleUrl && { apple: appleUrl }),
            }
        }
    } catch {
        // use default icons below
    }
    return {
        icon: '/favicon.svg',
        apple: '/favicon.svg',
    }
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>
}): Promise<Metadata> {
    const { locale } = await params
    const icons = await getFrontendIcons()
    const baseUrl = getServerSideURL()

    const isDE = locale === 'de'

    let ogImageUrl: string | undefined
    try {
        const seo = await getSEOSettings(locale as Locale)
        const logo = seo?.socialMedia?.logo
        if (logo && typeof logo === 'object') {
            const url = (logo as Media).url
            if (url) ogImageUrl = url.startsWith('http') ? url : `${baseUrl}${url}`
        }
    } catch {
        // fallback: no OG image
    }

    return {
        title: {
            default: isDE
                ? 'Deleyna – Talent Agentur Berlin'
                : 'Deleyna – Talent Agency Berlin',
            template: '%s | Deleyna',
        },
        description: isDE
            ? 'Deleyna vermittelt Tänzer und Models für Kampagnen, Events, Editorial und Education in Berlin und international.'
            : 'Elite representation for dancers & models. Where artistry meets opportunity.',
        icons,
        metadataBase: new URL(baseUrl),
        alternates: {
            canonical: `${baseUrl}/${locale}`,
            languages: {
                de: `${baseUrl}/de`,
                en: `${baseUrl}/en`,
                'x-default': `${baseUrl}/de`,
            },
        },
        openGraph: {
            type: 'website',
            locale: isDE ? 'de_DE' : 'en_US',
            siteName: 'Deleyna',
            ...(ogImageUrl
                ? { images: [{ url: ogImageUrl, width: 1200, height: 630, alt: 'Deleyna' }] }
                : {}),
        },
        twitter: {
            card: 'summary_large_image',
            ...(ogImageUrl ? { images: [ogImageUrl] } : {}),
        },
        robots: {
            index: true,
            follow: true,
        },
    }
}

type Props = {
    children: React.ReactNode
    params: Promise<{ locale: string }>
}

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({ children, params }: Props) {
    const { locale } = await params

    if (!locales.includes(locale as Locale)) {
        notFound()
    }

    setRequestLocale(locale)
    const messages = await getMessages()
    const resolvedLocale = locale as Locale

    const seoSettings = await getSEOSettings(resolvedLocale)
    const analytics = seoSettings?.analytics
    const cookieBanner = await getCookieBanner(resolvedLocale)

    const { isEnabled: isDraftMode } = await draftMode()

    let defaultTheme = 'dark'
    try {
        const settings = await getThemeSettings()
        const v = (settings as { defaultTheme?: string })?.defaultTheme
        if (v === 'dark' || v === 'light' || v === 'system') defaultTheme = v
    } catch {
        // Fallback
    }
    const safeDefault =
        defaultTheme === 'light' ? 'light' : defaultTheme === 'system' ? 'system' : 'dark'

    const toLocalizedPagePath = (page: number | Page | null | undefined): string | undefined => {
        if (!page || typeof page !== 'object' || !('slug' in page)) return undefined
        const rawSlug = page.slug
        const localizedSlug =
            rawSlug && typeof rawSlug === 'object'
                ? (rawSlug as Record<string, string | null | undefined>)
                : null
        const slug =
            typeof rawSlug === 'string'
                ? rawSlug
                : localizedSlug
                  ? (localizedSlug[resolvedLocale] ?? localizedSlug.de ?? localizedSlug.en ?? '')
                  : ''
        if (!slug || slug === 'home') return `/${resolvedLocale}`
        return `/${resolvedLocale}/${localizePageSlug(slug, resolvedLocale)}`
    }

    const privacyPolicyUrl = toLocalizedPagePath(cookieBanner?.policies?.privacyPolicy)
    const imprintUrl = toLocalizedPagePath(cookieBanner?.policies?.imprint)

    return (
        <html lang={resolvedLocale} suppressHydrationWarning>
            <head>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `(function(){try{var t=localStorage.getItem('theme');var d='${safeDefault}';var th=(t==='dark'||t==='light')?t:(d==='system'?(window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'):d);document.documentElement.classList.add(th);document.documentElement.setAttribute('data-theme',th)}catch(e){}})()`,
                    }}
                />
                <link rel="preconnect" href="https://www.googletagmanager.com" />
                <link rel="preconnect" href="https://app.rybbit.io" />
            </head>
            <body
                className={`${satoshi.variable} ${zodiak.variable} font-sans antialiased min-h-screen flex flex-col`}
                suppressHydrationWarning
            >
                <NextIntlClientProvider messages={messages} locale={resolvedLocale}>
                    {isDraftMode && <LivePreviewListener />}
                    <a
                        href="#main-content"
                        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-background focus:px-4 focus:py-2 focus:text-foreground focus:shadow-lg focus:ring-2 focus:ring-copper/40"
                    >
                        {resolvedLocale === 'de' ? 'Zum Hauptinhalt springen' : 'Skip to main content'}
                    </a>
                    <CookieConsentProvider>
                        <SelectionWithProvider>
                            <Header locale={resolvedLocale} />
                            <main
                                id="main-content"
                                className="flex-1 overflow-x-clip pt-[var(--header-h)]"
                                tabIndex={-1}
                            >
                                {children}
                            </main>
                            <Footer locale={resolvedLocale} />
                            {cookieBanner?.enabled !== false && (
                                <CookieBanner
                                    locale={resolvedLocale}
                                    triggerPlacement={
                                        cookieBanner?.trigger?.placement || 'floating'
                                    }
                                    title={cookieBanner?.banner?.title}
                                    description={cookieBanner?.banner?.description}
                                    acceptLabel={cookieBanner?.banner?.acceptAllLabel}
                                    rejectLabel={cookieBanner?.banner?.rejectLabel}
                                    settingsLabel={cookieBanner?.banner?.settingsLabel}
                                    saveLabel={cookieBanner?.banner?.saveLabel}
                                    modalTitle={cookieBanner?.modal?.title}
                                    modalDescription={cookieBanner?.modal?.description}
                                    privacyPolicyLabel={cookieBanner?.policies?.privacyPolicyLabel}
                                    privacyPolicyUrl={privacyPolicyUrl}
                                    imprintLabel={cookieBanner?.policies?.imprintLabel || undefined}
                                    imprintUrl={imprintUrl}
                                    necessaryLabel={cookieBanner?.necessary?.label}
                                    necessaryDescription={cookieBanner?.necessary?.description}
                                    analyticsEnabled={cookieBanner?.analytics?.enabled !== false}
                                    analyticsLabel={cookieBanner?.analytics?.label}
                                    analyticsDescription={cookieBanner?.analytics?.description}
                                    marketingEnabled={cookieBanner?.marketing?.enabled === true}
                                    marketingLabel={cookieBanner?.marketing?.label}
                                    marketingDescription={cookieBanner?.marketing?.description}
                                />
                            )}
                            <Analytics
                                ga4MeasurementId={
                                    analytics?.googleAnalytics?.enabled
                                        ? analytics.googleAnalytics.measurementId
                                        : undefined
                                }
                                gtmContainerId={
                                    analytics?.googleTagManager?.enabled
                                        ? analytics.googleTagManager.containerId
                                        : undefined
                                }
                                rybbitSiteId={
                                    analytics?.rybbit?.enabled ? analytics.rybbit.siteId : undefined
                                }
                                rybbitScriptUrl={analytics?.rybbit?.scriptUrl}
                                requireConsentGA={
                                    analytics?.googleAnalytics?.requireConsent ?? true
                                }
                                requireConsentGTM={true}
                                requireConsentRybbit={true}
                            />
                        </SelectionWithProvider>
                    </CookieConsentProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    )
}
