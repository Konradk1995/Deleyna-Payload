'use client'

import React from 'react'
import Image from 'next/image'

interface TalentThumbnailCellProps {
    cellData: unknown
    rowData: {
        featuredImage?: {
            url?: string
            thumbnailURL?: string
            sizes?: {
                thumbnail?: { url?: string }
                card?: { url?: string }
            }
        }
    }
}

interface MediaObject {
    url?: string
    thumbnailURL?: string
    sizes?: {
        thumbnail?: { url?: string }
        card?: { url?: string }
    }
}

export const TalentThumbnailCell: React.FC<TalentThumbnailCellProps> = ({ rowData, cellData }) => {
    // cellData points directly to the populated image object when attached to featuredImage
    const img: MediaObject | undefined =
        cellData && typeof cellData === 'object' ? (cellData as MediaObject) : rowData?.featuredImage
    const url = img?.sizes?.thumbnail?.url || img?.sizes?.card?.url || img?.thumbnailURL || img?.url

    if (!url) {
        return (
            <div
                style={{
                    width: '100%',
                    padding: '8px',
                    backgroundColor: 'var(--theme-elevation-100)',
                    color: 'var(--theme-elevation-400)',
                    fontSize: '10px',
                    wordBreak: 'break-all',
                }}
            >
                {JSON.stringify(img || 'img is missing')}
            </div>
        )
    }

    return url ? (
        <Image
            src={url}
            alt=""
            width={40}
            height={50}
            unoptimized
            style={{
                width: '40px',
                height: '50px',
                objectFit: 'cover',
                borderRadius: '6px',
                border: '1px solid var(--theme-elevation-150)',
            }}
        />
    ) : null
}
