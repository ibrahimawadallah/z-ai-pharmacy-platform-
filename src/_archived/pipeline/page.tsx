'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Microscope, Globe, Calendar, Rocket, TrendingUp } from 'lucide-react'

export default function PipelinePage() {
  const pipelineData = [
    { drugName: 'Donanemab', indication: 'Alzheimer\'s Disease', company: 'Eli Lilly', status: 'Under Review', expectedApproval: 'Q3 2024', region: 'UAE (MOHAP)', statusColor: 'amber' },
    { drugName: 'Tirzepatide', indication: 'Weight Management', company: 'Eli Lilly', status: 'Recently Approved', expectedApproval: 'Q1 2024', region: 'GCC Region', statusColor: 'emerald' },
    { drugName: 'Resmetirom', indication: 'MASH/NASH', company: 'Madrigal', status: 'Pending', expectedApproval: 'Q4 2024', region: 'UAE', statusColor: 'cyan' },
    { drugName: 'Aficamten', indication: 'Hypertrophic Cardiomyopathy', company: 'Cytokinetics', status: 'Phase III', expectedApproval: '2025', region: 'Global', statusColor: 'purple' },
  ]

  const statusColors: Record<string, string> = {
    'emerald': 'bg-emerald-500 text-white border-emerald-600 hover:bg-emerald-600',
    'amber': 'bg-amber-500 text-white border-amber-600 hover:bg-amber-600',
    'cyan': 'bg-cyan-500 text-white border-cyan-600 hover:bg-cyan-600',
    'purple': 'bg-purple-500 text-white border-purple-600 hover:bg-purple-600',
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="px-6 py-5 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-xs">Drug Development</Badge>
          </div>
          <h1 className="text-xl font-semibold">Pharma Pipeline</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Upcoming drug approvals and regulatory status in UAE and GCC region
          </p>
        </div>
      </div>

      <div className="px-6 py-8 max-w-7xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50 border-purple-200 dark:border-purple-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <Rocket className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{pipelineData.length}</div>
                  <div className="text-xs text-muted-foreground">In Pipeline</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/50 dark:to-emerald-900/50 border-emerald-200 dark:border-emerald-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/20">
                  <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {pipelineData.filter(p => p.status === 'Recently Approved').length}
                  </div>
                  <div className="text-xs text-muted-foreground">Approved</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/50 dark:to-amber-900/50 border-amber-200 dark:border-amber-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/20">
                  <Calendar className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {pipelineData.filter(p => p.status === 'Under Review').length}
                  </div>
                  <div className="text-xs text-muted-foreground">Under Review</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-950/50 dark:to-cyan-900/50 border-cyan-200 dark:border-cyan-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/20">
                  <Globe className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">12</div>
                  <div className="text-xs text-muted-foreground">Companies</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pipeline List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Drug Pipeline</h2>
          {pipelineData.map((item, i) => (
            <Card key={item.drugName} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-purple-500/10">
                        <Microscope className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <h3 className="text-lg font-semibold">{item.drugName}</h3>
                      <Badge className={statusColors[item.statusColor]}>
                        {item.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.company} • {item.indication}</p>
                  </div>
                  
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Globe className="w-4 h-4" />
                      {item.region}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {item.expectedApproval}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
