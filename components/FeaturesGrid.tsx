'use client'

import { OptimizedImage } from '@/components/OptimizedImage'
import { useReducedMotion, useIntersectionObserver } from '@/lib/hooks'
import { motion } from 'framer-motion'
import { useRef } from 'react'

const features = [
  {
    title: 'Boot Smile',
    prefix: 'maclock_boot_smile_feature_grid_apple_style',
    description: 'Every morning begins with a moment of delight. The Maclock greets you with the iconic smiling Macintosh face, a brief but meaningful ritual that connects you to computing history. This isn\'t just a startup sequence—it\'s a daily reminder of the joy and optimism that defined early personal computing.',
  },
  {
    title: 'System Disk',
    prefix: 'maclock_boot_ceremony_apple_style',
    description: 'Watch the classic floppy disk icon animate as the system initializes, just like the original Macintosh 128K. This carefully recreated animation honors the heritage of the platform while running on modern, reliable hardware. The ceremony takes only seconds, but the attention to detail lasts a lifetime.',
  },
  {
    title: 'Brightness Control',
    prefix: 'maclock_backlight_adjust_apple_style',
    description: 'Adjust the display brightness to match your environment, from a soft glow perfect for late-night reading to full brightness for daytime clarity. The smooth, analog-style control gives you precise command over the display, ensuring comfortable viewing in any lighting condition.',
  },
  {
    title: 'Alarm Modes',
    prefix: 'maclock_alarm_modes_apple_style',
    description: 'Set multiple alarms with different tones and schedules to match your daily rhythm. Whether you need a gentle wake-up for weekdays or a different routine for weekends, the Maclock adapts to your life. Each alarm can be customized independently, giving you complete control over your schedule.',
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
        <motion.div
          initial={prefersReducedMotion || !isVisible ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion || !isVisible ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900">
            Thoughtfully Designed Features
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Every detail of the Maclock has been carefully considered, from the startup ritual to daily interactions. These aren't just features—they're experiences that connect you to computing history while serving modern needs.
          </p>
        </motion.div>

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
      className="glass-card rounded-2xl p-6 lg:p-8 overflow-hidden"
    >
      <div className="relative aspect-[3/4] mb-6 rounded-lg overflow-hidden image-container-text">
        <OptimizedImage
          prefix={feature.prefix}
          fill
          fit="contain"
          sizes="(max-width: 768px) 100vw, 50vw"
          alt={`Maclock ${feature.title.toLowerCase()} feature`}
        />
      </div>
      <h3 className="text-2xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
      <p className="text-gray-700 leading-relaxed">{feature.description}</p>
    </motion.div>
  )
}

