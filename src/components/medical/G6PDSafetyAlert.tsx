'use client'

import React from 'react'
import { AlertTriangle, AlertCircle, Shield, Info } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface G6PDSafetyAlertProps {
  g6pdSafety?: string | null
  g6pdWarning?: string | null
}

export function G6PDSafetyAlert({ g6pdSafety, g6pdWarning }: G6PDSafetyAlertProps) {
  const isSafe = g6pdSafety?.toLowerCase() === 'safe'
  const isContraindicated = g6pdSafety?.toLowerCase() === 'contraindicated' || g6pdSafety?.toLowerCase() === 'avoid'
  const isCaution = g6pdSafety?.toLowerCase() === 'caution'

  return (
    <Card className={`border ${isContraindicated ? 'border-red-500 dark:border-red-500' : isCaution ? 'border-amber-500 dark:border-amber-500' : 'border-border'}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <span className={`${isContraindicated ? 'text-red-500' : isCaution ? 'text-amber-500' : 'text-cyan-500'}`}>
            {isSafe ? <Shield className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          </span>
          G6PD Safety
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {!g6pdSafety ? (
          <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
            <Info className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium">No G6PD data available</p>
              <p className="text-xs text-muted-foreground mt-1">
                Exercise caution. Consult external references for G6PD-deficient patients.
              </p>
            </div>
          </div>
        ) : isContraindicated ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge className="bg-red-500 text-white">
                <AlertTriangle className="w-3 h-3 mr-1" /> Contraindicated
              </Badge>
              <span className="text-sm font-medium text-red-600">Not Safe for G6PD Deficient Patients</span>
            </div>
            
            <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-red-700 dark:text-red-300">
                    May cause hemolytic anemia
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {g6pdWarning || "This medication is contraindicated for patients with G6PD deficiency. Hemolytic anemia may occur when administered to G6PD-deficient individuals."}
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              Alternative medications may be considered. Consult clinical guidelines.
            </p>
          </div>
        ) : isCaution ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge className="bg-amber-500 text-white">
                <AlertTriangle className="w-3 h-3 mr-1" /> Use with Caution
              </Badge>
            </div>
            
            <div className="p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
              {g6pdWarning && (
                <p className="text-sm text-muted-foreground">{g6pdWarning}</p>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-500 text-white">
                <Shield className="w-3 h-3 mr-1" /> Generally Safe
              </Badge>
            </div>
            
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-lg">
              <p className="text-sm text-muted-foreground">
                {g6pdWarning || 'No known G6PD-related restrictions. Generally considered safe for patients with G6PD deficiency.'}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default G6PDSafetyAlert