#!/bin/bash

# Digital Dipole Deployment Validator
# This script checks if the system is ready for deployment

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Counters
PASSED=0
FAILED=0
WARNINGS=0

log_pass() {
    echo -e "${GREEN}✓ PASS${NC} $1"
    ((PASSED++))
}

log_fail() {
    echo -e "${RED}✗ FAIL${NC} $1"
    ((FAILED++))
}

log_warn() {
    echo -e "${YELLOW}⚠ WARN${NC} $1"
    ((WARNINGS++))
}

log_info() {
    echo -e "ℹ INFO: $1"
}

check_os() {
    echo "=== Operating System Check ==="
    if [ -f /etc/almalinux-release ]; then
        version=$(cat /etc/almalinux-release | grep -o '[0-9]\+\.[0-9]\+')
        if [[ "$version" == "9."* ]]; then
            log_pass "AlmaLinux 9 detected: $(cat /etc/almalinux-release)"
        else
            log_warn "AlmaLinux version $version detected (expected 9.x)"
        fi
    elif [ -f /etc/redhat-release ]; then
        log_warn "RHEL-based system detected: $(cat /etc/redhat-release)"
        log_info "This should work but is not the recommended distribution"
    else
        log_fail "Not an AlmaLinux/RHEL system"
    fi
    echo
}

check_privileges() {
    echo "=== Privilege Check ==="
    if [[ $EUID -eq 0 ]]; then
        log_pass "Running with root privileges"
    else
        log_fail "This script must be run as root"
    fi
    echo
}

check_network() {
    echo "=== Network Connectivity ==="
    if ping -c 1 8.8.8.8 &> /dev/null; then
        log_pass "Internet connectivity available"
    else
        log_fail "No internet connectivity"
    fi
    
    if command -v curl &> /dev/null; then
        if curl -s --connect-timeout 5 https://github.com &> /dev/null; then
            log_pass "GitHub is accessible"
        else
            log_fail "Cannot reach GitHub"
        fi
    else
        log_warn "curl not installed, cannot test GitHub connectivity"
    fi
    echo
}

check_system_resources() {
    echo "=== System Resources ==="
    
    # Memory check
    mem_total=$(free -m | awk 'NR==2{print $2}')
    if [ "$mem_total" -ge 2048 ]; then
        log_pass "Memory: ${mem_total}MB (≥2GB recommended)"
    elif [ "$mem_total" -ge 1024 ]; then
        log_warn "Memory: ${mem_total}MB (2GB recommended)"
    else
        log_fail "Memory: ${mem_total}MB (minimum 1GB required)"
    fi
    
    # Disk space check
    disk_avail=$(df / | awk 'NR==2{print $4}')
    disk_avail_gb=$((disk_avail / 1024 / 1024))
    if [ "$disk_avail_gb" -ge 20 ]; then
        log_pass "Disk space: ${disk_avail_gb}GB available (≥20GB recommended)"
    elif [ "$disk_avail_gb" -ge 10 ]; then
        log_warn "Disk space: ${disk_avail_gb}GB available (20GB recommended)"
    else
        log_fail "Disk space: ${disk_avail_gb}GB available (minimum 10GB required)"
    fi
    echo
}

check_existing_services() {
    echo "=== Existing Services Check ==="
    
    # Check if ports are already in use
    if ss -tlnp | grep :80 &> /dev/null; then
        service=$(ss -tlnp | grep :80 | awk '{print $7}' | head -1)
        log_warn "Port 80 already in use by: $service"
    else
        log_pass "Port 80 available"
    fi
    
    if ss -tlnp | grep :443 &> /dev/null; then
        service=$(ss -tlnp | grep :443 | awk '{print $7}' | head -1)
        log_warn "Port 443 already in use by: $service"
    else
        log_pass "Port 443 available"
    fi
    
    if ss -tlnp | grep :8000 &> /dev/null; then
        service=$(ss -tlnp | grep :8000 | awk '{print $7}' | head -1)
        log_warn "Port 8000 already in use by: $service"
    else
        log_pass "Port 8000 available"
    fi
    echo
}

check_package_manager() {
    echo "=== Package Manager Check ==="
    if command -v dnf &> /dev/null; then
        log_pass "dnf package manager available"
        
        # Check EPEL
        if dnf repolist | grep -i epel &> /dev/null; then
            log_pass "EPEL repository already enabled"
        else
            log_info "EPEL repository not enabled (will be installed)"
        fi
    else
        log_fail "dnf package manager not found"
    fi
    echo
}

check_firewall() {
    echo "=== Firewall Check ==="
    if systemctl is-active firewalld &> /dev/null; then
        log_pass "firewalld is active"
        
        if firewall-cmd --list-services | grep http &> /dev/null; then
            log_pass "HTTP service already allowed"
        else
            log_info "HTTP service not allowed (will be configured)"
        fi
        
        if firewall-cmd --list-services | grep https &> /dev/null; then
            log_pass "HTTPS service already allowed"
        else
            log_info "HTTPS service not allowed (will be configured)"
        fi
    else
        log_warn "firewalld is not active"
    fi
    echo
}

check_selinux() {
    echo "=== SELinux Check ==="
    if command -v getenforce &> /dev/null; then
        selinux_status=$(getenforce)
        case "$selinux_status" in
            "Enforcing")
                log_warn "SELinux is enforcing (may require additional configuration)"
                ;;
            "Permissive")
                log_warn "SELinux is permissive"
                ;;
            "Disabled")
                log_pass "SELinux is disabled"
                ;;
        esac
    else
        log_info "SELinux tools not available"
    fi
    echo
}

check_existing_installation() {
    echo "=== Existing Installation Check ==="
    if [ -d "/opt/digitaldipole" ]; then
        log_warn "Digital Dipole directory already exists at /opt/digitaldipole"
    else
        log_pass "No existing Digital Dipole installation found"
    fi
    
    if id "digitaldipole" &> /dev/null; then
        log_warn "User 'digitaldipole' already exists"
    else
        log_pass "User 'digitaldipole' does not exist"
    fi
    
    if systemctl list-unit-files | grep digitaldipole &> /dev/null; then
        log_warn "Digital Dipole service already exists"
    else
        log_pass "No existing Digital Dipole service found"
    fi
    echo
}

show_summary() {
    echo "=== Summary ==="
    echo -e "Passed: ${GREEN}$PASSED${NC}"
    echo -e "Warnings: ${YELLOW}$WARNINGS${NC}"
    echo -e "Failed: ${RED}$FAILED${NC}"
    echo
    
    if [ "$FAILED" -eq 0 ]; then
        if [ "$WARNINGS" -eq 0 ]; then
            echo -e "${GREEN}✓ System is ready for Digital Dipole deployment!${NC}"
            echo "You can proceed with running the deployment script."
        else
            echo -e "${YELLOW}⚠ System is mostly ready with some warnings.${NC}"
            echo "Review the warnings above and proceed with caution."
        fi
    else
        echo -e "${RED}✗ System is not ready for deployment.${NC}"
        echo "Please fix the failed checks before proceeding."
        exit 1
    fi
}

main() {
    echo "Digital Dipole Deployment Validator"
    echo "==================================="
    echo
    
    check_os
    check_privileges
    check_network
    check_system_resources
    check_existing_services
    check_package_manager
    check_firewall
    check_selinux
    check_existing_installation
    
    show_summary
}

main "$@"