'use client'

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { SelectionContextValue, SelectionTalent } from './types'

const SelectionContext = createContext<SelectionContextValue | null>(null)

const STORAGE_KEY = 'deleyna-dancefloor'

function loadFromStorage(): SelectionTalent[] {
    if (typeof window === 'undefined') return []
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return []
        const parsed = JSON.parse(raw) as SelectionTalent[]
        return Array.isArray(parsed) ? parsed : []
    } catch {
        return []
    }
}

function saveToStorage(talents: SelectionTalent[]) {
    if (typeof window === 'undefined') return
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(talents))
    } catch {
        // ignore
    }
}

export function SelectionProvider({ children }: { children: React.ReactNode }) {
    const [talents, setTalents] = useState<SelectionTalent[]>([])
    const [drawerOpen, setDrawerOpen] = useState(false)

    React.useEffect(() => {
        setTalents(loadFromStorage())
    }, [])

    const addTalent = useCallback((talent: SelectionTalent) => {
        setTalents((prev) => {
            if (prev.some((t) => t.id === talent.id)) return prev
            const next = [...prev, talent]
            saveToStorage(next)
            return next
        })
    }, [])

    const removeTalent = useCallback((id: string) => {
        setTalents((prev) => {
            const next = prev.filter((t) => t.id !== id)
            saveToStorage(next)
            return next
        })
    }, [])

    const isSelected = useCallback((id: string) => talents.some((t) => t.id === id), [talents])

    const clearSelection = useCallback(() => {
        setTalents([])
        saveToStorage([])
    }, [])

    const openDrawer = useCallback(() => setDrawerOpen(true), [])

    const value = useMemo<SelectionContextValue>(
        () => ({
            talents,
            addTalent,
            removeTalent,
            isSelected,
            clearSelection,
            openDrawer,
            drawerOpen,
            setDrawerOpen,
        }),
        [talents, addTalent, removeTalent, isSelected, clearSelection, openDrawer, drawerOpen],
    )

    return <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>
}

export function useSelection(): SelectionContextValue {
    const ctx = useContext(SelectionContext)
    if (!ctx) {
        return {
            talents: [],
            addTalent: () => {},
            removeTalent: () => {},
            isSelected: () => false,
            clearSelection: () => {},
            openDrawer: () => {},
            drawerOpen: false,
            setDrawerOpen: () => {},
        }
    }
    return ctx
}

/** @deprecated Use useSelection */
export const useDancefloor = useSelection
/** @deprecated Use SelectionProvider */
export const DancefloorProvider = SelectionProvider
