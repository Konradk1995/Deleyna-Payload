import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'
import { SectionHeader } from '@/components/SectionHeader'
import { CMSLink } from '@/components/CMSLink'
import { ScrollFadeIn } from '@/components/ScrollFadeIn'
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
    badge?: string | null
    title?: string | null
    titleHighlight?: string | null
    headingLevel?: string | null
    description?: string | null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cta?: any
    items?: FAQItem[] | null
    layout?: 'accordion' | 'list' | 'twoColumn' | null
    generateSchema?: boolean | null
    anchorId?: string | null
    backgroundColor?: 'white' | 'muted' | null
}

export function FAQBlockComponent({
    badge,
    title,
    titleHighlight,
    headingLevel,
    description,
    cta,
    items,
    layout = 'accordion',
    generateSchema,
    anchorId,
    backgroundColor = 'white',
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

    const bgClass = backgroundColor === 'muted' ? 'bg-muted' : 'bg-background'

    return (
        <section
            id={anchorId || undefined}
            className={cn('section-padding-lg section-atmosphere relative', bgClass)}
        >
            <div className="pointer-events-none absolute left-1/2 top-0 h-64 min-w-[30rem] -translate-x-1/2 rounded-full bg-copper/8 blur-3xl" aria-hidden="true" />
            <div className="container relative">
                {schemaData && (
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
                    />
                )}

                <SectionHeader
                    overline={badge}
                    title={title}
                    titleHighlight={titleHighlight}
                    description={description}
                    as={(headingLevel as 'h1' | 'h2' | 'h3') || 'h2'}
                    titleClassName="chrome-text"
                />

                <ScrollFadeIn animation="fade-up">
                    <FAQAccordion items={accordionItems} layout={layout} />
                </ScrollFadeIn>

                {cta && typeof cta === 'object' && cta.label && (
                    <div className="mt-10 text-center">
                        <CMSLink {...cta} />
                    </div>
                )}
            </div>
        </section>
    )
}
