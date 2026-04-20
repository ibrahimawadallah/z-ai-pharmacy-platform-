'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  Search, 
  Database, 
  AlertCircle, 
  ExternalLink, 
  Loader2, 
  Pill,
  FileText,
  AlertTriangle,
  Activity,
  Building2,
  Coins,
  Shield,
  Calendar,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  Filter
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface UAEDrug {
  id: string
  drugCode: string
  packageName: string
  genericName: string
  strength: string
  dosageForm: string
  packageSize: string
  status: string
  dispenseMode: string | null
  packagePricePublic: number | null
  packagePricePharmacy: number | null
  unitPricePublic: number | null
  unitPricePharmacy: number | null
  agentName: string | null
  manufacturerName: string | null
  includedInThiqaABM: string | null
  includedInBasic: string | null
  includedInABM1: string | null
  includedInABM7: string | null
  lastChangeDate: string | null
}

interface SearchResponse {
  success: boolean
  source: string
  data: UAEDrug[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasMore: boolean
  }
}

interface StatsResponse {
  success: boolean
  statistics: {
    total: number
    active: number
    withPricing: number
    formulary: {
      thiqa: number
      basic: number
    }
  }
  dosageForms: Array<{ form: string; count: number }>
}

export function UAEDrugInfoPanel() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [drugs, setDrugs] = useState<UAEDrug[]>([])
  const [stats, setStats] = useState<StatsResponse | null>(null)
  const [selectedDrug, setSelectedDrug] = useState<UAEDrug | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [dosageFormFilter, setDosageFormFilter] = useState<string>('')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)

  // Fetch stats on mount
  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/drugs/stats')
      const data: StatsResponse = await response.json()
      setStats(data)
    } catch (err) {
      console.error('Failed to fetch stats:', err)
    }
  }

  const searchDrugs = useCallback(async (resetPage = true) => {
    if (!searchTerm.trim() && !dosageFormFilter) {
      setDrugs([])
      return
    }

    setIsLoading(true)
    setError(null)
    if (resetPage) setPage(1)

    try {
      const params = new URLSearchParams()
      params.append('q', searchTerm)
      params.append('page', resetPage ? '1' : page.toString())
      params.append('limit', '20')
      if (dosageFormFilter) {
        params.append('form', dosageFormFilter)
      }

      const response = await fetch(`/api/drugs/search?${params}`)
      const data: SearchResponse = await response.json()

      if (data.success) {
        if (resetPage) {
          setDrugs(data.data)
        } else {
          setDrugs(prev => [...prev, ...data.data])
        }
        setHasMore(data.pagination.hasMore)
      } else {
        setError('Failed to search drugs')
      }
    } catch (err) {
      setError('Failed to search drugs. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [searchTerm, dosageFormFilter, page])

  const loadMore = () => {
    setPage(prev => prev + 1)
    searchDrugs(false)
  }

  const formatPrice = (price: number | null) => {
    if (price === null || price === undefined) return 'N/A'
    return `AED ${price.toFixed(2)}`
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="py-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Database className="w-4 h-4 text-emerald-600" />
          🇦🇪 UAE Drug Database
          <Badge variant="outline" className="ml-auto text-xs">
            {stats?.statistics.active.toLocaleString() || '...'} Active Drugs
          </Badge>
        </CardTitle>
        <CardDescription className="text-xs">
          Official UAE Ministry of Health Drug Formulary
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {/* Search Input */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by brand or generic name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && searchDrugs()}
              className="pl-9 h-9"
            />
          </div>
          <Select value={dosageFormFilter} onValueChange={setDosageFormFilter}>
            <SelectTrigger className="w-[150px] h-9">
              <SelectValue placeholder="All Forms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Forms</SelectItem>
              {stats?.dosageForms.slice(0, 10).map(df => (
                <SelectItem key={df.form} value={df.form || 'unknown'}>
                  {df.form || 'Unknown'} ({df.count})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            onClick={() => searchDrugs()} 
            disabled={isLoading}
            size="sm"
            className="h-9"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          </Button>
        </div>

        {/* Statistics */}
        {stats && !selectedDrug && (
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30">
              <p className="text-lg font-bold text-emerald-600">{stats.statistics.active.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Active Drugs</p>
            </div>
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30">
              <p className="text-lg font-bold text-blue-600">{stats.statistics.withPricing.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">With Pricing</p>
            </div>
            <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/30">
              <p className="text-lg font-bold text-purple-600">{stats.statistics.formulary.thiqa.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Thiqa Formulary</p>
            </div>
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/30">
              <p className="text-lg font-bold text-amber-600">{stats.statistics.formulary.basic.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Basic Formulary</p>
            </div>
          </div>
        )}

        {/* Drug Detail View */}
        {selectedDrug ? (
          <DrugDetailView 
            drug={selectedDrug} 
            onBack={() => setSelectedDrug(null)}
            formatPrice={formatPrice}
          />
        ) : (
          <>
            {/* Results List */}
            {drugs.length > 0 && (
              <ScrollArea className="h-[350px] pr-2">
                <div className="space-y-2">
                  {drugs.map((drug) => (
                    <button
                      key={drug.id}
                      onClick={() => setSelectedDrug(drug)}
                      className="w-full p-3 rounded-lg border hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-left group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm">{drug.packageName}</p>
                            {drug.status === 'Active' ? (
                              <Badge variant="outline" className="text-[10px] px-1 py-0 bg-green-50 text-green-700 border-green-200">
                                Active
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-[10px] px-1 py-0 bg-red-50 text-red-700 border-red-200">
                                {drug.status}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{drug.genericName}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs">{drug.strength} • {drug.dosageForm}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          {drug.packagePricePublic && (
                            <p className="text-sm font-semibold text-emerald-600">
                              {formatPrice(drug.packagePricePublic)}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">{drug.packageSize}</p>
                        </div>
                      </div>
                      
                      {/* Formulary badges */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {drug.includedInThiqaABM === 'Yes' && (
                          <Badge className="text-[10px] px-1 py-0 bg-purple-100 text-purple-700">
                            Thiqa
                          </Badge>
                        )}
                        {drug.includedInBasic === 'Yes' && (
                          <Badge className="text-[10px] px-1 py-0 bg-amber-100 text-amber-700">
                            Basic
                          </Badge>
                        )}
                        {drug.dispenseMode && (
                          <Badge variant="outline" className="text-[10px] px-1 py-0">
                            {drug.dispenseMode}
                          </Badge>
                        )}
                      </div>
                    </button>
                  ))}
                  
                  {hasMore && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={loadMore}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-1" />
                      ) : null}
                      Load More
                    </Button>
                  )}
                </div>
              </ScrollArea>
            )}

            {/* Empty State */}
            {drugs.length === 0 && !isLoading && searchTerm && (
              <div className="text-center py-8">
                <Pill className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No drugs found for "{searchTerm}"</p>
              </div>
            )}
          </>
        )}

        {/* Error */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Quick Search Links */}
        {!selectedDrug && drugs.length === 0 && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground mb-2">Quick Search:</p>
            <div className="flex flex-wrap gap-1">
              {['Amoxicillin', 'Ibuprofen', 'Metformin', 'Omeprazole', 'Paracetamol'].map((drug) => (
                <Button
                  key={drug}
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => {
                    setSearchTerm(drug)
                    setTimeout(() => searchDrugs(), 100)
                  }}
                >
                  {drug}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-2 border-t text-xs text-muted-foreground">
          <p>Data source: UAE Ministry of Health & Prevention</p>
        </div>
      </CardContent>
    </Card>
  )
}

// Drug Detail View Component
function DrugDetailView({ 
  drug, 
  onBack,
  formatPrice
}: { 
  drug: UAEDrug
  onBack: () => void
  formatPrice: (price: number | null) => string
}) {
  const [expanded, setExpanded] = useState<'pricing' | 'formulary' | 'info' | null>('pricing')

  return (
    <ScrollArea className="h-[400px] pr-2">
      <div className="space-y-3">
        {/* Back Button */}
        <Button variant="ghost" size="sm" onClick={onBack} className="h-7 text-xs">
          ← Back to Search
        </Button>

        {/* Drug Header */}
        <div className="p-3 rounded-lg bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-base">{drug.packageName}</h3>
              <p className="text-sm text-muted-foreground">{drug.genericName}</p>
            </div>
            {drug.status === 'Active' ? (
              <Badge className="bg-green-100 text-green-700">Active</Badge>
            ) : (
              <Badge variant="destructive">{drug.status}</Badge>
            )}
          </div>
          <div className="flex flex-wrap gap-2 mt-2 text-xs text-muted-foreground">
            <span>{drug.strength}</span>
            <span>•</span>
            <span>{drug.dosageForm}</span>
            <span>•</span>
            <span>{drug.packageSize}</span>
          </div>
          {drug.dispenseMode && (
            <Badge variant="outline" className="mt-2 text-xs">
              {drug.dispenseMode}
            </Badge>
          )}
        </div>

        {/* Pricing Section */}
        <Card className="border-slate-200">
          <CardHeader className="py-2 px-3 cursor-pointer" onClick={() => setExpanded(expanded === 'pricing' ? null : 'pricing')}>
            <CardTitle className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-emerald-600" />
                Pricing (AED)
              </span>
              {expanded === 'pricing' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </CardTitle>
          </CardHeader>
          {expanded === 'pricing' && (
            <CardContent className="pt-0 px-3 pb-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-800">
                  <p className="text-xs text-muted-foreground">Public Price</p>
                  <p className="font-semibold text-emerald-600">{formatPrice(drug.packagePricePublic)}</p>
                </div>
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-800">
                  <p className="text-xs text-muted-foreground">Pharmacy Price</p>
                  <p className="font-semibold">{formatPrice(drug.packagePricePharmacy)}</p>
                </div>
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-800">
                  <p className="text-xs text-muted-foreground">Unit Price (Public)</p>
                  <p className="font-medium">{formatPrice(drug.unitPricePublic)}</p>
                </div>
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-800">
                  <p className="text-xs text-muted-foreground">Unit Price (Pharmacy)</p>
                  <p className="font-medium">{formatPrice(drug.unitPricePharmacy)}</p>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Formulary Section */}
        <Card className="border-slate-200">
          <CardHeader className="py-2 px-3 cursor-pointer" onClick={() => setExpanded(expanded === 'formulary' ? null : 'formulary')}>
            <CardTitle className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-purple-600" />
                Insurance Formulary
              </span>
              {expanded === 'formulary' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </CardTitle>
          </CardHeader>
          {expanded === 'formulary' && (
            <CardContent className="pt-0 px-3 pb-3 space-y-2">
              <div className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-slate-800">
                <span className="text-sm">Thiqa / ABM Formulary</span>
                {drug.includedInThiqaABM === 'Yes' ? (
                  <Badge className="bg-purple-100 text-purple-700"><CheckCircle2 className="w-3 h-3 mr-1" /> Yes</Badge>
                ) : (
                  <Badge variant="outline"><XCircle className="w-3 h-3 mr-1" /> No</Badge>
                )}
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-slate-800">
                <span className="text-sm">Basic Drug Formulary</span>
                {drug.includedInBasic === 'Yes' ? (
                  <Badge className="bg-amber-100 text-amber-700"><CheckCircle2 className="w-3 h-3 mr-1" /> Yes</Badge>
                ) : (
                  <Badge variant="outline"><XCircle className="w-3 h-3 mr-1" /> No</Badge>
                )}
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-slate-800">
                <span className="text-sm">ABM 1 Formulary</span>
                {drug.includedInABM1 === 'Yes' ? (
                  <Badge className="bg-blue-100 text-blue-700"><CheckCircle2 className="w-3 h-3 mr-1" /> Yes</Badge>
                ) : (
                  <Badge variant="outline"><XCircle className="w-3 h-3 mr-1" /> No</Badge>
                )}
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-slate-800">
                <span className="text-sm">ABM 7 Formulary</span>
                {drug.includedInABM7 === 'Yes' ? (
                  <Badge className="bg-green-100 text-green-700"><CheckCircle2 className="w-3 h-3 mr-1" /> Yes</Badge>
                ) : (
                  <Badge variant="outline"><XCircle className="w-3 h-3 mr-1" /> No</Badge>
                )}
              </div>
            </CardContent>
          )}
        </Card>

        {/* Manufacturer Info */}
        <Card className="border-slate-200">
          <CardHeader className="py-2 px-3 cursor-pointer" onClick={() => setExpanded(expanded === 'info' ? null : 'info')}>
            <CardTitle className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                Manufacturer Info
              </span>
              {expanded === 'info' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </CardTitle>
          </CardHeader>
          {expanded === 'info' && (
            <CardContent className="pt-0 px-3 pb-3 space-y-2">
              <div className="p-2 rounded bg-slate-50 dark:bg-slate-800">
                <p className="text-xs text-muted-foreground">Drug Code</p>
                <p className="text-sm font-mono">{drug.drugCode}</p>
              </div>
              {drug.agentName && (
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-800">
                  <p className="text-xs text-muted-foreground">Local Agent</p>
                  <p className="text-sm">{drug.agentName}</p>
                </div>
              )}
              {drug.manufacturerName && (
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-800">
                  <p className="text-xs text-muted-foreground">Manufacturer</p>
                  <p className="text-sm">{drug.manufacturerName}</p>
                </div>
              )}
              {drug.lastChangeDate && (
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-800">
                  <p className="text-xs text-muted-foreground">Last Updated</p>
                  <p className="text-sm">{new Date(drug.lastChangeDate).toLocaleDateString()}</p>
                </div>
              )}
            </CardContent>
          )}
        </Card>
      </div>
    </ScrollArea>
  )
}
