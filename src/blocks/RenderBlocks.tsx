import React, { Fragment } from 'react'
import dynamic from 'next/dynamic'

import type { Page } from '@/payload-types'

const BlockSkeleton = () => (
    <div
        className="min-h-[280px] animate-pulse rounded-2xl bg-muted/50"
        aria-hidden
    />
)

const blockComponents = {
    // Core blocks
    content: dynamic(() => import('./Content/Component').then((m) => m.ContentBlockComponent), { ssr: true, loading: () => <BlockSkeleton /> }),
    cta: dynamic(() => import('./CallToAction/Component').then((m) => m.CallToActionBlockComponent), { ssr: true, loading: () => <BlockSkeleton /> }),
    gallery: dynamic(() => import('./Gallery/Component').then((m) => m.GalleryBlockComponent), { ssr: true, loading: () => <BlockSkeleton /> }),
    faq: dynamic(() => import('./FAQ/Component').then((m) => m.FAQBlockComponent), { ssr: true, loading: () => <BlockSkeleton /> }),
    stickyMedia: dynamic(() => import('./StickyMedia/Component').then((m) => m.StickyMediaBlock), { ssr: true, loading: () => <BlockSkeleton /> }),
    mediaContent: dynamic(() => import('./MediaContent/Component').then((m) => m.MediaContentBlock), { ssr: true, loading: () => <BlockSkeleton /> }),
    masonryGrid: dynamic(() => import('./MasonryGrid/Component').then((m) => m.MasonryGridBlock), { ssr: true, loading: () => <BlockSkeleton /> }),
    slider: dynamic(() => import('./Slider/Component').then((m) => m.SliderBlock), { ssr: true, loading: () => <BlockSkeleton /> }),
    formBlock: dynamic(() => import('./Form/Component').then((m) => m.FormBlock), { ssr: true, loading: () => <BlockSkeleton /> }),
    bigText: dynamic(() => import('./BigTextBlock/Component').then((m) => m.BigTextBlockComponent), { ssr: true, loading: () => <BlockSkeleton /> }),
    stepSection: dynamic(() => import('./StepSection/Component').then((m) => m.StepSectionBlock), { ssr: true, loading: () => <BlockSkeleton /> }),
    infoCards: dynamic(() => import('./InfoCards/Component').then((m) => m.InfoCardsBlock), { ssr: true, loading: () => <BlockSkeleton /> }),
    impressum: dynamic(() => import('./Impressum/Component').then((m) => m.ImpressumBlock), { ssr: true, loading: () => <BlockSkeleton /> }),
    legalContent: dynamic(() => import('./LegalContent/Component').then((m) => m.LegalContentBlock), { ssr: true, loading: () => <BlockSkeleton /> }),

    // Extended blocks
    services: dynamic(() => import('./Services/Component').then((m) => m.ServicesBlockComponent), { ssr: true, loading: () => <BlockSkeleton /> }),
    education: dynamic(() => import('./Education/Component').then((m) => m.EducationBlockComponent), { ssr: true, loading: () => <BlockSkeleton /> }),
    coaching: dynamic(() => import('./Coaching/Component').then((m) => m.CoachingBlockComponent), { ssr: true, loading: () => <BlockSkeleton /> }),
    contact: dynamic(() => import('./Contact/Component').then((m) => m.ContactBlockComponent), { ssr: true, loading: () => <BlockSkeleton /> }),
    stats: dynamic(() => import('./Stats/Component').then((m) => m.StatsBlockComponent), { ssr: true, loading: () => <BlockSkeleton /> }),
    featuredTalents: dynamic(() => import('./FeaturedTalents/Component').then((m) => m.FeaturedTalentsBlockComponent), { ssr: true, loading: () => <BlockSkeleton /> }),
    team: dynamic(() => import('./Team/Component').then((m) => m.TeamBlockComponent), { ssr: true, loading: () => <BlockSkeleton /> }),
    logoGrid: dynamic(() => import('./LogoGrid/Component').then((m) => m.LogoGridBlockComponent), { ssr: true, loading: () => <BlockSkeleton /> }),
    schedule: dynamic(() => import('./Schedule/Component').then((m) => m.ScheduleBlockComponent), { ssr: true, loading: () => <BlockSkeleton /> }),
    testimonial: dynamic(() => import('./Testimonial/Component').then((m) => m.TestimonialBlockComponent), { ssr: true, loading: () => <BlockSkeleton /> }),
    map: dynamic(() => import('./Map/Component').then((m) => m.MapBlock), { ssr: true, loading: () => <BlockSkeleton /> }),
    marqueeBanner: dynamic(() => import('./MarqueeBanner/Component').then((m) => m.MarqueeBannerBlock), { ssr: true, loading: () => <BlockSkeleton /> }),
}

interface RenderBlocksProps {
    blocks?: NonNullable<Page['layout']> | null
    locale?: string
}

export function RenderBlocks({ blocks, locale }: RenderBlocksProps) {
    if (!blocks || blocks.length === 0) return null

    return (
        <div className="relative flex flex-col overflow-x-clip">
            <div
                className="pointer-events-none absolute inset-0 z-0 radial-copper-sheen"
                aria-hidden
            />
            <Fragment>
                {blocks.map((block, index) => {
                    const { blockType } = block

                    if (blockType && blockType in blockComponents) {
                        const Block =
                            blockComponents[blockType as keyof typeof blockComponents] as React.ComponentType<Record<string, unknown>>

                        return (
                            <div key={index}>
                                <Block {...block} locale={locale} />
                            </div>
                        )
                    }

                    return null
                })}
            </Fragment>
        </div>
    )
}
