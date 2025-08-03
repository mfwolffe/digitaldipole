#!/bin/bash

# Digital Dipole Deployment Script for AlmaLinux 9
# This script automates the deployment process described in docs/DEPLOYMENT.md

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
APP_USER="digitaldipole"
APP_DIR="/opt/digitaldipole"
APP_CODE_DIR="$APP_DIR/app"
VENV_DIR="$APP_DIR/venv"
REPO_URL="https://github.com/mfwolffe/digitaldipole.git"

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_root() {
    if [[ $EUID -ne 0 ]]; then
        log_error "This script must be run as root"
        exit 1
    fi
}

install_system_packages() {
    log_info "Updating system packages..."
    dnf update -y

    log_info "Installing EPEL repository..."
    dnf install epel-release -y

    log_info "Installing development tools..."
    dnf groupinstall "Development Tools" -y
    dnf install git curl wget vim -y

    log_info "Installing Python 3.11..."
    dnf install python3.11 python3.11-pip python3.11-devel -y
    alternatives --install /usr/bin/python3 python3 /usr/bin/python3.11 1
    alternatives --install /usr/bin/pip3 pip3 /usr/bin/pip3.11 1

    log_info "Installing Node.js..."
    curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
    dnf install nodejs -y

    log_info "Installing Nginx..."
    dnf install nginx -y
    systemctl enable nginx

    log_info "Installing PostgreSQL..."
    dnf install postgresql postgresql-server postgresql-contrib postgresql-devel -y

    log_info "Installing Redis..."
    dnf install redis -y
    systemctl enable redis
}

setup_postgresql() {
    log_info "Initializing PostgreSQL..."
    postgresql-setup --initdb
    systemctl enable postgresql
    systemctl start postgresql

    log_info "PostgreSQL setup complete. Please manually create database and user:"
    echo "sudo -u postgres psql"
    echo "CREATE DATABASE digitaldipole;"
    echo "CREATE USER digitaldipole_user WITH PASSWORD 'your_secure_password_here';"
    echo "ALTER ROLE digitaldipole_user SET client_encoding TO 'utf8';"
    echo "ALTER ROLE digitaldipole_user SET default_transaction_isolation TO 'read committed';"
    echo "ALTER ROLE digitaldipole_user SET timezone TO 'UTC';"
    echo "GRANT ALL PRIVILEGES ON DATABASE digitaldipole TO digitaldipole_user;"
    echo "\\q"
    
    read -p "Press enter to continue after setting up the database..."
}

setup_redis() {
    log_info "Starting Redis..."
    systemctl start redis
}

create_app_user() {
    log_info "Creating application user..."
    useradd --system --shell /bin/bash --home $APP_DIR --create-home $APP_USER || true
}

clone_repository() {
    log_info "Cloning repository..."
    if [ -d "$APP_CODE_DIR" ]; then
        log_warn "Application directory already exists. Pulling latest changes..."
        sudo -u $APP_USER git -C $APP_CODE_DIR pull
    else
        sudo -u $APP_USER git clone $REPO_URL $APP_CODE_DIR
    fi
}

setup_python_environment() {
    log_info "Setting up Python virtual environment..."
    sudo -u $APP_USER python3.11 -m venv $VENV_DIR

    log_info "Installing Python dependencies..."
    sudo -u $APP_USER bash -c "
        source $VENV_DIR/bin/activate
        cd $APP_CODE_DIR
        pip install --upgrade pip
        pip install -r requirements/production.txt
    "
}

setup_frontend() {
    log_info "Installing frontend dependencies..."
    sudo -u $APP_USER bash -c "
        cd $APP_CODE_DIR/dipole/frontend
        npm install
    "

    log_info "Building frontend..."
    sudo -u $APP_USER bash -c "
        cd $APP_CODE_DIR/dipole/frontend
        npm run build
    "
}

setup_django() {
    log_info "Setting up Django application..."
    
    if [ ! -f "$APP_CODE_DIR/.env" ]; then
        log_warn "Creating .env file template. Please edit it with your configuration."
        sudo -u $APP_USER cp $APP_CODE_DIR/scripts/.env.example $APP_CODE_DIR/.env
        log_warn "Please edit $APP_CODE_DIR/.env with your configuration before continuing."
        read -p "Press enter to continue after editing .env file..."
    fi

    log_info "Running Django migrations..."
    sudo -u $APP_USER bash -c "
        source $VENV_DIR/bin/activate
        cd $APP_CODE_DIR
        python manage.py migrate
    "

    log_info "Collecting static files..."
    sudo -u $APP_USER bash -c "
        source $VENV_DIR/bin/activate
        cd $APP_CODE_DIR
        python manage.py collectstatic --noinput
    "
}

setup_gunicorn() {
    log_info "Setting up Gunicorn..."
    sudo -u $APP_USER mkdir -p $APP_DIR/config
    sudo -u $APP_USER mkdir -p $APP_DIR/logs
    sudo -u $APP_USER mkdir -p $APP_DIR/run

    # Copy Gunicorn configuration
    cp $APP_CODE_DIR/scripts/gunicorn.conf.py $APP_DIR/config/
    chown $APP_USER:$APP_USER $APP_DIR/config/gunicorn.conf.py
}

setup_systemd() {
    log_info "Setting up systemd service..."
    cp $APP_CODE_DIR/scripts/digitaldipole.service /etc/systemd/system/
    systemctl daemon-reload
    systemctl enable digitaldipole
}

setup_nginx() {
    log_info "Setting up Nginx..."
    cp $APP_CODE_DIR/scripts/nginx.conf /etc/nginx/conf.d/digitaldipole.conf
    
    log_warn "Please edit /etc/nginx/conf.d/digitaldipole.conf to set your domain name"
    log_warn "and SSL certificate paths before starting Nginx."
    
    nginx -t
}

setup_firewall() {
    log_info "Configuring firewall..."
    firewall-cmd --permanent --add-service=http
    firewall-cmd --permanent --add-service=https
    firewall-cmd --reload
}

start_services() {
    log_info "Starting services..."
    systemctl start digitaldipole
    systemctl start nginx
    
    log_info "Checking service status..."
    systemctl status digitaldipole --no-pager
    systemctl status nginx --no-pager
}

main() {
    log_info "Starting Digital Dipole deployment..."
    
    check_root
    install_system_packages
    setup_postgresql
    setup_redis
    create_app_user
    clone_repository
    setup_python_environment
    setup_frontend
    setup_django
    setup_gunicorn
    setup_systemd
    setup_nginx
    setup_firewall
    
    log_info "Deployment complete! Please:"
    log_info "1. Edit /etc/nginx/conf.d/digitaldipole.conf with your domain"
    log_info "2. Set up SSL certificates"
    log_info "3. Start services with: systemctl start digitaldipole nginx"
    log_info "4. Create a Django superuser: sudo -u digitaldipole $VENV_DIR/bin/python $APP_CODE_DIR/manage.py createsuperuser"
}

# Run main function if script is executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi