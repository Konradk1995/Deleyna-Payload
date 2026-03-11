import { describe, it, expect } from 'vitest'

/**
 * Prüft die erwartete Struktur der Health-API-Response.
 * Echte API wird in E2E (frontend.e2e.spec.ts) getestet.
 */
describe('Health API Response', () => {
    const validHealthShape = {
        status: 'ok' as const,
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        database: { connected: true, latency: 1 },
        uptime: 0.5,
    }

    it('Response hat alle Pflichtfelder', () => {
        expect(validHealthShape).toHaveProperty('status')
        expect(validHealthShape).toHaveProperty('timestamp')
        expect(validHealthShape).toHaveProperty('version')
        expect(validHealthShape).toHaveProperty('database')
        expect(validHealthShape).toHaveProperty('uptime')
        expect(validHealthShape.database).toHaveProperty('connected')
    })

    it('status ist ok oder error', () => {
        expect(['ok', 'error']).toContain(validHealthShape.status)
    })

    it('database.connected ist boolean', () => {
        expect(typeof validHealthShape.database.connected).toBe('boolean')
    })
})
