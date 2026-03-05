/**
 * Input Sanitization Utilities
 *
 * Für Formulare, Form-Submit und SEO (z. B. Sitemap/robots). Verhindert XSS, SQL-Injection.
 * Für API-interne Sanitization: @/utilities/security.ts (sanitizeInput, sanitizeObject).
 */

/**
 * Sanitize a string by removing potentially dangerous characters
 */
export function sanitizeString(input: unknown): string {
    if (typeof input !== 'string') {
        return ''
    }

    return (
        input
            // Remove null bytes
            .replace(/\0/g, '')
            // Encode HTML entities
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            // Remove script tags
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            // Remove on* event handlers
            .replace(/\bon\w+\s*=/gi, '')
            // Trim whitespace
            .trim()
    )
}

/**
 * Sanitize an email address
 */
export function sanitizeEmail(input: unknown): string {
    if (typeof input !== 'string') {
        return ''
    }

    const email = input.toLowerCase().trim()

    // Basic email validation regex
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/

    if (!emailRegex.test(email)) {
        return ''
    }

    return email
}

/**
 * Sanitize a URL
 */
export function sanitizeURL(input: unknown): string {
    if (typeof input !== 'string') {
        return ''
    }

    const url = input.trim()

    // Only allow http, https, and relative URLs
    if (!/^(https?:\/\/|\/)/i.test(url)) {
        return ''
    }

    // Block javascript: and data: URLs
    if (/^(javascript|data|vbscript):/i.test(url)) {
        return ''
    }

    return url
}

/**
 * Sanitize a slug
 */
export function sanitizeSlug(input: unknown): string {
    if (typeof input !== 'string') {
        return ''
    }

    return (
        input
            .toLowerCase()
            .trim()
            // Replace umlauts
            .replace(/ä/g, 'ae')
            .replace(/ö/g, 'oe')
            .replace(/ü/g, 'ue')
            .replace(/ß/g, 'ss')
            // Remove special characters
            .replace(/[^a-z0-9\s-]/g, '')
            // Replace spaces with hyphens
            .replace(/\s+/g, '-')
            // Remove multiple consecutive hyphens
            .replace(/-+/g, '-')
            // Remove leading/trailing hyphens
            .replace(/^-|-$/g, '')
    )
}

/**
 * Sanitize object keys and values recursively
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
    const sanitized: Record<string, unknown> = {}

    for (const [key, value] of Object.entries(obj)) {
        const sanitizedKey = sanitizeString(key)

        if (typeof value === 'string') {
            sanitized[sanitizedKey] = sanitizeString(value)
        } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            sanitized[sanitizedKey] = sanitizeObject(value as Record<string, unknown>)
        } else if (Array.isArray(value)) {
            sanitized[sanitizedKey] = value.map((item) =>
                typeof item === 'string'
                    ? sanitizeString(item)
                    : typeof item === 'object' && item !== null
                      ? sanitizeObject(item as Record<string, unknown>)
                      : item,
            )
        } else {
            sanitized[sanitizedKey] = value
        }
    }

    return sanitized as T
}

/**
 * Validate and sanitize form data
 */
export function validateFormData(data: Record<string, unknown>): {
    isValid: boolean
    sanitizedData: Record<string, unknown>
    errors: string[]
} {
    const errors: string[] = []
    const sanitizedData: Record<string, unknown> = {}

    for (const [key, value] of Object.entries(data)) {
        const sanitizedKey = sanitizeSlug(key)

        if (!sanitizedKey) {
            errors.push(`Invalid field name: ${key}`)
            continue
        }

        if (typeof value === 'string') {
            const sanitized = sanitizeString(value)

            // Check for suspicious patterns
            if (/<script/i.test(value) || /javascript:/i.test(value)) {
                errors.push(`Suspicious content detected in field: ${key}`)
                continue
            }

            sanitizedData[sanitizedKey] = sanitized
        } else if (typeof value === 'number' || typeof value === 'boolean') {
            sanitizedData[sanitizedKey] = value
        } else if (value === null || value === undefined) {
            sanitizedData[sanitizedKey] = null
        } else {
            errors.push(`Unsupported field type for: ${key}`)
        }
    }

    return {
        isValid: errors.length === 0,
        sanitizedData,
        errors,
    }
}

/**
 * Check if string contains SQL injection patterns.
 * Designed to catch actual attack patterns while allowing legitimate input
 * (e.g. names like "O'Brien", text containing semicolons, etc.)
 */
export function hasSQLInjection(input: string): boolean {
    const patterns = [
        // SQL keywords followed by typical SQL syntax (not just the keyword alone)
        /\b(SELECT|INSERT\s+INTO|UPDATE\s+\w+\s+SET|DELETE\s+FROM|DROP\s+(TABLE|DATABASE)|UNION\s+(ALL\s+)?SELECT|ALTER\s+TABLE|CREATE\s+TABLE|TRUNCATE\s+TABLE)\b/i,
        // Classic tautology attacks: OR 1=1, AND 1=1, OR 'a'='a'
        /(\b(OR|AND)\b\s+(['"]?\w+['"]?\s*=\s*['"]?\w+['"]?))/i,
        // SQL comment sequences
        /(--|\/\*|\*\/)/,
        // Time-based / file-based injection
        /\b(SLEEP\s*\(|BENCHMARK\s*\(|LOAD_FILE\s*\(|INTO\s+OUTFILE)\b/i,
    ]

    return patterns.some((pattern) => pattern.test(input))
}
