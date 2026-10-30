#!/usr/bin/env bash
# Denní záloha databáze PocketBase (cron 03:30). Drží posledních 14 dní v /var/backups/amicooking.
# Konzistentní kopie přes sqlite3 .backup — běží i za chodu serveru.
set -euo pipefail
umask 077  # zálohy obsahují hashe hesel
DEST=/var/backups/amicooking
mkdir -p "$DEST"
STAMP=$(date +%F)
sqlite3 /opt/amicooking/pb_data/data.db ".backup '$DEST/data-$STAMP.db'"
gzip -f "$DEST/data-$STAMP.db"
find "$DEST" -name 'data-*.db.gz' -mtime +14 -delete
