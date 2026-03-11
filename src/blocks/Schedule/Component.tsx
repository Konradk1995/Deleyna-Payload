import { getTranslations } from 'next-intl/server'
import { CalendarDays, Clock3, MapPin, User2 } from 'lucide-react'
import { cn } from '@/utilities/ui'
import { ScrollFadeIn } from '@/components/ScrollFadeIn'
import { SectionHeader } from '@/components/SectionHeader'
import { CMSLink } from '@/components/CMSLink'

type ScheduleClass = {
    id?: string
    title?: string | Record<string, string | null | undefined> | null
    coach?: string | Record<string, string | null | undefined> | null
    dateText?: string | Record<string, string | null | undefined> | null
    time?: string | null
    level?: string | Record<string, string | null | undefined> | null
    location?: string | Record<string, string | null | undefined> | null
    notes?: string | Record<string, string | null | undefined> | null
    bookingLink?: string | null
}

type ScheduleBlockProps = {
    badge?: string | null
    title?: string | null
    titleHighlight?: string | null
    headingLevel?: string | null
    description?: string | null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cta?: any
    backgroundColor?: 'white' | 'muted' | null
    layout?: 'list' | 'grid' | null
    classes?: ScheduleClass[] | null
    locale?: string
    className?: string
}

function getLocalizedText(
    value: string | Record<string, string | null | undefined> | null | undefined,
    locale: string,
): string {
    if (!value) return ''
    if (typeof value === 'string') return value
    return value[locale] || value.de || value.en || ''
}

export async function ScheduleBlockComponent({
    badge,
    title,
    titleHighlight,
    headingLevel,
    description,
    cta,
    backgroundColor = 'muted',
    layout = 'list',
    classes,
    locale = 'de',
    className,
}: ScheduleBlockProps) {
    if (!Array.isArray(classes) || classes.length === 0) return null

    const t = await getTranslations({ locale, namespace: 'schedule' })
    const bookingLabel = t('bookSpot')
    const classLabel = t('class')
    const bgClass = backgroundColor === 'muted' ? 'bg-muted' : 'bg-background'
    const cardLayoutClass =
        layout === 'grid' ? 'grid gap-4 sm:grid-cols-2 xl:grid-cols-3' : 'flex flex-col gap-4'

    return (
        <section className={cn('section-padding-lg section-atmosphere', bgClass, className)}>
            <div className="container">
                <SectionHeader
                    overline={badge || t('overline')}
                    title={title || t('title')}
                    titleHighlight={titleHighlight ?? undefined}
                    description={description || undefined}
                    as={(headingLevel as 'h1' | 'h2' | 'h3') || 'h2'}
                    titleClassName="chrome-text"
                />

                <div className={cardLayoutClass}>
                    {classes.map((item, index) => {
                        const itemTitle =
                            getLocalizedText(item.title, locale) || `${classLabel} ${index + 1}`
                        const coach = getLocalizedText(item.coach, locale)
                        const dateText = getLocalizedText(item.dateText, locale)
                        const level = getLocalizedText(item.level, locale)
                        const location = getLocalizedText(item.location, locale)
                        const notes = getLocalizedText(item.notes, locale)

                        return (
                            <ScrollFadeIn key={item.id ?? index} delay={index * 80} animation="fade-up" className="h-full">
                            <article
                                className="h-full rounded-[var(--block-radius)] border border-border/70 bg-card/80 p-5 backdrop-blur-sm transition-colors hover:border-copper/30"
                            >
                                <h3 className="font-heading-5-bold mb-3 text-foreground">
                                    {itemTitle}
                                </h3>

                                <div className="space-y-2 text-sm text-muted-foreground">
                                    {coach && (
                                        <div className="flex items-start gap-2">
                                            <User2 className="mt-0.5 h-4 w-4 shrink-0 text-copper" aria-hidden="true" />
                                            <span>{coach}</span>
                                        </div>
                                    )}
                                    {(dateText || item.time) && (
                                        <div className="flex items-start gap-2">
                                            <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-copper" aria-hidden="true" />
                                            <span>
                                                {[dateText, item.time].filter(Boolean).join(' · ')}
                                            </span>
                                        </div>
                                    )}
                                    {level && (
                                        <div className="flex items-start gap-2">
                                            <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-copper" aria-hidden="true" />
                                            <span>{level}</span>
                                        </div>
                                    )}
                                    {location && (
                                        <div className="flex items-start gap-2">
                                            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-copper" aria-hidden="true" />
                                            <span>{location}</span>
                                        </div>
                                    )}
                                </div>

                                {notes && (
                                    <p className="mt-4 rounded-lg border border-copper/30 bg-copper/8 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-copper">
                                        {notes}
                                    </p>
                                )}

                                {item.bookingLink && (
                                    <a
                                        href={item.bookingLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-4 inline-flex items-center rounded-full border border-copper/40 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-copper transition-colors hover:bg-copper/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                                        aria-label={`${bookingLabel}: ${itemTitle} (opens in new tab)`}
                                    >
                                        {bookingLabel}
                                    </a>
                                )}
                            </article>
                            </ScrollFadeIn>
                        )
                    })}
                </div>

                {cta && typeof cta === 'object' && cta.label && (
                    <div className="mt-10 text-center">
                        <CMSLink {...cta} />
                    </div>
                )}
            </div>
        </section>
    )
}
