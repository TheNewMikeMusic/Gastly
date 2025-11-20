'use client'

import { useState } from 'react'

interface NewsletterSignupProps {
  variant?: 'inline' | 'modal'
}

export function NewsletterSignup({ variant = 'inline' }: NewsletterSignupProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!data.success) {
        setError(data.message || 'Failed to subscribe')
        return
      }

      setSuccess(true)
      setEmail('')
      setTimeout(() => setSuccess(false), 5000)
    } catch (err) {
      setError('Failed to subscribe. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-sm font-medium text-green-900">
          ✓ Successfully subscribed! Check your email for confirmation.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={variant === 'modal' ? 'space-y-4' : 'flex gap-2'}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className={variant === 'modal' 
          ? "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
          : "flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
        }
        required
      />
      <button
        type="submit"
        disabled={loading}
        className={variant === 'modal'
          ? "w-full px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-950 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          : "px-6 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-950 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        }
      >
        {loading ? 'Subscribing...' : 'Subscribe'}
      </button>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </form>
  )
}

