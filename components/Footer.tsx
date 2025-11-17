import Link from 'next/link'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-foreground text-background py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 mb-10 sm:mb-12">
          <div className="sm:col-span-2 lg:col-span-2">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Maclock</h3>
            <p className="text-background/80 text-sm sm:text-base leading-relaxed mb-3 sm:mb-4 max-w-md">
              A limited-run desktop clock built by a small hardware studio in California. We obsess over tactility, not
              telemetry, and we finish every unit by hand before it leaves the lab.
            </p>
            <p className="text-background/60 text-xs uppercase tracking-[0.25em]">
              Studio 128 · San Francisco, CA
            </p>
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/#features"
                  className="text-background/70 hover:text-background transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-background focus:ring-offset-2 focus:ring-offset-foreground rounded"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/#faq"
                  className="text-background/70 hover:text-background transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-background focus:ring-offset-2 focus:ring-offset-foreground rounded"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-background/70 hover:text-background transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-background focus:ring-offset-2 focus:ring-offset-foreground rounded"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Legal</h3>
            <ul className="space-y-2.5 mb-4 sm:mb-0">
              <li>
                <Link
                  href="/terms"
                  className="text-background/70 hover:text-background transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-background focus:ring-offset-2 focus:ring-offset-foreground rounded"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-background/70 hover:text-background transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-background focus:ring-offset-2 focus:ring-offset-foreground rounded"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
            <p className="text-background/60 text-xs leading-relaxed mt-4 sm:mt-6">
              Maclock is an independent homage inspired by the Macintosh. Apple Inc. is not affiliated or involved.
            </p>
          </div>
        </div>
        <div className="border-t border-background/20 pt-6 sm:pt-8">
          <p className="text-center text-xs sm:text-sm text-background/60">© {currentYear} Maclock. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
