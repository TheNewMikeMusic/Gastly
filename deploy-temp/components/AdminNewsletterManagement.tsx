'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Subscriber {
  id: string
  email: string
  isActive: boolean
  subscribedAt: Date | string
  unsubscribedAt?: Date | string | null
}

interface AdminNewsletterManagementProps {
  subscribers: Subscriber[]
}

export function AdminNewsletterManagement({ subscribers: initialSubscribers }: AdminNewsletterManagementProps) {
  const router = useRouter()
  const [subscribers, setSubscribers] = useState(initialSubscribers)
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredSubscribers = subscribers.filter((sub) => {
    if (filter === 'active' && !sub.isActive) return false
    if (filter === 'inactive' && sub.isActive) return false
    if (searchQuery && !sub.email.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const activeCount = subscribers.filter((s) => s.isActive).length
  const inactiveCount = subscribers.filter((s) => !s.isActive).length

  return (
    <div className="space-y-6">
      {/* 统计 */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{subscribers.length}</div>
          <div className="text-sm text-gray-600 mt-1">Total Subscribers</div>
        </div>
        <div className="glass rounded-xl p-4 text-center bg-green-50">
          <div className="text-2xl font-bold text-green-900">{activeCount}</div>
          <div className="text-sm text-green-700 mt-1">Active</div>
        </div>
        <div className="glass rounded-xl p-4 text-center bg-gray-50">
          <div className="text-2xl font-bold text-gray-900">{inactiveCount}</div>
          <div className="text-sm text-gray-600 mt-1">Unsubscribed</div>
        </div>
      </div>

      {/* 筛选和搜索 */}
      <div className="glass rounded-xl p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
          />
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({subscribers.length})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'active'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Active ({activeCount})
            </button>
            <button
              onClick={() => setFilter('inactive')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'inactive'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Inactive ({inactiveCount})
            </button>
          </div>
        </div>
      </div>

      {/* 订阅者列表 */}
      {filteredSubscribers.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <p className="text-gray-600">No subscribers found</p>
        </div>
      ) : (
        <div className="glass rounded-xl p-6">
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredSubscribers.map((subscriber) => (
              <div
                key={subscriber.id}
                className={`p-4 rounded-lg flex items-center justify-between ${
                  subscriber.isActive ? 'bg-green-50' : 'bg-gray-50'
                }`}
              >
                <div>
                  <div className="font-medium text-gray-900">{subscriber.email}</div>
                  <div className="text-xs text-gray-600 mt-1">
                    Subscribed: {new Date(subscriber.subscribedAt).toLocaleDateString('zh-CN')}
                    {subscriber.unsubscribedAt && (
                      <span className="ml-2">
                        · Unsubscribed: {new Date(subscriber.unsubscribedAt).toLocaleDateString('zh-CN')}
                      </span>
                    )}
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    subscriber.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {subscriber.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

