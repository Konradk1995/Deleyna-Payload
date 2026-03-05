import type { Metadata } from 'next'
import { NotFoundContent } from './not-found-content'

export const metadata: Metadata = {
    title: '404 – Seite nicht gefunden',
    description: 'Die angeforderte Seite wurde nicht gefunden.',
    robots: { index: false, follow: false },
}

export default function NotFound() {
    return <NotFoundContent />
}
