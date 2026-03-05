# Deleyna – Elite Dancer & Model Agency

Next.js + Payload CMS Projekt für die Talent-Agentur Deleyna. Mehrsprachig (DE/EN), Dark/Light Mode, CMS-gesteuertes Design (chrome-grace-Stil).

## Quick Start

1. `cp .env.example .env` – `DATABASE_URL` und optionale S3/Theme-Variablen setzen.
2. `pnpm install && pnpm dev` – Dev-Server (Standard: Port 3000).
3. `http://localhost:3000` – Frontend, `http://localhost:3000/admin` – Payload Admin (ersten User anlegen).

### Docker (lokal)

- `docker-compose up -d` – PostgreSQL + MinIO.
- `.env` mit passender `DATABASE_URL` und S3-Variablen für MinIO.

## Projekt-Docs

Technische Dokumentation im Ordner `docs/`:

- **[docs/BLOCK-STANDARDS.md](docs/BLOCK-STANDARDS.md)** – Block- und Section-Standards (Theme, Typo, Card/Button, Motion, Media).
- **[docs/DESIGN-SYSTEM.md](docs/DESIGN-SYSTEM.md)** – Design-System-Dokumentation.

## Wichtiges

- **Locale:** `[locale]` in den Routen (z. B. `/de`, `/en`). Konfiguration: `src/i18n/config.ts`.
- **Theme:** Light/Dark über `localStorage` Key `theme` und Klasse `.dark` bzw. `data-theme` am `<html>`. ThemeToggle im Footer; Init-Script im Root-Layout verhindert FOUC.
- **Security:** Middleware (i18n-Routing); Sanitization, Rate Limiting, Auth – siehe AGENTS.md.
- **Formulare / Bot-Schutz:** Optional **Cloudflare Turnstile** (cookie-frei, DSGVO-freundlich). Bei gesetzten Env-Variablen `NEXT_PUBLIC_TURNSTILE_SITE_KEY` und `TURNSTILE_SECRET_KEY` werden Formulare nur mit gültigem Token angenommen. Siehe `.env.example`.

## Ordnerstruktur (Kurz)

- `src/app/(frontend)` – Website (Routen, Layout, Fonts); `(payload)` – Admin.
- `src/blocks/` – CMS-Blocks. `src/collections/`, `src/globals/` – Payload.
- `src/components/`, `src/heros/` – UI. `src/utilities/`, `src/hooks/`, `src/access/` – Hilfen & Zugriff.
- Ausführlich: siehe `docs/`.

## Skripte

- `pnpm dev` – Entwicklung (Port über `PORT=3000` setzbar).
- `pnpm build` / `pnpm start` – Production.
- `pnpm run seed` – Seed (Home, Archive, Header/Footer, Admin).
- `pnpm run generate:types` – Payload-Typen nach Schema-Änderungen.
- `pnpm run generate:importmap` – Admin-Import-Map nach neuen Komponenten.
