import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'

export default function ContactPage() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen page-content px-4 sm:px-6 lg:px-8 pb-24 bg-white safe-area-bottom">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900">Contact Us</h1>
          <p className="text-lg text-gray-700 mb-12 leading-relaxed">
            Have a question? We&apos;re here to help. Reach out and we&apos;ll get back to you as soon as possible.
          </p>
          
          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6 lg:p-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="m22 6-10 7L2 6"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-2 text-gray-900">Email</h2>
                  <a
                    href="mailto:support@hello1984.com"
                    className="text-gray-700 hover:text-gray-900 transition-colors text-lg"
                  >
                    support@hello1984.com
                  </a>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 lg:p-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                    <path
                      d="M12 6v6l4 2"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-2 text-gray-900">Response Time</h2>
                  <p className="text-gray-700 leading-relaxed">
                    We typically respond within 24-48 hours during business days.
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 lg:p-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M3 10h18" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M8 4v6" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M16 4v6" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-2 text-gray-900">Support Hours</h2>
                  <p className="text-gray-700 leading-relaxed">
                    Monday - Friday, 9 AM - 5 PM PST
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

