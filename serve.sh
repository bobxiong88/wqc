#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"
python3.12 -m http.server 8000
