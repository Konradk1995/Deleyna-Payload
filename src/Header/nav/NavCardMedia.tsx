import React from 'react'
import { Link } from '@/i18n/navigation'
import { toHref } from '@/utilities/typedHref'
import { Media } from '@/components/Media'
import type { CardNavItem } from './types'

interface NavCardMediaProps {
    item: CardNavItem
    onClose?: () => void
    variant?: 'mobile' | 'desktop'
}

export const NavCardMedia: React.FC<NavCardMediaProps> = ({ item, onClose, variant = 'desktop' }) => {
    if (item.mediaDisplay === 'latestBlog' && item.latestBlog && item.latestBlog.path) {
        const isDesktop = variant === 'desktop'

        return (
            <Link
                href={toHref(item.latestBlog.path)}
                className="nav-card-latest group flex w-full shrink-0 flex-col gap-2.5 no-underline"
                onClick={onClose}
                style={{ color: 'inherit' }}
            >
                <div
                    className={
                        isDesktop
                            ? 'relative w-full overflow-hidden rounded-xl bg-muted/50 aspect-[16/10]'
                            : 'relative aspect-square w-full overflow-hidden rounded-xl bg-muted/50 sm:h-32 sm:w-32'
                    }
                >
                    {item.latestBlog.heroImage ? (
                        <Media
                            resource={item.latestBlog.heroImage}
                            fill
                            imgClassName="object-cover transition-transform duration-500 group-hover:scale-105"
                            pictureClassName="block h-full w-full"
                            htmlElement="div"
                            className="relative h-full w-full"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                            <span className="text-xs font-medium uppercase tracking-wider">Blog</span>
                        </div>
                    )}
                </div>
                <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-copper">
                        Neuester Beitrag
                    </span>
                    <span className="text-sm font-medium leading-snug text-foreground break-words line-clamp-2 group-hover:text-copper transition-colors duration-200">
                        {item.latestBlog.shortTitle || item.latestBlog.title}
                    </span>
                </div>
            </Link>
        )
    }

    if (item.image) {
        return (
            <div className="nav-card-media relative aspect-square w-full shrink-0 overflow-hidden rounded-xl bg-muted/50 sm:h-32 sm:w-32">
                <Media
                    resource={item.image}
                    fill
                    imgClassName="object-cover"
                    pictureClassName="block h-full w-full"
                    htmlElement="div"
                    className="relative h-full w-full"
                />
            </div>
        )
    }

    return null
}
