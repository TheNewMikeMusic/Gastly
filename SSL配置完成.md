# SSL证书配置完成 ✅

## 配置详情

- **域名**: hello1984.net
- **SSL证书**: Let's Encrypt（免费）
- **证书有效期**: 90天（自动续期）
- **HTTPS访问**: https://hello1984.net
- **HTTP重定向**: 自动重定向到HTTPS

## 证书信息

- **证书位置**: `/etc/letsencrypt/live/hello1984.net/fullchain.pem`
- **私钥位置**: `/etc/letsencrypt/live/hello1984.net/privkey.pem`
- **证书到期时间**: 2026-02-24
- **自动续期**: 已配置（certbot timer）

## Nginx配置

- **配置文件**: `/www/server/nginx/conf/vhost/hello1984.net.conf`
- **HTTP端口**: 80（自动重定向到HTTPS）
- **HTTPS端口**: 443
- **后端代理**: http://localhost:3000

## 验证配置

### 测试HTTPS连接
```bash
curl -I https://hello1984.net
```

### 检查证书信息
```bash
openssl s_client -connect hello1984.net:443 -servername hello1984.net < /dev/null 2>/dev/null | openssl x509 -noout -dates
```

### 测试证书续期
```bash
certbot renew --dry-run
```

## 证书续期

certbot已配置自动续期，无需手动操作。证书会在到期前30天自动续期。

### 手动续期（如果需要）
```bash
certbot renew
systemctl reload nginx
```

## 重要提示

1. ✅ **防火墙**: 确保443端口已开放
2. ✅ **云服务器安全组**: 确保允许443端口入站流量
3. ✅ **DNS解析**: 确保域名正确解析到服务器IP
4. ✅ **证书续期**: certbot会自动处理，无需手动操作

## 访问网站

现在您可以通过以下方式访问网站：
- **HTTPS**: https://hello1984.net
- **HTTP**: http://hello1984.net（会自动重定向到HTTPS）

## 下一步

1. 更新环境变量中的URL为HTTPS
2. 更新Clerk配置中的域名（如果使用）
3. 测试网站功能是否正常

## 故障排除

如果遇到问题：

1. **检查Nginx状态**
   ```bash
   systemctl status nginx
   ```

2. **检查Nginx配置**
   ```bash
   /www/server/nginx/sbin/nginx -t
   ```

3. **查看Nginx日志**
   ```bash
   tail -f /var/log/nginx/maclock-error.log
   ```

4. **检查证书**
   ```bash
   certbot certificates
   ```



