import Link from 'next/link'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#f5f5f7] text-[#1d1d1f] py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 mb-10 sm:mb-12">
          <div className="sm:col-span-2 lg:col-span-2">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-[#1d1d1f]">Maclock</h3>
            <p className="text-[#1d1d1f]/80 text-sm sm:text-base leading-relaxed mb-3 sm:mb-4 max-w-md">
              A limited-run desktop clock built by a small hardware studio in California. We obsess over tactility, not
              telemetry, and we finish every unit by hand before it leaves the lab.
            </p>
            <p className="text-[#86868b] text-xs uppercase tracking-[0.25em] mt-4">
              Studio 128 · San Francisco, CA
            </p>
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-[#1d1d1f]">Quick Links</h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/#features"
                  className="text-[#1d1d1f]/70 hover:text-[#1d1d1f] transition-colors duration-200 ease-apple-standard text-sm focus:outline-none focus:ring-2 focus:ring-[#007aff] focus:ring-offset-2 rounded"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/#faq"
                  className="text-[#1d1d1f]/70 hover:text-[#1d1d1f] transition-colors duration-200 ease-apple-standard text-sm focus:outline-none focus:ring-2 focus:ring-[#007aff] focus:ring-offset-2 rounded"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-[#1d1d1f]/70 hover:text-[#1d1d1f] transition-colors duration-200 ease-apple-standard text-sm focus:outline-none focus:ring-2 focus:ring-[#007aff] focus:ring-offset-2 rounded"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-[#1d1d1f]">Legal</h3>
            <ul className="space-y-2.5 mb-4 sm:mb-0">
              <li>
                <Link
                  href="/terms"
                  className="text-[#1d1d1f]/70 hover:text-[#1d1d1f] transition-colors duration-200 ease-apple-standard text-sm focus:outline-none focus:ring-2 focus:ring-[#007aff] focus:ring-offset-2 rounded"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-[#1d1d1f]/70 hover:text-[#1d1d1f] transition-colors duration-200 ease-apple-standard text-sm focus:outline-none focus:ring-2 focus:ring-[#007aff] focus:ring-offset-2 rounded"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
            <p className="text-[#86868b] text-xs leading-relaxed mt-4 sm:mt-6">
              Maclock is an independent homage inspired by the Macintosh. Apple Inc. is not affiliated or involved.
            </p>
          </div>
        </div>
        <div className="border-t border-[#d2d2d7] pt-6 sm:pt-8">
          <p className="text-center text-xs sm:text-sm text-[#86868b]">© {currentYear} Maclock. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
