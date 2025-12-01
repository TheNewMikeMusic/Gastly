import Link from 'next/link'
import { NewsletterSignup } from '@/components/NewsletterSignup'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-ghost-bg-section text-ghost-text-primary py-8 sm:py-10 lg:py-12 px-4 sm:px-6 lg:px-8 safe-area-bottom">
      <div className="max-w-7xl mx-auto">
        {/* Mobile-first layout: Stack on mobile, grid on larger screens */}
        <div className="space-y-8 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-8 lg:gap-12 mb-8 sm:mb-10 lg:mb-12">
          {/* Brand section - full width on mobile, spans 2 cols on tablet+ */}
          <div className="sm:col-span-2 lg:col-span-2">
            <h3 className="text-lg sm:text-xl font-display mb-3 text-ghost-text-primary">Gastly Humidifier 2.1</h3>
            <p className="text-ghost-text-secondary text-sm sm:text-base leading-relaxed mb-4 max-w-md">
              A desktop humidifier designed for night owls, gamers, and programmers. Transforming the familiar ghost figure into a practical desk companion that brings purple mist and unique atmosphere to your space.
            </p>
            <p className="text-ghost-text-muted text-xs uppercase tracking-[0.25em] mt-4">
              Gastly Lab
            </p>
          </div>

          {/* Quick Links - compact on mobile */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-ghost-text-primary">Quick Links</h3>
            <ul className="space-y-1.5">
              <li>
                <Link
                  href="/#features"
                  className="text-ghost-text-secondary active:text-ghost-text-primary hover:text-ghost-text-primary transition-colors duration-150 ease-apple-standard text-sm focus:outline-none focus:ring-2 focus:ring-ghost-purple-primary focus:ring-offset-2 rounded py-1.5 block touch-manipulation"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-ghost-text-secondary active:text-ghost-text-primary hover:text-ghost-text-primary transition-colors duration-150 ease-apple-standard text-sm focus:outline-none focus:ring-2 focus:ring-ghost-purple-primary focus:ring-offset-2 rounded py-1.5 block touch-manipulation"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/#specs"
                  className="text-ghost-text-secondary active:text-ghost-text-primary hover:text-ghost-text-primary transition-colors duration-150 ease-apple-standard text-sm focus:outline-none focus:ring-2 focus:ring-ghost-purple-primary focus:ring-offset-2 rounded py-1.5 block touch-manipulation"
                >
                  Specs
                </Link>
              </li>
              <li>
                <Link
                  href="/#faq"
                  className="text-ghost-text-secondary active:text-ghost-text-primary hover:text-ghost-text-primary transition-colors duration-150 ease-apple-standard text-sm focus:outline-none focus:ring-2 focus:ring-ghost-purple-primary focus:ring-offset-2 rounded py-1.5 block touch-manipulation"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-ghost-text-secondary active:text-ghost-text-primary hover:text-ghost-text-primary transition-colors duration-150 ease-apple-standard text-sm focus:outline-none focus:ring-2 focus:ring-ghost-purple-primary focus:ring-offset-2 rounded py-1.5 block touch-manipulation"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal - compact on mobile */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-ghost-text-primary">Legal</h3>
            <ul className="space-y-1.5 mb-4">
              <li>
                <Link
                  href="/terms"
                  className="text-ghost-text-secondary active:text-ghost-text-primary hover:text-ghost-text-primary transition-colors duration-150 ease-apple-standard text-sm focus:outline-none focus:ring-2 focus:ring-ghost-purple-primary focus:ring-offset-2 rounded py-1.5 block touch-manipulation"
                >
                  Terms
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-ghost-text-secondary active:text-ghost-text-primary hover:text-ghost-text-primary transition-colors duration-150 ease-apple-standard text-sm focus:outline-none focus:ring-2 focus:ring-ghost-purple-primary focus:ring-offset-2 rounded py-1.5 block touch-manipulation"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/login"
                  className="text-ghost-text-muted active:text-ghost-text-primary hover:text-ghost-text-primary transition-colors duration-150 ease-apple-standard text-xs focus:outline-none focus:ring-2 focus:ring-ghost-purple-primary focus:ring-offset-2 rounded py-1.5 block touch-manipulation"
                >
                  Admin
                </Link>
              </li>
            </ul>
            <p className="text-ghost-text-muted text-xs leading-relaxed mt-4 hidden sm:block">
              Gastly Humidifier 2.1 is independently designed and manufactured by Gastly Lab.
            </p>
          </div>
        </div>

        {/* Disclaimer for mobile */}
        <p className="text-ghost-text-muted text-xs leading-relaxed mb-6 sm:hidden text-center px-4">
          Gastly Humidifier 2.1 is independently designed and manufactured by Gastly Lab.
        </p>

        {/* Newsletter and copyright */}
        <div className="border-t border-ghost-purple-primary/20 pt-6 sm:pt-8">
          <div className="max-w-md mx-auto mb-5 sm:mb-6">
            <h3 className="text-sm font-semibold mb-2 text-ghost-text-primary text-center">Newsletter</h3>
            <p className="text-xs text-ghost-text-muted text-center mb-3 px-4">
              Subscribe to get updates on new products and exclusive offers.
            </p>
            <NewsletterSignup variant="inline" />
          </div>
          <p className="text-center text-xs text-ghost-text-muted px-4">© {currentYear} Gastly Lab. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
