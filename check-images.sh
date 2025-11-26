#!/bin/bash
# 检查图片文件

echo "检查public目录..."
ls -la public/ | grep product-spin | head -10

echo ""
echo "检查public目录文件总数..."
ls public/ | wc -l

echo ""
echo "检查是否有product-spin文件..."
ls public/product-spin-*.webp 2>/dev/null | head -5 || echo "没有找到product-spin文件"

echo ""
echo "检查public目录结构..."
ls -la public/ | head -20





