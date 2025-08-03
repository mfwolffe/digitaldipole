# Digital Dipole - A Chemistry Educational Tool

A Django-based web application for chemistry education, featuring interactive calculators and educational content.

## Quick Deployment on AlmaLinux 9 + Nginx

For a complete deployment guide, see our documentation:

- **[Quick Start Guide](docs/QUICKSTART.md)** - Fast deployment in minutes
- **[Full Deployment Guide](docs/DEPLOYMENT.md)** - Comprehensive step-by-step instructions

### One-Line Installation

```bash
curl -sSL https://raw.githubusercontent.com/mfwolffe/digitaldipole/main/scripts/deploy.sh | sudo bash
```

### Technology Stack

- **Backend**: Django 4.2+ with Python 3.11
- **Frontend**: React with Vite build system
- **Database**: PostgreSQL
- **Cache**: Redis
- **Web Server**: Nginx (reverse proxy)
- **WSGI Server**: Gunicorn

## Development Setup

See [wiki](https://github.com/mfwolffe/digitaldipole/wiki) for development environment setup.

## Features

- Interactive chemistry calculators
- Educational content and references
- User authentication and management
- Responsive web interface
- Production-ready deployment

## Architecture

This application follows a modern web architecture:

- Django REST API backend
- React frontend with modern JavaScript
- PostgreSQL for data persistence
- Redis for caching and sessions
- Nginx for static file serving and reverse proxy

## Deployment Files

- `scripts/deploy.sh` - Automated deployment script
- `scripts/nginx.conf` - Nginx configuration template
- `scripts/digitaldipole.service` - Systemd service file
- `scripts/gunicorn.conf.py` - Gunicorn configuration
- `scripts/.env.example` - Environment variables template

## Credits

[![Built with Cookiecutter Django](https://img.shields.io/badge/built%20with-Cookiecutter%20Django-ff69b4.svg?logo=cookiecutter)](https://github.com/cookiecutter/cookiecutter-django/)

Built on scaffolding constructed by Dr. Michael Stewart of James Madison University and Professor Nathan Self of the University of Mary Washington.

## License

GNU General Public License
