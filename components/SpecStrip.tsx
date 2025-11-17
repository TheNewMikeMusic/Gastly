'use client'

import { useReducedMotion, useIntersectionObserver } from '@/lib/hooks'
import { motion } from 'framer-motion'
import { useRef } from 'react'

const specs = [
  { category: 'Physical', items: [
    { label: 'Dimensions', value: '8.5" × 5.5" × 2"' },
    { label: 'Weight', value: '12 oz (340g)' },
    { label: 'Material', value: 'Premium ABS plastic' },
  ]},
  { category: 'Display', items: [
    { label: 'Type', value: 'High-contrast LCD' },
    { label: 'Backlight', value: 'Adjustable brightness' },
    { label: 'Viewing Angle', value: 'Wide-angle optimized' },
  ]},
  { category: 'Power & Connectivity', items: [
    { label: 'Power', value: 'USB-C powered' },
    { label: 'Cable Length', value: '6 ft (1.8m) included' },
    { label: 'Power Consumption', value: '< 2W typical' },
  ]},
  { category: 'Features', items: [
    { label: 'Modes', value: 'Clock, Alarm, Timer' },
    { label: 'Alarms', value: 'Multiple configurable' },
    { label: 'Brightness', value: '10-level adjustment' },
  ]},
]

export function SpecStrip() {
  const prefersReducedMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const isVisible = useIntersectionObserver(sectionRef, { threshold: 0.2 })

  return (
    <section
      ref={sectionRef}
      className="py-24 px-4 sm:px-6 lg:px-8 relative"
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #312e81 50%, #581c87 75%, #4c1d95 100%)',
      }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={prefersReducedMotion || !isVisible ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion || !isVisible ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-white">
            Technical Specifications
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Built with modern components and thoughtful engineering, the Maclock delivers reliable performance while honoring classic design principles.
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
              className="glass-panel-dark rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold mb-4 text-white border-b border-white/20 pb-2">
                {category.category}
              </h3>
              <div className="space-y-3">
                {category.items.map((spec) => (
                  <div key={spec.label}>
                    <div className="text-xs text-gray-400 mb-1">{spec.label}</div>
                    <div className="text-sm font-medium text-gray-200">{spec.value}</div>
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

