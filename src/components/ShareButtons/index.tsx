'use client'

import React, { useCallback, useState } from 'react'
import { motion } from 'motion/react'
import { Linkedin, Twitter, Facebook, Link as LinkIcon, Check } from 'lucide-react'
import { cn } from '@/utilities/ui'

type Props = {
    title: string
    className?: string
    label?: string
}

export const ShareButtons: React.FC<Props> = ({ title, className, label = 'Teilen:' }) => {
    const [copied, setCopied] = useState(false)

    const handleCopy = useCallback(() => {
        const url = typeof window !== 'undefined' ? window.location.href : ''
        navigator.clipboard.writeText(url).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        })
    }, [])

    const shareUrl = typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : ''
    const shareTitle = encodeURIComponent(title)

    const buttons = [
        {
            label: 'LinkedIn',
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
            icon: <Linkedin className="h-4 w-4" />,
        },
        {
            label: 'Twitter / X',
            href: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`,
            icon: <Twitter className="h-4 w-4" />,
        },
        {
            label: 'Facebook',
            href: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
            icon: <Facebook className="h-4 w-4" />,
        },
    ]

    return (
        <div className={cn('flex items-center gap-3', className)}>
            <span className="text-[13px] text-muted-foreground">{label}</span>
            {buttons.map((btn) => (
                <motion.a
                    key={btn.label}
                    href={btn.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={btn.label}
                    aria-label={btn.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {btn.icon}
                </motion.a>
            ))}
            <motion.button
                type="button"
                title={copied ? 'Link kopiert!' : 'Link kopieren'}
                aria-label={copied ? 'Link kopiert' : 'Link kopieren'}
                onClick={handleCopy}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
            >
                {copied ? <Check className="h-4 w-4 text-primary" /> : <LinkIcon className="h-4 w-4" />}
            </motion.button>
        </div>
    )
}
