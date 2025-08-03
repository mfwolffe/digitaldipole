# Deployment Scripts

This directory contains scripts and configuration files for deploying Digital Dipole on AlmaLinux 9 with Nginx.

## Files

### Scripts

- **`deploy.sh`** - Main deployment script that automates the entire setup process
- **`update.sh`** - Maintenance script for updating the deployed application
- **`validate.sh`** - Pre-deployment validation script to check system readiness

### Configuration Files

- **`.env.example`** - Template for environment variables
- **`gunicorn.conf.py`** - Gunicorn WSGI server configuration
- **`digitaldipole.service`** - Systemd service definition
- **`nginx.conf`** - Nginx virtual host configuration

## Usage

### Initial Deployment

```bash
# First, validate your system is ready
curl -sSL https://raw.githubusercontent.com/mfwolffe/digitaldipole/main/scripts/validate.sh | sudo bash

# Then download and run the deployment script
curl -sSL https://raw.githubusercontent.com/mfwolffe/digitaldipole/main/scripts/deploy.sh | sudo bash

# Or download and run manually
wget https://raw.githubusercontent.com/mfwolffe/digitaldipole/main/scripts/validate.sh
wget https://raw.githubusercontent.com/mfwolffe/digitaldipole/main/scripts/deploy.sh
chmod +x validate.sh deploy.sh
sudo ./validate.sh
sudo ./deploy.sh
```

### Updates

```bash
# Full update (recommended)
sudo /opt/digitaldipole/app/scripts/update.sh update

# Update code only
sudo /opt/digitaldipole/app/scripts/update.sh code

# Update frontend only
sudo /opt/digitaldipole/app/scripts/update.sh frontend

# Show help
sudo /opt/digitaldipole/app/scripts/update.sh help
```

### Maintenance

```bash
# Check service status
sudo /opt/digitaldipole/app/scripts/update.sh status

# View logs
sudo /opt/digitaldipole/app/scripts/update.sh logs

# Backup database
sudo /opt/digitaldipole/app/scripts/update.sh backup

# Restart services
sudo /opt/digitaldipole/app/scripts/update.sh restart
```

## Manual Configuration

After running the deployment script, you'll need to manually configure:

1. **Database credentials** in `.env` file
2. **Domain name** in `nginx.conf`
3. **SSL certificates** (via Let's Encrypt or self-signed)
4. **Application-specific settings** in `.env`

See the [full deployment guide](../docs/DEPLOYMENT.md) for detailed instructions.