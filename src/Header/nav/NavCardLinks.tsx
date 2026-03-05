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
        <div className="nav-card-links flex min-w-0 flex-1 flex-col gap-[4px] w-full sm:w-auto">
            {links.map((lnk, i) => {
                if (!lnk?.link) return null

                return (
                    <div
                        key={lnk.id || `${itemLabel}-link-${i}`}
                        className={`inline-flex items-center gap-[6px] no-underline cursor-pointer transition-opacity duration-300 hover:opacity-75 text-current ${
                            size === 'sm'
                                ? 'text-sm text-current/85 gap-2'
                                : 'nav-link-text text-current/90'
                        }`}
                    >
                        {renderLinkIcon(lnk.icon, 'h-4 w-4 shrink-0') || (
                            <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden />
                        )}
                        <CMSLink
                            {...lnk.link}
                            appearance="inline"
                            className="text-current break-words !no-underline"
                            onClick={onClose}
                        />
                    </div>
                )
            })}
        </div>
    )
}
