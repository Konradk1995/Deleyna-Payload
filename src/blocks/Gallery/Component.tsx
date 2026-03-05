import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

type ImageItem = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    image?: any
    caption?: string | null
}

type Props = {
    variant?: 'grid' | 'masonry' | 'slider' | 'lightbox' | null
    columns?: '2' | '3' | '4' | null
    images?: ImageItem[] | null
}

const columnClasses: Record<string, string> = {
    '2': 'grid-cols-1 sm:grid-cols-2',
    '3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    '4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
}

export function GalleryBlockComponent({
    variant: _variant = 'grid',
    columns = '3',
    images,
}: Props) {
    if (!images || images.length === 0) return null

    return (
        <section className="padding-large section-atmosphere relative">
            <div className="pointer-events-none absolute -left-24 top-1/3 size-72 rounded-full bg-copper/8 blur-3xl" />
            <div className="pointer-events-none absolute -right-20 bottom-1/4 size-64 rounded-full bg-copper/7 blur-[95px]" />
            <div className={cn('container relative grid gap-medium', columnClasses[columns || '3'])}>
                {images.map((item, index) => (
                    <figure
                        key={index}
                        className="group surface-pill-soft overflow-hidden border border-border/70 padding-small transition duration-300 hover:-translate-y-0.5 hover:border-copper/30 hover:shadow-copper-glow"
                    >
                        {item.image && (
                            <Media
                                resource={item.image}
                                imgClassName="w-full h-auto object-cover aspect-[4/3] rounded-[1rem] transition-transform duration-500 group-hover:scale-[1.03]"
                            />
                        )}
                        {item.caption && (
                            <figcaption className="font-small-text-regular text-muted-foreground mt-3 px-2 pb-1">
                                {item.caption}
                            </figcaption>
                        )}
                    </figure>
                ))}
            </div>
        </section>
    )
}
