'use client'

import { motion } from 'framer-motion'

interface FormErrorProps {
  error?: string | null
  className?: string
}

export function FormError({ error, className = '' }: FormErrorProps) {
  if (!error) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass rounded-xl p-4 border border-red-200 bg-red-50/50 ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="text-red-600 text-xl">⚠️</div>
        <p className="text-sm text-red-600 font-medium flex-1">{error}</p>
      </div>
    </motion.div>
  )
}

interface FormSuccessProps {
  message?: string | null
  className?: string
}

export function FormSuccess({ message, className = '' }: FormSuccessProps) {
  if (!message) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass rounded-xl p-4 border border-green-200 bg-green-50/50 ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="text-green-600 text-xl">✓</div>
        <p className="text-sm text-green-600 font-medium flex-1">{message}</p>
      </div>
    </motion.div>
  )
}

