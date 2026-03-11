#!/usr/bin/env bash
# Postgres-Backup für Deleyna (pg_dump)
# Nutzung: DATABASE_URL=postgresql://user:pass@host:5432/db ./scripts/backup-postgres.sh
# Optional: BACKUP_DIR=/path/to/backups (Standard: ./backups)
# Optional: BACKUP_RETENTION_DAYS=7 (ältere Backups löschen)

set -euo pipefail

BACKUP_DIR="${BACKUP_DIR:-./backups}"
BACKUP_RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-7}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "Fehler: DATABASE_URL ist nicht gesetzt." >&2
  echo "Beispiel: export DATABASE_URL=postgresql://user:pass@host:5432/deleyna" >&2
  exit 1
fi

# pg_dump braucht eine URL ohne Query-Parameter für Kompatibilität
CLEAN_URL="${DATABASE_URL%%\?*}"

mkdir -p "$BACKUP_DIR"
BACKUP_FILE="${BACKUP_DIR}/deleyna_${TIMESTAMP}.sql.gz"

echo "Backup starten: $BACKUP_FILE"
if pg_dump "$CLEAN_URL" --no-owner --no-acl | gzip -9 > "$BACKUP_FILE"; then
  echo "Backup erstellt: $BACKUP_FILE"
else
  echo "Fehler: pg_dump fehlgeschlagen." >&2
  exit 1
fi

# Alte Backups löschen (optional)
if [[ "$BACKUP_RETENTION_DAYS" -gt 0 ]]; then
  find "$BACKUP_DIR" -name "deleyna_*.sql.gz" -type f -mtime +"$BACKUP_RETENTION_DAYS" -delete 2>/dev/null || true
  echo "Backups älter als $BACKUP_RETENTION_DAYS Tage entfernt."
fi
