import * as React from 'react'
import { cn } from '@/utilities/ui'

export const Width: React.FC<{
    children: React.ReactNode
    className?: string
    width?: number | string
}> = ({ children, className, width: _width }) => {
    return <div className={cn('w-full', className)}>{children}</div>
}
