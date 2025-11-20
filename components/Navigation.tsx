'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { BuyButton } from '@/components/BuyButton'
import { UserButton, SignedIn, SignedOut } from '@clerk/nextjs'

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
    ? 'bg-white/90 md:bg-white/90 border border-black/10 text-gray-900 shadow-medium backdrop-blur-[20px]'
    : 'bg-white/75 md:bg-white/60 border border-black/10 text-gray-900 shadow-medium backdrop-blur-[20px]'

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }} 
        animate={{ y: 0 }} 
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div
            className={`flex h-14 items-center justify-between rounded-full px-5 sm:px-6 transition-all duration-300 ease-apple-standard ${shellClass}`}
          >
            <Link
              href="/"
              className="text-lg font-semibold tracking-tight text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/40 focus-visible:ring-offset-2 rounded-full"
              aria-label="Hello1984 home"
            >
              Hello1984
            </Link>
            <nav className="hidden md:flex items-center gap-4" aria-label="Primary">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-gray-700 hover:text-gray-900 rounded-full px-3 py-1.5 text-sm font-medium transition-colors duration-200 ease-apple-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/30"
                >
                  {item.label}
                </Link>
              ))}
              <SignedIn>
                <Link
                  href="/account"
                  className="text-gray-700 hover:text-gray-900 rounded-full px-3 py-1.5 text-sm font-medium transition-colors duration-200 ease-apple-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/30"
                >
                  My Orders
                </Link>
              </SignedIn>
              <SignedOut>
                <Link
                  href="/contact"
                  className="text-gray-700 hover:text-gray-900 rounded-full px-3 py-1.5 text-sm font-medium transition-colors duration-200 ease-apple-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/30"
                >
                  Contact
                </Link>
              </SignedOut>
            </nav>
            <div className="flex items-center gap-3">
              <SignedIn>
                <div className="hidden sm:flex items-center gap-3">
                  <Link
                    href="/account"
                    className="text-gray-700 hover:text-gray-900 rounded-full px-3 py-1.5 text-sm font-medium transition-colors duration-200 ease-apple-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/30"
                  >
                    Account
                  </Link>
                  <UserButton 
                    appearance={{
                      elements: {
                        avatarBox: 'w-8 h-8',
                      },
                    }}
                  />
                </div>
              </SignedIn>
              <SignedOut>
                <div className="hidden sm:flex">
                  <BuyButton
                    size="sm"
                    variant="primary"
                    className={scrolled ? 'bg-gray-900 text-white hover:bg-gray-950 shadow-deep' : ''}
                  />
                </div>
              </SignedOut>
              <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                className="md:hidden h-10 w-10 rounded-full border border-black/10 bg-white/80 backdrop-blur-[20px] shadow-medium px-0 flex flex-col items-center justify-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/40 transition-all duration-200 ease-apple-standard hover:bg-white/90 hover:shadow-deep"
                aria-label="Toggle navigation menu"
                aria-expanded={menuOpen}
              >
                <span
                  className={`block h-[2px] w-5 bg-gray-900 transition-all duration-200 ease-apple-standard ${menuOpen ? 'translate-y-[7px] rotate-45' : ''}`}
                />
                <span className={`block h-[2px] w-5 bg-gray-900 transition-opacity duration-200 ease-apple-standard ${menuOpen ? 'opacity-0' : 'opacity-100'}`} />
                <span
                  className={`block h-[2px] w-5 bg-gray-900 transition-all duration-200 ease-apple-standard ${menuOpen ? '-translate-y-[7px] -rotate-45' : ''}`}
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
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
            onClick={() => setMenuOpen(false)}
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="absolute top-20 right-4 left-4 rounded-3xl bg-white shadow-deep p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <nav className="space-y-3" aria-label="Mobile navigation">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block rounded-2xl px-4 py-3 text-base font-semibold text-gray-900 hover:bg-gray-50 transition-colors duration-200 ease-apple-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/40"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <SignedIn>
                  <Link
                    href="/account"
                    className="block rounded-2xl px-4 py-3 text-base font-semibold text-gray-900 hover:bg-gray-50 transition-colors duration-200 ease-apple-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/40"
                    onClick={() => setMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                </SignedIn>
                <SignedOut>
                  <Link
                    href="/contact"
                    className="block rounded-2xl px-4 py-3 text-base font-semibold text-gray-900 hover:bg-gray-50 transition-colors duration-200 ease-apple-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/40"
                    onClick={() => setMenuOpen(false)}
                  >
                    Contact
                  </Link>
                </SignedOut>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
