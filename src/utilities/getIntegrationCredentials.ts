import { getFormSettings } from './getFormSettings'

export interface IntegrationCredentials {
    turnstile: {
        siteKey: string
        secretKey: string
        enabled: boolean
    }
    resend: {
        apiKey: string
        fromAddress: string
        fromName: string
    }
    upstash: {
        url: string
        token: string
        enabled: boolean
    }
}

/**
 * Central helper that reads CMS values from form-settings and merges with .env.
 * CMS values take precedence over .env values.
 */
export async function getIntegrationCredentials(): Promise<IntegrationCredentials> {
    const settings = await getFormSettings()
    const s = settings as Record<string, unknown>

    return {
        turnstile: {
            siteKey:
                (s.turnstileSiteKey as string) ||
                process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ||
                '',
            secretKey:
                (s.turnstileSecretKey as string) ||
                process.env.TURNSTILE_SECRET_KEY ||
                '',
            enabled: settings.enableTurnstile === true,
        },
        resend: {
            apiKey: (s.resendApiKey as string) || process.env.RESEND_API_KEY || '',
            fromAddress:
                (s.resendFromAddress as string) || process.env.RESEND_FROM_ADDRESS || '',
            fromName:
                (s.resendFromName as string) || process.env.RESEND_FROM_NAME || 'Deleyna',
        },
        upstash: {
            url:
                (s.upstashRedisUrl as string) ||
                process.env.UPSTASH_REDIS_REST_URL ||
                '',
            token:
                (s.upstashRedisToken as string) ||
                process.env.UPSTASH_REDIS_REST_TOKEN ||
                '',
            enabled: (s.enableUpstash as boolean) === true,
        },
    }
}
