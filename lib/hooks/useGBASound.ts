'use client'

import { useRef, useCallback } from 'react'

/**
 * GBA 风格的音效 hook
 * 生成类似 Game Boy Advance 的短促"哔"声
 */
export function useGBASound() {
  const audioContextRef = useRef<AudioContext | null>(null)
  const lastPlayTimeRef = useRef<number>(0)
  const throttleDelay = 100 // 防止音效过于频繁播放

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    return audioContextRef.current
  }, [])

  const playSound = useCallback((frequency: number = 800, duration: number = 50, volume: number = 0.15) => {
    // 节流：防止音效过于频繁
    const now = Date.now()
    if (now - lastPlayTimeRef.current < throttleDelay) {
      return
    }
    lastPlayTimeRef.current = now

    try {
      const audioContext = getAudioContext()
      
      // 创建振荡器（生成音调）
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      // 连接节点
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      // GBA 风格：方波，短促
      oscillator.type = 'square' // 方波产生 8-bit 风格
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)

      // 音量包络：快速衰减，模拟 GBA 音效
      const currentTime = audioContext.currentTime
      gainNode.gain.setValueAtTime(0, currentTime)
      gainNode.gain.linearRampToValueAtTime(volume, currentTime + 0.01) // 快速上升
      gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + duration / 1000) // 快速衰减

      // 播放
      oscillator.start(currentTime)
      oscillator.stop(currentTime + duration / 1000)

      // 清理
      oscillator.onended = () => {
        oscillator.disconnect()
        gainNode.disconnect()
      }
    } catch (error) {
      // 静默失败，不影响用户体验
      console.debug('Audio playback failed:', error)
    }
  }, [getAudioContext])

  // 不同场景的音效变体
  const playHoverSound = useCallback(() => {
    // 轻快的 hover 音效：稍高频率，短促
    playSound(900, 40, 0.12)
  }, [playSound])

  const playClickSound = useCallback(() => {
    // 点击音效：稍低频率，稍长
    playSound(600, 60, 0.18)
  }, [playSound])

  const playSelectSound = useCallback(() => {
    // 选择音效：中等频率
    playSound(750, 50, 0.15)
  }, [playSound])

  return {
    playHoverSound,
    playClickSound,
    playSelectSound,
    playSound,
  }
}

