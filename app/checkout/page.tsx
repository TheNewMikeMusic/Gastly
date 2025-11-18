'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Navigation } from '@/components/Navigation'
import { useReducedMotion } from '@/lib/hooks'
import { useUser } from '@clerk/nextjs'

interface ShippingFormData {
  name: string
  phone: string
  email: string
  address: string
  city: string
  state: string
  zip: string
  country: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const { user, isLoaded } = useUser()
  const prefersReducedMotion = useReducedMotion()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<ShippingFormData>({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
  })

  useEffect(() => {
    const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
    const isClerkConfigured = publishableKey && publishableKey !== 'pk_test_dummy' && !publishableKey.includes('你的Clerk')
    
    if (isClerkConfigured) {
      if (isLoaded && !user) {
        router.push('/sign-in?redirect_url=/checkout')
        return
      }
      if (isLoaded && user) {
        setFormData((prev) => ({
          ...prev,
          name: user.fullName || prev.name,
          email: user.primaryEmailAddress?.emailAddress || prev.email,
        }))
      }
    }
  }, [user, isLoaded, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError(null)
  }

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('Please enter your full name')
      return false
    }
    if (!formData.phone.trim()) {
      setError('Please enter your phone number')
      return false
    }
    const phoneRegex = formData.country === 'CN' 
      ? /^1[3-9]\d{9}$/
      : /^[\d\s\+\-\(\)]+$/
    if (!phoneRegex.test(formData.phone.replace(/\s+/g, ''))) {
      setError('Please enter a valid phone number')
      return false
    }
    if (!formData.email.trim()) {
      setError('Please enter your email address')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address')
      return false
    }
    if (!formData.address.trim()) {
      setError('Please enter your street address')
      return false
    }
    if (!formData.city.trim()) {
      setError('Please enter your city')
      return false
    }
    if (!formData.state.trim()) {
      setError('Please enter your state or province')
      return false
    }
    if (!formData.zip.trim()) {
      setError('Please enter your postal code')
      return false
    }
    if (!formData.country) {
      setError('Please select your country')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('No checkout URL returned')
      }
    } catch (err) {
      console.error('Checkout error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Checkout failed. Please try again.'
      setError(errorMessage)
      setLoading(false)
      
      // Log detailed error for debugging
      if (err instanceof Error) {
        console.error('Error details:', {
          message: err.message,
          stack: err.stack,
        })
      }
    }
  }

  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  const isClerkConfigured = publishableKey && publishableKey !== 'pk_test_dummy' && !publishableKey.includes('你的Clerk')
  
  // Show loading state while checking authentication
  if (isClerkConfigured && !isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  // If Clerk is configured and user is not authenticated, show nothing (redirect will happen in useEffect)
  if (isClerkConfigured && isLoaded && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-gray-600">Redirecting to sign in...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="mb-12 text-center"
          >
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900">
              Checkout
            </h1>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Please provide your shipping information to complete your order.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Shipping Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass rounded-2xl p-4 border border-red-200 bg-red-50/50"
                  >
                    <p className="text-sm text-red-600 font-medium">{error}</p>
                  </motion.div>
                )}

                <div className="glass rounded-2xl p-6 sm:p-8 space-y-6">
                  <h2 className="text-2xl font-semibold mb-6 text-gray-900">
                    Shipping Information
                  </h2>

                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-900">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-black/10 bg-white/90 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900/30 transition-all duration-200 ease-apple-standard"
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium mb-2 text-gray-900">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-black/10 bg-white/90 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900/30 transition-all duration-200 ease-apple-standard"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-900">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-black/10 bg-white/90 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900/30 transition-all duration-200 ease-apple-standard"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="country" className="block text-sm font-medium mb-2 text-gray-900">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-black/10 bg-white/90 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900/30 transition-all duration-200 ease-apple-standard"
                    >
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="GB">United Kingdom</option>
                      <option value="AU">Australia</option>
                      <option value="DE">Germany</option>
                      <option value="FR">France</option>
                      <option value="JP">Japan</option>
                      <option value="CN">China</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium mb-2 text-gray-900">
                      Street Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-black/10 bg-white/90 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900/30 transition-all duration-200 ease-apple-standard resize-none"
                      placeholder="123 Main Street, Apt 4B"
                    />
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium mb-2 text-gray-900">
                        State / Province <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-black/10 bg-white/90 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900/30 transition-all duration-200 ease-apple-standard"
                        placeholder="CA"
                      />
                    </div>

                    <div>
                      <label htmlFor="city" className="block text-sm font-medium mb-2 text-gray-900">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-black/10 bg-white/90 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900/30 transition-all duration-200 ease-apple-standard"
                        placeholder="San Francisco"
                      />
                    </div>

                    <div>
                      <label htmlFor="zip" className="block text-sm font-medium mb-2 text-gray-900">
                        Postal Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="zip"
                        name="zip"
                        value={formData.zip}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-black/10 bg-white/90 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900/30 transition-all duration-200 ease-apple-standard"
                        placeholder="94102"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex-1 px-6 py-3 rounded-full border border-black/10 bg-white/90 text-gray-900 font-semibold hover:bg-white transition-all duration-200 ease-apple-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/40 focus-visible:ring-offset-2"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-3 rounded-full bg-gray-900 text-white font-semibold hover:bg-gray-950 shadow-deep transition-all duration-200 ease-apple-standard disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/60 focus-visible:ring-offset-2"
                  >
                    {loading ? 'Processing...' : 'Continue to Payment'}
                  </button>
                </div>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="glass rounded-2xl p-6 sm:p-8 sticky top-24">
                <h2 className="text-xl font-semibold mb-6 text-gray-900">
                  Order Summary
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Product</span>
                    <span className="font-medium text-gray-900">Hello1984</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Quantity</span>
                    <span className="font-medium text-gray-900">1</span>
                  </div>
                  <div className="border-t border-black/10 pt-4 mt-4">
                    <div className="flex justify-between items-baseline mb-2">
                      <span className="text-lg font-semibold text-gray-900">Total</span>
                      <span className="text-lg font-semibold text-gray-900">—</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Payment will be completed on the next step
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
