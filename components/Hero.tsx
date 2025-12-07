'use client'

import Link from 'next/link'
import { OptimizedImage } from '@/components/OptimizedImage'
import { BuyButton } from '@/components/BuyButton'
import { StockStatus } from '@/components/StockStatus'
import { ProductPrice } from '@/components/ProductPrice'
import { useReducedMotion } from '@/lib/hooks'
import { useGBASound } from '@/lib/hooks/useGBASound'
import { motion } from 'framer-motion'
import { NeonButton } from '@/components/NeonButton'
import { createEnterAnimation, EASE_APPLE } from '@/lib/animations'

export function Hero() {
  const prefersReducedMotion = useReducedMotion()
  const { playHoverSound } = useGBASound()

  return (
    <>
      {/* 桌面版：Banner 作为全宽背景，内容叠加 */}
      <section className="hidden lg:block relative w-full min-h-screen flex items-end hero-banner overflow-hidden">
        {/* Banner 作为全宽背景，从顶部开始 */}
        <div className="absolute inset-0 w-full h-full z-0">
          <OptimizedImage
            prefix="Gastly/Banner.webp"
            priority
            fill
            fit="cover"
            sizes="100vw"
            alt="Gastly Humidifier 2.1 in a mystical graveyard scene"
            className="object-cover"
          />
          {/* 深色遮罩层，确保文字可读性 - 渐变从顶部透明到底部暗化 */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/70" />
          {/* 紫色光晕增强 */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at 35% -20%, rgba(124, 58, 237, 0.1), transparent 60%)',
            }}
          />
        </div>
        
        {/* 内容叠加在 Banner 上，位置靠下 */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="flex items-end min-h-[calc(100vh-5rem)] pb-16 lg:pb-24">
            <div className="grid grid-cols-12 gap-8 w-full">
              {/* 左侧内容 */}
              <motion.div
                initial={prefersReducedMotion ? {} : { opacity: 0, x: -30 }}
                animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: EASE_APPLE, delay: 0.1 }}
                className="col-span-5 text-left"
              >
              <div className="space-y-5">
                <motion.p 
                  initial={prefersReducedMotion ? {} : { opacity: 0, y: 16 }}
                  animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: EASE_APPLE, delay: 0.3 }}
                  className="text-lg sm:text-xl font-body text-white leading-relaxed text-glow-purple"
                  style={{
                    textShadow: '0 2px 12px rgba(0, 0, 0, 0.9), 0 0 24px rgba(0, 0, 0, 0.7), 0 0 30px rgba(124, 58, 237, 0.4)',
                  }}
                >
                  A little ghost that keeps your desk air fresh. Purple mist, RGB lights, quiet enough for 3am coding sessions.
                </motion.p>
                
                <motion.div
                  initial={prefersReducedMotion ? {} : { opacity: 0, y: 12 }}
                  animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: EASE_APPLE, delay: 0.4 }}
                  className="pt-2"
                >
                  <div className="text-white" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.9)' }}>
                    <ProductPrice variant="hero" />
                  </div>
                </motion.div>

                <div className="space-y-4 pt-4">
                  <div className="flex flex-row items-center gap-3">
                    <NeonButton
                      size="lg"
                      variant="primary"
                      glowColor="#7C3AED"
                      pulse={true}
                      className="min-h-[56px] text-apple-body font-apple-semibold flex-shrink-0 touch-target"
                      onClick={() => {
                        window.location.href = '/checkout'
                      }}
                    >
                      Buy Now
                    </NeonButton>
                    <Link
                      href="#features"
                      onMouseEnter={playHoverSound}
                      className="rounded-full border-2 border-purple-400/60 bg-purple-900/20 backdrop-blur-md px-6 py-4 text-apple-body font-apple-semibold text-white hover:bg-purple-900/30 hover:border-purple-400 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/50 focus-visible:ring-offset-2 text-center touch-manipulation min-h-[56px] flex items-center justify-center touch-target shadow-neon-purple hover:shadow-neon-purple-lg"
                      style={{
                        transitionTimingFunction: `cubic-bezier(${EASE_APPLE.join(',')})`,
                        textShadow: '0 1px 4px rgba(0, 0, 0, 0.8), 0 0 10px rgba(168, 85, 247, 0.5)',
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
      </section>

      {/* 手机版：Banner 卡片 + 下方内容 */}
      <section className="lg:hidden relative w-full pb-8 safe-area-top" style={{ paddingTop: 'calc(5.5rem + env(safe-area-inset-top))' }}>
        {/* Banner 卡片 - 竖版3:4 */}
          <motion.div 
          className="relative w-full mx-auto px-4 mb-6"
          {...createEnterAnimation('scale', 0)}
          initial={prefersReducedMotion ? {} : createEnterAnimation('scale', 0).initial}
          animate={prefersReducedMotion ? {} : createEnterAnimation('scale', 0).animate}
          transition={prefersReducedMotion ? {} : createEnterAnimation('scale', 0).transition}
        >
          <div className="relative w-full rounded-2xl overflow-hidden glass-neon touch-manipulation" style={{ aspectRatio: '3/4' }}>
            <OptimizedImage
              prefix="Gastly/Bannermobile.png"
              priority
              fill
              fit="cover"
              sizes="100vw"
              alt="Gastly Humidifier 2.1 in a mystical graveyard scene"
              className="object-cover rounded-2xl transition-transform duration-700 hover:scale-105"
            />
            {/* 扫描线效果 */}
            <div className="absolute inset-0 rounded-2xl scan-line" />
            {/* 增强的紫色光晕效果 */}
            <div 
              className="absolute inset-0 rounded-2xl"
              style={{
                background: 'radial-gradient(circle at center, rgba(124, 58, 237, 0.08), transparent 70%)',
                pointerEvents: 'none',
              }}
            />
          </div>
        </motion.div>

        {/* 下方内容卡片 */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4">
          <motion.div
            {...createEnterAnimation('listItem', 0)}
            initial={prefersReducedMotion ? {} : createEnterAnimation('listItem', 0).initial}
            animate={prefersReducedMotion ? {} : createEnterAnimation('listItem', 0).animate}
            transition={prefersReducedMotion ? {} : { ...createEnterAnimation('listItem', 0).transition, delay: 0.2 }}
            className="glass-neon rounded-2xl p-5 sm:p-6 border border-ghost-purple-primary/30 shadow-glass-dark space-y-4 sm:space-y-5"
          >
            <p className="text-base sm:text-lg font-body text-ghost-text-secondary leading-relaxed text-glow-purple">
              A little ghost that keeps your desk air fresh. Purple mist, RGB lights, quiet enough for 3am coding sessions.
            </p>
            
            <div className="pt-2">
              <ProductPrice variant="hero" />
            </div>

            <div className="space-y-3 sm:space-y-4 pt-2 sm:pt-4">
              <div className="flex flex-col gap-3">
                <NeonButton
                  size="lg"
                  variant="primary"
                  glowColor="#7C3AED"
                  pulse={true}
                  className="w-full min-h-[56px] sm:min-h-[52px] text-apple-body font-apple-semibold touch-target active:scale-95"
                  onClick={() => {
                    window.location.href = '/checkout'
                  }}
                >
                  Buy Now
                </NeonButton>
                <Link
                  href="#features"
                  onMouseEnter={playHoverSound}
                  className="w-full rounded-full border-2 border-purple-400/60 bg-purple-900/20 backdrop-blur-md px-6 py-3.5 sm:py-4 text-apple-body font-apple-semibold text-white hover:bg-purple-900/30 hover:border-purple-400 active:bg-purple-900/40 active:scale-95 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/50 focus-visible:ring-offset-2 text-center touch-manipulation min-h-[56px] sm:min-h-[52px] flex items-center justify-center touch-target shadow-neon-purple hover:shadow-neon-purple-lg"
                  style={{
                    transitionTimingFunction: `cubic-bezier(${EASE_APPLE.join(',')})`,
                    textShadow: '0 1px 4px rgba(0, 0, 0, 0.8), 0 0 10px rgba(168, 85, 247, 0.5)',
                  }}
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
