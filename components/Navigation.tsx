'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { BuyButton } from '@/components/BuyButton'

const navItems = [
  { label: 'Features', href: '/#features' },
  { label: 'Gallery', href: '/#gallery' },
  { label: 'Specs', href: '/#specs' },
  { label: 'FAQ', href: '/#faq' },
]

export function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [menuOpen])

  const shellClass = scrolled
    ? 'bg-white/90 md:bg-white/90 border border-white/80 md:border-white/80 text-gray-900 shadow-lg backdrop-blur-2xl'
    : 'bg-white/75 md:bg-white/60 border border-white/50 md:border-white/40 text-gray-900 shadow-[0_20px_50px_rgba(15,15,20,0.25)] md:shadow-[0_20px_50px_rgba(15,15,20,0.2)] backdrop-blur-2xl'

  const allLinks = [...navItems, { label: 'Contact', href: '/contact' }]

  return (
    <>
      <motion.nav initial={{ y: -100 }} animate={{ y: 0 }} className="fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div
            className={`flex h-14 items-center justify-between rounded-full px-5 sm:px-6 transition-colors duration-500 ${shellClass}`}
          >
            <Link
              href="/"
              className="text-lg font-semibold tracking-tight text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/40 focus-visible:ring-offset-2 rounded-full"
              aria-label="Maclock home"
            >
              Maclock
            </Link>
            <nav className="hidden md:flex items-center gap-4" aria-label="Primary">
              {allLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-gray-700 hover:text-gray-900 rounded-full px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/30"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex">
                <BuyButton
                  size="sm"
                  variant="primary"
                  className={scrolled ? 'bg-gray-900 text-white hover:bg-gray-950 shadow-[0_15px_45px_rgba(2,6,23,0.35)]' : ''}
                />
              </div>
              <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                className="md:hidden h-10 w-10 rounded-full border border-white/60 bg-white/80 backdrop-blur-xl shadow-[0_4px_20px_rgba(15,15,20,0.15)] px-0 flex flex-col items-center justify-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/40 transition-all duration-300 hover:bg-white/90 hover:shadow-[0_6px_25px_rgba(15,15,20,0.2)]"
                aria-label="Toggle navigation menu"
                aria-expanded={menuOpen}
              >
                <span
                  className={`block h-[2px] w-5 bg-gray-900 transition-transform ${menuOpen ? 'translate-y-[7px] rotate-45' : ''}`}
                />
                <span className={`block h-[2px] w-5 bg-gray-900 transition-opacity ${menuOpen ? 'opacity-0' : 'opacity-100'}`} />
                <span
                  className={`block h-[2px] w-5 bg-gray-900 transition-transform ${menuOpen ? '-translate-y-[7px] -rotate-45' : ''}`}
                />
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
            onClick={() => setMenuOpen(false)}
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="absolute top-20 right-4 left-4 rounded-3xl bg-white shadow-2xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <nav className="space-y-3" aria-label="Mobile navigation">
                {allLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block rounded-2xl px-4 py-3 text-base font-semibold text-gray-900 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/40"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
