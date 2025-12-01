/**
 * 将 Video.mp4 转换为图片序列
 * 使用 ffmpeg 提取帧并转换为 WebP 格式
 * 
 * 运行方式：
 * 1. 确保已安装 ffmpeg: brew install ffmpeg (macOS) 或 apt-get install ffmpeg (Linux)
 * 2. node scripts/video-to-frames.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const VIDEO_PATH = path.join(__dirname, '../public/Gastly/Video.mp4');
const OUTPUT_DIR = path.join(__dirname, '../public/Gastly');
const TOTAL_FRAMES = 141; // 提取所有帧

// 检查视频文件是否存在
if (!fs.existsSync(VIDEO_PATH)) {
  console.error(`错误: 视频文件不存在: ${VIDEO_PATH}`);
  process.exit(1);
}

// 确保输出目录存在
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log('开始提取视频帧...');
console.log(`视频路径: ${VIDEO_PATH}`);
console.log(`输出目录: ${OUTPUT_DIR}`);
console.log(`总帧数: ${TOTAL_FRAMES}`);

try {
  // 使用 ffmpeg 提取帧
  // -i: 输入文件
  // -vf "select=not(mod(n\,X))": 每 X 帧提取一帧（X = 总帧数 / 视频总帧数）
  // -vsync vfr: 可变帧率
  // -q:v 2: 高质量（1-31，数字越小质量越高）
  // -frame_pts 1: 使用帧时间戳命名
  
  // 首先获取视频总帧数
  const getTotalFramesCmd = `ffprobe -v error -select_streams v:0 -count_packets -show_entries stream=nb_read_packets -of csv=p=0 "${VIDEO_PATH}"`;
  let videoTotalFrames;
  try {
    videoTotalFrames = parseInt(execSync(getTotalFramesCmd, { encoding: 'utf-8' }).trim());
  } catch (e) {
    // 如果无法获取，使用默认值
    videoTotalFrames = 300; // 假设视频有 300 帧
    console.warn('无法获取视频总帧数，使用默认值:', videoTotalFrames);
  }
  
  const frameInterval = Math.max(1, Math.floor(videoTotalFrames / TOTAL_FRAMES));
  
  console.log(`视频总帧数: ${videoTotalFrames}`);
  console.log(`帧间隔: ${frameInterval}`);
  
  // 先清理旧文件
  console.log('清理旧文件...');
  for (let i = 0; i < TOTAL_FRAMES; i++) {
    const oldPath = path.join(OUTPUT_DIR, `spin-${String(i).padStart(3, '0')}.webp`);
    if (fs.existsSync(oldPath)) {
      fs.unlinkSync(oldPath);
    }
  }
  
  // 清理临时文件
  fs.readdirSync(OUTPUT_DIR)
    .filter(f => f.startsWith('temp-spin-') || (f.startsWith('spin-') && f.endsWith('.webp')))
    .forEach(file => {
      try {
        fs.unlinkSync(path.join(OUTPUT_DIR, file));
      } catch (e) {
        // 忽略错误
      }
    });
  
  // 提取所有帧，使用高质量设置
  // 视频有141帧，24fps，时长5.88秒
  // 先提取为PNG（更可靠），然后转换为WebP
  console.log(`提取所有 ${videoTotalFrames} 帧为PNG...`);
  
  const tempDir = path.join(OUTPUT_DIR, 'temp_png');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  
  const extractCmd = `ffmpeg -i "${VIDEO_PATH}" -vsync 0 -vf "scale=-1:1080" -q:v 1 "${tempDir}/frame-%05d.png" -y`;
  
  console.log('执行命令:', extractCmd);
  execSync(extractCmd, { stdio: 'inherit' });
  
  console.log('PNG提取完成，开始转换为WebP...');
  
  // 获取所有PNG文件
  const pngFiles = fs.readdirSync(tempDir)
    .filter(f => f.startsWith('frame-') && f.endsWith('.png'))
    .sort((a, b) => {
      const numA = parseInt(a.match(/frame-(\d+)/)?.[1] || '0');
      const numB = parseInt(b.match(/frame-(\d+)/)?.[1] || '0');
      return numA - numB;
    });
  
  console.log(`找到 ${pngFiles.length} 个PNG文件`);
  
  // 转换为WebP
  let convertedCount = 0;
  for (let i = 0; i < Math.min(pngFiles.length, TOTAL_FRAMES); i++) {
    const pngFile = pngFiles[i];
    const pngPath = path.join(tempDir, pngFile);
    const webpPath = path.join(OUTPUT_DIR, `spin-${String(i).padStart(3, '0')}.webp`);
    
    try {
      execSync(`ffmpeg -i "${pngPath}" -q:v 1 "${webpPath}" -y -loglevel error`, { stdio: 'pipe' });
      convertedCount++;
    } catch (e) {
      console.warn(`转换 ${pngFile} 失败:`, e.message);
    }
  }
  
  // 清理临时PNG文件
  fs.readdirSync(tempDir).forEach(file => {
    try {
      fs.unlinkSync(path.join(tempDir, file));
    } catch (e) {
      // 忽略错误
    }
  });
  try {
    fs.rmdirSync(tempDir);
  } catch (e) {
    // 忽略错误
  }
  
  const finalFiles = fs.readdirSync(OUTPUT_DIR)
    .filter(f => f.startsWith('spin-') && f.endsWith('.webp'))
    .sort((a, b) => {
      const numA = parseInt(a.match(/spin-(\d+)/)?.[1] || '0');
      const numB = parseInt(b.match(/spin-(\d+)/)?.[1] || '0');
      return numA - numB;
    });
  
  console.log(`\n完成！已生成 ${finalFiles.length} 帧WebP图片`);
  console.log(`文件保存在: ${OUTPUT_DIR}`);
  
  if (finalFiles.length < TOTAL_FRAMES) {
    console.warn(`警告: 只生成了 ${finalFiles.length} 帧，预期 ${TOTAL_FRAMES} 帧`);
  }
  
} catch (error) {
  console.error('错误:', error.message);
  console.error('\n请确保已安装 ffmpeg:');
  console.error('  macOS: brew install ffmpeg');
  console.error('  Linux: apt-get install ffmpeg 或 yum install ffmpeg');
  console.error('  Windows: 下载并安装 https://ffmpeg.org/download.html');
  process.exit(1);
}

