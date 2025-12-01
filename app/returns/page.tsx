'use client'

import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { motion } from 'framer-motion'

export default function ReturnsPage() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-white page-content pb-24 px-4 sm:px-6 lg:px-8 safe-area-bottom">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-12 sm:mb-16"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 mb-6">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
                <path
                  d="M11 15H7V8h7v4"
                  stroke="#0f172a"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M11 24h11a5 5 0 0 0 0-10h-9"
                  stroke="#0f172a"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold mb-4 text-gray-900 tracking-[-0.022em]">
              30-Day Returns
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-[1.6]">
              Try Hello1984 at home. If it&apos;s not love, send it back for a full refund. No questions asked.
            </p>
          </motion.div>

          <div className="space-y-8 sm:space-y-10">
            {/* Return Policy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card rounded-3xl p-8 sm:p-10"
            >
              <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-gray-900">Our Return Policy</h2>
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed text-lg">
                  We want you to love Hello1984. If for any reason you&apos;re not completely satisfied, 
                  you can return it within <strong className="text-gray-900">30 days</strong> of delivery for a full refund.
                </p>
                <div className="grid sm:grid-cols-2 gap-4 pt-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">30-Day Window</h3>
                      <p className="text-sm text-gray-600">Returns accepted within 30 days of delivery date</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Full Refund</h3>
                      <p className="text-sm text-gray-600">100% refund including original shipping costs</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">No Questions Asked</h3>
                      <p className="text-sm text-gray-600">No need to explain why you&apos;re returning</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Easy Process</h3>
                      <p className="text-sm text-gray-600">Simple return form and prepaid label</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Return Requirements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card rounded-2xl p-6 sm:p-8"
            >
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">Return Requirements</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gray-900 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-700">Unit must be in original packaging with all included accessories</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gray-900 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-700">Unit should be in like-new condition (minor wear acceptable)</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gray-900 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-700">Return must be initiated within 30 days of delivery</span>
                </div>
              </div>
            </motion.div>

            {/* How to Return */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card rounded-2xl p-6 sm:p-8"
            >
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">How to Return</h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center font-semibold text-sm">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Request Return</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Log into your account and go to &quot;My Orders&quot;. Click &quot;Return&quot; on your Hello1984 order 
                      or email us at <a href="mailto:mikeshyu@proton.me" className="text-gray-900 underline">mikeshyu@proton.me</a> with your order number.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center font-semibold text-sm">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Receive Label</h3>
                    <p className="text-gray-600 leading-relaxed">
                      We&apos;ll email you a prepaid return shipping label within 1-2 business days. 
                      Print it and attach it to your package.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center font-semibold text-sm">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Ship It Back</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Pack Hello1984 in its original box with all accessories. Drop it off at any carrier location 
                      or schedule a pickup. Keep your tracking number.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center font-semibold text-sm">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Get Refunded</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Once we receive and inspect your return (usually 3-5 business days), we&apos;ll process your refund 
                      to the original payment method within 5-7 business days.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Refund Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card rounded-2xl p-6 sm:p-8"
            >
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">Refund Timeline</h2>
              <div className="space-y-3 text-gray-600">
                <p>
                  <strong className="text-gray-900">Day 1:</strong> You request return and receive prepaid label
                </p>
                <p>
                  <strong className="text-gray-900">Day 2-5:</strong> You ship return (transit time varies)
                </p>
                <p>
                  <strong className="text-gray-900">Day 6-10:</strong> We receive and inspect return
                </p>
                <p>
                  <strong className="text-gray-900">Day 11-17:</strong> Refund processed to your payment method
                </p>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Total time from return request to refund: typically 10-17 business days, depending on shipping speed.
              </p>
            </motion.div>

            {/* Non-Returnable Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card rounded-2xl p-6 sm:p-8 border-amber-100 bg-amber-50/30"
            >
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">Non-Returnable Items</h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                Custom or personalized items cannot be returned unless defective. 
                If your Hello1984 arrives damaged or defective, contact us immediately—we&apos;ll send a replacement right away.
              </p>
              <p className="text-sm text-gray-500">
                Items returned after 30 days may be subject to a restocking fee or refused.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

