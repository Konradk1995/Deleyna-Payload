export default function BlogLoading() {
    return (
        <>
            {/* Hero Skeleton */}
            <section className="padding-section-hero">
                <div className="container text-center">
                    <div className="mx-auto space-y-4 max-w-2xl">
                        <div className="h-4 w-16 rounded bg-muted animate-pulse mx-auto" />
                        <div className="h-10 w-48 rounded bg-muted animate-pulse mx-auto" />
                        <div className="h-5 w-3/4 rounded bg-muted animate-pulse mx-auto" />
                    </div>
                </div>
            </section>

            {/* Categories Skeleton */}
            <section className="padding-large">
                <div className="container">
                    <div className="flex flex-wrap gap-2 justify-center">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="h-10 w-20 rounded-full bg-muted animate-pulse" />
                        ))}
                    </div>
                </div>
            </section>

            {/* Posts Grid Skeleton */}
            <section className="padding-large">
                <div className="container">
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="overflow-hidden rounded-2xl border border-border">
                                <div className="aspect-[16/9] bg-muted animate-pulse" />
                                <div className="padding-large space-y-3">
                                    <div className="h-3 w-16 rounded bg-muted animate-pulse" />
                                    <div className="h-5 w-3/4 rounded bg-muted animate-pulse" />
                                    <div className="h-4 w-full rounded bg-muted animate-pulse" />
                                    <div className="h-4 w-2/3 rounded bg-muted animate-pulse" />
                                    <div className="h-3 w-24 rounded bg-muted animate-pulse" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}
