import { Link } from '@/i18n/navigation'
import { ChevronRight } from 'lucide-react'

export interface BreadcrumbItem {
    label: string
    href?: '/' | '/blog' | '/talents' | '/jobs'
}

interface BreadcrumbProps {
    items: BreadcrumbItem[]
    className?: string
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
    if (items.length === 0) return null

    return (
        <nav
            aria-label="Breadcrumb"
            className={className}
        >
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1
                    return (
                        <li key={index} className="flex items-center gap-1.5">
                            {index > 0 && (
                                <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" aria-hidden="true" />
                            )}
                            {isLast || !item.href ? (
                                <span className={isLast ? 'text-foreground font-medium truncate max-w-[200px] sm:max-w-xs' : undefined}>
                                    {item.label}
                                </span>
                            ) : (
                                <Link
                                    href={item.href}
                                    className="transition-colors hover:text-copper"
                                >
                                    {item.label}
                                </Link>
                            )}
                        </li>
                    )
                })}
            </ol>
        </nav>
    )
}
