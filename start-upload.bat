@echo off
chcp 65001 >nul
echo ========================================
echo Maclock 项目文件上传
echo ========================================
echo.
echo 服务器: 38.175.195.104
echo 用户名: root
echo.
echo 重要提示: 当提示输入密码时，请输入: 0iHSn3CpCpDmlkub
echo.
echo 开始上传文件...
echo.

scp -r -o StrictHostKeyChecking=no "deploy-temp\*" root@38.175.195.104:/var/www/maclock/

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo 上传完成！
    echo ========================================
    echo.
    echo 下一步: SSH 连接到服务器并执行部署
    echo   ssh root@38.175.195.104
    echo   密码: 0iHSn3CpCpDmlkub
    echo.
    echo 然后在服务器上执行:
    echo   cd /var/www/maclock
    echo   chmod +x deploy-complete.sh
    echo   ./deploy-complete.sh
    echo.
    pause
) else (
    echo.
    echo ========================================
    echo 上传失败！
    echo ========================================
    echo.
    echo 请使用以下方法之一:
    echo.
    echo 1. 使用 WinSCP (推荐):
    echo    下载: https://winscp.net/
    echo    服务器: sftp://38.175.195.104
    echo    用户名: root
    echo    密码: 0iHSn3CpCpDmlkub
    echo    远程路径: /var/www/maclock
    echo.
    echo 2. 使用 FileZilla:
    echo    下载: https://filezilla-project.org/
    echo    服务器: sftp://38.175.195.104
    echo    用户名: root
    echo    密码: 0iHSn3CpCpDmlkub
    echo    远程路径: /var/www/maclock
    echo.
    pause
)






