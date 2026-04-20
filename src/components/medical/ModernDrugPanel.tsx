'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  Search, 
  Database, 
  AlertCircle, 
  Loader2, 
  Pill,
  Building2,
  Coins,
  Shield,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  Download,
  Stethoscope,
  Tag,
  ArrowRight,
  X
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface ICD10Code {
  code: string
  description: string | null
  category: string | null
}

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
  icd10Codes?: ICD10Code[]
}

interface StatsResponse {
  success: boolean
  statistics: {
    total: number
    active: number
    withPricing: number
    formulary: { thiqa: number; basic: number }
  }
  dosageForms: Array<{ form: string; count: number }>
}

const CATEGORY_COLORS: Record<string, string> = {
  'Cardiovascular': 'bg-rose-100 text-rose-700 border-rose-200',
  'Respiratory': 'bg-sky-100 text-sky-700 border-sky-200',
  'Infectious Disease': 'bg-amber-100 text-amber-700 border-amber-200',
  'Endocrine': 'bg-violet-100 text-violet-700 border-violet-200',
  'Neurology': 'bg-indigo-100 text-indigo-700 border-indigo-200',
  'Mental Health': 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200',
  'Gastrointestinal': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Genitourinary': 'bg-cyan-100 text-cyan-700 border-cyan-200',
  'Oncology': 'bg-pink-100 text-pink-700 border-pink-200',
  'Dermatology': 'bg-orange-100 text-orange-700 border-orange-200',
  'Musculoskeletal': 'bg-teal-100 text-teal-700 border-teal-200',
  'Symptoms': 'bg-slate-100 text-slate-700 border-slate-200',
  'Other': 'bg-gray-100 text-gray-700 border-gray-200',
}

export function ModernDrugPanel() {
  const [searchTerm, setSearchTerm] = useState('')
  const [icd10Search, setIcd10Search] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [drugs, setDrugs] = useState<UAEDrug[]>([])
  const [stats, setStats] = useState<StatsResponse | null>(null)
  const [selectedDrug, setSelectedDrug] = useState<UAEDrug | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [searchMode, setSearchMode] = useState<'drug' | 'icd10'>('drug')
  const [icd10Categories, setIcd10Categories] = useState<{name: string; count: number}[]>([])

  useEffect(() => {
    fetchStats()
    fetchCategories()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/drugs/stats')
      const data = await response.json()
      setStats(data)
    } catch (err) {
      console.error('Failed to fetch stats:', err)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/drugs/icd10/search')
      const data = await response.json()
      if (data.categories) {
        setIcd10Categories(data.categories)
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err)
    }
  }

  const searchDrugs = useCallback(async () => {
    if (!searchTerm.trim()) {
      setDrugs([])
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      params.append('q', searchTerm)
      params.append('limit', '20')

      const response = await fetch(`/api/drugs/search?${params}`)
      const data = await response.json()

      if (data.success) {
        setDrugs(data.data)
      } else {
        setError('Failed to search drugs')
      }
    } catch (err) {
      setError('Search failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [searchTerm])

  const searchByICD10 = useCallback(async () => {
    if (!icd10Search.trim()) {
      setDrugs([])
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      params.append('code', icd10Search)
      params.append('limit', '20')

      const response = await fetch(`/api/drugs/icd10/search?${params}`)
      const data = await response.json()

      if (data.success) {
        setDrugs(data.data.map((item: { drug: UAEDrug; icd10Codes: ICD10Code[] }) => ({
          ...item.drug,
          icd10Codes: item.icd10Codes
        })))
      } else {
        setError('No drugs found for this ICD-10 code')
      }
    } catch (err) {
      setError('ICD-10 search failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [icd10Search])

  const searchByCategory = async (category: string) => {
    setIsLoading(true)
    setError(null)
    setIcd10Search('')

    try {
      const params = new URLSearchParams()
      params.append('category', category)
      params.append('limit', '50')

      const response = await fetch(`/api/drugs/icd10/search?${params}`)
      const data = await response.json()

      if (data.success) {
        setDrugs(data.data.map((item: { drug: UAEDrug; icd10Codes: ICD10Code[] }) => ({
          ...item.drug,
          icd10Codes: item.icd10Codes
        })))
        setSearchMode('icd10')
      }
    } catch (err) {
      setError('Category search failed')
    } finally {
      setIsLoading(false)
    }
  }

  const exportData = async (format: 'csv' | 'json') => {
    window.open(`/api/drugs/export?format=${format}&icd10=true`, '_blank')
  }

  const formatPrice = (price: number | null) => {
    if (price === null || price === undefined) return 'N/A'
    return `AED ${price.toFixed(2)}`
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold">🇦🇪 UAE Drug Database</h2>
            <p className="text-xs text-muted-foreground">Ministry of Health Official Formulary</p>
          </div>
        </div>
        <div className="flex gap-1">
          <Button variant="outline" size="sm" onClick={() => exportData('csv')}>
            <Download className="w-3 h-3 mr-1" /> CSV
          </Button>
          <Button variant="outline" size="sm" onClick={() => exportData('json')}>
            <Download className="w-3 h-3 mr-1" /> JSON
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: 'Active Drugs', value: stats?.statistics.active || 0, color: 'text-emerald-600' },
          { label: 'With Pricing', value: stats?.statistics.withPricing || 0, color: 'text-blue-600' },
          { label: 'Thiqa', value: stats?.statistics.formulary.thiqa || 0, color: 'text-purple-600' },
          { label: 'Basic', value: stats?.statistics.formulary.basic || 0, color: 'text-amber-600' },
        ].map((stat) => (
          <div key={stat.label} className="text-center p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <p className={`text-lg font-bold ${stat.color}`}>{stat.value.toLocaleString()}</p>
            <p className="text-[10px] text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Search Tabs */}
      <Tabs value={searchMode} onValueChange={(v) => setSearchMode(v as 'drug' | 'icd10')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="drug" className="text-xs">
            <Pill className="w-3 h-3 mr-1" /> Search by Drug
          </TabsTrigger>
          <TabsTrigger value="icd10" className="text-xs">
            <Stethoscope className="w-3 h-3 mr-1" /> Search by ICD-10
          </TabsTrigger>
        </TabsList>

        <TabsContent value="drug" className="space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by brand or generic name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchDrugs()}
                className="pl-9"
              />
            </div>
            <Button onClick={searchDrugs} disabled={isLoading}>
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            </Button>
          </div>

          {/* Quick Search */}
          <div className="flex flex-wrap gap-1">
            {['Amoxicillin', 'Metformin', 'Pantoprazole', 'Sertraline', 'Montelukast'].map((drug) => (
              <Button
                key={drug}
                variant="ghost"
                size="sm"
                className="h-6 text-xs"
                onClick={() => {
                  setSearchTerm(drug)
                  setTimeout(() => searchDrugs(), 100)
                }}
              >
                {drug}
              </Button>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="icd10" className="space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Enter ICD-10 code (e.g., N39.0, I10, J45.9)..."
                value={icd10Search}
                onChange={(e) => setIcd10Search(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && searchByICD10()}
                className="pl-9 font-mono"
              />
            </div>
            <Button onClick={searchByICD10} disabled={isLoading}>
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            </Button>
          </div>

          {/* ICD-10 Categories */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Browse by Category:</p>
            <div className="flex flex-wrap gap-1">
              {icd10Categories.slice(0, 8).map((cat) => (
                <Button
                  key={cat.name}
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => searchByCategory(cat.name)}
                >
                  {cat.name} ({cat.count})
                </Button>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Error */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Selected Drug Detail */}
      {selectedDrug && (
        <Card className="border-2 border-emerald-200 dark:border-emerald-800">
          <CardContent className="pt-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-lg">{selectedDrug.packageName}</h3>
                <p className="text-sm text-muted-foreground">{selectedDrug.genericName}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedDrug(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span>{selectedDrug.strength}</span>
              <span>•</span>
              <span>{selectedDrug.dosageForm}</span>
              <span>•</span>
              <span>{selectedDrug.packageSize}</span>
            </div>

            {/* ICD-10 Codes */}
            {selectedDrug.icd10Codes && selectedDrug.icd10Codes.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold flex items-center gap-1">
                  <Tag className="w-3 h-3" /> ICD-10 Indications:
                </p>
                <div className="flex flex-wrap gap-1">
                  {selectedDrug.icd10Codes.map((icd, idx) => (
                    <Badge 
                      key={idx}
                      variant="outline"
                      className={`${CATEGORY_COLORS[icd.category || 'Other'] || 'bg-slate-100'} cursor-pointer hover:opacity-80`}
                      onClick={() => {
                        setIcd10Search(icd.code)
                        setSearchMode('icd10')
                        setSelectedDrug(null)
                        setTimeout(() => searchByICD10(), 100)
                      }}
                    >
                      {icd.code}: {icd.description}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Pricing */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30">
                <p className="text-xs text-muted-foreground">Public Price</p>
                <p className="font-bold text-emerald-600">{formatPrice(selectedDrug.packagePricePublic)}</p>
              </div>
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30">
                <p className="text-xs text-muted-foreground">Pharmacy Price</p>
                <p className="font-bold text-blue-600">{formatPrice(selectedDrug.packagePricePharmacy)}</p>
              </div>
            </div>

            {/* Formulary */}
            <div className="flex gap-1">
              {selectedDrug.includedInThiqaABM === 'Yes' && (
                <Badge className="bg-purple-100 text-purple-700">Thiqa ✓</Badge>
              )}
              {selectedDrug.includedInBasic === 'Yes' && (
                <Badge className="bg-amber-100 text-amber-700">Basic ✓</Badge>
              )}
              {selectedDrug.dispenseMode && (
                <Badge variant="outline">{selectedDrug.dispenseMode}</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results List */}
      {!selectedDrug && drugs.length > 0 && (
        <ScrollArea className="h-[300px]">
          <div className="space-y-2">
            {drugs.map((drug) => (
              <button
                key={drug.id}
                onClick={() => setSelectedDrug(drug)}
                className="w-full p-3 rounded-lg border hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all text-left group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm truncate">{drug.packageName}</p>
                      <Badge variant={drug.status === 'Active' ? 'default' : 'secondary'} className="text-[10px] shrink-0">
                        {drug.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{drug.genericName}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <span>{drug.strength}</span>
                      <span>•</span>
                      <span>{drug.dosageForm}</span>
                    </div>
                    
                    {/* ICD-10 Codes Preview */}
                    {drug.icd10Codes && drug.icd10Codes.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {drug.icd10Codes.slice(0, 3).map((icd, idx) => (
                          <Badge key={idx} variant="outline" className="text-[10px] px-1 py-0">
                            {icd.code}
                          </Badge>
                        ))}
                        {drug.icd10Codes.length > 3 && (
                          <Badge variant="outline" className="text-[10px] px-1 py-0">
                            +{drug.icd10Codes.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <p className="font-bold text-emerald-600">{formatPrice(drug.packagePricePublic)}</p>
                    <p className="text-xs text-muted-foreground">{drug.packageSize}</p>
                    <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      )}

      {/* Empty State */}
      {!selectedDrug && drugs.length === 0 && !isLoading && (
        <div className="text-center py-8 text-muted-foreground">
          <Pill className="w-10 h-10 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Search for drugs by name or ICD-10 code</p>
        </div>
      )}
    </div>
  )
}
