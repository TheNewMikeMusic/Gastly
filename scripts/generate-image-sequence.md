# 从视频生成图片序列指南

## 方法一：使用 FFmpeg（推荐）

### 1. 安装 FFmpeg

**Windows:**
```powershell
# 使用 Chocolatey
choco install ffmpeg

# 或下载：https://ffmpeg.org/download.html
```

**macOS:**
```bash
brew install ffmpeg
```

**Linux:**
```bash
sudo apt install ffmpeg
```

### 2. 提取视频帧为图片序列

```bash
# 提取 60 帧（对应 360 度旋转）
ffmpeg -i public/videos/product-spin.mp4 -vf "fps=30,scale=1920:1080" -frames:v 60 public/product-spin-%03d.webp

# 参数说明：
# -i: 输入视频文件
# -vf "fps=30": 设置帧率为 30fps（可根据视频调整）
# scale=1920:1080: 设置输出尺寸（根据需求调整）
# -frames:v 60: 提取 60 帧
# %03d: 3 位数字编号（000, 001, 002...）
# .webp: 输出格式（推荐 WebP，文件小）

# 如果视频时长是 2 秒，60fps，可以这样提取：
ffmpeg -i public/videos/product-spin.mp4 -vf "fps=30" -frames:v 60 public/product-spin-%03d.webp

# 或者根据视频时长自动计算帧数：
# 假设视频是 2 秒，想要 60 帧
ffmpeg -i public/videos/product-spin.mp4 -vf "fps=30" -t 2 public/product-spin-%03d.webp
```

### 3. 优化图片（可选，进一步减小文件大小）

```bash
# 使用 cwebp 压缩（需要安装 WebP 工具）
# Windows: choco install webp
# macOS: brew install webp

# 批量压缩
for i in {000..059}; do
  cwebp -q 85 public/product-spin-$i.webp -o public/product-spin-$i-optimized.webp
done
```

## 方法二：使用在线工具

1. **CloudConvert**: https://cloudconvert.com/mp4-to-webp
   - 上传视频
   - 选择输出格式为 WebP
   - 设置帧提取参数

2. **EZGIF**: https://ezgif.com/split
   - 上传视频
   - 选择"Split to frames"
   - 下载所有帧

## 方法三：使用 Python 脚本（自动化）

创建 `scripts/extract-frames.py`:

```python
import cv2
import os

def extract_frames(video_path, output_dir, total_frames=60):
    """从视频提取指定数量的帧"""
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    cap = cv2.VideoCapture(video_path)
    fps = cap.get(cv2.CAP_PROP_FPS)
    total_video_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    
    # 计算采样间隔
    frame_interval = max(1, total_video_frames // total_frames)
    
    frame_count = 0
    saved_count = 0
    
    while saved_count < total_frames:
        ret, frame = cap.read()
        if not ret:
            break
        
        if frame_count % frame_interval == 0:
            # 保存为 WebP
            output_path = os.path.join(
                output_dir, 
                f'product-spin-{saved_count:03d}.webp'
            )
            cv2.imwrite(output_path, frame, [cv2.IMWRITE_WEBP_QUALITY, 85])
            saved_count += 1
            print(f'已保存: {output_path}')
        
        frame_count += 1
    
    cap.release()
    print(f'完成！共提取 {saved_count} 帧')

if __name__ == '__main__':
    extract_frames(
        'public/videos/product-spin.mp4',
        'public',
        total_frames=60
    )
```

运行：
```bash
pip install opencv-python
python scripts/extract-frames.py
```

## 推荐的图片序列配置

- **帧数**: 60 帧（360 度旋转，每 6 度一帧）
- **格式**: WebP（最佳压缩比）
- **质量**: 85-90（平衡质量和文件大小）
- **尺寸**: 
  - 桌面端：1920x1080 或更高
  - 移动端：1280x720（可以使用响应式图片）

## 文件命名规范

确保图片文件命名为：
- `product-spin-000.webp`
- `product-spin-001.webp`
- `product-spin-002.webp`
- ...
- `product-spin-059.webp`

## 性能优化建议

1. **使用 WebP 格式**：比 PNG/JPG 小 30-50%
2. **合理设置帧数**：60 帧足够流畅，不需要太多
3. **压缩质量**：85-90 在视觉上几乎无损
4. **响应式图片**：可以为移动端准备更小的版本

## 验证

生成图片序列后，检查：
1. 文件数量是否正确（60 个文件）
2. 文件命名是否连续（000-059）
3. 文件大小是否合理（每张图片 < 200KB 为佳）
4. 图片质量是否满足要求





