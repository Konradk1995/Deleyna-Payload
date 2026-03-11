export default function JobsLoading() {
    return (
        <>
            {/* Breadcrumb Skeleton */}
            <div className="container mt-6 mb-2">
                <div className="h-4 w-32 rounded bg-muted animate-pulse" />
            </div>

            {/* Hero Skeleton */}
            <section className="padding-section-hero-tight">
                <div className="container text-center">
                    <div className="mx-auto space-y-4 max-w-2xl">
                        <div className="h-4 w-12 rounded bg-muted animate-pulse mx-auto" />
                        <div className="h-10 w-56 rounded bg-muted animate-pulse mx-auto" />
                        <div className="h-5 w-3/4 rounded bg-muted animate-pulse mx-auto" />
                    </div>
                </div>
            </section>

            {/* Job Cards Skeleton */}
            <section className="padding-large">
                <div className="container">
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="overflow-hidden rounded-2xl border border-border">
                                <div className="aspect-[16/9] bg-muted animate-pulse" />
                                <div className="p-5 space-y-3">
                                    <div className="h-6 w-20 rounded-full bg-muted animate-pulse" />
                                    <div className="h-5 w-3/4 rounded bg-muted animate-pulse" />
                                    <div className="h-4 w-full rounded bg-muted animate-pulse" />
                                    <div className="space-y-1.5 mt-4">
                                        <div className="h-3 w-24 rounded bg-muted animate-pulse" />
                                        <div className="h-3 w-28 rounded bg-muted animate-pulse" />
                                        <div className="h-3 w-32 rounded bg-muted animate-pulse" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}
