'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Coupon {
  id: string
  code: string
  description?: string
  discountType: string
  discountValue: number
  minAmount?: number
  maxDiscount?: number
  usageLimit?: number
  usedCount: number
  validFrom: Date | string
  validUntil: Date | string
  isActive: boolean
}

interface AdminCouponsListProps {
  coupons: Coupon[]
}

export function AdminCouponsList({ coupons: initialCoupons }: AdminCouponsListProps) {
  const router = useRouter()
  const [coupons, setCoupons] = useState(initialCoupons)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: 10,
    minAmount: '',
    maxDiscount: '',
    usageLimit: '',
    validFrom: '',
    validUntil: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          discountValue: formData.discountType === 'percentage' 
            ? formData.discountValue 
            : formData.discountValue * 100, // 固定金额转换为分
          minAmount: formData.minAmount ? parseInt(formData.minAmount) * 100 : undefined,
          maxDiscount: formData.maxDiscount ? parseInt(formData.maxDiscount) * 100 : undefined,
          usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : undefined,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || 'Failed to create coupon')
        return
      }

      router.refresh()
      setShowForm(false)
      setFormData({
        code: '',
        description: '',
        discountType: 'percentage',
        discountValue: 10,
        minAmount: '',
        maxDiscount: '',
        usageLimit: '',
        validFrom: '',
        validUntil: '',
      })
    } catch (err) {
      setError('Failed to create coupon')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await fetch('/api/admin/coupons', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isActive: !currentStatus }),
      })
      router.refresh()
    } catch (err) {
      console.error('Failed to update coupon:', err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return

    try {
      await fetch(`/api/admin/coupons?id=${id}`, { method: 'DELETE' })
      router.refresh()
    } catch (err) {
      console.error('Failed to delete coupon:', err)
    }
  }

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900">优惠券列表</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-950 transition-colors"
        >
          {showForm ? '取消' : '+ 创建优惠券'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="glass rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold mb-4">创建新优惠券</h3>
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                优惠券代码 *
              </label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                折扣类型 *
              </label>
              <select
                value={formData.discountType}
                onChange={(e) => setFormData({ ...formData, discountType: e.target.value as 'percentage' | 'fixed' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              >
                <option value="percentage">百分比</option>
                <option value="fixed">固定金额</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                折扣值 * {formData.discountType === 'percentage' ? '(%)' : '($)'}
              </label>
              <input
                type="number"
                required
                min="0"
                max={formData.discountType === 'percentage' ? 100 : undefined}
                value={formData.discountValue}
                onChange={(e) => setFormData({ ...formData, discountValue: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                最低消费 ($)
              </label>
              <input
                type="number"
                min="0"
                value={formData.minAmount}
                onChange={(e) => setFormData({ ...formData, minAmount: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
            {formData.discountType === 'percentage' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  最大折扣 ($)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.maxDiscount}
                  onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                使用次数限制
              </label>
              <input
                type="number"
                min="0"
                value={formData.usageLimit}
                onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                开始日期 *
              </label>
              <input
                type="date"
                required
                value={formData.validFrom}
                onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                结束日期 *
              </label>
              <input
                type="date"
                required
                value={formData.validUntil}
                onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                描述
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-950 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? '创建中...' : '创建优惠券'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
          </div>
        </form>
      )}

      {coupons.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <p className="text-gray-600">暂无优惠券</p>
        </div>
      ) : (
        <div className="space-y-4">
          {coupons.map((coupon) => {
            const isValid = new Date(coupon.validUntil) > new Date()
            const isExpired = !isValid
            const usagePercentage = coupon.usageLimit
              ? (coupon.usedCount / coupon.usageLimit) * 100
              : 0

            return (
              <div
                key={coupon.id}
                className="glass rounded-xl p-6 border border-gray-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xl font-bold text-gray-900 font-mono">
                        {coupon.code}
                      </span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          coupon.isActive && isValid
                            ? 'bg-green-100 text-green-800'
                            : isExpired
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {coupon.isActive && isValid
                          ? '有效'
                          : isExpired
                          ? '已过期'
                          : '已停用'}
                      </span>
                    </div>
                    {coupon.description && (
                      <p className="text-sm text-gray-600 mb-3">{coupon.description}</p>
                    )}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">折扣类型:</span>
                        <span className="ml-2 font-medium">
                          {coupon.discountType === 'percentage'
                            ? `${coupon.discountValue}%`
                            : `$${(coupon.discountValue / 100).toFixed(2)}`}
                        </span>
                      </div>
                      {coupon.minAmount && (
                        <div>
                          <span className="text-gray-500">最低消费:</span>
                          <span className="ml-2 font-medium">
                            ${(coupon.minAmount / 100).toFixed(2)}
                          </span>
                        </div>
                      )}
                      {coupon.usageLimit && (
                        <div>
                          <span className="text-gray-500">使用次数:</span>
                          <span className="ml-2 font-medium">
                            {coupon.usedCount} / {coupon.usageLimit}
                          </span>
                        </div>
                      )}
                      <div>
                        <span className="text-gray-500">有效期:</span>
                        <span className="ml-2 font-medium">
                          {formatDate(coupon.validFrom)} - {formatDate(coupon.validUntil)}
                        </span>
                      </div>
                    </div>
                    {coupon.usageLimit && (
                      <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              usagePercentage >= 100
                                ? 'bg-red-500'
                                : usagePercentage >= 80
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      onClick={() => handleToggleActive(coupon.id, coupon.isActive)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        coupon.isActive
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {coupon.isActive ? '停用' : '启用'}
                    </button>
                    <button
                      onClick={() => handleDelete(coupon.id)}
                      className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      删除
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

