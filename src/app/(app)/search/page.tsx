'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { 
  Search, Activity, Pill, Database, Filter, ChevronRight
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EmptyState } from '@/components/ui/empty-state'
import { Skeleton, SkeletonList, SkeletonInline } from '@/components/ui/skeleton-enhanced'
import { LoadingSpinner } from '@/components/ui/progress-enhanced'
import { useApp, UAEDrug } from '@/providers/AppProvider'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

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

  const searchDrugs = useCallback(async () => {
    if (!searchTerm.trim()) return
    setIsLoading(true)
    try {
      const res = await fetch(`/api/drugs/search?q=${encodeURIComponent(searchTerm)}&limit=30`)
      const data = await res.json()
      setDrugs(data.data || [])
      setShowSuggestions(false)
    } catch {}
    setIsLoading(false)
  }, [searchTerm])

  // Autocomplete - use debounced search with optimized endpoint
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
    const timer = setTimeout(fetchSuggestions, 250)
    return () => clearTimeout(timer)
  }, [searchTerm])

  const searchByICD10 = useCallback(async () => {
    if (!icd10Search.trim()) return
    setIsLoading(true)
    try {
      const res = await fetch(`/api/drugs/icd10/search?code=${encodeURIComponent(icd10Search)}&limit=30`)
      const data = await res.json()
      setDrugs(data.data?.map((item: any) => ({ ...item.drug, icd10Codes: item.icd10Codes })) || [])
    } catch {}
    setIsLoading(false)
  }, [icd10Search])

  const searchByCategory = async (cat: string) => {
    setIsLoading(true)
    setIcd10Search('')
    try {
      const res = await fetch(`/api/drugs/icd10/search?category=${encodeURIComponent(cat)}&limit=50`)
      const data = await res.json()
      setDrugs(data.data?.map((item: any) => ({ ...item.drug, icd10Codes: item.icd10Codes })) || [])
      setSearchMode('icd10')
    } catch {}
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="px-6 py-5 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs">MOH Approved</Badge>
              </div>
              <h1 className="text-xl font-semibold">Drug Database Search</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Search pharmaceutical products, interactions, and clinical data
              </p>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-lg font-medium">50,000+</div>
                <div className="text-xs text-muted-foreground">Drugs</div>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="text-right">
                <div className="text-lg font-medium">100,000+</div>
                <div className="text-xs text-muted-foreground">Interactions</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Search Card */}
          <div className="lg:col-span-2 bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Database className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h2 className="text-base font-medium">Search Options</h2>
                <p className="text-xs text-muted-foreground">Search by drug or ICD-10 code</p>
              </div>
            </div>

            <Tabs value={searchMode} onValueChange={(v) => setSearchMode(v as any)}>
              <TabsList className="grid w-full grid-cols-2 h-9 bg-muted rounded-md p-1">
                <TabsTrigger 
                  value="drug" 
                  className="text-sm font-medium"
                >
                  By Drug Name
                </TabsTrigger>
                <TabsTrigger 
                  value="icd10"
                  className="text-sm font-medium"
                >
                  By ICD-10
                </TabsTrigger>
              </TabsList>

              <TabsContent value="drug" className="space-y-4 mt-6">
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Enter drug name or generic name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && searchDrugs()}
                      onFocus={() => setShowSuggestions(suggestions.length > 0)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                      className="pl-10 h-10 bg-background border-input rounded-md text-sm"
                    />
                    {showSuggestions && suggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 max-h-72 overflow-y-auto">
                        {suggestions.map((s: any, i: number) => (
                          <button
                            key={i}
                            onClick={() => { setSearchTerm(s.packageName); searchDrugs() }}
                            className="w-full text-left px-4 py-2.5 hover:bg-muted transition-colors text-sm flex items-center justify-between gap-3 border-b border-border last:border-0"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">{s.packageName}</div>
                              <div className="text-xs text-muted-foreground truncate">{s.genericName} • {s.strength} • {s.dosageForm}</div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button 
                    onClick={searchDrugs} 
                    disabled={isLoading}
                    className="h-10 px-5"
                  >
                    {isLoading ? <><LoadingSpinner size="sm" /> Searching...</> : 'Search'}
                  </Button>
                </div>
                
                <div className="flex items-center gap-2">
                  <Filter className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Quick searches:</span>
                  <div className="flex flex-wrap gap-2">
                    {['Amoxicillin', 'Metformin', 'Atorvastatin'].map((d) => (
                      <Button 
                        key={d} 
                        variant="outline" 
                        size="sm" 
                        className="h-7 px-3 text-xs"
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
                    <Activity className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Enter ICD-10 code (e.g., I10, J45.9)..."
                      value={icd10Search}
                      onChange={(e) => setIcd10Search(e.target.value.toUpperCase())}
                      onKeyDown={(e) => e.key === 'Enter' && searchByICD10()}
                      className="pl-10 h-10 bg-background border-input rounded-md text-sm"
                    />
                  </div>
                  <Button 
                    onClick={searchByICD10} 
                    disabled={isLoading}
                    className="h-10 px-5"
                  >
                    {isLoading ? <><LoadingSpinner size="sm" /> Searching...</> : 'Search'}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Info Cards */}
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Pill className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium">Clinical Database</div>
                  <div className="text-xs text-muted-foreground">UAE MOH Approved</div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-success" />
                </div>
                <div>
                  <div className="text-sm font-medium">Drug Interactions</div>
                  <div className="text-xs text-muted-foreground">Real-time checking</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Categories */}
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

        {/* Results */}
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
                        <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">ICD-10 Codes</th>
                        <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Status</th>
                        <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {drugs.slice(0, 20).map((drug) => (
                        <tr key={drug.id} className="hover:bg-muted/50 transition-colors cursor-pointer group">
                          <td className="px-4 py-3 text-sm font-medium">{drug.packageName}</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">{drug.genericName}</td>
                          <td className="px-4 py-3 text-sm">{drug.strength}</td>
                          <td className="px-4 py-3 text-sm">{drug.dosageForm}</td>
                          <td className="px-4 py-3">
                            {drug.icd10Codes && drug.icd10Codes.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {drug.icd10Codes.slice(0, 3).map((icd10: any, i: number) => (
                                  <Badge key={i} variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800">
                                    {icd10.code}
                                  </Badge>
                                ))}
                                {drug.icd10Codes.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{drug.icd10Codes.length - 3}
                                  </Badge>
                                )}
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground">-</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              drug.status === 'Active' 
                                ? 'bg-success/10 text-success' 
                                : 'bg-muted text-muted-foreground'
                            }`}>
                              {drug.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <Link href={`/drug/${drug.id}`} className="flex items-center justify-end">
                              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                            </Link>
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
      </div>
    </div>
  )
}