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
    const hasBlog = item.mediaDisplay === 'latestBlog' && item.latestBlog && item.latestBlog.path

    if (variant === 'desktop') {
        return (
            <div
                className={cn(
                    'rounded-2xl bg-background/95 p-5 text-foreground shadow-xl backdrop-blur-xl',
                    hasBlog ? 'min-w-[340px]' : 'min-w-[220px]',
                )}
            >
                {/* Section label */}
                {item.labelLink ? (
                    <CMSLink
                        {...item.labelLink}
                        appearance="inline"
                        className="font-subtext-semibold text-copper !no-underline hover:opacity-80 transition-opacity inline-flex items-center gap-2"
                    >
                        <span className="h-px w-5 bg-copper/50" aria-hidden />
                        {item.label}
                    </CMSLink>
                ) : (
                    <div className="font-subtext-semibold text-copper inline-flex items-center gap-2">
                        <span className="h-px w-5 bg-copper/50" aria-hidden />
                        {item.label}
                    </div>
                )}

                <div
                    className={cn(
                        'mt-4 flex',
                        hasBlog
                            ? 'flex-col gap-4'
                            : hasMedia
                              ? 'items-start gap-4'
                              : 'flex-col gap-1',
                    )}
                >
                    <NavCardMedia item={item} onClose={onClose} variant="desktop" />
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
            className="nav-card select-none relative flex h-full w-full max-w-full min-w-0 flex-col gap-3 overflow-hidden rounded-xl bg-background/90 p-[12px_16px] text-foreground backdrop-blur-lg"
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
                <NavCardMedia item={item} onClose={onClose} variant="mobile" />
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
