'use client'

import { OptimizedImage } from '@/components/OptimizedImage'
import { useReducedMotion, useIntersectionObserver } from '@/lib/hooks'
import { motion } from 'framer-motion'
import { useRef } from 'react'

const features = [
  {
    title: 'Boot Smile',
    prefix: 'maclock_boot_smile_feature_grid_apple_style',
    description: 'A delightful startup sequence that brings joy to every power-on.',
  },
  {
    title: 'System Disk',
    prefix: 'maclock_boot_ceremony_apple_style',
    description: 'Classic disk icon animation, reimagined for the modern era.',
  },
  {
    title: 'Brightness Control',
    prefix: 'maclock_backlight_adjust_apple_style',
    description: 'Smooth backlight adjustment with precise control.',
  },
  {
    title: 'Alarm Modes',
    prefix: 'maclock_alarm_modes_apple_style',
    description: 'Multiple alarm configurations for your daily routine.',
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
      className="py-24 px-4 sm:px-6 lg:px-8 bg-white"
    >
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={prefersReducedMotion || !isVisible ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion || !isVisible ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl font-bold text-center mb-16 text-foreground"
        >
          Features
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
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
      initial={prefersReducedMotion || !isVisible ? {} : { opacity: 0, y: 30 }}
      animate={prefersReducedMotion || !isVisible ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={prefersReducedMotion ? {} : { y: -8 }}
      className="glass rounded-2xl p-6 lg:p-8 overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
    >
      <div className="relative aspect-[3/4] mb-4 rounded-lg overflow-hidden border border-black/5 shadow-md">
        <OptimizedImage
          prefix={feature.prefix}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className=""
        />
      </div>
      <h3 className="text-2xl font-semibold mb-2 text-foreground">{feature.title}</h3>
      <p className="text-foreground/70">{feature.description}</p>
    </motion.div>
  )
}

