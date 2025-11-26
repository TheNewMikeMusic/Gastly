#!/bin/bash
# HTTPS Setup Script for Maclock
# This script configures Nginx with self-signed SSL certificate for IP address

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

IP_ADDRESS="38.175.195.104"
NGINX_SITES_AVAILABLE="/etc/nginx/sites-available"
NGINX_SITES_ENABLED="/etc/nginx/sites-enabled"
SSL_DIR="/etc/nginx/ssl"
NGINX_CONFIG="maclock"

echo -e "${YELLOW}========================================"
echo -e "HTTPS Setup for Maclock"
echo -e "========================================${NC}"
echo ""

# 1. Check and install Nginx
echo -e "${YELLOW}1. Checking Nginx installation...${NC}"
if ! command -v nginx &> /dev/null; then
    echo -e "${YELLOW}Nginx not found. Installing Nginx...${NC}"
    apt-get update
    apt-get install -y nginx
    echo -e "${GREEN}✓ Nginx installed${NC}"
else
    echo -e "${GREEN}✓ Nginx is already installed${NC}"
fi

# Enable and start Nginx
systemctl enable nginx
systemctl start nginx
echo ""

# 2. Create SSL directory
echo -e "${YELLOW}2. Creating SSL certificate directory...${NC}"
mkdir -p $SSL_DIR
chmod 700 $SSL_DIR
echo -e "${GREEN}✓ SSL directory created${NC}"
echo ""

# 3. Generate self-signed certificate
echo -e "${YELLOW}3. Generating self-signed SSL certificate...${NC}"
if [ ! -f "$SSL_DIR/maclock.crt" ] || [ ! -f "$SSL_DIR/maclock.key" ]; then
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout $SSL_DIR/maclock.key \
        -out $SSL_DIR/maclock.crt \
        -subj "/C=US/ST=State/L=City/O=Hello1984/CN=$IP_ADDRESS" \
        -addext "subjectAltName=IP:$IP_ADDRESS"
    
    chmod 600 $SSL_DIR/maclock.key
    chmod 644 $SSL_DIR/maclock.crt
    echo -e "${GREEN}✓ SSL certificate generated${NC}"
else
    echo -e "${YELLOW}SSL certificate already exists, skipping generation${NC}"
fi
echo ""

# 4. Copy Nginx configuration
echo -e "${YELLOW}4. Configuring Nginx...${NC}"
if [ -f "nginx-maclock.conf" ]; then
    cp nginx-maclock.conf $NGINX_SITES_AVAILABLE/$NGINX_CONFIG
    echo -e "${GREEN}✓ Nginx configuration copied${NC}"
else
    echo -e "${RED}✗ nginx-maclock.conf not found in current directory${NC}"
    echo -e "${YELLOW}Please ensure nginx-maclock.conf is in the same directory${NC}"
    exit 1
fi

# Enable site
if [ -L "$NGINX_SITES_ENABLED/$NGINX_CONFIG" ]; then
    rm $NGINX_SITES_ENABLED/$NGINX_CONFIG
fi
ln -s $NGINX_SITES_AVAILABLE/$NGINX_CONFIG $NGINX_SITES_ENABLED/$NGINX_CONFIG
echo -e "${GREEN}✓ Nginx site enabled${NC}"
echo ""

# 5. Test Nginx configuration
echo -e "${YELLOW}5. Testing Nginx configuration...${NC}"
if nginx -t; then
    echo -e "${GREEN}✓ Nginx configuration is valid${NC}"
else
    echo -e "${RED}✗ Nginx configuration test failed${NC}"
    exit 1
fi
echo ""

# 6. Reload Nginx
echo -e "${YELLOW}6. Reloading Nginx...${NC}"
systemctl reload nginx
echo -e "${GREEN}✓ Nginx reloaded${NC}"
echo ""

# 7. Configure firewall
echo -e "${YELLOW}7. Configuring firewall...${NC}"
if command -v ufw &> /dev/null; then
    ufw allow 443/tcp
    ufw allow 80/tcp
    echo -e "${GREEN}✓ Firewall configured (UFW)${NC}"
elif command -v firewall-cmd &> /dev/null; then
    firewall-cmd --permanent --add-service=https
    firewall-cmd --permanent --add-service=http
    firewall-cmd --reload
    echo -e "${GREEN}✓ Firewall configured (firewalld)${NC}"
else
    echo -e "${YELLOW}No firewall detected. Please manually open ports 80 and 443${NC}"
fi
echo ""

echo -e "${GREEN}========================================"
echo -e "HTTPS Setup Complete!"
echo -e "========================================${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo -e "  1. Update .env.local: NEXT_PUBLIC_URL=https://$IP_ADDRESS"
echo -e "  2. Rebuild and restart Next.js application"
echo -e "  3. Access your site at: https://$IP_ADDRESS"
echo ""
echo -e "${YELLOW}Note:${NC}"
echo -e "  - Self-signed certificate will show a security warning"
echo -e "  - Users need to accept the certificate to proceed"
echo -e "  - iOS Safari: Settings > General > About > Certificate Trust Settings"
echo ""





