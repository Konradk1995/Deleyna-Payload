export default function JobDetailLoading() {
    return (
        <article>
            {/* Breadcrumb Skeleton */}
            <div className="container mt-6 mb-2">
                <div className="h-4 w-40 rounded bg-muted animate-pulse" />
            </div>

            {/* Hero Skeleton */}
            <section className="padding-section-hero-tight">
                <div className="container max-w-4xl">
                    {/* Badges */}
                    <div className="flex gap-2 mb-4">
                        <div className="h-6 w-20 rounded-full bg-muted animate-pulse" />
                    </div>

                    {/* Title */}
                    <div className="h-12 w-3/4 rounded bg-muted animate-pulse mb-6" />

                    {/* Meta */}
                    <div className="flex flex-wrap gap-4 mb-8">
                        <div className="h-4 w-28 rounded bg-muted animate-pulse" />
                        <div className="h-4 w-24 rounded bg-muted animate-pulse" />
                        <div className="h-4 w-32 rounded bg-muted animate-pulse" />
                    </div>

                    {/* Featured Image */}
                    <div className="aspect-[16/9] rounded-2xl bg-muted animate-pulse mb-10" />

                    {/* Content */}
                    <div className="space-y-4 mb-10">
                        <div className="h-4 w-full rounded bg-muted animate-pulse" />
                        <div className="h-4 w-5/6 rounded bg-muted animate-pulse" />
                        <div className="h-4 w-full rounded bg-muted animate-pulse" />
                        <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
                        <div className="h-4 w-full rounded bg-muted animate-pulse" />
                        <div className="h-4 w-2/3 rounded bg-muted animate-pulse" />
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex gap-4 mt-10">
                        <div className="h-12 w-40 rounded-full bg-muted animate-pulse" />
                        <div className="h-12 w-40 rounded-full bg-muted animate-pulse" />
                    </div>
                </div>
            </section>
        </article>
    )
}
