# Digital Dipole - AlmaLinux 9 + Nginx Deployment Guide

This guide provides step-by-step instructions for deploying the Digital Dipole chemistry educational tool on AlmaLinux 9 with Nginx as a reverse proxy.

## Table of Contents

1. [System Requirements](#system-requirements)
2. [System Setup](#system-setup)
3. [Clone Repository](#clone-repository)
4. [Database Setup](#database-setup)
5. [Redis Setup](#redis-setup)
6. [Python Environment](#python-environment)
7. [Frontend Build](#frontend-build)
8. [Django Configuration](#django-configuration)
9. [Gunicorn Setup](#gunicorn-setup)
10. [Nginx Configuration](#nginx-configuration)
11. [SSL/TLS Setup](#ssltls-setup)
12. [System Services](#system-services)
13. [Firewall Configuration](#firewall-configuration)
14. [Maintenance](#maintenance)

## System Requirements

- AlmaLinux 9
- Minimum 2GB RAM
- Minimum 20GB disk space
- Internet connection for package installation

## System Setup

### 1. Update System

```bash
sudo dnf update -y
```

### 2. Install EPEL Repository

```bash
sudo dnf install epel-release -y
```

### 3. Install Basic Development Tools

```bash
sudo dnf groupinstall "Development Tools" -y
sudo dnf install git curl wget vim -y
```

### 4. Install Python 3.11

AlmaLinux 9 comes with Python 3.9 by default. We need Python 3.11 for this project:

```bash
# Install Python 3.11 from AppStream
sudo dnf install python3.11 python3.11-pip python3.11-devel -y

# Create symlinks for convenience
sudo alternatives --install /usr/bin/python3 python3 /usr/bin/python3.11 1
sudo alternatives --install /usr/bin/pip3 pip3 /usr/bin/pip3.11 1
```

### 5. Install Node.js

```bash
# Install Node.js 18.x (LTS)
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo dnf install nodejs -y
```

### 6. Install Nginx

```bash
sudo dnf install nginx -y
sudo systemctl enable nginx
```

## Clone Repository

### 1. Create Application User

```bash
sudo useradd --system --shell /bin/bash --home /opt/digitaldipole --create-home digitaldipole
```

### 2. Clone the Repository

```bash
sudo -u digitaldipole git clone https://github.com/mfwolffe/digitaldipole.git /opt/digitaldipole/app
cd /opt/digitaldipole/app
```

## Database Setup

### 1. Install PostgreSQL

```bash
sudo dnf install postgresql postgresql-server postgresql-contrib postgresql-devel -y
```

### 2. Initialize Database

```bash
sudo postgresql-setup --initdb
sudo systemctl enable postgresql
sudo systemctl start postgresql
```

### 3. Create Database and User

```bash
sudo -u postgres psql
```

In PostgreSQL shell:

```sql
CREATE DATABASE digitaldipole;
CREATE USER digitaldipole_user WITH PASSWORD 'your_secure_password_here';
ALTER ROLE digitaldipole_user SET client_encoding TO 'utf8';
ALTER ROLE digitaldipole_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE digitaldipole_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE digitaldipole TO digitaldipole_user;
\q
```

### 4. Configure PostgreSQL Authentication

Edit `/var/lib/pgsql/data/pg_hba.conf`:

```bash
sudo vim /var/lib/pgsql/data/pg_hba.conf
```

Change the following line:
```
local   all             all                                     peer
```
to:
```
local   all             all                                     md5
```

Restart PostgreSQL:
```bash
sudo systemctl restart postgresql
```

## Redis Setup

### 1. Install Redis

```bash
sudo dnf install redis -y
sudo systemctl enable redis
sudo systemctl start redis
```

### 2. Configure Redis (Optional)

Edit `/etc/redis/redis.conf` if needed:

```bash
sudo vim /etc/redis/redis.conf
```

Basic security settings:
- Set a password: `requirepass your_redis_password`
- Bind to localhost only: `bind 127.0.0.1`

Restart Redis:
```bash
sudo systemctl restart redis
```

## Python Environment

### 1. Create Virtual Environment

```bash
sudo -u digitaldipole python3.11 -m venv /opt/digitaldipole/venv
```

### 2. Activate Virtual Environment and Install Dependencies

```bash
sudo -u digitaldipole bash -c "
    source /opt/digitaldipole/venv/bin/activate
    cd /opt/digitaldipole/app
    pip install --upgrade pip
    pip install -r requirements/production.txt
"
```

## Frontend Build

### 1. Install Frontend Dependencies

```bash
sudo -u digitaldipole bash -c "
    cd /opt/digitaldipole/app/dipole/frontend
    npm install
"
```

### 2. Build Frontend

```bash
sudo -u digitaldipole bash -c "
    cd /opt/digitaldipole/app/dipole/frontend
    npm run build
"
```

## Django Configuration

### 1. Create Environment File

```bash
sudo -u digitaldipole touch /opt/digitaldipole/app/.env
sudo -u digitaldipole vim /opt/digitaldipole/app/.env
```

Add the following content (replace values with your own):

```env
# Django Settings
DJANGO_SECRET_KEY=your_very_long_secret_key_here
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=your-domain.com,www.your-domain.com,localhost,127.0.0.1
DJANGO_ADMIN_URL=admin/
DJANGO_SECURE_SSL_REDIRECT=True

# Database
DATABASE_URL=postgres://digitaldipole_user:your_secure_password_here@localhost:5432/digitaldipole

# Redis
REDIS_URL=redis://localhost:6379/0

# Email (configure according to your email provider)
DJANGO_DEFAULT_FROM_EMAIL=noreply@your-domain.com
DJANGO_SERVER_EMAIL=server@your-domain.com

# Application specific
SECRET_KEY=your_app_secret_key
CLIENT_ID=your_client_id
IM_USER=your_im_user
IM_PASS=your_im_password
```

### 2. Run Django Migrations

```bash
sudo -u digitaldipole bash -c "
    source /opt/digitaldipole/venv/bin/activate
    cd /opt/digitaldipole/app
    python manage.py migrate
"
```

### 3. Collect Static Files

```bash
sudo -u digitaldipole bash -c "
    source /opt/digitaldipole/venv/bin/activate
    cd /opt/digitaldipole/app
    python manage.py collectstatic --noinput
"
```

### 4. Create Superuser

```bash
sudo -u digitaldipole bash -c "
    source /opt/digitaldipole/venv/bin/activate
    cd /opt/digitaldipole/app
    python manage.py createsuperuser
"
```

## Gunicorn Setup

### 1. Test Gunicorn

```bash
sudo -u digitaldipole bash -c "
    source /opt/digitaldipole/venv/bin/activate
    cd /opt/digitaldipole/app
    gunicorn --bind 0.0.0.0:8000 config.wsgi:application
"
```

### 2. Create Gunicorn Configuration

```bash
sudo -u digitaldipole mkdir -p /opt/digitaldipole/config
sudo -u digitaldipole vim /opt/digitaldipole/config/gunicorn.conf.py
```

Add the following content:

```python
# Gunicorn configuration file
import multiprocessing

# Server socket
bind = "127.0.0.1:8000"
backlog = 2048

# Worker processes
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = "sync"
worker_connections = 1000
timeout = 30
keepalive = 2
max_requests = 1000
max_requests_jitter = 50

# Restart workers after this many requests, with up to 50 requests variance
preload_app = True

# Logging
accesslog = "/opt/digitaldipole/logs/gunicorn-access.log"
errorlog = "/opt/digitaldipole/logs/gunicorn-error.log"
loglevel = "info"

# Process naming
proc_name = "digitaldipole"

# Server mechanics
daemon = False
pidfile = "/opt/digitaldipole/run/gunicorn.pid"
user = "digitaldipole"
group = "digitaldipole"
tmp_upload_dir = None

# SSL (if needed)
# keyfile = "/path/to/keyfile"
# certfile = "/path/to/certfile"
```

### 3. Create Required Directories

```bash
sudo -u digitaldipole mkdir -p /opt/digitaldipole/logs
sudo -u digitaldipole mkdir -p /opt/digitaldipole/run
```

## Nginx Configuration

### 1. Create Nginx Configuration

```bash
sudo vim /etc/nginx/conf.d/digitaldipole.conf
```

Add the following content:

```nginx
upstream digitaldipole {
    server 127.0.0.1:8000;
}

server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL Configuration (will be configured in SSL section)
    ssl_certificate /etc/ssl/certs/digitaldipole.crt;
    ssl_certificate_key /etc/ssl/private/digitaldipole.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Static files
    location /static/ {
        alias /opt/digitaldipole/app/staticfiles/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Media files
    location /media/ {
        alias /opt/digitaldipole/app/media/;
        expires 1y;
        add_header Cache-Control "public";
    }

    # Frontend assets
    location /assets/ {
        alias /opt/digitaldipole/app/dipole/frontend/dist/assets/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Main application
    location / {
        proxy_pass http://digitaldipole;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_redirect off;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # Buffer settings
        proxy_buffering on;
        proxy_buffer_size 8k;
        proxy_buffers 8 8k;
    }

    # Health check endpoint
    location /health/ {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
```

### 2. Test Nginx Configuration

```bash
sudo nginx -t
```

## SSL/TLS Setup

### Option A: Self-Signed Certificate (for testing)

```bash
sudo mkdir -p /etc/ssl/private
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/ssl/private/digitaldipole.key \
    -out /etc/ssl/certs/digitaldipole.crt \
    -subj "/C=US/ST=State/L=City/O=Organization/CN=your-domain.com"
sudo chmod 600 /etc/ssl/private/digitaldipole.key
```

### Option B: Let's Encrypt Certificate (recommended for production)

```bash
# Install certbot
sudo dnf install python3-certbot-nginx -y

# Obtain certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Test automatic renewal
sudo certbot renew --dry-run
```

## System Services

### 1. Create Systemd Service for Gunicorn

```bash
sudo vim /etc/systemd/system/digitaldipole.service
```

Add the following content:

```ini
[Unit]
Description=Digital Dipole Gunicorn Application Server
Documentation=https://github.com/mfwolffe/digitaldipole
After=network.target postgresql.service redis.service
Requires=postgresql.service redis.service

[Service]
Type=exec
User=digitaldipole
Group=digitaldipole
RuntimeDirectory=digitaldipole
WorkingDirectory=/opt/digitaldipole/app
Environment=PATH=/opt/digitaldipole/venv/bin
Environment=DJANGO_SETTINGS_MODULE=config.settings.production
ExecStart=/opt/digitaldipole/venv/bin/gunicorn \
    --config /opt/digitaldipole/config/gunicorn.conf.py \
    config.wsgi:application
ExecReload=/bin/kill -s HUP $MAINPID
KillMode=mixed
TimeoutStopSec=5
PrivateTmp=true
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

### 2. Enable and Start Services

```bash
sudo systemctl daemon-reload
sudo systemctl enable digitaldipole
sudo systemctl start digitaldipole
sudo systemctl enable nginx
sudo systemctl start nginx
```

### 3. Check Service Status

```bash
sudo systemctl status digitaldipole
sudo systemctl status nginx
sudo systemctl status postgresql
sudo systemctl status redis
```

## Firewall Configuration

### 1. Configure Firewall

```bash
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

### 2. Check Firewall Status

```bash
sudo firewall-cmd --list-all
```

## Maintenance

### 1. Update Application

```bash
# Stop services
sudo systemctl stop digitaldipole

# Update code
sudo -u digitaldipole bash -c "
    cd /opt/digitaldipole/app
    git pull origin main
"

# Update dependencies if needed
sudo -u digitaldipole bash -c "
    source /opt/digitaldipole/venv/bin/activate
    cd /opt/digitaldipole/app
    pip install -r requirements/production.txt
"

# Rebuild frontend if needed
sudo -u digitaldipole bash -c "
    cd /opt/digitaldipole/app/dipole/frontend
    npm install
    npm run build
"

# Run migrations
sudo -u digitaldipole bash -c "
    source /opt/digitaldipole/venv/bin/activate
    cd /opt/digitaldipole/app
    python manage.py migrate
    python manage.py collectstatic --noinput
"

# Restart services
sudo systemctl start digitaldipole
sudo systemctl reload nginx
```

### 2. Monitor Logs

```bash
# Application logs
sudo journalctl -u digitaldipole -f

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Gunicorn logs
sudo tail -f /opt/digitaldipole/logs/gunicorn-access.log
sudo tail -f /opt/digitaldipole/logs/gunicorn-error.log
```

### 3. Backup Database

```bash
sudo -u postgres pg_dump digitaldipole > /backup/digitaldipole_$(date +%Y%m%d_%H%M%S).sql
```

### 4. Monitor System Resources

```bash
# Check disk usage
df -h

# Check memory usage
free -h

# Check process status
ps aux | grep -E '(gunicorn|nginx|postgres|redis)'
```

## Troubleshooting

### Common Issues

1. **Service won't start**: Check logs with `journalctl -u digitaldipole`
2. **Database connection errors**: Verify PostgreSQL is running and credentials are correct
3. **Static files not loading**: Run `python manage.py collectstatic` and check Nginx configuration
4. **Permission errors**: Ensure all files are owned by the `digitaldipole` user

### Useful Commands

```bash
# Check all services
sudo systemctl status digitaldipole nginx postgresql redis

# Restart application
sudo systemctl restart digitaldipole

# Check configuration
sudo nginx -t
python manage.py check --deploy

# View real-time logs
sudo journalctl -u digitaldipole -f
```

---

This completes the deployment guide for Digital Dipole on AlmaLinux 9 with Nginx. Make sure to replace all placeholder values (domain names, passwords, etc.) with your actual values before deployment.