'use client'

import Link from 'next/link'
import { OptimizedImage } from '@/components/OptimizedImage'
import { BuyButton } from '@/components/BuyButton'
import { useReducedMotion } from '@/lib/hooks'
import { motion } from 'framer-motion'

export function Hero() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section className="relative w-full min-h-screen flex items-center hero-banner mobile-hero pt-10 sm:pt-20 lg:pt-12">
      <div className="absolute inset-0 hero-bg-dark" />
      <div className="hero-light-bloom" />
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-24">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-10 lg:gap-14">
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 24 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="w-full lg:max-w-lg space-y-8 text-center lg:text-left"
          >
            <div className="hero-panel space-y-8">
              <motion.span 
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 12 }}
                animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                className="hero-pill inline-flex justify-center lg:justify-start text-sm font-medium tracking-[0.05em]"
              >
                Hello1984 · 2025 Edition
              </motion.span>
              <motion.h1 
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                className="text-5xl sm:text-6xl lg:text-7xl font-semibold leading-[1.05] tracking-[-0.025em] text-gray-900"
              >
                Hello again.
              </motion.h1>
              <motion.p 
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 16 }}
                animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
                className="text-lg sm:text-xl leading-[1.6] tracking-[-0.011em] text-gray-600 max-w-xl mx-auto lg:mx-0"
              >
                A faithful Macintosh-style clock with a remastered hello screen, analog brightness dial, and USB-C
                dependability. Built to feel calm on a shelf and effortless on a tiny mobile screen.
              </motion.p>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <BuyButton size="lg" variant="primary" className="w-full sm:w-auto" />
                <Link
                  href="#features"
                  className="w-full sm:w-auto rounded-full border border-black/10 px-6 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-100 transition-colors duration-200 ease-apple-standard focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/40"
                >
                  Explore features
                </Link>
              </div>
              <p className="text-xs text-gray-500">
                Worldwide delivery + 30-day returns included.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.96 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="w-full max-w-2xl"
          >
            <div className="hero-product-frame">
              <div className="relative aspect-[4/3] w-full rounded-[1.75rem] overflow-hidden">
                <OptimizedImage
                  prefix="maclock_hello_retro_apple_style.webp"
                  priority
                  fill
                  fit="contain"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  alt="Maclock showing the classic Macintosh hello screen on a muted desk background"
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
