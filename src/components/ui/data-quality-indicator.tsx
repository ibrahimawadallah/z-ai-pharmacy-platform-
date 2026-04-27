'use client'

import React from 'react'
import { AlertTriangle, CheckCircle, Info, Shield } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface DataQualityIndicatorProps {
  quality: {
    completeness: number
    tier: 'TIER_1' | 'TIER_2' | 'TIER_3'
    confidence: 'HIGH' | 'MEDIUM' | 'LOW'
    requiresVerification: boolean
  }
  showDetails?: boolean
}

export function DataQualityIndicator({ quality, showDetails = false }: DataQualityIndicatorProps) {
  const getTierConfig = () => {
    switch (quality.tier) {
      case 'TIER_1':
        return {
          icon: <CheckCircle className="w-4 h-4" />,
          label: 'Verified',
          description: 'Complete data verified from official sources',
          color: 'bg-green-100 text-green-800 border-green-200'
        }
      case 'TIER_2':
        return {
          icon: <Info className="w-4 h-4" />,
          label: 'Basic Info',
          description: 'Basic information verified, clinical data incomplete',
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
        }
      case 'TIER_3':
        return {
          icon: <AlertTriangle className="w-4 h-4" />,
          label: 'Limited Data',
          description: 'Limited data - requires professional verification',
          color: 'bg-red-100 text-red-800 border-red-200'
        }
    }
  }

  const config = getTierConfig()

  return (
    <div className="flex items-center gap-2">
      <Badge variant="outline" className={`${config.color} flex items-center gap-1`}>
        {config.icon}
        {config.label}
      </Badge>
      {showDetails && (
        <div className="text-xs text-muted-foreground">
          {quality.completeness}% complete
        </div>
      )}
      {quality.requiresVerification && (
        <div className="flex items-center gap-1 text-xs text-amber-600">
          <Shield className="w-3 h-3" />
          <span>Verify before use</span>
        </div>
      )}
    </div>
  )
}

export function DataQualityBanner({ quality }: { quality: any }) {
  if (quality.confidence === 'HIGH') return null

  return (
    <div className={`p-3 rounded-lg border ${
      quality.confidence === 'MEDIUM' 
        ? 'bg-yellow-50 border-yellow-200' 
        : 'bg-red-50 border-red-200'
    }`}>
      <div className="flex items-start gap-2">
        <AlertTriangle className={`w-4 h-4 mt-0.5 ${
          quality.confidence === 'MEDIUM' ? 'text-yellow-600' : 'text-red-600'
        }`} />
        <div className="flex-1">
          <p className="text-sm font-medium">
            {quality.confidence === 'MEDIUM' 
              ? 'Data Verification Required' 
              : 'Limited Data - Professional Verification Required'
            }
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {quality.confidence === 'MEDIUM'
              ? 'This drug has basic verified information but clinical data may be incomplete. Always verify with official drug references before clinical use.'
              : 'This drug has limited verified data. Do not use for clinical decision-making without verifying with official sources and consulting primary literature.'
            }
          </p>
        </div>
      </div>
    </div>
  )
}
