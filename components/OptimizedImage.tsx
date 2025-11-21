'use client'

import { useReducedMotion, useIntersectionObserver } from '@/lib/hooks'
import { motion } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'

interface OptimizedImageProps {
  prefix: string
  alt?: string
  priority?: boolean
  className?: string
  sizes?: string
  fill?: boolean
  width?: number
  height?: number
  fit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
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
  fit = 'cover',
}: OptimizedImageProps) {
  const prefersReducedMotion = useReducedMotion()
  const [imageSrc, setImageSrc] = useState<string>('')
  const [imageError, setImageError] = useState(false)
  const [isVisible, setIsVisible] = useState(priority) // 优先级图片默认可见
  const containerRef = useRef<HTMLDivElement>(null)
  
  // 使用Intersection Observer检测图片是否进入视口
  const isIntersecting = useIntersectionObserver(containerRef, { 
    threshold: 0.1,
    rootMargin: '50px' // 提前50px开始加载
  })
  
  useEffect(() => {
    if (isIntersecting || priority) {
      setIsVisible(true)
    }
  }, [isIntersecting, priority])
  
  useEffect(() => {
    // 如果前缀已经包含完整文件名（如 .jpg.webp、.jpg 或 .webp），直接使用
    if (prefix.includes('.jpg.webp') || prefix.endsWith('.jpg') || prefix.endsWith('.webp') || prefix.endsWith('.png') || prefix.endsWith('.avif')) {
      setImageSrc(`/${prefix}`)
      return
    }
    
    // 否则尝试添加 .webp 扩展名
    setImageSrc(`/${prefix}.webp`)
  }, [prefix])

  const handleError = () => {
    if (!imageError && !prefix.includes('.jpg.webp') && !prefix.endsWith('.jpg') && !prefix.endsWith('.webp')) {
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

  // 确定加载策略：优先级图片或进入视口的图片使用eager loading
  const shouldUseEager = priority || isVisible
  const loadingStrategy = shouldUseEager ? 'eager' : 'lazy'
  const fetchPriorityValue = priority ? 'high' : (isVisible ? 'high' : 'auto')
  const decodingStrategy = priority ? 'sync' : (isVisible ? 'sync' : 'async')

  return (
    <motion.div
      ref={containerRef}
      initial={prefersReducedMotion ? {} : { opacity: 0 }}
      animate={prefersReducedMotion ? {} : { opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="relative w-full h-full"
      style={fill ? { width: '100%', height: '100%' } : {}}
    >
      {imageError ? (
        <div
          className={`bg-gray-200 flex items-center justify-center w-full h-full ${className}`}
          style={fill ? { width: '100%', height: '100%' } : { width, height }}
          aria-label={alt || 'Maclock product image'}
        >
          <span className="text-gray-400 text-sm">Image not found</span>
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageSrc}
          alt={alt || 'Maclock product image'}
          className={`w-full h-full ${className}`}
          style={fill ? { 
            width: '100%', 
            height: '100%', 
            objectFit: fit,
            objectPosition: 'center'
          } : {
            width: width || '100%',
            height: height || '100%',
            objectFit: fit,
            objectPosition: 'center'
          }}
          loading={loadingStrategy}
          fetchPriority={fetchPriorityValue}
          decoding={decodingStrategy}
          onError={handleError}
        />
      )}
    </motion.div>
  )
}

