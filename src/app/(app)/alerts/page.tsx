'use client'

import React, { useState, useEffect } from 'react'
import { 
  Bell, AlertTriangle, Info, CheckCircle, Search, Calendar, RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

interface MohAlert {
  id: string
  title: string
  description: string
  alertType: string
  severity: string
  publishedAt: Date
  isActive: boolean
  sourceUrl?: string
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<MohAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await fetch('/api/alerts/moh?limit=50')
        const data = await res.json()
        
        if (data.alerts && data.alerts.length > 0) {
          setAlerts(data.alerts)
          setUnreadCount(data.alerts.filter((a: MohAlert) => a.isActive).length)
        } else {
          setAlerts([])
        }
      } catch (e) {
        console.error('Failed to fetch alerts:', e)
        setAlerts([])
      } finally {
        setLoading(false)
      }
    }
    fetchAlerts()
  }, [])

  const getAlertIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'recall': return <AlertTriangle className="w-5 h-5 text-red-500" />
      case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-500" />
      case 'info': return <Info className="w-5 h-5 text-blue-500" />
      default: return <Bell className="w-5 h-5 text-gray-500" />
    }
  }

  const getAlertColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'recall': return 'bg-red-50 border-red-200'
      case 'warning': return 'bg-amber-50 border-amber-200'
      case 'info': return 'bg-blue-50 border-blue-200'
      default: return 'bg-gray-50 border-gray-200'
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return <Badge className="bg-red-500 text-white">Critical</Badge>
      case 'high': return <Badge className="bg-orange-500 text-white">High</Badge>
      case 'medium': return <Badge className="bg-amber-500 text-white">Medium</Badge>
      default: return <Badge variant="outline">Low</Badge>
    }
  }

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || alert.alertType?.toLowerCase() === filterType
    return matchesSearch && matchesType
  })

  const alertTypes = ['all', 'recall', 'warning', 'info', 'update']

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-red-500 flex items-center justify-center">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Safety Alerts Center</h1>
                <p className="text-gray-500">UAE Ministry of Health Drug Alerts</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => window.location.reload()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white/90 backdrop-blur-sm shadow-sm">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{alerts.length}</p>
              <p className="text-sm text-gray-500">Total Alerts</p>
            </CardContent>
          </Card>
          <Card className="bg-white/90 backdrop-blur-sm shadow-sm">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-red-500">{alerts.filter(a => a.alertType === 'recall').length}</p>
              <p className="text-sm text-gray-500">Recalls</p>
            </CardContent>
          </Card>
          <Card className="bg-white/90 backdrop-blur-sm shadow-sm">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-amber-500">{alerts.filter(a => a.alertType === 'warning').length}</p>
              <p className="text-sm text-gray-500">Warnings</p>
            </CardContent>
          </Card>
          <Card className="bg-white/90 backdrop-blur-sm shadow-sm">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-cyan-500">{unreadCount}</p>
              <p className="text-sm text-gray-500">Active</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-md mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input 
                  placeholder="Search alerts..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {alertTypes.map(type => (
                  <Button
                    key={type}
                    variant={filterType === type ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterType(type)}
                    className="capitalize"
                  >
                    {type === 'all' ? 'All' : type}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alert List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading alerts...</div>
          ) : filteredAlerts.length === 0 ? (
            <Card className="bg-white/90 backdrop-blur-sm shadow-md">
              <CardContent className="p-12 text-center">
                <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <p className="text-gray-500 text-lg">No alerts found</p>
                {alerts.length === 0 && (
                  <p className="text-sm text-gray-400 mt-2">No alerts in database. Add alerts via admin API.</p>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredAlerts.map(alert => (
              <Card 
                key={alert.id} 
                className={`${getAlertColor(alert.alertType || 'info')} ${!alert.isActive ? 'opacity-60' : ''} transition-all hover:shadow-md`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                      {getAlertIcon(alert.alertType || 'info')}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                            {getSeverityBadge(alert.severity)}
                          </div>
                          <p className="text-sm text-gray-600">{alert.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {alert.publishedAt ? new Date(alert.publishedAt).toLocaleDateString() : 'N/A'}
                        </span>
                        <Badge variant="outline" className="text-xs capitalize">
                          {alert.alertType || 'info'}
                        </Badge>
                        {alert.sourceUrl && (
                          <a href={alert.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:underline flex items-center gap-1">
                            Source <Info className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {alerts.length > 0 && (
          <p className="text-center text-sm text-gray-400 mt-6">
            Showing {filteredAlerts.length} of {alerts.length} alerts from UAE MOH database
          </p>
        )}
      </div>
    </div>
  )
}