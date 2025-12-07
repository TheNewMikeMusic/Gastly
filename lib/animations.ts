/**
 * 统一的动画配置系统
 * 确保所有组件使用一致的动画时长、缓动函数和延迟策略
 */

// Apple 标准缓动函数
export const EASE_APPLE = [0.16, 1, 0.3, 1] as const

// 动画时长（秒）
export const DURATION = {
  instant: 0.1,    // 即时反馈（点击）
  fast: 0.2,       // 快速交互（按钮悬停）
  standard: 0.3,   // 标准过渡
  normal: 0.5,     // 正常过渡
  enter: 0.6,      // 进入动画（卡片）
  title: 0.8,      // 标题动画
  slow: 1.0,       // 慢速动画
} as const

// 延迟策略
export const DELAY = {
  standard: 0.1,   // 标准延迟（列表项）
  card: 0.15,      // 卡片延迟
  staggered: 0.08, // 交错延迟（密集列表）
} as const

// 进入动画配置
export const ENTER_ANIMATIONS = {
  title: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: DURATION.title, ease: EASE_APPLE },
  },
  card: {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: DURATION.enter, ease: EASE_APPLE },
  },
  listItem: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: DURATION.normal, ease: EASE_APPLE },
  },
  scale: {
    initial: { opacity: 0, scale: 0.96 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: DURATION.enter, ease: EASE_APPLE },
  },
} as const

// 悬停动画配置
export const HOVER_ANIMATIONS = {
  card: {
    y: -4,
    scale: 1.01,
    transition: { duration: DURATION.standard, ease: EASE_APPLE },
  },
  button: {
    scale: 1.05,
    transition: { duration: DURATION.fast, ease: EASE_APPLE },
  },
  image: {
    scale: 1.05,
    transition: { duration: DURATION.normal, ease: EASE_APPLE },
  },
} as const

// 点击动画配置
export const TAP_ANIMATIONS = {
  standard: {
    scale: 0.98,
    transition: { duration: DURATION.instant, ease: EASE_APPLE },
  },
} as const

// 获取延迟时间的辅助函数
export function getStaggerDelay(index: number, type: 'standard' | 'card' | 'staggered' = 'standard'): number {
  const delayValue = DELAY[type]
  return index * delayValue
}

// 创建进入动画配置的辅助函数
export function createEnterAnimation(
  type: 'title' | 'card' | 'listItem' | 'scale',
  index: number = 0,
  delayType: 'standard' | 'card' | 'staggered' = 'standard'
) {
  const baseAnimation = ENTER_ANIMATIONS[type]
  const delay = index > 0 ? getStaggerDelay(index, delayType) : 0
  
  return {
    initial: baseAnimation.initial,
    animate: baseAnimation.animate,
    transition: {
      ...baseAnimation.transition,
      delay,
    },
  }
}

// 创建悬停动画配置的辅助函数
export function createHoverAnimation(type: 'card' | 'button' | 'image') {
  return HOVER_ANIMATIONS[type]
}

// 创建点击动画配置的辅助函数
export function createTapAnimation() {
  return TAP_ANIMATIONS.standard
}


