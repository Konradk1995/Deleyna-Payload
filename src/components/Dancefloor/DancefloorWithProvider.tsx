'use client'

import React from 'react'
import { SelectionProvider } from '@/providers/Dancefloor'

export function SelectionWithProvider({ children }: { children: React.ReactNode }) {
    return (
        <SelectionProvider>
            {children}
        </SelectionProvider>
    )
}

/** @deprecated Use SelectionWithProvider */
export const DancefloorWithProvider = SelectionWithProvider
