'use client'

interface SectionBackgroundProps {
  variant?: 'default' | 'subtle'
  className?: string
}

export function SectionBackground({ variant = 'default', className = '' }: SectionBackgroundProps) {
  const opacity = variant === 'subtle' ? 0.03 : 0.05
  
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] blur-3xl"
        style={{
          background: `radial-gradient(circle, rgba(0, 122, 255, ${opacity}) 0%, transparent 70%)`,
        }}
      />
      <div 
        className="absolute bottom-0 right-0 w-[600px] h-[600px] blur-3xl"
        style={{
          background: `radial-gradient(circle, rgba(168, 85, 247, ${opacity}) 0%, transparent 70%)`,
        }}
      />
    </div>
  )
}

