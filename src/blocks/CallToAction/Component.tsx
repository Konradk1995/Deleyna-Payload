import { CMSLink } from '@/components/CMSLink'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

type Props = {
    variant?: 'default' | 'background' | 'split' | 'banner' | null
    headline?: string | null
    text?: string | null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    media?: any
    button?: {
        type?: 'reference' | 'custom' | null
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        reference?: any
        url?: string | null
        label?: string | null
        newTab?: boolean | null
        appearance?: string | null
    } | null
}

export function CallToActionBlockComponent({
    variant = 'default',
    headline,
    text,
    media,
    button,
}: Props) {
    const isBackground = variant === 'background'
    const isSplit = variant === 'split'
    const isBanner = variant === 'banner'
    const hasBackgroundMedia = isBackground && Boolean(media)

    if (isSplit) {
        return (
            <section className="section-padding-lg section-atmosphere relative">
                <div className="pointer-events-none absolute -left-20 top-1/3 size-72 rounded-full bg-copper/8 blur-3xl" aria-hidden="true" />
                <div className="pointer-events-none absolute -right-24 bottom-1/4 size-72 rounded-full bg-copper/8 blur-3xl" aria-hidden="true" />
                <div className="container relative">
                    <div className="surface-pill overflow-hidden border border-border/70 bg-muted/30 shadow-copper-glow">
                        <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
                            <div className="relative aspect-video lg:aspect-square overflow-hidden">
                                <Media
                                    resource={media}
                                    fill
                                    className="object-cover w-full h-full"
                                    imgClassName="object-cover w-full h-full transition-transform duration-700 hover:scale-105"
                                />
                            </div>
                            <div className="padding-large text-left">
                                {headline && (
                                <h2 className="mb-4 font-display-tight font-heading-3-bold tracking-tight text-balance text-foreground hyphens-auto overflow-wrap-anywhere">
                                        {headline}
                                    </h2>
                                )}
                                {text && (
                                    <p className="mb-8 font-normal-text-regular hyphens-auto text-muted-foreground">
                                        {text}
                                    </p>
                                )}
                                {button?.label && <CMSLink {...button} appearance="primary-pill" />}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section
            className={cn(
                'section-padding-lg relative',
                'section-atmosphere',
                hasBackgroundMedia && 'text-on-media',
                isBanner && 'bg-primary text-primary-foreground',
            )}
        >
            {!isBanner && (
                <>
                    <div className="pointer-events-none absolute -left-20 top-1/3 size-64 rounded-full bg-copper/8 blur-3xl" aria-hidden="true" />
                    <div className="pointer-events-none absolute -right-20 bottom-1/4 size-64 rounded-full bg-copper/7 blur-3xl" aria-hidden="true" />
                </>
            )}
            {hasBackgroundMedia && (
                <>
                    <Media
                        resource={media}
                        className="absolute inset-0 overflow-hidden"
                        imgClassName="object-cover w-full h-full"
                        fill
                    />
                    <div className="absolute inset-0 hero-overlay" aria-hidden="true" />
                </>
            )}

            <div className="container relative z-10">
                <div
                    className={cn(
                        isBanner
                            ? 'py-4'
                        : hasBackgroundMedia
                          ? 'surface-pill border border-on-media/25 bg-media-overlay/35 text-center shadow-copper-glow backdrop-blur-sm padding-large'
                          : 'surface-pill border border-border/70 bg-card/80 text-center shadow-copper-glow padding-large',
                    )}
                >
                    {headline && (
                                <h2
                                    className={cn(
                                        'font-display-tight tracking-tight text-balance hyphens-auto overflow-wrap-anywhere',
                                        isBanner && 'font-heading-5-bold text-primary-foreground',
                                        !isBanner && 'mb-4 font-heading-3-bold text-balance',
                                        !isBanner && !hasBackgroundMedia && 'text-foreground',
                                        hasBackgroundMedia &&
                                            'text-on-media text-shadow-strong',
                                    )}
                                >
                            {headline}
                        </h2>
                    )}
                                {text && !isBanner && (
                                    <p
                                        className={cn(
                                            'mx-auto mb-8 max-w-3xl font-normal-text-regular hyphens-auto',
                                            hasBackgroundMedia
                                                ? 'text-on-media-muted text-shadow-soft'
                                                : 'text-muted-foreground',
                                        )}
                                    >
                                        {text}
                                    </p>
                                )}
                    {button?.label && (
                        <CMSLink
                            {...button}
                            appearance="primary-pill"
                            className={cn(
                                hasBackgroundMedia &&
                                    'border border-copper/60 bg-copper text-background hover:border-copper hover:bg-copper/90 hover:text-background shadow-copper-glow',
                            )}
                        />
                    )}
                </div>
            </div>
        </section>
    )
}
