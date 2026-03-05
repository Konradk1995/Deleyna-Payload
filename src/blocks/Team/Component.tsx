import React from 'react'
import Image from 'next/image'
import type { TeamBlock as TeamBlockProps } from '@/payload-types'
import type { Media } from '@/payload-types'
import { SectionHeader } from '@/components/SectionHeader'
import { cn } from '@/utilities/ui'

export const TeamBlockComponent: React.FC<TeamBlockProps & { id?: string; className?: string }> = ({
    overline,
    title,
    members,
    className,
}) => {
    if (!title || !members?.length) return null

    return (
        <section
            className={cn('section-padding-lg section-atmosphere relative bg-muted/30', className)}
        >
            <div
                aria-hidden
                className="pointer-events-none absolute -left-24 top-1/3 h-80 w-80 rounded-full bg-copper/10 blur-[110px]"
            />
            <div
                aria-hidden
                className="pointer-events-none absolute -right-20 bottom-1/4 h-72 w-72 rounded-full bg-copper/8 blur-[100px]"
            />
            <div className="container">
                <SectionHeader
                    overline={overline ?? undefined}
                    title={title}
                    titleClassName="chrome-text"
                />
                <ul className="grid list-none block-grid-gap sm:grid-cols-2 lg:grid-cols-4">
                    {members.map((member, index) => {
                        const image = member.image as Media | null | undefined
                        const initials = (member.name || '')
                            .split(' ')
                            .filter(Boolean)
                            .slice(0, 2)
                            .map((n) => n[0]?.toUpperCase())
                            .join('')
                        return (
                            <li key={index} className="list-none">
                                <article className="group flex h-full flex-col rounded-2xl border border-border/70 glass-morphism padding-large transition duration-300 hover:-translate-y-0.5 hover:border-copper/40 hover:bg-foreground/5 hover:shadow-copper-glow">
                                    {image && typeof image === 'object' && image.url && (
                                        <div className="relative mb-4 aspect-square overflow-hidden rounded-2xl bg-muted">
                                            <Image
                                                src={image.url}
                                                alt={image.alt ?? member.name ?? ''}
                                                fill
                                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                            />
                                        </div>
                                    )}
                                    {(!image || typeof image !== 'object' || !image.url) && (
                                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-copper/20 to-accent/20 text-lg font-bold">
                                            {initials || 'T'}
                                        </div>
                                    )}
                                    {member.name && (
                                        <h3 className="font-heading-5-bold text-foreground">
                                            {member.name}
                                        </h3>
                                    )}
                                    {member.role && (
                                        <p className="mt-1 font-small-text-bold text-copper">
                                            {member.role}
                                        </p>
                                    )}
                                    {member.bio && (
                                        <p className="mt-3 font-small-text-regular leading-relaxed text-muted-foreground">
                                            {member.bio}
                                        </p>
                                    )}
                                </article>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </section>
    )
}
