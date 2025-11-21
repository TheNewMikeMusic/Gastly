'use client'

import { useState, useEffect, useCallback } from 'react'

interface AnalyticsData {
  totalOrders: number
  totalRevenue: number
  paidOrders: number
  pendingOrders: number
  cancelledOrders: number
  averageOrderValue: number
  ordersByStatus: Record<string, number>
  revenueByMonth: Array<{ month: string; revenue: number; orders: number }>
  topCoupons: Array<{ code: string; usageCount: number; totalDiscount: number }>
}

export function AdminAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  })

  const loadAnalytics = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (dateRange.startDate) params.append('startDate', dateRange.startDate)
      if (dateRange.endDate) params.append('endDate', dateRange.endDate)

      const response = await fetch(`/api/admin/analytics?${params.toString()}`)
      const data = await response.json()
      setAnalytics(data)
    } catch (error) {
      console.error('Failed to load analytics:', error)
    } finally {
      setLoading(false)
    }
  }, [dateRange])

  useEffect(() => {
    loadAnalytics()
  }, [loadAnalytics])

  const handleDateChange = () => {
    loadAnalytics()
  }

  if (loading) {
    return <div className="text-center py-12">Loading analytics...</div>
  }

  if (!analytics) {
    return <div className="text-center py-12">Failed to load analytics</div>
  }

  return (
    <div className="space-y-6">
      {/* 日期筛选 */}
      <div className="glass rounded-xl p-4 flex gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) => {
              setDateRange({ ...dateRange, startDate: e.target.value })
            }}
            onBlur={handleDateChange}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) => {
              setDateRange({ ...dateRange, endDate: e.target.value })
            }}
            onBlur={handleDateChange}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
        </div>
        <button
          onClick={loadAnalytics}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-950 transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* 关键指标 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Orders"
          value={analytics.totalOrders}
          color="blue"
        />
        <StatCard
          label="Total Revenue"
          value={`$${(analytics.totalRevenue / 100).toFixed(2)}`}
          color="green"
        />
        <StatCard
          label="Paid Orders"
          value={analytics.paidOrders}
          color="green"
        />
        <StatCard
          label="Avg Order Value"
          value={`$${(analytics.averageOrderValue / 100).toFixed(2)}`}
          color="purple"
        />
      </div>

      {/* 订单状态分布 */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Orders by Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(analytics.ordersByStatus).map(([status, count]) => (
            <div key={status} className="text-center">
              <div className="text-2xl font-bold text-gray-900">{count}</div>
              <div className="text-sm text-gray-600 capitalize">{status}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 月度收入趋势 */}
      {analytics.revenueByMonth.length > 0 && (
        <div className="glass rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Monthly Revenue</h3>
          <div className="space-y-3">
            {analytics.revenueByMonth.slice(-6).map((month) => (
              <div key={month.month}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    {new Date(month.month + '-01').toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                    })}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    ${(month.revenue / 100).toFixed(2)} ({month.orders} orders)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${(month.revenue / analytics.totalRevenue) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 热门优惠券 */}
      {analytics.topCoupons.length > 0 && (
        <div className="glass rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Top Coupons</h3>
          <div className="space-y-2">
            {analytics.topCoupons.map((coupon) => (
              <div
                key={coupon.code}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <span className="font-medium text-gray-900">{coupon.code}</span>
                  <span className="text-sm text-gray-600 ml-2">
                    Used {coupon.usageCount} times
                  </span>
                </div>
                <span className="text-sm font-semibold text-green-700">
                  ${(coupon.totalDiscount / 100).toFixed(2)} saved
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string
  value: string | number
  color: 'blue' | 'green' | 'purple' | 'orange'
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-900',
    green: 'bg-green-100 text-green-900',
    purple: 'bg-purple-100 text-purple-900',
    orange: 'bg-orange-100 text-orange-900',
  }

  return (
    <div className={`glass rounded-xl p-4 text-center ${colorClasses[color]}`}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm font-medium mt-1">{label}</div>
    </div>
  )
}

