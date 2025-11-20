'use client'

import { useReducedMotion, useIntersectionObserver } from '@/lib/hooks'
import { motion } from 'framer-motion'
import { useRef } from 'react'

export function AboutUs() {
  const prefersReducedMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const isVisible = useIntersectionObserver(sectionRef, { threshold: 0.2 })

  const values = [
    {
      title: 'Craftsmanship',
      description: 'Every unit is hand-finished in our California studio, ensuring attention to detail that mass production can\'t match.',
    },
    {
      title: 'Simplicity',
      description: 'No apps, no subscriptions, no complexity. Just a beautiful clock that does one thing exceptionally well.',
    },
    {
      title: 'Heritage',
      description: 'Inspired by the original Macintosh hello screen, Hello1984 honors computing history while embracing modern reliability.',
    },
  ]

  return (
    <section
      ref={sectionRef}
      id="about"
      className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={prefersReducedMotion || !isVisible ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion || !isVisible ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-10 sm:mb-14 lg:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-semibold mb-4 sm:mb-6 text-gray-900 tracking-[-0.022em] leading-[1.08]">
            Built with intention
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto leading-[1.6] tracking-[-0.011em] px-4">
            Hello1984 is more than a clock—it&apos;s a statement about thoughtful design, analog warmth, and the joy of well-made things.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={prefersReducedMotion || !isVisible ? {} : { opacity: 0, y: 24 }}
              animate={prefersReducedMotion || !isVisible ? {} : { opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center"
            >
              <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-gray-900 tracking-[-0.02em] leading-[1.1]">
                {value.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-[1.6] tracking-[-0.011em]">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={prefersReducedMotion || !isVisible ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion || !isVisible ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="glass-card rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-10"
        >
          <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
            <h3 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-[-0.022em] leading-[1.08] text-center">
              Our Story
            </h3>
            <div className="space-y-4 text-base sm:text-lg text-gray-600 leading-[1.6] tracking-[-0.011em]">
              <p>
                Hello1984 began as a weekend project in a small San Francisco workshop. Frustrated by the complexity of modern smart devices, we set out to build something simple, beautiful, and reliable.
              </p>
              <p>
                The original Macintosh hello screen—with its smiling face and floppy disk animation—captured something essential about computing: it felt alive, friendly, and approachable. We wanted to bring that feeling to a modern desktop clock.
              </p>
              <p>
                Each Hello1984 unit is assembled and tested by hand. We use premium components, USB-C power for universal compatibility, and a real-time clock backup so your settings persist even when unplugged. No Wi-Fi required, no apps to download, no subscriptions to manage.
              </p>
              <p className="text-gray-700 font-medium">
                This is hardware that respects your time, your space, and your attention.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

