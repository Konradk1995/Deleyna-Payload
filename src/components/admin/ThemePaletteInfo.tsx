import React from 'react'

const deleynaDarkPalette = [
    { name: 'Hintergrund', hex: '#0a0a0a' },
    { name: 'Vordergrund', hex: '#fafafa' },
    { name: 'Copper (Akzent)', hex: '#C4956A' },
    { name: 'Muted', hex: '#262626' },
    { name: 'Card', hex: '#171717' },
    { name: 'Border', hex: '#333333' },
]

/**
 * Zeigt die Deleyna-Farbpalette als Swatches im Admin (Theme Einstellungen).
 */
export function ThemePaletteInfo() {
    return (
        <div className="rounded-lg border border-border bg-muted/30 p-4">
            <p className="mb-3 text-sm font-medium text-foreground">Deleyna Dark (Standard)</p>
            <div className="flex flex-wrap gap-3">
                {deleynaDarkPalette.map(({ name, hex }) => (
                    <div key={name} className="flex flex-col items-center gap-1">
                        <div
                            className="h-10 w-10 rounded-md border border-border shadow-sm"
                            style={{ backgroundColor: hex }}
                            title={`${name} ${hex}`}
                        />
                        <span className="text-xs text-muted-foreground">{name}</span>
                        <span className="font-mono text-xs text-foreground">{hex}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
