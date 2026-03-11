/**
 * Schwellenwerte für Lighthouse-Audits (0–1).
 * Unter diesen Werten schlägt test:lighthouse fehl.
 * Performance wird im Runner für localhost auf 0.3 gesenkt (Dev), sonst 0.6 (Prod).
 */
export const thresholds = {
    performance: 0.6,
    accessibility: 0.85,
    'best-practices': 0.8,
    seo: 0.85,
} as const

/** URLs, die pro Lauf geprüft werden. */
export const urls = ['/de', '/de/talente'] as const
