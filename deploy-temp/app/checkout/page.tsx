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
  const { user, isLoaded } = useUser()
  const { isSignedIn } = useAuth()
  const prefersReducedMotion = useReducedMotion()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([])
  const [useSavedAddress, setUseSavedAddress] = useState(false)
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [couponCode, setCouponCode] = useState<string | null>(null)
  const [discountAmount, setDiscountAmount] = useState(0)
  const [productPrice, setProductPrice] = useState(29900) // $299 in cents
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
      
      // 如果有默认地址，自动选择
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

    // 加载保存的地址
    if (isSignedIn) {
      loadSavedAddresses()
    }

    // 检查库存
    checkStock()
  }, [user, isLoaded, router, isSignedIn, loadSavedAddresses, checkStock])

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

    // 检查库存
    if (stock !== null && stock <= 0) {
      setError('Product is out of stock')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 验证所有字段
    if (!validateForm()) {
      setError('Please fix the errors in the form')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // 如果有优惠券，需要先验证并应用到订单
      // 注意：实际应用中，优惠券应该在Stripe Checkout中处理
      // 这里我们只是将优惠券代码传递到后端
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

  const finalPrice = productPrice - discountAmount
  const finalPriceDisplay = (finalPrice / 100).toFixed(2)

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="page-content pb-20 px-4 sm:px-6 lg:px-8 safe-area-bottom">
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

          {/* 库存状态 */}
          {stock !== null && (
            <div className="mb-6">
              <StockStatus productId="maclock-default" />
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Shipping Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && <FormError error={error} />}

                {/* 保存的地址选择 */}
                {isSignedIn && savedAddresses.length > 0 && (
                  <div className="glass rounded-2xl p-6 sm:p-8">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900">
                      Use Saved Address
                    </h3>
                    <SavedAddresses
                      onSelect={handleSelectAddress}
                      showAddButton={false}
                    />
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={() => {
                          setUseSavedAddress(false)
                          setSelectedAddressId(null)
                        }}
                        className="text-sm text-gray-600 hover:text-gray-900"
                      >
                        Or enter a new address →
                      </button>
                    </div>
                  </div>
                )}

                {(!useSavedAddress || savedAddresses.length === 0) && (
                  <div className="glass rounded-2xl p-6 sm:p-8 space-y-6">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-900">
                      Shipping Information
                    </h2>

                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold mb-2.5 text-gray-900">
                        Full Name <span className="text-red-500">*</span>
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
                        className={`w-full px-4 py-3.5 sm:py-3 rounded-xl border bg-white text-gray-900 placeholder-gray-400 text-base focus:outline-none focus:ring-2 transition-all duration-200 ease-apple-standard min-h-[48px] touch-manipulation ${
                          fieldErrors.name
                            ? 'border-red-400 focus:ring-red-500/30 focus:border-red-500'
                            : 'border-gray-300 focus:ring-gray-900/20 focus:border-gray-900/40'
                        }`}
                        placeholder="John Doe"
                      />
                      {fieldErrors.name && (
                        <p className="mt-1.5 text-sm text-red-600 font-medium">{fieldErrors.name}</p>
                      )}
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-semibold mb-2.5 text-gray-900">
                          Phone Number <span className="text-red-500">*</span>
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
                          className={`w-full px-4 py-3.5 sm:py-3 rounded-xl border bg-white text-gray-900 placeholder-gray-400 text-base focus:outline-none focus:ring-2 transition-all duration-200 ease-apple-standard min-h-[48px] touch-manipulation ${
                            fieldErrors.phone
                              ? 'border-red-400 focus:ring-red-500/30 focus:border-red-500'
                              : 'border-gray-300 focus:ring-gray-900/20 focus:border-gray-900/40'
                          }`}
                          placeholder="+1 (555) 123-4567"
                        />
                        {fieldErrors.phone && (
                          <p className="mt-1.5 text-sm text-red-600 font-medium">{fieldErrors.phone}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-semibold mb-2.5 text-gray-900">
                          Email Address <span className="text-red-500">*</span>
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
                          className={`w-full px-4 py-3.5 sm:py-3 rounded-xl border bg-white text-gray-900 placeholder-gray-400 text-base focus:outline-none focus:ring-2 transition-all duration-200 ease-apple-standard min-h-[48px] touch-manipulation ${
                            fieldErrors.email
                              ? 'border-red-400 focus:ring-red-500/30 focus:border-red-500'
                              : 'border-gray-300 focus:ring-gray-900/20 focus:border-gray-900/40'
                          }`}
                          placeholder="john@example.com"
                        />
                        {fieldErrors.email && (
                          <p className="mt-1.5 text-sm text-red-600 font-medium">{fieldErrors.email}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="country" className="block text-sm font-semibold mb-2.5 text-gray-900">
                        Country <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        required
                        autoComplete="country"
                        className="w-full px-4 py-3.5 sm:py-3 rounded-xl border border-gray-300 bg-white text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900/40 transition-all duration-200 ease-apple-standard min-h-[48px] touch-manipulation appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22currentColor%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22%3E%3Cpolyline points=%226 9 12 15 18 9%22%3E%3C/polyline%3E%3C/svg%3E')] bg-no-repeat bg-right-4 bg-[length:20px] pr-10"
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
                      <label htmlFor="address" className="block text-sm font-semibold mb-2.5 text-gray-900">
                        Street Address <span className="text-red-500">*</span>
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
                        className={`w-full px-4 py-3.5 sm:py-3 rounded-xl border bg-white text-gray-900 placeholder-gray-400 text-base focus:outline-none focus:ring-2 transition-all duration-200 ease-apple-standard resize-none min-h-[48px] touch-manipulation ${
                          fieldErrors.address
                            ? 'border-red-400 focus:ring-red-500/30 focus:border-red-500'
                            : 'border-gray-300 focus:ring-gray-900/20 focus:border-gray-900/40'
                        }`}
                        placeholder="123 Main Street, Apt 4B"
                      />
                      {fieldErrors.address && (
                        <p className="mt-1.5 text-sm text-red-600 font-medium">{fieldErrors.address}</p>
                      )}
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4 sm:gap-5">
                      <div>
                        <label htmlFor="state" className="block text-sm font-semibold mb-2.5 text-gray-900">
                          State / Province <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          required
                          autoComplete="address-level1"
                          className="w-full px-4 py-3.5 sm:py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900/40 transition-all duration-200 ease-apple-standard min-h-[48px] touch-manipulation"
                          placeholder="CA"
                        />
                      </div>

                      <div>
                        <label htmlFor="city" className="block text-sm font-semibold mb-2.5 text-gray-900">
                          City <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                          autoComplete="address-level2"
                          className="w-full px-4 py-3.5 sm:py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900/40 transition-all duration-200 ease-apple-standard min-h-[48px] touch-manipulation"
                          placeholder="San Francisco"
                        />
                      </div>

                      <div>
                        <label htmlFor="zip" className="block text-sm font-semibold mb-2.5 text-gray-900">
                          Postal Code <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="zip"
                          name="zip"
                          value={formData.zip}
                          onChange={handleInputChange}
                          required
                          autoComplete="postal-code"
                          inputMode="numeric"
                          className="w-full px-4 py-3.5 sm:py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900/40 transition-all duration-200 ease-apple-standard min-h-[48px] touch-manipulation"
                          placeholder="94102"
                        />
                      </div>
                    </div>

                    {/* 保存地址选项 */}
                    {isSignedIn && (
                      <div className="flex items-center pt-4 border-t border-gray-200">
                        <input
                          type="checkbox"
                          id="saveAddress"
                          className="mr-2"
                        />
                        <label htmlFor="saveAddress" className="text-sm text-gray-700">
                          Save this address for future orders
                        </label>
                      </div>
                    )}
                  </div>
                )}

                {/* 优惠券输入 */}
                <div className="glass rounded-2xl p-6 sm:p-8">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">
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
                    className="flex-1 px-6 py-3.5 sm:py-3 rounded-full border border-gray-300 bg-white text-gray-900 font-semibold active:bg-gray-50 transition-all duration-150 ease-apple-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/40 focus-visible:ring-offset-2 min-h-[48px] touch-manipulation"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading || (stock !== null && stock <= 0)}
                    className="flex-1 px-6 py-3.5 sm:py-3 rounded-full bg-gray-900 text-white font-semibold active:bg-gray-950 shadow-deep transition-all duration-150 ease-apple-standard disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/60 focus-visible:ring-offset-2 min-h-[48px] touch-manipulation"
                  >
                    {loading ? 'Processing...' : stock !== null && stock <= 0 ? 'Out of Stock' : 'Continue to Payment'}
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
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-900">
                      ${(productPrice / 100).toFixed(2)}
                    </span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between items-center text-sm text-green-600">
                      <span>Discount ({couponCode})</span>
                      <span className="font-medium">
                        -${(discountAmount / 100).toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="border-t border-black/10 pt-4 mt-4">
                    <div className="flex justify-between items-baseline mb-2">
                      <span className="text-lg font-semibold text-gray-900">Total</span>
                      <span className="text-lg font-semibold text-gray-900">
                        ${finalPriceDisplay}
                      </span>
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
