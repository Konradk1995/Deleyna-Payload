import React from 'react'
import type { Page } from '@/payload-types'

// Block Components (Server Components)
import { ContentBlockComponent } from './Content/Component'
import { CallToActionBlockComponent } from './CallToAction/Component'
import { GalleryBlockComponent } from './Gallery/Component'
import { FAQBlockComponent } from './FAQ/Component'

// Curated WEESS Blocks
import { StickyMediaBlock } from './StickyMedia/Component'
import { MasonryGridBlock } from './MasonryGrid/Component'
import { SliderBlock } from './Slider/Component'
import { FormBlock } from './Form/Component'
import { BigTextBlockComponent } from './BigTextBlock/Component'
import { StepSectionBlock } from './StepSection/Component'
import { InfoCardsBlock } from './InfoCards/Component'
import { MediaContentBlock } from './MediaContent/Component'
import { ImpressumBlock } from './Impressum/Component'
import { LegalContentBlock } from './LegalContent/Component'

// Homepage / Startseiten-Blocks
import { ServicesBlockComponent } from './Services/Component'
import { EducationBlockComponent } from './Education/Component'
import { CoachingBlockComponent } from './Coaching/Component'
import { ContactBlockComponent } from './Contact/Component'
import { StatsBlockComponent } from './Stats/Component'
import { FeaturedTalentsBlockComponent } from './FeaturedTalents/Component'
import { TeamBlockComponent } from './Team/Component'

// New Feature Blocks
import { LogoGridBlockComponent } from './LogoGrid/Component'
import { ScheduleBlockComponent } from './Schedule/Component'
import { TestimonialBlockComponent } from './Testimonial/Component'
import { MapBlock } from './Map/Component'
import { MarqueeBannerBlock } from './MarqueeBanner/Component'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const blockComponents: Record<string, React.FC<any>> = {
    content: ContentBlockComponent,
    cta: CallToActionBlockComponent,
    gallery: GalleryBlockComponent,
    faq: FAQBlockComponent,

    stickyMedia: StickyMediaBlock,
    mediaContent: MediaContentBlock,
    masonryGrid: MasonryGridBlock,
    slider: SliderBlock,
    formBlock: FormBlock,
    bigText: BigTextBlockComponent,
    stepSection: StepSectionBlock,
    infoCards: InfoCardsBlock,
    impressum: ImpressumBlock,
    legalContent: LegalContentBlock,

    services: ServicesBlockComponent,
    education: EducationBlockComponent,
    coaching: CoachingBlockComponent,
    contact: ContactBlockComponent,
    stats: StatsBlockComponent,
    featuredTalents: FeaturedTalentsBlockComponent,
    team: TeamBlockComponent,
    logoGrid: LogoGridBlockComponent,
    schedule: ScheduleBlockComponent,
    testimonial: TestimonialBlockComponent,
    map: MapBlock,
    marqueeBanner: MarqueeBannerBlock,
}

interface RenderBlocksProps {
    blocks?: NonNullable<Page['layout']> | null
    locale?: string
}

export function RenderBlocks({ blocks, locale }: RenderBlocksProps) {
    if (!blocks || blocks.length === 0) return null

    return (
        <div className="relative flex flex-col overflow-x-clip">
            {/* Subtle ambient copper glow after hero */}
            <div
                className="pointer-events-none absolute inset-0 z-0 radial-copper-sheen"
                aria-hidden
            />
            {blocks.map((block, index) => {
                const BlockComponent = blockComponents[block.blockType]

                if (!BlockComponent) {
                    return (
                        <div
                            key={index}
                            className="padding-large border border-dashed border-border text-center text-muted-foreground"
                        >
                            Block: {block.blockType} - nicht implementiert
                        </div>
                    )
                }

                return <BlockComponent key={index} {...block} locale={locale} />
            })}
        </div>
    )
}
