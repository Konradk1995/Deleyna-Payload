/**
 * Env validation – in production, fail fast when required vars are missing.
 * In development/build, returns '' so e.g. `next build` without .env still runs (CI).
 */
export function getRequiredEnv(key: string): string {
    const value = process.env[key]
    if (value === undefined || value === '') {
        if (process.env.NODE_ENV === 'production') {
            throw new Error(`Missing required environment variable: ${key}. Set it in .env or .env.local.`)
        }
        return ''
    }
    return value
}
