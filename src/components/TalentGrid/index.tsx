'use client'

import React, { useState, useMemo } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { AdvancedFilters, type FilterState } from '@/components/AdvancedFilters'
import { TalentCard } from '@/components/TalentCard'
import type { TalentCardStyle } from '@/components/TalentCard'

interface FilterOption {
    label: string
    value: string
}

interface Talent {
    id: string
    name: string
    slug: string
    category: 'dancer' | 'model' | 'both'
    imageUrl?: string
    cardStyle?: TalentCardStyle
    hair?: string[]
    eyes?: string[]
    skills?: string[]
    isCoach?: boolean
}

interface TalentGridProps {
    talents: Talent[]
    showFilters?: boolean
    filterLabels?: { all?: string; dancers?: string; models?: string }
    locale?: string
    showHairFilter?: boolean
    showEyeFilter?: boolean
    showSkillsFilter?: boolean
    hairOptions?: FilterOption[]
    eyeOptions?: FilterOption[]
    skillOptions?: FilterOption[]
}

export function TalentGrid({
    talents,
    showFilters = true,
    filterLabels,
    locale,
    showHairFilter = false,
    showEyeFilter = false,
    showSkillsFilter = false,
    hairOptions = [],
    eyeOptions = [],
    skillOptions = [],
}: TalentGridProps) {
    const hasCoaches = useMemo(() => talents.some((t) => t.isCoach), [talents])

    const [filters, setFilters] = useState<FilterState>({
        category: 'all',
        hair: [],
        eyes: [],
        skills: [],
    })

    const filteredTalents = useMemo(() => {
        return talents.filter((t) => {
            if (filters.category === 'coach') {
                if (!t.isCoach) return false
            } else if (filters.category !== 'all') {
                const cat = filters.category
                if (cat === 'dancer' && t.category !== 'dancer' && t.category !== 'both')
                    return false
                if (cat === 'model' && t.category !== 'model' && t.category !== 'both') return false
            }
            // Array intersection: talent matches if ANY of their values match ANY selected filter value
            if (filters.hair.length > 0) {
                if (!t.hair || !t.hair.some((h) => filters.hair.includes(h))) return false
            }
            if (filters.eyes.length > 0) {
                if (!t.eyes || !t.eyes.some((e) => filters.eyes.includes(e))) return false
            }
            if (filters.skills.length > 0) {
                if (!t.skills || !t.skills.some((s) => filters.skills.includes(s))) return false
            }
            return true
        })
    }, [talents, filters])

    const shouldReduceMotion = useReducedMotion()

    const emptyMessage = locale === 'de' ? 'Keine Talente gefunden.' : 'No talents found.'

    const gridHeading = locale === 'de' ? 'Talent-Roster' : 'Talent Roster'

    return (
        <div>
            <h2 className="sr-only">{gridHeading}</h2>
            {showFilters && (
                <div className="mb-8">
                    <AdvancedFilters
                        filterLabels={filterLabels}
                        hairOptions={hairOptions}
                        eyeOptions={eyeOptions}
                        skillOptions={skillOptions}
                        showHairFilter={showHairFilter}
                        showEyeFilter={showEyeFilter}
                        showSkillsFilter={showSkillsFilter}
                        showCoachFilter={hasCoaches}
                        value={filters}
                        onChange={setFilters}
                        locale={locale}
                        resultCount={filteredTalents.length}
                        totalCount={talents.length}
                    />
                </div>
            )}

            {filteredTalents.length > 0 ? (
                <div className="grid grid-cols-1 block-grid-gap sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    <AnimatePresence mode="popLayout">
                        {filteredTalents.map((talent, index) => (
                            <motion.div
                                key={talent.id}
                                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
                                transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
                                className="h-full"
                            >
                                <TalentCard
                                    id={talent.id}
                                    name={talent.name}
                                    slug={talent.slug}
                                    category={talent.category}
                                    locale={locale}
                                    imageUrl={talent.imageUrl}
                                    cardStyle={talent.cardStyle}
                                    isCoach={talent.isCoach}
                                    priority={index < 2}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            ) : (
                <div className="padding-section text-center text-muted-foreground">
                    {emptyMessage}
                </div>
            )}
        </div>
    )
}
