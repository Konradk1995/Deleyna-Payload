import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

function parseRemotePattern(input, fallbackProtocol) {
    if (!input) return null

    const value = String(input).trim()
    if (!value) return null

    try {
        const candidate = value.includes('://') ? value : `${fallbackProtocol}://${value}`
        const url = new URL(candidate)

        return {
            protocol: url.protocol.replace(':', ''),
            hostname: url.hostname,
            ...(url.port ? { port: url.port } : {}),
        }
    } catch {
        return null
    }
}

function createPattern(protocol, hostname, port) {
    const pattern = { protocol, hostname }
    if (port) {
        pattern.port = port
    }
    return pattern
}

function buildImageRemotePatterns() {
    const fromServerUrl = parseRemotePattern(process.env.NEXT_PUBLIC_SERVER_URL, 'https')
    const fromS3Endpoint = parseRemotePattern(process.env.S3_ENDPOINT, 'https')
    const fromCdnUrl = parseRemotePattern(process.env.NEXT_PUBLIC_IMAGE_CDN_URL, 'https')

    const hostPatterns = (process.env.NEXT_PUBLIC_IMAGE_REMOTE_HOSTS || '')
        .split(',')
        .map((entry) => entry.trim())
        .filter(Boolean)
        .flatMap((hostname) => {
            const httpsPattern = parseRemotePattern(hostname, 'https')
            const httpPattern = parseRemotePattern(hostname, 'http')
            return [httpsPattern, httpPattern].filter(Boolean)
        })

    const localPatterns = [
        createPattern('http', 'localhost'),
        createPattern('https', 'localhost'),
        createPattern('http', '127.0.0.1'),
        createPattern('https', '127.0.0.1'),
        parseRemotePattern('http://localhost:3000', 'http'),
        parseRemotePattern('http://127.0.0.1:3000', 'http'),
    ].filter(Boolean)

    const allPatterns = [
        fromServerUrl,
        fromS3Endpoint,
        fromCdnUrl,
        ...hostPatterns,
        ...localPatterns,
    ]
        .filter(Boolean)
        .map((pattern) => ({
            protocol: pattern.protocol,
            hostname: pattern.hostname,
            ...(pattern.port ? { port: pattern.port } : {}),
        }))

    const deduped = []
    const seen = new Set()
    for (const pattern of allPatterns) {
        const key = `${pattern.protocol}:${pattern.hostname}:${pattern.port || ''}`
        if (seen.has(key)) continue
        seen.add(key)
        deduped.push(pattern)
    }

    return deduped
}

const imageRemotePatterns = buildImageRemotePatterns()

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Security Headers - Production-Grade
    async headers() {
        const isDev = process.env.NODE_ENV === 'development'

        // Shared CSP directives (without script-src)
        const sharedCsp = [
            "default-src 'self'",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "img-src 'self' data: blob: https: http:",
            "font-src 'self' https://fonts.gstatic.com data:",
            "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://app.rybbit.io wss:",
            "frame-src 'self' https://www.googletagmanager.com",
            `frame-ancestors 'self' ${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}`,
            "form-action 'self'",
            "base-uri 'self'",
            "object-src 'none'",
            'upgrade-insecure-requests',
        ]

        // Frontend: no unsafe-eval
        const frontendCsp = [
            ...sharedCsp,
            "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://app.rybbit.io",
        ].join('; ')

        // Admin: needs unsafe-eval for Payload CMS admin UI
        const adminCsp = [
            ...sharedCsp,
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://app.rybbit.io",
        ].join('; ')

        const commonSecurityHeaders = [
            { key: 'X-DNS-Prefetch-Control', value: 'on' },
            {
                key: 'Strict-Transport-Security',
                value: 'max-age=63072000; includeSubDomains; preload',
            },
            { key: 'X-Content-Type-Options', value: 'nosniff' },
            { key: 'X-XSS-Protection', value: '1; mode=block' },
            { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
            {
                key: 'Permissions-Policy',
                value: 'camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=(), usb=(), bluetooth=(), serial=()',
            },
            { key: 'X-Permitted-Cross-Domain-Policies', value: 'none' },
            { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ]

        return [
            // Admin routes: CSP with unsafe-eval (must be before catch-all)
            ...(!isDev
                ? [
                      {
                          source: '/admin/:path*',
                          headers: [
                              ...commonSecurityHeaders,
                              { key: 'Content-Security-Policy', value: adminCsp },
                          ],
                      },
                  ]
                : []),
            // All other routes: stricter CSP
            {
                source: '/(.*)',
                headers: [
                    ...commonSecurityHeaders,
                    ...(!isDev ? [{ key: 'Content-Security-Policy', value: frontendCsp }] : []),
                ],
            },
            // Static assets - aggressive caching
            {
                source: '/(.*)\\.(ico|png|jpg|jpeg|gif|webp|svg|woff|woff2|ttf|eot)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
            // API routes - no caching, security headers
            {
                source: '/api/(.*)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'no-store, no-cache, must-revalidate',
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                ],
            },
        ]
    },

    // Redirects for security
    async redirects() {
        return [
            // Block common attack paths
            {
                source: '/wp-admin/:path*',
                destination: '/404',
                permanent: true,
            },
            {
                source: '/wp-login.php',
                destination: '/404',
                permanent: true,
            },
            {
                source: '/.env',
                destination: '/404',
                permanent: true,
            },
            {
                source: '/.git/:path*',
                destination: '/404',
                permanent: true,
            },
            {
                source: '/phpmyadmin/:path*',
                destination: '/404',
                permanent: true,
            },
        ]
    },

    webpack: (webpackConfig) => {
        webpackConfig.resolve.extensionAlias = {
            '.cjs': ['.cts', '.cjs'],
            '.js': ['.ts', '.tsx', '.js', '.jsx'],
            '.mjs': ['.mts', '.mjs'],
        }

        return webpackConfig
    },

    // Performance optimizations
    experimental: {
        optimizePackageImports: ['@payloadcms/ui', 'lucide-react', 'motion'],
        serverActions: {
            bodySizeLimit: '10mb',
        },
    },

    // Image optimization
    images: {
        formats: ['image/avif', 'image/webp'],
        // Mobile (640), Tablet (768, 828), Laptop (1024, 1080), Desktop (1200, 1920)
        deviceSizes: [640, 768, 750, 828, 1024, 1080, 1200, 1920],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512, 1024],
        minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
        remotePatterns: imageRemotePatterns,
    },

    // Standalone output for Docker/Dokploy
    output: 'standalone',

    // Compression
    compress: true,

    // Power optimizations
    poweredByHeader: false, // Remove X-Powered-By header

    // Strict mode for React
    reactStrictMode: true,
}

export default withPayload(withNextIntl(nextConfig), { devBundleServerPackages: false })
