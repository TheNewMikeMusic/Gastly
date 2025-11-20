'use client'

export function OrderListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="glass rounded-xl p-6 animate-pulse border border-gray-200"
        >
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-5 w-32 bg-gray-200 rounded" />
                <div className="h-6 w-20 bg-gray-200 rounded-full" />
              </div>
              <div className="h-6 w-24 bg-gray-200 rounded" />
              <div className="h-4 w-48 bg-gray-200 rounded" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-4 w-40 bg-gray-200 rounded" />
                <div className="h-4 w-40 bg-gray-200 rounded" />
              </div>
            </div>
            <div className="h-10 w-24 bg-gray-200 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function StatCardSkeleton() {
  return (
    <div className="glass rounded-xl p-4 text-center animate-pulse">
      <div className="h-8 w-16 bg-gray-200 rounded mx-auto mb-2" />
      <div className="h-4 w-20 bg-gray-200 rounded mx-auto" />
    </div>
  )
}

export function FormSkeleton() {
  return (
    <div className="glass rounded-2xl p-6 sm:p-8 space-y-6 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 w-24 bg-gray-200 rounded" />
          <div className="h-12 w-full bg-gray-200 rounded-xl" />
        </div>
      ))}
    </div>
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="glass rounded-xl overflow-hidden animate-pulse">
      <div className="p-4 border-b border-gray-200">
        <div className="h-5 w-32 bg-gray-200 rounded" />
      </div>
      <div className="divide-y divide-gray-200">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 grid grid-cols-4 gap-4">
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}

