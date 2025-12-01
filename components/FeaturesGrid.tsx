'use client'

import { OptimizedImage } from '@/components/OptimizedImage'
import { SectionBackground } from '@/components/SectionBackground'
import { useReducedMotion, useIntersectionObserver } from '@/lib/hooks'
import { useGBASound } from '@/lib/hooks/useGBASound'
import { motion } from 'framer-motion'
import { useRef } from 'react'

const features = [
  {
    title: 'Core Features',
    prefix: 'Gastly/card4.png',
    alt: 'Gastly Humidifier 2.1 core features showcase',
    description:
      'Big tank lasts all night. Timer so you don\'t have to remember to turn it off. Actually quiet.',
  },
  {
    title: 'RGB Mood Lighting Modes',
    prefix: 'Gastly/card5.png',
    alt: 'Gastly Humidifier 2.1 RGB mood lighting multiple modes showcase',
    description:
      'Switch colors with the remote. Purple for focus, green for vibes, warm orange for bedtime. Or just leave it on rainbow.',
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
      className="pt-12 sm:pt-16 lg:pt-20 pb-8 sm:pb-10 lg:pb-12 px-4 sm:px-6 lg:px-8 scroll-mt-20 sm:scroll-mt-24 relative overflow-hidden"
      style={{ scrollMarginTop: 'calc(4rem + env(safe-area-inset-top))' }}
    >
      <SectionBackground variant="subtle" />
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={prefersReducedMotion || !isVisible ? {} : { opacity: 0, y: 30 }}
          animate={prefersReducedMotion || !isVisible ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-8 sm:mb-10 lg:mb-12"
        >
          <h2 className="text-apple-display font-display mb-4 sm:mb-6 text-ghost-text-primary">
            Your desk needs<br />a ghost friend
          </h2>
          <p className="text-apple-subtitle font-body text-ghost-text-secondary max-w-3xl mx-auto">
            Big tank, quiet motor, RGB lights that actually look good. Built for people who work late.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 lg:gap-8 max-w-2xl mx-auto">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.prefix}
              feature={feature}
              index={index}
              prefersReducedMotion={prefersReducedMotion}
              isVisible={isVisible}
              priority={index < 2} // 前两个图片使用priority
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
  priority = false,
}: {
  feature: typeof features[0]
  index: number
  prefersReducedMotion: boolean
  isVisible: boolean
  priority?: boolean
}) {
  const { playHoverSound } = useGBASound()
  
  // All cards: full-bleed image with no text
  if (index === 0 || index === 1 || index === 2 || index === 3 || index === 4 || index === 5 || index === 6) {
    return (
      <motion.div
        initial={prefersReducedMotion || !isVisible ? {} : { opacity: 0, y: 40 }}
        animate={prefersReducedMotion || !isVisible ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
        whileHover={prefersReducedMotion ? {} : { y: -4, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }}
        onMouseEnter={playHoverSound}
        className="group relative aspect-square rounded-apple sm:rounded-apple-lg overflow-hidden shadow-glass-dark hover:shadow-glass-dark-hover transition-all duration-500 ease-apple-smooth border border-ghost-purple-primary/30"
      >
        <OptimizedImage
          prefix={feature.prefix}
          fill
          fit="contain"
          sizes="(max-width: 768px) 100vw, 50vw"
          alt={feature.alt}
          priority={priority}
          className="rounded-[2rem] sm:rounded-[2.5rem]"
        />
      </motion.div>
    )
  }

  // Other cards: normal layout with text
  return (
    <motion.div
      initial={prefersReducedMotion || !isVisible ? {} : { opacity: 0, y: 24 }}
      animate={prefersReducedMotion || !isVisible ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      whileHover={prefersReducedMotion ? {} : { y: -4, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }}
      onMouseEnter={playHoverSound}
      className="glass-card rounded-apple p-6 lg:p-8 overflow-hidden"
    >
      <div className="relative aspect-square mb-6 overflow-hidden image-container-text">
        <OptimizedImage
          prefix={feature.prefix}
          fill
          fit="contain"
          sizes="(max-width: 768px) 100vw, 50vw"
          alt={feature.alt}
          priority={priority}
        />
      </div>
      <h3 className="text-apple-title font-display mb-4 text-ghost-text-primary">{feature.title}</h3>
      <p className="text-apple-body font-body text-ghost-text-secondary">{feature.description}</p>
    </motion.div>
  )
}
