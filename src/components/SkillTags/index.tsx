import { cn } from '@/utilities/ui'
import React from 'react'

interface SkillTagsProps {
    title: string
    tags: string[]
    variant?: 'default' | 'accent'
    className?: string
}

/**
 * SkillTags - Liste von Tags für Skills/Sprachen
 */
export function SkillTags({ title, tags, variant = 'default', className }: SkillTagsProps) {
    if (!tags || tags.length === 0) return null

    return (
        <div className={cn(className)}>
            <h3 className="font-subtext-semibold mb-3 uppercase tracking-wider text-copper">
                {title}
            </h3>
            <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                    <span key={index} className={cn('tag', variant === 'accent' && 'tag-accent')}>
                        {tag}
                    </span>
                ))}
            </div>
        </div>
    )
}
