'use client'

import { OptimizedImage } from '@/components/OptimizedImage'
import { SectionBackground } from '@/components/SectionBackground'
import { useReducedMotion, useIntersectionObserver } from '@/lib/hooks'
import { motion } from 'framer-motion'
import { useRef } from 'react'

const narratives = [
  {
    title: '',
    description:
      'From the pixel smile to the under-chassis brightness wheel, Hello 1984 rebuilds the small Macintosh rituals so you don\u2019t just check the time\u2014you boot it up, dial it in, and let it glow.',
    prefix: 'Hello1084/retro-mac-original-startup-smile-authentic-system-disk-analog-brightness-control.webp',
    alt: 'Maclock showing the smiling Macintosh boot screen beside the system disk animation',
    imageLeft: true,
  },
  {
    title: '',
    description:
      'From playful case stickers to a classic dot-matrix screen, Hello 1984 looks like a Macintosh and reads like a modern clock — clear at a glance, even half asleep.',
    prefix: 'Hello1084/retro-mac-clock-body-stickers-dot-matrix-vibrant-information-display.webp',
    alt: 'Maclock hardware profile highlighting the vented rear case and curved display glass',
    imageLeft: false,
  },
]

export function NarrativeBlocks() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section id="features" className="pt-0 sm:pt-0 lg:pt-0 pb-20 sm:pb-28 lg:pb-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <SectionBackground variant="subtle" />
      <div className="max-w-7xl mx-auto space-y-16 lg:space-y-24 relative z-10">
        {narratives.map((narrative, index) => (
          <NarrativeBlock
            key={narrative.prefix}
            narrative={narrative}
            index={index}
            prefersReducedMotion={prefersReducedMotion}
          />
        ))}
      </div>
    </section>
  )
}

function NarrativeBlock({
  narrative,
  index,
  prefersReducedMotion,
}: {
  narrative: typeof narratives[0]
  index: number
  prefersReducedMotion: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isVisible = useIntersectionObserver(ref, { threshold: 0.2 })

  return (
    <motion.div
      ref={ref}
      initial={prefersReducedMotion || !isVisible ? {} : { opacity: 0, y: 32 }}
      animate={prefersReducedMotion || !isVisible ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      className={`flex flex-col ${narrative.imageLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-10 lg:gap-20 items-center`}
    >
      <motion.div 
        initial={prefersReducedMotion || !isVisible ? {} : { opacity: 0, scale: 0.96 }}
        animate={prefersReducedMotion || !isVisible ? {} : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: index * 0.15 + 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 relative aspect-[3/4] overflow-hidden rounded-apple sm:rounded-apple-lg shadow-medium hover:shadow-deep transition-all duration-500 ease-apple-smooth border border-black/[0.06]"
      >
        <OptimizedImage
          prefix={narrative.prefix}
          fill
          fit="cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
          alt={narrative.alt}
          className="rounded-[2rem] sm:rounded-[2.5rem]"
        />
      </motion.div>
      <div className="flex-1 space-y-6 lg:px-8">
        {narrative.title && <h2 className="text-apple-headline font-apple-semibold text-[#1d1d1f] text-center lg:text-left">{narrative.title}</h2>}
        <p className={`text-apple-subtitle font-apple-normal text-[#424245] text-center lg:text-left ${!narrative.title ? 'pt-8' : ''}`}>{narrative.description}</p>
      </div>
    </motion.div>
  )
}
