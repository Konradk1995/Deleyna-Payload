# Tests (Deleyna)

Alle Tests liegen in diesem Ordner. Einheitliche Struktur für Überblick und CI.

## Struktur

| Ordner        | Typ        | Tool     | Beschreibung                    |
|---------------|------------|----------|----------------------------------|
| `int/`        | Integration| Vitest   | Unit-/Integrations-Tests (Sanitize, Health-API-Struktur, optional DB) |
| `e2e/`        | E2E        | Playwright| Browser-Tests (Routen, Layout, Health, Admin) |
| `lighthouse/`| Qualität   | Lighthouse | Performance, Accessibility, Best Practices, SEO |

## Befehle

```bash
# Alle Tests (Int + E2E)
pnpm test

# Nur Integration (schnell, ohne Server)
pnpm run test:int

# Nur E2E (startet Dev-Server)
pnpm run test:e2e

# Lighthouse (Server muss laufen, z. B. nach pnpm dev)
pnpm run test:lighthouse

# Alles: Int + E2E + Lighthouse
pnpm run test:all
```

## Voraussetzungen

- **test:int** – keine (optional `RUN_DB_TESTS=1` für API-DB-Tests).
- **test:e2e** – Playwright startet `pnpm dev` automatisch; Port 3000 frei.
- **test:lighthouse** – App muss erreichbar sein (`pnpm dev` oder `pnpm start`). Basis-URL: `PLAYWRIGHT_BASE_URL` oder `http://localhost:3000`. Es wird die Lighthouse-Node-API mit Playwright-Chromium genutzt (funktioniert auch auf Mac Silicon mit x64-Node).

## Konfiguration

- **Vitest:** `vitest.config.mts` (Root), Setup: `vitest.setup.ts`.
- **Playwright:** `playwright.config.ts` (Root), Test-Ordner: `tests/e2e/`.
- **Lighthouse:** Schwellenwerte in `tests/lighthouse/config.ts`, Runner: `tests/lighthouse/run.mts`.
