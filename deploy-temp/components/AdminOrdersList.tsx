'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Order } from '@prisma/client'
import { Pagination } from './Pagination'
import { MergeOrdersButton } from './MergeOrdersButton'

interface AdminOrdersListProps {
  orders: Order[]
  pagination?: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
  }
}

export function AdminOrdersList({ orders, pagination }: AdminOrdersListProps) {
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set())

  const toggleOrderSelection = (orderId: string) => {
    const newSelected = new Set(selectedOrders)
    if (newSelected.has(orderId)) {
      newSelected.delete(orderId)
    } else {
      newSelected.add(orderId)
    }
    setSelectedOrders(newSelected)
  }

  // 统计数据
  const stats = {
    total: orders.length,
    paid: orders.filter((o) => o.status === 'paid').length,
    pending: orders.filter((o) => o.status === 'pending').length,
    shipped: orders.filter((o) => o.status === 'paid' && o.trackingNumber).length,
    noTracking: orders.filter((o) => o.status === 'paid' && !o.trackingNumber).length,
  }

  // 筛选和搜索
  let filteredOrders = orders.filter((order) => {
    // 状态筛选
    if (filterStatus === 'paid') return order.status === 'paid'
    if (filterStatus === 'pending') return order.status === 'pending'
    if (filterStatus === 'no_tracking') return order.status === 'paid' && !order.trackingNumber
    if (filterStatus === 'shipped') return order.status === 'paid' && order.trackingNumber
    return true
  })

  // 搜索筛选
  if (searchQuery) {
    const query = searchQuery.toLowerCase()
    filteredOrders = filteredOrders.filter(
      (order) =>
        order.id.toLowerCase().includes(query) ||
        order.shippingName?.toLowerCase().includes(query) ||
        order.shippingEmail?.toLowerCase().includes(query) ||
        order.trackingNumber?.toLowerCase().includes(query) ||
        order.shippingPhone?.includes(query)
    )
  }

  return (
    <div className="space-y-6">
      {/* 统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard label="总订单" value={stats.total} color="gray" />
        <StatCard label="已支付" value={stats.paid} color="green" />
        <StatCard label="待支付" value={stats.pending} color="yellow" />
        <StatCard label="已发货" value={stats.shipped} color="blue" />
        <StatCard label="待发货" value={stats.noTracking} color="orange" />
      </div>

      {/* 批量操作和筛选 */}
      <div className="glass rounded-xl p-4 space-y-4">
        {/* 批量操作 */}
        <MergeOrdersButton 
          orders={filteredOrders.filter((o) => o.status === 'paid' && !o.trackingNumber)}
          selectedOrders={selectedOrders}
          onSelectionChange={setSelectedOrders}
        />
        
        <div className="flex flex-col sm:flex-row gap-4">
          {/* 搜索框 */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="搜索订单号、姓名、邮箱、电话或跟踪号..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
            />
          </div>
          {/* 筛选按钮 */}
          <div className="flex flex-wrap gap-2">
            <FilterButton
              active={filterStatus === 'all'}
              onClick={() => setFilterStatus('all')}
              label="全部"
              count={stats.total}
            />
            <FilterButton
              active={filterStatus === 'paid'}
              onClick={() => setFilterStatus('paid')}
              label="已支付"
              count={stats.paid}
            />
            <FilterButton
              active={filterStatus === 'no_tracking'}
              onClick={() => setFilterStatus('no_tracking')}
              label="待发货"
              count={stats.noTracking}
            />
            <FilterButton
              active={filterStatus === 'shipped'}
              onClick={() => setFilterStatus('shipped')}
              label="已发货"
              count={stats.shipped}
            />
            <FilterButton
              active={filterStatus === 'pending'}
              onClick={() => setFilterStatus('pending')}
              label="待支付"
              count={stats.pending}
            />
          </div>
        </div>
      </div>

      {/* 订单列表 */}
      {filteredOrders.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <p className="text-gray-600">
            {searchQuery ? '没有找到匹配的订单' : '暂无订单'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const isSelected = selectedOrders.has(order.id)
            const canSelect = order.status === 'paid' && !order.trackingNumber
            
            return (
              <div
                key={order.id}
                className={`glass rounded-xl p-6 hover:shadow-lg transition-all border ${
                  isSelected ? 'border-blue-500 bg-blue-50/30' : 'border-gray-200'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    {/* 订单头部信息 */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          {/* 批量选择复选框 */}
                          {canSelect && (
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleOrderSelection(order.id)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                          )}
                          <span className="font-semibold text-gray-900">
                            订单号: {order.id.slice(0, 8).toUpperCase()}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              order.status === 'paid'
                                ? 'bg-green-100 text-green-800'
                                : order.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {order.status === 'paid' ? '已支付' : order.status === 'pending' ? '待支付' : order.status}
                          </span>
                          {order.trackingNumber && (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              已发货
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          创建时间:{' '}
                          {new Date(order.createdAt).toLocaleString('zh-CN', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">
                          {order.currency.toUpperCase()} {(order.amount / 100).toFixed(2)}
                        </div>
                      </div>
                    </div>

                    {/* 收货人信息 */}
                    {order.shippingName && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">收货人: </span>
                          <span className="text-gray-900 font-medium">{order.shippingName}</span>
                        </div>
                        {order.shippingPhone && (
                          <div>
                            <span className="text-gray-500">电话: </span>
                            <span className="text-gray-900 font-medium">{order.shippingPhone}</span>
                          </div>
                        )}
                        {order.shippingEmail && (
                          <div>
                            <span className="text-gray-500">邮箱: </span>
                            <span className="text-gray-900 font-medium">{order.shippingEmail}</span>
                          </div>
                        )}
                        {(order.shippingCity || order.shippingCountry) && (
                          <div>
                            <span className="text-gray-500">地址: </span>
                            <span className="text-gray-900 font-medium">
                              {[order.shippingCity, order.shippingState, order.shippingCountry]
                                .filter(Boolean)
                                .join(', ')}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* 详细地址 */}
                    {order.shippingAddress && (
                      <div className="text-sm">
                        <span className="text-gray-500">详细地址: </span>
                        <span className="text-gray-900">
                          {order.shippingAddress}
                          {order.shippingZip && ` (${order.shippingZip})`}
                        </span>
                      </div>
                    )}

                    {/* 跟踪号 */}
                    {order.trackingNumber && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-500">跟踪号: </span>
                        <span className="font-mono font-semibold text-gray-900">
                          {order.trackingNumber}
                        </span>
                        {order.trackingStatus && (
                          <span className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">
                            {order.trackingStatus}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex flex-col gap-2 lg:items-end">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-950 transition-colors text-center whitespace-nowrap"
                    >
                      查看详情
                    </Link>
                    {order.status === 'paid' && !order.trackingNumber && (
                      <span className="text-xs text-orange-600 font-medium">需要发货</span>
                    )}
                    {order.status === 'paid' && order.trackingNumber && (
                      <span className="text-xs text-green-600 font-medium">已创建运单</span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* 分页 */}
      {pagination && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          itemsPerPage={pagination.itemsPerPage}
        />
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
  value: number
  color: 'gray' | 'green' | 'yellow' | 'blue' | 'orange'
}) {
  const colorClasses = {
    gray: 'bg-gray-100 text-gray-900',
    green: 'bg-green-100 text-green-900',
    yellow: 'bg-yellow-100 text-yellow-900',
    blue: 'bg-blue-100 text-blue-900',
    orange: 'bg-orange-100 text-orange-900',
  }

  return (
    <div className={`glass rounded-xl p-4 text-center ${colorClasses[color]}`}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm font-medium mt-1">{label}</div>
    </div>
  )
}

function FilterButton({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean
  onClick: () => void
  label: string
  count: number
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        active
          ? 'bg-gray-900 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {label} ({count})
    </button>
  )
}
