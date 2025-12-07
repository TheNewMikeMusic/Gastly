'use client'

import Image from 'next/image'
import { useReducedMotion } from '@/lib/hooks'
import { motion } from 'framer-motion'

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
  
  // 处理图片路径：确保以 / 开头
  const imageSrc = prefix.startsWith('/') ? prefix : `/${prefix}`
  
  // 将 fit 转换为 Next.js Image 的 objectFit
  const objectFit = fit === 'fill' ? 'fill' : fit

  return (
    <motion.div
      initial={prefersReducedMotion ? {} : { opacity: 0 }}
      animate={prefersReducedMotion ? {} : { opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="relative w-full h-full"
      style={fill ? { width: '100%', height: '100%' } : {}}
    >
      {fill ? (
        <Image
          src={imageSrc}
          alt={alt || 'Maclock product image'}
          fill
          priority={priority}
          sizes={sizes}
          className={className}
          style={{ objectFit, border: 'none', outline: 'none' }}
          quality={priority ? 90 : 75}
        />
      ) : (
        <Image
          src={imageSrc}
          alt={alt || 'Maclock product image'}
          width={width || 800}
          height={height || 600}
          priority={priority}
          sizes={sizes}
          className={className}
          style={{ objectFit, border: 'none', outline: 'none' }}
          quality={priority ? 90 : 75}
        />
      )}
    </motion.div>
  )
}

