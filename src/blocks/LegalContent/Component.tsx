import React from 'react'

import type { LegalContentBlock as LegalContentBlockProps } from '@/payload-types'

import RichText from '@/components/RichText'
import { TocNav } from './TocNav.client'

const SECTION_ID_PREFIX = 'legal-section'

const DEFAULT_TOC_LABEL: Record<string, string> = {
    de: 'Inhaltsverzeichnis',
    en: 'Table of contents',
}

type Props = LegalContentBlockProps & {
    disableInnerContainer?: boolean
    locale?: string
}

export const LegalContentBlock: React.FC<Props> = ({
    title,
    tocLabel,
    sections,
    dateLabel,
    locale,
}) => {
    if (!sections || sections.length === 0) return null

    const lang = locale === 'en' ? 'en' : 'de'
    const resolvedTocLabel = tocLabel || DEFAULT_TOC_LABEL[lang]

    const tocItems = sections.map((section, index) => ({
        id: `${SECTION_ID_PREFIX}-${index}`,
        label: section.heading ?? `${lang === 'en' ? 'Section' : 'Abschnitt'} ${index + 1}`,
    }))

    return (
        <section
            className="section-padding section-atmosphere bg-background"
            aria-label={title ?? undefined}
        >
            <div className="container">
                {title && (
                    <h2 className="mb-10 font-display-tight font-heading-3-bold text-foreground leading-none tracking-tight text-balance hyphens-auto [overflow-wrap:anywhere] pb-1">
                        {title}
                    </h2>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-10 lg:gap-14">
                    {/* TOC sidebar — sticky on desktop */}
                    <aside>
                        <TocNav tocLabel={resolvedTocLabel} items={tocItems} />
                    </aside>

                    {/* Content sections */}
                    <div className="space-y-10 min-w-0">
                        {sections.map((section, index) => {
                            const id = `${SECTION_ID_PREFIX}-${index}`
                            const headingId = `${id}-heading`
                            const heading =
                                section.heading ??
                                `${lang === 'en' ? 'Section' : 'Abschnitt'} ${index + 1}`

                            return (
                                <article
                                    key={section.id ?? index}
                                    id={id}
                                    className="scroll-mt-28"
                                    aria-labelledby={headingId}
                                >
                                    <h3
                                        id={headingId}
                                        className="font-heading-5-bold text-foreground mb-4"
                                    >
                                        {index + 1}. {heading}
                                    </h3>
                                    <div className="font-small-text-regular text-muted-foreground leading-relaxed [&_p]:mb-3 [&_a]:text-primary [&_a]:underline">
                                        <RichText
                                            data={section.content}
                                            enableGutter={false}
                                            enableProse={false}
                                        />
                                    </div>
                                </article>
                            )
                        })}
                    </div>
                </div>

                {dateLabel && (
                    <p className="font-small-text-regular text-muted-foreground mt-12 text-center">
                        {dateLabel}
                    </p>
                )}
            </div>
        </section>
    )
}
