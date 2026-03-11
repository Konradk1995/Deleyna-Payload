import React from 'react'
import { ArrowUpRight } from 'lucide-react'
import { CMSLink } from '@/components/CMSLink'
import { renderLinkIcon } from './types'

interface NavCardLinksProps {
    links: Array<{
        link?: {
            type?: 'custom' | 'reference' | 'archive' | 'modal' | null
            url?: string | null
            label?: string | null
            locale?: string | null
            newTab?: boolean | null
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            reference?: any
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            archiveCollection?: any
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            modal?: any
        }
        id?: string | null
        icon?: string | null
    }>
    onClose?: () => void
    size?: 'sm' | 'md'
    itemLabel?: string
}

export const NavCardLinks: React.FC<NavCardLinksProps> = ({
    links,
    onClose,
    size = 'md',
    itemLabel,
}) => {
    return (
        <div className="nav-card-links flex min-w-0 flex-1 flex-col gap-0.5 w-full sm:w-auto">
            {links.map((lnk, i) => {
                if (!lnk?.link) return null

                return (
                    <div
                        key={lnk.id || `${itemLabel}-link-${i}`}
                        className={`group/link inline-flex items-center gap-2 no-underline cursor-pointer rounded-lg px-2 py-1.5 -mx-2 transition-colors duration-200 hover:bg-muted/60 text-current ${
                            size === 'sm'
                                ? 'text-sm text-foreground/80'
                                : 'nav-link-text text-foreground/90'
                        }`}
                    >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center text-copper/70 group-hover/link:text-copper transition-colors">
                            {renderLinkIcon(lnk.icon, 'h-3.5 w-3.5') || (
                                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                            )}
                        </span>
                        <CMSLink
                            {...lnk.link}
                            appearance="inline"
                            className="text-current break-words !no-underline group-hover/link:text-foreground transition-colors"
                            onClick={onClose}
                        />
                    </div>
                )
            })}
        </div>
    )
}
