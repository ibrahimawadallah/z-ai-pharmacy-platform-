'use client'

import React from 'react'
import Image from 'next/image'

const sizeMap = {
  sm: { width: 24, height: 24, text: 'text-lg' },
  md: { width: 32, height: 32, text: 'text-2xl' },
  lg: { width: 48, height: 48, text: 'text-4xl' }
}

interface DrugEyeLogoProps {
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
  className?: string
  variant?: 'default' | 'glass'
}

export function DrugEyeLogo({ size = 'md', showIcon = true, className = '', variant = 'glass' }: DrugEyeLogoProps) {
  const s = sizeMap[size]

  if (variant === 'glass') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {showIcon && (
          <Image
            src="/drugeye-new.png"
            alt="DrugEye"
            width={s.width}
            height={s.height}
            className="rounded-xl shrink-0"
            priority
          />
        )}
        
        <div className="font-black italic tracking-tighter flex items-baseline">
          <span className={`${s.text} text-cyan-500`}>Drug</span>
          <span className={`relative inline-flex items-baseline ml-1 text-xs mt-1 text-slate-500 dark:text-slate-400`}>
            <span className="relative">
              e
              <svg className="absolute -top-2 left-0 w-[140%] -ml-[20%] h-3" viewBox="0 0 24 8" preserveAspectRatio="none">
                <path d="M2 5 Q8 2 12 3 Q16 4 22 5" stroke="black" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
              </svg>
            </span>
            <span>y</span>
            <span className="relative">
              e
              <svg className="absolute -top-2 left-0 w-[140%] -ml-[20%] h-3" viewBox="0 0 24 8" preserveAspectRatio="none">
                <path d="M2 5 Q8 2 12 3 Q16 4 22 5" stroke="black" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
              </svg>
            </span>
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showIcon && (
        <Image
          src="/drugeye-new.png"
          alt="DrugEye"
          width={s.width}
          height={s.height}
          className="rounded-xl shrink-0"
          priority
        />
      )}
      
      <div className="font-black italic tracking-tighter flex items-baseline">
        <span className={`${s.text} text-cyan-500`}>Drug</span>
        <span className={`relative inline-flex items-baseline ml-1 text-xs mt-1 text-slate-500 dark:text-slate-400`}>
          <span className="relative">
            e
            <svg className="absolute -top-2 left-0 w-[140%] -ml-[20%] h-3" viewBox="0 0 24 8" preserveAspectRatio="none">
              <path d="M2 5 Q8 2 12 3 Q16 4 22 5" stroke="black" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            </svg>
          </span>
          <span>y</span>
          <span className="relative">
            e
            <svg className="absolute -top-2 left-0 w-[140%] -ml-[20%] h-3" viewBox="0 0 24 8" preserveAspectRatio="none">
              <path d="M2 5 Q8 2 12 3 Q16 4 22 5" stroke="black" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            </svg>
          </span>
        </span>
      </div>
    </div>
  )
}

export default DrugEyeLogo
