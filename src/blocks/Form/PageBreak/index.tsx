import React from 'react'

export const PageBreak: React.FC = () => {
    // This is a logical marker component for FormClient.tsx.
    // We render a subtle separator to visually break steps if needed.
    return <hr className="col-span-12 my-6 border-border/30" />
}
