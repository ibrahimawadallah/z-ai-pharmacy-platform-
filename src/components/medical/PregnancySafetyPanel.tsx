'use client'

import React from 'react'
import { AlertTriangle, Shield, Info } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface PregnancySafetyPanelProps {
  pregnancyCategory?: string | null
  pregnancyPrecautions?: string | null
  breastfeedingSafety?: string | null
}

const CATEGORY_INFO: Record<string, { label: string; color: string; bg: string; description: string }> = {
  'A': { 
    label: 'Category A', 
    color: 'bg-emerald-500 text-white', 
    bg: 'bg-emerald-50 dark:bg-emerald-950',
    description: 'No risk identified in controlled studies. Safe for use during pregnancy.'
  },
  'B': { 
    label: 'Category B', 
    color: 'bg-emerald-500 text-white', 
    bg: 'bg-emerald-50 dark:bg-emerald-950',
    description: 'No risk identified in animal studies. Human studies not available.'
  },
  'C': { 
    label: 'Category C', 
    color: 'bg-amber-500 text-white', 
    bg: 'bg-amber-50 dark:bg-amber-950',
    description: 'Risk cannot be ruled out. Use only if benefits outweigh risks.'
  },
  'D': { 
    label: 'Category D', 
    color: 'bg-orange-500 text-white', 
    bg: 'bg-orange-50 dark:bg-orange-950',
    description: 'Positive evidence of risk. Generally contraindicated in pregnancy.'
  },
  'X': { 
    label: 'Category X', 
    color: 'bg-red-500 text-white', 
    bg: 'bg-red-50 dark:bg-red-950',
    description: 'Contraindicated. Known risk to fetus. Do not use in pregnancy.'
  }
}

export function PregnancySafetyPanel({ 
  pregnancyCategory, 
  pregnancyPrecautions,
  breastfeedingSafety 
}: PregnancySafetyPanelProps) {
  const categoryInfo = pregnancyCategory ? CATEGORY_INFO[pregnancyCategory.toUpperCase()] : null

  return (
    <Card className="border border-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Shield className="w-5 h-5 text-cyan-500" />
          Pregnancy Safety
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!pregnancyCategory ? (
          <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
            <Info className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium">Data not available</p>
              <p className="text-xs text-muted-foreground mt-1">
                Consult external references (FDA, Micromedex) for pregnancy information.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <div className={`px-3 py-1.5 rounded-full font-semibold text-sm ${categoryInfo?.color || 'bg-gray-500 text-white'}`}>
                {categoryInfo?.label || pregnancyCategory}
              </div>
              {pregnancyCategory === 'A' || pregnancyCategory === 'B' ? (
                <Badge variant="outline" className="border-emerald-500 text-emerald-600">
                  <Shield className="w-3 h-3 mr-1" /> Generally Safe
                </Badge>
              ) : pregnancyCategory === 'X' ? (
                <Badge variant="destructive">
                  <AlertTriangle className="w-3 h-3 mr-1" /> Contraindicated
                </Badge>
              ) : null}
            </div>
            
            <div className={`p-4 rounded-lg ${categoryInfo?.bg}`}>
              <p className="text-sm">{categoryInfo?.description}</p>
            </div>

            {pregnancyPrecautions && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Precautions:</p>
                <p className="text-sm text-muted-foreground">{pregnancyPrecautions}</p>
              </div>
            )}
          </>
        )}

        {breastfeedingSafety && (
          <div className="pt-3 border-t border-border">
            <p className="text-sm font-medium mb-2">Breastfeeding:</p>
            <p className="text-sm text-muted-foreground">{breastfeedingSafety}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default PregnancySafetyPanel