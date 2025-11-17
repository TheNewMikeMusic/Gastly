'use client'

import { OptimizedImage } from '@/components/OptimizedImage'
import { BuyButton } from '@/components/BuyButton'
import { useReducedMotion } from '@/lib/hooks'
import { motion } from 'framer-motion'

export function Hero() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden hero-banner">
      {/* 深蓝到紫色渐变背景层 */}
      <div className="absolute inset-0 hero-bg-dark z-0" />
      
      {/* 简化的动态光效层 */}
      <div className="hero-light-bloom z-0" />
      <motion.div
        className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none z-0"
        animate={prefersReducedMotion ? {} : {
          opacity: [0.2, 0.4, 0.2],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none z-0"
        animate={prefersReducedMotion ? {} : {
          opacity: [0.15, 0.3, 0.15],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      />

      {/* 主要内容容器 */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
          
          {/* 左侧：文字内容 */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 text-center lg:text-left space-y-6 lg:space-y-8 order-2 lg:order-1"
          >
            <motion.h1
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
              animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight"
            >
              Hello, Maclock
            </motion.h1>
            
            <motion.p
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
              animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg sm:text-xl lg:text-2xl text-gray-200 leading-relaxed max-w-2xl mx-auto lg:mx-0"
            >
              A beautifully reimagined digital clock that brings the warmth of 1980s computing into your modern workspace.
            </motion.p>

            <motion.p
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
              animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-base sm:text-lg text-gray-300 leading-relaxed max-w-xl mx-auto lg:mx-0"
            >
              Every pixel carefully crafted. Every detail thoughtfully considered. A timeless design that honors the past while embracing the future.
            </motion.p>

            {/* 核心卖点 */}
            <motion.div
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
              animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap gap-4 sm:gap-6 justify-center lg:justify-start text-sm sm:text-base text-gray-300"
            >
              <div className="flex items-center gap-2">
                <span className="text-white text-lg">✓</span>
                <span>Pixel-perfect retro design</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white text-lg">✓</span>
                <span>Modern reliability</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white text-lg">✓</span>
                <span>Thoughtful craftsmanship</span>
              </div>
            </motion.div>

            {/* 购买按钮 */}
            <motion.div
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
              animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex justify-center lg:justify-start pt-4"
            >
              <BuyButton size="lg" variant="secondary" />
            </motion.div>
          </motion.div>

          {/* 右侧：产品图片 */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="flex-1 w-full max-w-2xl lg:max-w-3xl order-1 lg:order-2"
          >
            <div className="relative aspect-[4/3] lg:aspect-square w-full">
              <OptimizedImage
                prefix="maclock_hello_retro_dawn_apple_style"
                priority
                fill
                fit="contain"
                sizes="(max-width: 1024px) 100vw, 50vw"
                alt="Maclock retro hello screen at dawn displaying time"
                className="object-contain"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
