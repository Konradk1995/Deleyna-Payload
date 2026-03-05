'use client'

import React, { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'

interface GalleryImage {
    url: string
    alt: string
    caption?: string | null
}

interface GalleryLightboxProps {
    images: GalleryImage[]
    talentName: string
}

export function GalleryLightbox({ images, talentName: _talentName }: GalleryLightboxProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    const close = useCallback(() => setOpenIndex(null), [])
    const prev = useCallback(() => {
        setOpenIndex((i) => (i !== null && i > 0 ? i - 1 : images.length - 1))
    }, [images.length])
    const next = useCallback(() => {
        setOpenIndex((i) => (i !== null && i < images.length - 1 ? i + 1 : 0))
    }, [images.length])

    useEffect(() => {
        if (openIndex === null) return
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') close()
            if (e.key === 'ArrowLeft') prev()
            if (e.key === 'ArrowRight') next()
        }
        document.addEventListener('keydown', handler)
        document.body.style.overflow = 'hidden'
        return () => {
            document.removeEventListener('keydown', handler)
            document.body.style.overflow = ''
        }
    }, [openIndex, close, prev, next])

    if (!images || images.length === 0) return null

    return (
        <>
            {/* Gallery Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {images.map((img, index) => (
                    <button
                        key={index}
                        type="button"
                        onClick={() => setOpenIndex(index)}
                        className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-muted glass-morphism border border-border cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper"
                    >
                        <Image
                            src={img.url}
                            alt={img.alt}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            loading="lazy"
                        />
                        {img.caption && (
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                                <p className="text-sm text-white">{img.caption}</p>
                            </div>
                        )}
                    </button>
                ))}
            </div>

            {/* Lightbox Overlay */}
            <AnimatePresence>
                {openIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md"
                        onClick={close}
                    >
                        {/* Close button */}
                        <button
                            type="button"
                            onClick={close}
                            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                            aria-label="Close"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        {/* Prev button */}
                        {images.length > 1 && (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    prev()
                                }}
                                className="absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                                aria-label="Previous"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                        )}

                        {/* Next button */}
                        {images.length > 1 && (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    next()
                                }}
                                className="absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                                aria-label="Next"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        )}

                        {/* Image */}
                        <motion.div
                            key={openIndex}
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="relative max-h-[85vh] max-w-[90vw]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Image
                                src={images[openIndex].url}
                                alt={images[openIndex].alt}
                                width={1200}
                                height={1600}
                                className="max-h-[85vh] w-auto rounded-lg object-contain"
                                sizes="90vw"
                            />
                            {images[openIndex].caption && (
                                <p className="mt-3 text-center text-sm text-white/80">
                                    {images[openIndex].caption}
                                </p>
                            )}
                        </motion.div>

                        {/* Counter */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/60">
                            {openIndex + 1} / {images.length}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
