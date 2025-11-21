'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Order } from '@prisma/client'

interface OrderSearchFilterProps {
  orders: Order[]
  onFilteredOrdersChange?: (orders: Order[]) => void
  showSort?: boolean
}

export function OrderSearchFilter({
  orders,
  onFilteredOrdersChange,
  showSort = true,
}: OrderSearchFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [statusFilter, setStatusFilter] = useState<string>(searchParams.get('status') || 'all')
  const [sortBy, setSortBy] = useState<string>(searchParams.get('sort') || 'date-desc')

  // 筛选和排序订单
  const filteredAndSortedOrders = useMemo(() => {
    let filtered = [...orders]

    // 搜索筛选
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(query) ||
          order.shippingName?.toLowerCase().includes(query) ||
          order.shippingEmail?.toLowerCase().includes(query) ||
          (order as any).trackingNumber?.toLowerCase().includes(query)
      )
    }

    // 状态筛选
    if (statusFilter !== 'all') {
      filtered = filtered.filter((order) => order.status === statusFilter)
    }

    // 排序
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'date-asc':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'amount-desc':
          return b.amount - a.amount
        case 'amount-asc':
          return a.amount - b.amount
        default:
          return 0
      }
    })

    return filtered
  }, [orders, searchQuery, statusFilter, sortBy])

  // 通知父组件筛选结果
  useEffect(() => {
    if (onFilteredOrdersChange) {
      onFilteredOrdersChange(filteredAndSortedOrders)
    }
  }, [filteredAndSortedOrders, onFilteredOrdersChange])

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    updateURL({ search: value || null })
  }

  const handleStatusChange = (status: string) => {
    setStatusFilter(status)
    updateURL({ status: status !== 'all' ? status : null })
  }

  const handleSortChange = (sort: string) => {
    setSortBy(sort)
    updateURL({ sort })
  }

  const updateURL = (params: { search?: string | null; status?: string | null; sort?: string }) => {
    const newParams = new URLSearchParams(searchParams.toString())
    
    if (params.search !== undefined) {
      if (params.search) {
        newParams.set('search', params.search)
      } else {
        newParams.delete('search')
      }
    }
    
    if (params.status !== undefined) {
      if (params.status) {
        newParams.set('status', params.status)
      } else {
        newParams.delete('status')
      }
    }
    
    if (params.sort) {
      newParams.set('sort', params.sort)
    }

    // 重置到第一页
    newParams.delete('page')
    
    router.push(`?${newParams.toString()}`)
  }

  return (
    <div className="glass rounded-xl p-4 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* 搜索框 */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by order number, name, email, or tracking number..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
          />
        </div>

        {/* 状态筛选 */}
        <div className="flex gap-2 flex-wrap">
          <FilterButton
            active={statusFilter === 'all'}
            onClick={() => handleStatusChange('all')}
            label="All"
          />
          <FilterButton
            active={statusFilter === 'paid'}
            onClick={() => handleStatusChange('paid')}
            label="Paid"
          />
          <FilterButton
            active={statusFilter === 'pending'}
            onClick={() => handleStatusChange('pending')}
            label="Pending"
          />
          <FilterButton
            active={statusFilter === 'cancelled'}
            onClick={() => handleStatusChange('cancelled')}
            label="Cancelled"
          />
        </div>
      </div>

      {/* 排序 */}
      {showSort && (
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Highest Amount</option>
            <option value="amount-asc">Lowest Amount</option>
          </select>
        </div>
      )}

      {/* 结果统计 */}
      {filteredAndSortedOrders.length !== orders.length && (
        <div className="text-sm text-gray-600">
          Showing {filteredAndSortedOrders.length} of {orders.length} orders
        </div>
      )}
    </div>
  )
}

function FilterButton({
  active,
  onClick,
  label,
}: {
  active: boolean
  onClick: () => void
  label: string
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
      {label}
    </button>
  )
}

