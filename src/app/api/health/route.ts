import { NextResponse } from 'next/server'
import { getCachedPayload } from '@/lib/payloadClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface HealthResponse {
    status: 'ok' | 'error'
    timestamp: string
    version: string
    database: {
        connected: boolean
        latency?: number
    }
    uptime: number
}

/**
 * Health Check Endpoint
 *
 * Returns the current health status of the application.
 * Useful for monitoring and load balancer health checks.
 *
 * GET /api/health
 */
export async function GET(): Promise<NextResponse<HealthResponse>> {
    try {
        // Check database connection
        const payload = await getCachedPayload()

        // Simple query to verify database is responsive
        const dbStartTime = Date.now()
        await payload.find({
            collection: 'users',
            limit: 1,
            depth: 0,
        })
        const dbLatency = Date.now() - dbStartTime

        const response: HealthResponse = {
            status: 'ok',
            timestamp: new Date().toISOString(),
            version: process.env.npm_package_version || '1.0.0',
            database: {
                connected: true,
                latency: dbLatency,
            },
            uptime: process.uptime(),
        }

        return NextResponse.json(response, {
            status: 200,
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate',
            },
        })
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.error('Health check failed:', error)
        }

        const response: HealthResponse = {
            status: 'error',
            timestamp: new Date().toISOString(),
            version: process.env.npm_package_version || '1.0.0',
            database: {
                connected: false,
            },
            uptime: process.uptime(),
        }

        return NextResponse.json(response, {
            status: 503,
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate',
            },
        })
    }
}
