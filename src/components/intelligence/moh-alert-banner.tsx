'use client'

import React, { useEffect, useState } from 'react'
import { AlertTriangle, TrendingDown, DollarSign, Ban, FileWarning, ExternalLink } from 'lucide-react'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'

export type MohAlert = {
  id: string
  title: string
  description: string
  alertType: 'recall' | 'price_change' | 'shortage' | 'safety_warning'
  severity: 'high' | 'medium' | 'low'
  sourceUrl?: string
  publishedAt: string
}

export function MohAlertBanner() {
  const [alerts, setAlerts] = useState<MohAlert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/alerts/moh?limit=3')
      .then(res => res.json())
      .then(data => {
        if (data.alerts) setAlerts(data.alerts)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading || alerts.length === 0) return null

  const getAlertIcon = (type: string, severity: string) => {
    if (type === 'recall' || severity === 'high') return <Ban className="h-5 w-5 text-red-600" />
    if (type === 'price_change') return <DollarSign className="h-5 w-5 text-blue-600" />
    if (type === 'shortage') return <TrendingDown className="h-5 w-5 text-amber-600" />
    return <FileWarning className="h-5 w-5 text-orange-600" />
  }

  const getAlertStyles = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900'
      case 'medium': return 'bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900'
      case 'low': return 'bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-900'
      default: return 'bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800'
    }
  }

  return (
    <div className="space-y-3 mb-6">
      {alerts.map((alert) => (
        <Alert key={alert.id} className={`rounded-xl border-2 shadow-sm ${getAlertStyles(alert.severity)}`}>
          {getAlertIcon(alert.alertType, alert.severity)}
          <AlertTitle className="flex items-center gap-3 font-bold text-slate-900 dark:text-slate-100">
            {alert.title}
            <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-bold">
              {alert.alertType.replace('_', ' ')}
            </Badge>
          </AlertTitle>
          <AlertDescription className="text-slate-700 dark:text-slate-300 text-sm mt-1.5 flex justify-between items-start">
            <span>{alert.description}</span>
            {alert.sourceUrl && (
              <a 
                href={alert.sourceUrl} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 shrink-0 ml-4 bg-white/50 dark:bg-slate-950/50 px-2 py-1 rounded-md"
              >
                MOH Circular <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </AlertDescription>
        </Alert>
      ))}
    </div>
  )
}
