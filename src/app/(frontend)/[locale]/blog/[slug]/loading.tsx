export default function BlogPostLoading() {
    return (
        <article>
            {/* Breadcrumb Skeleton */}
            <div className="container mt-6 mb-2">
                <div className="h-4 w-48 rounded bg-muted animate-pulse" />
            </div>

            {/* Hero Skeleton */}
            <section className="padding-section-hero-tight">
                <div className="container max-w-6xl">
                    {/* Categories */}
                    <div className="flex gap-2 mb-4">
                        <div className="h-5 w-16 rounded bg-muted animate-pulse" />
                        <div className="h-5 w-20 rounded bg-muted animate-pulse" />
                    </div>

                    {/* Title */}
                    <div className="h-12 w-3/4 rounded bg-muted animate-pulse mb-6" />

                    {/* Meta */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-4 w-28 rounded bg-muted animate-pulse" />
                        <div className="h-4 w-24 rounded bg-muted animate-pulse" />
                    </div>

                    {/* Featured Image */}
                    <div className="aspect-[16/9] rounded-2xl bg-muted animate-pulse mb-10" />

                    {/* Content */}
                    <div className="space-y-4">
                        <div className="h-4 w-full rounded bg-muted animate-pulse" />
                        <div className="h-4 w-5/6 rounded bg-muted animate-pulse" />
                        <div className="h-4 w-full rounded bg-muted animate-pulse" />
                        <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
                        <div className="h-4 w-full rounded bg-muted animate-pulse" />
                        <div className="h-4 w-2/3 rounded bg-muted animate-pulse" />
                        <div className="h-4 w-full rounded bg-muted animate-pulse" />
                        <div className="h-4 w-4/5 rounded bg-muted animate-pulse" />
                    </div>
                </div>
            </section>

            {/* Related Posts Skeleton */}
            <section className="section-padding bg-muted/30 border-t border-border">
                <div className="container max-w-6xl">
                    <div className="h-7 w-40 rounded bg-muted animate-pulse mb-8" />
                    <div className="grid gap-6 sm:grid-cols-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="overflow-hidden rounded-2xl border border-border">
                                <div className="aspect-[16/9] bg-muted animate-pulse" />
                                <div className="p-4">
                                    <div className="h-5 w-3/4 rounded bg-muted animate-pulse" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </article>
    )
}
