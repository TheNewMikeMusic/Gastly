'use client'

import { useReducedMotion, useIntersectionObserver } from '@/lib/hooks'
import { motion } from 'framer-motion'
import { useRef } from 'react'

const specs = [
  {
    category: 'Physical',
    items: [
      { label: 'Dimensions', value: '8.5" W × 5.4" H × 2" D' },
      { label: 'Weight', value: '1.6 lb (0.75 kg)' },
      { label: 'Finish', value: 'Bead-blasted polymer, low-iron glass lens' },
    ],
  },
  {
    category: 'Display',
    items: [
      { label: 'Type', value: 'High-contrast monochrome LCD' },
      { label: 'Backlight', value: '10-step analog dimmer' },
      { label: 'Pixel Grid', value: '512 × 342 layout with rounded corners' },
    ],
  },
  {
    category: 'Power & Connectivity',
    items: [
      { label: 'Power', value: 'USB-C, 5V / 1A (2W typical)' },
      { label: 'Cable', value: '2 m braided USB-C to USB-C' },
      { label: 'Processor', value: 'Custom STM32 MCU with RTC backup' },
    ],
  },
  {
    category: 'Features',
    items: [
      { label: 'Modes', value: 'Clock, alarm studio, Pomodoro timer' },
      { label: 'Audio', value: 'Three tones + gentle boot chime' },
      { label: 'Memory', value: 'Retains time & alarms during outages' },
    ],
  },
]

export function SpecStrip() {
  const prefersReducedMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const isVisible = useIntersectionObserver(sectionRef, { threshold: 0.2 })

  return (
    <section
      ref={sectionRef}
      id="specs"
      className="section-spec py-20 px-4 sm:px-6 lg:px-8 relative"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={prefersReducedMotion || !isVisible ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion || !isVisible ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900">
            Technical specifications
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Modern internals power every ritual: real-time clock backup, efficient LCD driving, and machined controls that
            feel more hi-fi than hobby.
          </p>
        </motion.div>

        <motion.div
          initial={prefersReducedMotion || !isVisible ? {} : { opacity: 0 }}
          animate={prefersReducedMotion || !isVisible ? {} : { opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {specs.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={prefersReducedMotion || !isVisible ? {} : { opacity: 0, y: 20 }}
              animate={prefersReducedMotion || !isVisible ? {} : { opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: categoryIndex * 0.1 }}
              className="glass-panel rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold mb-4 text-gray-900 border-b border-gray-200 pb-2">
                {category.category}
              </h3>
              <div className="space-y-3">
                {category.items.map((spec) => (
                  <div key={spec.label}>
                    <div className="text-xs text-gray-500 mb-1">{spec.label}</div>
                    <div className="text-sm font-medium text-gray-800">{spec.value}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
