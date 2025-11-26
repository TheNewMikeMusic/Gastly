'use client'

import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { motion } from 'framer-motion'

export default function PricingPage() {
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
                  d="M12 9h8a3 3 0 0 1 3 3v8.8a3 3 0 0 1-.88 2.12l-6.33 6.33a1.5 1.5 0 0 1-2.12 0l-6.8-6.8a1.5 1.5 0 0 1 0-2.12L14 9Z"
                  stroke="#0f172a"
                  strokeWidth="1.5"
                  fill="rgba(15,23,42,0.04)"
                />
                <circle cx="20.5" cy="13.5" r="1.5" fill="#0f172a" />
              </svg>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold mb-4 text-gray-900 tracking-[-0.022em]">
              Simple, Transparent Pricing
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-[1.6]">
              One price. No hidden fees. No subscriptions. Just a beautiful clock that works.
            </p>
          </motion.div>

          <div className="space-y-8 sm:space-y-10">
            {/* Main Price Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card rounded-3xl p-8 sm:p-10 lg:p-12 text-center"
            >
              <div className="mb-6">
                <div className="flex items-baseline justify-center gap-3 mb-2">
                  <div className="text-5xl sm:text-6xl font-bold text-gray-900">$99</div>
                  <div className="text-2xl sm:text-3xl text-gray-400 line-through font-medium">$199</div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <span className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold">
                    First 100 Units Special
                  </span>
                  <p className="text-gray-600 text-lg">One-time payment</p>
                </div>
              </div>
              <div className="space-y-4 text-left max-w-md mx-auto">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Includes Hello1984 unit</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">2m braided USB-C cable</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Microfiber cleaning cloth</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Quick-start guide</span>
                </div>
              </div>
            </motion.div>

            {/* What's Not Included */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card rounded-2xl p-6 sm:p-8"
            >
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">What&apos;s Not Included</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We don&apos;t include a USB-C power adapter because you likely already have one you trust. 
                Hello1984 works with any standard USB-C power source—from your laptop, phone charger, or wall adapter.
              </p>
              <p className="text-sm text-gray-500">
                Power consumption: Less than 2W. Compatible with any 5V USB-C power source.
              </p>
            </motion.div>

            {/* Taxes & Fees */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card rounded-2xl p-6 sm:p-8"
            >
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">Taxes & Fees</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Sales Tax</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Sales tax is calculated automatically at checkout based on your shipping address. 
                    Rates vary by location and are displayed before you complete your purchase.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Shipping</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Shipping costs are calculated at checkout based on your location and selected shipping method. 
                    We offer tracked, carbon-neutral shipping to 40+ countries worldwide.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">No Hidden Fees</h3>
                  <p className="text-gray-600 leading-relaxed">
                    What you see is what you pay. No subscription fees, no recurring charges, no surprise costs. 
                    Once you own Hello1984, it&apos;s yours forever.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Payment Methods */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card rounded-2xl p-6 sm:p-8"
            >
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">Payment Methods</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We accept all major credit and debit cards, Apple Pay, Google Pay, and other secure payment methods 
                through our payment processor, Stripe. All payments are encrypted and secure.
              </p>
              <p className="text-sm text-gray-500">
                Your payment information is never stored on our servers. Stripe handles all payment processing 
                in compliance with PCI DSS Level 1 standards.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

