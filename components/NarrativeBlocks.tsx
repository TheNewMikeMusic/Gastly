'use client'

import { OptimizedImage } from '@/components/OptimizedImage'
import { SectionBackground } from '@/components/SectionBackground'
import { useReducedMotion, useIntersectionObserver } from '@/lib/hooks'
import { useGBASound } from '@/lib/hooks/useGBASound'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRef, useState } from 'react'
import { createEnterAnimation, createHoverAnimation, EASE_APPLE } from '@/lib/animations'

const views = [
  {
    prefix: 'Gastly/Front.png',
    alt: 'Gastly Humidifier 2.1 front view',
    angle: 'Front',
    description: 'Front view with purple mist',
  },
  {
    prefix: 'Gastly/left.png',
    alt: 'Gastly Humidifier 2.1 left side view',
    angle: 'Left',
    description: 'Left side profile',
  },
  {
    prefix: 'Gastly/right.png',
    alt: 'Gastly Humidifier 2.1 right side view',
    angle: 'Right',
    description: 'Right side view',
  },
]

export function NarrativeBlocks() {
  const prefersReducedMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const isVisible = useIntersectionObserver(sectionRef, { threshold: 0.1 })
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number>(0)
  const { playHoverSound, playSelectSound } = useGBASound()

  return (
    <section 
      ref={sectionRef}
      id="features" 
      className="pt-20 sm:pt-28 lg:pt-32 pb-20 sm:pb-28 lg:pb-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      <SectionBackground variant="subtle" />
      <div className="max-w-5xl mx-auto relative z-10">
        {/* 桌面版：大图 + 缩略图导航 */}
        <div className="hidden lg:block">
          <div className="space-y-6">
            {/* 主图区域 - 上方 */}
            <motion.div
              {...createEnterAnimation('scale', 0)}
              initial={prefersReducedMotion || !isVisible ? {} : createEnterAnimation('scale', 0).initial}
              animate={prefersReducedMotion || !isVisible ? {} : createEnterAnimation('scale', 0).animate}
              transition={prefersReducedMotion ? {} : createEnterAnimation('scale', 0).transition}
              className="relative aspect-square bg-ghost-bg-card rounded-3xl overflow-hidden border border-ghost-purple-primary/30 shadow-glass-dark max-w-2xl mx-auto"
              style={{ borderColor: 'rgba(124, 58, 237, 0.3)' }}
            >
              <OptimizedImage
                prefix={views[selectedIndex].prefix}
                fill
                fit="contain"
                sizes="(max-width: 1024px) 100vw, 100vw"
                alt={views[selectedIndex].alt}
                priority={selectedIndex === 0}
                className="object-contain p-8 sm:p-12"
              />
              {/* 悬停时的描述覆盖层 */}
              {hoveredIndex === selectedIndex && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-6 sm:p-8"
                >
                  <p className="text-sm sm:text-base font-body text-white/90 leading-relaxed">
                    {views[selectedIndex].description}
                  </p>
                </motion.div>
              )}
            </motion.div>

            {/* 缩略图导航 - 下方横向排列 */}
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
              {views.map((view, index) => (
                <motion.button
                  key={view.prefix}
                  onClick={() => {
                    playSelectSound()
                    setSelectedIndex(index)
                  }}
                  onMouseEnter={() => {
                    playHoverSound()
                    setHoveredIndex(index)
                  }}
                  onMouseLeave={() => setHoveredIndex(null)}
                  {...createEnterAnimation('listItem', index, 'standard')}
                  initial={prefersReducedMotion || !isVisible ? {} : createEnterAnimation('listItem', index, 'standard').initial}
                  animate={prefersReducedMotion || !isVisible ? {} : createEnterAnimation('listItem', index, 'standard').animate}
                  transition={prefersReducedMotion ? {} : createEnterAnimation('listItem', index, 'standard').transition}
                  className={`relative w-full aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                    selectedIndex === index
                      ? 'shadow-lg shadow-ghost-purple-primary/30 scale-105'
                      : ''
                  }`}
                  style={{
                    borderColor: selectedIndex === index 
                      ? 'rgba(124, 58, 237, 1)' 
                      : 'rgba(124, 58, 237, 0.2)',
                  }}
                >
                  <OptimizedImage
                    prefix={view.prefix}
                    fill
                    fit="cover"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    alt={view.alt}
                    className={`object-cover transition-transform duration-300 ${
                      selectedIndex === index ? 'scale-110' : 'group-hover:scale-105'
                    }`}
                  />
                  {/* 选中指示器 */}
                  {selectedIndex === index && (
                    <div className="absolute inset-0 bg-ghost-purple-primary/10" />
                  )}
                  {/* 角度标签 */}
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1">
                    <span className="text-xs font-display text-white uppercase tracking-wider">
                      {view.angle}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* 移动版：网格布局 - 静态展示，不可点击 */}
        <div className="lg:hidden">
          <div className="grid grid-cols-1 gap-6 sm:gap-8">
            {views.map((view, index) => (
              <ProductViewCard
                key={view.prefix}
                view={view}
                index={index}
                isVisible={isVisible}
                prefersReducedMotion={prefersReducedMotion}
                isHovered={false}
                onHover={() => {}}
                onLeave={() => {}}
                isMobile={true}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function ProductViewCard({
  view,
  index,
  isVisible,
  prefersReducedMotion,
  isHovered,
  onHover,
  onLeave,
  isMobile = false,
}: {
  view: typeof views[0]
  index: number
  isVisible: boolean
  prefersReducedMotion: boolean
  isHovered: boolean
  onHover: () => void
  onLeave: () => void
  isMobile?: boolean
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const { playHoverSound } = useGBASound()
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x, { stiffness: 500, damping: 100 })
  const mouseYSpring = useSpring(y, { stiffness: 500, damping: 100 })

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['5deg', '-5deg'])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-5deg', '5deg'])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || prefersReducedMotion || isMobile) return

    const rect = cardRef.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5

    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    if (isMobile) return
    x.set(0)
    y.set(0)
    onLeave()
  }

  return (
    <motion.div
      ref={cardRef}
      {...createEnterAnimation('card', index, 'standard')}
      initial={prefersReducedMotion || !isVisible ? {} : createEnterAnimation('card', index, 'standard').initial}
      animate={prefersReducedMotion || !isVisible ? {} : createEnterAnimation('card', index, 'standard').animate}
      transition={prefersReducedMotion ? {} : createEnterAnimation('card', index, 'standard').transition}
      onMouseMove={isMobile ? undefined : handleMouseMove}
      onMouseEnter={isMobile ? undefined : () => {
        playHoverSound()
        onHover()
      }}
      onMouseLeave={isMobile ? undefined : handleMouseLeave}
      className="group relative"
      style={{
        pointerEvents: isMobile ? 'none' : 'auto',
        cursor: isMobile ? 'default' : 'default',
      }}
    >
      <motion.div
        style={{
          rotateX: prefersReducedMotion ? 0 : rotateX,
          rotateY: prefersReducedMotion ? 0 : rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative h-full"
      >
        {/* 卡片容器 */}
        <div className={`relative w-full aspect-square overflow-hidden rounded-2xl glass-neon border border-ghost-purple-primary/30 shadow-glass-dark transition-all duration-300 ${isMobile ? '' : 'group-hover:border-purple-400/50 group-hover:shadow-glass-dark-hover'}`}
          style={{
            transitionTimingFunction: `cubic-bezier(${EASE_APPLE.join(',')})`,
          }}
        >
          {/* 图片 */}
          <div className="relative w-full h-full p-6 sm:p-8">
            <OptimizedImage
              prefix={view.prefix}
              fill
              fit="contain"
              sizes="(max-width: 768px) 100vw, 50vw"
              alt={view.alt}
              className="object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          {/* 悬停时的信息覆盖层 - 手机版不显示 */}
          {!isMobile && (
            <motion.div
              initial={false}
              animate={{
                opacity: isHovered ? 1 : 0,
                y: isHovered ? 0 : 20,
              }}
              transition={{ duration: 0.3, ease: EASE_APPLE }}
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6 sm:p-8 pointer-events-none"
            >
            <div className="space-y-2">
              <div className="text-xs sm:text-sm font-display text-ghost-purple-accent uppercase tracking-wider mb-2">
                {view.angle} View
              </div>
              <p className="text-sm sm:text-base font-body text-white/90 leading-relaxed">
                {view.description}
              </p>
            </div>
          </motion.div>
          )}

          {/* 紫色光晕效果增强 - 手机版不显示 */}
          {!isMobile && (
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div 
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(circle at center, rgba(124, 58, 237, 0.15), rgba(168, 85, 247, 0.08) 50%, transparent 70%)',
                filter: 'blur(30px)',
              }}
            />
            <div 
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(circle at center, rgba(124, 58, 237, 0.08), transparent 70%)',
              }}
            />
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
