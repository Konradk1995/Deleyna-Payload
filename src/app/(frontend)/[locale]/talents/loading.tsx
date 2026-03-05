export default function TalentsLoading() {
    return (
        <>
            {/* Hero Skeleton */}
            <section className="padding-section-hero">
                <div className="container">
                    <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
                        <div className="space-y-4">
                            <div className="h-4 w-24 rounded bg-muted animate-pulse" />
                            <div className="h-10 w-3/4 rounded bg-muted animate-pulse" />
                            <div className="h-5 w-full rounded bg-muted animate-pulse" />
                            <div className="h-5 w-2/3 rounded bg-muted animate-pulse" />
                        </div>
                        <div className="aspect-[4/3] rounded-2xl bg-muted animate-pulse" />
                    </div>
                </div>
            </section>

            {/* Grid Skeleton */}
            <section className="padding-large">
                <div className="container">
                    {/* Filter Skeleton */}
                    <div className="flex gap-3 mb-8">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="h-10 w-24 rounded-full bg-muted animate-pulse" />
                        ))}
                    </div>
                    {/* Cards Skeleton */}
                    <div className="grid gap-medium sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="overflow-hidden rounded-2xl border border-border">
                                <div className="aspect-[3/4] bg-muted animate-pulse" />
                                <div className="p-4 space-y-2">
                                    <div className="h-5 w-2/3 rounded bg-muted animate-pulse" />
                                    <div className="h-4 w-1/3 rounded bg-muted animate-pulse" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}
