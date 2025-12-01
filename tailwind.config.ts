import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        'hero-dark': {
          '50': '#2a2a2a',
          '100': '#1a1a1a',
          '200': '#0a0a0a',
        },
        // 霓虹色系统
        neon: {
          purple: '#A855F7',
          'purple-dark': '#7C3AED',
          cyan: '#06B6D4',
          pink: '#EC4899',
          blue: '#3B82F6',
        },
      },
      fontFamily: {
        sans: [
          '"Comfortaa"',
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"Helvetica Neue"',
          'system-ui',
          'sans-serif',
        ],
        display: [
          '"Fredoka One"',
          '"Comfortaa"',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'sans-serif',
        ],
      },
      fontSize: {
        // Pokemon-style typography scale - more relaxed letter spacing
        'xs': ['0.75rem', { lineHeight: '1.333', letterSpacing: '0.005em', fontWeight: '400' }],
        'sm': ['0.875rem', { lineHeight: '1.429', letterSpacing: '0.01em', fontWeight: '400' }],
        'base': ['1rem', { lineHeight: '1.5', letterSpacing: '0.01em', fontWeight: '400' }],
        'lg': ['1.125rem', { lineHeight: '1.556', letterSpacing: '0.01em', fontWeight: '400' }],
        'xl': ['1.25rem', { lineHeight: '1.5', letterSpacing: '0.01em', fontWeight: '400' }],
        '2xl': ['1.5rem', { lineHeight: '1.5', letterSpacing: '0.01em', fontWeight: '400' }],
        '3xl': ['1.875rem', { lineHeight: '1.4', letterSpacing: '0.015em', fontWeight: '400' }],
        '4xl': ['2.25rem', { lineHeight: '1.333', letterSpacing: '0.02em', fontWeight: '400' }],
        '5xl': ['3rem', { lineHeight: '1.2', letterSpacing: '0.02em', fontWeight: '400' }],
        '6xl': ['3.75rem', { lineHeight: '1.167', letterSpacing: '0.02em', fontWeight: '400' }],
        '7xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '0.02em', fontWeight: '400' }],
        '8xl': ['6rem', { lineHeight: '1', letterSpacing: '0.02em', fontWeight: '400' }],
        '9xl': ['8rem', { lineHeight: '1', letterSpacing: '0.02em', fontWeight: '400' }],
        // Pokemon typography system - responsive display sizes
        'display': ['clamp(2.5rem, 8vw, 4.5rem)', { lineHeight: '1.1', letterSpacing: '0.02em', fontWeight: '600' }],
        'display-sm': ['clamp(2rem, 6vw, 3.5rem)', { lineHeight: '1.1', letterSpacing: '0.02em', fontWeight: '600' }],
        'headline': ['clamp(1.875rem, 5vw, 3rem)', { lineHeight: '1.2', letterSpacing: '0.015em', fontWeight: '600' }],
        'headline-sm': ['clamp(1.5rem, 4vw, 2.5rem)', { lineHeight: '1.2', letterSpacing: '0.015em', fontWeight: '600' }],
        'title': ['clamp(1.25rem, 3vw, 1.875rem)', { lineHeight: '1.4', letterSpacing: '0.01em', fontWeight: '600' }],
        'title-sm': ['clamp(1.125rem, 2.5vw, 1.5rem)', { lineHeight: '1.4', letterSpacing: '0.01em', fontWeight: '600' }],
        'body': ['clamp(1rem, 2vw, 1.125rem)', { lineHeight: '1.5', letterSpacing: '0.01em', fontWeight: '400' }],
        'body-sm': ['clamp(0.9375rem, 1.5vw, 1rem)', { lineHeight: '1.5', letterSpacing: '0.01em', fontWeight: '400' }],
        'caption': ['clamp(0.875rem, 2vw, 1rem)', { lineHeight: '1.429', letterSpacing: '0.01em', fontWeight: '400' }],
        'footnote': ['clamp(0.75rem, 1.5vw, 0.875rem)', { lineHeight: '1.333', letterSpacing: '0.005em', fontWeight: '400' }],
      },
      fontWeight: {
        'light': '300',
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
      },
      letterSpacing: {
        'tighter': '-0.01em',
        'tight': '0em',
        'normal': '0.01em',
        'wide': '0.03em',
        'wider': '0.05em',
        'widest': '0.1em',
      },
      spacing: {
        // 8px grid system
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        // Safe area insets
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
        // Apple standard spacing
        'touch': '2.75rem', // 44px minimum touch target
      },
      borderRadius: {
        // Apple standard rounded corners
        'xl': '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
        'apple': '1.75rem', // Standard Apple card radius
        'apple-lg': '2rem', // Large Apple card radius
        'apple-xl': '2.5rem', // Extra large Apple card radius
      },
      boxShadow: {
        'shallow': '0 1px 3px rgba(0, 0, 0, 0.1)',
        'medium': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'deep': '0 12px 40px rgba(0, 0, 0, 0.12)',
        'glass': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'glass-hover': '0 12px 40px rgba(0, 0, 0, 0.12)',
        'inner-glass': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.5)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.4), 0 2px 8px 0 rgba(0, 0, 0, 0.2)',
        'glass-dark-hover': '0 12px 48px 0 rgba(0, 0, 0, 0.5), 0 4px 12px 0 rgba(0, 0, 0, 0.3)',
        'light-bloom': '0 0 60px rgba(255, 255, 255, 0.1), 0 0 120px rgba(255, 255, 255, 0.05)',
        // 霓虹发光效果
        'neon-purple': '0 0 5px rgba(168, 85, 247, 0.5), 0 0 10px rgba(168, 85, 247, 0.4), 0 0 15px rgba(168, 85, 247, 0.3), 0 0 20px rgba(124, 58, 237, 0.2)',
        'neon-purple-lg': '0 0 10px rgba(168, 85, 247, 0.7), 0 0 20px rgba(168, 85, 247, 0.6), 0 0 30px rgba(168, 85, 247, 0.5), 0 0 40px rgba(124, 58, 237, 0.4)',
        'neon-cyan': '0 0 5px rgba(6, 182, 212, 0.5), 0 0 10px rgba(6, 182, 212, 0.4), 0 0 15px rgba(6, 182, 212, 0.3)',
        'neon-pink': '0 0 5px rgba(236, 72, 153, 0.5), 0 0 10px rgba(236, 72, 153, 0.4), 0 0 15px rgba(236, 72, 153, 0.3)',
      },
      transitionTimingFunction: {
        'apple-standard': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'apple-smooth': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
      },
      backdropBlur: {
        'xs': '2px',
      },
      backgroundImage: {
        'gradient-hero-dark': 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2a2a2a 100%)',
        'gradient-light-radial': 'radial-gradient(circle at top right, rgba(255, 255, 255, 0.15) 0%, transparent 70%)',
      },
    },
  },
  plugins: [],
}
export default config

