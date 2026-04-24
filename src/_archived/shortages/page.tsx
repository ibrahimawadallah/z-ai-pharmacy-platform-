'use client'

import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  TrendingDown, Search, AlertTriangle, Bell, Clock
} from 'lucide-react'

interface ShortageItem {
  id: string
  drugName: string
  manufacturer: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  expectedResolution: string
  alternatives: string[]
}

export default function ShortagesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [shortages] = useState<ShortageItem[]>([
    { id: '1', drugName: 'Amoxicillin 500mg', manufacturer: 'Generic Pharma', severity: 'high', expectedResolution: '2 weeks', alternatives: ['Ampicillin', 'Cefuroxime'] },
    { id: '2', drugName: 'Metformin 1000mg', manufacturer: 'Sun Pharma', severity: 'medium', expectedResolution: '1 week', alternatives: ['Glipizide'] },
  ])
  const loading = false

  const filteredShortages = shortages.filter(s => 
    s.drugName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const severityColors: Record<string, string> = {
    'critical': 'bg-red-500 text-white border-red-600 hover:bg-red-600',
    'high': 'bg-orange-500 text-white border-orange-600 hover:bg-orange-600',
    'medium': 'bg-amber-500 text-white border-amber-600 hover:bg-amber-600',
    'low': 'bg-emerald-500 text-white border-emerald-600 hover:bg-emerald-600',
  }

  const severityCardColors: Record<string, string> = {
    'critical': 'from-red-50 to-red-100 dark:from-red-950/50 dark:to-red-900/50 border-red-200 dark:border-red-800',
    'high': 'from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/50 border-orange-200 dark:border-orange-800',
    'medium': 'from-amber-50 to-amber-100 dark:from-amber-950/50 dark:to-amber-900/50 border-amber-200 dark:border-amber-800',
    'low': 'from-emerald-50 to-emerald-100 dark:from-emerald-950/50 dark:to-emerald-900/50 border-emerald-200 dark:border-emerald-800',
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="px-6 py-5 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-xs">Supply Chain</Badge>
          </div>
          <h1 className="text-xl font-semibold">Drug Shortages</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time UAE drug shortage monitoring with alternatives
          </p>
        </div>
      </div>

      <div className="px-6 py-8 max-w-7xl mx-auto">
        {/* Search */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search shortage reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10"
                />
              </div>
              <Button className="h-10">
                <Bell className="w-4 h-4 mr-2" />
                Alert
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/50 border-orange-200 dark:border-orange-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-500/20">
                  <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{shortages.length}</div>
                  <div className="text-xs text-muted-foreground">Active Shortages</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/50 dark:to-red-900/50 border-red-200 dark:border-red-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500/20">
                  <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {shortages.filter(s => s.severity === 'critical').length}
                  </div>
                  <div className="text-xs text-muted-foreground">Critical</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/50 dark:to-amber-900/50 border-amber-200 dark:border-amber-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/20">
                  <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {shortages.filter(s => s.severity === 'high').length}
                  </div>
                  <div className="text-xs text-muted-foreground">High Priority</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/50 dark:to-emerald-900/50 border-emerald-200 dark:border-emerald-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/20">
                  <Search className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {shortages.reduce((sum, s) => sum + s.alternatives.length, 0)}
                  </div>
                  <div className="text-xs text-muted-foreground">Alternatives</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Shortage List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map(i => <div key={i} className="h-32 rounded-lg bg-muted animate-pulse" />)}
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Shortage Reports</h2>
            {filteredShortages.map((item, i) => (
              <Card key={item.id} className={`bg-gradient-to-br ${severityCardColors[item.severity]} border hover:shadow-md transition-shadow`}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{item.drugName}</h3>
                        <Badge className={severityColors[item.severity]}>
                          {item.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.manufacturer}</p>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {item.expectedResolution}
                      </div>
                      <div className="flex gap-2">
                        {item.alternatives.map((alt, ai) => (
                          <Badge key={ai} variant="outline" className="bg-white/50 border-current">
                            {alt}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
