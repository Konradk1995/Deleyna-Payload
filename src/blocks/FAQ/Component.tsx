import RichText from '@/components/RichText'
import { FAQAccordion } from './Accordion.client'

/** Plain-Text aus Lexical RichText für FAQPage-Schema (Google Rich Results) */
function extractTextFromLexical(richText: unknown): string {
    if (!richText || typeof richText !== 'object') return ''
    const rt = richText as { root?: { children?: Array<{ children?: Array<{ text?: string }> }> } }
    if (!rt.root?.children) return ''
    return rt.root.children
        .map((node) => {
            if (node.children) {
                return node.children.map((child) => child.text || '').join('')
            }
            return ''
        })
        .join(' ')
        .trim()
}

type FAQItem = {
    question?: string | null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    answer?: any
}

type Props = {
    title?: string | null
    description?: string | null
    items?: FAQItem[] | null
    layout?: 'accordion' | 'list' | 'twoColumn' | null
    generateSchema?: boolean | null
    anchorId?: string | null
}

export function FAQBlockComponent({
    title,
    description,
    items,
    layout = 'accordion',
    generateSchema,
    anchorId,
}: Props) {
    if (!items || items.length === 0) return null

    // FAQ Schema for SEO (Google Rich Results)
    const schemaData = generateSchema
        ? (() => {
              const entities = items
                  .filter((item) => item.question && item.answer)
                  .map((item) => {
                      const text =
                          typeof item.answer === 'string'
                              ? item.answer
                              : extractTextFromLexical(item.answer)
                      return text
                          ? {
                                '@type': 'Question' as const,
                                name: item.question,
                                acceptedAnswer: {
                                    '@type': 'Answer' as const,
                                    text,
                                },
                            }
                          : null
                  })
                  .filter(Boolean)
              if (entities.length === 0) return null
              return {
                  '@context': 'https://schema.org',
                  '@type': 'FAQPage',
                  mainEntity: entities,
              }
          })()
        : null

    // Pre-render answer elements on the server
    const accordionItems = items.map((item) => ({
        question: item.question,
        answerElement: item.answer ? <RichText data={item.answer} enableProse={false} /> : null,
    }))

    return (
        <section
            id={anchorId || undefined}
            className="padding-large section-atmosphere relative"
        >
            <div className="pointer-events-none absolute left-1/2 top-0 h-64 min-w-[30rem] -translate-x-1/2 rounded-full bg-copper/8 blur-3xl" />
            <div className="container relative">
                {schemaData && (
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
                    />
                )}

                {(title || description) && (
                    <div className="mb-10 text-center md:mb-14">
                        {title && (
                            <h2 className="mb-3 font-display-tight font-heading-3-bold leading-none tracking-tight text-balance chrome-text hyphens-auto [overflow-wrap:anywhere] pb-1">
                                {title}
                            </h2>
                        )}
                        {description && (
                            <p className="mx-auto max-w-2xl text-balance font-normal-text-regular leading-relaxed text-muted-foreground">
                                {description}
                            </p>
                        )}
                    </div>
                )}

                <FAQAccordion items={accordionItems} layout={layout} />
            </div>
        </section>
    )
}
