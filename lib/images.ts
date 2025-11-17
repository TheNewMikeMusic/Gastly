const ALLOWED_EXTENSIONS = ['.webp', '.png', '.jpg', '.jpeg', '.avif']

/**
 * 根据前缀匹配图片文件（支持多种扩展名）
 * 会尝试所有可能的扩展名组合
 */
export function getImageByPrefix(prefix: string): {
  src: string
  alt: string
  found: boolean
} {
  // 检查文件名异常（如 .jpg.jpg）
  if (prefix.includes('.jpg.jpg') || prefix.includes('.png.png') || prefix.includes('.webp.webp')) {
    if (typeof window !== 'undefined') {
      console.warn(`[Image Warning] Suspicious filename pattern detected: ${prefix}`)
    }
  }

  // 特殊处理：如果前缀已经包含扩展名，直接使用
  // 例如：maclock_pixel_perfect_detail_apple_clean.jpg.webp
  if (prefix.includes('.jpg.webp')) {
    return {
      src: `/${prefix}`,
      alt: getAltFromPrefix(prefix.replace('.jpg.webp', '')),
      found: true,
    }
  }

  // 尝试所有可能的扩展名组合
  const extensions = ['.webp', '.jpg.webp', '.png', '.jpg', '.jpeg', '.avif']
  
  // 返回第一个可能的路径（Next.js Image 组件会处理 404）
  // Next.js public 目录中的文件应该直接从根路径访问（不需要 /public/ 前缀）
  return {
    src: `/${prefix}${extensions[0]}`,
    alt: getAltFromPrefix(prefix),
    found: true, // 假设存在，由 Next.js Image 处理 404
  }
}

/**
 * 获取图片的所有可能路径（用于回退）
 */
export function getImagePaths(prefix: string): string[] {
  const extensions = ['.webp', '.jpg.webp', '.png', '.jpg', '.jpeg', '.avif']
  return extensions.map(ext => `/${prefix}${ext}`)
}

function getAltFromPrefix(prefix: string): string {
  // 清理前缀中的扩展名
  const cleanPrefix = prefix.replace(/\.(jpg|png|webp|jpeg|avif)(\.(jpg|png|webp|jpeg|avif))?$/i, '')
  
  const altMap: Record<string, string> = {
    maclock_hello_retro_apple_style: 'Maclock retro hello screen',
    maclock_boot_smile_feature_grid_apple_style: 'Maclock boot smile feature grid',
    maclock_boot_ceremony_apple_style: 'Maclock boot ceremony',
    maclock_backlight_adjust_apple_style: 'Maclock backlight adjustment',
    maclock_alarm_modes_apple_style: 'Maclock alarm modes',
    maclock_pixel_perfect_detail_apple_clean: 'Maclock pixel perfect detail',
    maclock_1984_design_reimagined_apple_style: 'Maclock 1984 design reimagined',
    maclock_hello_retro_dawn_apple_style: 'Maclock hello retro dawn',
  }
  return altMap[cleanPrefix] || 'Maclock product image'
}

/**
 * 获取所有图片资源（用于预加载或列表）
 */
export function getAllImagePrefixes(): string[] {
  return [
    'maclock_hello_retro_apple_style',
    'maclock_boot_smile_feature_grid_apple_style',
    'maclock_boot_ceremony_apple_style',
    'maclock_backlight_adjust_apple_style',
    'maclock_alarm_modes_apple_style',
    'maclock_pixel_perfect_detail_apple_clean',
    'maclock_1984_design_reimagined_apple_style',
    'maclock_hello_retro_dawn_apple_style',
  ]
}

