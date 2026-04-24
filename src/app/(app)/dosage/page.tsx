'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Calculator, Search, User, Weight, Clock } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useApp, UAEDrug } from '@/providers/AppProvider'

export default function DosagePage() {
  const { language } = useApp()
  const searchParams = useSearchParams()
  
  const [patientWeight, setPatientWeight] = useState('')
  const [patientAge, setPatientAge] = useState('')
  const [creatinineClearance, setCreatinineClearance] = useState('')
  const [hepaticStatus, setHepaticStatus] = useState('normal')
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [drugs, setDrugs] = useState<UAEDrug[]>([])
  const [selectedDrug, setSelectedDrug] = useState<UAEDrug | null>(null)

  const drugParam = searchParams.get('name')
  const drugId = searchParams.get('drug')

  const searchDrugs = React.useCallback(async (term?: string) => {
    const query = (term ?? searchTerm).trim()
    if (!query) return
    setIsLoading(true)
    try {
      const res = await fetch(`/api/drugs/search?q=${encodeURIComponent(query)}&limit=10`)
      const data = await res.json()
      setDrugs(data.data || [])
    } catch {}
    setIsLoading(false)
  }, [searchTerm])

  useEffect(() => {
    if (drugParam) {
      setSearchTerm(drugParam)
      searchDrugs(drugParam)
    }
  }, [drugParam, searchDrugs])

  const selectDrug = (drug: UAEDrug) => {
    setSelectedDrug(drug)
    setSearchTerm(drug.packageName)
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="px-6 py-5 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs">Clinical Calculator</Badge>
              </div>
              <h1 className="text-xl font-semibold">Dosage Calculator</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Calculate dosing based on patient parameters
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Patient Parameters */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-base font-medium">Patient Parameters</h2>
                <p className="text-xs text-muted-foreground">Enter patient details</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm">Weight (kg)</Label>
                  <Input
                    type="number"
                    value={patientWeight}
                    onChange={(e) => setPatientWeight(e.target.value)}
                    placeholder="70"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm">Age (years)</Label>
                  <Input
                    type="number"
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                    placeholder="45"
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm">Creatinine Clearance (mL/min)</Label>
                  <Input
                    type="number"
                    value={creatinineClearance}
                    onChange={(e) => setCreatinineClearance(e.target.value)}
                    placeholder="90"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm">Hepatic Function</Label>
                  <select
                    value={hepaticStatus}
                    onChange={(e) => setHepaticStatus(e.target.value)}
                    className="mt-1 w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                  >
                    <option value="normal">Normal</option>
                    <option value="mild">Mild Impairment</option>
                    <option value="moderate">Moderate Impairment</option>
                    <option value="severe">Severe Impairment</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Drug Search */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <Search className="w-5 h-5 text-success" />
              </div>
              <div>
                <h2 className="text-base font-medium">Select Drug</h2>
                <p className="text-xs text-muted-foreground">Search for medication</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search drug name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && searchDrugs()}
                    className="pl-10"
                  />
                </div>
                <Button onClick={() => searchDrugs()} disabled={isLoading} className="h-10">
                  Search
                </Button>
              </div>
              
              {drugs.length > 0 && (
                <div className="border border-border rounded-md divide-y divide-border max-h-60 overflow-y-auto">
                  {drugs.map(drug => (
                    <button
                      key={drug.id}
                      className="w-full px-4 py-3 text-left hover:bg-muted transition-colors"
                    >
                      <div className="text-sm font-medium">{drug.genericName}</div>
                      <div className="text-xs text-muted-foreground">{drug.strength} - {drug.dosageForm}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info Note */}
        <div className="mt-6 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Calculator className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800 dark:text-amber-200">Clinical Note</p>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                This calculator provides general dosing guidance. Always verify with official prescribing information 
                and consider patient-specific factors. Consult clinical pharmacology references for definitive dosing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}