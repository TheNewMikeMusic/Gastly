'use client'

import { SectionBackground } from '@/components/SectionBackground'
import { useReducedMotion, useIntersectionObserver } from '@/lib/hooks'
import { motion } from 'framer-motion'
import { useRef, useState } from 'react'

const faqs = [
  {
    question: 'What is the water tank capacity? How long does a full tank last?',
    answer:
      '15 ml tank. Lasts 1–2 hours per refill. It shuts off automatically when empty.',
  },
  {
    question: 'How safe is it? Does it have auto-shutoff features?',
    answer:
      'Yes. Auto shutoff when empty, timer function, and dry-burn protection. Safe to leave on overnight.',
  },
  {
    question: 'How do I clean and maintain it?',
    answer:
      'Clean it weekly. Empty the water, wipe inside with a cloth, let it dry. Takes 2 minutes. Keeps it working well.',
  },
  {
    question: 'Can I add essential oils?',
    answer:
      'Yes. Just add a few drops to the water tank. Use real essential oils, not synthetic fragrances.',
  },
  {
    question: 'What is the noise level? Is it suitable for bedroom use?',
    answer:
      'Under 35 decibels. You can sleep next to it. Won\'t distract during calls or streams.',
  },
  {
    question: 'How do I switch RGB lighting modes?',
    answer:
      'Use the buttons on the device or the remote. Purple, green, warm orange, rainbow mode, and a few others. Takes 2 seconds to switch.',
  },
  {
    question: 'What should I know before using it?',
    answer:
      'Only use water—don\'t add anything else that could damage it. Use clean, fresh water for best results. Keep it away from kids.',
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
          <h2 className="text-apple-display font-display mb-4 sm:mb-6 text-ghost-text-primary">
            Frequently Asked Questions
          </h2>
          <p className="text-apple-subtitle font-body text-ghost-text-secondary max-w-3xl mx-auto">
            Common questions, straight answers.
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
                className="group relative bg-ghost-bg-card rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-glass-dark hover:shadow-glass-dark-hover transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] border border-ghost-purple-primary/30"
              >
                {/* Decorative gradient overlay */}
                <div 
                  className="absolute top-0 right-0 w-64 h-64 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, transparent 70%)',
                  }}
                />
                <button
                  type="button"
                  className="relative z-10 w-full flex items-center justify-between p-6 sm:p-8 lg:p-10 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 transition-colors duration-150 min-h-[72px] sm:min-h-[88px] touch-manipulation"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                >
                  <span className="text-apple-title-sm sm:text-apple-title font-display text-ghost-text-primary pr-4">{faq.question}</span>
                  <span
                    className={`h-6 w-6 flex items-center justify-center rounded-full border flex-shrink-0 text-sm font-bold transition-transform ${
                      isOpen ? 'rotate-45 border-ghost-purple-primary text-ghost-purple-primary' : 'border-ghost-purple-primary/50 text-ghost-text-secondary'
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
                    <p className="relative z-10 text-apple-body-sm sm:text-apple-body font-body text-ghost-text-secondary leading-[1.6]">{faq.answer}</p>
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
