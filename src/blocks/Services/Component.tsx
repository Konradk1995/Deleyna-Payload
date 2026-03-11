import React from 'react'
import {
    Users,
    Calendar,
    Handshake,
    Globe,
    Camera,
    Megaphone,
    Star,
    Heart,
    Lightbulb,
    Rocket,
    Shield,
    Award,
    TrendingUp,
    Briefcase,
    Sparkles,
    Headset,
    Network,
    Palette,
    Music,
    Target,
} from 'lucide-react'
import type { ServicesBlock as ServicesBlockProps } from '@/payload-types'
import { SectionHeader } from '@/components/SectionHeader'
import { ServiceCard } from '@/components/ServiceCard'
import { ScrollFadeIn } from '@/components/ScrollFadeIn'
import { CMSLink } from '@/components/CMSLink'
import { cn } from '@/utilities/ui'

const iconMap = {
    users: Users,
    calendar: Calendar,
    handshake: Handshake,
    globe: Globe,
    camera: Camera,
    megaphone: Megaphone,
    star: Star,
    heart: Heart,
    lightbulb: Lightbulb,
    rocket: Rocket,
    shield: Shield,
    award: Award,
    'trending-up': TrendingUp,
    briefcase: Briefcase,
    sparkles: Sparkles,
    headset: Headset,
    network: Network,
    palette: Palette,
    music: Music,
    target: Target,
}

export const ServicesBlockComponent: React.FC<
    ServicesBlockProps & { id?: string; className?: string }
> = ({ badge, title, description, headingLevel, services, cta, backgroundColor = 'white', className }) => {
    if (!title || !services?.length) return null

    const bgClass = backgroundColor === 'muted' ? 'bg-muted' : 'bg-background'

    return (
        <section className={cn('section-padding-lg section-atmosphere relative', bgClass, className)}>
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
                        overline={badge ?? undefined}
                        title={title}
                        description={description ?? undefined}
                        as={(headingLevel as 'h1' | 'h2' | 'h3') || 'h2'}
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
                    {cta && typeof cta === 'object' && cta.label && (
                        <div className="mt-10 text-center">
                            <CMSLink {...cta} />
                        </div>
                    )}
                </ScrollFadeIn>
            </div>
        </section>
    )
}
