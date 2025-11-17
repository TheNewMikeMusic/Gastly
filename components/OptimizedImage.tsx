'use client'

import { useReducedMotion } from '@/lib/hooks'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface OptimizedImageProps {
  prefix: string
  alt?: string
  priority?: boolean
  className?: string
  sizes?: string
  fill?: boolean
  width?: number
  height?: number
  fit?: 'contain' | 'cover'
}

export function OptimizedImage({
  prefix,
  alt,
  priority = false,
  className = '',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  fill,
  width,
  height,
  fit = 'contain',
}: OptimizedImageProps) {
  const prefersReducedMotion = useReducedMotion()
  const [imageSrc, setImageSrc] = useState<string>('')
  const [imageError, setImageError] = useState(false)
  
  useEffect(() => {
    // 如果前缀已经包含完整文件名（如 .jpg.webp），直接使用
    if (prefix.includes('.jpg.webp')) {
      setImageSrc(`/${prefix}`)
      return
    }
    
    // 否则尝试添加 .webp 扩展名
    setImageSrc(`/${prefix}.webp`)
  }, [prefix])

  const handleError = () => {
    if (!imageError && !prefix.includes('.jpg.webp')) {
      // 如果 .webp 失败，尝试其他格式
      const alternatives = [
        `/${prefix}.jpg.webp`,
        `/${prefix}.png`,
        `/${prefix}.jpg`,
      ]
      const currentIndex = alternatives.indexOf(imageSrc)
      if (currentIndex < alternatives.length - 1) {
        setImageSrc(alternatives[currentIndex + 1])
      } else {
        setImageError(true)
      }
    } else {
      setImageError(true)
    }
  }

  if (!imageSrc) {
    return null
  }

  return (
    <motion.div
      initial={prefersReducedMotion ? {} : { opacity: 0 }}
      animate={prefersReducedMotion ? {} : { opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden w-full h-full"
      style={fill ? { width: '100%', height: '100%', borderRadius: 'inherit' } : { borderRadius: 'inherit' }}
    >
      {imageError ? (
        <div
          className="bg-gray-200 flex items-center justify-center w-full h-full"
          style={fill ? { width: '100%', height: '100%', borderRadius: 'inherit' } : { width, height, borderRadius: 'inherit' }}
          aria-label={alt || 'Maclock product image'}
        >
          <span className="text-gray-400 text-sm">Image not found</span>
        </div>
      ) : (
        <img
          src={imageSrc}
          alt={alt || 'Maclock product image'}
          className={`w-full h-full ${className}`}
          style={{ 
            objectFit: fit,
            objectPosition: 'center',
            borderRadius: 'inherit',
            display: 'block'
          }}
          loading={priority ? 'eager' : 'lazy'}
          onError={handleError}
        />
      )}
    </motion.div>
  )
}

