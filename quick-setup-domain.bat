@echo off
echo ==========================================
echo 配置域名: hello1984.net
echo ==========================================
echo.
echo 步骤1: 上传脚本到服务器
echo 提示: 请输入密码: 0iHSn3CpCpDmlkub
echo.
scp -o StrictHostKeyChecking=no domain-setup.sh root@38.175.195.104:/tmp/
echo.
echo 步骤2: 执行配置脚本
echo 提示: 请输入密码: 0iHSn3CpCpDmlkub
echo.
ssh -o StrictHostKeyChecking=no root@38.175.195.104 "chmod +x /tmp/domain-setup.sh && bash /tmp/domain-setup.sh"
echo.
echo 完成！
pause



