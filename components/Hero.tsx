'use client'

import Link from 'next/link'
import { OptimizedImage } from '@/components/OptimizedImage'
import { BuyButton } from '@/components/BuyButton'
import { StockStatus } from '@/components/StockStatus'
import { ProductPrice } from '@/components/ProductPrice'
import { useReducedMotion } from '@/lib/hooks'
import { useGBASound } from '@/lib/hooks/useGBASound'
import { motion } from 'framer-motion'
import { useEffect } from 'react'

export function Hero() {
  const prefersReducedMotion = useReducedMotion()
  const { playHoverSound } = useGBASound()

  // 预加载Hero图片
  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = '/Gastly/Banner.png'
    link.as = 'image'
    link.setAttribute('fetchpriority', 'high')
    document.head.appendChild(link)
    
    return () => {
      document.head.removeChild(link)
    }
  }, [])

  return (
    <>
      {/* 桌面版：Banner 作为全宽背景，内容叠加 */}
      <section className="hidden lg:block relative w-full min-h-screen flex items-end hero-banner overflow-hidden">
        {/* Banner 作为全宽背景，从导航栏下方开始 */}
        <div className="absolute inset-0 w-full h-full pt-20">
          <OptimizedImage
            prefix="Gastly/Banner.png"
            priority
            fill
            fit="cover"
            sizes="100vw"
            alt="Gastly Humidifier 2.1 in a mystical graveyard scene"
            className="object-cover"
          />
          {/* 深色遮罩层，确保文字可读性 */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
        </div>
        
        {/* 内容叠加在 Banner 上，位置靠下 */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="flex items-end min-h-[calc(100vh-5rem)] pb-16 lg:pb-24">
            <div className="grid grid-cols-12 gap-8 w-full">
              {/* 左侧内容 */}
              <motion.div
                initial={prefersReducedMotion ? {} : { opacity: 0, x: -30 }}
                animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                className="col-span-5 text-left"
              >
              <div className="space-y-5">
                <motion.p 
                  initial={prefersReducedMotion ? {} : { opacity: 0, y: 16 }}
                  animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                  className="text-lg sm:text-xl font-body text-white leading-relaxed"
                  style={{
                    textShadow: '0 2px 12px rgba(0, 0, 0, 0.9), 0 0 24px rgba(0, 0, 0, 0.7)',
                  }}
                >
                  A little ghost that keeps your desk air fresh. Purple mist, RGB lights, quiet enough for 3am coding sessions.
                </motion.p>
                
                <motion.div
                  initial={prefersReducedMotion ? {} : { opacity: 0, y: 12 }}
                  animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
                  className="pt-2"
                >
                  <div className="text-white" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.9)' }}>
                    <ProductPrice variant="hero" />
                  </div>
                </motion.div>

                <div className="space-y-4 pt-4">
                  <div className="flex flex-row items-center gap-3">
                    <BuyButton 
                      size="lg" 
                      variant="primary" 
                      className="min-h-[56px] text-apple-body font-apple-semibold flex-shrink-0 touch-target" 
                    />
                    <Link
                      href="#features"
                      className="rounded-full border-2 border-white/80 bg-white/10 backdrop-blur-md px-6 py-4 text-apple-body font-apple-semibold text-white hover:bg-white/20 transition-all duration-200 ease-apple-standard focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 text-center touch-manipulation min-h-[56px] flex items-center justify-center touch-target shadow-lg"
                      style={{
                        textShadow: '0 1px 4px rgba(0, 0, 0, 0.8)',
                      }}
                    >
                      Explore features
                    </Link>
                  </div>
                  
                  <div className="flex justify-start pt-1">
                    <div className="text-white" style={{ textShadow: '0 1px 4px rgba(0, 0, 0, 0.9)' }}>
                      <StockStatus productId="maclock-default" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            </div>
          </div>
        </div>
        
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent via-ghost-bg-section/50 to-ghost-bg-section" />
      </section>

      {/* 手机版：Banner 卡片 + 下方内容 */}
      <section className="lg:hidden relative w-full pt-12 pb-8 safe-area-top">
        {/* Banner 卡片 */}
        <div className="relative w-full mx-auto px-4 mb-8">
          <div className="relative w-full rounded-2xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
            <OptimizedImage
              prefix="Gastly/Banner.png"
              priority
              fill
              fit="cover"
              sizes="100vw"
              alt="Gastly Humidifier 2.1 in a mystical graveyard scene"
              className="object-cover rounded-2xl"
            />
          </div>
        </div>

        {/* 下方内容卡片 */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4">
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="bg-ghost-bg-card rounded-2xl p-6 space-y-5"
          >
            <p className="text-base font-body text-ghost-text-secondary leading-relaxed">
              A little ghost that keeps your desk air fresh. Purple mist, RGB lights, quiet enough for 3am coding sessions.
            </p>
            
            <div className="pt-2">
              <ProductPrice variant="hero" />
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex flex-col gap-3">
                <BuyButton 
                  size="lg" 
                  variant="primary" 
                  className="w-full min-h-[52px] text-apple-body font-apple-semibold touch-target" 
                />
                <Link
                  href="#features"
                  onMouseEnter={playHoverSound}
                  className="w-full rounded-full border border-ghost-purple-primary/50 bg-ghost-bg-section/90 backdrop-blur-md px-6 py-3.5 text-apple-body font-apple-semibold text-ghost-text-primary hover:bg-ghost-bg-section transition-all duration-200 ease-apple-standard focus:outline-none focus-visible:ring-2 focus-visible:ring-ghost-purple-primary/30 focus-visible:ring-offset-2 text-center touch-manipulation min-h-[52px] flex items-center justify-center touch-target"
                >
                  Explore features
                </Link>
              </div>
              
              <div className="flex justify-center pt-1">
                <StockStatus productId="maclock-default" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
