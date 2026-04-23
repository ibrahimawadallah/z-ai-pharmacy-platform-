'use client'

import * as React from 'react'
import { LogoMark } from './LogoMark'

interface DrugEyeLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  priority?: boolean
  /**
   * Kept for backwards compatibility with the previous API.
   * The official logo PNG already contains the wordmark and tagline, so the
   * three props below no longer affect rendering.
   */
  showIcon?: boolean
  showWordmark?: boolean
  showTagline?: boolean
  layout?: 'horizontal' | 'vertical'
  variant?: 'default' | 'glass' | 'mono-light' | 'mono-dark'
}

const sizeMap = {
  sm: 'h-10 w-auto',
  md: 'h-14 w-auto',
  lg: 'h-20 w-auto',
  xl: 'h-28 w-auto',
} as const

export function DrugEyeLogo({
  size = 'md',
  className = '',
  priority = false,
}: DrugEyeLogoProps) {
  return (
    <LogoMark
      priority={priority}
      className={`${sizeMap[size]} object-contain ${className}`}
    />
  )
}

export default DrugEyeLogo
