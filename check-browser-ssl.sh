#!/bin/bash

echo "=========================================="
echo "检查服务器SSL配置（供浏览器对比）"
echo "=========================================="
echo ""

echo "1. 检查证书信息..."
echo | openssl s_client -connect hello1984.net:443 -servername hello1984.net 2>&1 | openssl x509 -noout -text 2>/dev/null | grep -E "(Subject:|Issuer:|DNS:)" | head -5

echo ""
echo "2. 检查HSTS头..."
curl -I https://hello1984.net 2>&1 | grep -i "strict-transport"

echo ""
echo "3. 检查HTTP响应头..."
curl -I https://hello1984.net 2>&1 | head -10

echo ""
echo "4. 测试证书链..."
echo | openssl s_client -connect hello1984.net:443 -servername hello1984.net 2>&1 | grep -A 10 "Certificate chain"

echo ""
echo "=========================================="
echo "如果服务器配置正确，问题在浏览器缓存"
echo "请按照清除浏览器SSL缓存.md中的步骤操作"
echo "=========================================="



