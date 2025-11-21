'use client'

import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { motion } from 'framer-motion'

export default function ShippingPage() {
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
                  d="M5 12h14v12H5zM19 15h6l3 4v5h-9"
                  stroke="#0f172a"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                  fill="none"
                />
                <circle cx="11" cy="24" r="2" fill="none" stroke="#0f172a" strokeWidth="1.5" />
                <circle cx="24" cy="24" r="2" fill="none" stroke="#0f172a" strokeWidth="1.5" />
              </svg>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold mb-4 text-gray-900 tracking-[-0.022em]">
              Global Delivery
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-[1.6]">
              Tracked shipping to 40+ countries with carbon-neutral carriers. Fast, secure, and sustainable.
            </p>
          </motion.div>

          <div className="space-y-8 sm:space-y-10">
            {/* Shipping Times */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card rounded-3xl p-8 sm:p-10"
            >
              <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-gray-900">Shipping Times</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">North America</h3>
                  <p className="text-gray-600 leading-relaxed">
                    <strong className="text-gray-900">3-5 business days</strong> after processing. 
                    Orders typically ship within 7-10 business days of purchase.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Europe</h3>
                  <p className="text-gray-600 leading-relaxed">
                    <strong className="text-gray-900">8-12 business days</strong> after processing. 
                    Includes customs clearance time.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Asia Pacific</h3>
                  <p className="text-gray-600 leading-relaxed">
                    <strong className="text-gray-900">10-15 business days</strong> after processing. 
                    Varies by country and customs.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Other Regions</h3>
                  <p className="text-gray-600 leading-relaxed">
                    <strong className="text-gray-900">12-20 business days</strong> after processing. 
                    Contact us for specific country estimates.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Processing Time */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card rounded-2xl p-6 sm:p-8"
            >
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">Processing & Fulfillment</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Each Hello1984 unit is hand-finished and tested in our California studio before shipping. 
                This careful process ensures quality but means orders typically take 7-10 business days to process.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-gray-900 font-semibold">Day 1-2:</span>
                  <span className="text-gray-600">Order received and payment verified</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-gray-900 font-semibold">Day 3-7:</span>
                  <span className="text-gray-600">Unit assembled, tested, and hand-finished</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-gray-900 font-semibold">Day 8-10:</span>
                  <span className="text-gray-600">Packaged and shipped with tracking number</span>
                </div>
              </div>
            </motion.div>

            {/* Tracking */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card rounded-2xl p-6 sm:p-8"
            >
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">Tracking Your Order</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Once your order ships, you&apos;ll receive an email with a tracking number and carrier information. 
                You can track your package in real-time from our shipping partners&apos; websites.
              </p>
              <p className="text-sm text-gray-500">
                Tracking information is also available in your account dashboard under &quot;My Orders&quot;.
              </p>
            </motion.div>

            {/* Carbon Neutral */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-green-50 to-emerald-50 border-green-100"
            >
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">Carbon-Neutral Shipping</h2>
              <p className="text-gray-600 leading-relaxed">
                We partner with carriers that offset 100% of shipping emissions through verified carbon credits. 
                Every Hello1984 shipment is carbon-neutral, so you can enjoy your clock knowing it arrived sustainably.
              </p>
            </motion.div>

            {/* Shipping Costs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card rounded-2xl p-6 sm:p-8"
            >
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">Shipping Costs</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Shipping costs vary by destination and are calculated at checkout. We work with multiple carriers 
                to offer the best rates while ensuring fast, secure delivery.
              </p>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• United States: $15-25</p>
                <p>• Canada: $20-30</p>
                <p>• Europe: $25-35</p>
                <p>• Asia Pacific: $30-45</p>
                <p>• Other regions: Calculated at checkout</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

