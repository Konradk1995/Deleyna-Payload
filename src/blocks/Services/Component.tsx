import React from 'react'
import { Users, Calendar, Handshake, Globe } from 'lucide-react'
import type { ServicesBlock as ServicesBlockProps } from '@/payload-types'
import { SectionHeader } from '@/components/SectionHeader'
import { ServiceCard } from '@/components/ServiceCard'
import { ScrollFadeIn } from '@/components/ScrollFadeIn'
import { cn } from '@/utilities/ui'

const iconMap = {
    users: Users,
    calendar: Calendar,
    handshake: Handshake,
    globe: Globe,
}

export const ServicesBlockComponent: React.FC<
    ServicesBlockProps & { id?: string; className?: string }
> = ({ overline, title, description, services, className }) => {
    if (!title || !services?.length) return null

    return (
        <section className={cn('padding-large section-atmosphere relative', className)}>
            {/* Animated Background Blobs */}
            <div
                aria-hidden
                className="pointer-events-none absolute -left-20 top-1/2 min-h-screen min-w-[30rem] -translate-y-1/2 rounded-full bg-copper/5 blur-3xl animate-blob"
            />
            <div
                aria-hidden
                className="pointer-events-none absolute -right-20 top-1/4 min-h-96 min-w-96 rounded-full bg-primary/5 blur-3xl animate-blob animation-delay-2000"
            />

            <div className="container relative z-10">
                <ScrollFadeIn animation="fade-up">
                    <SectionHeader
                        overline={overline ?? undefined}
                        title={title}
                        description={description ?? undefined}
                        titleClassName="chrome-text"
                        size="lg"
                    />
                    <div className="mx-auto grid max-w-7xl gap-large md:grid-cols-2">
                        {services.map((service, index) => {
                            const Icon = service.icon
                                ? iconMap[service.icon as keyof typeof iconMap]
                                : Users
                            return (
                                <ScrollFadeIn key={index} delay={100 + index * 100}>
                                    <ServiceCard
                                        icon={Icon ? <Icon className="h-full w-full" /> : undefined}
                                        title={service.title ?? ''}
                                        description={service.description ?? ''}
                                    />
                                </ScrollFadeIn>
                            )
                        })}
                    </div>
                </ScrollFadeIn>
            </div>
        </section>
    )
}
