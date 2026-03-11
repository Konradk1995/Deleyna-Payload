import type { Metadata } from 'next'
import { NotFoundContent } from './not-found-content'

export const metadata: Metadata = {
    title: '404 – Page not found',
    description: 'The requested page could not be found.',
    robots: { index: false, follow: false },
}

export default function NotFound() {
    return <NotFoundContent />
}
