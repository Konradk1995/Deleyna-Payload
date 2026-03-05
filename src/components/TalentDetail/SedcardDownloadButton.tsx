'use client'

import React, { useState } from 'react'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/utilities/ui'

interface SedcardDownloadButtonProps {
    talentId: number | string
    talentName: string
    locale: string
    className?: string
}

export function SedcardDownloadButton({
    talentId,
    talentName,
    locale,
    className,
}: SedcardDownloadButtonProps) {
    const [loading, setLoading] = useState(false)

    const handleDownload = async () => {
        setLoading(true)
        try {
            const res = await fetch(`/api/talents/${encodeURIComponent(String(talentId))}/sedcard?locale=${encodeURIComponent(locale)}`)
            if (!res.ok) throw new Error('Download failed')

            const blob = await res.blob()
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            const safeName = talentName.replace(/[^a-zA-Z0-9-_ ]/g, '').replace(/\s+/g, '_')
            a.download = `Sedcard_${safeName}.pdf`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
        } catch (err) {
            console.error('Sedcard download error:', err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button
            variant="outline"
            size="lg"
            className={cn(
                'w-full sm:w-auto rounded-full px-8 border-border/60 text-foreground hover:bg-foreground/6',
                className,
            )}
            onClick={handleDownload}
            disabled={loading}
        >
            <Download className="mr-2 h-4 w-4" />
            {loading
                ? (locale === 'en' ? 'Generating…' : 'Wird erstellt…')
                : (locale === 'en' ? 'Download Sedcard' : 'Sedcard herunterladen')}
        </Button>
    )
}
