import { ServicesBlock } from './Services/config'
import { EducationBlock } from './Education/config'
import { CoachingBlock } from './Coaching/config'
import { ContactBlock } from './Contact/config'
import { StatsBlock } from './Stats/config'
import { FeaturedTalentsBlock } from './FeaturedTalents/config'
import { TeamBlock } from './Team/config'
import { LogoGrid } from './LogoGrid/config'
import { Schedule } from './Schedule/config'
import { TestimonialBlock } from './Testimonial/config'
import { MapBlock } from './Map/config'
import { MarqueeBannerBlock } from './MarqueeBanner/config'

// Named exports keep existing imports stable (`import { MapBlock } from '../blocks'`)
export {
    ServicesBlock,
    EducationBlock,
    CoachingBlock,
    ContactBlock,
    StatsBlock,
    FeaturedTalentsBlock,
    TeamBlock,
    LogoGrid,
    Schedule,
    TestimonialBlock,
    MapBlock,
    MarqueeBannerBlock,
}

/**
 * Extended blocks:
 * business/domain-specific blocks and richer marketing/storytelling modules.
 */
export const extendedBlocks = [
    ServicesBlock,
    EducationBlock,
    CoachingBlock,
    ContactBlock,
    StatsBlock,
    FeaturedTalentsBlock,
    TeamBlock,
    LogoGrid,
    Schedule,
    TestimonialBlock,
    MapBlock,
    MarqueeBannerBlock,
]
