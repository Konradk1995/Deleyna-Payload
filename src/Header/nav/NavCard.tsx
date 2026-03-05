import React from 'react'
import { cn } from '@/utilities/ui'
import { CMSLink } from '@/components/CMSLink'
import { NavCardMedia } from './NavCardMedia'
import { NavCardLinks } from './NavCardLinks'
import type { CardNavItem } from './types'

interface NavCardProps {
    item: CardNavItem
    variant: 'mobile' | 'desktop'
    onClose?: () => void
}

export const NavCard: React.FC<NavCardProps> = ({ item, variant, onClose }) => {
    const hasMedia =
        (item.mediaDisplay === 'latestBlog' && item.latestBlog && item.latestBlog.path) ||
        item.image

    if (variant === 'desktop') {
        return (
            <div
                className="rounded-2xl border border-border/30 bg-background/90 p-4 text-foreground shadow-xl backdrop-blur-lg"
            >
                {item.labelLink ? (
                    <CMSLink
                        {...item.labelLink}
                        appearance="inline"
                        className="text-xs font-semibold text-muted-foreground !no-underline hover:text-foreground transition-colors"
                    >
                        {item.label}
                    </CMSLink>
                ) : (
                    <div className="text-xs font-semibold text-muted-foreground">
                        {item.label}
                    </div>
                )}
                <div
                    className={cn(
                        'mt-3 flex items-start',
                        hasMedia ? 'gap-3' : 'flex-col gap-2',
                    )}
                >
                    <NavCardMedia item={item} onClose={onClose} />
                    <NavCardLinks
                        links={item.links}
                        onClose={onClose}
                        size="sm"
                        itemLabel={item.label}
                    />
                </div>
            </div>
        )
    }

    // Mobile variant — flex-col so image is ABOVE links
    return (
        <div
            className="nav-card select-none relative flex w-full max-w-full min-w-0 flex-col gap-3 overflow-hidden rounded-xl border border-border/30 bg-background/90 p-[12px_16px] text-foreground backdrop-blur-lg"
        >
            {item.labelLink ? (
                    <CMSLink
                        {...item.labelLink}
                        appearance="inline"
                        className="nav-card-label nav-link-text font-medium text-current !no-underline hover:opacity-80 transition-opacity"
                        onClick={onClose}
                    >
                    {item.label}
                </CMSLink>
            ) : (
                <div className="nav-card-label nav-link-text font-medium text-current">
                    {item.label}
                </div>
            )}
            {/* Mobile: flex-col (image above links), sm+: flex-row (side by side) */}
            <div
                className={cn(
                    'nav-card-body flex w-full min-w-0',
                    hasMedia
                        ? 'flex-col gap-3 sm:flex-row sm:items-start'
                        : 'flex-col gap-2',
                )}
            >
                <NavCardMedia item={item} onClose={onClose} />
                <NavCardLinks
                    links={item.links}
                    onClose={onClose}
                    size="md"
                    itemLabel={item.label}
                />
            </div>
        </div>
    )
}
