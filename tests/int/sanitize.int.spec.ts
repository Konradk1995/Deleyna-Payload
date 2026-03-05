import { describe, it, expect } from 'vitest'
import { sanitizeString, sanitizeEmail, hasSQLInjection } from '@/utilities/sanitize'

describe('sanitize', () => {
    describe('sanitizeString', () => {
        it('returns empty string for non-string input', () => {
            expect(sanitizeString(null)).toBe('')
            expect(sanitizeString(undefined)).toBe('')
            expect(sanitizeString(123)).toBe('')
        })
        it('escapes HTML entities', () => {
            expect(sanitizeString('<script>')).toBe('&lt;script&gt;')
            expect(sanitizeString('"foo"')).toBe('&quot;foo&quot;')
        })
        it('neutralizes script tags (escaped so not executable)', () => {
            const out = sanitizeString('Hello <script>alert(1)</script>')
            expect(out).not.toMatch(/<script/i)
            expect(out).not.toMatch(/<\/script>/i)
        })
        it('trims whitespace', () => {
            expect(sanitizeString('  ok  ')).toBe('ok')
        })
    })

    describe('sanitizeEmail', () => {
        it('returns empty string for invalid email', () => {
            expect(sanitizeEmail('not-an-email')).toBe('')
            expect(sanitizeEmail('')).toBe('')
        })
        it('returns lowercase valid email', () => {
            expect(sanitizeEmail('User@Example.COM')).toBe('user@example.com')
        })
    })

    describe('hasSQLInjection', () => {
        it('detects common SQL patterns', () => {
            expect(hasSQLInjection("1' OR '1'='1")).toBe(true)
            expect(hasSQLInjection('normal text')).toBe(false)
        })
    })
})
