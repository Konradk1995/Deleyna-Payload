import { getTranslations } from 'next-intl/server'
import { CalendarDays, Clock3, MapPin, User2 } from 'lucide-react'
import { cn } from '@/utilities/ui'
import { SectionHeader } from '@/components/SectionHeader'

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
    headline?: string | null
    subtitle?: string | null
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
    headline,
    subtitle,
    layout = 'list',
    classes,
    locale = 'de',
    className,
}: ScheduleBlockProps) {
    if (!Array.isArray(classes) || classes.length === 0) return null

    const t = await getTranslations({ locale, namespace: 'schedule' })
    const bookingLabel = t('bookSpot')
    const classLabel = t('class')
    const cardLayoutClass =
        layout === 'grid' ? 'grid gap-4 sm:grid-cols-2 xl:grid-cols-3' : 'flex flex-col gap-4'

    return (
        <section className={cn('section-padding-lg section-atmosphere bg-muted/30', className)}>
            <div className="container">
                <SectionHeader
                    overline={t('overline')}
                    title={headline || t('title')}
                    description={subtitle || undefined}
                    titleClassName="chrome-text"
                />

                <div className={cardLayoutClass}>
                    {classes.map((item, index) => {
                        const title =
                            getLocalizedText(item.title, locale) || `${classLabel} ${index + 1}`
                        const coach = getLocalizedText(item.coach, locale)
                        const dateText = getLocalizedText(item.dateText, locale)
                        const level = getLocalizedText(item.level, locale)
                        const location = getLocalizedText(item.location, locale)
                        const notes = getLocalizedText(item.notes, locale)

                        return (
                            <article
                                key={item.id ?? index}
                                className="rounded-2xl border border-border/70 bg-card/80 p-5 backdrop-blur-sm transition-colors hover:border-copper/30"
                            >
                                <h3 className="font-heading-5-bold mb-3 text-foreground">
                                    {title}
                                </h3>

                                <div className="space-y-2 text-sm text-muted-foreground">
                                    {coach && (
                                        <div className="flex items-start gap-2">
                                            <User2 className="mt-0.5 h-4 w-4 text-copper" />
                                            <span>{coach}</span>
                                        </div>
                                    )}
                                    {(dateText || item.time) && (
                                        <div className="flex items-start gap-2">
                                            <CalendarDays className="mt-0.5 h-4 w-4 text-copper" />
                                            <span>
                                                {[dateText, item.time].filter(Boolean).join(' · ')}
                                            </span>
                                        </div>
                                    )}
                                    {level && (
                                        <div className="flex items-start gap-2">
                                            <Clock3 className="mt-0.5 h-4 w-4 text-copper" />
                                            <span>{level}</span>
                                        </div>
                                    )}
                                    {location && (
                                        <div className="flex items-start gap-2">
                                            <MapPin className="mt-0.5 h-4 w-4 text-copper" />
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
                                        className="mt-4 inline-flex items-center rounded-full border border-copper/40 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-copper transition-colors hover:bg-copper/10"
                                    >
                                        {bookingLabel}
                                    </a>
                                )}
                            </article>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
