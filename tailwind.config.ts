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
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-sm': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.1), 0 2px 8px 0 rgba(0, 0, 0, 0.05)',
        'glass-hover': '0 12px 48px 0 rgba(0, 0, 0, 0.15), 0 4px 12px 0 rgba(0, 0, 0, 0.08)',
        'inner-glass': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.5)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.4), 0 2px 8px 0 rgba(0, 0, 0, 0.2)',
        'glass-dark-hover': '0 12px 48px 0 rgba(0, 0, 0, 0.5), 0 4px 12px 0 rgba(0, 0, 0, 0.3)',
        'light-bloom': '0 0 60px rgba(255, 255, 255, 0.1), 0 0 120px rgba(255, 255, 255, 0.05)',
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

