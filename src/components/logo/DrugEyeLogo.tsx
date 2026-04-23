'use client'

import * as React from 'react'
import { LogoMark, type LogoMarkTone } from './LogoMark'

interface DrugEyeLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showIcon?: boolean
  showWordmark?: boolean
  /** Stack the wordmark + tagline below the mark instead of beside it. */
  layout?: 'horizontal' | 'vertical'
  /** Show the "Intelligence" tagline under the wordmark. */
  showTagline?: boolean
  className?: string
  variant?: 'default' | 'glass' | 'mono-light' | 'mono-dark'
}

const sizeMap = {
  sm: {
    text: 'text-lg',
    tagline: 'text-[0.7rem] tracking-[0.18em]',
    icon: 'w-9 h-6',
    gap: 'gap-2',
    stackGap: 'gap-1.5',
  },
  md: {
    text: 'text-2xl',
    tagline: 'text-[0.8rem] tracking-[0.2em]',
    icon: 'w-12 h-8',
    gap: 'gap-2.5',
    stackGap: 'gap-2',
  },
  lg: {
    text: 'text-4xl',
    tagline: 'text-sm tracking-[0.22em]',
    icon: 'w-20 h-[3.3rem]',
    gap: 'gap-4',
    stackGap: 'gap-3',
  },
  xl: {
    text: 'text-6xl',
    tagline: 'text-lg tracking-[0.24em]',
    icon: 'w-32 h-[5.3rem]',
    gap: 'gap-5',
    stackGap: 'gap-4',
  },
} as const

export function DrugEyeLogo({
  size = 'md',
  showIcon = true,
  showWordmark = true,
  showTagline = false,
  layout = 'horizontal',
  className = '',
  variant = 'default',
}: DrugEyeLogoProps) {
  const s = sizeMap[size]

  const tone: LogoMarkTone =
    variant === 'mono-light'
      ? 'mono-light'
      : variant === 'mono-dark'
        ? 'mono-dark'
        : 'brand'

  const isGlass = variant === 'glass'
  const isMonoDark = variant === 'mono-dark' || isGlass
  const isMonoLight = variant === 'mono-light'

  const drugTone = isMonoLight
    ? 'text-slate-900'
    : isMonoDark
      ? 'text-white'
      : 'text-teal-800'
  const eyeTone = isMonoLight
    ? 'text-slate-900'
    : isMonoDark
      ? 'text-cyan-200'
      : 'text-teal-500'
  const taglineTone = isMonoLight
    ? 'text-slate-700'
    : isMonoDark
      ? 'text-orange-300'
      : 'text-orange-500'

  const containerLayout =
    layout === 'vertical'
      ? `flex flex-col items-center ${s.stackGap}`
      : `inline-flex items-center ${s.gap}`

  return (
    <div className={`${containerLayout} ${className}`}>
      {showIcon && (
        <LogoMark tone={tone} className={`${s.icon} shrink-0`} />
      )}

      {showWordmark && (
        <div
          className={
            layout === 'vertical'
              ? 'flex flex-col items-center'
              : 'flex flex-col'
          }
        >
          <span
            className={`font-extrabold tracking-tight leading-none select-none ${s.text}`}
          >
            <span className={drugTone}>Drug</span>
            <span className={eyeTone}>Eye</span>
          </span>
          {showTagline && (
            <span
              className={`mt-1 font-semibold uppercase ${s.tagline} ${taglineTone}`}
            >
              Intelligence
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default DrugEyeLogo
