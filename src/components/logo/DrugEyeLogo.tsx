'use client'

import React from 'react'

interface DrugEyeLogoProps {
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
  className?: string
  variant?: 'default' | 'glass'
}

export function DrugEyeLogo({ size = 'md', showIcon = true, className = '', variant = 'glass' }: DrugEyeLogoProps) {
  const sizes = {
    sm: { text: 'text-lg', icon: 'w-6 h-6' },
    md: { text: 'text-2xl', icon: 'w-8 h-8' },
    lg: { text: 'text-4xl', icon: 'w-12 h-12' }
  }

  if (variant === 'glass') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {showIcon && (
          <div
            className={`${sizes[size].icon} relative rounded-xl flex items-center justify-center overflow-hidden`}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(79, 209, 197, 0.3)',
              boxShadow: '0 0 20px rgba(79, 209, 197, 0.15), inset 0 0 20px rgba(255, 255, 255, 0.05)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-blue-600/20" />
            <svg viewBox="0 0 24 24" className="w-3/4 h-3/4 text-white relative z-10" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" />
              <circle cx="12" cy="12" r="3" fill="currentColor" />
              <path d="M4 8c2-2 5-3 8-3s6 1 8 3" strokeLinecap="round" />
            </svg>
          </div>
        )}
        
        <div className={`font-black italic tracking-tighter ${sizes[size].text} flex items-baseline`}>
          <span className="text-white">Drug</span>
          <span className="relative inline-flex items-baseline">
            <span className="relative text-white">
              e
              <svg className="absolute -top-1 left-0 w-full h-2" viewBox="0 0 10 4" preserveAspectRatio="none">
                <path d="M0 3c2-2 3-2 5-2s3 0 5 2" stroke="currentColor" strokeWidth="0.8" fill="none" strokeLinecap="round" className="text-cyan-400"/>
              </svg>
            </span>
            <span className="relative text-white">
              y
              <svg className="absolute -top-1 left-0 w-full h-2" viewBox="0 0 10 4" preserveAspectRatio="none">
                <path d="M0 3c2-2 3-2 5-2s3 0 5 2" stroke="currentColor" strokeWidth="0.8" fill="none" strokeLinecap="round" className="text-cyan-400"/>
              </svg>
            </span>
            <span className="relative text-white">
              e
              <svg className="absolute -top-1 left-0 w-full h-2" viewBox="0 0 10 4" preserveAspectRatio="none">
                <path d="M0 3c2-2 3-2 5-2s3 0 5 2" stroke="currentColor" strokeWidth="0.8" fill="none" strokeLinecap="round" className="text-cyan-400"/>
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
        <div
          className={`${sizes[size].icon} bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)]`}
        >
          <svg viewBox="0 0 24 24" className="w-3/4 h-3/4 text-white" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" />
            <circle cx="12" cy="12" r="3" fill="currentColor" />
            <path d="M4 8c2-2 5-3 8-3s6 1 8 3" strokeLinecap="round" />
          </svg>
        </div>
      )}
      
      <div className={`font-black italic tracking-tighter ${sizes[size].text} flex items-baseline`}>
        <span>Drug</span>
        <span className="relative inline-flex items-baseline">
          <span className="relative">
            e
            <svg className="absolute -top-1 left-0 w-full h-2" viewBox="0 0 10 4" preserveAspectRatio="none">
              <path d="M0 3c2-2 3-2 5-2s3 0 5 2" stroke="currentColor" strokeWidth="0.8" fill="none" strokeLinecap="round" className="text-cyan-400"/>
            </svg>
          </span>
          <span className="relative">
            y
            <svg className="absolute -top-1 left-0 w-full h-2" viewBox="0 0 10 4" preserveAspectRatio="none">
              <path d="M0 3c2-2 3-2 5-2s3 0 5 2" stroke="currentColor" strokeWidth="0.8" fill="none" strokeLinecap="round" className="text-cyan-400"/>
            </svg>
          </span>
          <span className="relative">
            e
            <svg className="absolute -top-1 left-0 w-full h-2" viewBox="0 0 10 4" preserveAspectRatio="none">
              <path d="M0 3c2-2 3-2 5-2s3 0 5 2" stroke="currentColor" strokeWidth="0.8" fill="none" strokeLinecap="round" className="text-cyan-400"/>
            </svg>
          </span>
        </span>
      </div>
    </div>
  )
}

export default DrugEyeLogo
