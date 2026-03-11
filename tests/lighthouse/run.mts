#!/usr/bin/env node
/**
 * Lighthouse-Runner: Prüft Performance, Accessibility, Best Practices, SEO.
 * Server muss laufen (z. B. pnpm dev). Basis-URL: PLAYWRIGHT_BASE_URL oder http://localhost:3000
 *
 * pnpm run test:lighthouse
 *
 * Nutzt die Lighthouse-Node-API mit chrome-launcher und Playwright-Chromium (chromePath).
 * So funktioniert der Lauf auch auf Mac Silicon mit x64-Node (CLI würde dort fehlschlagen).
 */
import * as chromeLauncher from 'chrome-launcher'
import lighthouse from 'lighthouse'
import { chromium } from 'playwright-core'
import { thresholds, urls } from './config'

const baseURL = process.env.PLAYWRIGHT_BASE_URL || process.env.BASE_URL || 'http://localhost:3000'

// Dev (localhost) = niedrigere Performance-Schwelle, Prod = 60 %
const isDev = /localhost|127\.0\.0\.1/.test(baseURL)
const effectiveThresholds = { ...thresholds, performance: isDev ? 0.3 : 0.6 }

async function runLighthouse(
    url: string,
): Promise<{ lhr: { categories: Record<string, { score: number | null }> } }> {
    const chromePath = process.env.CHROME_PATH || chromium.executablePath()
    const chrome = await chromeLauncher.launch({
        chromePath,
        port: 0,
        chromeFlags: ['--headless=new', '--no-sandbox', '--disable-dev-shm-usage'],
        logLevel: 'silent',
    })
    try {
        const result = await lighthouse(url, {
            port: chrome.port,
            logLevel: 'silent',
            output: 'json',
        })
        if (!result?.lhr) throw new Error('No LHR in result')
        return { lhr: result.lhr }
    } finally {
        chrome.kill()
    }
}

async function main() {
    console.log('Lighthouse – Base URL:', baseURL)
    console.log('Schwellenwerte:', effectiveThresholds, isDev ? '(Dev)' : '')
    console.log('')

    const failed: string[] = []
    for (const path of urls) {
        const url = `${baseURL.replace(/\/$/, '')}${path}`
        console.log('Prüfe:', url)
        try {
            const { lhr } = await runLighthouse(url)
            const cats = lhr.categories || {}
            for (const [name, minScore] of Object.entries(effectiveThresholds)) {
                const cat = cats[name]
                const score = cat?.score ?? null
                const s = score === null ? 'N/A' : (score * 100).toFixed(0)
                const ok = score !== null && score >= minScore
                if (!ok) failed.push(`${path} – ${name}: ${s}% (min ${minScore * 100}%)`)
                console.log(`  ${name}: ${s}% ${ok ? '✓' : '✗'}`)
            }
            console.log('')
        } catch (err) {
            console.error('  Fehler:', (err as Error).message)
            failed.push(`${path}: ${(err as Error).message}`)
            console.log('')
        }
    }

    if (failed.length > 0) {
        console.error('Fehlgeschlagen:')
        failed.forEach((f) => console.error('  -', f))
        process.exit(1)
    }
    console.log('Lighthouse: alle Schwellenwerte erfüllt.')
}

main().catch((err) => {
    console.error(err)
    process.exit(1)
})
