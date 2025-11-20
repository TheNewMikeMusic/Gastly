'use client'

import { useState } from 'react'
import { Order } from '@prisma/client'
import { useRouter } from 'next/navigation'

interface OrderDetailProps {
  order: Order
}

export function OrderDetail({ order }: OrderDetailProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showTrackingForm, setShowTrackingForm] = useState(false)
  const [productCode, setProductCode] = useState('')
  const [deliverType, setDeliverType] = useState('')
  const [deliverToRecipientType, setDeliverToRecipientType] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')

  const handleCreate4PXOrder = async () => {
    if (!productCode || !deliverType || !deliverToRecipientType) {
      setError('请填写所有必需字段')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/admin/orders/create-4px', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: order.id,
          productCode,
          deliverType,
          deliverToRecipientType,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || data.message || '创建订单失败')
        setLoading(false)
        return
      }

      setSuccess(`4PX订单创建成功！跟踪号: ${data.trackingNumber || '待获取'}`)
      setShowCreateForm(false)
      router.refresh()
    } catch (err: any) {
      setError('网络错误，请稍后重试')
      setLoading(false)
    }
  }

  const handleUpdateTracking = async () => {
    if (!trackingNumber.trim()) {
      setError('跟踪号不能为空')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch(`/api/admin/orders/${order.id}/update-tracking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ trackingNumber: trackingNumber.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || '更新跟踪号失败')
        setLoading(false)
        return
      }

      setSuccess('跟踪号更新成功！')
      setShowTrackingForm(false)
      setTrackingNumber('')
      router.refresh()
    } catch (err: any) {
      setError('网络错误，请稍后重试')
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* 订单基本信息 */}
      <div className="glass rounded-2xl p-6 space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">订单信息</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-600">订单号</dt>
            <dd className="mt-1 text-lg font-semibold text-gray-900">{order.id}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-600">订单状态</dt>
            <dd className="mt-1">
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  order.status === 'paid'
                    ? 'bg-green-100 text-green-800'
                    : order.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {order.status === 'paid' ? '已支付' : order.status === 'pending' ? '待支付' : order.status}
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-600">订单金额</dt>
            <dd className="mt-1 text-lg font-semibold text-gray-900">
              {order.currency.toUpperCase()} {(order.amount / 100).toFixed(2)}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-600">创建时间</dt>
            <dd className="mt-1 text-gray-900">
              {new Date(order.createdAt).toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </dd>
          </div>
        </div>
      </div>

      {/* 收货地址信息 */}
      {(order.shippingName || order.shippingAddress) && (
        <div className="glass rounded-2xl p-6 space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">收货地址</h2>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {order.shippingName && (
              <div>
                <dt className="text-sm font-medium text-gray-600">收货人</dt>
                <dd className="mt-1 text-gray-900">{order.shippingName}</dd>
              </div>
            )}
            {order.shippingPhone && (
              <div>
                <dt className="text-sm font-medium text-gray-600">联系电话</dt>
                <dd className="mt-1 text-gray-900">{order.shippingPhone}</dd>
              </div>
            )}
            {order.shippingEmail && (
              <div>
                <dt className="text-sm font-medium text-gray-600">邮箱</dt>
                <dd className="mt-1 text-gray-900">{order.shippingEmail}</dd>
              </div>
            )}
            <div className="md:col-span-2">
              <dt className="text-sm font-medium text-gray-600">详细地址</dt>
              <dd className="mt-1 text-gray-900">
                {[
                  order.shippingAddress,
                  order.shippingCity,
                  order.shippingState,
                  order.shippingZip,
                ]
                  .filter(Boolean)
                  .join(' ')}
                {order.shippingCountry && ` (${order.shippingCountry})`}
              </dd>
            </div>
          </dl>
        </div>
      )}

      {/* 物流信息 */}
      <div className="glass rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">物流信息</h2>
          <div className="flex gap-2">
            {!order.trackingNumber && order.status === 'paid' && (
              <>
                <button
                  onClick={() => {
                    setShowCreateForm(!showCreateForm)
                    setShowTrackingForm(false)
                  }}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  创建4PX订单
                </button>
                <button
                  onClick={() => {
                    setShowTrackingForm(!showTrackingForm)
                    setShowCreateForm(false)
                  }}
                  className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
                >
                  手动填入单号
                </button>
              </>
            )}
          </div>
        </div>

        {order.trackingNumber ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-green-800">跟踪号:</span>
              <span className="text-lg font-semibold text-green-900">{order.trackingNumber}</span>
            </div>
            <div className="text-sm text-green-700">
              物流状态: {order.trackingStatus || '待更新'}
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">尚未创建物流订单</p>
          </div>
        )}

        {/* 创建4PX订单表单 */}
        {showCreateForm && (
          <div className="border-t border-gray-200 pt-4 mt-4 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">创建4PX订单</h3>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                {success}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  物流产品代码 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={productCode}
                  onChange={(e) => setProductCode(e.target.value)}
                  placeholder="例如: A1, A5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  到仓方式代码 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={deliverType}
                  onChange={(e) => setDeliverType(e.target.value)}
                  placeholder="例如: 1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  投递方式代码 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={deliverToRecipientType}
                  onChange={(e) => setDeliverToRecipientType(e.target.value)}
                  placeholder="例如: 1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCreate4PXOrder}
                disabled={loading}
                className="px-6 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-950 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? '创建中...' : '创建订单'}
              </button>
              <button
                onClick={() => {
                  setShowCreateForm(false)
                  setError('')
                  setSuccess('')
                }}
                className="px-6 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        )}

        {/* 手动填入单号表单 */}
        {showTrackingForm && (
          <div className="border-t border-gray-200 pt-4 mt-4 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">手动填入跟踪号</h3>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                {success}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                跟踪号 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="请输入4PX跟踪号"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleUpdateTracking}
                disabled={loading}
                className="px-6 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-950 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? '更新中...' : '更新跟踪号'}
              </button>
              <button
                onClick={() => {
                  setShowTrackingForm(false)
                  setError('')
                  setSuccess('')
                  setTrackingNumber('')
                }}
                className="px-6 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

