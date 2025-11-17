'use client'

import { OptimizedImage } from '@/components/OptimizedImage'
import { BuyButton } from '@/components/BuyButton'
import { useReducedMotion } from '@/lib/hooks'
import { motion } from 'framer-motion'

export function Hero() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16 bg-gradient-to-b from-white via-white to-gray-50/30">
      {/* Subtle background pattern for depth */}
      <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,1),transparent_50%)]"></div>
      {/* Rainbow ground with parallax */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-32 rainbow-ground"
        initial={prefersReducedMotion ? {} : { y: 0 }}
        animate={prefersReducedMotion ? {} : { y: [0, -10, 0] }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          transform: 'skewY(-2deg)',
          transformOrigin: 'bottom',
        }}
      />

      {/* Hero content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Text background for better contrast */}
        <div className="absolute inset-0 -z-10 bg-white/40 backdrop-blur-sm rounded-3xl -mx-8 -my-4"></div>
        <motion.h1
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-foreground drop-shadow-[0_2px_8px_rgba(0,0,0,0.15)]"
        >
          Hello, Maclock
        </motion.h1>
        
        <motion.p
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-lg sm:text-xl text-foreground/95 mb-8 max-w-2xl mx-auto drop-shadow-[0_1px_4px_rgba(0,0,0,0.1)]"
        >
          Pixel-perfect nostalgia meets modern craftsmanship. A beautifully reimagined digital clock.
        </motion.p>

        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <BuyButton size="lg" />
        </motion.div>

        {/* Hero image */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative w-full max-w-3xl mx-auto aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-black/5"
        >
          <OptimizedImage
            prefix="maclock_hello_retro_apple_style"
            priority
            fill
            sizes="(max-width: 768px) 100vw, 80vw"
            className=""
          />
        </motion.div>
      </div>

      {/* Mobile floating buy bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden safe-area-bottom">
        <div className="glass border-t border-foreground/10 px-4 py-3 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-foreground">$299</div>
            <div className="text-xs text-foreground/60">Free shipping</div>
          </div>
          <BuyButton size="sm" />
        </div>
      </div>
    </section>
  )
}

