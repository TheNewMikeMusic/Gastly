'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { BuyButton } from '@/components/BuyButton'
import { UserButton, SignedIn, SignedOut } from '@clerk/nextjs'
import { isClerkConfigured } from '@/lib/config'

// Conditional wrapper components for Clerk
function ConditionalSignedOut({ children }: { children: React.ReactNode }) {
  if (!isClerkConfigured()) {
    return <>{children}</>
  }
  return <SignedOut>{children}</SignedOut>
}

function ConditionalSignedIn({ children }: { children: React.ReactNode }) {
  if (!isClerkConfigured()) {
    return null
  }
  return <SignedIn>{children}</SignedIn>
}

const navItems = [
  { label: 'Features', href: '/#features' },
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
    ? 'bg-ghost-bg-card/90 md:bg-ghost-bg-card/90 border border-ghost-purple-primary/30 text-ghost-text-primary shadow-glass-dark backdrop-blur-[20px]'
    : 'bg-ghost-bg-card/75 md:bg-ghost-bg-card/60 border border-ghost-purple-primary/20 text-ghost-text-primary shadow-glass-dark backdrop-blur-[20px]'

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
              className="text-apple-title-sm font-display tracking-apple-tight text-ghost-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ghost-purple-primary/40 focus-visible:ring-offset-2 rounded-full touch-target"
              aria-label="Gastly Humidifier 2.1 home"
            >
              Gastly
            </Link>
            <nav className="hidden md:flex items-center gap-4" aria-label="Primary">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-apple-caption font-apple-medium text-ghost-text-secondary hover:text-ghost-text-primary rounded-full px-3 py-1.5 transition-colors duration-200 ease-apple-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ghost-purple-primary/30 touch-target"
                >
                  {item.label}
                </Link>
              ))}
              <ConditionalSignedOut>
                <Link
                  href="/contact"
                  className="text-apple-caption font-apple-medium text-ghost-text-secondary hover:text-ghost-text-primary rounded-full px-3 py-1.5 transition-colors duration-200 ease-apple-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ghost-purple-primary/30 touch-target"
                >
                  Contact
                </Link>
              </ConditionalSignedOut>
            </nav>
            <div className="flex items-center gap-3">
              <ConditionalSignedIn>
                <div className="hidden md:flex items-center gap-3">
                  <Link
                    href="/account"
                    className="text-apple-caption font-apple-medium text-ghost-text-secondary hover:text-ghost-text-primary rounded-full px-3 py-1.5 transition-colors duration-200 ease-apple-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ghost-purple-primary/30 touch-target"
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
              </ConditionalSignedIn>
              <ConditionalSignedOut>
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
                    className={scrolled ? 'bg-ghost-purple-primary text-white hover:bg-ghost-purple-accent shadow-glass-dark' : 'bg-ghost-purple-primary text-white hover:bg-ghost-purple-accent'}
                  />
                </div>
              </ConditionalSignedOut>
              <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                className="md:hidden h-11 w-11 rounded-full border border-ghost-purple-primary/30 bg-ghost-bg-card/90 backdrop-blur-[20px] shadow-glass-dark px-0 flex flex-col items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ghost-purple-primary/40 focus-visible:ring-offset-2 transition-all duration-200 ease-apple-standard active:bg-ghost-bg-card active:scale-95 touch-manipulation touch-target"
                aria-label="Toggle navigation menu"
                aria-expanded={menuOpen}
              >
                <span
                  className={`block h-[2.5px] w-5 bg-ghost-text-primary rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] origin-center ${menuOpen ? 'translate-y-[8px] rotate-45' : ''}`}
                />
                <span className={`block h-[2.5px] w-5 bg-ghost-text-primary rounded-full transition-all duration-200 ease-apple-standard ${menuOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`} />
                <span
                  className={`block h-[2.5px] w-5 bg-ghost-text-primary rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] origin-center ${menuOpen ? '-translate-y-[8px] -rotate-45' : ''}`}
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
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-[calc(4rem+env(safe-area-inset-top))] left-4 right-4 z-50 bg-ghost-bg-card rounded-3xl shadow-glass-dark md:hidden safe-area-inset overflow-hidden border border-ghost-purple-primary/30"
              style={{
                maxHeight: 'calc(100vh - 4rem - env(safe-area-inset-top) - 2rem)',
                boxShadow: '0 20px 60px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(124, 58, 237, 0.2)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <nav className="px-4 py-2 overflow-y-auto" aria-label="Mobile navigation" style={{ maxHeight: 'inherit' }}>
                {/* Main navigation items */}
                <div className="space-y-0.5">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ 
                        duration: 0.2, 
                        delay: index * 0.03,
                        ease: [0.16, 1, 0.3, 1] 
                      }}
                    >
                      <Link
                        href={item.href}
                        className="block px-4 py-3.5 text-apple-body font-apple-normal text-ghost-text-primary hover:bg-ghost-purple-primary/10 active:bg-ghost-purple-primary/20 transition-colors duration-150 ease-apple-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ghost-purple-primary/20 focus-visible:ring-inset touch-manipulation touch-target rounded-lg"
                        onClick={() => setMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>
                
                {/* Divider */}
                <div className="h-px bg-ghost-purple-primary/20 my-2 mx-4" />
                
                {/* User related */}
                <div className="space-y-0.5">
                  <ConditionalSignedIn>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ 
                        duration: 0.2, 
                        delay: navItems.length * 0.03 + 0.05,
                        ease: [0.16, 1, 0.3, 1] 
                      }}
                    >
                      <Link
                        href="/account"
                        className="block px-4 py-3.5 text-apple-body font-apple-normal text-ghost-text-primary hover:bg-ghost-purple-primary/10 active:bg-ghost-purple-primary/20 transition-colors duration-150 ease-apple-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ghost-purple-primary/20 focus-visible:ring-inset touch-manipulation touch-target rounded-lg"
                        onClick={() => setMenuOpen(false)}
                      >
                        My Orders
                      </Link>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ 
                        duration: 0.2, 
                        delay: navItems.length * 0.03 + 0.08,
                        ease: [0.16, 1, 0.3, 1] 
                      }}
                      className="px-4 py-3.5"
                    >
                      <div className="flex items-center justify-start">
                        <UserButton 
                          appearance={{
                            elements: {
                              avatarBox: 'w-8 h-8',
                            },
                          }}
                        />
                      </div>
                    </motion.div>
                  </ConditionalSignedIn>
                  <ConditionalSignedOut>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ 
                        duration: 0.2, 
                        delay: navItems.length * 0.03 + 0.05,
                        ease: [0.16, 1, 0.3, 1] 
                      }}
                    >
                      <Link
                        href="/sign-in"
                        className="block px-4 py-3.5 text-apple-body font-apple-normal text-ghost-text-primary hover:bg-ghost-purple-primary/10 active:bg-ghost-purple-primary/20 transition-colors duration-150 ease-apple-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ghost-purple-primary/20 focus-visible:ring-inset touch-manipulation touch-target rounded-lg"
                        onClick={() => setMenuOpen(false)}
                      >
                        Sign In
                      </Link>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ 
                        duration: 0.2, 
                        delay: navItems.length * 0.03 + 0.08,
                        ease: [0.16, 1, 0.3, 1] 
                      }}
                    >
                      <Link
                        href="/contact"
                        className="block px-4 py-3.5 text-apple-body font-apple-normal text-ghost-text-primary hover:bg-ghost-purple-primary/10 active:bg-ghost-purple-primary/20 transition-colors duration-150 ease-apple-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ghost-purple-primary/20 focus-visible:ring-inset touch-manipulation touch-target rounded-lg"
                        onClick={() => setMenuOpen(false)}
                      >
                        Contact
                      </Link>
                    </motion.div>
                  </ConditionalSignedOut>
                </div>
                
                {/* Buy Button */}
                <div className="px-4 py-4 pb-6">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.25, 
                      delay: navItems.length * 0.03 + 0.1,
                      ease: [0.16, 1, 0.3, 1] 
                    }}
                  >
                    <BuyButton
                      size="md"
                      variant="primary"
                      className="w-full"
                      onClick={() => setMenuOpen(false)}
                    />
                  </motion.div>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
