# 生成产品旋转图片序列的 PowerShell 脚本

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "产品旋转图片序列生成工具" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查 Python
Write-Host "检查 Python 环境..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✓ Python 已安装: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Python 未安装，请先安装 Python 3.7+" -ForegroundColor Red
    Write-Host "下载地址: https://www.python.org/downloads/" -ForegroundColor Yellow
    exit 1
}

# 检查 OpenCV
Write-Host "检查 OpenCV..." -ForegroundColor Yellow
try {
    python -c "import cv2; print('OpenCV installed')" 2>&1 | Out-Null
    Write-Host "✓ OpenCV 已安装" -ForegroundColor Green
} catch {
    Write-Host "✗ OpenCV 未安装，正在安装..." -ForegroundColor Yellow
    Write-Host "请运行: python -m pip install opencv-python" -ForegroundColor Yellow
    Write-Host ""
    $install = Read-Host "是否现在安装? (Y/N)"
    if ($install -eq "Y" -or $install -eq "y") {
        python -m pip install opencv-python
        if ($LASTEXITCODE -ne 0) {
            Write-Host "✗ 安装失败，请手动运行: python -m pip install opencv-python" -ForegroundColor Red
            exit 1
        }
        Write-Host "✓ OpenCV 安装成功" -ForegroundColor Green
    } else {
        Write-Host "请先安装 OpenCV 后再运行此脚本" -ForegroundColor Yellow
        exit 1
    }
}

# 检查视频文件
Write-Host "检查视频文件..." -ForegroundColor Yellow
$videoPath = "public/videos/product-spin.mp4"
if (Test-Path $videoPath) {
    Write-Host "✓ 找到视频文件: $videoPath" -ForegroundColor Green
} else {
    Write-Host "✗ 视频文件不存在: $videoPath" -ForegroundColor Red
    Write-Host "请确保视频文件存在后再运行此脚本" -ForegroundColor Yellow
    exit 1
}

# 运行提取脚本
Write-Host ""
Write-Host "开始提取图片序列..." -ForegroundColor Cyan
Write-Host ""

python scripts/extract-frames.py

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "✓ 图片序列生成成功！" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "下一步:" -ForegroundColor Yellow
    Write-Host "1. 检查 public/ 目录下的图片文件" -ForegroundColor White
    Write-Host "2. 确保文件命名正确: product-spin-000.webp 到 product-spin-059.webp" -ForegroundColor White
    Write-Host "3. 重启开发服务器测试效果" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "✗ 图片序列生成失败" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "请检查错误信息并重试" -ForegroundColor Yellow
    Write-Host ""
}


