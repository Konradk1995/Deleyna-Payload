import { cn } from '@/utilities/ui'
import * as React from 'react'

const Textarea: React.FC<
    {
        ref?: React.Ref<HTMLTextAreaElement>
    } & React.TextareaHTMLAttributes<HTMLTextAreaElement>
> = ({ className, ref, ...props }) => {
    return (
        <textarea
            className={cn(
                'flex min-h-[120px] w-full px-5 py-4 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200 resize-none',
                className,
            )}
            ref={ref}
            {...props}
        />
    )
}

export { Textarea }
