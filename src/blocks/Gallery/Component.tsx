import { Media } from '@/components/Media'
import { ScrollFadeIn } from '@/components/ScrollFadeIn'
import { SectionHeader } from '@/components/SectionHeader'
import { cn } from '@/utilities/ui'

type ImageItem = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    image?: any
    caption?: string | null
}

type Props = {
    badge?: string | null
    title?: string | null
    headingLevel?: string | null
    titleHighlight?: string | null
    description?: string | null
    variant?: 'grid' | 'masonry' | 'slider' | 'lightbox' | null
    columns?: '2' | '3' | '4' | null
    images?: ImageItem[] | null
    backgroundColor?: 'white' | 'muted' | null
}

const columnClasses: Record<string, string> = {
    '2': 'grid-cols-1 sm:grid-cols-2',
    '3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    '4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
}

/** sizes so mobile/tablet get right image width (1 col → 100vw, 2 col → 50vw, etc.) */
const columnSizes: Record<string, string> = {
    '2': '(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw',
    '3': '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
    '4': '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw',
}

export function GalleryBlockComponent({
    badge,
    title,
    headingLevel,
    titleHighlight,
    description,
    variant: _variant = 'grid',
    columns = '3',
    images,
    backgroundColor = 'white',
}: Props) {
    if (!images || images.length === 0) return null

    const bgClass = backgroundColor === 'muted' ? 'bg-muted' : 'bg-background'

    return (
        <section className={cn('section-padding-lg section-atmosphere relative', bgClass)}>
            <div className="pointer-events-none absolute -left-24 top-1/3 size-72 rounded-full bg-copper/8 blur-3xl" aria-hidden="true" />
            <div className="pointer-events-none absolute -right-20 bottom-1/4 size-64 rounded-full bg-copper/7 blur-[95px]" aria-hidden="true" />
            <div className="container relative">
                {(badge || title || description) && (
                    <SectionHeader
                        overline={badge ?? undefined}
                        title={title || ''}
                        titleHighlight={titleHighlight ?? undefined}
                        description={description ?? undefined}
                        as={(headingLevel as 'h1' | 'h2' | 'h3') || 'h2'}
                        centered
                        titleClassName="chrome-text"
                    />
                )}
            </div>
            <div className={cn('container relative grid gap-medium', columnClasses[columns || '3'])}>
                {images.map((item, index) => (
                    <ScrollFadeIn key={index} delay={index * 80} animation="fade-up">
                        <figure
                            className="group surface-pill-soft overflow-hidden padding-small transition duration-300 hover:-translate-y-0.5 hover:border-copper/30 hover:shadow-copper-glow"
                        >
                            {item.image && (
                                <Media
                                    resource={item.image}
                                    size={columnSizes[columns || '3']}
                                    imgClassName="w-full h-auto object-cover aspect-[4/3] rounded-[var(--block-radius)] transition-transform duration-500 group-hover:scale-[1.03]"
                                />
                            )}
                            {item.caption && (
                                <figcaption className="font-small-text-regular text-muted-foreground mt-3 px-2 pb-1">
                                    {item.caption}
                                </figcaption>
                            )}
                        </figure>
                    </ScrollFadeIn>
                ))}
            </div>
        </section>
    )
}
