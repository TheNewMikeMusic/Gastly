'use client'

import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { motion } from 'framer-motion'

export default function WarrantyPage() {
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
                  d="M18 6 9 9v7c0 5.52 3.21 10.58 9 13 5.79-2.42 9-7.48 9-13V9l-9-3Z"
                  stroke="#0f172a"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                  fill="rgba(15,23,42,0.03)"
                />
                <path d="m13.5 18.5 2.5 2.5 5-5" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold mb-4 text-gray-900 tracking-[-0.022em]">
              12-Month Warranty
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-[1.6]">
              Hardware repairs and replacements handled by our in-house team. Built to last, backed by confidence.
            </p>
          </motion.div>

          <div className="space-y-8 sm:space-y-10">
            {/* Warranty Coverage */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card rounded-3xl p-8 sm:p-10"
            >
              <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-gray-900">What&apos;s Covered</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Manufacturing Defects</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Any defects in materials or workmanship that appear under normal use within 12 months of purchase.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Component Failure</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Failure of internal components (display, processor, RTC, etc.) under normal operating conditions.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Power Issues</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Problems with USB-C power delivery or charging circuitry.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Display Issues</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Dead pixels, backlight failure, or display malfunctions not caused by physical damage.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Not Covered */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card rounded-2xl p-6 sm:p-8 border-red-100 bg-red-50/30"
            >
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">What&apos;s Not Covered</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-gray-700">Physical damage from drops, impacts, or accidents</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-gray-700">Water damage or exposure to liquids</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-gray-700">Damage from misuse, modification, or unauthorized repairs</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-gray-700">Cosmetic wear from normal use (scratches, scuffs)</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-gray-700">Loss or theft</span>
                </div>
              </div>
            </motion.div>

            {/* How to Claim */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card rounded-2xl p-6 sm:p-8"
            >
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">How to Claim Warranty</h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center font-semibold text-sm">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Contact Support</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Email us at <a href="mailto:mikeshyu@proton.me" className="text-gray-900 underline">mikeshyu@proton.me</a> with your order number and a description of the issue.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center font-semibold text-sm">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Diagnosis</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Our team will review your case and may request photos or additional information to diagnose the issue.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center font-semibold text-sm">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Resolution</h3>
                    <p className="text-gray-600 leading-relaxed">
                      If covered, we&apos;ll send a prepaid return label. Once we receive your unit, we&apos;ll repair or replace it and ship it back within 5-7 business days.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Warranty Period */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card rounded-2xl p-6 sm:p-8"
            >
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">Warranty Period</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                The warranty period begins on the date of purchase and lasts for 12 months. 
                Warranty coverage is non-transferable and applies only to the original purchaser.
              </p>
              <p className="text-sm text-gray-500">
                Replacement units receive a new 12-month warranty period from the date of replacement.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

