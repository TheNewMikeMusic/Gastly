#!/bin/bash
# 快速修复 Clerk 问题 - 临时禁用或配置

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

cd /var/www/maclock

echo -e "${YELLOW}快速修复 Clerk 配置...${NC}"
echo ""

# 检查是否有有效的 Clerk 密钥
if grep -q "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_" .env.local && ! grep -q "placeholder" .env.local; then
    CLERK_KEY=$(grep "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=" .env.local | cut -d'=' -f2)
    if [ -n "$CLERK_KEY" ] && [ "${CLERK_KEY#pk_}" != "$CLERK_KEY" ]; then
        echo -e "${GREEN}✓ 发现有效的 Clerk 密钥${NC}"
        echo -e "${YELLOW}重启服务以应用配置...${NC}"
        pm2 restart maclock
        sleep 3
        echo -e "${GREEN}✓ 服务已重启${NC}"
        echo ""
        echo -e "${YELLOW}检查服务状态:${NC}"
        pm2 logs maclock --err --lines 5
        exit 0
    fi
fi

echo -e "${YELLOW}未找到有效的 Clerk 密钥${NC}"
echo ""
echo -e "${YELLOW}选项 1: 配置 Clerk 密钥（推荐）${NC}"
echo "  1. 访问 https://dashboard.clerk.com/last-active?path=api-keys"
echo "  2. 复制 Publishable Key 和 Secret Key"
echo "  3. 编辑 .env.local: nano .env.local"
echo "  4. 设置:"
echo "     NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx"
echo "     CLERK_SECRET_KEY=sk_test_xxxxx"
echo "  5. 重启: pm2 restart maclock"
echo ""
echo -e "${YELLOW}选项 2: 临时禁用 Clerk（快速修复）${NC}"
read -p "是否要临时禁用 Clerk? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}备份 layout.tsx...${NC}"
    cp app/layout.tsx app/layout.tsx.bak
    
    echo -e "${YELLOW}修改 layout.tsx 以禁用 Clerk...${NC}"
    # 创建一个临时禁用 Clerk 的版本
    cat > app/layout.tsx << 'EOF'
import type { Metadata } from 'next'
import './globals.css'
import { defaultMetadata } from '@/lib/config'
import { Analytics } from '@/components/Analytics'

export const metadata: Metadata = defaultMetadata

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/icon.svg" />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
EOF
    
    echo -e "${GREEN}✓ layout.tsx 已修改（Clerk 已禁用）${NC}"
    echo -e "${YELLOW}重新构建项目...${NC}"
    npm run build
    echo -e "${YELLOW}重启服务...${NC}"
    pm2 restart maclock
    sleep 3
    echo -e "${GREEN}✓ 服务已重启${NC}"
    echo ""
    echo -e "${YELLOW}注意: 认证功能已禁用，如需恢复请:${NC}"
    echo "  1. 恢复备份: cp app/layout.tsx.bak app/layout.tsx"
    echo "  2. 配置 Clerk 密钥"
    echo "  3. 重新构建和重启"
else
    echo -e "${YELLOW}请手动配置 Clerk 密钥${NC}"
fi


