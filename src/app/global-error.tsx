'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    // Basic detection for home href,
    // we don't have usePathname reliably in global-error in all Next.js versions but usePathname works.
    const isDev = process.env.NODE_ENV === 'development'

    useEffect(() => {
        if (isDev) {
            console.error('Frontend error (global boundary):', error)
        }
    }, [error, isDev])

    const text = {
        title: 'Something went wrong',
        description: 'An unexpected error occurred. Please try again or return to the home page.',
        tryAgain: 'Try again',
        home: 'Back to home',
    }

    return (
        <html lang="en">
            <body>
                <div
                    className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 py-16 text-center"
                    style={{ fontFamily: 'system-ui, sans-serif' }}
                >
                    <h1 className="text-2xl font-bold tracking-tight text-black">{text.title}</h1>
                    <p className="max-w-md text-gray-600">{text.description}</p>
                    {isDev && error?.message && (
                        <pre className="max-w-2xl overflow-auto rounded-2xl border border-red-300 bg-red-50 p-4 text-left text-sm text-red-600">
                            {error.message}
                        </pre>
                    )}
                    <div className="flex flex-wrap justify-center gap-4 mt-4">
                        <button
                            onClick={reset}
                            className="inline-flex h-11 items-center justify-center rounded-full bg-black px-7 text-sm font-semibold text-white transition hover:bg-gray-800"
                        >
                            {text.tryAgain}
                        </button>
                        <Link
                            href="/"
                            className="inline-flex h-11 items-center justify-center rounded-full border border-gray-300 bg-white px-7 text-sm font-semibold text-black transition hover:bg-gray-100"
                        >
                            {text.home}
                        </Link>
                    </div>
                </div>
            </body>
        </html>
    )
}
