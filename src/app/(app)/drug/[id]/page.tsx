'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Pill, ArrowLeft, Heart, Activity, AlertTriangle, 
  Package, DollarSign, Building2, FileText, Clock,
  Star, Share2, Printer, Shield, CheckCircle, ExternalLink
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton, SkeletonCard, SkeletonText } from '@/components/ui/skeleton-enhanced'
import { PregnancySafetyPanel } from '@/components/medical/PregnancySafetyPanel'
import { G6PDSafetyAlert } from '@/components/medical/G6PDSafetyAlert'
import { WeightBasedDoseCalculator } from '@/components/medical/WeightBasedDoseCalculator'

interface Drug {
  id: string
  drugCode: string
  packageName: string
  genericName: string
  strength: string
  dosageForm: string
  packageSize: string
  dispenseMode: string
  packagePricePublic: number
  packagePricePharmacy: number
  unitPricePublic: number
  unitPricePharmacy: number
  status: string
  agentName: string
  manufacturerName: string
  govtFundedCoverage: string
  uppScope: string
  includedInThiqaABM: string
  includedInBasic: string
  includedInABM1: string
  includedInABM7: string
  pregnancyCategory?: string
  pregnancyPrecautions?: string
  breastfeedingSafety?: string
  g6pdSafety?: string
  g6pdWarning?: string
  baseDoseMgPerKg?: number
  baseDoseIndication?: string
  icd10Codes?: Array<{ icd10Code: string; description: string }>
}

export default function DrugDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [drug, setDrug] = useState<Drug | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [interactions, setInteractions] = useState<any[]>([])
  const [sideEffects, setSideEffects] = useState<any[]>([])

  useEffect(() => {
    const fetchDrug = async () => {
      try {
        const res = await fetch(`/api/drugs/${params.id}`)
        const data = await res.json()
        if (data.success && data.data) {
          setDrug(data.data)
          // Use data already included in the response
          setInteractions(data.data.interactions || [])
          setSideEffects(data.data.sideEffects || [])
        } else {
          setError('Drug not found')
        }
      } catch (e) {
        setError('Failed to load drug details')
      } finally {
        setLoading(false)
      }
    }
    if (params.id) fetchDrug()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <SkeletonText lines={2} />
          </div>
          <SkeletonCard />
          <div className="grid grid-cols-2 gap-4">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </div>
    )
  }

  if (error || !drug) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">{error || 'Drug not found'}</h2>
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  const FormularyBadges = () => (
    <div className="flex flex-wrap gap-2">
      {drug.includedInBasic === 'Yes' && (
        <Badge className="bg-primary text-white border-primary hover:bg-primary/90 transition-colors">Daman Basic</Badge>
      )}
      {drug.includedInABM1 === 'Yes' && (
        <Badge className="bg-primary text-white border-primary hover:bg-primary/90 transition-colors">ABM 1</Badge>
      )}
      {drug.includedInABM7 === 'Yes' && (
        <Badge className="bg-primary text-white border-primary hover:bg-primary/90 transition-colors">ABM 7</Badge>
      )}
      {drug.includedInThiqaABM === 'Yes' && (
        <Badge className="bg-primary text-white border-primary hover:bg-primary/90 transition-colors">Thiqa/ABM</Badge>
      )}
      {drug.govtFundedCoverage === 'Yes' && (
        <Badge className="bg-primary text-white border-primary hover:bg-primary/90 transition-colors">Govt Funded</Badge>
      )}
      {drug.includedInBasic === 'No' && drug.includedInABM1 === 'No' && drug.includedInABM7 === 'No' && drug.includedInThiqaABM === 'No' && (
        <Badge variant="secondary" className="bg-slate-200 text-slate-600 border-slate-300">Not Covered</Badge>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Badge variant={drug.status === 'Active' ? 'default' : 'secondary'} className={drug.status === 'Active' ? 'bg-primary' : ''}>
                  {drug.status}
                </Badge>
                <span className="text-sm text-slate-500">Code: {drug.drugCode}</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mt-1">{drug.packageName}</h1>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Share2 className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Printer className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Star className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white border border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <Pill className="w-5 h-5 text-blue-600" />
                  Drug Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Generic Name</p>
                    <p className="font-semibold text-slate-900">{drug.genericName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Strength</p>
                    <p className="font-semibold text-slate-900">{drug.strength || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Dosage Form</p>
                    <p className="font-semibold text-slate-900">{drug.dosageForm}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Package Size</p>
                    <p className="font-semibold text-slate-900">{drug.packageSize || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Dispense Mode</p>
                    <Badge variant="outline">{drug.dispenseMode || 'N/A'}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">UPP Scope</p>
                    <Badge variant={drug.uppScope === 'Yes' ? 'default' : 'secondary'} className={drug.uppScope === 'Yes' ? 'bg-blue-600' : ''}>
                      {drug.uppScope || 'N/A'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Clinical Safety Panels */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PregnancySafetyPanel 
                pregnancyCategory={drug.pregnancyCategory}
                pregnancyPrecautions={drug.pregnancyPrecautions}
                breastfeedingSafety={drug.breastfeedingSafety}
              />
              <G6PDSafetyAlert 
                g6pdSafety={drug.g6pdSafety}
                g6pdWarning={drug.g6pdWarning}
              />
            </div>

            {/* Dose Calculator */}
            <WeightBasedDoseCalculator 
              baseDoseMgPerKg={drug.baseDoseMgPerKg}
              baseDoseIndication={drug.baseDoseIndication}
              drugName={drug.packageName}
            />

            <Tabs defaultValue="interactions" className="space-y-4">
              <TabsList className="bg-white border border-slate-200 shadow-sm">
                <TabsTrigger value="interactions">Interactions</TabsTrigger>
                <TabsTrigger value="sideeffects">Side Effects</TabsTrigger>
                <TabsTrigger value="icd10">ICD-10</TabsTrigger>
                <TabsTrigger value="contraindications">Contraindications</TabsTrigger>
                <TabsTrigger value="dosing">Dosing</TabsTrigger>
              </TabsList>

              <TabsContent value="interactions">
                <Card className="bg-white border border-slate-200 shadow-sm">
                  <CardHeader className="border-b border-slate-100">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold text-slate-800">Drug Interactions</CardTitle>
                      <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200">
                        {interactions.length} interactions
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    {interactions.length === 0 ? (
                      <div className="text-center py-12">
                        <CheckCircle className="w-12 h-12 text-green-300 mx-auto mb-3" />
                        <p className="text-slate-500">No known interactions for this drug.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Group by severity */}
                        {(() => {
                          const severityOrder = ['severe', 'moderate', 'mild', 'unknown']
                          const grouped = interactions.reduce((acc, interaction) => {
                            const severity = interaction.severity || 'unknown'
                            if (!acc[severity]) acc[severity] = []
                            acc[severity].push(interaction)
                            return acc
                          }, {} as Record<string, any[]>)
                          
                          return severityOrder
                            .filter(severity => grouped[severity]?.length > 0)
                            .map(severity => (
                              <div key={severity} className="border border-slate-200 rounded-lg overflow-hidden">
                                <div className={`px-4 py-2 border-b border-slate-200 ${
                                  severity === 'severe' ? 'bg-red-50' :
                                  severity === 'moderate' ? 'bg-amber-50' :
                                  severity === 'mild' ? 'bg-blue-50' :
                                  'bg-slate-50'
                                }`}>
                                  <div className="flex items-center justify-between">
                                    <h5 className="text-sm font-medium text-slate-700 capitalize">{severity} ({grouped[severity].length})</h5>
                                    {severity === 'severe' && <AlertTriangle className="w-4 h-4 text-red-600" />}
                                  </div>
                                </div>
                                <div className="divide-y divide-slate-100">
                                  {grouped[severity].map((interaction, i) => (
                                    <div key={i} className="p-4 hover:bg-slate-50 transition-colors">
                                      <div className="space-y-3">
                                        <div className="flex items-start justify-between gap-4">
                                          <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                              <h6 className="text-sm font-medium text-slate-800">
                                                {interaction.secondaryDrugName || 'Unknown Drug'}
                                              </h6>
                                              {interaction.interactionType && (
                                                <Badge variant="outline" className="text-xs bg-slate-50 text-slate-600 border-slate-200">
                                                  {interaction.interactionType}
                                                </Badge>
                                              )}
                                            </div>
                                            {interaction.description && (
                                              <p className="text-sm text-slate-600 mt-1">{interaction.description}</p>
                                            )}
                                          </div>
                                        </div>
                                        
                                        {interaction.mechanism && (
                                          <div className="bg-slate-50 p-3 rounded-lg">
                                            <p className="text-xs text-slate-600">
                                              <span className="font-medium">Mechanism:</span> {interaction.mechanism}
                                            </p>
                                          </div>
                                        )}
                                        
                                        {interaction.management && (
                                          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                                            <p className="text-xs text-slate-700">
                                              <span className="font-medium text-blue-800">Management:</span> {interaction.management}
                                            </p>
                                          </div>
                                        )}
                                        
                                        {interaction.evidence && (
                                          <p className="text-xs text-slate-500 italic">
                                            Evidence: {interaction.evidence}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))
                        })()}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="sideeffects">
                <Card className="bg-white border border-slate-200 shadow-sm">
                  <CardHeader className="border-b border-slate-100">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold text-slate-800">Side Effects & Adverse Reactions</CardTitle>
                      <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200">
                        {sideEffects.length} effects
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    {sideEffects.length === 0 ? (
                      <div className="text-center py-12">
                        <AlertTriangle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500">No side effects data available for this drug.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Group by severity */}
                        {(() => {
                          const severityOrder = ['severe', 'moderate', 'mild', 'unknown']
                          const grouped = sideEffects.reduce((acc, se) => {
                            const severity = se.severity || 'unknown'
                            if (!acc[severity]) acc[severity] = []
                            acc[severity].push(se)
                            return acc
                          }, {} as Record<string, any[]>)
                          
                          return severityOrder
                            .filter(severity => grouped[severity]?.length > 0)
                            .map(severity => (
                              <div key={severity} className="border border-slate-200 rounded-lg overflow-hidden">
                                <div className={`px-4 py-2 border-b border-slate-200 ${
                                  severity === 'severe' ? 'bg-red-50' :
                                  severity === 'moderate' ? 'bg-amber-50' :
                                  severity === 'mild' ? 'bg-green-50' :
                                  'bg-slate-50'
                                }`}>
                                  <div className="flex items-center justify-between">
                                    <h5 className="text-sm font-medium text-slate-700 capitalize">{severity} ({grouped[severity].length})</h5>
                                    {severity === 'severe' && <AlertTriangle className="w-4 h-4 text-red-600" />}
                                  </div>
                                </div>
                                <div className="divide-y divide-slate-100">
                                  {grouped[severity].map((se, i) => (
                                    <div key={i} className="p-4 hover:bg-slate-50 transition-colors">
                                      <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2 mb-1">
                                            <h6 className="text-sm font-medium text-slate-800">{se.name || se.sideEffect}</h6>
                                            {se.frequency && (
                                              <Badge variant="outline" className="text-xs bg-slate-50 text-slate-600 border-slate-200">
                                                {se.frequency}
                                              </Badge>
                                            )}
                                          </div>
                                          {se.mechanism && (
                                            <p className="text-xs text-slate-500 mt-1">{se.mechanism}</p>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))
                        })()}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="icd10">
                <Card className="bg-white border border-slate-200 shadow-sm">
                  <CardHeader className="border-b border-slate-100">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold text-slate-800">ICD-10 Disease Mappings</CardTitle>
                      <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200">
                        {drug.icd10Codes?.length || 0} codes
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    {!drug.icd10Codes || drug.icd10Codes.length === 0 ? (
                      <div className="text-center py-12">
                        <Activity className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500">No ICD-10 mappings available for this drug.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Group by category */}
                        {(() => {
                          const grouped = drug.icd10Codes.reduce((acc, icd10) => {
                            const category = 'ICD-10 Codes'
                            if (!acc[category]) acc[category] = []
                            acc[category].push(icd10)
                            return acc
                          }, {} as Record<string, any[]>)
                          
                          return Object.entries(grouped).map(([category, codes]) => (
                            <div key={category} className="border border-slate-200 rounded-lg overflow-hidden">
                              <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
                                <h5 className="text-sm font-medium text-slate-700">{category}</h5>
                              </div>
                              <div className="divide-y divide-slate-100">
                                {codes.map((icd10, i) => (
                                  <div key={i} className="p-4 hover:bg-slate-50 transition-colors">
                                    <div className="flex items-start justify-between gap-4">
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                          <Badge className="bg-blue-50 text-blue-700 border-blue-200 font-mono text-xs">
                                            {icd10.icd10Code}
                                          </Badge>
                                          {icd10.badge && (
                                            <Badge className={`text-xs ${icd10.badge.color}`}>
                                              {icd10.badge.icon} {icd10.badge.label}
                                            </Badge>
                                          )}
                                        </div>
                                        <p className="text-sm text-slate-700">{icd10.description}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                          {icd10.source && (
                                            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                              {icd10.source}
                                            </span>
                                          )}
                                          {icd10.confidence && (
                                            <span className="text-xs text-slate-500">
                                              Confidence: {icd10.confidence}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                      <Link 
                                        href={`https://icd.who.int/browse/Search:${encodeURIComponent(icd10.icd10Code)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 flex-shrink-0"
                                      >
                                        WHO Reference
                                        <ExternalLink className="w-3 h-3" />
                                      </Link>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))
                        })()}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="contraindications">
                <Card className="bg-white border border-slate-200 shadow-sm">
                  <CardHeader className="border-b border-slate-100">
                    <CardTitle className="text-lg font-semibold text-slate-800">Contraindications</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="text-center py-12">
                      <AlertTriangle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500">Contraindication data not available.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="dosing">
                <Card className="bg-white border border-slate-200 shadow-sm">
                  <CardHeader className="border-b border-slate-100">
                    <CardTitle className="text-lg font-semibold text-slate-800">Dosing Guidelines</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="text-center py-12">
                      <Activity className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500 mb-4">Dosing guidelines not available.</p>
                      <Link href="/dosage" className="text-blue-600 hover:text-blue-800 font-medium">
                        Use dosage calculator →
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing */}
            <Card className="bg-white border border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <DollarSign className="w-5 h-5 text-primary" />
                  Pricing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-sm text-slate-600">Public Price</span>
                  <span className="text-xl font-bold text-slate-900">AED {drug.packagePricePublic?.toFixed(2) || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-sm text-slate-600">Pharmacy Price</span>
                  <span className="text-lg font-semibold text-slate-900">AED {drug.packagePricePharmacy?.toFixed(2) || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-slate-50 rounded-lg">
                  <span className="text-xs text-slate-500">Unit Price (Public)</span>
                  <span className="text-sm text-slate-700">AED {drug.unitPricePublic?.toFixed(2) || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-slate-50 rounded-lg">
                  <span className="text-xs text-slate-500">Unit Price (Pharmacy)</span>
                  <span className="text-sm text-slate-700">AED {drug.unitPricePharmacy?.toFixed(2) || 'N/A'}</span>
                </div>
              </CardContent>
            </Card>

            {/* Formulary Status */}
            <Card className="bg-white border border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <Shield className="w-5 h-5 text-blue-600" />
                  Daman Coverage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <FormularyBadges />
                <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-xs text-slate-500 mb-2">Coverage Summary</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 transition-all"
                        style={{ width: `${((drug.includedInBasic === 'Yes' ? 1 : 0) + (drug.includedInABM1 === 'Yes' ? 1 : 0) + (drug.includedInABM7 === 'Yes' ? 1 : 0) + (drug.includedInThiqaABM === 'Yes' ? 1 : 0)) / 4 * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-slate-600">
                      {((drug.includedInBasic === 'Yes' ? 1 : 0) + (drug.includedInABM1 === 'Yes' ? 1 : 0) + (drug.includedInABM7 === 'Yes' ? 1 : 0) + (drug.includedInThiqaABM === 'Yes' ? 1 : 0))}/4
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Manufacturer */}
            <Card className="bg-white border border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <Building2 className="w-5 h-5 text-slate-600" />
                  Manufacturer & Agent
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-slate-500">Manufacturer</p>
                  <p className="font-medium text-slate-900">{drug.manufacturerName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Agent</p>
                  <p className="font-medium text-slate-900">{drug.agentName || 'N/A'}</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gradient-to-br from-primary to-blue-600 text-white">
              <CardContent className="p-6 space-y-3">
                <h3 className="font-semibold">Need more information?</h3>
                <div className="space-y-2">
                  <Link href={`/interactions?drug=${drug.id}`}>
                    <Button variant="secondary" className="w-full justify-start" size="sm">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Check Interactions
                    </Button>
                  </Link>
                  <Link href={`/dosage?drug=${drug.id}&name=${encodeURIComponent(drug.packageName)}`}>
                    <Button variant="secondary" className="w-full justify-start" size="sm">
                      <Activity className="w-4 h-4 mr-2" />
                      Calculate Dosage
                    </Button>
                  </Link>
                  <Link href={`/drug/${drug.id}#sideeffects`}>
                    <Button variant="secondary" className="w-full justify-start" size="sm">
                      <Heart className="w-4 h-4 mr-2" />
                      View Side Effects
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}