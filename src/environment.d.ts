declare namespace NodeJS {
    interface ProcessEnv {
        // ── Core (Pflicht) ──────────────────────────────────────────
        readonly NODE_ENV: 'development' | 'production' | 'test'
        readonly NEXT_PUBLIC_SERVER_URL: string
        readonly DATABASE_URL: string
        readonly PAYLOAD_SECRET: string

        // ── S3 Storage (Pflicht) ────────────────────────────────────
        readonly S3_BUCKET?: string
        readonly S3_ACCESS_KEY_ID?: string
        readonly S3_SECRET_ACCESS_KEY?: string
        readonly S3_REGION?: string
        readonly S3_ENDPOINT?: string

        // ── Infrastruktur ───────────────────────────────────────────
        readonly CRON_SECRET?: string
        readonly PREVIEW_SECRET?: string
        readonly DEBUG?: string

        // ── Auch im Admin Panel konfigurierbar (env = Fallback) ─────
        // Resend → Admin: Formulareinstellungen → Auto-Antwort
        readonly RESEND_API_KEY?: string
        readonly RESEND_FROM_ADDRESS?: string
        readonly RESEND_FROM_NAME?: string
        // Turnstile → Admin: Formulareinstellungen → Bot-Schutz
        readonly NEXT_PUBLIC_TURNSTILE_SITE_KEY?: string
        readonly TURNSTILE_SECRET_KEY?: string
        // Upstash Redis → Admin: Formulareinstellungen → Rate Limiting
        readonly UPSTASH_REDIS_REST_URL?: string
        readonly UPSTASH_REDIS_REST_TOKEN?: string
        // Notion → Admin: Notion-Integration
        readonly NOTION_API_KEY?: string
        readonly NOTION_TALENTS_DB_ID?: string
        // Analytics (Rybbit, GA, GTM) → Admin: SEO → Analytics
        // → Keine env vars — komplett im Admin Panel

        // ── Nur env (kein Admin Panel) ──────────────────────────────
        // Newsletter
        readonly RESEND_AUDIENCE_ID?: string
        readonly MAILCHIMP_API_KEY?: string
        readonly MAILCHIMP_LIST_ID?: string
        readonly MAILCHIMP_SERVER_PREFIX?: string
        // Sonstiges
        readonly SECURITY_CHECK_TOKEN?: string
        readonly TALENT_UPLOAD_OUTPUT_FORMAT?: string
        readonly ENABLE_GRAPHQL?: string
        readonly SKIP_MEDIA_SEED?: string
    }
}
