import { cn } from '@/utilities/ui'
import React from 'react'

interface Measurement {
    label: string
    value: string | null | undefined
}

interface MeasurementsBoxProps {
    measurements: Measurement[]
    className?: string
}

/**
 * MeasurementsBox - Box mit Körpermaßen für Sedcard
 */
export function MeasurementsBox({ measurements, className }: MeasurementsBoxProps) {
    // Filter out empty measurements
    const validMeasurements = measurements.filter((m) => m.value)

    if (validMeasurements.length === 0) return null

    return (
        <div className={cn('surface-pill p-6', className)}>
            <h3 className="font-subtext-semibold mb-4 uppercase tracking-wider text-copper">
                Measurements
            </h3>
            <div className="grid grid-cols-3 gap-4">
                {validMeasurements.map((measurement, index) => (
                    <div key={index}>
                        <div className="font-subtext-semibold mb-1 uppercase tracking-wider text-muted-foreground">
                            {measurement.label}
                        </div>
                        <div className="font-normal-text-bold text-foreground">
                            {measurement.value}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
