'use client'

import React, { useState } from 'react'
import { Button, useDocumentInfo, useFormFields, toast } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'

export const WebPConvertButton: React.FC = () => {
    const { id, collectionSlug } = useDocumentInfo()
    const router = useRouter()
    const [isConverting, setIsConverting] = useState(false)

    const mimeType = useFormFields(([fields]) => fields.mimeType?.value as string | undefined)

    if (collectionSlug !== 'media' || !id) return null

    const isImage = mimeType?.startsWith('image/')
    const isWebp = mimeType === 'image/webp'

    if (!isImage || isWebp) return null

    const handleConvert = async () => {
        setIsConverting(true)
        try {
            const res = await fetch(`/api/media/${id}/convert-webp`, {
                method: 'POST',
            })
            if (res.ok) {
                toast.success('Successfully converted image to WebP.')
                router.refresh()
            } else {
                toast.error('Conversion failed. Check console for details.')
            }
        } catch (err) {
            console.error(err)
            toast.error('Error during conversion')
        } finally {
            setIsConverting(false)
        }
    }

    return (
        <div
            className="webp-convert-button-wrapper"
            style={{
                paddingBottom: '24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
            }}
        >
            <div style={{ marginBottom: '8px' }}>
                <label className="field-label">WebP Conversion</label>
            </div>
            <Button
                size="small"
                buttonStyle="secondary"
                onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleConvert()
                }}
                disabled={isConverting}
            >
                {isConverting ? 'Converting...' : 'Convert to WebP'}
            </Button>
            <div style={{ marginTop: '8px' }}>
                <p className="field-description" style={{ margin: 0 }}>
                    This action forces WebP conversion through the formatting pipeline and
                    completely replaces the original file permanently.
                </p>
            </div>
        </div>
    )
}
