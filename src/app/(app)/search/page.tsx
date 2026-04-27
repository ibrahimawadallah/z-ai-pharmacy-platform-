'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { 
  Search, Activity, Pill, Database, Filter, ChevronRight, AlertTriangle, X,
  Keyboard, Zap, Shield, Package, DollarSign, FileText, CheckCircle, Clock
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EmptyState } from '@/components/ui/empty-state'
import { Skeleton, SkeletonList, SkeletonInline } from '@/components/ui/skeleton-enhanced'
import { LoadingSpinner } from '@/components/ui/progress-enhanced'
import { useApp, UAEDrug } from '@/providers/AppProvider'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

const SEVERITY_COLORS: Record<string, { badge: string, bg: string }> = {
  'severe': { badge: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', bg: 'bg-red-50 dark:bg-red-950/50' },
  'moderate': { badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200', bg: 'bg-amber-50 dark:bg-amber-950/50' },
  'minor': { badge: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', bg: 'bg-yellow-50 dark:bg-yellow-950/50' },
}

const CATEGORY_COLORS: Record<string, string> = {
  'Cardiovascular': 'bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:text-primary dark:border-primary/30',
  'Respiratory': 'bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:text-primary dark:border-primary/30',
  'Infectious Disease': 'bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:text-primary dark:border-primary/30',
  'Endocrine': 'bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:text-primary dark:border-primary/30',
  'Neurology': 'bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:text-primary dark:border-primary/30',
  'Mental Health': 'bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:text-primary dark:border-primary/30',
  'Gastrointestinal': 'bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:text-primary dark:border-primary/30',
  'Genitourinary': 'bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:text-primary dark:border-primary/30',
  'Oncology': 'bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:text-primary dark:border-primary/30',
  'Other': 'bg-muted text-muted-foreground border-border dark:bg-muted dark:text-muted-foreground dark:border-border',
}

const QUICK_SEARCH_DRUGS = ['Amoxicillin', 'Metformin', 'Atorvastatin', 'Lisinopril', 'Omeprazole', 'Warfarin']

export default function SearchPage() {
  const { language, categories } = useApp()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [icd10Search, setIcd10Search] = useState('')
  const [searchMode, setSearchMode] = useState<'drug' | 'icd10'>('drug')
  const [isLoading, setIsLoading] = useState(false)
  const [drugs, setDrugs] = useState<UAEDrug[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedDrugs, setSelectedDrugs] = useState<UAEDrug[]>([])
  const [interactionResults, setInteractionResults] = useState<any[]>([])
  const [showInteractions, setShowInteractions] = useState(false)
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false)
  const [batchMode, setBatchMode] = useState(false)
  const [selectedForBatch, setSelectedForBatch] = useState<UAEDrug[]>([])

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
        setShowSuggestions(false)
      }
      if (e.key === '?' && !e.shiftKey) {
        setShowKeyboardShortcuts(!showKeyboardShortcuts)
      }
      if (e.key === 'b' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        setBatchMode(!batchMode)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showKeyboardShortcuts, batchMode])

  const searchDrugs = useCallback(async () => {
    if (!searchTerm.trim()) return
    setIsLoading(true)
    try {
      const res = await fetch(`/api/drugs/search?q=${encodeURIComponent(searchTerm)}&limit=30`)
      const data = await res.json()
      setDrugs(data.data || [])
      setShowSuggestions(false)
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
      setShowInteractions(true)
    } catch (error) {
      console.error('Search error:', error)
      toast.error('Failed to search drugs. Please try again.')
    }
    setIsLoading(false)
  }, [selectedDrugs])

  const addDrugToInteraction = (drug: UAEDrug) => {
    if (!selectedDrugs.find(d => d.id === drug.id) && selectedDrugs.length < 5) {
      setSelectedDrugs([...selectedDrugs, drug])
    }
  }

  const removeDrugFromInteraction = (drugId: string) => {
    setSelectedDrugs(selectedDrugs.filter(d => d.id !== drugId))
  }

  const toggleBatchSelection = (drug: UAEDrug) => {
    if (selectedForBatch.find(d => d.id === drug.id)) {
      setSelectedForBatch(selectedForBatch.filter(d => d.id !== drug.id))
    } else {
      setSelectedForBatch([...selectedForBatch, drug])
    }
  }

  const searchByICD10 = useCallback(async () => {
    if (!icd10Search.trim()) return
    setIsLoading(true)
    try {
      const res = await fetch(`/api/drugs/icd10/search?code=${encodeURIComponent(icd10Search)}&limit=30`)
      const data = await res.json()
      setDrugs(data.data || [])
    } catch (error) {
      console.error('Search error:', error)
      toast.error('Failed to search drugs. Please try again.')
    }
    setIsLoading(false)
  }, [icd10Search])

  const searchByCategory = useCallback(async (category: string) => {
    setSearchTerm(category)
    setIsLoading(true)
    try {
      const res = await fetch(`/api/drugs/search?q=${encodeURIComponent(category)}&limit=30&category=${encodeURIComponent(category)}`)
      const data = await res.json()
      setDrugs(data.data || [])
    } catch (error) {
      console.error('Search error:', error)
      toast.error('Failed to search drugs. Please try again.')
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.length < 2) {
        setSuggestions([])
        setShowSuggestions(false)
        return
      }
      try {
        const res = await fetch(`/api/drugs/autocomplete?q=${encodeURIComponent(searchTerm)}&limit=10`)
        const data = await res.json()
        if (data.success && data.suggestions) {
          setSuggestions(data.suggestions)
          setShowSuggestions(true)
        }
      } catch (e) {
        console.error('Autocomplete error:', e)
      }
    }
    const timer = setTimeout(fetchSuggestions, 100)
    return () => clearTimeout(timer)
  }, [searchTerm])

  return (
    <div className="min-h-screen bg-background">
      {/* Clinical Header */}
      <div className="bg-card border-b border-border">
        <div className="px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Search className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Drug Database Search</h1>
                <p className="text-sm text-muted-foreground">Clinical & Pharmacy Operations</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setBatchMode(!batchMode)}
                className={batchMode ? 'bg-primary/10 border-primary/30 text-primary' : ''}
              >
                <Database className="w-4 h-4 mr-2" />
                {batchMode ? 'Exit Batch' : 'Batch Mode'}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowKeyboardShortcuts(!showKeyboardShortcuts)}
              >
                <Keyboard className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts */}
      {showKeyboardShortcuts && (
        <div className="bg-primary/5 border-b border-primary/20">
          <div className="px-6 py-3 max-w-7xl mx-auto">
            <div className="flex items-center gap-6 text-sm">
              <span className="font-medium text-primary">Shortcuts:</span>
              <span className="text-muted-foreground"><kbd className="px-2 py-1 bg-background rounded border border-border">Ctrl+K</kbd> Focus search</span>
              <span className="text-muted-foreground"><kbd className="px-2 py-1 bg-background rounded border border-border">Ctrl+B</kbd> Batch mode</span>
              <span className="text-muted-foreground"><kbd className="px-2 py-1 bg-background rounded border border-border">Esc</kbd> Clear</span>
            </div>
          </div>
        </div>
      )}

      {/* Batch Mode Status */}
      {batchMode && selectedForBatch.length > 0 && (
        <div className="bg-primary/5 border-b border-primary/20">
          <div className="px-6 py-3 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-foreground">
                  Batch Mode: {selectedForBatch.length} drugs selected
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => setSelectedForBatch([])}>
                  Clear Selection
                </Button>
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  Export Selected
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="px-6 py-6 max-w-7xl mx-auto">
        {/* Search Interface */}
        <Card className="bg-card border-border shadow-sm mb-6">
          <CardContent className="p-6">
            <Tabs value={searchMode} onValueChange={(v) => setSearchMode(v as 'drug' | 'icd10')} className="space-y-4">
              <TabsList className="bg-muted p-1 rounded-lg">
                <TabsTrigger value="drug" className="rounded-md data-[state=active]:bg-background">Drug Search</TabsTrigger>
                <TabsTrigger value="icd10" className="rounded-md data-[state=active]:bg-background">ICD-10 Search</TabsTrigger>
              </TabsList>

              <TabsContent value="drug" className="space-y-4 mt-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="drug-search"
                    placeholder="Search by drug name, generic name, or code... (Ctrl+K)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && searchDrugs()}
                    className="pl-12 h-12 text-base"
                  />
                </div>
                {showSuggestions && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 max-h-72 overflow-y-auto">
                    {suggestions.map((s: any) => (
                      <button
                        key={s.packageName || s.id || Math.random()}
                        onClick={() => { setSearchTerm(s.packageName); setShowSuggestions(false); searchDrugs() }}
                        className="w-full text-left px-4 py-3 hover:bg-muted transition-colors text-sm flex items-center justify-between gap-3 border-b border-border last:border-0"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{s.packageName}</div>
                          <div className="text-xs text-muted-foreground truncate">{s.genericName} - {s.strength} - {s.dosageForm}</div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Quick searches:</span>
                  <div className="flex flex-wrap gap-2">
                    {QUICK_SEARCH_DRUGS.map((d) => (
                      <Button 
                        key={d} 
                        variant="outline" 
                        size="sm" 
                        className="h-8 px-3 text-xs" 
                        onClick={() => { setSearchTerm(d); setTimeout(searchDrugs, 100) }}
                      >
                        {d}
                      </Button>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="icd10" className="space-y-4 mt-6">
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Activity className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      placeholder="Enter ICD-10 code (e.g., I10, J45.9)..."
                      value={icd10Search}
                      onChange={(e) => setIcd10Search(e.target.value.toUpperCase())}
                      onKeyDown={(e) => e.key === 'Enter' && searchByICD10()}
                      className="pl-12 h-12 text-base"
                    />
                  </div>
                  <Button onClick={searchByICD10} disabled={isLoading} className="h-12 px-6 bg-primary hover:bg-primary/90">
                    {isLoading ? 'Searching...' : 'Search'}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Interaction Checker Panel */}
        {!batchMode && selectedDrugs.length > 0 && (
          <Card className="bg-card border-border shadow-sm mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  <div>
                    <span className="text-sm font-medium text-foreground">Interaction Checker</span>
                    <span className="text-xs text-muted-foreground ml-2">{selectedDrugs.length} drugs selected</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {selectedDrugs.length >= 2 && (
                    <Button size="sm" onClick={checkInteractions} className="bg-amber-500 hover:bg-amber-600 text-white">
                      <Zap className="w-4 h-4 mr-2" />
                      Check Interactions
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => setSelectedDrugs([])}>
                    Clear
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedDrugs.map(drug => (
                  <Badge key={drug.id} variant="outline" className="flex items-center gap-1">
                    {drug.genericName}
                    <button onClick={() => removeDrugFromInteraction(drug.id)} className="ml-1 hover:text-red-500"><X className="w-3 h-3" /></button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Category Browser */}
        <Card className="bg-card border-border shadow-sm mb-6">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <CardTitle className="text-lg font-semibold text-foreground">Browse by Therapeutic Category</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {categories.slice(0, 10).map((c, idx) => (
                <button
                  key={`${c.name}-${idx}`}
                  onClick={() => searchByCategory(c.name)}
                  className={`p-4 rounded-lg border text-left transition-colors hover:border-border ${CATEGORY_COLORS[c.name] || CATEGORY_COLORS['Other']}`}
                >
                  <div className="text-sm font-medium">{c.name}</div>
                  <div className="text-xs opacity-70 mt-1">{c.count} drugs</div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        <AnimatePresence>
          {isLoading && drugs.length === 0 && (searchTerm || icd10Search) ? (
            <div className="mt-10">
              <SkeletonList count={5} />
            </div>
          ) : drugs.length === 0 && (searchTerm || icd10Search) ? (
            <EmptyState
              variant="search"
              title="No drugs found"
              description={`No medications found matching "${searchTerm || icd10Search}"`}
              action={{
                label: "Clear search",
                onClick: () => { setSearchTerm(''); setIcd10Search(''); setDrugs([]) }
              }}
            />
          ) : drugs.length > 0 && (
            <Card className="bg-card border-border shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Pill className="w-5 h-5 text-primary" />
                    <CardTitle className="text-lg font-semibold text-foreground">Search Results</CardTitle>
                    <Badge variant="outline" className="bg-muted text-muted-foreground border-border">{drugs.length}</Badge>
                  </div>
                  {batchMode && (
                    <Button size="sm" variant="outline" onClick={() => setSelectedForBatch(drugs)}>
                      Select All
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted border-b border-border">
                      <tr>
                        {batchMode && <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 w-10">Select</th>}
                        <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Package Name</th>
                        <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Generic Name</th>
                        <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Strength</th>
                        <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Form</th>
                        <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">ICD-10</th>
                        <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Status</th>
                        <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Price</th>
                        {!batchMode && <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Actions</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {drugs.slice(0, 20).map((drug, idx) => (
                        <tr key={`${drug.id}-${idx}`} className="hover:bg-muted transition-colors">
                          {batchMode && (
                            <td className="px-4 py-3">
                              <input
                                type="checkbox"
                                checked={selectedForBatch.some(d => d.id === drug.id)}
                                onChange={() => toggleBatchSelection(drug)}
                                className="w-4 h-4"
                              />
                            </td>
                          )}
                          <td className="px-4 py-3 text-sm font-medium text-foreground">{drug.packageName}</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">{drug.genericName}</td>
                          <td className="px-4 py-3 text-sm text-foreground">{drug.strength}</td>
                          <td className="px-4 py-3 text-sm text-foreground">{drug.dosageForm}</td>
                          <td className="px-4 py-3">
                            {drug.icd10Codes && drug.icd10Codes.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {drug.icd10Codes.slice(0, 3).map((icd10: any) => (
                                  <div key={icd10.icd10Code || icd10.id || Math.random()} className="flex items-center gap-1">
                                    <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">{icd10.icd10Code}</Badge>
                                  </div>
                                ))}
                              </div>
                            ) : <span className="text-xs text-muted-foreground">-</span>}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              drug.status === 'Active' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                            }`}>
                              {drug.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-foreground">
                              <span className="font-medium">AED {drug.packagePricePublic?.toFixed(2) || 'N/A'}</span>
                            </div>
                          </td>
                          {!batchMode && (
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => addDrugToInteraction(drug)} 
                                  className="h-7 w-7 p-0" 
                                  title="Add to interaction check"
                                >
                                  <AlertTriangle className={`w-3 h-3 ${selectedDrugs.find(d => d.id === drug.id) ? 'text-amber-600' : 'text-amber-500'}`} />
                                </Button>
                                <Link href={`/drug/${drug.id}`}>
                                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                  </Button>
                                </Link>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </AnimatePresence>

        {/* Interaction Results Dialog */}
        <Dialog open={showInteractions} onOpenChange={setShowInteractions}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Drug Interaction Results
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {selectedDrugs.length > 0 && (
                <div className="flex flex-wrap gap-2 p-3 bg-muted rounded-lg">
                  {selectedDrugs.map((drug, idx) => (
                    <Badge key={`${drug.id}-${idx}`} variant="outline" className="flex items-center gap-1">
                      {drug.packageName}
                      <button onClick={() => removeDrugFromInteraction(drug.id)} className="ml-1 hover:text-red-500"><X className="w-3 h-3" /></button>
                    </Badge>
                  ))}
                </div>
              )}
              {interactionResults.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-success mx-auto mb-3" />
                  <p className="text-muted-foreground">No interactions found between selected drugs.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {interactionResults.map((interaction: any, idx) => (
                    <div key={`interaction-${idx}`} className={`p-4 rounded-lg border ${SEVERITY_COLORS[interaction.severity]?.bg || 'bg-muted'}`}>
                      <div className="flex items-start gap-3">
                        <Badge className={SEVERITY_COLORS[interaction.severity]?.badge || ''}>
                          {interaction.severity?.toUpperCase()}
                        </Badge>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{interaction.description}</p>
                          {interaction.management && <p className="text-sm text-muted-foreground mt-2"><span className="font-medium">Management:</span> {interaction.management}</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}