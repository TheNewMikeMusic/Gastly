'use client'

import Link from 'next/link'
import { RetryPaymentButton } from './RetryPaymentButton'
import { CancelOrderButton } from './CancelOrderButton'
import { DeleteOrderButton } from './DeleteOrderButton'

interface OrderActionsProps {
  orderId: string
  orderStatus: string
  hasTracking?: boolean
  trackingNumber?: string
}

export function OrderActions({ orderId, orderStatus, hasTracking, trackingNumber }: OrderActionsProps) {
  // 主要操作按钮（总是显示）
  const primaryActions = []
  
  // 查看详情/跟踪按钮
  primaryActions.push(
    <Link
      key="view-details"
      href={`/account/track/${orderId}`}
      className="px-4 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-950 active:bg-gray-950 transition-colors text-center min-h-[44px] flex items-center justify-center touch-manipulation whitespace-nowrap"
    >
      {hasTracking && trackingNumber ? 'Track Package' : 'View Details'}
    </Link>
  )

  // 根据订单状态添加主要操作
  if (orderStatus === 'pending') {
    primaryActions.push(
      <RetryPaymentButton
        key="continue-payment"
        orderId={orderId}
        className="min-h-[44px] flex items-center justify-center whitespace-nowrap"
      />
    )
  }

  // 次要操作（放在次要位置）
  const secondaryActions = []
  
  if (orderStatus === 'paid') {
    secondaryActions.push(
      <CancelOrderButton key="cancel" orderId={orderId} />
    )
  }

  // 删除按钮（pending或cancelled状态）
  if (orderStatus === 'pending' || orderStatus === 'cancelled') {
    secondaryActions.push(
      <DeleteOrderButton
        key="delete"
        orderId={orderId}
        orderStatus={orderStatus}
        className="whitespace-nowrap"
      />
    )
  }

  return (
    <div className="flex flex-col gap-3 w-full sm:w-auto">
      {/* 主要操作按钮组 */}
      <div className="flex flex-col sm:flex-row gap-2">
        {primaryActions}
      </div>

      {/* 次要操作按钮组 */}
      {secondaryActions.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-2">
          {secondaryActions}
        </div>
      )}

      {/* 状态提示 */}
      {orderStatus === 'paid' && !hasTracking && (
        <p className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
          Preparing for shipment
        </p>
      )}
    </div>
  )
}

