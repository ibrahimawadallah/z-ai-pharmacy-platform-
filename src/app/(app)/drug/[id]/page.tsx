'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Pill, ArrowLeft, Heart, Activity, AlertTriangle, 
  Package, DollarSign, Building2, FileText, Clock,
  Star, Share2, Printer, Shield, CheckCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton, SkeletonCard, SkeletonText } from '@/components/ui/skeleton-enhanced'
import { LoadingSpinner } from '@/components/ui/progress-enhanced'
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
  const [loadingExtra, setLoadingExtra] = useState(false)

  useEffect(() => {
    const fetchDrug = async () => {
      try {
        const res = await fetch(`/api/drugs/${params.id}`)
        const data = await res.json()
        if (data.success && data.data) {
          setDrug(data.data)
          // Fetch interactions and side effects
          fetchDrugDetails(data.data.id)
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

  const fetchDrugDetails = async (drugId: string) => {
    setLoadingExtra(true)
    try {
      // Fetch interactions
      const interactionsRes = await fetch(`/api/drugs/${drugId}/interactions`)
      const interactionsData = await interactionsRes.json()
      setInteractions(interactionsData.data || [])

      // Fetch side effects
      const sideEffectsRes = await fetch(`/api/drugs/${drugId}/side-effects`)
      const sideEffectsData = await sideEffectsRes.json()
      setSideEffects(sideEffectsData.data || [])
    } catch (e) {
      console.error('Failed to fetch extra details:', e)
    } finally {
      setLoadingExtra(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
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
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{error || 'Drug not found'}</h2>
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
        <Badge className="bg-emerald-500 text-white border-emerald-600 hover:bg-emerald-600 transition-colors">Daman Basic</Badge>
      )}
      {drug.includedInABM1 === 'Yes' && (
        <Badge className="bg-blue-500 text-white border-blue-600 hover:bg-blue-600 transition-colors">ABM 1</Badge>
      )}
      {drug.includedInABM7 === 'Yes' && (
        <Badge className="bg-purple-500 text-white border-purple-600 hover:bg-purple-600 transition-colors">ABM 7</Badge>
      )}
      {drug.includedInThiqaABM === 'Yes' && (
        <Badge className="bg-amber-500 text-white border-amber-600 hover:bg-amber-600 transition-colors">Thiqa/ABM</Badge>
      )}
      {drug.govtFundedCoverage === 'Yes' && (
        <Badge className="bg-cyan-500 text-white border-cyan-600 hover:bg-cyan-600 transition-colors">Govt Funded</Badge>
      )}
      {drug.includedInBasic === 'No' && drug.includedInABM1 === 'No' && drug.includedInABM7 === 'No' && drug.includedInThiqaABM === 'No' && (
        <Badge variant="secondary" className="bg-slate-200 text-slate-600 border-slate-300">Not Covered</Badge>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Badge variant={drug.status === 'Active' ? 'default' : 'secondary'} className={drug.status === 'Active' ? 'bg-emerald-500' : ''}>
                  {drug.status}
                </Badge>
                <span className="text-sm text-gray-500">Code: {drug.drugCode}</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mt-1">{drug.packageName}</h1>
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white/90 backdrop-blur-sm shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="w-5 h-5 text-cyan-600" />
                  Drug Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Generic Name</p>
                    <p className="font-semibold text-gray-900">{drug.genericName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Strength</p>
                    <p className="font-semibold text-gray-900">{drug.strength || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Dosage Form</p>
                    <p className="font-semibold text-gray-900">{drug.dosageForm}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Package Size</p>
                    <p className="font-semibold text-gray-900">{drug.packageSize || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Dispense Mode</p>
                    <Badge variant="outline">{drug.dispenseMode || 'N/A'}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">UPP Scope</p>
                    <Badge variant={drug.uppScope === 'Yes' ? 'default' : 'secondary'} className={drug.uppScope === 'Yes' ? 'bg-cyan-500' : ''}>
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
              <TabsList className="bg-white shadow-sm">
                <TabsTrigger value="interactions">Interactions</TabsTrigger>
                <TabsTrigger value="sideeffects">Side Effects</TabsTrigger>
                <TabsTrigger value="icd10">ICD-10</TabsTrigger>
                <TabsTrigger value="contraindications">Contraindications</TabsTrigger>
                <TabsTrigger value="dosing">Dosing</TabsTrigger>
              </TabsList>

              <TabsContent value="interactions">
                <Card className="bg-white/90 backdrop-blur-sm shadow-md">
                  <CardContent className="p-6">
                    {loadingExtra ? (
                      <div className="flex justify-center py-8"><LoadingSpinner /></div>
                    ) : interactions.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">
                        No known interactions for this drug.
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {interactions.map((interaction, i) => (
                          <div key={i} className={`p-4 rounded-lg border ${
                            interaction.severity === 'severe' 
                              ? 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800'
                              : interaction.severity === 'moderate'
                              ? 'bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800'
                              : 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800'
                          }`}>
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-semibold text-sm">{interaction.secondaryDrugName || 'Unknown Drug'}</h4>
                              <Badge className={
                                interaction.severity === 'severe'
                                  ? 'bg-red-600 text-white'
                                  : interaction.severity === 'moderate'
                                  ? 'bg-amber-600 text-white'
                                  : 'bg-blue-600 text-white'
                              }>
                                {interaction.severity || 'Unknown'}
                              </Badge>
                            </div>
                            {interaction.description && (
                              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{interaction.description}</p>
                            )}
                            {interaction.management && (
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                <span className="font-semibold">Management:</span> {interaction.management}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="sideeffects">
                <Card className="bg-white/90 backdrop-blur-sm shadow-md">
                  <CardContent className="p-6">
                    {loadingExtra ? (
                      <div className="flex justify-center py-8"><LoadingSpinner /></div>
                    ) : sideEffects.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">
                        No side effects data available for this drug.
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {sideEffects.map((se, i) => (
                          <div key={i} className={`p-4 rounded-lg border ${
                            se.severity === 'severe'
                              ? 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800'
                              : se.severity === 'moderate'
                              ? 'bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800'
                              : 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800'
                          }`}>
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-semibold text-sm">{se.name || 'Unknown Side Effect'}</h4>
                              <Badge className={
                                se.severity === 'severe'
                                  ? 'bg-red-600 text-white'
                                  : se.severity === 'moderate'
                                  ? 'bg-amber-600 text-white'
                                  : 'bg-green-600 text-white'
                              }>
                                {se.severity || 'Unknown'}
                              </Badge>
                            </div>
                            {se.description && (
                              <p className="text-sm text-gray-600 dark:text-gray-300">{se.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="icd10">
                <Card className="bg-white/90 backdrop-blur-sm shadow-md">
                  <CardContent className="p-6">
                    {!drug.icd10Codes || drug.icd10Codes.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">
                        No ICD-10 mappings available for this drug.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-gray-900">Related Diagnoses (ICD-10)</h4>
                          <Badge variant="outline">{drug.icd10Codes.length} codes</Badge>
                        </div>
                        <div className="grid gap-2">
                          {drug.icd10Codes.map((icd10, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                              <div className="flex items-center gap-3">
                                <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 font-mono">
                                  {icd10.icd10Code}
                                </Badge>
                                <div className="flex flex-col">
                                  <span className="text-sm text-gray-700 dark:text-gray-300">{icd10.description}</span>
                                  {icd10.badge && (
                                    <Badge className={`text-xs mt-1 ${icd10.badge.color}`}>
                                      {icd10.badge.icon} {icd10.badge.label}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {icd10.source && (
                                  <Badge variant="outline" className="text-xs">
                                    {icd10.source}
                                  </Badge>
                                )}
                                <Link 
                                  href={`https://icd.who.int/browse/Search:${encodeURIComponent(icd10.icd10Code)}`}
                                  target="_blank"
                                  className="text-xs text-cyan-600 hover:underline"
                                >
                                  WHO Ref →
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="contraindications">
                <Card className="bg-white/90 backdrop-blur-sm shadow-md">
                  <CardContent className="p-6">
                    <p className="text-gray-500 text-center py-8">
                      Contraindication data not available.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="dosing">
                <Card className="bg-white/90 backdrop-blur-sm shadow-md">
                  <CardContent className="p-6">
                    <p className="text-gray-500 text-center py-8">
                      Dosing guidelines not available. <Link href="/dosage" className="text-cyan-600 hover:underline">Use dosage calculator →</Link>
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing */}
            <Card className="bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-950/50 dark:to-cyan-950/50 border-emerald-200 dark:border-emerald-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                  <DollarSign className="w-5 h-5" />
                  Pricing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-white dark:bg-slate-800 rounded-lg border border-emerald-200 dark:border-emerald-700">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Public Price</span>
                  <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">AED {drug.packagePricePublic?.toFixed(2) || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white dark:bg-slate-800 rounded-lg border border-cyan-200 dark:border-cyan-700">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Pharmacy Price</span>
                  <span className="text-lg font-semibold text-cyan-600 dark:text-cyan-400">AED {drug.packagePricePharmacy?.toFixed(2) || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Unit Price (Public)</span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">AED {drug.unitPricePublic?.toFixed(2) || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Unit Price (Pharmacy)</span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">AED {drug.unitPricePharmacy?.toFixed(2) || 'N/A'}</span>
                </div>
              </CardContent>
            </Card>

            {/* Formulary Status */}
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                  <Shield className="w-5 h-5" />
                  Daman Coverage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <FormularyBadges />
                <div className="mt-4 p-3 bg-white dark:bg-slate-800 rounded-lg border border-blue-200 dark:border-blue-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Coverage Summary</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 transition-all"
                        style={{ width: `${((drug.includedInBasic === 'Yes' ? 1 : 0) + (drug.includedInABM1 === 'Yes' ? 1 : 0) + (drug.includedInABM7 === 'Yes' ? 1 : 0) + (drug.includedInThiqaABM === 'Yes' ? 1 : 0)) / 4 * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                      {((drug.includedInBasic === 'Yes' ? 1 : 0) + (drug.includedInABM1 === 'Yes' ? 1 : 0) + (drug.includedInABM7 === 'Yes' ? 1 : 0) + (drug.includedInThiqaABM === 'Yes' ? 1 : 0))}/4
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Manufacturer */}
            <Card className="bg-white/90 backdrop-blur-sm shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-cyan-600" />
                  Manufacturer & Agent
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Manufacturer</p>
                  <p className="font-medium text-gray-900">{drug.manufacturerName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Agent</p>
                  <p className="font-medium text-gray-900">{drug.agentName || 'N/A'}</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gradient-to-br from-cyan-600 to-blue-600 text-white">
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