import type { Payload } from 'payload'
import type { Page } from '@/payload-types'
import { resolveLocale } from '@/utilities/locale'

type LayoutBlock = NonNullable<Page['layout']>[number]

/**
 * Füllt bei allen FeaturedTalents-Blocks mit leerem talents-Array
 * die Featured-Talents aus der Collection.
 */
export async function enrichFeaturedTalentsBlocks(
    layout: Page['layout'],
    payload: Payload,
    locale?: string,
): Promise<Page['layout']> {
    if (!layout || layout.length === 0) return layout

    const blocks = [...layout] as LayoutBlock[]
    const resolvedLocale = resolveLocale(locale) as 'de' | 'en'

    for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i]
        if (block.blockType !== 'featuredTalents') continue

        const talents = (block as { talents?: unknown }).talents
        if (Array.isArray(talents) && talents.length > 0) {
            const hasOnlyIDs = talents.every(
                (entry) => typeof entry === 'string' || typeof entry === 'number',
            )

            if (!hasOnlyIDs) continue

            const ids = talents as Array<string | number>
            const selected = await payload.find({
                collection: 'talents',
                depth: 1,
                locale: resolvedLocale,
                where: {
                    and: [
                        { id: { in: ids } },
                        { _status: { equals: 'published' } },
                    ],
                },
                limit: ids.length,
            })

            const orderedDocs = ids
                .map((id) => selected.docs.find((doc) => String(doc.id) === String(id)))
                .filter(Boolean)
            ;(blocks[i] as { talents: unknown }).talents = orderedDocs
            continue
        }

        const result = await payload.find({
            collection: 'talents',
            depth: 1,
            locale: resolvedLocale,
            where: {
                featured: { equals: true },
                _status: { equals: 'published' },
            },
            sort: 'sortOrder',
            limit: 8,
        })

        ;(blocks[i] as { talents: unknown }).talents = result.docs
    }

    return blocks as Page['layout']
}
