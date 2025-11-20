'use client'

import { OptimizedImage } from '@/components/OptimizedImage'
import { useReducedMotion, useIntersectionObserver } from '@/lib/hooks'
import { motion } from 'framer-motion'
import { useRef } from 'react'

const features = [
  {
    title: 'The smile sequence',
    prefix: 'maclock_boot_smile_feature_grid_apple_style.jpg',
    alt: 'Maclock smiling face animation with "hello" glyph on screen',
    description:
      'Maclock wakes with the smile and floppy disk dance in under seven seconds, matched frame-for-frame to the original Macintosh hello.',
  },
  {
    title: 'System disk ceremony',
    prefix: 'maclock_boot_ceremony_apple_style',
    alt: 'Maclock displaying the retro system disk animation during boot',
    description:
      "The disk icon glides in, hands off to the clock, and plays a warm chime that has been remastered for today's speakers.",
  },
  {
    title: 'Analog brightness dial',
    prefix: 'maclock_backlight_adjust_apple_style',
    alt: 'Maclock brightness adjustment graphic with glowing slider',
    description:
      'A tactile side dial gives you ten detented steps of glow—late-night dim or daylight bright—without menus or apps.',
  },
  {
    title: 'Alarm studio',
    prefix: 'maclock_alarm_modes_apple_style',
    alt: 'Maclock showing multiple alarm modes on the display',
    description:
      "Set weekday alarms, weekend slow starts, or focus timers with their own tones. Every schedule lives on-device, so Wi-Fi never matters.",
  },
]

export function FeaturesGrid() {
  const prefersReducedMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const isVisible = useIntersectionObserver(sectionRef, { threshold: 0.3 })

  return (
    <section
      ref={sectionRef}
      id="features"
      className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={prefersReducedMotion || !isVisible ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion || !isVisible ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-10 sm:mb-14 lg:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-semibold mb-4 sm:mb-6 text-gray-900 tracking-[-0.022em] leading-[1.08]">
            Built like a tiny computer.
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto leading-[1.6] tracking-[-0.011em] px-4">
            A precise LCD grid, dependable internals, and interactions that feel analog even though they&apos;re digital.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.prefix}
              feature={feature}
              index={index}
              prefersReducedMotion={prefersReducedMotion}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function FeatureCard({
  feature,
  index,
  prefersReducedMotion,
  isVisible,
}: {
  feature: typeof features[0]
  index: number
  prefersReducedMotion: boolean
  isVisible: boolean
}) {
  return (
    <motion.div
      initial={prefersReducedMotion || !isVisible ? {} : { opacity: 0, y: 24 }}
      animate={prefersReducedMotion || !isVisible ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      whileHover={prefersReducedMotion ? {} : { y: -4, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } }}
      className="glass-card rounded-2xl p-5 sm:p-6 lg:p-8 active:scale-[0.98] touch-manipulation"
    >
      <div className="relative aspect-[3/4] mb-5 sm:mb-6 rounded-xl sm:rounded-2xl overflow-hidden bg-gray-50">
        <OptimizedImage
          prefix={feature.prefix}
          fill
          fit="contain"
          sizes="(max-width: 768px) 100vw, 50vw"
          alt={feature.alt}
        />
      </div>
      <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-gray-900 tracking-[-0.02em] leading-[1.1]">{feature.title}</h3>
      <p className="text-sm sm:text-base text-gray-600 leading-[1.6] tracking-[-0.011em]">{feature.description}</p>
    </motion.div>
  )
}
