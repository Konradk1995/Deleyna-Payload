import Image from 'next/image'
import type { Media } from '@/payload-types'
import { cn } from '@/utilities/ui'
import { ScrollFadeIn } from '@/components/ScrollFadeIn'
import { SectionHeader } from '@/components/SectionHeader'

type LogoClient = {
    id?: string
    name?: string | null
    logo?: number | Media | null
    link?: string | null
}

type LogoGridBlockProps = {
    badge?: string | null
    title?: string | null
    headingLevel?: string | null
    variant?: 'logos' | 'text' | null
    clients?: LogoClient[] | null
    locale?: string
    className?: string
    backgroundColor?: 'white' | 'muted' | null
}

export function LogoGridBlockComponent({
    badge,
    title,
    headingLevel,
    variant = 'logos',
    clients,
    locale = 'de',
    className,
    backgroundColor = 'white',
}: LogoGridBlockProps) {
    if (!Array.isArray(clients) || clients.length === 0) return null
    const fallbackClientLabel = locale === 'de' ? 'Kunde' : 'Client'
    const bgClass = backgroundColor === 'muted' ? 'bg-muted' : 'bg-background'

    return (
        <section
            className={cn('section-padding-lg section-atmosphere relative', bgClass, className)}
        >
            <div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-0 h-64 min-w-[32rem] -translate-x-1/2 rounded-full bg-copper/8 blur-3xl"
            />
            <div className="container">
                {title && (
                    <SectionHeader
                        overline={badge ?? undefined}
                        title={title}
                        as={(headingLevel as 'h1' | 'h2' | 'h3') || 'h2'}
                        centered
                        size="sm"
                        titleClassName="chrome-text"
                    />
                )}

                {variant === 'text' ? (
                    <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
                        {clients.map((client, index) => {
                            const label =
                                client.name?.trim() || `${fallbackClientLabel} ${index + 1}`
                            const content = (
                                <span className="rounded-full border border-border/70 bg-card/70 px-4 py-2 text-sm font-medium text-foreground/80 backdrop-blur-sm">
                                    {label}
                                </span>
                            )

                            if (client.link) {
                                return (
                                    <ScrollFadeIn key={client.id ?? index} delay={index * 80} animation="fade-up">
                                        <a
                                            href={client.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="rounded-full transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                                            aria-label={`${label} (opens in new tab)`}
                                        >
                                            {content}
                                        </a>
                                    </ScrollFadeIn>
                                )
                            }

                            return <ScrollFadeIn key={client.id ?? index} delay={index * 80} animation="fade-up"><div>{content}</div></ScrollFadeIn>
                        })}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                        {clients.map((client, index) => {
                            const media =
                                client.logo && typeof client.logo === 'object'
                                    ? (client.logo as Media)
                                    : null
                            const name =
                                client.name?.trim() || `${fallbackClientLabel} ${index + 1}`

                            const card = (
                                <div className="flex h-28 items-center justify-center rounded-[var(--block-radius)] border border-border/70 bg-card/70 p-4 backdrop-blur-sm transition-colors hover:border-copper/30">
                                    {media?.url ? (
                                        <Image
                                            src={media.url}
                                            alt={media.alt || name}
                                            width={160}
                                            height={64}
                                            className="max-h-12 w-auto object-contain"
                                        />
                                    ) : (
                                        <span className="text-center text-sm font-semibold text-muted-foreground">
                                            {name}
                                        </span>
                                    )}
                                </div>
                            )

                            if (client.link) {
                                return (
                                    <ScrollFadeIn key={client.id ?? index} delay={index * 80} animation="fade-up">
                                        <a
                                            href={client.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="rounded-[var(--block-radius)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                                            aria-label={`${name} (opens in new tab)`}
                                        >
                                            {card}
                                        </a>
                                    </ScrollFadeIn>
                                )
                            }

                            return <ScrollFadeIn key={client.id ?? index} delay={index * 80} animation="fade-up"><div>{card}</div></ScrollFadeIn>
                        })}
                    </div>
                )}
            </div>
        </section>
    )
}
