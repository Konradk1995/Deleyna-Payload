'use client'

import React, { useMemo, useState, useCallback, useRef } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import type {
    FieldErrorsImpl,
    FieldValues,
    UseFormRegister,
    UseFormSetValue,
    UseFormWatch,
} from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { Width } from '../Width'
import { Error as FieldError } from '../Error'
import { cn } from '@/utilities/ui'
import { localizeFieldLabel, requiredScreenReaderText } from '../fieldI18n'

type UploadedImage = {
    id: number
    url?: string
    filename?: string
    width?: number
    height?: number
    size?: number
}

type FileProgress = {
    filename: string
    progress: number // 0-100
    size: number
    status: 'uploading' | 'done' | 'error'
    errorMessage?: string
}

const MAX_PARALLEL_UPLOADS = 2

type ImageUploadField = {
    name: string
    label?: unknown
    required?: boolean
    width?: number | string
    maxFiles?: number
    maxFileSizeMB?: number
    minWidth?: number
    minHeight?: number
    helpText?: string
    turnstileToken?: string | null
    turnstileEnabled?: boolean
    errors: Partial<FieldErrorsImpl>
    register: UseFormRegister<FieldValues>
    setValue: UseFormSetValue<FieldValues>
    watch: UseFormWatch<FieldValues>
}

function parseUploadedImages(value: unknown): UploadedImage[] {
    if (!value || typeof value !== 'string') return []
    try {
        const parsed = JSON.parse(value) as unknown
        if (!Array.isArray(parsed)) return []
        return parsed.filter(
            (entry): entry is UploadedImage =>
                typeof entry === 'object' &&
                entry !== null &&
                typeof (entry as { id?: unknown }).id === 'number',
        )
    } catch {
        return []
    }
}

function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function uploadWithProgress(
    formData: FormData,
    onProgress: (percent: number) => void,
): Promise<{ success?: boolean; message?: string; file?: UploadedImage }> {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('POST', '/api/talent-application-upload')

        xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
                const percent = Math.round((event.loaded / event.total) * 100)
                onProgress(percent)
            }
        })

        xhr.addEventListener('load', () => {
            try {
                const data = JSON.parse(xhr.responseText)
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(data)
                } else {
                    resolve(data)
                }
            } catch {
                reject('Failed to parse response')
            }
        })

        xhr.addEventListener('error', () => reject('Network error'))
        xhr.addEventListener('abort', () => reject('Upload aborted'))

        xhr.send(formData)
    })
}

export const ImageUpload: React.FC<ImageUploadField> = ({
    name,
    label,
    required,
    width,
    maxFiles = 6,
    maxFileSizeMB = 8,
    minWidth = 1000,
    minHeight = 1400,
    helpText,
    turnstileToken,
    turnstileEnabled,
    errors,
    register,
    setValue,
    watch,
}) => {
    const params = useParams()
    const locale = typeof params?.locale === 'string' ? params.locale : 'de'
    const [fileProgress, setFileProgress] = useState<FileProgress[]>([])
    const [uploadError, setUploadError] = useState<string | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const rawValue = watch(name)
    const images = useMemo(() => parseUploadedImages(rawValue), [rawValue])

    const isUploading = fileProgress.some((fp) => fp.status === 'uploading')

    const localized = {
        de: {
            label: 'Portfolio-Bilder',
            uploading: 'Wird hochgeladen…',
            remove: 'Entfernen',
            guideline: 'JPG/PNG/WEBP • Automatische Komprimierung',
            captchaRequired: 'Bitte erst die Sicherheitsprüfung bestätigen.',
            maxReached: 'Maximale Anzahl erreicht.',
            requiredMessage: 'Bitte lade mindestens ein Bild hoch.',
            uploadFailed: 'Upload fehlgeschlagen.',
            fileTooLarge: 'Eine oder mehrere Dateien sind zu groß.',
            dropHint: 'Bilder hierher ziehen oder klicken',
            browseFiles: 'Dateien auswählen',
            ofMax: 'von',
            uploaded: 'hochgeladen',
        },
        en: {
            label: 'Portfolio images',
            uploading: 'Uploading…',
            remove: 'Remove',
            guideline: 'JPG/PNG/WEBP • Auto-compression enabled',
            captchaRequired: 'Please complete the security check first.',
            maxReached: 'Maximum number reached.',
            requiredMessage: 'Please upload at least one image.',
            uploadFailed: 'Upload failed.',
            fileTooLarge: 'One or more files are too large.',
            dropHint: 'Drag images here or click to browse',
            browseFiles: 'Browse files',
            ofMax: 'of',
            uploaded: 'uploaded',
        },
    } as const

    const t = locale === 'en' ? localized.en : localized.de
    const localizedLabel = localizeFieldLabel(label, locale === 'en' ? 'en' : 'de')

    const processFiles = useCallback(
        async (selectedFiles: File[]) => {
            if (selectedFiles.length === 0) return

            if (images.length >= maxFiles) {
                setUploadError(t.maxReached)
                return
            }

            if (turnstileEnabled && !turnstileToken) {
                setUploadError(t.captchaRequired)
                return
            }

            setUploadError(null)
            const maxBytes = maxFileSizeMB * 1024 * 1024
            const oversizeFiles = selectedFiles.filter((file) => file.size > maxBytes)
            const validSelectedFiles = selectedFiles.filter((file) => file.size <= maxBytes)

            if (oversizeFiles.length > 0) {
                setUploadError(`${t.fileTooLarge} (${maxFileSizeMB} MB max)`)
                // Auto-clear oversize error after 5 seconds
                setTimeout(() => setUploadError(null), 5000)
            }

            if (validSelectedFiles.length === 0) {
                return
            }

            const nextImages = [...images]
            const availableSlots = Math.max(0, maxFiles - nextImages.length)
            const filesToUpload = validSelectedFiles.slice(0, availableSlots)
            const uploadedByIndex: Array<UploadedImage | null> = new Array(
                filesToUpload.length,
            ).fill(null)

            // Initialize progress for each file
            const initialProgress: FileProgress[] = filesToUpload.map((file) => ({
                filename: file.name,
                progress: 0,
                size: file.size,
                status: 'uploading' as const,
            }))
            setFileProgress(initialProgress)

            const uploadSingle = async (file: File, index: number) => {
                const formData = new FormData()
                formData.append('file', file)
                formData.append('maxFileSizeMB', String(maxFileSizeMB))
                formData.append('minWidth', String(minWidth))
                formData.append('minHeight', String(minHeight))
                formData.append('_honey', '')
                formData.append('locale', locale)
                if (turnstileToken) formData.append('turnstileToken', turnstileToken)

                try {
                    const result = await uploadWithProgress(formData, (percent) => {
                        setFileProgress((prev) => {
                            const updated = [...prev]
                            if (updated[index]) {
                                updated[index] = { ...updated[index], progress: percent }
                            }
                            return updated
                        })
                    })

                    if (!result?.success || !result.file?.id) {
                        setFileProgress((prev) => {
                            const updated = [...prev]
                            if (updated[index]) {
                                updated[index] = {
                                    ...updated[index],
                                    status: 'error',
                                    errorMessage: result?.message || t.uploadFailed,
                                }
                            }
                            return updated
                        })
                        return
                    }

                    uploadedByIndex[index] = result.file
                    setFileProgress((prev) => {
                        const updated = [...prev]
                        if (updated[index]) {
                            updated[index] = { ...updated[index], progress: 100, status: 'done' }
                        }
                        return updated
                    })
                } catch {
                    setFileProgress((prev) => {
                        const updated = [...prev]
                        if (updated[index]) {
                            updated[index] = {
                                ...updated[index],
                                status: 'error',
                                errorMessage: t.uploadFailed,
                            }
                        }
                        return updated
                    })
                }
            }

            let cursor = 0
            const workerCount = Math.min(MAX_PARALLEL_UPLOADS, filesToUpload.length)
            await Promise.all(
                Array.from({ length: workerCount }, async () => {
                    while (cursor < filesToUpload.length) {
                        const currentIndex = cursor
                        cursor += 1
                        await uploadSingle(filesToUpload[currentIndex], currentIndex)
                    }
                }),
            )

            nextImages.push(
                ...uploadedByIndex.filter((file): file is UploadedImage => Boolean(file)),
            )

            setValue(name, JSON.stringify(nextImages), {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true,
            })

            // Clear completed items after a short delay
            setTimeout(() => {
                setFileProgress((prev) => prev.filter((fp) => fp.status !== 'done'))
            }, 1500)

            // Auto-clear error items after 4 seconds so user isn't stuck
            setTimeout(() => {
                setFileProgress((prev) => prev.filter((fp) => fp.status !== 'error'))
            }, 4000)
        },
        [
            images,
            maxFiles,
            maxFileSizeMB,
            minWidth,
            minHeight,
            turnstileEnabled,
            turnstileToken,
            locale,
            name,
            setValue,
            t,
        ],
    )

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || [])
        await processFiles(files)
        event.target.value = ''
    }

    const handleDrop = useCallback(
        async (event: React.DragEvent) => {
            event.preventDefault()
            setIsDragging(false)
            const files = Array.from(event.dataTransfer.files).filter((f) =>
                ['image/jpeg', 'image/png', 'image/webp'].includes(f.type),
            )
            await processFiles(files)
        },
        [processFiles],
    )

    const handleRemove = (index: number) => {
        const nextImages = images.filter((_, imageIndex) => imageIndex !== index)
        setValue(name, JSON.stringify(nextImages), {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
        })
    }

    return (
        <Width width={width}>
            <input
                type="hidden"
                {...register(name, {
                    validate: (value) => {
                        if (!required) return true
                        return parseUploadedImages(value).length > 0 || t.requiredMessage
                    },
                })}
            />

            <Label htmlFor={`${name}-upload`} className="text-foreground font-medium">
                {localizedLabel || t.label}
                {required && (
                    <span className="text-destructive ml-1">
                        *
                        <span className="sr-only">
                            {requiredScreenReaderText(locale === 'en' ? 'en' : 'de')}
                        </span>
                    </span>
                )}
            </Label>

            <p className="mt-1.5 text-xs text-muted-foreground">
                {helpText || t.guideline}
                {` · min ${minWidth}×${minHeight}px · max ${maxFileSizeMB} MB · ${images.length}/${maxFiles}`}
            </p>

            {/* Drop zone */}
            <div
                role="button"
                tabIndex={0}
                onDragOver={(e) => {
                    e.preventDefault()
                    setIsDragging(true)
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click()
                }}
                className={cn(
                    'mt-3 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-8 transition duration-300',
                    isDragging
                        ? 'border-copper bg-copper/5 scale-[1.01]'
                        : 'border-border/60 bg-muted/30 hover:border-copper/40 hover:bg-muted/50',
                    (isUploading || images.length >= maxFiles) && 'pointer-events-none opacity-50',
                )}
            >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-copper/10 text-copper">
                    {isUploading ? (
                        <svg
                            className="h-6 w-6 animate-spin"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                        </svg>
                    ) : (
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                            />
                        </svg>
                    )}
                </div>
                <p className="text-sm font-medium text-foreground">
                    {isUploading ? t.uploading : t.dropHint}
                </p>
                <span className="rounded-lg border border-border/60 bg-background px-4 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted">
                    {t.browseFiles}
                </span>
            </div>

            <input
                ref={fileInputRef}
                id={`${name}-upload`}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleUpload}
                disabled={isUploading || images.length >= maxFiles}
                className="sr-only"
            />

            {/* Progress bars for active uploads */}
            {fileProgress.length > 0 && (
                <div className="mt-4 space-y-2.5">
                    <div className="flex items-center gap-2 text-xs font-semibold text-copper border-b border-copper/10 pb-1 mb-3">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-copper opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-copper"></span>
                        </span>
                        {t.uploading}
                    </div>
                    {fileProgress.map((fp, i) => (
                        <div
                            key={`${fp.filename}-${i}`}
                            className={cn(
                                'overflow-hidden rounded-xl border p-3 transition duration-300',
                                fp.status === 'error'
                                    ? 'border-destructive/30 bg-destructive/5'
                                    : fp.status === 'done'
                                      ? 'border-emerald-500/30 bg-emerald-500/5'
                                      : 'border-border/50 bg-muted/30',
                            )}
                        >
                            <div className="flex items-center justify-between gap-3">
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-xs font-medium text-foreground">
                                        {fp.filename}
                                    </p>
                                    <p className="text-label-small text-muted-foreground">
                                        {formatFileSize(fp.size)}
                                        {fp.status === 'error' && fp.errorMessage && (
                                            <span className="ml-2 text-destructive">
                                                · {fp.errorMessage}
                                            </span>
                                        )}
                                        {fp.status === 'done' && (
                                            <span className="ml-2 text-emerald-600"> · ✓</span>
                                        )}
                                    </p>
                                </div>
                                {fp.status === 'error' ? (
                                    <button
                                        type="button"
                                        className="shrink-0 rounded-md p-1 text-destructive transition-colors hover:bg-destructive/10"
                                        aria-label={locale === 'en' ? 'Dismiss error' : 'Fehler schließen'}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setFileProgress((prev) => prev.filter((_, idx) => idx !== i))
                                        }}
                                    >
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                ) : (
                                    <span
                                        className={cn(
                                            'shrink-0 text-xs font-bold tabular-nums',
                                            fp.status === 'done'
                                                ? 'text-emerald-600'
                                                : 'text-copper',
                                        )}
                                    >
                                        {fp.status === 'done' ? '100%' : `${fp.progress}%`}
                                    </span>
                                )}
                            </div>
                            {/* Progress bar */}
                            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-border/40">
                                <div
                                    className={cn(
                                        'h-full rounded-full transition duration-300 ease-out',
                                        fp.status === 'error'
                                            ? 'bg-destructive'
                                            : fp.status === 'done'
                                              ? 'bg-emerald-500'
                                              : 'bg-copper',
                                    )}
                                    style={{ width: `${fp.progress}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {uploadError && (
                <p className="mt-3 text-sm text-destructive" role="alert">
                    {uploadError}
                </p>
            )}

            {/* Uploaded images grid */}
            {images.length > 0 && (
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {images.map((image, index) => (
                        <div
                            key={`${image.id}-${index}`}
                            className="group relative overflow-hidden rounded-2xl border border-border/50 bg-background/50 p-2 shadow-sm transition duration-300 hover:border-copper/30 hover:shadow-md animate-in fade-in zoom-in-95"
                        >
                            {image.url ? (
                                <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
                                    <Image
                                        src={image.url}
                                        alt={image.filename || `Upload ${index + 1}`}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                    {index === 0 && (
                                    <div className="absolute left-3 top-3 z-10 badge-pill badge-pill-sm badge-pill-copper shadow-lg shadow-copper/20 backdrop-blur-sm">
                                            {locale === 'de' ? 'Hauptbild' : 'Main Image'}
                                        </div>
                                    )}
                                    <div className="absolute inset-x-0 bottom-0 bg-media-overlay-gradient p-3 pt-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                        <p className="truncate text-label-small font-medium text-on-media-ultra">
                                            {image.filename || `image-${image.id}.jpg`}
                                        </p>
                                        {image.size && (
                                            <p className="text-label-small text-on-media-faint">
                                                {formatFileSize(image.size)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="aspect-[3/4] w-full rounded-xl bg-muted animate-pulse" />
                            )}
                            <button
                                type="button"
                                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-border/60 bg-background py-2.5 text-xs font-semibold text-muted-foreground transition hover:bg-destructive/5 hover:text-destructive hover:border-destructive/20"
                                onClick={() => handleRemove(index)}
                            >
                                <svg
                                    className="h-3.5 w-3.5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                </svg>
                                {t.remove}
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {errors[name] && <FieldError name={name} />}
        </Width>
    )
}
