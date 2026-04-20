'use client'

import { useState, useEffect } from 'react'
import { VoiceDrugSearch } from './VoiceDrugSearch'
import { BarcodeScanner } from './BarcodeScanner'
import { QuickInteractionChecker } from './QuickInteractionChecker'
import { DrugMonographViewer } from './DrugMonograph'
import { AllergyChecker } from './AllergyChecker'
import { PediatricDosingCalculator as PediatricDosing } from './PediatricDosing'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Pill, 
  AlertTriangle, 
  Scan, 
  Mic, 
  Clock, 
  User, 
  ChevronRight,
  Bell,
  Activity,
  BookOpen,
  Baby
} from 'lucide-react'

// Mobile-first pharmacy dashboard
export function PharmacyDashboard() {
  const [activeTab, setActiveTab] = useState<'search' | 'scan' | 'interactions' | 'alerts' | 'monograph' | 'allergy' | 'pediatric'>('search')
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [patientName, setPatientName] = useState('')
  const [criticalAlerts, setCriticalAlerts] = useState(2)
  const [selectedDrug, setSelectedDrug] = useState<string | null>(null)

  const handleVoiceSearch = (query: string) => {
    setRecentSearches(prev => [query, ...prev.slice(0, 4)])
    setSelectedDrug(query)
    setActiveTab('monograph')
  }

  const handleBarcodeScan = (code: string) => {
    // Simulate barcode lookup - in production this would query a drug database
    console.log('Scanned:', code)
    // For demo, assume barcode maps to a drug
    setSelectedDrug('aspirin') // Default to aspirin for demo
    setActiveTab('monograph')
  }

  const viewDrugMonograph = (drugName: string) => {
    setSelectedDrug(drugName)
    setActiveTab('monograph')
  }

  const quickActions = [
    { 
      icon: Mic, 
      label: 'Voice Search', 
      color: 'bg-blue-500',
      onClick: () => setActiveTab('search')
    },
    { 
      icon: Scan, 
      label: 'Scan Barcode', 
      color: 'bg-green-500',
      onClick: () => setActiveTab('scan')
    },
    { 
      icon: BookOpen, 
      label: 'Drug Info', 
      color: 'bg-purple-500',
      onClick: () => setActiveTab('monograph')
    },
    { 
      icon: Baby, 
      label: 'Pediatric', 
      color: 'bg-pink-500',
      onClick: () => setActiveTab('pediatric')
    },
    { 
      icon: AlertTriangle, 
      label: 'Allergy', 
      color: 'bg-orange-500',
      onClick: () => setActiveTab('allergy')
    },
    { 
      icon: Bell, 
      label: 'Alerts', 
      color: 'bg-red-500',
      badge: criticalAlerts,
      onClick: () => setActiveTab('alerts')
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Pill className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">Pharmacy Station</h1>
              <p className="text-xs text-gray-500">AI-Powered Drug Safety</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-xs text-gray-500">Active Patient</p>
              <p className="text-sm font-medium">{patientName || 'Not Selected'}</p>
            </div>
            <Button size="sm" variant="outline">
              <User className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-4">
        {/* Quick Actions Grid */}
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={action.onClick}
              className={`${action.color} text-white p-3 rounded-xl flex flex-col items-center gap-1 transition-transform active:scale-95`}
            >
              <div className="relative">
                <action.icon className="h-6 w-6" />
                {action.badge && (
                  <span className="absolute -top-2 -right-2 bg-white text-red-600 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {action.badge}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium text-center">{action.label}</span>
            </button>
          ))}
        </div>

        {/* Active Feature */}
        <Card className="p-4">
          {activeTab === 'search' && (
            <div className="space-y-4">
              <h2 className="font-semibold flex items-center gap-2">
                <Mic className="h-5 w-5 text-blue-500" />
                Voice Drug Search
              </h2>
              <VoiceDrugSearch 
                onSearch={handleVoiceSearch}
                placeholder="Say drug name or 'check aspirin interactions'..."
              />
              
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm text-gray-500 mb-2">Recent Searches</h3>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search, idx) => (
                      <Badge 
                        key={idx} 
                        variant="outline"
                        className="cursor-pointer hover:bg-gray-100"
                        onClick={() => handleVoiceSearch(search)}
                      >
                        <Clock className="h-3 w-3 mr-1" />
                        {search}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'scan' && (
            <div className="space-y-4">
              <h2 className="font-semibold flex items-center gap-2">
                <Scan className="h-5 w-5 text-green-500" />
                Scan Medication
              </h2>
              <BarcodeScanner onScan={handleBarcodeScan} />
            </div>
          )}

          {activeTab === 'interactions' && (
            <div className="space-y-4">
              <h2 className="font-semibold flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Quick Interaction Check
              </h2>
              <QuickInteractionChecker />
            </div>
          )}

          {activeTab === 'alerts' && (
            <div className="space-y-4">
              <h2 className="font-semibold flex items-center gap-2">
                <Bell className="h-5 w-5 text-red-500" />
                Critical Alerts
              </h2>
              <div className="space-y-2">
                <AlertCard 
                  severity="critical"
                  title="Drug Interaction Warning"
                  message="Warfarin + Aspirin combination detected"
                  time="2 min ago"
                />
                <AlertCard 
                  severity="warning"
                  title="Dosage Alert"
                  message="Metformin dose exceeds max for patient age"
                  time="15 min ago"
                />
              </div>
            </div>
          )}

          {activeTab === 'monograph' && selectedDrug && (
            <DrugMonographViewer 
              drugName={selectedDrug} 
              onClose={() => setActiveTab('search')}
            />
          )}
          
          {activeTab === 'allergy' && (
            <div className="space-y-4">
              <h2 className="font-semibold flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Allergy Check
              </h2>
              <AllergyChecker />
            </div>
          )}

          {activeTab === 'pediatric' && (
            <div className="space-y-4">
              <h2 className="font-semibold flex items-center gap-2">
                <Baby className="h-5 w-5 text-pink-500" />
                Pediatric Dosing
              </h2>
              <PediatricDosing />
            </div>
          )}
        </Card>

        {/* Patient Medication Timeline */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-500" />
              Today's Dispensing
            </h2>
            <Badge variant="outline">24 patients</Badge>
          </div>
          <div className="space-y-3">
            <DispenseItem 
              patient="Ahmed Al-Rashid"
              drug="Amoxicillin 500mg"
              time="10:30 AM"
              status="completed"
            />
            <DispenseItem 
              patient="Fatima Hassan"
              drug="Metformin 1000mg"
              time="11:15 AM"
              status="pending"
            />
            <DispenseItem 
              patient="Mohammed Ali"
              drug="Atorvastatin 20mg"
              time="11:45 AM"
              status="alert"
            />
          </div>
        </Card>
      </div>
    </div>
  )
}

// Helper components
function AlertCard({ 
  severity, 
  title, 
  message, 
  time 
}: { 
  severity: 'critical' | 'warning' | 'info'
  title: string
  message: string
  time: string
}) {
  const colors = {
    critical: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  }

  return (
    <div className={`p-3 rounded-lg border ${colors[severity]} flex items-start gap-3`}>
      <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-sm">{title}</h4>
          <span className="text-xs opacity-70">{time}</span>
        </div>
        <p className="text-sm mt-1">{message}</p>
        <div className="flex gap-2 mt-2">
          <Button size="sm" variant="outline" className="h-7 text-xs">
            View Details
          </Button>
          <Button size="sm" variant="ghost" className="h-7 text-xs">
            Acknowledge
          </Button>
        </div>
      </div>
    </div>
  )
}

function DispenseItem({ 
  patient, 
  drug, 
  time, 
  status 
}: { 
  patient: string
  drug: string
  time: string
  status: 'completed' | 'pending' | 'alert'
}) {
  const statusColors = {
    completed: 'bg-green-100 text-green-700',
    pending: 'bg-blue-100 text-blue-700',
    alert: 'bg-red-100 text-red-700'
  }

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
      <div className={`w-2 h-2 rounded-full ${statusColors[status].split(' ')[0].replace('bg-', 'bg-').replace('100', '500')}`} />
      <div className="flex-1">
        <p className="font-medium text-sm">{patient}</p>
        <p className="text-xs text-gray-500">{drug}</p>
      </div>
      <div className="text-right">
        <p className="text-xs text-gray-500">{time}</p>
        <Badge className={`text-xs ${statusColors[status]}`}>
          {status}
        </Badge>
      </div>
      <ChevronRight className="h-4 w-4 text-gray-400" />
    </div>
  )
}
