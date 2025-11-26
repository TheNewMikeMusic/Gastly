#!/usr/bin/env python3
"""
从视频提取图片序列的工具脚本
用法: python scripts/extract-frames.py [视频路径] [输出目录] [总帧数]
"""

import cv2
import os
import sys
from pathlib import Path

def extract_frames(video_path, output_dir, total_frames=60, image_format='webp', quality=85):
    """
    从视频提取指定数量的帧
    
    Args:
        video_path: 视频文件路径
        output_dir: 输出目录
        total_frames: 要提取的总帧数
        image_format: 图片格式 ('webp', 'jpg', 'png')
        quality: 图片质量 (1-100，仅对 webp 和 jpg 有效)
    """
    if not os.path.exists(video_path):
        print(f'错误: 视频文件不存在: {video_path}')
        return False
    
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        print(f'已创建输出目录: {output_dir}')
    
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print(f'错误: 无法打开视频文件: {video_path}')
        return False
    
    fps = cap.get(cv2.CAP_PROP_FPS)
    total_video_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    duration = total_video_frames / fps if fps > 0 else 0
    
    print(f'视频信息:')
    print(f'  - 总帧数: {total_video_frames}')
    print(f'  - 帧率: {fps:.2f} fps')
    print(f'  - 时长: {duration:.2f} 秒')
    print(f'  - 目标提取: {total_frames} 帧')
    
    # 计算采样间隔
    if total_video_frames <= total_frames:
        frame_interval = 1
    else:
        frame_interval = max(1, total_video_frames // total_frames)
    
    print(f'  - 采样间隔: 每 {frame_interval} 帧提取 1 帧')
    
    frame_count = 0
    saved_count = 0
    
    # 设置编码参数
    encode_params = []
    if image_format.lower() == 'webp':
        encode_params = [cv2.IMWRITE_WEBP_QUALITY, quality]
    elif image_format.lower() == 'jpg' or image_format.lower() == 'jpeg':
        encode_params = [cv2.IMWRITE_JPEG_QUALITY, quality]
    
    print(f'\n开始提取帧...')
    
    while saved_count < total_frames:
        ret, frame = cap.read()
        if not ret:
            print(f'\n警告: 视频已到末尾，但只提取了 {saved_count}/{total_frames} 帧')
            break
        
        if frame_count % frame_interval == 0:
            # 生成文件名
            frame_number = f'{saved_count:03d}'
            filename = f'product-spin-{frame_number}.{image_format}'
            output_path = os.path.join(output_dir, filename)
            
            # 保存图片
            success = cv2.imwrite(output_path, frame, encode_params)
            
            if success:
                file_size = os.path.getsize(output_path) / 1024  # KB
                saved_count += 1
                print(f'[{saved_count}/{total_frames}] 已保存: {filename} ({file_size:.1f} KB)', end='\r')
            else:
                print(f'\n错误: 无法保存图片: {output_path}')
        
        frame_count += 1
    
    cap.release()
    
    print(f'\n\n完成！共提取 {saved_count} 帧到 {output_dir}')
    
    # 统计文件大小
    total_size = 0
    for i in range(saved_count):
        filename = f'product-spin-{i:03d}.{image_format}'
        filepath = os.path.join(output_dir, filename)
        if os.path.exists(filepath):
            total_size += os.path.getsize(filepath)
    
    print(f'总文件大小: {total_size / 1024 / 1024:.2f} MB')
    print(f'平均每帧: {total_size / saved_count / 1024:.1f} KB')
    
    return True

if __name__ == '__main__':
    # 默认参数
    video_path = 'public/videos/product-spin.mp4'
    output_dir = 'public'
    total_frames = 60
    image_format = 'webp'
    quality = 85
    
    # 解析命令行参数
    if len(sys.argv) > 1:
        video_path = sys.argv[1]
    if len(sys.argv) > 2:
        output_dir = sys.argv[2]
    if len(sys.argv) > 3:
        total_frames = int(sys.argv[3])
    if len(sys.argv) > 4:
        image_format = sys.argv[4]
    if len(sys.argv) > 5:
        quality = int(sys.argv[5])
    
    print('=' * 60)
    print('视频帧提取工具')
    print('=' * 60)
    print(f'视频路径: {video_path}')
    print(f'输出目录: {output_dir}')
    print(f'总帧数: {total_frames}')
    print(f'图片格式: {image_format}')
    print(f'质量: {quality}')
    print('=' * 60)
    
    success = extract_frames(video_path, output_dir, total_frames, image_format, quality)
    
    if success:
        print('\n✅ 提取成功！')
        print('\n下一步:')
        print('1. 检查生成的图片文件')
        print('2. 在页面中使用 ProductSpinImageSequence 组件')
        print('3. 确保图片文件命名正确: product-spin-000.webp 到 product-spin-059.webp')
    else:
        print('\n❌ 提取失败，请检查错误信息')
        sys.exit(1)





