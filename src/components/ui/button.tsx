import { cn } from '@/utilities/ui'
import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

/**
 * Wiederverwendbare Button-Komponente (BLOCK-STANDARDS).
 * Varianten: primary, secondary, accent, outline, ghost, link, muted, destructive.
 * Größen: xs, sm, default, lg, icon, clear. asChild=true rendert als Link/Slot.
 */
const buttonVariants = cva(
    'inline-flex items-center justify-center whitespace-nowrap rounded-full font-semibold ring-offset-background transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    {
        defaultVariants: {
            size: 'default',
            variant: 'primary',
        },
        variants: {
            size: {
                clear: '',
                default: 'h-11 px-7 text-sm',
                sm: 'h-10 px-6 text-sm',
                lg: 'h-12 px-8 text-base',
                xs: 'h-8 px-4 text-xs',
                icon: 'h-10 w-10 p-0',
            },
            variant: {
                default:
                    'bg-foreground text-background hover:bg-foreground/85 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-copper/20 active:translate-y-0 active:scale-95',
                primary:
                    'bg-foreground text-background hover:bg-foreground/85 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-copper/20 active:translate-y-0 active:scale-95',
                secondary:
                    'border border-border/70 bg-card text-card-foreground hover:bg-muted hover:-translate-y-0.5 hover:shadow-lg hover:shadow-copper/15 active:translate-y-0 active:scale-95',
                outline:
                    'border border-border/40 bg-background/75 text-foreground backdrop-blur-[20px] hover:bg-foreground/6 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-copper/15 active:translate-y-0 active:scale-95',
                ghost: 'bg-transparent hover:bg-foreground/8 hover:text-foreground',
                link: 'text-foreground underline-offset-4 hover:underline',
                destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
                muted: 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground',
                accent: 'bg-accent text-accent-foreground hover:bg-accent-hover',
            },
        },
    },
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    asChild?: boolean
    ref?: React.Ref<HTMLButtonElement>
}

const Button: React.FC<ButtonProps> = ({
    asChild = false,
    className,
    size,
    variant,
    ref,
    ...props
}) => {
    const Comp = asChild ? Slot : 'button'
    return (
        <Comp className={cn(buttonVariants({ className, size, variant }))} ref={ref} {...props} />
    )
}

export { Button, buttonVariants }
