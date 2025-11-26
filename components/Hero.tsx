'use client'

import Link from 'next/link'
import { OptimizedImage } from '@/components/OptimizedImage'
import { BuyButton } from '@/components/BuyButton'
import { StockStatus } from '@/components/StockStatus'
import { ProductPrice } from '@/components/ProductPrice'
import { useReducedMotion } from '@/lib/hooks'
import { motion } from 'framer-motion'
import { useEffect } from 'react'

export function Hero() {
  const prefersReducedMotion = useReducedMotion()

  // 预加载Hero图片
  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = '/Hello1084/retro-mac-clock-hello-1984-classic-smiley-icon.webp'
    link.as = 'image'
    link.setAttribute('fetchpriority', 'high')
    document.head.appendChild(link)
    
    return () => {
      document.head.removeChild(link)
    }
  }, [])

  return (
    <section className="relative w-full min-h-screen flex items-center hero-banner mobile-hero pt-12 sm:pt-20 lg:pt-12 pb-20 sm:pb-24 lg:pb-32 safe-area-top">
      <div className="absolute inset-0 hero-bg-dark" />
      <div className="hero-light-bloom" />
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 lg:py-28">
        <div className="flex flex-col-reverse lg:flex-row items-stretch gap-8 sm:gap-12 lg:gap-16">
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 24 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="w-full lg:max-w-lg text-center lg:text-left flex flex-col justify-center"
          >
            <div className="hero-panel h-full space-y-8 sm:space-y-10 lg:space-y-8">
              {/* 标题区域 - 增加间距 */}
              <div className="space-y-4 sm:space-y-5">
                <motion.h1 
                  initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                  animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                  className="text-apple-display font-apple-semibold text-[#1d1d1f]"
                >
                  Introducing
                </motion.h1>
                <motion.p 
                  initial={prefersReducedMotion ? {} : { opacity: 0, y: 16 }}
                  animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
                  className="text-apple-body font-apple-normal text-gray-600 max-w-xl mx-auto lg:mx-0"
                >
                  A miniature Macintosh alarm clock for today — pixel-perfect, gently analog, quietly dependable.
                </motion.p>
              </div>
              
              {/* 价格显示 - 更突出的间距 */}
              <motion.div
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 12 }}
                animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
                className="pt-4 sm:pt-6"
              >
                <ProductPrice variant="hero" />
              </motion.div>

              {/* 按钮和状态信息 - 优化间距和布局 */}
              <div className="space-y-5 sm:space-y-6 pt-2">
                {/* 按钮组 - 手机端全宽，更好的间距 */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                  <BuyButton 
                    size="lg" 
                    variant="primary" 
                    className="w-full sm:w-auto min-h-[52px] sm:min-h-[56px] text-apple-body font-apple-semibold flex-shrink-0 touch-target" 
                  />
                  <Link
                    href="#features"
                    className="w-full sm:w-auto rounded-full border border-black/12 bg-white/80 backdrop-blur-sm px-6 py-3.5 sm:py-4 text-apple-body font-apple-semibold text-gray-900 hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 ease-apple-standard focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/40 focus-visible:ring-offset-2 text-center touch-manipulation min-h-[52px] sm:min-h-[56px] flex items-center justify-center touch-target"
                  >
                    Explore features
                  </Link>
                </div>
                
                {/* 库存状态和配送信息 - 更清晰的层次 */}
                <div className="flex flex-col gap-3 sm:gap-3.5 pt-2">
                  <div className="flex justify-center lg:justify-start">
                    <StockStatus productId="maclock-default" />
                  </div>
                  <p className="text-apple-caption font-apple-normal text-gray-500">
                    Worldwide delivery + 30-day returns included.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.96 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="w-full lg:max-w-lg"
          >
            <div className="hero-panel h-full overflow-hidden">
              <div className="relative w-full h-full rounded-[2rem]">
                <OptimizedImage
                  prefix="Hello1084/retro-mac-clock-hello-1984-classic-smiley-icon.webp"
                  priority
                  fill
                  fit="cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  alt="Maclock showing the classic Macintosh hello screen on a muted desk background"
                  className="rounded-[2rem]"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent via-[#edeff2]/50 to-[#edeff2]" />
    </section>
  )
}
