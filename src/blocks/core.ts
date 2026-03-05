import { ContentBlock } from './Content/config'
import { CallToActionBlock } from './CallToAction/config'
import { GalleryBlock } from './Gallery/config'
import { FAQBlock } from './FAQ/config'
import { StickyMedia } from './StickyMedia/config'
import { MediaContent } from './MediaContent/config'
import { MasonryGrid } from './MasonryGrid/config'
import { Slider } from './Slider/config'
import { FormBlock } from './Form/config'
import { BigTextBlock } from './BigTextBlock/config'
import { StepSection } from './StepSection/config'
import { InfoCards } from './InfoCards/config'
import { Impressum } from './Impressum/config'
import { LegalContent } from './LegalContent/config'

// Named exports keep existing imports stable (`import { ContentBlock } from '../blocks'`)
export {
    ContentBlock,
    CallToActionBlock,
    GalleryBlock,
    FAQBlock,
    StickyMedia,
    MediaContent,
    MasonryGrid,
    Slider,
    FormBlock,
    BigTextBlock,
    StepSection,
    InfoCards,
    Impressum,
    LegalContent,
}

/**
 * Core blocks:
 * shared, reusable building blocks used across multiple page types.
 */
export const coreBlocks = [
    ContentBlock,
    CallToActionBlock,
    GalleryBlock,
    FAQBlock,
    StickyMedia,
    MediaContent,
    MasonryGrid,
    Slider,
    FormBlock,
    BigTextBlock,
    StepSection,
    InfoCards,
    Impressum,
    LegalContent,
]

