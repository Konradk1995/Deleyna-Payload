export default function TalentDetailLoading() {
    return (
        <section className="padding-large">
            <div className="container">
                {/* Back link skeleton */}
                <div className="h-4 w-24 rounded bg-muted animate-pulse mb-8" />

                <div className="grid gap-10 lg:grid-cols-2">
                    {/* Image skeleton */}
                    <div className="aspect-[3/4] rounded-2xl bg-muted animate-pulse" />

                    {/* Info skeleton */}
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <div className="h-4 w-20 rounded bg-muted animate-pulse" />
                            <div className="h-10 w-3/4 rounded bg-muted animate-pulse" />
                        </div>

                        {/* Stats skeleton */}
                        <div className="grid grid-cols-3 gap-4">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="h-3 w-12 rounded bg-muted animate-pulse" />
                                    <div className="h-5 w-16 rounded bg-muted animate-pulse" />
                                </div>
                            ))}
                        </div>

                        {/* Skills skeleton */}
                        <div className="space-y-3">
                            <div className="h-5 w-16 rounded bg-muted animate-pulse" />
                            <div className="flex flex-wrap gap-2">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <div key={i} className="h-8 w-20 rounded-full bg-muted animate-pulse" />
                                ))}
                            </div>
                        </div>

                        {/* Buttons skeleton */}
                        <div className="flex gap-3">
                            <div className="h-12 w-40 rounded-full bg-muted animate-pulse" />
                            <div className="h-12 w-40 rounded-full bg-muted animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
