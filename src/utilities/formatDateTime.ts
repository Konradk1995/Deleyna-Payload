/**
 * Formats a date string or Date object to a localized string
 */
export function formatDateTime(
    timestamp: string | Date,
    options?: Intl.DateTimeFormatOptions,
    locale = 'de-DE',
): string {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp

    const defaultOptions: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        ...options,
    }

    return new Intl.DateTimeFormat(locale, defaultOptions).format(date)
}

/**
 * Formats a date string or Date object to a relative time string (e.g., "2 days ago")
 */
export function formatRelativeTime(timestamp: string | Date, locale = 'de-DE'): string {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })

    if (diffInSeconds < 60) {
        return rtf.format(-diffInSeconds, 'second')
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60)
    if (diffInMinutes < 60) {
        return rtf.format(-diffInMinutes, 'minute')
    }

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) {
        return rtf.format(-diffInHours, 'hour')
    }

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 30) {
        return rtf.format(-diffInDays, 'day')
    }

    const diffInMonths = Math.floor(diffInDays / 30)
    if (diffInMonths < 12) {
        return rtf.format(-diffInMonths, 'month')
    }

    const diffInYears = Math.floor(diffInDays / 365)
    return rtf.format(-diffInYears, 'year')
}
