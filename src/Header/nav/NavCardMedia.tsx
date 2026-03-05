import React from 'react'
import { Link } from '@/i18n/navigation'
import { Media } from '@/components/Media'
import type { CardNavItem } from './types'

interface NavCardMediaProps {
    item: CardNavItem
    onClose?: () => void
}

export const NavCardMedia: React.FC<NavCardMediaProps> = ({ item, onClose }) => {
    if (item.mediaDisplay === 'latestBlog' && item.latestBlog && item.latestBlog.path) {
        return (
            <Link
                href={item.latestBlog.path as never}
                className="nav-card-latest group flex w-full shrink-0 flex-col gap-2 no-underline sm:w-32"
                onClick={onClose}
                style={{ color: 'inherit' }}
            >
                <div className="relative aspect-square w-full overflow-hidden rounded-[0.9rem] border border-border/50 bg-muted/70 sm:h-32 sm:w-32">
                    {item.latestBlog.heroImage ? (
                        <Media
                            resource={item.latestBlog.heroImage}
                            fill
                            imgClassName="object-cover"
                            pictureClassName="block h-full w-full"
                            htmlElement="div"
                            className="relative h-full w-full"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                            <span className="text-label-small">Blog</span>
                        </div>
                    )}
                </div>
                <span className="text-label-small font-medium leading-snug text-current break-words group-hover:opacity-80">
                    {item.latestBlog.shortTitle || item.latestBlog.title}
                </span>
            </Link>
        )
    }

    if (item.image) {
        return (
            <div className="nav-card-media relative aspect-square w-full shrink-0 overflow-hidden rounded-[0.9rem] border border-border/50 bg-muted/70 sm:h-32 sm:w-32">
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
