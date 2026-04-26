'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Search, Pill, AlertTriangle, Users, FileText, 
  Activity, TrendingUp, Clock, CheckCircle, ArrowRight,
  Brain, BarChart3, BookOpen, Settings, Bell, LogOut
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

interface Stats {
  totalDrugs: number
  activeInteractions: number
  totalPatients: number
  recentSearches: number
}

interface RecentDrug {
  id: string
  packageName: string
  genericName: string
  strength: string
  dosageForm: string
}

interface Alert {
  id: string
  type: 'warning' | 'info' | 'recall'
  title: string
  date: string
  read: boolean
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalDrugs: 0,
    activeInteractions: 0,
    totalPatients: 0,
    recentSearches: 0
  })
  const [recentDrugs, setRecentDrugs] = useState<RecentDrug[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, drugsRes, alertsRes] = await Promise.all([
          fetch('/api/drugs/stats'),
          fetch('/api/drugs/search?q=&limit=5'),
          fetch('/api/alerts/moh')
        ])
        
        const statsData = await statsRes.json()
        const drugsData = await drugsRes.json()
        
        setStats({
          totalDrugs: statsData.statistics?.total || 0,
          activeInteractions: statsData.dashboard?.activeInteractions || 0,
          totalPatients: 0,
          recentSearches: statsData.dashboard?.recentSearches || 0
        })
        
        setRecentDrugs(drugsData.data?.slice(0, 5) || [])
        setAlerts([
          { id: '1', type: 'warning', title: 'Drug Interaction Update: Warfarin + Aspirin', date: '2026-04-14', read: false },
          { id: '2', type: 'recall', title: 'Voluntary Recall: Certain Metformin batches', date: '2026-04-13', read: false },
          { id: '3', type: 'info', title: 'New Guidelines: Antibiotic Prescribing', date: '2026-04-12', read: true }
        ])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const quickActions = [
    { icon: Search, label: 'Search Drug', href: '/search', color: 'bg-cyan-100 text-cyan-600' },
    { icon: AlertTriangle, label: 'Check Interactions', href: '/interactions', color: 'bg-amber-100 text-amber-600' },
    { icon: Pill, label: 'Dosage Calculator', href: '/dosage', color: 'bg-violet-100 text-violet-600' },
    { icon: Users, label: 'Patient Records', href: '/patients', color: 'bg-emerald-100 text-emerald-600' },
    { icon: FileText, label: 'Prescriptions', href: '/prescriptions', color: 'bg-rose-100 text-rose-600' },
    { icon: Brain, label: 'AI Consultation', href: '/consultation', color: 'bg-blue-100 text-blue-600' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Clinical Dashboard</h1>
              <p className="text-gray-500 mt-1">Welcome back! Here's your daily overview.</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">2</span>
              </Button>
              <Button variant="outline" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/90 backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Drugs</p>
                  <p className="text-3xl font-bold text-cyan-600 mt-1">{stats.totalDrugs.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center">
                  <Pill className="w-6 h-6 text-cyan-600" />
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-3">UAE MOH Approved</p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Interactions</p>
                  <p className="text-3xl font-bold text-amber-600 mt-1">{stats.activeInteractions}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-amber-600" />
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-3">Checked today</p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Patients</p>
                  <p className="text-3xl font-bold text-emerald-600 mt-1">{stats.totalPatients}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <Users className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-3">Active records</p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Searches</p>
                  <p className="text-3xl font-bold text-violet-600 mt-1">{stats.recentSearches}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center">
                  <Search className="w-6 h-6 text-violet-600" />
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-3">This session</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-md mb-8">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {quickActions.map((action, idx) => (
                <Link key={idx} href={action.href}>
                  <div className="flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group">
                    <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                      <action.icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-medium text-gray-700 text-center">{action.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Drugs */}
          <Card className="bg-white/90 backdrop-blur-sm shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg font-semibold">Recent Drug Searches</CardTitle>
              <Link href="/search">
                <Button variant="ghost" size="sm" className="text-cyan-600 hover:text-cyan-700">
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-gray-500">Loading...</div>
              ) : recentDrugs.length > 0 ? (
                <div className="space-y-3">
                  {recentDrugs.map((drug) => (
                    <div key={drug.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center">
                          <Pill className="w-5 h-5 text-cyan-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{drug.packageName}</p>
                          <p className="text-sm text-gray-500">{drug.genericName} • {drug.strength}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">{drug.dosageForm}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No recent searches</p>
                  <Link href="/search">
                    <Button variant="outline" size="sm" className="mt-3">Search Drugs</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Alerts */}
          <Card className="bg-white/90 backdrop-blur-sm shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg font-semibold">Safety Alerts</CardTitle>
              <Link href="/adr">
                <Button variant="ghost" size="sm" className="text-cyan-600 hover:text-cyan-700">
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {alerts.length > 0 ? (
                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <div key={alert.id} className={`flex items-start gap-3 p-3 rounded-lg ${alert.read ? 'bg-gray-50' : 'bg-amber-50 border border-amber-200'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        alert.type === 'recall' ? 'bg-red-100 text-red-600' :
                        alert.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {alert.type === 'recall' ? <AlertTriangle className="w-4 h-4" /> :
                         alert.type === 'warning' ? <AlertTriangle className="w-4 h-4" /> :
                         <Bell className="w-4 h-4" />}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${alert.read ? 'text-gray-600' : 'text-gray-900'}`}>{alert.title}</p>
                        <p className="text-xs text-gray-400 mt-1">{alert.date}</p>
                      </div>
                      {!alert.read && <Badge className="bg-amber-500 text-white text-xs">New</Badge>}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No active alerts</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Drug Database Quick Search */}
        <Card className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white mt-8">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold">Search UAE Drug Database</h3>
                <p className="text-cyan-100 mt-1">Access {stats.totalDrugs.toLocaleString()}+ approved medications instantly</p>
              </div>
              <div className="flex w-full lg:w-auto gap-3">
                <Input 
                  placeholder="Enter drug name, generic, or code..." 
                  className="bg-white/20 border-white/30 text-white placeholder:text-cyan-200 lg:w-80"
                />
                <Link href="/search">
                  <Button className="bg-white text-cyan-600 hover:bg-cyan-50">
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}