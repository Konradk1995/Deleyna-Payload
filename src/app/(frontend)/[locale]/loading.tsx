export default function HomeLoading() {
    return (
        <>
            {/* Hero Skeleton */}
            <section className="padding-section-hero">
                <div className="container">
                    <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
                        <div className="space-y-4">
                            <div className="h-4 w-20 rounded bg-muted animate-pulse" />
                            <div className="h-12 w-3/4 rounded bg-muted animate-pulse" />
                            <div className="h-5 w-full rounded bg-muted animate-pulse" />
                            <div className="h-5 w-2/3 rounded bg-muted animate-pulse" />
                            <div className="flex gap-3 mt-4">
                                <div className="h-12 w-36 rounded-full bg-muted animate-pulse" />
                                <div className="h-12 w-36 rounded-full bg-muted animate-pulse" />
                            </div>
                        </div>
                        <div className="aspect-[4/3] rounded-2xl bg-muted animate-pulse" />
                    </div>
                </div>
            </section>

            {/* Content Blocks Skeleton */}
            <section className="padding-large">
                <div className="container">
                    <div className="mx-auto max-w-2xl space-y-4 text-center mb-10">
                        <div className="h-4 w-20 rounded bg-muted animate-pulse mx-auto" />
                        <div className="h-8 w-64 rounded bg-muted animate-pulse mx-auto" />
                        <div className="h-5 w-3/4 rounded bg-muted animate-pulse mx-auto" />
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="rounded-2xl border border-border p-6 space-y-4">
                                <div className="h-12 w-12 rounded-full bg-muted animate-pulse" />
                                <div className="h-5 w-2/3 rounded bg-muted animate-pulse" />
                                <div className="h-4 w-full rounded bg-muted animate-pulse" />
                                <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}
