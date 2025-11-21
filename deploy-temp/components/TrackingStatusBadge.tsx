import type { TrackingStatus } from '@/lib/tracking'
import { trackingStatusToLabel } from '@/lib/tracking'

const statusClassMap: Record<TrackingStatus, string> = {
  delivered: 'bg-green-100 text-green-800 border-green-200',
  out_for_delivery: 'bg-blue-100 text-blue-800 border-blue-200',
  in_transit: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  info_received: 'bg-amber-100 text-amber-800 border-amber-200',
  label_created: 'bg-amber-100 text-amber-800 border-amber-200',
  pending: 'bg-gray-100 text-gray-800 border-gray-200',
  customs: 'bg-purple-100 text-purple-800 border-purple-200',
  exception: 'bg-red-100 text-red-800 border-red-200',
  unknown: 'bg-gray-100 text-gray-800 border-gray-200',
}

interface TrackingStatusBadgeProps {
  status: TrackingStatus
  label?: string
}

export function TrackingStatusBadge({ status, label }: TrackingStatusBadgeProps) {
  const badgeClass = statusClassMap[status] ?? statusClassMap.unknown
  const displayLabel = label || trackingStatusToLabel(status)

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${badgeClass}`}
    >
      {displayLabel}
    </span>
  )
}
