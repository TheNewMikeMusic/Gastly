'use client'

interface ProductPriceProps {
  variant?: 'hero' | 'inline' | 'card'
  showOriginal?: boolean
  className?: string
}

export function ProductPrice({ variant = 'hero', showOriginal = true, className = '' }: ProductPriceProps) {
  const originalPrice = 108 // 原价 $108
  const currentPrice = 78 // 现价 $78

  if (variant === 'hero') {
    return (
      <div className={`flex flex-col gap-4 sm:gap-5 ${className}`}>
        <div className="flex items-baseline gap-3 sm:gap-4 justify-center lg:justify-start">
          <span className="text-4xl sm:text-5xl font-display font-bold text-white tracking-tight">
            ${currentPrice}
          </span>
          {showOriginal && (
            <span className="text-xl sm:text-2xl font-body font-normal text-white/70 line-through">
              ${originalPrice}
            </span>
          )}
          <span className="text-base sm:text-lg font-body font-normal text-white/80">
            USD
          </span>
        </div>
        {showOriginal && (
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 justify-center lg:justify-start">
            <span className="text-sm font-body font-normal text-white/90">
              First 100 Units Special
            </span>
            <span className="text-sm font-body font-normal text-white/70">
              ·
            </span>
            <span className="text-sm font-body font-normal text-white/90">
              Save ${originalPrice - currentPrice}
            </span>
          </div>
        )}
      </div>
    )
  }

  if (variant === 'card') {
    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-display font-bold text-ghost-text-primary">
            ${currentPrice}
          </span>
          {showOriginal && (
            <span className="text-xl font-body font-medium text-ghost-text-muted line-through">
              ${originalPrice}
            </span>
          )}
        </div>
        {showOriginal && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-body font-normal text-ghost-text-secondary">
              First 100 Units Special
            </span>
            <span className="text-sm font-body font-normal text-ghost-text-muted">
              ·
            </span>
            <span className="text-sm font-body font-normal text-ghost-text-secondary">
              Save ${originalPrice - currentPrice}
            </span>
          </div>
        )}
      </div>
    )
  }

  // inline variant
  return (
    <span className={className}>
      <span className="font-bold text-base font-body text-ghost-text-primary">${currentPrice}</span>
      {showOriginal && (
        <>
          {' '}
          <span className="text-sm font-body font-normal text-ghost-text-muted line-through">${originalPrice}</span>
        </>
      )}
    </span>
  )
}

