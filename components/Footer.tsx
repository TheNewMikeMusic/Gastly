import Link from 'next/link'
import { NewsletterSignup } from '@/components/NewsletterSignup'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#f5f5f7] text-[#1d1d1f] py-8 sm:py-10 lg:py-12 px-4 sm:px-6 lg:px-8 safe-area-bottom">
      <div className="max-w-7xl mx-auto">
        {/* Mobile-first layout: Stack on mobile, grid on larger screens */}
        <div className="space-y-8 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-8 lg:gap-12 mb-8 sm:mb-10 lg:mb-12">
          {/* Brand section - full width on mobile, spans 2 cols on tablet+ */}
          <div className="sm:col-span-2 lg:col-span-2">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 text-[#1d1d1f]">Hello1984</h3>
            <p className="text-[#1d1d1f]/80 text-sm sm:text-base leading-relaxed mb-4 max-w-md">
              A limited-run desktop clock built by a small hardware studio in California. We obsess over tactility, not
              telemetry, and we finish every unit by hand before it leaves the lab.
            </p>
            <p className="text-[#86868b] text-xs uppercase tracking-[0.25em] mt-4">
              Studio 128 · San Francisco, CA
            </p>
          </div>

          {/* Quick Links - compact on mobile */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-[#1d1d1f]">Quick Links</h3>
            <ul className="space-y-1.5">
              <li>
                <Link
                  href="/#features"
                  className="text-[#1d1d1f]/70 active:text-[#1d1d1f] hover:text-[#1d1d1f] transition-colors duration-150 ease-apple-standard text-sm focus:outline-none focus:ring-2 focus:ring-[#007aff] focus:ring-offset-2 rounded py-1.5 block touch-manipulation"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/#about"
                  className="text-[#1d1d1f]/70 active:text-[#1d1d1f] hover:text-[#1d1d1f] transition-colors duration-150 ease-apple-standard text-sm focus:outline-none focus:ring-2 focus:ring-[#007aff] focus:ring-offset-2 rounded py-1.5 block touch-manipulation"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/#faq"
                  className="text-[#1d1d1f]/70 active:text-[#1d1d1f] hover:text-[#1d1d1f] transition-colors duration-150 ease-apple-standard text-sm focus:outline-none focus:ring-2 focus:ring-[#007aff] focus:ring-offset-2 rounded py-1.5 block touch-manipulation"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-[#1d1d1f]/70 active:text-[#1d1d1f] hover:text-[#1d1d1f] transition-colors duration-150 ease-apple-standard text-sm focus:outline-none focus:ring-2 focus:ring-[#007aff] focus:ring-offset-2 rounded py-1.5 block touch-manipulation"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal - compact on mobile */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-[#1d1d1f]">Legal</h3>
            <ul className="space-y-1.5 mb-4">
              <li>
                <Link
                  href="/terms"
                  className="text-[#1d1d1f]/70 active:text-[#1d1d1f] hover:text-[#1d1d1f] transition-colors duration-150 ease-apple-standard text-sm focus:outline-none focus:ring-2 focus:ring-[#007aff] focus:ring-offset-2 rounded py-1.5 block touch-manipulation"
                >
                  Terms
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-[#1d1d1f]/70 active:text-[#1d1d1f] hover:text-[#1d1d1f] transition-colors duration-150 ease-apple-standard text-sm focus:outline-none focus:ring-2 focus:ring-[#007aff] focus:ring-offset-2 rounded py-1.5 block touch-manipulation"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/login"
                  className="text-[#86868b] active:text-[#1d1d1f] hover:text-[#1d1d1f] transition-colors duration-150 ease-apple-standard text-xs focus:outline-none focus:ring-2 focus:ring-[#007aff] focus:ring-offset-2 rounded py-1.5 block touch-manipulation"
                >
                  Admin
                </Link>
              </li>
            </ul>
            <p className="text-[#86868b] text-xs leading-relaxed mt-4 hidden sm:block">
              Hello1984 is an independent homage inspired by the Macintosh. Apple Inc. is not affiliated or involved.
            </p>
          </div>
        </div>

        {/* Disclaimer for mobile */}
        <p className="text-[#86868b] text-xs leading-relaxed mb-6 sm:hidden text-center px-4">
          Hello1984 is an independent homage inspired by the Macintosh. Apple Inc. is not affiliated or involved.
        </p>

        {/* Newsletter and copyright */}
        <div className="border-t border-[#d2d2d7] pt-6 sm:pt-8">
          <div className="max-w-md mx-auto mb-5 sm:mb-6">
            <h3 className="text-sm font-semibold mb-2 text-[#1d1d1f] text-center">Newsletter</h3>
            <p className="text-xs text-[#86868b] text-center mb-3 px-4">
              Subscribe to get updates on new products and exclusive offers.
            </p>
            <NewsletterSignup variant="inline" />
          </div>
          <p className="text-center text-xs text-[#86868b] px-4">© {currentYear} Hello1984. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
