# 文件上传指南

## 服务器信息
- **服务器地址**: 38.175.195.104
- **用户名**: root
- **密码**: 0iHSn3CpCpDmlkub
- **远程路径**: /var/www/maclock

## 方法一：使用 WinSCP（推荐，最简单）

1. 下载并安装 WinSCP: https://winscp.net/
2. 打开 WinSCP，点击"新建会话"
3. 填写以下信息：
   - **文件协议**: SFTP
   - **主机名**: 38.175.195.104
   - **端口号**: 22
   - **用户名**: root
   - **密码**: 0iHSn3CpCpDmlkub
4. 点击"登录"
5. 在右侧（服务器端）导航到 `/var/www/maclock`（如果不存在会自动创建）
6. 在左侧（本地）导航到 `deploy-temp` 文件夹
7. 选择 `deploy-temp` 中的所有文件和文件夹
8. 拖拽到右侧的 `/var/www/maclock` 目录
9. 等待上传完成

## 方法二：使用 FileZilla

1. 下载并安装 FileZilla: https://filezilla-project.org/
2. 打开 FileZilla
3. 在顶部输入：
   - **主机**: sftp://38.175.195.104
   - **用户名**: root
   - **密码**: 0iHSn3CpCpDmlkub
   - **端口**: 22
4. 点击"快速连接"
5. 在右侧（服务器端）导航到 `/var/www/maclock`
6. 在左侧（本地）导航到 `deploy-temp` 文件夹
7. 选择所有文件并上传

## 方法三：使用命令行 SCP（需要手动输入密码）

在 PowerShell 或命令提示符中执行：

```powershell
scp -r deploy-temp\* root@38.175.195.104:/var/www/maclock/
```

当提示输入密码时，输入: `0iHSn3CpCpDmlkub`

## 上传完成后

SSH 连接到服务器并执行部署：

```bash
ssh root@38.175.195.104
# 密码: 0iHSn3CpCpDmlkub

cd /var/www/maclock
chmod +x deploy-complete.sh
./deploy-complete.sh
```

## 注意事项

1. 确保 `deploy-temp` 文件夹中的所有文件都已上传
2. 上传完成后，在服务器上执行部署脚本
3. 部署过程可能需要 10-20 分钟，请耐心等待






