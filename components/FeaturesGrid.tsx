'use client'

import { OptimizedImage } from '@/components/OptimizedImage'
import { useReducedMotion, useIntersectionObserver } from '@/lib/hooks'
import { motion } from 'framer-motion'
import { useRef } from 'react'

const features = [
  {
    title: 'Push to start',
    prefix: 'Hello1084/retro-mac-clock-push-to-start-original-startup-ritual-floppy-disk.webp',
    alt: 'Maclock push to start button with floppy disk',
    description:
      'Push to start the original startup ritual.',
  },
  {
    title: 'The smile sequence',
    prefix: 'Hello1084/retro-mac-clock-main-screen-time-year-smiley-three-modes-vintage.webp',
    alt: 'Maclock smiling face animation with "hello" glyph on screen',
    description:
      'Maclock wakes with the smile and floppy disk dance in under seven seconds, matched frame-for-frame to the original Macintosh hello.',
  },
  {
    title: 'Adjustable brightness',
    prefix: 'Hello1084/retro-mac-clock-backlight-adjustable-brightness-knob-handheld.webp',
    alt: 'Maclock backlight adjustable brightness knob handheld',
    description:
      'Adjustable brightness knob for comfortable viewing.',
  },
  {
    title: 'Soul completion',
    prefix: 'Hello1084/retro-mac-clock-soul-completion-plan-classic-icon-stickers-back-to-1984.webp',
    alt: 'Maclock with classic icon stickers back to 1984',
    description:
      'Classic icon stickers to complete the retro look.',
  },
  {
    title: 'Analog brightness dial',
    prefix: 'Hello1084/retro-mac-clock-four-alarm-modes-knob-morning-dusk-time-order.webp',
    alt: 'Maclock brightness adjustment graphic with glowing slider',
    description:
      'A tactile side dial gives you ten detented steps of glow—late-night dim or daylight bright—without menus or apps.',
  },
  {
    title: 'System disk ceremony',
    prefix: 'Hello1084/retro-mac-clock-crt-screen-pixel-level-tribute-lcd-classic-design.webp',
    alt: 'Maclock displaying the retro system disk animation during boot',
    description:
      'The disk icon glides in, hands off to the clock, and plays a warm chime that has been remastered for today’s speakers.',
  },
  {
    title: 'Alarm studio',
    prefix: 'Hello1084/retro-mac-clock-put-1984-design-on-your-desk-classic-hello-1984.webp',
    alt: 'Maclock showing multiple alarm modes on the display',
    description:
      "Set weekday alarms, weekend slow starts, or focus timers with their own tones. Every schedule lives on-device, so Wi-Fi never matters.",
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
      className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 scroll-mt-20 sm:scroll-mt-24"
      style={{ scrollMarginTop: 'calc(4rem + env(safe-area-inset-top))' }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={prefersReducedMotion || !isVisible ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion || !isVisible ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 sm:mb-20 lg:mb-24"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold mb-6 text-gray-900 tracking-[-0.022em] leading-[1.08]">
            Feels like a Mac.<br className="sm:hidden" /> Works like a clock.
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-[1.6] tracking-[-0.011em]">
            From the system disk and CRT-style display to backlight, alarms, and stickers, every control turns keeping time into a small 1984 ritual.
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
  // All cards: full-bleed image with no text
  if (index === 0 || index === 1 || index === 2 || index === 3 || index === 4 || index === 5 || index === 6) {
    return (
      <motion.div
        initial={prefersReducedMotion || !isVisible ? {} : { opacity: 0, y: 24 }}
        animate={prefersReducedMotion || !isVisible ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
        whileHover={prefersReducedMotion ? {} : { y: -4, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }}
        className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl"
      >
        <OptimizedImage
          prefix={feature.prefix}
          fill
          fit="cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          alt={feature.alt}
          priority={priority}
          className="rounded-3xl"
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
      className="glass-card rounded-2xl p-6 lg:p-8 overflow-hidden"
    >
      <div className="relative aspect-[3/4] mb-6 overflow-hidden image-container-text">
        <OptimizedImage
          prefix={feature.prefix}
          fill
          fit="contain"
          sizes="(max-width: 768px) 100vw, 50vw"
          alt={feature.alt}
          priority={priority}
        />
      </div>
      <h3 className="text-2xl font-semibold mb-4 text-gray-900 tracking-[-0.02em] leading-[1.1]">{feature.title}</h3>
      <p className="text-gray-600 leading-[1.6] tracking-[-0.011em]">{feature.description}</p>
    </motion.div>
  )
}
