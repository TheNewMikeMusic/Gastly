'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

export function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className={`text-xl font-semibold hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 rounded ${
              scrolled
                ? 'text-gray-900 focus:ring-gray-900'
                : 'text-white focus:ring-white'
            }`}
            aria-label="Maclock Home"
          >
            Maclock
          </Link>
          <nav className="flex items-center gap-6" aria-label="Main navigation">
            <Link
              href="/#features"
              className={`hidden sm:inline-block text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 rounded ${
                scrolled
                  ? 'text-gray-700 hover:text-gray-900 focus:ring-gray-900'
                  : 'text-gray-200 hover:text-white focus:ring-white'
              }`}
            >
              Features
            </Link>
            <Link
              href="/#faq"
              className={`hidden sm:inline-block text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 rounded ${
                scrolled
                  ? 'text-gray-700 hover:text-gray-900 focus:ring-gray-900'
                  : 'text-gray-200 hover:text-white focus:ring-white'
              }`}
            >
              FAQ
            </Link>
            <Link
              href="/contact"
              className={`hidden sm:inline-block text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 rounded ${
                scrolled
                  ? 'text-gray-700 hover:text-gray-900 focus:ring-gray-900'
                  : 'text-gray-200 hover:text-white focus:ring-white'
              }`}
            >
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </motion.nav>
  )
}

