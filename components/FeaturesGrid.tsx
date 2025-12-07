'use client'

import { OptimizedImage } from '@/components/OptimizedImage'
import { SectionBackground } from '@/components/SectionBackground'
import { useReducedMotion, useIntersectionObserver } from '@/lib/hooks'
import { useGBASound } from '@/lib/hooks/useGBASound'
import { motion } from 'framer-motion'
import { useRef } from 'react'
import { createEnterAnimation, createHoverAnimation, createTapAnimation, EASE_APPLE } from '@/lib/animations'

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
          {...createEnterAnimation('title', 0)}
          initial={prefersReducedMotion || !isVisible ? {} : createEnterAnimation('title', 0).initial}
          animate={prefersReducedMotion || !isVisible ? {} : createEnterAnimation('title', 0).animate}
          transition={prefersReducedMotion ? {} : createEnterAnimation('title', 0).transition}
          className="text-center mb-8 sm:mb-10 lg:mb-12"
        >
          <h2 className="text-apple-display font-display mb-4 sm:mb-6 text-ghost-text-primary">
            Your desk needs<br />a ghost friend
          </h2>
          <p className="text-apple-subtitle font-body text-ghost-text-secondary max-w-3xl mx-auto">
            Big tank, quiet motor, RGB lights that actually look good. Built for people who work late.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto">
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
    const enterAnim = createEnterAnimation('card', index, 'card')
    const hoverAnim = createHoverAnimation('card')
    const tapAnim = createTapAnimation()

    return (
      <motion.div
        initial={prefersReducedMotion || !isVisible ? {} : enterAnim.initial}
        animate={prefersReducedMotion || !isVisible ? {} : enterAnim.animate}
        transition={prefersReducedMotion ? {} : enterAnim.transition}
        whileHover={prefersReducedMotion ? {} : hoverAnim}
        whileTap={prefersReducedMotion ? {} : tapAnim}
        onMouseEnter={playHoverSound}
        className="group relative aspect-square rounded-2xl overflow-hidden glass-neon border border-ghost-purple-primary/30 shadow-glass-dark transition-all duration-300 touch-manipulation"
        style={{
          transformStyle: 'preserve-3d',
          transitionTimingFunction: `cubic-bezier(${EASE_APPLE.join(',')})`,
        }}
      >
        <OptimizedImage
          prefix={feature.prefix}
          fill
          fit="contain"
          sizes="(max-width: 768px) 100vw, 50vw"
          alt={feature.alt}
          priority={priority}
          className="rounded-2xl transition-transform duration-500 group-hover:scale-105"
        />
        {/* 悬停时的发光效果 */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div 
            className="absolute inset-0 rounded-[2rem] sm:rounded-[2.5rem]"
            style={{
              background: 'radial-gradient(circle at center, rgba(124, 58, 237, 0.12), transparent 70%)',
              filter: 'blur(20px)',
            }}
          />
        </div>
      </motion.div>
    )
  }

  // Other cards: normal layout with text
  const enterAnim = createEnterAnimation('listItem', index, 'standard')
  const hoverAnim = createHoverAnimation('card')

  return (
      <motion.div
        initial={prefersReducedMotion || !isVisible ? {} : enterAnim.initial}
        animate={prefersReducedMotion || !isVisible ? {} : enterAnim.animate}
        transition={prefersReducedMotion ? {} : enterAnim.transition}
        whileHover={prefersReducedMotion ? {} : hoverAnim}
        onMouseEnter={playHoverSound}
        className="glass-neon rounded-2xl p-6 lg:p-8 border border-ghost-purple-primary/30 shadow-glass-dark transition-all duration-300"
        style={{
          transformStyle: 'preserve-3d',
          transitionTimingFunction: `cubic-bezier(${EASE_APPLE.join(',')})`,
        }}
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
      <h3 className="text-apple-title font-display mb-4 text-ghost-text-primary text-glow-purple transition-colors duration-300">{feature.title}</h3>
      <p className="text-apple-body font-body text-ghost-text-secondary transition-colors duration-300">{feature.description}</p>
    </motion.div>
  )
}
