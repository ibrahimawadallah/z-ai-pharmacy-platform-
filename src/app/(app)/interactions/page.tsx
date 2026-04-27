'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { 
  AlertTriangle, Search, X, Activity, Plus, CheckCircle, 
  Keyboard, Zap, Shield, Clock, ArrowRight
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useApp, UAEDrug } from '@/providers/AppProvider'
import { toast } from 'sonner'

const SEVERITY_COLORS: Record<string, { badge: string, bg: string, border: string }> = {
  'severe': { 
    badge: 'bg-red-600 text-white',
    bg: 'bg-red-50 border-red-200',
    border: 'border-red-500'
  },
  'moderate': { 
    badge: 'bg-amber-600 text-white',
    bg: 'bg-amber-50 border-amber-200',
    border: 'border-amber-500'
  },
  'mild': { 
    badge: 'bg-yellow-600 text-white',
    bg: 'bg-yellow-50 border-yellow-200',
    border: 'border-yellow-500'
  },
}

const QUICK_ADD_DRUGS = ['Aspirin', 'Warfarin', 'Metformin', 'Lisinopril', 'Atorvastatin', 'Omeprazole']

export default function InteractionsPage() {
  const { language } = useApp()
  const searchParams = useSearchParams()
  const drugParam = searchParams.get('drug')
  
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [drugs, setDrugs] = useState<UAEDrug[]>([])
  const [selectedDrugs, setSelectedDrugs] = useState<UAEDrug[]>([])
  const [interactionResults, setInteractionResults] = useState<any[]>([])
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false)

  useEffect(() => {
    if (drugParam) {
      fetch(`/api/drugs/${drugParam}`).then(r => r.json()).then(d => {
        if (d.data) {
          setSelectedDrugs([d.data])
        }
      })
    }
  }, [drugParam])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        document.getElementById('drug-search')?.focus()
      }
      if (e.key === 'Escape') {
        setDrugs([])
        setSearchTerm('')
      }
      if (e.key === '?' && !e.shiftKey) {
        setShowKeyboardShortcuts(!showKeyboardShortcuts)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showKeyboardShortcuts])

  const searchDrugs = useCallback(async () => {
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
  }, [searchTerm])

  const checkInteractions = useCallback(async () => {
    if (selectedDrugs.length < 2) return
    setIsLoading(true)
    try {
      const drugIds = selectedDrugs.map(d => d.id).join(',')
      const res = await fetch(`/api/drugs/interactions?drugIds=${drugIds}`)
      const data = await res.json()
      setInteractionResults(data.interactions || [])
    } catch (error) {
      console.error('Search error:', error)
      toast.error('Failed to check interactions. Please try again.')
    }
    setIsLoading(false)
  }, [selectedDrugs])

  const addDrug = useCallback((drug: UAEDrug) => {
    if (!selectedDrugs.find(d => d.id === drug.id)) {
      setSelectedDrugs(prev => [...prev, drug])
      // Auto-check if we have 2+ drugs
      if (selectedDrugs.length >= 1) {
        setTimeout(() => checkInteractions(), 300)
      }
    }
    setDrugs([])
    setSearchTerm('')
  }, [selectedDrugs, checkInteractions])

  const removeDrug = useCallback((drugId: string) => {
    setSelectedDrugs(prev => {
      const newDrugs = prev.filter(d => d.id !== drugId)
      setInteractionResults([])
      return newDrugs
    })
  }, [])

  const clearAll = useCallback(() => {
    setSelectedDrugs([])
    setInteractionResults([])
    setDrugs([])
    setSearchTerm('')
  }, [])

  const severeCount = interactionResults.filter(i => i.severity === 'severe').length
  const hasSevere = severeCount > 0

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Clinical Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${hasSevere ? 'bg-red-100' : 'bg-blue-100'}`}>
                {hasSevere ? <AlertTriangle className="w-6 h-6 text-red-600" /> : <Shield className="w-6 h-6 text-blue-600" />}
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Drug Interaction Checker</h1>
                <p className="text-sm text-slate-500">Clinical Decision Support Tool</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowKeyboardShortcuts(!showKeyboardShortcuts)}
                className="gap-2"
              >
                <Keyboard className="w-4 h-4" />
                Shortcuts
              </Button>
              {selectedDrugs.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearAll}
                  className="text-slate-600"
                >
                  Clear All
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Panel */}
      {showKeyboardShortcuts && (
        <div className="bg-blue-50 border-b border-blue-200">
          <div className="px-6 py-3 max-w-7xl mx-auto">
            <div className="flex items-center gap-6 text-sm">
              <span className="font-medium text-blue-800">Keyboard Shortcuts:</span>
              <span className="text-blue-700"><kbd className="px-2 py-1 bg-white rounded border border-blue-300">Ctrl+K</kbd> Focus search</span>
              <span className="text-blue-700"><kbd className="px-2 py-1 bg-white rounded border border-blue-300">Enter</kbd> Search/Add drug</span>
              <span className="text-blue-700"><kbd className="px-2 py-1 bg-white rounded border border-blue-300">Esc</kbd> Clear results</span>
              <span className="text-blue-700"><kbd className="px-2 py-1 bg-white rounded border border-blue-300">?</kbd> Toggle shortcuts</span>
            </div>
          </div>
        </div>
      )}

      <div className="px-6 py-6 max-w-7xl mx-auto">
        {/* Clinical Status Bar */}
        <div className={`rounded-lg p-4 mb-6 border ${hasSevere ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-slate-600" />
                <span className="text-sm font-medium text-slate-700">Medications</span>
                <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-300">
                  {selectedDrugs.length}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-slate-600" />
                <span className="text-sm font-medium text-slate-700">Interactions</span>
                <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-300">
                  {interactionResults.length}
                </Badge>
              </div>
              {severeCount > 0 && (
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <span className="text-sm font-medium text-red-700">Severe</span>
                  <Badge className="bg-red-600 text-white">
                    {severeCount}
                  </Badge>
                </div>
              )}
            </div>
            
            {selectedDrugs.length >= 2 && (
              <Button 
                onClick={checkInteractions}
                disabled={isLoading}
                className={hasSevere ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}
              >
                {isLoading ? (
                  <>Checking...</>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Re-check Interactions
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Selected Medications - Clinical View */}
        <Card className="bg-white border-slate-200 shadow-sm mb-6">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-slate-800">Current Medication List</CardTitle>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Clock className="w-4 h-4" />
                <span>Auto-checks when 2+ drugs added</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {selectedDrugs.length === 0 ? (
              <div className="text-center py-8">
                <Shield className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 mb-4">No medications selected</p>
                <p className="text-sm text-slate-400">Add medications below to check for interactions</p>
              </div>
            ) : (
              <div className="space-y-2">
                {selectedDrugs.map((drug, index) => (
                  <div 
                    key={drug.id}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{drug.genericName}</p>
                        <p className="text-sm text-slate-500">{drug.packageName} • {drug.strength} • {drug.dosageForm}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDrug(drug.id)}
                      className="text-slate-400 hover:text-red-600"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Add - Clinical Efficiency */}
        <Card className="bg-white border-slate-200 shadow-sm mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-slate-800">Quick Add Common Medications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {QUICK_ADD_DRUGS.map(drug => (
                <Button
                  key={drug}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchTerm(drug)
                    setTimeout(() => searchDrugs(), 100)
                  }}
                  disabled={selectedDrugs.some(d => d.genericName === drug)}
                  className="text-sm"
                >
                  {selectedDrugs.some(d => d.genericName === drug) ? (
                    <><CheckCircle className="w-4 h-4 mr-1" /> Added</>
                  ) : (
                    <><Plus className="w-4 h-4 mr-1" /> {drug}</>
                  )}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Search - Optimized for Clinical Use */}
        <Card className="bg-white border-slate-200 shadow-sm mb-6">
          <CardContent className="p-6">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="drug-search"
                  placeholder="Search drug name, generic, or code... (Ctrl+K)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      searchDrugs()
                    }
                  }}
                  className="pl-10 h-12 text-base"
                  autoFocus
                />
              </div>
              <Button 
                onClick={searchDrugs} 
                disabled={isLoading}
                className="h-12 px-6 bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? 'Searching...' : 'Search'}
              </Button>
            </div>
            
            {drugs.length > 0 && (
              <div className="mt-4 border border-slate-200 rounded-lg divide-y divide-slate-100 max-h-80 overflow-y-auto">
                {drugs.map(drug => (
                  <button
                    key={drug.id}
                    onClick={() => addDrug(drug)}
                    className="w-full px-4 py-4 text-left hover:bg-slate-50 transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Activity className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">{drug.genericName}</div>
                        <div className="text-sm text-slate-500">{drug.packageName} • {drug.strength} • {drug.dosageForm}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs bg-slate-50 text-slate-600 border-slate-300">
                        {drug.dosageForm}
                      </Badge>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Clinical Results - Prioritized by Severity */}
        {interactionResults.length > 0 && (
          <div className="space-y-4">
            {hasSevere && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <div>
                  <p className="font-semibold text-red-800">Severe Interactions Detected</p>
                  <p className="text-sm text-red-700">Review these interactions before prescribing</p>
                </div>
              </div>
            )}
            
            <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
              <CardHeader className={`pb-4 ${hasSevere ? 'bg-red-50 border-b border-red-200' : ''}`}>
                <div className="flex items-center justify-between">
                  <CardTitle className={`text-lg font-semibold ${hasSevere ? 'text-red-800' : 'text-slate-800'}`}>
                    Interaction Results
                  </CardTitle>
                  <Badge variant="outline" className={hasSevere ? 'bg-red-100 text-red-700 border-red-300' : 'bg-slate-100 text-slate-700 border-slate-300'}>
                    {interactionResults.length} found
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  {interactionResults.map((result, idx) => (
                    <div key={result.id || idx} className={`p-6 ${SEVERITY_COLORS[result.severity || 'mild']?.bg || ''}`}>
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg ${SEVERITY_COLORS[result.severity || 'mild']?.badge}`}>
                          <AlertTriangle className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="font-semibold text-slate-900">
                              {result.drugName || result.secondaryDrugName} + {result.secondaryDrugName || result.drugName}
                            </span>
                            <Badge className={SEVERITY_COLORS[result.severity || 'mild']?.badge}>
                              {(result.severity || 'Unknown').toUpperCase()}
                            </Badge>
                          </div>
                          
                          {result.description && (
                            <p className="text-slate-700 mb-3">{result.description}</p>
                          )}
                          
                          {result.mechanism && (
                            <div className="bg-slate-50 p-3 rounded-lg mb-3">
                              <p className="text-sm">
                                <span className="font-medium text-slate-800">Mechanism:</span>{' '}
                                <span className="text-slate-600">{result.mechanism}</span>
                              </p>
                            </div>
                          )}
                          
                          {result.management && (
                            <div className={`p-3 rounded-lg border ${result.severity === 'severe' ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`}>
                              <p className="text-sm">
                                <span className={`font-medium ${result.severity === 'severe' ? 'text-red-800' : 'text-blue-800'}`}>Clinical Management:</span>{' '}
                                <span className="text-slate-700">{result.management}</span>
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* No Interactions - Positive Feedback */}
        {selectedDrugs.length >= 2 && interactionResults.length === 0 && !isLoading && (
          <Card className="bg-green-50 border-green-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-green-800">No Known Interactions</p>
                  <p className="text-sm text-green-700">These medications have no documented interactions in our database</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}