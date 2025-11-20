import type { TrackingEvent } from '@/lib/tracking'

interface TrackingTimelineProps {
  events: TrackingEvent[]
}

export function TrackingTimeline({ events }: TrackingTimelineProps) {
  if (!events || events.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
        <p className="text-sm text-gray-600 mb-2">No tracking events available</p>
        <p className="text-xs text-gray-500">
          Tracking details will appear here once 4PX updates the shipment status
        </p>
      </div>
    )
  }

  return (
    <div className="relative">
      <ol className="relative border-l-2 border-gray-200 pl-8 space-y-8">
        {events.map((event, index) => {
          const isLast = index === events.length - 1
          const isFirst = index === 0
          
          return (
            <li key={`${event.code}-${event.time}`} className="relative">
              {/* Timeline dot */}
              <span
                className={`absolute -left-[34px] top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                  isLast
                    ? 'bg-gray-900 border-gray-900'
                    : isFirst
                    ? 'bg-green-500 border-green-500'
                    : 'bg-white border-gray-400'
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    isLast || isFirst ? 'bg-white' : 'bg-gray-400'
                  }`}
                />
              </span>
              
              {/* Event content */}
              <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                  <div className="flex-1">
                    <p className="text-base font-semibold text-gray-900 mb-1">
                      {event.description}
                    </p>
                    {event.location && (
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {event.location}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      {formatEventTime(event.time)}
                    </p>
                    {event.code && (
                      <p className="text-xs text-gray-400 mt-1 font-mono">{event.code}</p>
                    )}
                  </div>
                </div>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

function formatEventTime(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
