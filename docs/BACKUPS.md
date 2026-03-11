# Backups (PostgreSQL)

Für Produktion solltest du regelmäßige Backups der PostgreSQL-Datenbank einrichten.

## 1. Skript (pg_dump)

Im Projekt liegt ein kleines Shell-Skript, das `pg_dump` ausführt und das Ergebnis komprimiert:

```bash
# Auf einem Rechner mit Zugriff auf die DB (z. B. dein Server oder CI)
export DATABASE_URL="postgresql://user:pass@host:5432/deleyna"
chmod +x scripts/backup-postgres.sh
./scripts/backup-postgres.sh
```

- **Ausgabe:** `./backups/deleyna_YYYYMMDD_HHMMSS.sql.gz` (oder `BACKUP_DIR`, siehe unten).
- **Optionale Umgebungsvariablen:**
  - `BACKUP_DIR` – Zielordner (Standard: `./backups`).
  - `BACKUP_RETENTION_DAYS` – wie viele Tage Backups behalten werden; ältere werden gelöscht (Standard: 7).

Voraussetzung: `pg_dump` und `gzip` müssen installiert sein (auf Ubuntu/Debian: `apt install postgresql-client gzip`).

## 2. Cron (auf dem Server)

Täglich um 3:00 Uhr (Beispiel):

```bash
crontab -e
```

Eintrag (Pfad und DATABASE_URL anpassen):

```cron
0 3 * * * DATABASE_URL='postgresql://user:pass@host:5432/deleyna' BACKUP_DIR=/var/backups/deleyna BACKUP_RETENTION_DAYS=14 /pfad/zum/Deleyna-Payload/scripts/backup-postgres.sh
```

Sinnvoll: `BACKUP_DIR` auf ein persistentes Volume legen, damit Backups bei Container-Neustarts erhalten bleiben.

## 3. Dokploy

- **PostgreSQL:** Wenn die DB in Dokploy (oder extern) läuft, braucht das Backup-Skript Netzwerkzugriff auf den DB-Host. Entweder:
  - Cron **auf dem gleichen Server** (Host), mit `DATABASE_URL` auf den Dokploy-DB-Service (z. B. `postgresql://user:pass@postgres:5432/deleyna` wenn der Service `postgres` heißt), oder
  - Cron in einem kleinen **Sidecar-/Cron-Container**, der das Repo bzw. nur das Skript + `postgresql-client` enthält und dieselbe `DATABASE_URL` wie die App bekommt.
- **Volume für Backups:** In Dokploy ein Volume z. B. `/var/backups/deleyna` anlegen und in der Cron-Job-Umgebung `BACKUP_DIR=/var/backups/deleyna` setzen. Optional Backups von dort auf S3/RSync kopieren (eigenes Skript oder Tool).

## 4. Managed-DB (z. B. Supabase, Neon, AWS RDS)

Viele Anbieter haben eingebaute Backups (Point-in-Time Recovery, tägliche Snapshots). Dann reicht es, diese zu aktivieren und die Aufbewahrungsdauer zu setzen. Das pg_dump-Skript kannst du zusätzlich nutzen, um z. B. wöchentlich ein eigenes Backup in dein S3/Volume zu legen.

## 5. Wiederherstellung

```bash
gunzip -c backups/deleyna_YYYYMMDD_HHMMSS.sql.gz | psql "$DATABASE_URL" -f -
```

Vorher: leere DB oder bestehende DB nur überschreiben, wenn du bewusst zurücksetzen willst. Bei Managed-DB ggf. zuerst eine neue Instanz/DB anlegen.
