import { NextResponse } from 'next/server'

/** Einheitliches API-Fehlerformat (keine sensiblen Details an den Client) */
export interface ApiErrorBody {
    success: false
    message: string
    code?: string
}

/** Einheitliche Erfolgsantwort */
export interface ApiSuccessBody<T = unknown> {
    success: true
    data?: T
    message?: string
}

/**
 * API-Fehlerantwort – gleiche Struktur für alle öffentlichen Endpoints.
 * In Production keine Stack-Traces oder interne Details zurückgeben.
 */
export function apiError(
    message: string,
    status: number = 500,
    code?: string,
): NextResponse<ApiErrorBody> {
    if (process.env.NODE_ENV === 'development' && status >= 500) {
        // Optional: nur in Dev mehr loggen, nie an Client senden
        console.error(`[API ${status}]`, message, code ?? '')
    }
    return NextResponse.json(
        {
            success: false,
            message,
            ...(code ? { code } : {}),
        } as ApiErrorBody,
        { status },
    )
}

/**
 * API-Erfolgsantwort
 */
export function apiSuccess<T>(data?: T, status: number = 200, message?: string): NextResponse<ApiSuccessBody<T>> {
    return NextResponse.json(
        {
            success: true,
            ...(data !== undefined ? { data } : {}),
            ...(message ? { message } : {}),
        } as ApiSuccessBody<T>,
        { status },
    )
}
