# HTTPS配置指南

## 概述

本指南将帮助您为Maclock应用配置HTTPS，解决iOS设备"Not Secure"警告问题。

## 前置要求

- Debian/Ubuntu服务器
- Root或sudo权限
- 服务器IP地址: 38.175.195.104

## 快速开始

### 1. 上传配置文件到服务器

将以下文件上传到服务器：
- `nginx-maclock.conf` - Nginx配置文件
- `setup-https.sh` - 自动化安装脚本

### 2. 执行安装脚本

在服务器上执行：

```bash
cd /var/www/maclock
chmod +x setup-https.sh
sudo ./setup-https.sh
```

### 3. 更新环境变量

编辑 `/var/www/maclock/.env.local`：

```bash
NEXT_PUBLIC_URL=https://38.175.195.104
```

### 4. 重启应用

```bash
cd /var/www/maclock
npm run build
pm2 restart maclock
```

## 手动配置步骤

如果自动脚本失败，可以手动执行以下步骤：

### 1. 安装Nginx

```bash
sudo apt-get update
sudo apt-get install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

### 2. 生成SSL证书

```bash
sudo mkdir -p /etc/nginx/ssl
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/maclock.key \
    -out /etc/nginx/ssl/maclock.crt \
    -subj "/C=US/ST=State/L=City/O=Hello1984/CN=38.175.195.104" \
    -addext "subjectAltName=IP:38.175.195.104"

sudo chmod 600 /etc/nginx/ssl/maclock.key
sudo chmod 644 /etc/nginx/ssl/maclock.crt
```

### 3. 配置Nginx

```bash
sudo cp nginx-maclock.conf /etc/nginx/sites-available/maclock
sudo ln -s /etc/nginx/sites-available/maclock /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 4. 配置防火墙

```bash
# UFW
sudo ufw allow 443/tcp
sudo ufw allow 80/tcp

# 或 firewalld
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --reload
```

## iOS设备访问说明

由于使用自签名证书，iOS Safari会显示安全警告：

1. 访问 `https://38.175.195.104`
2. Safari会显示"此连接不是私密连接"
3. 点击"显示详细信息"
4. 点击"访问此网站"
5. 或者：设置 > 通用 > 关于本机 > 证书信任设置 > 启用完全信任

## 验证HTTPS配置

```bash
# 检查Nginx状态
sudo systemctl status nginx

# 检查端口监听
sudo netstat -tulpn | grep :443

# 测试HTTPS连接
curl -k https://38.175.195.104
```

## 故障排除

### Nginx配置错误

```bash
sudo nginx -t
sudo tail -f /var/log/nginx/error.log
```

### 证书问题

```bash
# 检查证书
sudo openssl x509 -in /etc/nginx/ssl/maclock.crt -text -noout

# 重新生成证书
sudo rm /etc/nginx/ssl/maclock.*
# 然后重新执行生成命令
```

### 端口被占用

```bash
# 检查端口占用
sudo lsof -i :443
sudo lsof -i :80
```

## 注意事项

1. **自签名证书警告**: 浏览器会显示安全警告，这是正常的
2. **证书有效期**: 证书有效期为1年，到期前需要重新生成
3. **生产环境**: 建议使用域名+Let's Encrypt证书获得更好的安全性
4. **性能**: Nginx反向代理会略微增加延迟，但提供更好的安全性和性能

## 更新证书

证书到期前（1年），重新生成：

```bash
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/maclock.key \
    -out /etc/nginx/ssl/maclock.crt \
    -subj "/C=US/ST=State/L=City/O=Hello1984/CN=38.175.195.104" \
    -addext "subjectAltName=IP:38.175.195.104"

sudo systemctl reload nginx
```


