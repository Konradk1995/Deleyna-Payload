export type SelectionTalent = {
    id: string
    name: string
    slug: string
}

export type SelectionContextValue = {
    talents: SelectionTalent[]
    addTalent: (talent: SelectionTalent) => void
    removeTalent: (id: string) => void
    isSelected: (id: string) => boolean
    clearSelection: () => void
    openDrawer: () => void
    drawerOpen: boolean
    setDrawerOpen: (open: boolean) => void
}

/** @deprecated Use SelectionTalent */
export type DancefloorTalent = SelectionTalent
/** @deprecated Use SelectionContextValue */
export type DancefloorContextValue = SelectionContextValue
