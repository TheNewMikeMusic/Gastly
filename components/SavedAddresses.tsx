'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'

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

interface SavedAddressesProps {
  onSelect?: (address: Address) => void
  showAddButton?: boolean
}

export function SavedAddresses({ onSelect, showAddButton = true }: SavedAddressesProps) {
  const { isSignedIn } = useAuth()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    label: '',
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    isDefault: false,
  })

  useEffect(() => {
    if (isSignedIn) {
      loadAddresses()
    }
  }, [isSignedIn])

  const loadAddresses = async () => {
    try {
      const response = await fetch('/api/addresses')
      const data = await response.json()
      setAddresses(data.addresses || [])
    } catch (error) {
      console.error('Failed to load addresses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        setShowForm(false)
        setFormData({
          label: '',
          name: '',
          phone: '',
          email: '',
          address: '',
          city: '',
          state: '',
          zip: '',
          country: '',
          isDefault: false,
        })
        loadAddresses()
      }
    } catch (error) {
      console.error('Failed to save address:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return
    try {
      await fetch(`/api/addresses?id=${id}`, { method: 'DELETE' })
      loadAddresses()
    } catch (error) {
      console.error('Failed to delete address:', error)
    }
  }

  if (!isSignedIn) {
    return null
  }

  if (loading) {
    return <div className="text-sm text-gray-600">Loading addresses...</div>
  }

  return (
    <div className="space-y-4">
      {addresses.length > 0 && (
        <div className="space-y-3">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                address.isDefault
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onSelect?.(address)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {address.label && (
                    <div className="text-sm font-medium text-gray-900 mb-1">
                      {address.label}
                      {address.isDefault && (
                        <span className="ml-2 text-xs text-blue-600">(Default)</span>
                      )}
                    </div>
                  )}
                  <div className="text-sm text-gray-700">
                    <p className="font-medium">{address.name}</p>
                    <p>{address.phone}</p>
                    <p className="mt-1">
                      {[
                        address.address,
                        address.city,
                        address.state,
                        address.zip,
                      ]
                        .filter(Boolean)
                        .join(', ')}
                      {address.country && `, ${address.country}`}
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(address.id)
                  }}
                  className="text-sm text-red-600 hover:text-red-800 ml-4"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddButton && (
        <>
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="w-full px-4 py-2 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-colors"
            >
              + Add New Address
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 p-4 border border-gray-200 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Label (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    placeholder="Home, Office, etc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State/Province
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP/Postal Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.zip}
                    onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="isDefault" className="text-sm text-gray-700">
                  Set as default address
                </label>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-950 transition-colors"
                >
                  Save Address
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setFormData({
                      label: '',
                      name: '',
                      phone: '',
                      email: '',
                      address: '',
                      city: '',
                      state: '',
                      zip: '',
                      country: '',
                      isDefault: false,
                    })
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </>
      )}
    </div>
  )
}

