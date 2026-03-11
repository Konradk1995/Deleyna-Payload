export default function DynamicPageLoading() {
    return (
        <>
            {/* Breadcrumb Skeleton */}
            <div className="container mt-6 mb-2">
                <div className="h-4 w-36 rounded bg-muted animate-pulse" />
            </div>

            {/* Hero Skeleton */}
            <section className="padding-section-hero">
                <div className="container">
                    <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
                        <div className="space-y-4">
                            <div className="h-4 w-20 rounded bg-muted animate-pulse" />
                            <div className="h-10 w-3/4 rounded bg-muted animate-pulse" />
                            <div className="h-5 w-full rounded bg-muted animate-pulse" />
                            <div className="h-5 w-2/3 rounded bg-muted animate-pulse" />
                            <div className="h-12 w-40 rounded-full bg-muted animate-pulse mt-4" />
                        </div>
                        <div className="aspect-[4/3] rounded-2xl bg-muted animate-pulse" />
                    </div>
                </div>
            </section>

            {/* Content Blocks Skeleton */}
            <section className="padding-large">
                <div className="container">
                    <div className="space-y-4 max-w-3xl mx-auto">
                        <div className="h-4 w-full rounded bg-muted animate-pulse" />
                        <div className="h-4 w-5/6 rounded bg-muted animate-pulse" />
                        <div className="h-4 w-full rounded bg-muted animate-pulse" />
                        <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
                        <div className="h-4 w-full rounded bg-muted animate-pulse" />
                        <div className="h-4 w-2/3 rounded bg-muted animate-pulse" />
                    </div>
                </div>
            </section>
        </>
    )
}
