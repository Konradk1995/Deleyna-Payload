'use client'

import React, { useMemo, useState } from 'react'

import { CMSLink } from '@/components/CMSLink'
type CMSLinkProps = React.ComponentProps<typeof CMSLink>
import { cn } from '@/utilities/ui'

type TabsCardItem = {
    label: string
    heading?: string | null
    text?: string | null
    link?: CMSLinkProps | null
    id?: string
}

type TabsCardProps = {
    tabs: TabsCardItem[]
}

export const TabsCard: React.FC<TabsCardProps> = ({ tabs }) => {
    const fallbackTabs = useMemo(() => (tabs.length ? tabs : [{ label: 'Tab' }]), [tabs])
    const [activeIndex, setActiveIndex] = useState(0)
    const activeTab = fallbackTabs[Math.min(activeIndex, fallbackTabs.length - 1)]

    return (
        <div className="surface-pill-soft w-full padding-small">
            <div className="flex flex-wrap gap-2 border-b border-border/40 pb-3">
                {fallbackTabs.map((tab, index) => {
                    const isActive = index === activeIndex

                    return (
                        <button
                            key={tab.id || tab.label || index}
                            className={cn(
                                'rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide transition',
                                isActive
                                    ? 'bg-foreground text-background'
                                    : 'bg-muted/60 text-muted-foreground hover:bg-muted',
                            )}
                            onClick={() => setActiveIndex(index)}
                            type="button"
                        >
                            {tab.label}
                        </button>
                    )
                })}
            </div>
            <div className="mt-3 space-y-2">
                {activeTab?.heading && (
                    <p className="text-base font-semibold leading-snug text-foreground">
                        {activeTab.heading}
                    </p>
                )}
                {activeTab?.text && (
                    <p className="text-sm leading-relaxed text-muted-foreground">
                        {activeTab.text}
                    </p>
                )}
                {activeTab?.link && (
                    <CMSLink
                        {...activeTab.link}
                        className="text-sm font-semibold text-foreground underline underline-offset-4"
                    />
                )}
            </div>
        </div>
    )
}
