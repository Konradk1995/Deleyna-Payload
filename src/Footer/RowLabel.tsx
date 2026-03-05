'use client'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

type RowWithLabel = { link?: { label?: string }; label?: string }

export const RowLabel: React.FC<RowLabelProps> = () => {
    const data = useRowLabel<RowWithLabel>()
    const label =
        (data?.data?.link?.label ?? data?.data?.label) ||
        `Row ${data?.rowNumber !== undefined ? data.rowNumber + 1 : ''}`

    return <div>{label}</div>
}
