'use client'

import { useState, useEffect } from 'react'
import { 
  BookOpen, 
  AlertTriangle, 
  Info,
  CheckCircle,
  X,
  Heart,
  Baby,
  Activity,
  Loader2,
  Pill,
  DollarSign,
  Building2,
  Search
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'

interface UAEDrug {
  id: string
  drugCode: string
  packageName: string
  genericName: string
  strength: string
  dosageForm: string
  routeOfAdministration: string
  priceDirham: number | null
  packagePricePublic: number | null
  status: string
  includedInThiqaABM: string
  includedInBasic: string
  manufacturer: string | null
  icd10Codes: Array<{
    code: string
    description: string
    category: string
  }>
  interactions: Array<{
    id: string
    drugId: string
    interactingDrugId: string
    severity: string
    mechanism: string
    recommendation: string
  }>
  sideEffects: Array<{
    id: string
    sideEffect: string
    frequency: string
  }>
}

interface DrugMonographViewerProps {
  drugName: string
  onClose?: () => void
}

export function DrugMonographViewer({ drugName, onClose }: DrugMonographViewerProps) {
  const [drug, setDrug] = useState<UAEDrug | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchResults, setSearchResults] = useState<UAEDrug[]>([])

  useEffect(() => {
    if (!drugName) return

    const fetchDrug = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const response = await fetch(`/api/drugs/search?q=${encodeURIComponent(drugName)}&limit=5`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch drug data')
        }
        
        const data = await response.json()
        
        if (data.data && data.data.length > 0) {
          setDrug(data.data[0])
          setSearchResults(data.data)
        } else {
          setError(`Drug "${drugName}" not found in UAE database`)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load drug data')
      } finally {
        setLoading(false)
      }
    }

    fetchDrug()
  }, [drugName])

  if (loading) {
    return (
      <Card className="p-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-gray-500">Loading from UAE Ministry of Health Database...</p>
        </div>
      </Card>
    )
  }

  if (error || !drug) {
    return (
      <Card className="p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-6 w-6 text-amber-500 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-amber-800">Drug Not Found</h3>
            <p className="text-sm text-amber-600">{error || `Drug "${drugName}" not found`}</p>
            
            {searchResults.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Similar drugs found:</p>
                <div className="space-y-2">
                  {searchResults.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => setDrug(result)}
                      className="w-full text-left p-3 bg-white border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="font-medium">{result.packageName}</div>
                      <div className="text-sm text-gray-500">{result.genericName} • {result.strength}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-4 text-xs text-gray-500">
              Source: UAE Ministry of Health Drug Database (20,000+ medications)
            </div>
          </div>
          {onClose && (
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Pill className="h-5 w-5" />
              <span className="text-xs font-medium bg-white/20 px-2 py-0.5 rounded">
                {drug.drugCode}
              </span>
              <Badge className={drug.status === 'Active' ? 'bg-green-400 text-green-900' : 'bg-gray-400'}>
                {drug.status}
              </Badge>
            </div>
            <h2 className="text-xl font-bold">{drug.packageName}</h2>
            <p className="text-blue-100 text-sm">{drug.genericName}</p>
            <div className="flex items-center gap-4 mt-2 text-sm">
              <span>{drug.strength}</span>
              <span>•</span>
              <span>{drug.dosageForm}</span>
              <span>•</span>
              <span>{drug.routeOfAdministration}</span>
            </div>
          </div>
          {onClose && (
            <button onClick={onClose} className="text-white/80 hover:text-white">
              <X className="h-6 w-6" />
            </button>
          )}
        </div>
      </div>

      {/* UAE Formulary Badges */}
      <div className="px-4 py-2 bg-gray-50 border-b flex gap-2">
        {drug.includedInThiqaABM === 'Yes' && (
          <Badge className="bg-purple-100 text-purple-800">Thiqa Formulary</Badge>
        )}
        {drug.includedInBasic === 'Yes' && (
          <Badge className="bg-blue-100 text-blue-800">Basic Formulary</Badge>
        )}
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 px-4 pt-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="indications">Indications</TabsTrigger>
          <TabsTrigger value="safety">Safety</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 text-blue-700 mb-1">
                <Building2 className="h-4 w-4" />
                <span className="font-medium text-sm">Manufacturer</span>
              </div>
              <p className="text-sm">{drug.manufacturer || 'Not specified'}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 text-green-700 mb-1">
                <Pill className="h-4 w-4" />
                <span className="font-medium text-sm">Dosage Form</span>
              </div>
              <p className="text-sm">{drug.dosageForm}</p>
            </div>
          </div>

          {drug.icd10Codes && drug.icd10Codes.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Approved Indications (ICD-10)
              </h4>
              <div className="space-y-1">
                {drug.icd10Codes.slice(0, 5).map((icd, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2 bg-gray-50 rounded text-sm">
                    <Badge variant="outline" className="text-xs">{icd.code}</Badge>
                    <span className="line-clamp-2">{icd.description}</span>
                  </div>
                ))}
                {drug.icd10Codes.length > 5 && (
                  <p className="text-sm text-gray-500 text-center">+{drug.icd10Codes.length - 5} more indications</p>
                )}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="pricing" className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <DollarSign className="h-5 w-5" />
                <span className="font-medium">Price (Dirham)</span>
              </div>
              <p className="text-2xl font-bold text-green-600">
                {drug.priceDirham ? `AED ${drug.priceDirham.toFixed(2)}` : 'N/A'}
              </p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <DollarSign className="h-5 w-5" />
                <span className="font-medium">Public Package Price</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">
                {drug.packagePricePublic ? `AED ${drug.packagePricePublic.toFixed(2)}` : 'N/A'}
              </p>
            </Card>
          </div>
          
          <div className="text-sm text-gray-500">
            <p>Pricing data from UAE Ministry of Health</p>
            <p>Formulary status determines insurance coverage</p>
          </div>
        </TabsContent>

        <TabsContent value="indications" className="p-4">
          {drug.icd10Codes && drug.icd10Codes.length > 0 ? (
            <div className="space-y-2">
              {drug.icd10Codes.map((icd, idx) => (
                <div key={idx} className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-start gap-3">
                    <Badge className="bg-blue-100 text-blue-800">{icd.code}</Badge>
                    <div>
                      <p className="font-medium">{icd.description}</p>
                      <p className="text-sm text-gray-500">{icd.category}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No ICD-10 indications mapped for this drug</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="safety" className="p-4 space-y-4">
          {drug.interactions && drug.interactions.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2 text-amber-700">
                <AlertTriangle className="h-4 w-4" />
                Drug Interactions ({drug.interactions.length})
              </h4>
              <div className="space-y-2">
                {drug.interactions.slice(0, 3).map((interaction, idx) => (
                  <div key={idx} className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={
                        interaction.severity === 'contraindicated' ? 'bg-red-600' :
                        interaction.severity === 'major' ? 'bg-red-500' :
                        interaction.severity === 'moderate' ? 'bg-yellow-500' :
                        'bg-blue-500'
                      }>
                        {interaction.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-gray-700">{interaction.mechanism}</p>
                    <p className="text-gray-600 mt-1">Recommendation: {interaction.recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {drug.sideEffects && drug.sideEffects.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Info className="h-4 w-4" />
                Side Effects ({drug.sideEffects.length})
              </h4>
              <div className="space-y-1">
                {drug.sideEffects.slice(0, 5).map((se, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                    <span>{se.sideEffect}</span>
                    <Badge variant="outline" className="text-xs">{se.frequency}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(!drug.interactions || drug.interactions.length === 0) && 
           (!drug.sideEffects || drug.sideEffects.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No interaction or side effect data available</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="px-4 py-2 bg-gray-50 text-xs text-gray-500 flex items-center justify-between">
        <span>UAE Ministry of Health Drug Database</span>
        <span>Drug Code: {drug.drugCode}</span>
      </div>
    </Card>
  )
}

