'use client'

import React, { useState } from 'react'
import { Button, toast } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'

export const ConvertAllWebPButton: React.FC = () => {
    const router = useRouter()
    const [isConverting, setIsConverting] = useState(false)
    const [progress, setProgress] = useState({ current: 0, total: 0 })

    const handleConvertAll = async () => {
        setIsConverting(true)
        setProgress({ current: 0, total: 0 })

        try {
            // Fetch up to 1000 media items to find candidates
            const res = await fetch('/api/media?limit=1000&depth=0')
            const data = await res.json()

            // Filter out SVGs, GIFs, already-WebP images, and non-images
            const itemsToConvert = (data.docs || []).filter(
                (doc: { id: string; mimeType?: string }) =>
                    doc.mimeType &&
                    doc.mimeType.startsWith('image/') &&
                    doc.mimeType !== 'image/webp' &&
                    doc.mimeType !== 'image/svg+xml' &&
                    doc.mimeType !== 'image/gif',
            )

            if (itemsToConvert.length === 0) {
                alert('No JPG/PNG images found that need conversion.')
                setIsConverting(false)
                return
            }

            setProgress({ current: 0, total: itemsToConvert.length })

            // Loop through sequentially
            let count = 0
            for (const item of itemsToConvert) {
                try {
                    await fetch(`/api/media/${item.id}/convert-webp`, { method: 'POST' })
                    count++
                    setProgress({ current: count, total: itemsToConvert.length })
                } catch (e) {
                    console.error(`Failed to convert ${item.id}`, e)
                }
            }

            // Force reload so list shows updated WebP items
            router.refresh()
            toast.success(`Successfully converted ${itemsToConvert.length} images to WebP!`)
            setTimeout(() => {
                setIsConverting(false)
            }, 1000)
        } catch (err) {
            console.error('Error fetching media:', err)
            toast.error('Failed to fetch media list.')
            setIsConverting(false)
        }
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <Button
                size="small"
                buttonStyle="secondary"
                onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    if (
                        confirm(
                            'Are you sure you want to convert ALL non-WebP images to WebP? This will permanently replace them.',
                        )
                    ) {
                        handleConvertAll()
                    }
                }}
                disabled={isConverting}
            >
                {isConverting
                    ? `Converting... (${progress.current}/${progress.total})`
                    : 'Convert ALL Images to WebP'}
            </Button>
            {isConverting && (
                <span className="text-sm text-muted-foreground mt-2 block">
                    Processing images sequentially. Please keep this tab open...
                </span>
            )}
        </div>
    )
}
