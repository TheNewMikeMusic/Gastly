'use client'

import { OptimizedImage } from '@/components/OptimizedImage'
import { useReducedMotion, useIntersectionObserver } from '@/lib/hooks'
import { motion } from 'framer-motion'
import { useRef } from 'react'

const narratives = [
  {
    title: 'The startup ritual returns.',
    description:
      'Maclock still greets you with the smiling face, floppy disk, and gentle fade that made the first Macintosh feel alive—now tuned to modern hardware so it happens in seconds.',
    prefix: 'maclock_boot_smile_feature_grid_apple_style.jpg',
    alt: 'Maclock showing the smiling Macintosh boot screen beside the system disk animation',
    imageLeft: true,
  },
  {
    title: 'Industrial warmth for 2025 desks.',
    description:
      'A bead-blasted shell, satin lens, and USB-C core feel intentional alongside modern tablets and notebooks while keeping the original Macintosh proportions intact.',
    prefix: 'maclock_1984_design_reimagined_apple_style',
    alt: 'Maclock hardware profile highlighting the vented rear case and curved display glass',
    imageLeft: false,
  },
]

export function NarrativeBlocks() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16 lg:space-y-24">
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
      initial={prefersReducedMotion || !isVisible ? {} : { opacity: 0, y: 24 }}
      animate={prefersReducedMotion || !isVisible ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      className={`flex flex-col ${narrative.imageLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 sm:gap-10 lg:gap-20 items-center`}
    >
      <motion.div 
        initial={prefersReducedMotion || !isVisible ? {} : { opacity: 0, scale: 0.96 }}
        animate={prefersReducedMotion || !isVisible ? {} : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: index * 0.12 + 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 relative aspect-[3/4] rounded-xl sm:rounded-2xl overflow-hidden bg-gray-50 w-full"
      >
        <OptimizedImage
          prefix={narrative.prefix}
          fill
          fit="contain"
          sizes="(max-width: 1024px) 100vw, 50vw"
          alt={narrative.alt}
        />
      </motion.div>
      <div className="flex-1 space-y-4 sm:space-y-6 lg:px-8 text-center lg:text-left">
        <p className="text-xs uppercase tracking-[0.15em] text-gray-500 font-medium">Chapter {index + 1}</p>
        <h2 className="text-2xl sm:text-3xl lg:text-5xl font-semibold text-gray-900 tracking-[-0.022em] leading-[1.08]">{narrative.title}</h2>
        <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-[1.6] tracking-[-0.011em]">{narrative.description}</p>
      </div>
    </motion.div>
  )
}
