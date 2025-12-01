'use client'

import { useState, useEffect, useCallback } from 'react'
import { FormError } from '@/components/FormError'
import * as validation from '@/lib/validation'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Navigation } from '@/components/Navigation'
import { useReducedMotion } from '@/lib/hooks'
import { useUser, useAuth } from '@clerk/nextjs'
import { SavedAddresses } from '@/components/SavedAddresses'
import { CouponInput } from '@/components/CouponInput'
import { StockStatus } from '@/components/StockStatus'
import { isClerkConfigured } from '@/lib/config'

// Safe hooks wrapper for Clerk - always call hooks, but return safe defaults if Clerk not configured
function useSafeUser() {
  // Always call the hook (required by React rules)
  const clerkUser = useUser()
  // Return safe defaults if Clerk not configured
  if (!isClerkConfigured()) {
    return { user: null, isLoaded: true }
  }
  return clerkUser
}

function useSafeAuth() {
  // Always call the hook (required by React rules)
  const clerkAuth = useAuth()
  // Return safe defaults if Clerk not configured
  if (!isClerkConfigured()) {
    return { isSignedIn: false }
  }
  return clerkAuth
}

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

interface Address {
  id: string
  label?: string
  name: string
  phone: string
  email?: string
  address: string
  city: string
  state?: string
  zip: string
  country: string
  isDefault: boolean
}

export default function CheckoutPage() {
  const router = useRouter()
  const { user, isLoaded } = useSafeUser()
  const { isSignedIn } = useSafeAuth()
  const isClerkConfiguredValue = isClerkConfigured()
  const prefersReducedMotion = useReducedMotion()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([])
  const [useSavedAddress, setUseSavedAddress] = useState(false)
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [couponCode, setCouponCode] = useState<string | null>(null)
  const [discountAmount, setDiscountAmount] = useState(0)
  const originalPrice = 10800 // Original price $108 in cents
  const currentPrice = 7800 // Current price $78 in cents
  const [productPrice, setProductPrice] = useState(currentPrice) // Use current price
  const [stock, setStock] = useState<number | null>(null)
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

  const handleSelectAddress = useCallback((address: Address) => {
    setFormData({
      name: address.name,
      phone: address.phone,
      email: address.email || '',
      address: address.address,
      city: address.city,
      state: address.state || '',
      zip: address.zip,
      country: address.country,
    })
    setSelectedAddressId(address.id)
    setUseSavedAddress(true)
  }, [])

  const loadSavedAddresses = useCallback(async () => {
    try {
      const response = await fetch('/api/addresses')
      const data = await response.json()
      setSavedAddresses(data.addresses || [])
      
      // Auto-select default address if available
      const defaultAddress = data.addresses?.find((a: Address) => a.isDefault)
      if (defaultAddress) {
        handleSelectAddress(defaultAddress)
      }
    } catch (error) {
      console.error('Failed to load addresses:', error)
    }
  }, [handleSelectAddress])

  const checkStock = useCallback(async () => {
    try {
      const response = await fetch('/api/inventory/check?productId=maclock-default&quantity=1')
      const data = await response.json()
      setStock(data.stock)
    } catch (error) {
      console.error('Failed to check stock:', error)
    }
  }, [])

  useEffect(() => {
    if (isClerkConfiguredValue) {
      // Wait for Clerk to fully load
      if (!isLoaded) {
        return
      }
      
      // If loaded but user not signed in, redirect to sign in page
      if (!user && !isSignedIn) {
        // Use setTimeout to avoid errors during redirect
        const timer = setTimeout(() => {
          router.push('/sign-in?redirect_url=/checkout')
        }, 100)
        return () => clearTimeout(timer)
      }
      
      // If user is signed in, populate form data
      if (user && isSignedIn) {
        try {
          setFormData((prev) => ({
            ...prev,
            name: user.fullName || prev.name,
            email: user.primaryEmailAddress?.emailAddress || prev.email,
          }))
        } catch (error) {
          console.error('Error setting user data:', error)
        }
      }
    }

    // Load saved addresses (only when signed in)
    if (isSignedIn && isLoaded) {
      try {
        loadSavedAddresses()
      } catch (error) {
        console.error('Error loading addresses:', error)
      }
    }

    // Check stock
    try {
      checkStock()
    } catch (error) {
      console.error('Error checking stock:', error)
    }
  }, [user, isLoaded, isSignedIn, router, loadSavedAddresses, checkStock, isClerkConfiguredValue])

  const handleCouponApply = (code: string, discount: number) => {
    setCouponCode(code)
    setDiscountAmount(discount)
  }

  const handleCouponRemove = () => {
    setCouponCode(null)
    setDiscountAmount(0)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError(null)
    if (useSavedAddress) {
      setUseSavedAddress(false)
      setSelectedAddressId(null)
    }
  }

  const validateField = (fieldName: string, value: string) => {
    const errors: Record<string, string> = {}
    
    switch (fieldName) {
      case 'name':
        const nameResult = validation.validateName(value)
        if (!nameResult.valid) {
          errors.name = nameResult.error || ''
        }
        break
      case 'phone':
        const phoneResult = validation.validatePhone(value, formData.country)
        if (!phoneResult.valid) {
          errors.phone = phoneResult.error || ''
        }
        break
      case 'email':
        const emailResult = validation.validateEmail(value)
        if (!emailResult.valid) {
          errors.email = emailResult.error || ''
        }
        break
      case 'address':
        const addressResult = validation.validateAddress(value)
        if (!addressResult.valid) {
          errors.address = addressResult.error || ''
        }
        break
      case 'city':
        const cityResult = validation.validateCity(value)
        if (!cityResult.valid) {
          errors.city = cityResult.error || ''
        }
        break
      case 'state':
        const stateResult = validation.validateState(value)
        if (!stateResult.valid) {
          errors.state = stateResult.error || ''
        }
        break
      case 'zip':
        const zipResult = validation.validateZip(value, formData.country)
        if (!zipResult.valid) {
          errors.zip = zipResult.error || ''
        }
        break
    }
    
    setFieldErrors((prev) => ({ ...prev, ...errors }))
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

    // Check stock
    if (stock !== null && stock <= 0) {
      setError('Product is out of stock')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate all fields
    if (!validateForm()) {
      setError('Please fix the errors in the form')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // If coupon exists, validate and apply to order
      // Note: In production, coupons should be handled in Stripe Checkout
      // Here we just pass the coupon code to the backend
      const checkoutData = {
        ...formData,
        couponCode: couponCode || undefined,
      }

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(checkoutData),
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
    }
  }

  // Show loading state while checking authentication
  // Give Clerk more time to load when redirecting after mobile login
  if (isClerkConfiguredValue && !isLoaded) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center bg-ghost-bg-page pt-24">
          <div className="text-center space-y-4">
            <div className="text-ghost-text-secondary">Loading...</div>
            <div className="w-8 h-8 border-4 border-ghost-purple-primary/30 border-t-ghost-purple-primary rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      </>
    )
  }

  // If Clerk is configured and user is not authenticated, show loading (redirect will happen in useEffect)
  // Use isSignedIn instead of user, because user may not be fully loaded yet
  if (isClerkConfiguredValue && isLoaded && !isSignedIn) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center bg-ghost-bg-page pt-24">
          <div className="text-center space-y-4">
            <div className="text-ghost-text-secondary">Redirecting to sign in page...</div>
            <div className="w-8 h-8 border-4 border-ghost-purple-primary/30 border-t-ghost-purple-primary rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      </>
    )
  }

  const finalPrice = currentPrice - discountAmount
  const finalPriceDisplay = (finalPrice / 100).toFixed(2)

  return (
    <div className="min-h-screen bg-ghost-bg-page">
      <Navigation />
      <div className="page-content pb-20 px-4 sm:px-4 md:px-6 lg:px-8 safe-area-bottom">
        <div className="max-w-6xl mx-auto w-full">
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="mb-12 text-center"
          >
            <h1 className="text-4xl sm:text-5xl font-display font-bold mb-4 text-ghost-text-primary">
              Checkout
            </h1>
            <p className="text-lg font-body text-ghost-text-secondary max-w-2xl mx-auto">
              Please provide your shipping information to complete your order.
            </p>
          </motion.div>

          {/* Stock Status */}
          {stock !== null && (
            <div className="mb-6">
              <StockStatus productId="maclock-default" />
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-12 w-full">
            {/* Shipping Form */}
            <div className="lg:col-span-2 w-full order-2 lg:order-1">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 w-full">
                {error && <FormError error={error} />}

                {/* Saved Address Selection */}
                {isSignedIn && savedAddresses.length > 0 && (
                  <div className="bg-ghost-bg-card border border-ghost-purple-primary/20 rounded-2xl p-4 sm:p-6 lg:p-8 w-full">
                    <h3 className="text-lg font-semibold mb-4 text-ghost-text-primary">
                      Use Saved Address
                    </h3>
                    <SavedAddresses
                      onSelect={handleSelectAddress}
                      showAddButton={false}
                    />
                    <div className="mt-4 pt-4 border-t border-ghost-purple-primary/20">
                      <button
                        type="button"
                        onClick={() => {
                          setUseSavedAddress(false)
                          setSelectedAddressId(null)
                        }}
                        className="text-sm text-ghost-text-secondary hover:text-ghost-text-primary"
                      >
                        Or enter a new address →
                      </button>
                    </div>
                  </div>
                )}

                {(!useSavedAddress || savedAddresses.length === 0) && (
                  <div className="bg-ghost-bg-card border border-ghost-purple-primary/20 rounded-2xl p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
                    <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-ghost-text-primary">
                      Shipping Information
                    </h2>

                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold mb-2.5 text-ghost-text-primary">
                        Full Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        onBlur={() => validateField('name', formData.name)}
                        required
                        autoComplete="name"
                        className={`w-full px-4 py-3.5 sm:py-3 rounded-xl border bg-ghost-bg-section text-ghost-text-primary placeholder-ghost-text-muted text-base focus:outline-none focus:ring-2 transition-all duration-200 ease-apple-standard min-h-[48px] touch-manipulation ${
                          fieldErrors.name
                            ? 'border-red-400 focus:ring-red-500/30 focus:border-red-500'
                            : 'border-ghost-purple-primary/30 focus:ring-ghost-purple-primary/30 focus:border-ghost-purple-primary/50'
                        }`}
                        placeholder="John Doe"
                      />
                      {fieldErrors.name && (
                        <p className="mt-1.5 text-sm text-red-400 font-medium">{fieldErrors.name}</p>
                      )}
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-semibold mb-2.5 text-ghost-text-primary">
                          Phone Number <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          onBlur={() => validateField('phone', formData.phone)}
                          required
                          autoComplete="tel"
                          inputMode="tel"
                          className={`w-full px-4 py-3.5 sm:py-3 rounded-xl border bg-ghost-bg-section text-ghost-text-primary placeholder-ghost-text-muted text-base focus:outline-none focus:ring-2 transition-all duration-200 ease-apple-standard min-h-[48px] touch-manipulation ${
                            fieldErrors.phone
                              ? 'border-red-400 focus:ring-red-500/30 focus:border-red-500'
                              : 'border-ghost-purple-primary/30 focus:ring-ghost-purple-primary/30 focus:border-ghost-purple-primary/50'
                          }`}
                          placeholder="+1 (555) 123-4567"
                        />
                        {fieldErrors.phone && (
                          <p className="mt-1.5 text-sm text-red-400 font-medium">{fieldErrors.phone}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-semibold mb-2.5 text-ghost-text-primary">
                          Email Address <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          onBlur={() => validateField('email', formData.email)}
                          required
                          autoComplete="email"
                          inputMode="email"
                          className={`w-full px-4 py-3.5 sm:py-3 rounded-xl border bg-ghost-bg-section text-ghost-text-primary placeholder-ghost-text-muted text-base focus:outline-none focus:ring-2 transition-all duration-200 ease-apple-standard min-h-[48px] touch-manipulation ${
                            fieldErrors.email
                              ? 'border-red-400 focus:ring-red-500/30 focus:border-red-500'
                              : 'border-ghost-purple-primary/30 focus:ring-ghost-purple-primary/30 focus:border-ghost-purple-primary/50'
                          }`}
                          placeholder="john@example.com"
                        />
                        {fieldErrors.email && (
                          <p className="mt-1.5 text-sm text-red-400 font-medium">{fieldErrors.email}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="country" className="block text-sm font-semibold mb-2.5 text-ghost-text-primary">
                        Country <span className="text-red-400">*</span>
                      </label>
                      <select
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        required
                        autoComplete="country"
                        className="w-full px-4 py-3.5 sm:py-3 rounded-xl border border-ghost-purple-primary/30 bg-ghost-bg-section text-ghost-text-primary text-base focus:outline-none focus:ring-2 focus:ring-ghost-purple-primary/30 focus:border-ghost-purple-primary/50 transition-all duration-200 ease-apple-standard min-h-[48px] touch-manipulation appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23F9FAFB%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22%3E%3Cpolyline points=%226 9 12 15 18 9%22%3E%3C/polyline%3E%3C/svg%3E')] bg-no-repeat bg-right-4 bg-[length:20px] pr-10"
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
                      <label htmlFor="address" className="block text-sm font-semibold mb-2.5 text-ghost-text-primary">
                        Street Address <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        onBlur={() => validateField('address', formData.address)}
                        required
                        autoComplete="street-address"
                        rows={3}
                        className={`w-full px-4 py-3.5 sm:py-3 rounded-xl border bg-ghost-bg-section text-ghost-text-primary placeholder-ghost-text-muted text-base focus:outline-none focus:ring-2 transition-all duration-200 ease-apple-standard resize-none min-h-[48px] touch-manipulation ${
                          fieldErrors.address
                            ? 'border-red-400 focus:ring-red-500/30 focus:border-red-500'
                            : 'border-ghost-purple-primary/30 focus:ring-ghost-purple-primary/30 focus:border-ghost-purple-primary/50'
                        }`}
                        placeholder="123 Main Street, Apt 4B"
                      />
                      {fieldErrors.address && (
                        <p className="mt-1.5 text-sm text-red-400 font-medium">{fieldErrors.address}</p>
                      )}
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4 sm:gap-5">
                      <div>
                        <label htmlFor="state" className="block text-sm font-semibold mb-2.5 text-ghost-text-primary">
                          State / Province <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          required
                          autoComplete="address-level1"
                          className="w-full px-4 py-3.5 sm:py-3 rounded-xl border border-ghost-purple-primary/30 bg-ghost-bg-section text-ghost-text-primary placeholder-ghost-text-muted text-base focus:outline-none focus:ring-2 focus:ring-ghost-purple-primary/30 focus:border-ghost-purple-primary/50 transition-all duration-200 ease-apple-standard min-h-[48px] touch-manipulation"
                          placeholder="CA"
                        />
                      </div>

                      <div>
                        <label htmlFor="city" className="block text-sm font-semibold mb-2.5 text-ghost-text-primary">
                          City <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                          autoComplete="address-level2"
                          className="w-full px-4 py-3.5 sm:py-3 rounded-xl border border-ghost-purple-primary/30 bg-ghost-bg-section text-ghost-text-primary placeholder-ghost-text-muted text-base focus:outline-none focus:ring-2 focus:ring-ghost-purple-primary/30 focus:border-ghost-purple-primary/50 transition-all duration-200 ease-apple-standard min-h-[48px] touch-manipulation"
                          placeholder="San Francisco"
                        />
                      </div>

                      <div>
                        <label htmlFor="zip" className="block text-sm font-semibold mb-2.5 text-ghost-text-primary">
                          Postal Code <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          id="zip"
                          name="zip"
                          value={formData.zip}
                          onChange={handleInputChange}
                          onBlur={() => validateField('zip', formData.zip)}
                          required
                          autoComplete="postal-code"
                          inputMode="numeric"
                          className={`w-full px-4 py-3.5 sm:py-3 rounded-xl border bg-ghost-bg-section text-ghost-text-primary placeholder-ghost-text-muted text-base focus:outline-none focus:ring-2 transition-all duration-200 ease-apple-standard min-h-[48px] touch-manipulation ${
                            fieldErrors.zip
                              ? 'border-red-400 focus:ring-red-500/30 focus:border-red-500'
                              : 'border-ghost-purple-primary/30 focus:ring-ghost-purple-primary/30 focus:border-ghost-purple-primary/50'
                          }`}
                          placeholder="94102"
                        />
                        {fieldErrors.zip && (
                          <p className="mt-1.5 text-sm text-red-400 font-medium">{fieldErrors.zip}</p>
                        )}
                      </div>
                    </div>

                    {/* Save Address Option */}
                    {isSignedIn && (
                      <div className="flex items-center pt-4 border-t border-ghost-purple-primary/20">
                        <input
                          type="checkbox"
                          id="saveAddress"
                          className="mr-2 accent-ghost-purple-primary"
                        />
                        <label htmlFor="saveAddress" className="text-sm text-ghost-text-secondary">
                          Save this address for future orders
                        </label>
                      </div>
                    )}
                  </div>
                )}

                {/* Coupon Input */}
                <div className="bg-ghost-bg-card border border-ghost-purple-primary/20 rounded-2xl p-4 sm:p-6 lg:p-8 w-full">
                  <h3 className="text-lg font-semibold mb-4 text-ghost-text-primary">
                    Have a Coupon?
                  </h3>
                  <CouponInput
                    onApply={handleCouponApply}
                    onRemove={handleCouponRemove}
                    appliedCode={couponCode || undefined}
                    discountAmount={discountAmount}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex-1 px-6 py-3.5 sm:py-3 rounded-full border border-ghost-purple-primary/30 bg-ghost-bg-card text-ghost-text-primary font-semibold hover:bg-ghost-bg-section active:bg-ghost-bg-section transition-all duration-150 ease-apple-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ghost-purple-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-ghost-bg-page min-h-[48px] touch-manipulation"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading || (stock !== null && stock <= 0)}
                    className="flex-1 px-6 py-3.5 sm:py-3 rounded-full bg-ghost-purple-primary text-white font-semibold hover:bg-ghost-purple-accent active:bg-ghost-purple-accent shadow-lg transition-all duration-150 ease-apple-standard disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ghost-purple-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ghost-bg-page min-h-[48px] touch-manipulation"
                  >
                    {loading ? 'Processing...' : stock !== null && stock <= 0 ? 'Out of Stock' : 'Continue to Payment'}
                  </button>
                </div>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1 w-full order-1 lg:order-2">
              <div className="bg-ghost-bg-card border border-ghost-purple-primary/20 rounded-2xl p-4 sm:p-6 lg:p-8 sticky top-24 w-full">
                <h2 className="text-xl font-semibold mb-6 text-ghost-text-primary">
                  Order Summary
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-ghost-text-secondary">Product</span>
                    <span className="font-medium text-ghost-text-primary">Gastly Humidifier 2.1</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-ghost-text-secondary">Quantity</span>
                    <span className="font-medium text-ghost-text-primary">1</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-ghost-text-secondary">Subtotal</span>
                    <div className="flex items-baseline gap-2">
                      <span className="font-medium text-ghost-text-primary">
                        ${(currentPrice / 100).toFixed(2)}
                      </span>
                      <span className="text-xs text-ghost-text-muted line-through">
                        ${(originalPrice / 100).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="inline-flex items-center px-2 py-0.5 bg-ghost-purple-primary/20 text-ghost-purple-accent rounded-full font-semibold">
                      First 100 Units Special
                    </span>
                    <span className="text-ghost-text-secondary">
                      Save ${((originalPrice - currentPrice) / 100).toFixed(2)}
                    </span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between items-center text-sm text-green-400">
                      <span>Discount ({couponCode})</span>
                      <span className="font-medium">
                        -${(discountAmount / 100).toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="border-t border-ghost-purple-primary/20 pt-4 mt-4">
                    <div className="flex justify-between items-baseline mb-2">
                      <span className="text-lg font-semibold text-ghost-text-primary">Total</span>
                      <span className="text-lg font-semibold text-ghost-text-primary">
                        ${finalPriceDisplay}
                      </span>
                    </div>
                    <p className="text-xs text-ghost-text-muted mt-2">
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
