#!/usr/bin/env bash
# ------------------------------------------------------------------
# Deploy script for dipole.musicsian.com
# Django + React (Vite) application with Gunicorn
# ------------------------------------------------------------------
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
STAMP=$(date +%Y-%m-%d-%H%M%S)
DEPLOY_BASE=/var/www/dipole.musicsian.com
RELEASE_DIR="$DEPLOY_BASE/releases/$STAMP"
OUT=~/builds/dipole-$STAMP

echo "=========================================="
echo " Deploying DigitalDipole $STAMP"
echo "=========================================="

# ---- Stage 1: Build frontend ----------------------------------------
echo ""
echo "▶ [1/7] Building frontend (Vite/React)..."
cd "$PROJECT_DIR/dipole/frontend"
npm ci
npm run build
cd "$PROJECT_DIR"

# ---- Stage 2: Stage files -------------------------------------------
echo ""
echo "▶ [2/7] Staging files..."
mkdir -p "$OUT"
rsync -az --delete \
    --exclude deploy.sh \
    --exclude .git \
    --exclude .venv \
    --exclude node_modules \
    --exclude "dipole/frontend/node_modules" \
    --exclude __pycache__ \
    --exclude "*.pyc" \
    --exclude .mypy_cache \
    --exclude .pytest_cache \
    --exclude .ruff_cache \
    --exclude mailpit \
    --exclude mailpit_files \
    "$PROJECT_DIR"/ "$OUT"/

# ---- Stage 3: Create release directory ------------------------------
echo ""
echo "▶ [3/7] Publishing release..."
mkdir -p "$DEPLOY_BASE/releases"
rsync -az --delete "$OUT"/ "$RELEASE_DIR"/

# ---- Stage 4: Python venv and dependencies --------------------------
echo ""
echo "▶ [4/7] Setting up Python virtual environment..."
cd "$RELEASE_DIR"
python3.11 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip wheel
pip install -r requirements/production.txt
deactivate

# ---- Stage 5: Django collectstatic ----------------------------------
echo ""
echo "▶ [5/7] Collecting static files..."
cd "$RELEASE_DIR"
source .venv/bin/activate
# Read env vars for collectstatic
set -a
source /etc/dipole.env 2>/dev/null || true
set +a
export DJANGO_SETTINGS_MODULE=config.settings.production
python manage.py collectstatic --noinput
python manage.py migrate --noinput
deactivate

# ---- Stage 6: Flip symlink ------------------------------------------
echo ""
echo "▶ [6/7] Flipping 'current' symlink..."
sudo ln -nfs "$RELEASE_DIR" "$DEPLOY_BASE/current"

# ---- Stage 7: Fix permissions and SELinux --------------------------
echo ""
echo "▶ [7/7] Fixing permissions and restarting services..."

# Set ownership for nginx to read static files
sudo chown -R espadon:nginx "$RELEASE_DIR"
sudo chmod -R 755 "$RELEASE_DIR"

# SELinux context - restore on entire deployment path
sudo restorecon -Rv "$DEPLOY_BASE" >/dev/null 2>&1 || true
sudo setsebool -P httpd_execmem 1 2>/dev/null || true

# Restart gunicorn to pick up new code
sudo systemctl restart dipole.service

# Reload nginx
sudo systemctl reload nginx

# ---- Health check ---------------------------------------------------
echo ""
echo "▶ Health check..."
sleep 2
if curl -sf -o /dev/null "http://localhost" -H "Host: dipole.musicsian.com"; then
    echo ""
    echo "=========================================="
    echo " Successfully deployed $STAMP"
    echo " https://dipole.musicsian.com"
    echo "=========================================="
else
    echo ""
    echo "=========================================="
    echo " Deployment completed but health check failed"
    echo " Check: sudo journalctl -u dipole.service -n 50"
    echo "=========================================="
    exit 1
fi
