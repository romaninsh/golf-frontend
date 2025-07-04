import React from 'react'
import { cn } from '@/lib/utils'

const LoadingSpinner = ({ className, size = 'default', ...props }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    default: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div
        className={cn(
          'animate-spin rounded-full border-4 border-gray-300 border-t-blue-600',
          sizeClasses[size],
          className
        )}
        {...props}
      />
    </div>
  )
}

export default LoadingSpinner
