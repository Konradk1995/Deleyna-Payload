'use client'

import React, { useMemo, useState } from 'react'

import { CMSLink } from '@/components/CMSLink'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import type { TabsCard, TextTone } from './types'
import { getToneStyles } from './toneStyles'

type TabsCardClientProps = {
    tabsCard?: TabsCard | null
    tone: ReturnType<typeof getToneStyles>
}

export const TabsCardClient: React.FC<TabsCardClientProps> = ({ tabsCard, tone }) => {
    const tabsTextTone: TextTone = tabsCard?.textTone ?? 'dark'
    const tabsUseDarkText = tabsTextTone === 'dark'
    const tabs = useMemo(
        () =>
            (tabsCard?.tabs ?? []).filter((tab): tab is NonNullable<TabsCard['tabs']>[number] =>
                Boolean(tab?.label),
            ),
        [tabsCard?.tabs],
    )
    const [activeIndex, setActiveIndex] = useState(0)
    const activeTab = tabs[Math.min(activeIndex, Math.max(tabs.length - 1, 0))]
    const hasMedia = Boolean(tabsCard?.backgroundMedia)

    if (!tabsCard) {
        return null
    }

    return (
        <div
            className={cn(
                'relative block-card-base block-card-min-h p-5 sm:padding-large flex flex-col overflow-hidden shadow-sm hover:-translate-y-0.5 hover:shadow-md',
                !tabsCard?.backgroundMedia && tone.fallback,
            )}
        >
            {tabsCard?.backgroundMedia && (
                <>
                    <Media
                        resource={tabsCard.backgroundMedia}
                        imgClassName="absolute inset-0 h-full w-full object-cover"
                        videoClassName="absolute inset-0 h-full w-full object-cover"
                        size="(max-width: 1024px) 100vw, (max-width: 1280px) 50vw, 640px"
                    />
                    <div className={cn('absolute inset-0 pointer-events-none', tone.overlay)} />
                </>
            )}

            <div className="relative z-10 min-w-0">
                <div
                    className={cn(
                        hasMedia && 'rounded-[var(--block-radius)] padding-large',
                        hasMedia && tone.contentSurface,
                    )}
                >
                    {activeTab?.title && (
                        <h3 className={cn('font-heading-5-bold mb-3', tone.heading)}>
                            {activeTab.title}
                        </h3>
                    )}
                    {activeTab?.description && (
                        <p
                            className={cn(
                                'font-normal-text-regular text-muted-foreground md:font-medium-text-regular max-w-full sm:max-w-xs break-words',
                                tone.body,
                            )}
                        >
                            {activeTab.description}
                        </p>
                    )}
                    {activeTab?.link && (
                        <div className="mt-4">
                            <CMSLink
                                {...activeTab.link}
                                label={activeTab.link.label || 'Learn more'}
                                className={cn(
                                    'text-sm font-semibold underline underline-offset-4 break-all',
                                    tone.link,
                                )}
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-auto flex items-center gap-1 sm:gap-2">
                {tabs.map((tab, index) => (
                    <button
                        key={tab.id ?? tab.label ?? index}
                        className={cn(
                            'h-2 w-2 rounded-full transition duration-300 min-h-11 min-w-11 flex items-center justify-center -m-1 sm:m-0 sm:min-h-0 sm:min-w-0',
                            index === activeIndex
                                ? tabsUseDarkText
                                    ? 'bg-foreground w-4'
                                    : 'bg-background w-4'
                                : tabsUseDarkText
                                  ? 'bg-muted-foreground/40'
                                  : 'bg-background/40',
                        )}
                        onClick={() => setActiveIndex(index)}
                        type="button"
                        aria-label={tab.label ?? `Tab ${index + 1}`}
                        aria-current={index === activeIndex ? 'true' : undefined}
                    >
                        <span className="sr-only">{tab.label}</span>
                    </button>
                ))}
            </div>
        </div>
    )
}
