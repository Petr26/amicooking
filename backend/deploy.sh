#!/usr/bin/env bash
# Nasazení backendu Am I Cooking? (PocketBase) na VPS u Forpsi (185.28.103.160, api.amicooking.com).
# Na stejném serveru běží i Riskuj — na jeho nginx vhost ani /var/www/riskuj nesahat.
#
#   ./deploy.sh            — nahraje migrace + hooky a restartuje službu (migrace se aplikují při startu)
#   ./deploy.sh setup      — první instalace (uživatel, binárka, systemd, nginx, cron záloh)
#   ./deploy.sh ssh        — SSH na server
#   ./deploy.sh logs       — živé logy služby
set -euo pipefail
cd "$(dirname "$0")"
HOST=${DEPLOY_HOST:-root@185.28.103.160}
DIR=/opt/amicooking
PB_VERSION=0.40.6

push_code() {
  rsync -az --delete --itemize-changes --exclude=types.d.ts pb_migrations/ "$HOST:$DIR/pb_migrations/"
  rsync -az --delete --itemize-changes --exclude=types.d.ts pb_hooks/ "$HOST:$DIR/pb_hooks/"
  ssh "$HOST" "chown -R root:root $DIR/pb_migrations $DIR/pb_hooks && chmod -R a+rX $DIR/pb_migrations $DIR/pb_hooks"
}

case "${1:-}" in
  setup)
    ssh "$HOST" "set -e
      id pocketbase >/dev/null 2>&1 || useradd --system --home $DIR --shell /usr/sbin/nologin pocketbase
      mkdir -p $DIR/pb_data $DIR/pb_migrations $DIR/pb_hooks
      chown pocketbase:pocketbase $DIR/pb_data && chmod 750 $DIR/pb_data
      command -v sqlite3 >/dev/null && command -v unzip >/dev/null || apt-get install -y sqlite3 unzip
      cd /tmp && curl -fsSL -o pb.zip https://github.com/pocketbase/pocketbase/releases/download/v$PB_VERSION/pocketbase_${PB_VERSION}_linux_amd64.zip
      unzip -o pb.zip pocketbase -d $DIR && rm pb.zip && chmod 755 $DIR/pocketbase"
    scp deploy/pocketbase.service "$HOST:/etc/systemd/system/amicooking-api.service"
    scp deploy/nginx-api.conf "$HOST:/etc/nginx/sites-available/amicooking-api"
    scp deploy/backup.sh "$HOST:/usr/local/bin/amicooking-backup"
    push_code
    ssh "$HOST" "set -e
      ln -sf /etc/nginx/sites-available/amicooking-api /etc/nginx/sites-enabled/amicooking-api
      nginx -t && systemctl reload nginx
      echo '30 3 * * * root /usr/local/bin/amicooking-backup' > /etc/cron.d/amicooking-backup
      systemctl daemon-reload && systemctl enable --now amicooking-api
      sleep 2 && systemctl --no-pager status amicooking-api | head -5"
    ;;
  ssh) exec ssh "$HOST" ;;
  logs) exec ssh "$HOST" journalctl -u amicooking-api -f ;;
  "")
    push_code
    ssh "$HOST" "systemctl restart amicooking-api && sleep 2 && systemctl is-active amicooking-api && curl -fsS 127.0.0.1:8090/api/health"
    ;;
  *) echo "Neznámý příkaz: $1" >&2; exit 1 ;;
esac
