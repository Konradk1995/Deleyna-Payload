import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['de', 'en'],
  defaultLocale: 'de',
  localePrefix: 'always',
  localeDetection: false,
  pathnames: {
    '/': '/',
    // Talents collection routes
    '/talents': {
      de: '/talente',
      en: '/talents',
    },
    '/talents/[slug]': {
      de: '/talente/[slug]',
      en: '/talents/[slug]',
    },
    // Blog (Posts) collection routes
    '/blog': {
      de: '/magazin',
      en: '/blog',
    },
    '/blog/[slug]': {
      de: '/magazin/[slug]',
      en: '/blog/[slug]',
    },
    // Jobs routes
    '/jobs': '/jobs',
    '/jobs/[slug]': '/jobs/[slug]',
    // Catch-all for all dynamic CMS pages
    '/[...slug]': '/[...slug]',
  },
  localeCookie: {
    name: 'NEXT_LOCALE',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  },
})

export type Pathnames = keyof typeof routing.pathnames
