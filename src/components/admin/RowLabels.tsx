'use client'
import { useRowLabel } from '@payloadcms/ui'

/**
 * Reusable RowLabel components for Payload CMS array fields.
 * These show meaningful labels instead of "Item 1, Item 2..." in the admin panel.
 *
 * Fallback labels use English — the Payload admin locale is independent of the site locale.
 */

/** Generic: shows `title`, `name`, `headline`, `heading`, or `label` field */
export const TitleRowLabel: React.FC = () => {
    const { data, rowNumber } = useRowLabel<{ title?: string; name?: string; headline?: string; heading?: string; label?: string }>()
    return <span>{data?.title || data?.name || data?.headline || data?.heading || data?.label || `Item ${(rowNumber ?? 0) + 1}`}</span>
}

/** For FAQ items: shows the question text */
export const QuestionRowLabel: React.FC = () => {
    const { data, rowNumber } = useRowLabel<{ question?: string }>()
    const label = data?.question
        ? data.question.length > 60
            ? `${data.question.slice(0, 60)}…`
            : data.question
        : `Question ${(rowNumber ?? 0) + 1}`
    return <span>{label}</span>
}

/** For team members: shows name + role */
export const MemberRowLabel: React.FC = () => {
    const { data, rowNumber } = useRowLabel<{ name?: string; role?: string }>()
    const label = data?.name
        ? data.role
            ? `${data.name} — ${data.role}`
            : data.name
        : `Member ${(rowNumber ?? 0) + 1}`
    return <span>{label}</span>
}

/** For testimonials: shows author name + truncated quote */
export const TestimonialRowLabel: React.FC = () => {
    const { data, rowNumber } = useRowLabel<{ author?: string; quote?: string }>()
    const label = data?.author || (data?.quote ? `"${data.quote.slice(0, 40)}…"` : `Testimonial ${(rowNumber ?? 0) + 1}`)
    return <span>{label}</span>
}

/** For stats: shows label + value */
export const StatRowLabel: React.FC = () => {
    const { data, rowNumber } = useRowLabel<{ label?: string; value?: string }>()
    const label = data?.label
        ? data.value
            ? `${data.label}: ${data.value}`
            : data.label
        : `Stat ${(rowNumber ?? 0) + 1}`
    return <span>{label}</span>
}

/** For gallery images: shows caption or index */
export const CaptionRowLabel: React.FC = () => {
    const { data, rowNumber } = useRowLabel<{ caption?: string }>()
    return <span>{data?.caption || `Image ${(rowNumber ?? 0) + 1}`}</span>
}

/** For links array: shows link label */
export const LinkRowLabel: React.FC = () => {
    const { data, rowNumber } = useRowLabel<{ link?: { label?: string }; label?: string }>()
    return <span>{data?.link?.label || data?.label || `Link ${(rowNumber ?? 0) + 1}`}</span>
}

/** For steps: shows number + title */
export const StepRowLabel: React.FC = () => {
    const { data, rowNumber } = useRowLabel<{ number?: string; title?: string }>()
    const num = data?.number || `${(rowNumber ?? 0) + 1}`
    return <span>{data?.title ? `${num}. ${data.title}` : `Step ${num}`}</span>
}

/** For coaches: shows name */
export const CoachRowLabel: React.FC = () => {
    const { data, rowNumber } = useRowLabel<{ name?: string; title?: string }>()
    return <span>{data?.name || data?.title || `Coach ${(rowNumber ?? 0) + 1}`}</span>
}

/** For schedule classes */
export const ClassRowLabel: React.FC = () => {
    const { data, rowNumber } = useRowLabel<{ title?: string; day?: string; time?: string }>()
    const label = data?.title
        ? data.day
            ? `${data.title} (${data.day})`
            : data.title
        : `Class ${(rowNumber ?? 0) + 1}`
    return <span>{label}</span>
}

/** For navigation cards: shows label */
export const NavCardRowLabel: React.FC = () => {
    const { data, rowNumber } = useRowLabel<{ label?: string; title?: string }>()
    return <span>{data?.label || data?.title || `Card ${(rowNumber ?? 0) + 1}`}</span>
}

/** For social links: shows platform name */
export const PlatformRowLabel: React.FC = () => {
    const { data, rowNumber } = useRowLabel<{ platform?: string; url?: string }>()
    return <span>{data?.platform || data?.url || `Link ${(rowNumber ?? 0) + 1}`}</span>
}

/** For talent experience: shows title + type */
export const ExperienceRowLabel: React.FC = () => {
    const { data, rowNumber } = useRowLabel<{ title?: string; type?: string }>()
    const label = data?.title
        ? data.type
            ? `${data.title} (${data.type})`
            : data.title
        : `Experience ${(rowNumber ?? 0) + 1}`
    return <span>{label}</span>
}
