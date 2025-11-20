'use client'

import { useState } from 'react'
import { Order } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { FormError, FormSuccess } from './FormError'

interface MergeOrdersButtonProps {
  orders: Order[]
  selectedOrders?: Set<string>
  onSelectionChange?: (selected: Set<string>) => void
}

export function MergeOrdersButton({ 
  orders, 
  selectedOrders: externalSelected,
  onSelectionChange 
}: MergeOrdersButtonProps) {
  const router = useRouter()
  const [internalSelected, setInternalSelected] = useState<Set<string>>(new Set())
  const selectedOrders = externalSelected || internalSelected
  const setSelectedOrders = onSelectionChange || setInternalSelected
  
  const [showMergeForm, setShowMergeForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [productCode, setProductCode] = useState('')
  const [deliverType, setDeliverType] = useState('')
  const [deliverToRecipientType, setDeliverToRecipientType] = useState('')

  // 可合并的订单（已支付且未创建运单）
  const mergeableOrders = orders.filter((o) => o.status === 'paid' && !o.trackingNumber)

  const handleMergeAndCreate = async () => {
    if (selectedOrders.size < 2) {
      setError('请至少选择2个订单进行合并')
      return
    }

    if (!productCode || !deliverType || !deliverToRecipientType) {
      setError('请填写所有必需字段')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/admin/orders/merge-create-4px', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderIds: Array.from(selectedOrders),
          productCode,
          deliverType,
          deliverToRecipientType,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || data.message || '合并创建运单失败')
        setLoading(false)
        return
      }

      setSuccess(`成功合并 ${selectedOrders.size} 个订单并创建4px运单！跟踪号: ${data.trackingNumber || '待获取'}`)
      setSelectedOrders(new Set())
      setShowMergeForm(false)
      setTimeout(() => {
        router.refresh()
      }, 1500)
    } catch (err: any) {
      setError('网络错误，请稍后重试')
      setLoading(false)
    }
  }

  if (mergeableOrders.length < 2) {
    return null // 如果可合并的订单少于2个，不显示合并按钮
  }

  return (
    <div className="space-y-3">
      {/* 批量选择提示 */}
      {selectedOrders.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            已选择 <strong>{selectedOrders.size}</strong> 个订单
            {selectedOrders.size >= 2 && (
              <button
                onClick={() => setShowMergeForm(true)}
                className="ml-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
              >
                合并创建运单
              </button>
            )}
            <button
              onClick={() => {
                setSelectedOrders(new Set())
                setShowMergeForm(false)
              }}
              className="ml-2 px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 transition-colors"
            >
              取消选择
            </button>
          </p>
        </div>
      )}

      {/* 合并表单 */}
      {showMergeForm && selectedOrders.size >= 2 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              合并创建4px运单 ({selectedOrders.size} 个订单)
            </h3>
            <button
              onClick={() => {
                setShowMergeForm(false)
                setError(null)
                setSuccess(null)
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <p className="text-sm text-gray-600">
            将选中的订单合并为一个4px运单。合并后，所有订单将共享同一个跟踪号。
          </p>

          {error && <FormError error={error} />}
          {success && <FormSuccess message={success} />}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              <strong>注意：</strong>合并后的运单将使用第一个选中订单的收货地址。创建成功后，可以在4px平台打印面单。
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleMergeAndCreate}
              disabled={loading}
              className="px-6 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-950 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? '创建中...' : '合并创建运单'}
            </button>
            <button
              onClick={() => {
                setShowMergeForm(false)
                setError(null)
                setSuccess(null)
              }}
              className="px-6 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              取消
            </button>
          </div>
        </div>
      )}

    </div>
  )
}

