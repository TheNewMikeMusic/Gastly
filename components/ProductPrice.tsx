'use client'

interface ProductPriceProps {
  variant?: 'hero' | 'inline' | 'card'
  showOriginal?: boolean
  className?: string
}

export function ProductPrice({ variant = 'hero', showOriginal = true, className = '' }: ProductPriceProps) {
  const originalPrice = 199 // 原价 $199
  const earlyBirdPrice = 99 // 前100台特价 $99

  if (variant === 'hero') {
    return (
      <div className={`flex flex-col gap-4 sm:gap-5 ${className}`}>
        <div className="flex items-baseline gap-3 sm:gap-4 justify-center lg:justify-start">
          <span className="text-apple-display font-apple-semibold text-[#1d1d1f] tracking-tight">
            ${earlyBirdPrice}
          </span>
          {showOriginal && (
            <span className="text-apple-headline font-apple-normal text-[#86868b] line-through">
              ${originalPrice}
            </span>
          )}
          <span className="text-apple-title font-apple-normal text-[#6e6e73]">
            USD
          </span>
        </div>
        {showOriginal && (
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 justify-center lg:justify-start">
            <span className="text-apple-caption font-apple-normal text-[#6e6e73]">
              First 100 Units Special
            </span>
            <span className="text-apple-caption font-apple-normal text-[#6e6e73]">
              ·
            </span>
            <span className="text-apple-caption font-apple-normal text-[#6e6e73]">
              Save ${originalPrice - earlyBirdPrice}
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
          <span className="text-apple-display font-apple-semibold text-gray-900">
            ${earlyBirdPrice}
          </span>
          {showOriginal && (
            <span className="text-apple-headline-sm font-apple-medium text-gray-400 line-through">
              ${originalPrice}
            </span>
          )}
        </div>
        {showOriginal && (
          <div className="flex items-center gap-2">
            <span className="text-apple-footnote font-apple-normal text-[#6e6e73]">
              First 100 Units Special
            </span>
            <span className="text-apple-footnote font-apple-normal text-[#6e6e73]">
              ·
            </span>
            <span className="text-apple-caption font-apple-normal text-[#6e6e73]">
              Save ${originalPrice - earlyBirdPrice}
            </span>
          </div>
        )}
      </div>
    )
  }

  // inline variant
  return (
    <span className={className}>
      <span className="font-apple-semibold text-apple-body">${earlyBirdPrice}</span>
      {showOriginal && (
        <>
          {' '}
          <span className="text-apple-caption font-apple-normal text-gray-400 line-through">${originalPrice}</span>
        </>
      )}
    </span>
  )
}

