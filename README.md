# Deleyna – Elite Dancer & Model Agency

Next.js + Payload CMS Projekt für die Talent-Agentur Deleyna. Mehrsprachig (DE/EN), Dark/Light Mode, CMS-gesteuertes Design (chrome-grace-Stil).

## Quick Start

1. `cp .env.example .env` – `DATABASE_URL` und optionale S3/Theme-Variablen setzen.
2. `pnpm install && pnpm dev` – Dev-Server (Standard: Port 3000).
3. `http://localhost:3000` – Frontend, `http://localhost:3000/admin` – Payload Admin (ersten User anlegen).

### Erste Schritte nach Clone

```bash
cp .env.example .env
# .env anpassen: DATABASE_URL, PAYLOAD_SECRET, ggf. S3
pnpm install
docker-compose up -d   # falls lokal Postgres + MinIO
pnpm payload migrate   # Datenbank-Schema anwenden
pnpm run seed          # optionale Testdaten (überspringt, wenn bereits Seiten existieren)
pnpm dev
```

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
- **`tests/`** – Alle Tests (Int, E2E, Lighthouse); Überblick: [tests/README.md](tests/README.md).
- **Root** – Nur Konfiguration (next, payload, playwright, vitest, ts, eslint, docker), Skripte in `scripts/`. Test-Artefakte (Reports, Ergebnisse) sind in `.gitignore`.
- Ausführlich: siehe `docs/`.

## Skripte

- `pnpm dev` – Entwicklung (Port über `PORT=3000` setzbar).
- `pnpm build` / `pnpm start` – Production.
- `pnpm payload migrate` – Ausstehende DB-Migrationen anwenden.
- `pnpm run seed` – Seed (Home, Archive, Header/Footer, Admin).
- `pnpm run generate:types` – Payload-Typen nach Schema-Änderungen.
- `pnpm run generate:importmap` – Admin-Import-Map nach neuen Komponenten.
- `pnpm run validate` – Lint + TypeScript-Check. `pnpm run verify` – zzgl. Build.
- **Tests:** `pnpm test` (Int + E2E), `pnpm run test:int` / `pnpm run test:e2e`, `pnpm run test:lighthouse` (Server muss laufen), `pnpm run test:all` (Int + E2E + Lighthouse). Siehe [tests/README.md](tests/README.md).

## Deployment

- **Build:** `pnpm build`. **Start:** `pnpm start` (z. B. mit Node 20).
- **Umgebungsvariablen:** Siehe `.env.example`. In Produktion mindestens `DATABASE_URL`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SERVER_URL` und ggf. S3-/Resend-Keys setzen.
- **Migrationen:** Vor dem Start `pnpm payload migrate` ausführen (oder im Deploy-Schritt integrieren).
- **Health-Check:** `GET /api/health` liefert Status und DB-Latenz (für Load-Balancer/Monitoring).

### Docker (Produktion)

- Image bauen **ohne** DB-Secrets: `docker build -t deleyna .` (optional: `--build-arg NEXT_PUBLIC_SERVER_URL=https://deine-domain.de`).
- **Migration & Seed** laufen nicht im Image: Vor dem ersten Start einmalig ausführen (auf einem Rechner mit Zugriff auf die Produktions-DB und Codebase): `pnpm payload migrate`, ggf. `pnpm run seed` (überspringt sich selbst, wenn bereits Seiten existieren).
- Container starten mit allen Env-Variablen (DATABASE_URL, PAYLOAD_SECRET, NEXT_PUBLIC_SERVER_URL, S3_*, etc.). Port 3000 exponieren.

### Dokploy

- App als **Node/Next.js**-Projekt deployen; Build-Kommando: `pnpm install && pnpm build`, Start: `pnpm start` (oder Nutzung des Dockerfiles).
- **PostgreSQL** in Dokploy anlegen oder externe DB; `DATABASE_URL` in den Umgebungsvariablen setzen.
- Vor dem ersten Start einmalig **Migration** (und optional Seed) ausführen – z. B. per „Run Command“ im Projekt oder einmaliger Job mit `pnpm payload migrate` bzw. `pnpm run seed`.
- **Backups:** Cron-Job auf dem Host oder kleines Backup-Image mit `scripts/backup-postgres.sh` – Details in [docs/BACKUPS.md](docs/BACKUPS.md).

### Go-Live Checkliste

- [ ] `PAYLOAD_SECRET` stark und eindeutig (min. 32 Zeichen).
- [ ] `NEXT_PUBLIC_SERVER_URL` auf die finale Domain gesetzt (z. B. `https://deleyna.de`).
- [ ] Datenbank-Backups einrichten (PostgreSQL). Siehe **[docs/BACKUPS.md](docs/BACKUPS.md)** (pg_dump-Skript, Cron, Dokploy).
- [ ] S3/MinIO für Media in Produktion konfiguriert (oder lokaler Storage nur bei Single-Node).
- [ ] Optional: Cloudflare Turnstile für Formulare aktivieren (Bot-Schutz).
- [ ] Optional: Upstash Redis für Rate Limiting (Newsletter/Formulare).
- [ ] Admin-User anlegen und starkes Passwort setzen.
