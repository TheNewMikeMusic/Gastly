'use client'

import { SectionBackground } from '@/components/SectionBackground'
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
      className="section-spec py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden scroll-mt-20 sm:scroll-mt-24"
      style={{ scrollMarginTop: 'calc(4rem + env(safe-area-inset-top))' }}
    >
      <SectionBackground variant="subtle" />
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={prefersReducedMotion || !isVisible ? {} : { opacity: 0, y: 30 }}
          animate={prefersReducedMotion || !isVisible ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20 sm:mb-24 lg:mb-28"
        >
          <h2 className="text-apple-display font-apple-semibold mb-4 sm:mb-6 text-[#1d1d1f]">
            Technical specifications
          </h2>
          <p className="text-apple-subtitle font-apple-normal text-[#424245] max-w-3xl mx-auto">
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
              initial={prefersReducedMotion || !isVisible ? {} : { opacity: 0, y: 40 }}
              animate={prefersReducedMotion || !isVisible ? {} : { opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: categoryIndex * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="group relative bg-white rounded-apple sm:rounded-apple-lg p-6 sm:p-8 shadow-medium hover:shadow-deep transition-all duration-500 ease-apple-smooth border border-black/[0.06] overflow-hidden"
            >
              {/* Decorative gradient overlay */}
              <div 
                className="absolute top-0 right-0 w-64 h-64 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(0, 122, 255, 0.05) 0%, transparent 70%)',
                }}
              />
              <h3 className="relative z-10 text-apple-title-sm font-apple-semibold mb-4 text-[#1d1d1f] border-b border-[#d2d2d7] pb-2">
                {category.category}
              </h3>
              <div className="relative z-10 space-y-3">
                {category.items.map((spec) => (
                  <div key={spec.label}>
                    <div className="text-apple-footnote font-apple-normal text-[#6e6e73] mb-1">{spec.label}</div>
                    <div className="text-apple-caption font-apple-medium text-[#1d1d1f]">{spec.value}</div>
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
