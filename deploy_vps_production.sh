#!/usr/bin/env bash
# ====================================================================
# WADAAGE MOBILITY SOMALILAND - ONE-CLICK VPS PRODUCTION DEPLOYMENT
# Designed to run inside: /var/www/wadaage
# Works on Ubuntu 20.04 / 22.04 / 24.04 LTS & Debian 11 / 12
# Domain: wadaage.com & www.wadaage.com
# ====================================================================

set -e

APP_DIR="/var/www/wadaage"

echo "===================================================================="
echo "🚀 Starting Wadaage Mobility Production Setup in ${APP_DIR}..."
echo "===================================================================="

# Ensure script is executed inside /var/www/wadaage or navigate there
if [ -d "${APP_DIR}" ]; then
    cd "${APP_DIR}"
fi

# 1. Update system packages and install essential utilities
echo "📦 [1/7] Updating system packages and installing prerequisites..."
sudo apt update -y
sudo apt install -y curl wget git nginx certbot python3-certbot-nginx mysql-client ufw

# 2. Install Node.js 20 LTS if not present
if ! command -v node &> /dev/null; then
    echo "📦 [2/7] Installing Node.js 20 LTS..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
fi

echo "  - Node.js Version: $(node -v)"
echo "  - NPM Version: $(npm -v)"

# 3. Install PM2 and tsx process managers globally
echo "⚡ [3/7] Installing PM2 and tsx process managers globally..."
sudo npm install -g pm2 tsx esbuild

# 4. Environment File Configuration (.env)
echo "🔒 [4/7] Writing / verifying environment configuration (.env)..."
if [ -f .env.example ]; then
    cp .env.example .env
else
    cat << 'EOF' > .env
VITE_SITE_URL=https://www.wadaage.com
VITE_API_URL=https://www.wadaage.com
PORT=3000
NODE_ENV=production

# GOOGLE MAPS PLATFORM
VITE_GOOGLE_MAPS_API_KEY="AIzaSyBAOVGm7NLFbVZdx2GCsn5_YjdYQVry_4w"
GOOGLE_MAPS_API_KEY="AIzaSyBAOVGm7NLFbVZdx2GCsn5_YjdYQVry_4w"

# 2. CARTO / OPENSTREETMAP RASTER TILE API KEY
VITE_CARTO_API_KEY="cb1_3oi6_1_010bdeb81fa08ff3ccc0d40e"
CARTO_API_KEY="cb1_3oi6_1_010bdeb81fa08ff3ccc0d40e"

# 3. OSRM ROUTING & MAP CONFIGURATION
VITE_OSRM_BASE_URL="https://router.project-osrm.org"
OSRM_BASE_URL="https://router.project-osrm.org"
DEFAULT_SEARCH_RADIUS_KM=1.5

# 4. FIREBASE CLOUD & FIRESTORE CONFIGURATION
VITE_FIREBASE_PROJECT_ID="gen-lang-client-0601164028"
VITE_FIREBASE_DATABASE_ID="ai-studio-grabtaxisharedri-e45d19b0-1b7f-4529-bd6a-f0aebd18cea8"
VITE_FIREBASE_API_KEY="AIzaSyBmiQMl4n1WvvIvZPlYwXnhCf3KRCYalow"
VITE_FIREBASE_AUTH_DOMAIN="gen-lang-client-0601164028.firebaseapp.com"

# 5. DATABASE CONFIGURATION
DB_HOST="194.59.164.74"
DB_USER="u601059536_admhenwadgrnt"
DB_PASSWORD="Goormaweeyi2026"
DB_NAME="u601059536_newsdatbase"
DB_PORT=3306
DB_SSL=false

# 6. WHATSAPP CONFIGURATION
WHATSAPP_PHONE_NUMBER_ID=1297794856758656
WHATSAPP_TOKEN=EAGXHZCxyX8UcBSmO8xaMDm54OGDvivcGBX4wI9pJ6WD1VsSF1WjPagXk20yk4poKZCMrKASqXM2KjxaRkSIZAY69fGLbJZBqYFuvttJLT3QmZABMM3p3NVJbGxur8WOkm6ZAnIn3uveZAGgkhAsR14PUZAzqCnTTJ6LrAjEr4FghWHGSnvn1ZBSlsiztSK9F4mSvRsQZDZD
WHATSAPP_VERIFY_TOKEN=WadaageCabiir&123
WHATSAPP_WEBHOOK_URL=https://www.wadaage.com/api/webhook/whatsapp
WHATSAPP_GATEWAY_URL=https://www.wadaage.com/api/whatsapp/send-otp
EOF
fi

# Also create .env.example if missing
if [ ! -f .env.example ]; then
    cp .env .env.example
fi

# 5. Install Project Dependencies & Build Production Bundle
echo "🔨 [5/7] Installing npm packages and compiling Wadaage full-stack bundle..."
npm install --production=false
npm run build

# 6. Configure Nginx Reverse Proxy
echo "🌐 [6/7] Configuring Nginx Reverse Proxy for Port 3000..."
sudo rm -f /etc/nginx/sites-enabled/default

sudo tee /etc/nginx/sites-available/wadaage > /dev/null << 'EOF'
server {
    listen 80;
    server_name wadaage.com www.wadaage.com;

    client_max_body_size 50M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Real-Time Live Radar SSE Streaming Config
        proxy_buffering off;
        proxy_cache off;
        proxy_read_timeout 86400s;
        proxy_send_timeout 86400s;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/wadaage /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# 7. Start / Restart PM2 Engine
echo "🚀 [7/7] Starting Wadaage Engine via PM2..."
pm2 delete wadaage-mobility wadaage-production wadaage-app 2>/dev/null || true
pm2 start ecosystem.config.cjs --env production
pm2 save
sudo pm2 startup systemd -u $USER --hp $HOME 2>/dev/null || true

echo "===================================================================="
echo "🎉 WADAAGE MOBILITY DEPLOYMENT COMPLETED SUCCESSFULLY!"
echo "📍 Directory: /var/www/wadaage"
echo "🌐 Server Proxy: http://127.0.0.1:3000 -> https://www.wadaage.com"
echo "👉 Manage Process with PM2:"
echo "   pm2 restart wadaage-mobility"
echo "   pm2 logs wadaage-mobility"
echo "===================================================================="
