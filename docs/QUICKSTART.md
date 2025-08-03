# Quick Start Guide - Digital Dipole on AlmaLinux 9

This is a condensed version of the full deployment guide. For detailed instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

## Prerequisites

- AlmaLinux 9 server with root access
- Domain name pointed to your server (for SSL)
- Basic knowledge of Linux administration

## One-Line Installation

For a mostly automated installation:

```bash
curl -sSL https://raw.githubusercontent.com/mfwolffe/digitaldipole/main/scripts/deploy.sh | sudo bash
```

Or download and run manually:

```bash
wget https://raw.githubusercontent.com/mfwolffe/digitaldipole/main/scripts/deploy.sh
chmod +x deploy.sh
sudo ./deploy.sh
```

## Manual Steps Required

The automated script will pause for these manual steps:

### 1. Database Setup

When prompted, run these commands:

```bash
sudo -u postgres psql
```

Then in PostgreSQL:

```sql
CREATE DATABASE digitaldipole;
CREATE USER digitaldipole_user WITH PASSWORD 'your_secure_password_here';
ALTER ROLE digitaldipole_user SET client_encoding TO 'utf8';
ALTER ROLE digitaldipole_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE digitaldipole_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE digitaldipole TO digitaldipole_user;
\q
```

### 2. Environment Configuration

Edit `/opt/digitaldipole/app/.env` with your settings:

```bash
sudo -u digitaldipole vim /opt/digitaldipole/app/.env
```

### 3. Nginx Configuration

Edit domain name and SSL certificate paths:

```bash
sudo vim /etc/nginx/conf.d/digitaldipole.conf
```

### 4. SSL Certificate

For Let's Encrypt:

```bash
sudo dnf install python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### 5. Start Services

```bash
sudo systemctl start digitaldipole
sudo systemctl start nginx
```

### 6. Create Admin User

```bash
sudo -u digitaldipole /opt/digitaldipole/venv/bin/python /opt/digitaldipole/app/manage.py createsuperuser
```

## Verification

Check that services are running:

```bash
sudo systemctl status digitaldipole nginx postgresql redis
```

Visit your domain in a browser to verify the application is working.

## Troubleshooting

View logs if something goes wrong:

```bash
# Application logs
sudo journalctl -u digitaldipole -f

# Nginx logs
sudo tail -f /var/log/nginx/error.log

# Gunicorn logs
sudo tail -f /opt/digitaldipole/logs/gunicorn-error.log
```

For detailed troubleshooting, see the full [DEPLOYMENT.md](DEPLOYMENT.md) guide.