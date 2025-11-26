'use client'

import { SectionBackground } from '@/components/SectionBackground'
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
      "Hello1984 runs on standard 5V USB-C power and consumes less than 2W. A real-time clock backup preserves the time, alarms, and brightness even if you unplug it, so there&apos;s no setup dance each day.",
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
      className="py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-mt-20 sm:scroll-mt-24 relative overflow-hidden"
      style={{ scrollMarginTop: 'calc(4rem + env(safe-area-inset-top))' }}
    >
      <SectionBackground variant="subtle" />
      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={prefersReducedMotion || !isVisible ? {} : { opacity: 0, y: 30 }}
          animate={prefersReducedMotion || !isVisible ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20 sm:mb-24 lg:mb-28"
        >
          <h2 className="text-apple-display font-apple-semibold mb-4 sm:mb-6 text-[#1d1d1f]">
            Frequently asked questions
          </h2>
          <p className="text-apple-subtitle font-apple-normal text-[#424245] max-w-3xl mx-auto">
            Everything you need to know about Hello1984, from shipping and setup to warranty and returns.
          </p>
        </motion.div>

        <div className="space-y-3 sm:space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <motion.div
                key={faq.question}
                initial={prefersReducedMotion || !isVisible ? {} : { opacity: 0, y: 40 }}
                animate={prefersReducedMotion || !isVisible ? {} : { opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group relative bg-white rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] border border-black/[0.06]"
              >
                {/* Decorative gradient overlay */}
                <div 
                  className="absolute top-0 right-0 w-64 h-64 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle, rgba(0, 122, 255, 0.05) 0%, transparent 70%)',
                  }}
                />
                <button
                  type="button"
                  className="relative z-10 w-full flex items-center justify-between p-6 sm:p-8 lg:p-10 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 transition-colors duration-150 min-h-[72px] sm:min-h-[88px] touch-manipulation"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                >
                  <span className="text-apple-title-sm sm:text-apple-title font-apple-semibold text-[#1d1d1f] pr-4">{faq.question}</span>
                  <span
                    className={`h-6 w-6 flex items-center justify-center rounded-full border flex-shrink-0 text-sm font-bold transition-transform ${
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
                    open: { height: 'auto', opacity: 1 },
                    collapsed: { height: 0, opacity: 0 },
                  }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="px-6 sm:px-8 lg:px-10 pb-6 sm:pb-8 lg:pb-10">
                    <p className="relative z-10 text-apple-body-sm sm:text-apple-body font-apple-normal text-[#424245] leading-[1.6]">{faq.answer}</p>
                  </div>
                </motion.div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
