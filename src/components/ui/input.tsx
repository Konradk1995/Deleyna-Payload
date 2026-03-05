import { cn } from '@/utilities/ui'
import * as React from 'react'

const Input: React.FC<
    {
        ref?: React.Ref<HTMLInputElement>
    } & React.InputHTMLAttributes<HTMLInputElement>
> = ({ type, className, ref, ...props }) => {
    return (
        <input
            className={cn(
                'flex w-full px-5 py-4 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200',
                className,
            )}
            ref={ref}
            type={type}
            {...props}
        />
    )
}

export { Input }
