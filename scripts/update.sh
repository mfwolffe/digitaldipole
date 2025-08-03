#!/bin/bash

# Digital Dipole Update Script
# This script helps with updating the deployed application

set -e

# Configuration
APP_USER="digitaldipole"
APP_DIR="/opt/digitaldipole"
APP_CODE_DIR="$APP_DIR/app"
VENV_DIR="$APP_DIR/venv"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

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

update_code() {
    log_info "Updating application code..."
    sudo -u $APP_USER git -C $APP_CODE_DIR pull origin main
}

update_python_dependencies() {
    log_info "Updating Python dependencies..."
    sudo -u $APP_USER bash -c "
        source $VENV_DIR/bin/activate
        cd $APP_CODE_DIR
        pip install --upgrade pip
        pip install -r requirements/production.txt
    "
}

update_frontend() {
    log_info "Updating frontend dependencies and rebuilding..."
    sudo -u $APP_USER bash -c "
        cd $APP_CODE_DIR/dipole/frontend
        npm install
        npm run build
    "
}

run_migrations() {
    log_info "Running database migrations..."
    sudo -u $APP_USER bash -c "
        source $VENV_DIR/bin/activate
        cd $APP_CODE_DIR
        python manage.py migrate
    "
}

collect_static() {
    log_info "Collecting static files..."
    sudo -u $APP_USER bash -c "
        source $VENV_DIR/bin/activate
        cd $APP_CODE_DIR
        python manage.py collectstatic --noinput
    "
}

restart_services() {
    log_info "Restarting services..."
    systemctl restart digitaldipole
    systemctl reload nginx
}

check_services() {
    log_info "Checking service status..."
    systemctl status digitaldipole --no-pager
    systemctl status nginx --no-pager
}

backup_database() {
    log_info "Creating database backup..."
    backup_file="/backup/digitaldipole_$(date +%Y%m%d_%H%M%S).sql"
    mkdir -p /backup
    sudo -u postgres pg_dump digitaldipole > $backup_file
    log_info "Database backup created: $backup_file"
}

show_logs() {
    echo "=== Application Logs ==="
    journalctl -u digitaldipole --no-pager -n 20
    
    echo -e "\n=== Nginx Error Logs ==="
    tail -n 20 /var/log/nginx/error.log
    
    echo -e "\n=== Gunicorn Error Logs ==="
    if [ -f "$APP_DIR/logs/gunicorn-error.log" ]; then
        tail -n 20 $APP_DIR/logs/gunicorn-error.log
    else
        echo "No Gunicorn error log found"
    fi
}

usage() {
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  update     - Full update (code, dependencies, frontend, migrations, static)"
    echo "  code       - Update code only"
    echo "  deps       - Update Python dependencies only"
    echo "  frontend   - Update frontend only"
    echo "  migrate    - Run database migrations only"
    echo "  static     - Collect static files only"
    echo "  restart    - Restart services"
    echo "  status     - Check service status"
    echo "  backup     - Backup database"
    echo "  logs       - Show recent logs"
    echo "  help       - Show this help message"
}

main() {
    case "${1:-}" in
        update)
            check_root
            backup_database
            systemctl stop digitaldipole
            update_code
            update_python_dependencies
            update_frontend
            run_migrations
            collect_static
            restart_services
            check_services
            log_info "Update complete!"
            ;;
        code)
            check_root
            systemctl stop digitaldipole
            update_code
            systemctl start digitaldipole
            ;;
        deps)
            check_root
            systemctl stop digitaldipole
            update_python_dependencies
            systemctl start digitaldipole
            ;;
        frontend)
            check_root
            update_frontend
            collect_static
            systemctl reload nginx
            ;;
        migrate)
            check_root
            run_migrations
            ;;
        static)
            check_root
            collect_static
            systemctl reload nginx
            ;;
        restart)
            check_root
            restart_services
            ;;
        status)
            check_services
            ;;
        backup)
            backup_database
            ;;
        logs)
            show_logs
            ;;
        help|--help|-h)
            usage
            ;;
        "")
            usage
            exit 1
            ;;
        *)
            log_error "Unknown command: $1"
            usage
            exit 1
            ;;
    esac
}

main "$@"