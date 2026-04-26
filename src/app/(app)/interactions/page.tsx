'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { 
  AlertTriangle, Search, X, Activity
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useApp, UAEDrug } from '@/providers/AppProvider'
import { toast } from 'sonner'

const SEVERITY_COLORS: Record<string, { badge: string, bg: string }> = {
  'severe': { 
    badge: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    bg: 'bg-red-50 dark:bg-red-950/50'
  },
  'moderate': { 
    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
    bg: 'bg-amber-50 dark:bg-amber-950/50'
  },
  'minor': { 
    badge: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    bg: 'bg-yellow-50 dark:bg-yellow-950/50'
  },
}

export default function InteractionsPage() {
  const { language } = useApp()
  const searchParams = useSearchParams()
  const drugParam = searchParams.get('drug')
  
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [drugs, setDrugs] = useState<UAEDrug[]>([])
  const [selectedDrugs, setSelectedDrugs] = useState<UAEDrug[]>([])
  const [interactionResults, setInteractionResults] = useState<any[]>([])

  useEffect(() => {
    if (drugParam) {
      fetch(`/api/drugs/${drugParam}`).then(r => r.json()).then(d => {
        if (d.data) {
          setSelectedDrugs([d.data])
        }
      })
    }
  }, [drugParam])

  const searchDrugs = async () => {
    if (!searchTerm.trim()) return
    setIsLoading(true)
    try {
      const res = await fetch(`/api/drugs/search?q=${encodeURIComponent(searchTerm)}&limit=10`)
      const data = await res.json()
      setDrugs(data.data || [])
    } catch (error) {
      console.error('Search error:', error)
      toast.error('Failed to search drugs. Please try again.')
    }
    setIsLoading(false)
  }

  const checkInteractions = async () => {
    if (selectedDrugs.length < 2) return
    setIsLoading(true)
    try {
      const drugIds = selectedDrugs.map(d => d.id).join(',')
      const res = await fetch(`/api/drugs/interactions?drugIds=${drugIds}`)
      const data = await res.json()
      setInteractionResults(data.interactions || [])
    } catch (error) {
      console.error('Search error:', error)
      toast.error('Failed to search drugs. Please try again.')
    }
    setIsLoading(false)
  }

  const addDrug = (drug: UAEDrug) => {
    if (!selectedDrugs.find(d => d.id === drug.id)) {
      setSelectedDrugs([...selectedDrugs, drug])
    }
    setDrugs([])
    setSearchTerm('')
  }

  const removeDrug = (drugId: string) => {
    setSelectedDrugs(selectedDrugs.filter(d => d.id !== drugId))
    setInteractionResults([])
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="px-6 py-5 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs">Clinical Tool</Badge>
              </div>
              <h1 className="text-xl font-semibold">Drug Interaction Checker</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Check potential interactions between multiple medications
              </p>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-lg font-medium">{selectedDrugs.length}</div>
                <div className="text-xs text-muted-foreground">Selected</div>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="text-right">
                <div className="text-lg font-medium">{interactionResults.length}</div>
                <div className="text-xs text-muted-foreground">Interactions</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 max-w-7xl mx-auto">
        {/* Selected Drugs */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-medium">Selected Medications</h2>
            <Button 
              onClick={checkInteractions}
              disabled={selectedDrugs.length < 2 || isLoading}
              className="h-9 px-4"
            >
              {isLoading ? 'Checking...' : 'Check Interactions'}
            </Button>
          </div>
          
          {selectedDrugs.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">
              Search and add at least 2 drugs to check for interactions
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {selectedDrugs.map(drug => (
                <div 
                  key={drug.id}
                  className="flex items-center gap-2 px-3 py-2 bg-muted rounded-md"
                >
                  <span className="text-sm font-medium">{drug.genericName}</span>
                  <button
                    onClick={() => removeDrug(drug.id)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Search */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <h2 className="text-base font-medium mb-4">Add Medication</h2>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search drug name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchDrugs()}
                className="pl-10 h-10"
              />
            </div>
            <Button onClick={searchDrugs} disabled={isLoading} className="h-10 px-5">
              Search
            </Button>
          </div>
          
          {drugs.length > 0 && (
            <div className="mt-4 border border-border rounded-md divide-y divide-border">
              {drugs.map(drug => (
                <button
                  key={drug.id}
                  onClick={() => addDrug(drug)}
                  className="w-full px-4 py-3 text-left hover:bg-muted transition-colors flex items-center justify-between"
                >
                  <div>
                    <div className="text-sm font-medium">{drug.genericName}</div>
                    <div className="text-xs text-muted-foreground">{drug.packageName}</div>
                  </div>
                  <Badge variant="outline" className="text-xs">{drug.dosageForm}</Badge>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Results */}
        {interactionResults.length > 0 && (
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-medium">Interaction Results</span>
                <Badge variant="secondary" className="text-xs">{interactionResults.length}</Badge>
              </div>
            </div>
            
            <div className="divide-y divide-border">
              {interactionResults.map((result, idx) => (
                <div key={idx} className={`p-6 ${SEVERITY_COLORS[result.severity || 'minor']?.bg || ''}`}>
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${SEVERITY_COLORS[result.severity || 'minor']?.badge}`}>
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium">
                          {result.drugName} + {result.secondaryDrugName}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${SEVERITY_COLORS[result.severity || 'minor']?.badge}`}>
                          {result.severity || 'Unknown'}
                        </span>
                      </div>
                      {result.description && (
                        <p className="text-sm text-muted-foreground mb-2">{result.description}</p>
                      )}
                      {result.management && (
                        <div className="text-sm">
                          <span className="font-medium">Management: </span>
                          <span className="text-muted-foreground">{result.management}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}