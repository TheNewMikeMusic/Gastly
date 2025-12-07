'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@/lib/hooks'

export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion) return

    // 延迟加载音频：等待页面主要内容加载完成
    const loadAudio = () => {
      // 创建音频元素
      const audio = new Audio('/16.勝利(VSトレーナー)_(1)_out.mp3')
      audio.loop = true
      audio.volume = 0.05 // 非常小的音量（5%）
      audio.preload = 'none' // 延迟加载，不预加载
    
      audioRef.current = audio

      // 处理音频加载错误
      audio.addEventListener('error', (e) => {
        console.debug('Background music failed to load:', e)
      })

      // 用户交互处理函数
      const handleUserInteraction = () => {
        if (audioRef.current && !hasInteracted) {
          try {
            // load() 是同步方法，直接调用
            audioRef.current.load()
            // 然后尝试播放，确保 play() 返回 Promise
            const playPromise = audioRef.current.play()
            if (playPromise !== undefined) {
              playPromise.catch((err) => {
                console.debug('Play failed:', err)
              })
            }
            setHasInteracted(true)
          } catch (err) {
            console.debug('Audio interaction failed:', err)
          }
        }
      }

      // 尝试自动播放
      const tryAutoplay = async () => {
        try {
          // 先加载音频（load() 是同步方法，不返回 Promise）
          audio.load()
          const playPromise = audio.play()
          if (playPromise !== undefined) {
            await playPromise
          }
          setHasInteracted(true)
        } catch (error) {
          // 如果自动播放被阻止，等待用户交互
          console.debug('Autoplay prevented, waiting for user interaction')
          
          // 监听用户交互事件
          const events = ['click', 'touchstart', 'keydown', 'scroll']
          events.forEach((event) => {
            document.addEventListener(event, handleUserInteraction, { once: true })
          })
        }
      }

      // 清理函数：移除事件监听器
      const cleanup = () => {
        const events = ['click', 'touchstart', 'keydown', 'scroll']
        events.forEach((event) => {
          document.removeEventListener(event, handleUserInteraction)
        })
      }

      // 等待音频加载完成后尝试播放
      audio.addEventListener('canplaythrough', tryAutoplay, { once: true })
      
      // 如果canplaythrough事件没有触发，也尝试播放
      const timeout = setTimeout(() => {
        tryAutoplay()
      }, 1000)

      return () => {
        clearTimeout(timeout)
        cleanup()
        audio.pause()
        audio.removeEventListener('error', () => {})
        audio.removeEventListener('canplaythrough', tryAutoplay)
      }
    }

    // 延迟加载：等待页面主要内容加载完成
    const timeout = setTimeout(loadAudio, 2000)

    return () => {
      clearTimeout(timeout)
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [prefersReducedMotion])

  // 监听静音状态变化
  useEffect(() => {
    if (!audioRef.current) return
    
    if (isMuted) {
      audioRef.current.volume = 0
    } else {
      audioRef.current.volume = 0.05
    }
  }, [isMuted])

  // 确保按钮样式始终正确
  useEffect(() => {
    const button = buttonRef.current
    if (!button) return

    const maintainStyle = () => {
      button.style.backgroundColor = 'rgba(0, 0, 0, 0.75)'
      button.style.opacity = '1'
      button.style.borderColor = 'rgba(124, 58, 237, 0.5)'
    }

    // 监听所有可能改变样式的事件
    const events = ['mousedown', 'mouseup', 'touchstart', 'touchend', 'click', 'focus', 'blur']
    events.forEach((event) => {
      button.addEventListener(event, maintainStyle)
    })

    // 使用MutationObserver监听样式变化
    const observer = new MutationObserver(() => {
      maintainStyle()
    })

    observer.observe(button, {
      attributes: true,
      attributeFilter: ['style', 'class'],
      subtree: false,
    })

    // 定期检查并修复样式（作为备用方案）
    const interval = setInterval(maintainStyle, 100)

    return () => {
      events.forEach((event) => {
        button.removeEventListener(event, maintainStyle)
      })
      observer.disconnect()
      clearInterval(interval)
    }
  }, [])

  const toggleMute = () => {
    if (!audioRef.current) return
    setIsMuted(!isMuted)
    // 确保点击后样式正确
    if (buttonRef.current) {
      buttonRef.current.style.backgroundColor = 'rgba(0, 0, 0, 0.75)'
      buttonRef.current.style.opacity = '1'
    }
  }

  // 如果用户偏好减少动画，不显示音乐控制
  if (prefersReducedMotion) {
    return null
  }

  return (
    <button
      ref={buttonRef}
      onClick={toggleMute}
      className="music-control-btn"
      style={{
        position: 'fixed',
        bottom: '1rem',
        right: '1rem',
        width: '3rem',
        height: '3rem',
        minWidth: '3rem',
        minHeight: '3rem',
        borderRadius: '9999px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '2px solid rgba(124, 58, 237, 0.5)',
        boxShadow: '0 10px 30px rgba(124, 58, 237, 0.2)',
        WebkitTapHighlightColor: 'transparent',
        cursor: 'pointer',
        zIndex: 99999,
        isolation: 'isolate',
        opacity: '1',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        touchAction: 'manipulation',
        padding: '0',
        margin: '0',
        fontFamily: 'inherit',
        fontSize: 'inherit',
        lineHeight: 'inherit',
        color: 'inherit',
        textTransform: 'none',
        WebkitAppearance: 'none',
        appearance: 'none',
        backgroundImage: 'none',
      }}
      aria-label={isMuted ? 'Unmute background music' : 'Mute background music'}
      title={isMuted ? 'Unmute music' : 'Mute music'}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)'
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = 'scale(0.95)'
        e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.75)'
        e.currentTarget.style.opacity = '1'
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = 'scale(1)'
        e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.75)'
        e.currentTarget.style.opacity = '1'
      }}
      onTouchStart={(e) => {
        e.currentTarget.style.transform = 'scale(0.95)'
        e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.75)'
        e.currentTarget.style.opacity = '1'
      }}
      onTouchEnd={(e) => {
        e.currentTarget.style.transform = 'scale(1)'
        e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.75)'
        e.currentTarget.style.opacity = '1'
      }}
    >
      {isMuted ? (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-purple-400"
        >
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      ) : (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-purple-400"
        >
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
      )}
    </button>
  )
}

