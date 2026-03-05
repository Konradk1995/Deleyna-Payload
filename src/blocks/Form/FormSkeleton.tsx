import React from 'react'
import { cn } from '@/utilities/ui'

interface FormSkeletonProps {
    fieldCount?: number
}

export const FormSkeleton: React.FC<FormSkeletonProps> = ({ fieldCount = 3 }) => {
    return (
        <div className="mx-auto max-w-4xl">
            {/* Intro skeleton */}
            <div className="mb-8 space-y-3 md:mb-10">
                <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
            </div>

            {/* Form container skeleton */}
            <div className="surface-pill rounded-[2rem] border border-border/70 bg-background/85 padding-large shadow-copper-glow backdrop-blur-md">
                <div className="grid grid-cols-12 gap-x-6 gap-y-6">
                    {/* Field skeletons */}
                    {Array.from({ length: fieldCount }).map((_, index) => {
                        // Simulate some 50/50 fields
                        const isHalf = index < fieldCount - 1 && index % 2 === 0
                        const colSpan = isHalf ? 'col-span-12 md:col-span-6' : 'col-span-12'

                        return (
                            <div key={index} className={cn('space-y-2', colSpan)}>
                                {/* Label skeleton */}
                                <div className="h-4 w-24 animate-pulse rounded bg-muted/40" />
                                {/* Input skeleton */}
                                <div className="h-12 w-full animate-pulse rounded-2xl bg-muted/30" />
                            </div>
                        )
                    })}

                    {/* Button skeleton */}
                    <div className="col-span-12 pt-4">
                        <div className="h-14 w-40 animate-pulse rounded-full bg-muted/50" />
                    </div>
                </div>
            </div>
        </div>
    )
}
