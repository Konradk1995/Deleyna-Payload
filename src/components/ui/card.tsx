import { cn } from '@/utilities/ui'
import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

const cardVariants = cva(
    'rounded-[1.5rem] border bg-card text-card-foreground shadow-[0_1px_2px_rgb(0_0_0/0.04)] transition duration-300',
    {
        defaultVariants: { variant: 'default' },
        variants: {
            variant: {
                default: 'border-border',
                elevated:
                    'border-border shadow-[0_10px_30px_rgb(15_23_42/0.08)] hover:shadow-[0_14px_34px_rgb(15_23_42/0.12)]',
                bordered: 'border-2 border-border',
                interactive:
                    'border-border hover:border-accent/30 hover:shadow-md hover:-translate-y-0.5 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
                glass: 'border-border/40 bg-card/78 backdrop-blur-md glass-morphism',
                'interactive-glass':
                    'border-border/40 bg-card/78 backdrop-blur-md glass-morphism hover:border-copper/30 hover:shadow-copper-glow hover:bg-foreground/[0.02] hover:-translate-y-0.5 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
            },
        },
    },
)

export interface CardProps
    extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {
    asChild?: boolean
    ref?: React.Ref<HTMLDivElement>
}

const Card: React.FC<CardProps> = ({ asChild = false, className, variant, ref, ...props }) => {
    const Comp = asChild ? Slot : 'div'
    return <Comp className={cn(cardVariants({ variant }), className)} ref={ref} {...props} />
}

const CardHeader: React.FC<
    { ref?: React.Ref<HTMLDivElement> } & React.HTMLAttributes<HTMLDivElement>
> = ({ className, ref, ...props }) => (
    <div className={cn('flex flex-col space-y-1.5 p-7', className)} ref={ref} {...props} />
)

const CardTitle: React.FC<
    { ref?: React.Ref<HTMLHeadingElement> } & React.HTMLAttributes<HTMLHeadingElement>
> = ({ className, ref, ...props }) => (
    <h3
        className={cn('font-heading-5-bold leading-none tracking-tight text-foreground', className)}
        ref={ref}
        {...props}
    />
)

const CardDescription: React.FC<
    { ref?: React.Ref<HTMLParagraphElement> } & React.HTMLAttributes<HTMLParagraphElement>
> = ({ className, ref, ...props }) => (
    <p
        className={cn('font-small-text-regular text-muted-foreground', className)}
        ref={ref}
        {...props}
    />
)

const CardContent: React.FC<
    { ref?: React.Ref<HTMLDivElement> } & React.HTMLAttributes<HTMLDivElement>
> = ({ className, ref, ...props }) => (
    <div className={cn('p-7 pt-0', className)} ref={ref} {...props} />
)

const CardFooter: React.FC<
    { ref?: React.Ref<HTMLDivElement> } & React.HTMLAttributes<HTMLDivElement>
> = ({ className, ref, ...props }) => (
    <div className={cn('flex items-center p-7 pt-0', className)} ref={ref} {...props} />
)

/** Optional image area above card content. Use aspect ratio classes (e.g. aspect-video, aspect-[3/4]). */
const CardImage: React.FC<
    { ref?: React.Ref<HTMLDivElement> } & React.HTMLAttributes<HTMLDivElement>
> = ({ className, ref, ...props }) => (
    <div
        className={cn('overflow-hidden rounded-t-[1.5rem] bg-muted', className)}
        ref={ref}
        {...props}
    />
)

/** Small badge/overline above title (e.g. "Service", "Feature"). */
const CardBadge: React.FC<
    { ref?: React.Ref<HTMLSpanElement> } & React.HTMLAttributes<HTMLSpanElement>
> = ({ className, ref, ...props }) => (
    <span
        className={cn(
            'font-subtext-semibold uppercase tracking-wider text-muted-foreground',
            className,
        )}
        ref={ref}
        {...props}
    />
)

export {
    Card,
    CardBadge,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardImage,
    CardTitle,
    cardVariants,
}
