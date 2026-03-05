'use client'
import React from 'react'
import dynamic from 'next/dynamic'
const MobileNav = dynamic(() => import('./nav/MobileNav').then((mod) => mod.MobileNav))
import { DesktopNav } from './nav/DesktopNav'
import type { CardNavItem } from './nav/types'

export type { CardNavItem }

export interface CardNavProps {
    logo: React.ReactNode
    items: CardNavItem[]
    ctaButtons?: React.ReactNode[]
    languageSwitcher?: React.ReactNode
    themeToggle?: React.ReactNode
    /** Dancefloor mini-overview (icon + dropdown with talents) */
    dancefloorTrigger?: React.ReactNode
    className?: string
}

export const CardNav: React.FC<CardNavProps> = (props) => (
    <>
        <MobileNav {...props} />
        <DesktopNav {...props} />
    </>
)
