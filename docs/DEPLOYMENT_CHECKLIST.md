# AlmaLinux 9 + Nginx Deployment Checklist

Use this checklist to ensure a successful deployment of Digital Dipole.

## Pre-Deployment

- [ ] AlmaLinux 9 server with root access
- [ ] Domain name configured and pointing to server
- [ ] SSH access to server
- [ ] Basic server hardening completed (firewall, SSH keys, etc.)

## System Setup

- [ ] System packages updated (`dnf update -y`)
- [ ] EPEL repository installed
- [ ] Development tools installed
- [ ] Python 3.11 installed and configured
- [ ] Node.js 18.x installed
- [ ] PostgreSQL installed and initialized
- [ ] Redis installed
- [ ] Nginx installed

## Database Configuration

- [ ] PostgreSQL service started and enabled
- [ ] Database `digitaldipole` created
- [ ] Database user `digitaldipole_user` created with secure password
- [ ] Database permissions granted
- [ ] pg_hba.conf configured for local authentication
- [ ] PostgreSQL service restarted

## Application Setup

- [ ] Application user `digitaldipole` created
- [ ] Repository cloned to `/opt/digitaldipole/app`
- [ ] Python virtual environment created
- [ ] Python dependencies installed
- [ ] Frontend dependencies installed
- [ ] Frontend built successfully

## Configuration

- [ ] `.env` file created with correct values:
  - [ ] DJANGO_SECRET_KEY (long, random string)
  - [ ] DJANGO_ALLOWED_HOSTS (your domain)
  - [ ] DATABASE_URL (correct credentials)
  - [ ] REDIS_URL
  - [ ] Email settings
  - [ ] Application-specific variables
- [ ] Django migrations run successfully
- [ ] Static files collected
- [ ] Django admin user created

## Services Setup

- [ ] Gunicorn configuration created
- [ ] Systemd service file installed
- [ ] Digital Dipole service enabled
- [ ] Nginx configuration created and customized:
  - [ ] Domain name updated
  - [ ] SSL certificate paths configured
- [ ] Nginx configuration tested (`nginx -t`)

## SSL/TLS

- [ ] SSL certificate obtained (Let's Encrypt or custom)
- [ ] Certificate files have correct permissions
- [ ] Nginx SSL configuration verified
- [ ] HTTPS redirect working

## Security

- [ ] Firewall configured (ports 80, 443)
- [ ] SELinux considerations addressed (if applicable)
- [ ] Application user has minimal necessary permissions
- [ ] Database credentials are secure
- [ ] Django SECRET_KEY is unique and secure

## Service Start

- [ ] PostgreSQL service running
- [ ] Redis service running
- [ ] Digital Dipole service started successfully
- [ ] Nginx service started successfully
- [ ] All services enabled for auto-start

## Testing

- [ ] Application accessible via HTTP (redirects to HTTPS)
- [ ] Application accessible via HTTPS
- [ ] Static files loading correctly
- [ ] Admin interface accessible
- [ ] Database connectivity working
- [ ] Cache (Redis) working
- [ ] Frontend assets loading

## Post-Deployment

- [ ] SSL certificate auto-renewal configured (if Let's Encrypt)
- [ ] Log rotation configured
- [ ] Backup strategy implemented
- [ ] Monitoring setup (optional)
- [ ] Documentation updated with server-specific details

## Verification Commands

```bash
# Check services
sudo systemctl status digitaldipole nginx postgresql redis

# Check logs
sudo journalctl -u digitaldipole -n 20
sudo tail -f /var/log/nginx/error.log

# Test application
curl -I http://your-domain.com  # Should redirect to HTTPS
curl -I https://your-domain.com  # Should return 200

# Check SSL
openssl s_client -connect your-domain.com:443 -servername your-domain.com

# Test database
sudo -u digitaldipole /opt/digitaldipole/venv/bin/python /opt/digitaldipole/app/manage.py check --deploy
```

## Troubleshooting

If something doesn't work:

1. Check service logs: `sudo journalctl -u digitaldipole -f`
2. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. Verify configuration: `sudo nginx -t`
4. Test Django: `sudo -u digitaldipole /opt/digitaldipole/venv/bin/python /opt/digitaldipole/app/manage.py runserver`
5. Check permissions: Ensure all files are owned by `digitaldipole` user
6. Verify environment variables in `.env` file
7. Check database connectivity manually

## Maintenance

- [ ] Update script tested: `/opt/digitaldipole/app/scripts/update.sh help`
- [ ] Backup script working: `/opt/digitaldipole/app/scripts/update.sh backup`
- [ ] Update procedure documented for your team