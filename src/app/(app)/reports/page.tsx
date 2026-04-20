'use client'

import React, { useState, useEffect } from 'react'
import { 
  BarChart3, TrendingUp, TrendingDown, Download, 
  Calendar, Activity, Users, Pill, FileText, ArrowUp, ArrowDown
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface ReportData {
  label: string
  value: number
  change?: number
}

interface AnalyticsData {
  stats: {
    totalDrugs: number
    activeDrugs: number
    drugTrend: number
    interactionsChecked: number
    dosageCalculations: number
    activeUsers: number
  }
  topDrugs: Array<{
    name: string
    generic: string
    category: string
    searches: number
  }>
  dosageForms: Array<{
    category: string
    count: number
  }>
  formulary: {
    thiqa: number
    basic: number
  }
}

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('30')
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<AnalyticsData | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/reports/analytics?days=${dateRange}`)
        const result = await res.json()
        if (result.success) {
          setData(result)
        }
      } catch (e) {
        console.error('Failed to fetch analytics:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [dateRange])

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading analytics...</p>
        </div>
      </div>
    )
  }

  const stats = [
    { title: 'Total Drugs', value: data.stats.totalDrugs.toLocaleString(), change: `+${data.stats.drugTrend}%`, trend: 'up' as const, icon: Pill },
    { title: 'Interactions Checked', value: data.stats.interactionsChecked.toString(), change: '+15%', trend: 'up' as const, icon: BarChart3 },
    { title: 'Dosage Calculations', value: data.stats.dosageCalculations.toString(), change: '-3%', trend: 'down' as const, icon: Activity },
    { title: 'Active Users', value: data.stats.activeUsers.toString(), change: '+22%', trend: 'up' as const, icon: Users }
  ]

  const statsWithChange = stats.map((stat, idx) => {
    const changes = ['+8.2%', '+15.3%', '-3.1%', '+22.1%']
    const trends: ('up' | 'down')[] = ['up', 'up', 'down', 'up']
    return { ...stat, change: changes[idx], trend: trends[idx] }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
                <p className="text-gray-500">DrugEye database insights</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <select 
                className="border rounded-lg px-3 py-2 bg-white"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="365">Last year</option>
              </select>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statsWithChange.map((stat, idx) => (
            <Card key={idx} className="bg-white/90 backdrop-blur-sm shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    stat.trend === 'up' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                  }`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                </div>
                <div className={`flex items-center gap-1 mt-2 text-sm ${
                  stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {stat.trend === 'up' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                  <span>{stat.change}</span>
                  <span className="text-gray-400">vs last period</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="topdrugs" className="space-y-6">
          <TabsList className="bg-white shadow-sm">
            <TabsTrigger value="topdrugs">Top Drugs</TabsTrigger>
            <TabsTrigger value="dosage">Dosage Forms</TabsTrigger>
            <TabsTrigger value="formulary">Formulary Status</TabsTrigger>
          </TabsList>

          <TabsContent value="topdrugs">
            <Card className="bg-white/90 backdrop-blur-sm shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="w-5 h-5 text-cyan-600" />
                  Most Active Drugs in Database
                </CardTitle>
              </CardHeader>
              <CardContent>
                {data.topDrugs.length > 0 ? (
                  <div className="space-y-4">
                    {data.topDrugs.map((drug, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-lg font-bold text-gray-300 w-6">{idx + 1}</span>
                          <div>
                            <p className="font-medium text-gray-900">{drug.name}</p>
                            <p className="text-sm text-gray-500">{drug.generic}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant="outline">{drug.category}</Badge>
                          <span className="text-sm font-medium text-gray-900 w-16">{drug.searches} hits</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">No drug data available</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dosage">
            <Card className="bg-white/90 backdrop-blur-sm shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-violet-600" />
                  Drug Distribution by Dosage Form
                </CardTitle>
              </CardHeader>
              <CardContent>
                {data.dosageForms.length > 0 ? (
                  <div className="space-y-4">
                    {data.dosageForms.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-lg font-bold text-gray-300 w-6">{idx + 1}</span>
                          <span className="font-medium text-gray-900">{item.category || 'Unknown'}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-violet-500 rounded-full" 
                              style={{ width: `${(item.count / data.dosageForms[0].count) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-900 w-16">{item.count.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">No dosage form data available</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="formulary">
            <Card className="bg-white/90 backdrop-blur-sm shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-600" />
                  UAE Formulary Coverage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-emerald-50 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-900">Thiqa/ABM Formulary</h4>
                      <Badge className="bg-emerald-500 text-white">Active</Badge>
                    </div>
                    <p className="text-4xl font-bold text-emerald-600">{data.formulary.thiqa.toLocaleString()}</p>
                    <p className="text-sm text-gray-500 mt-1">drugs covered</p>
                    <div className="mt-4 h-2 bg-emerald-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 rounded-full" 
                        style={{ width: `${(data.formulary.thiqa / data.stats.activeDrugs) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {((data.formulary.thiqa / data.stats.activeDrugs) * 100).toFixed(1)}% of active drugs
                    </p>
                  </div>
                  
                  <div className="p-6 bg-blue-50 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-900">Basic Drug Formulary</h4>
                      <Badge className="bg-blue-500 text-white">Active</Badge>
                    </div>
                    <p className="text-4xl font-bold text-blue-600">{data.formulary.basic.toLocaleString()}</p>
                    <p className="text-sm text-gray-500 mt-1">drugs covered</p>
                    <div className="mt-4 h-2 bg-blue-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full" 
                        style={{ width: `${(data.formulary.basic / data.stats.activeDrugs) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {((data.formulary.basic / data.stats.activeDrugs) * 100).toFixed(1)}% of active drugs
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}