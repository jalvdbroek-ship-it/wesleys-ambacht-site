#!/usr/bin/env bash
# Start de site lokaal én maakt er een openbare link van.
#
# Gebruik: npm run delen
#
# De tunnel loopt via Cloudflare en vraagt geen account. De link is
# tijdelijk: hij verandert elke keer dat je dit script start, en hij
# werkt alleen zolang dit script draait.
set -euo pipefail

cd "$(dirname "$0")/.."

TUNNEL="./tools/cloudflared.exe"
POORT="${POORT:-4321}"

if [ ! -f "$TUNNEL" ]; then
  echo "cloudflared ontbreekt. Download hem met:"
  echo "  curl -L -o $TUNNEL https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe"
  exit 1
fi

if ! curl -s -o /dev/null -m 5 "http://localhost:$POORT/"; then
  echo "De site draait niet op poort $POORT. Start hem eerst met:"
  echo "  npm run build && npm run preview -- --port $POORT --host 0.0.0.0 --allowed-hosts localhost,.loca.lt,.ngrok.io,.trycloudflare.com"
  exit 1
fi

echo "De tunnel wordt opgezet. De link verschijnt hieronder."
echo "Deel die link met wie je wilt. Hij werkt zolang dit venster open is."
echo

"$TUNNEL" tunnel --url "http://localhost:$POORT" --no-autoupdate
