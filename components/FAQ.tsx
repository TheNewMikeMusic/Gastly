'use client'

import { useReducedMotion, useIntersectionObserver } from '@/lib/hooks'
import { motion } from 'framer-motion'
import { useRef, useState } from 'react'

const faqs = [
  {
    question: 'How long does shipping take?',
    answer:
      'Hello1984 ships from California within 7-10 business days of purchase. Delivery to North America typically takes 3-5 days, while Europe and Asia arrive in 8-12 days. Every order receives a tracked, carbon-neutral shipment.',
  },
  {
    question: 'What exactly is in the box?',
    answer:
      "You'll receive the Hello1984 unit, a 2 m braided USB-C cable, a microfiber cloth, and a quick-start guide that walks through the startup ritual. A USB-C power adapter is not included so you can use the one you already trust.",
  },
  {
    question: 'How do power and settings work?',
    answer:
      "Hello1984 runs on standard 5V USB-C power and consumes less than 2W. A real-time clock backup preserves the time, alarms, and brightness even if you unplug it, so there's no setup dance each day.",
  },
  {
    question: 'Is there an app?',
    answer:
      'No apps, subscriptions, or Bluetooth pairing. Every control lives on the device—anodized buttons for alarms, a physical dimmer, and a rear menu toggle. It feels analog on purpose.',
  },
  {
    question: 'Is this officially licensed?',
    answer:
      "Hello1984 is an independent homage built by a small team of hardware designers. We aren't affiliated with Apple Inc. The wordmarks and rituals are original interpretations inspired by the Macintosh spirit.",
  },
  {
    question: 'What if something goes wrong?',
    answer:
      "We provide a 12-month hardware warranty plus 30-day returns. If a component fails, we'll repair or replace it. If the clock doesn't fit your space, send it back in its original packaging for a full refund.",
  },
]

export function FAQ() {
  const prefersReducedMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const isVisible = useIntersectionObserver(sectionRef, { threshold: 0.2 })
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section
      ref={sectionRef}
      id="faq"
      className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={prefersReducedMotion || !isVisible ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion || !isVisible ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold mb-6 text-gray-900 tracking-[-0.022em] leading-[1.08]">
            Frequently asked questions
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-[1.6] tracking-[-0.011em]">
            Everything you need to know about Hello1984, from shipping and setup to warranty and returns.
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <motion.div
                key={faq.question}
                initial={prefersReducedMotion || !isVisible ? {} : { opacity: 0, y: 20 }}
                animate={prefersReducedMotion || !isVisible ? {} : { opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="glass-card rounded-2xl px-6 py-4"
              >
                <button
                  type="button"
                  className="w-full flex items-center justify-between gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 rounded-xl py-2 transition-colors duration-200"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                >
                  <span className="text-lg font-semibold text-gray-900 tracking-[-0.018em]">{faq.question}</span>
                  <span
                    className={`h-6 w-6 flex items-center justify-center rounded-full border text-sm font-bold transition-transform ${
                      isOpen ? 'rotate-45 border-gray-400 text-gray-500' : 'border-gray-300 text-gray-600'
                    }`}
                    aria-hidden="true"
                  >
                    +
                  </span>
                </button>
                <motion.div
                  initial={false}
                  animate={isOpen ? 'open' : 'collapsed'}
                  variants={{
                    open: { height: 'auto', opacity: 1, marginTop: '0.75rem' },
                    collapsed: { height: 0, opacity: 0, marginTop: '0rem' },
                  }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <p className="text-gray-600 leading-[1.6] tracking-[-0.011em] pb-2">{faq.answer}</p>
                </motion.div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
