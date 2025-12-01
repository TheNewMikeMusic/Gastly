'use client'

import { OptimizedImage } from '@/components/OptimizedImage'
import { SectionBackground } from '@/components/SectionBackground'
import { useReducedMotion, useIntersectionObserver } from '@/lib/hooks'
import { useGBASound } from '@/lib/hooks/useGBASound'
import { motion } from 'framer-motion'
import { useRef } from 'react'
import { createEnterAnimation, createHoverAnimation, createTapAnimation, EASE_APPLE } from '@/lib/animations'

const scenarios = [
  {
    title: 'Coding Desk',
    description: 'Dry air makes your eyes tired. This keeps things comfortable during those 3am debugging sessions.',
    prefix: 'Gastly/Gastly Humidifier 2.1 on Programmer Desk With Triple Monitor Setup.png',
    alt: 'Gastly Humidifier 2.1 on a programmer desk with triple monitor setup perfectly complementing purple mist',
  },
  {
    title: 'Nightstand',
    description: 'Quiet enough to sleep next to. Warm light, soft mist. Helps with dry air without being annoying.',
    prefix: 'Gastly/Gastly Humidifier 2.1 on Bedroom Nightstand With Soft Purple Mist.png',
    alt: 'Gastly Humidifier 2.1 on a bedroom nightstand with soft purple mist creating a serene atmosphere',
  },
  {
    title: 'Gaming Setup',
    description: 'Matches your RGB setup. Purple mist looks cool on stream. Doesn\'t distract when you\'re in the zone.',
    prefix: 'Gastly/Gastly Humidifier 2.1 in Gaming Room With Purple Mist.png',
    alt: 'Gastly Humidifier 2.1 in a gaming room with purple mist blending perfectly with RGB setup',
  },
]

export function LifestyleScenarios() {
  const prefersReducedMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const isVisible = useIntersectionObserver(sectionRef, { threshold: 0.2 })

  return (
    <section
      ref={sectionRef}
      className="pt-12 sm:pt-16 lg:pt-20 pb-8 sm:pb-10 lg:pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      <SectionBackground variant="subtle" />
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          {...createEnterAnimation('title', 0)}
          initial={prefersReducedMotion || !isVisible ? {} : createEnterAnimation('title', 0).initial}
          animate={prefersReducedMotion || !isVisible ? {} : createEnterAnimation('title', 0).animate}
          transition={prefersReducedMotion ? {} : createEnterAnimation('title', 0).transition}
          className="text-center mb-8 sm:mb-10 lg:mb-12"
        >
          <h2 className="text-apple-display font-display mb-4 sm:mb-6 text-ghost-text-primary">
            Where it lives
          </h2>
          <p className="text-apple-subtitle font-body text-ghost-text-secondary max-w-3xl mx-auto">
            Gaming setups, nightstands, coding desks. It fits wherever you spend your nights.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {scenarios.map((scenario, index) => (
            <ScenarioCard
              key={scenario.prefix}
              scenario={scenario}
              index={index}
              prefersReducedMotion={prefersReducedMotion}
              isVisible={isVisible}
              priority={index === 0}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function ScenarioCard({
  scenario,
  index,
  prefersReducedMotion,
  isVisible,
  priority = false,
}: {
  scenario: typeof scenarios[0]
  index: number
  prefersReducedMotion: boolean
  isVisible: boolean
  priority?: boolean
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const { playHoverSound } = useGBASound()

  const enterAnim = createEnterAnimation('card', index, 'card')
  const hoverAnim = createHoverAnimation('card')
  const tapAnim = createTapAnimation()

  return (
    <motion.div
      ref={cardRef}
      initial={prefersReducedMotion || !isVisible ? {} : enterAnim.initial}
      animate={prefersReducedMotion || !isVisible ? {} : enterAnim.animate}
      transition={prefersReducedMotion ? {} : enterAnim.transition}
      whileHover={prefersReducedMotion ? {} : hoverAnim}
      whileTap={prefersReducedMotion ? {} : tapAnim}
      onMouseEnter={playHoverSound}
      className="glass-neon rounded-2xl overflow-hidden border border-ghost-purple-primary/30 shadow-glass-dark touch-manipulation transition-all duration-300"
      style={{
        transitionTimingFunction: `cubic-bezier(${EASE_APPLE.join(',')})`,
      }}
    >
      <div className="relative aspect-square overflow-hidden">
        <OptimizedImage
          prefix={scenario.prefix}
          fill
          fit="contain"
          sizes="(max-width: 768px) 100vw, 33vw"
          alt={scenario.alt}
          priority={priority}
          className="rounded-t-2xl"
        />
      </div>
      <div className="p-5 sm:p-6 lg:p-8">
        <h3 className="text-apple-title-sm font-display mb-2 sm:mb-3 text-ghost-text-primary text-glow-purple">
          {scenario.title}
        </h3>
        <p className="text-apple-body-sm font-body text-ghost-text-secondary leading-relaxed">
          {scenario.description}
        </p>
      </div>
    </motion.div>
  )
}

