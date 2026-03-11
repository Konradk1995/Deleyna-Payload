import React from 'react'

import type {
  SliderBlock as SliderBlockProps,
  Post,
  Talent,
} from '@/payload-types'

import { SliderClient } from './Component.client'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import { resolveLocale } from '@/utilities/locale'

type SupportedCollection = 'posts' | 'talents'
type SupportedLocale = 'de' | 'en'
type BadgeField = 'none' | 'title' | 'category'

const collectionPaths: Record<SupportedCollection, Record<SupportedLocale, string>> = {
  posts: { de: 'magazin', en: 'blog' },
  talents: { de: 'talente', en: 'talents' },
}

type SliderItem = {
  id: string
  badge: string
  name: string
  description: string
  image?: string | null
  href: string
  slug?: string | null
}

type ManualSelectionItem =
  | string
  | number
  | {
      relationTo: SupportedCollection
      value: string | number | Post | Talent
    }

function getLocalizedText(value: unknown, locale: SupportedLocale): string {
  if (typeof value === 'string') return value
  if (value && typeof value === 'object') {
    const localized = value as Record<string, string | null | undefined>
    return localized[locale] || localized.de || localized.en || ''
  }
  return ''
}

function getLocalizedSlug(
  slug: string | Record<string, string | null | undefined> | null | undefined,
  locale: SupportedLocale,
): string {
  if (!slug) return ''
  if (typeof slug === 'string') return slug
  return slug[locale] || slug.de || slug.en || ''
}

function getLocalizedHref(
  collection: SupportedCollection,
  slug: string | number | null | undefined,
  locale: SupportedLocale,
): string {
  const pathSegment = collectionPaths[collection][locale]
  const safeSlug = encodeURIComponent(String(slug || ''))
  return `/${pathSegment}/${safeSlug}`
}

function getDefaultBadge(collection: SupportedCollection, locale: SupportedLocale): string {
  if (collection === 'posts') return locale === 'de' ? 'MAGAZIN' : 'BLOG'
  return locale === 'de' ? 'TALENT' : 'TALENT'
}

function getTalentCategoryBadge(
  category: Talent['category'] | null | undefined,
  locale: SupportedLocale,
): string {
  const labels = {
    de: {
      dancer: 'TÄNZER',
      model: 'MODEL',
      both: 'TALENT',
    },
    en: {
      dancer: 'DANCER',
      model: 'MODEL',
      both: 'TALENT',
    },
  } as const

  if (!category) return locale === 'de' ? 'TALENT' : 'TALENT'
  return labels[locale][category] || labels[locale].both
}

function getPostCategoryBadge(post: Post, locale: SupportedLocale): string | null {
  const firstCategory = Array.isArray(post.categories) ? post.categories[0] : null
  if (firstCategory && typeof firstCategory === 'object' && 'title' in firstCategory) {
    const categoryTitle = getLocalizedText(firstCategory.title, locale).trim()
    if (categoryTitle) return categoryTitle
  }
  return null
}

function resolveBadgeText(
  doc: Post | Talent,
  collection: SupportedCollection,
  locale: SupportedLocale,
  badgeField: BadgeField,
  staticBadge: unknown,
  itemName: string,
): string {
  const defaultBadge = getDefaultBadge(collection, locale)
  const resolvedStaticBadge = getLocalizedText(staticBadge, locale).trim()

  if (badgeField === 'none') {
    return resolvedStaticBadge || defaultBadge
  }

  if (badgeField === 'title') {
    return itemName || defaultBadge
  }

  if (badgeField === 'category') {
    if (collection === 'posts') {
      const categoryBadge = getPostCategoryBadge(doc as Post, locale)
      return categoryBadge || defaultBadge
    }
    const talent = doc as Talent
    return getTalentCategoryBadge(talent.category, locale)
  }

  return defaultBadge
}

async function fetchCollectionData(
  sourceCollection: SupportedCollection,
  limit: number,
  sortBy: string,
  locale: SupportedLocale,
  badgeField: BadgeField,
  staticBadge: unknown,
  manualSelection?: ManualSelectionItem[],
): Promise<SliderItem[]> {
  'use server'

  const payload = await getPayload({ config: configPromise })

  // Handle manual selection
  if (sortBy === 'manual' && manualSelection && manualSelection.length > 0) {
    const items: SliderItem[] = []

    for (const selection of manualSelection) {
      let id: string | number
      let collection: SupportedCollection

      if (typeof selection === 'string' || typeof selection === 'number') {
        id = selection
        collection = sourceCollection
      } else if (typeof selection === 'object' && selection !== null && 'value' in selection) {
        collection = selection.relationTo
        const value = selection.value

        if (typeof value === 'object' && value !== null && 'id' in value) {
          items.push(
            mapDocumentToSliderItem(
              value as Post | Talent,
              collection,
              locale,
              badgeField,
              staticBadge,
            ),
          )
          continue
        }

        if (typeof value !== 'string' && typeof value !== 'number') continue
        id = value
      } else {
        continue
      }

      try {
        const doc = await payload.findByID({
          collection,
          id,
          depth: 1,
          locale,
        })

        if (doc) {
          items.push(mapDocumentToSliderItem(doc, collection, locale, badgeField, staticBadge))
        }
      } catch {
        // Skip if document not found
      }
    }

    return items.slice(0, limit)
  }

  // Fetch from collection
  const sortOrder =
    sortBy === 'title'
      ? sourceCollection === 'talents'
        ? 'name'
        : 'title'
      : sourceCollection === 'talents'
        ? 'sortOrder'
        : '-publishedAt'

  try {
    const result = await payload.find({
      collection: sourceCollection,
      limit,
      sort: sortOrder,
      where: {
        _status: {
          equals: 'published',
        },
      },
      depth: 1,
      locale,
    })

    return result.docs.map((doc) =>
      mapDocumentToSliderItem(doc, sourceCollection, locale, badgeField, staticBadge),
    )
  } catch {
    return []
  }
}

function mapDocumentToSliderItem(
  doc: Post | Talent,
  collection: SupportedCollection,
  locale: SupportedLocale,
  badgeField: BadgeField,
  staticBadge: unknown,
): SliderItem {
  const slug = getLocalizedSlug(doc.slug as string | Record<string, string>, locale) || String(doc.id)
  const untitled = locale === 'de' ? 'Ohne Titel' : 'Untitled'
  const localizedName =
    'title' in doc
      ? getLocalizedText(doc.title, locale).trim() || untitled
      : 'name' in doc
        ? getLocalizedText(doc.name, locale).trim() || untitled
        : untitled

  const baseItem: SliderItem = {
    id: String(doc.id),
    badge: resolveBadgeText(doc, collection, locale, badgeField, staticBadge, localizedName),
    name: localizedName,
    description: '',
    href: getLocalizedHref(collection, slug, locale),
    slug: slug,
  }

  switch (collection) {
    case 'posts': {
      const post = doc as Post
      return {
        ...baseItem,
        description: getLocalizedText(post.excerpt, locale),
        image:
          post.featuredImage && typeof post.featuredImage === 'object' && 'url' in post.featuredImage
            ? (post.featuredImage as { url?: string | null }).url ?? null
            : null,
      }
    }
    case 'talents': {
      const talent = doc as Talent
      return {
        ...baseItem,
        name: getLocalizedText(talent.name, locale) || untitled,
        description: getLocalizedText(talent.bio, locale),
        image:
          talent.featuredImage && typeof talent.featuredImage === 'object' && 'url' in talent.featuredImage
            ? (talent.featuredImage as { url?: string | null }).url ?? null
            : null,
      }
    }
    default:
      return baseItem
  }
}

const getCachedSliderData = unstable_cache(
  async (
    sourceCollection: SupportedCollection,
    limit: number,
    sortBy: string,
    locale: SupportedLocale,
    badgeField: BadgeField,
    staticBadge: unknown,
    manualSelection?: ManualSelectionItem[],
  ) => {
    return fetchCollectionData(
      sourceCollection,
      limit,
      sortBy,
      locale,
      badgeField,
      staticBadge,
      manualSelection,
    )
  },
  ['slider-data'],
  {
    revalidate: 60, // Cache for 1 minute
    tags: ['slider'],
  },
)

export const SliderBlock: React.FC<SliderBlockProps & { locale?: string }> = async (props) => {
  const {
    cardStyle,
    sourceCollection,
    badge,
    title,
    titleHighlight,
    headingLevel,
    description,
    cta,
    backgroundColor,
    itemsLimit = 6,
    sortBy = 'publishedAt',
    badgeField = 'none',
    manualSelection,
    staticBadge,
    compactFields,
    featuredFields,
    locale = 'de',
  } = props

  const resolvedLocale = resolveLocale(locale) as SupportedLocale
  const resolvedBadgeField: BadgeField =
    badgeField === 'title' || badgeField === 'category' || badgeField === 'none'
      ? badgeField
      : 'none'

  // Validate required fields
  if (!cardStyle || !sourceCollection) {
    return null
  }

  if (!title) {
    return null
  }

  // Fetch data - convert manualSelection to proper format
  const manualSelectionConverted = manualSelection
    ? (manualSelection as ManualSelectionItem[])
    : undefined

  const items = await getCachedSliderData(
    sourceCollection as SupportedCollection,
    itemsLimit ?? 6,
    sortBy || 'publishedAt',
    resolvedLocale,
    resolvedBadgeField,
    staticBadge,
    manualSelectionConverted,
  )

  if (items.length === 0) {
    return null
  }

  return (
    <SliderClient
      cardStyle={cardStyle}
      badge={badge}
      title={title}
      titleHighlight={titleHighlight}
      headingLevel={headingLevel}
      description={description}
      cta={cta}
      backgroundColor={backgroundColor}
      items={items}
      sourceCollection={sourceCollection}
      compactFields={compactFields}
      featuredFields={featuredFields}
      locale={resolvedLocale}
    />
  )
}
