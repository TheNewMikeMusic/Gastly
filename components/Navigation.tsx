'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { BuyButton } from '@/components/BuyButton'
import { UserButton, SignedIn, SignedOut } from '@clerk/nextjs'

const navItems = [
  { label: 'Features', href: '/#features' },
  { label: 'Manual', href: '/manual' },
  { label: 'Specs', href: '/#specs' },
  { label: 'FAQ', href: '/#faq' },
  { label: 'About', href: '/about' },
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
    const handleBodyScroll = () => {
      document.body.style.overflow = 'hidden'
    }
    window.addEventListener('keydown', handleKey)
    handleBodyScroll()
    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const shellClass = scrolled
    ? 'bg-white/90 md:bg-white/90 border border-black/10 text-gray-900 shadow-medium backdrop-blur-[20px]'
    : 'bg-white/75 md:bg-white/60 border border-black/10 text-gray-900 shadow-medium backdrop-blur-[20px]'

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }} 
        animate={{ y: 0 }} 
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 safe-area-top"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div
            className={`flex h-14 items-center justify-between rounded-full px-4 sm:px-5 md:px-6 transition-all duration-300 ease-apple-standard ${shellClass}`}
          >
            <Link
              href="/"
              className="text-apple-title-sm font-apple-semibold tracking-apple-tight text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/40 focus-visible:ring-offset-2 rounded-full touch-target"
              aria-label="Hello1984 home"
            >
              Hello1984
            </Link>
            <nav className="hidden md:flex items-center gap-4" aria-label="Primary">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-apple-caption font-apple-medium text-gray-700 hover:text-gray-900 rounded-full px-3 py-1.5 transition-colors duration-200 ease-apple-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/30 touch-target"
                >
                  {item.label}
                </Link>
              ))}
              <SignedOut>
                <Link
                  href="/contact"
                  className="text-apple-caption font-apple-medium text-gray-700 hover:text-gray-900 rounded-full px-3 py-1.5 transition-colors duration-200 ease-apple-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/30 touch-target"
                >
                  Contact
                </Link>
              </SignedOut>
            </nav>
            <div className="flex items-center gap-3">
              <SignedIn>
                <div className="hidden md:flex items-center gap-3">
                  <Link
                    href="/account"
                    className="text-apple-caption font-apple-medium text-gray-700 hover:text-gray-900 rounded-full px-3 py-1.5 transition-colors duration-200 ease-apple-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/30 touch-target"
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
                <div className="hidden md:flex items-center gap-3">
                  <Link
                    href="/sign-in"
                    className="text-apple-caption font-apple-medium text-gray-700 hover:text-gray-900 rounded-full px-4 py-2 transition-colors duration-200 ease-apple-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/30 touch-target"
                  >
                    Sign In
                  </Link>
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
                className="md:hidden h-11 w-11 rounded-full border border-black/10 bg-white/90 backdrop-blur-[20px] shadow-medium px-0 flex flex-col items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/40 focus-visible:ring-offset-2 transition-all duration-200 ease-apple-standard active:bg-white active:scale-95 touch-manipulation touch-target"
                aria-label="Toggle navigation menu"
                aria-expanded={menuOpen}
              >
                <span
                  className={`block h-[2.5px] w-5 bg-gray-900 rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] origin-center ${menuOpen ? 'translate-y-[8px] rotate-45' : ''}`}
                />
                <span className={`block h-[2.5px] w-5 bg-gray-900 rounded-full transition-all duration-200 ease-apple-standard ${menuOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`} />
                <span
                  className={`block h-[2.5px] w-5 bg-gray-900 rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] origin-center ${menuOpen ? '-translate-y-[8px] -rotate-45' : ''}`}
                />
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-md md:hidden"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ y: -20, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -20, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-[calc(4rem+env(safe-area-inset-top))] right-4 left-4 z-50 rounded-3xl bg-white/95 backdrop-blur-xl shadow-deep border border-gray-200/50 p-6 md:hidden safe-area-inset"
              style={{
                boxShadow: '0 20px 60px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <nav className="space-y-1" aria-label="Mobile navigation">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block rounded-xl px-4 py-3 text-apple-body-sm font-apple-medium text-gray-900 hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 ease-apple-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/20 focus-visible:ring-offset-2 touch-manipulation touch-target"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                
                {/* 分隔线 */}
                <div className="border-t border-gray-100 my-3" />
                
                <SignedIn>
                  <Link
                    href="/account"
                    className="block rounded-xl px-4 py-3 text-apple-body-sm font-apple-medium text-gray-900 hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 ease-apple-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/20 focus-visible:ring-offset-2 touch-manipulation touch-target"
                    onClick={() => setMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                  <div className="flex items-center justify-center px-4 py-3 rounded-xl bg-gray-50/50 mt-2">
                    <UserButton 
                      appearance={{
                        elements: {
                          avatarBox: 'w-9 h-9 ring-2 ring-gray-200',
                          userButtonPopoverCard: 'shadow-deep',
                        },
                      }}
                    />
                  </div>
                </SignedIn>
                <SignedOut>
                  <Link
                    href="/sign-in"
                    className="block rounded-xl px-4 py-3 text-apple-body-sm font-apple-medium text-gray-900 hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 ease-apple-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/20 focus-visible:ring-offset-2 touch-manipulation touch-target"
                    onClick={() => setMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/contact"
                    className="block rounded-xl px-4 py-3 text-apple-body-sm font-apple-medium text-gray-900 hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 ease-apple-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/20 focus-visible:ring-offset-2 touch-manipulation touch-target"
                    onClick={() => setMenuOpen(false)}
                  >
                    Contact
                  </Link>
                </SignedOut>
                
                {/* Buy Button for mobile */}
                <div className="pt-3 mt-2 border-t border-gray-100">
                  <BuyButton
                    size="md"
                    variant="primary"
                    className="w-full shadow-medium"
                    onClick={() => setMenuOpen(false)}
                  />
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
