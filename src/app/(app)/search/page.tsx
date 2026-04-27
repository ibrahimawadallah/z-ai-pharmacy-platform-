'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { 
  Search, Activity, Pill, Database, Filter, ChevronRight, AlertTriangle, X
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
import Link from 'next/link'

const SEVERITY_COLORS: Record<string, { badge: string, bg: string }> = {
  'severe': { badge: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', bg: 'bg-red-50 dark:bg-red-950/50' },
  'moderate': { badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200', bg: 'bg-amber-50 dark:bg-amber-950/50' },
  'minor': { badge: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', bg: 'bg-yellow-50 dark:bg-yellow-950/50' },
}

const CATEGORY_COLORS: Record<string, string> = {
  'Cardiovascular': 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800',
  'Respiratory': 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-800',
  'Infectious Disease': 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800',
  'Endocrine': 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-300 dark:border-violet-800',
  'Neurology': 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800',
  'Mental Health': 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200 dark:bg-fuchsia-950 dark:text-fuchsia-300 dark:border-fuchsia-800',
  'Gastrointestinal': 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800',
  'Genitourinary': 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950 dark:text-cyan-300 dark:border-cyan-800',
  'Oncology': 'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950 dark:text-pink-300 dark:border-pink-800',
  'Other': 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
}

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

  useEffect(() => {
    // Removed auto-search on type - only search on button click or Enter
  }, [])

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-4">
        <Tabs value={searchMode} onValueChange={(v) => setSearchMode(v as 'drug' | 'icd10')} className="space-y-4">
          <TabsList className="bg-muted/50 p-1 rounded-lg">
            <TabsTrigger value="drug" className="rounded-md data-[state=active]:bg-background">Drug Search</TabsTrigger>
            <TabsTrigger value="icd10" className="rounded-md data-[state=active]:bg-background">ICD-10 Search</TabsTrigger>
          </TabsList>

          <TabsContent value="drug" className="space-y-4 mt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by drug name, generic name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchDrugs()}
                className="pl-10 h-10 bg-background border-input rounded-md text-sm"
              />
            </div>
            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 max-h-72 overflow-y-auto">
                {suggestions.map((s: any, i: number) => (
                  <button
                    key={i}
                    onClick={() => { setSearchTerm(s.packageName); setShowSuggestions(false); searchDrugs() }}
                    className="w-full text-left px-4 py-2.5 hover:bg-muted transition-colors text-sm flex items-center justify-between gap-3 border-b border-border last:border-0"
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
              <Filter className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Quick searches:</span>
              <div className="flex flex-wrap gap-2">
                {['Amoxicillin', 'Metformin', 'Atorvastatin'].map((d) => (
                  <Button key={d} variant="outline" size="sm" className="h-7 px-3 text-xs" onClick={() => { setSearchTerm(d); setTimeout(searchDrugs, 100) }}>
                    {d}
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="icd10" className="space-y-4 mt-6">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Activity className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Enter ICD-10 code (e.g., I10, J45.9)..."
                  value={icd10Search}
                  onChange={(e) => setIcd10Search(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === 'Enter' && searchByICD10()}
                  className="pl-10 h-10 bg-background border-input rounded-md text-sm"
                />
              </div>
              <Button onClick={searchByICD10} disabled={isLoading} className="h-10 px-5">
                {isLoading ? <><LoadingSpinner size="sm" /> Searching...</> : 'Search'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="space-y-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-sm font-medium">Drug Interactions</div>
              <div className="text-xs text-muted-foreground">Real-time checking</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Browse by Category</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {categories.slice(0, 10).map((c, i) => (
            <button
              key={c.name}
              onClick={() => searchByCategory(c.name)}
              className={`p-3 rounded-lg border text-left transition-colors hover:bg-muted ${CATEGORY_COLORS[c.name] || CATEGORY_COLORS['Other']}`}
            >
              <div className="text-sm font-medium">{c.name}</div>
              <div className="text-xs opacity-70">{c.count} drugs</div>
            </button>
          ))}
        </div>
      </div>

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
          <div className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Pill className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Search Results</span>
                <Badge variant="secondary" className="text-xs">{drugs.length}</Badge>
              </div>
              {selectedDrugs.length >= 2 && (
                <Button size="sm" onClick={checkInteractions} className="bg-amber-500 hover:bg-amber-600 text-white">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Check {selectedDrugs.length} Drug Interactions
                </Button>
              )}
            </div>
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Package Name</th>
                      <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Generic Name</th>
                      <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Strength</th>
                      <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Form</th>
                      <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">ICD-10</th>
                      <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Status</th>
                      <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Check</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {drugs.slice(0, 20).map((drug) => (
                      <tr key={drug.id} className="hover:bg-muted/50 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium">{drug.packageName}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{drug.genericName}</td>
                        <td className="px-4 py-3 text-sm">{drug.strength}</td>
                        <td className="px-4 py-3 text-sm">{drug.dosageForm}</td>
                        <td className="px-4 py-3">
                          {drug.icd10Codes && drug.icd10Codes.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {drug.icd10Codes.slice(0, 3).map((icd10: any, i: number) => (
                                <div key={i} className="flex items-center gap-1">
                                  <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">{icd10.icd10Code}</Badge>
                                  {icd10.badge && (
                                    <Badge className={`text-xs ${icd10.badge.color}`}>
                                      {icd10.badge.icon}
                                    </Badge>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : <span className="text-xs text-muted-foreground">-</span>}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            drug.status === 'Active' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                          }`}>
                            {drug.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" onClick={() => addDrugToInteraction(drug)} className="h-7 w-7 p-0" title="Add to interaction check">
                              <AlertTriangle className={`w-3 h-3 ${selectedDrugs.find(d => d.id === drug.id) ? 'text-amber-600' : 'text-amber-500'}`} />
                            </Button>
                            <Link href={`/drug/${drug.id}`}>
                              <ChevronRight className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      <Dialog open={showInteractions} onOpenChange={setShowInteractions}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Drug Interaction Results
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedDrugs.length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-lg">
                {selectedDrugs.map(drug => (
                  <Badge key={drug.id} variant="outline" className="flex items-center gap-1">
                    {drug.packageName}
                    <button onClick={() => removeDrugFromInteraction(drug.id)} className="ml-1 hover:text-red-500"><X className="w-3 h-3" /></button>
                  </Badge>
                ))}
              </div>
            )}
            {interactionResults.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No interactions found between selected drugs.</p>
            ) : (
              <div className="space-y-3">
                {interactionResults.map((interaction: any, i: number) => (
                  <div key={i} className={`p-4 rounded-lg border ${SEVERITY_COLORS[interaction.severity]?.bg || 'bg-muted/50'}`}>
                    <div className="flex items-start gap-3">
                      <Badge className={SEVERITY_COLORS[interaction.severity]?.badge || ''}>
                        {interaction.severity?.toUpperCase()}
                      </Badge>
                      <div className="flex-1">
                        <p className="font-medium">{interaction.description}</p>
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
  )
}