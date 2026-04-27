'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckCircle, XCircle, Clock, AlertTriangle, Shield, Filter } from 'lucide-react'

interface ICD10Mapping {
  id: string
  icd10Code: string
  description: string
  source: string
  confidence: string
  evidenceLevel: string
  isValidated: boolean
  requiresReview: boolean
  drugId: string
  drug: {
    packageName: string
    genericName: string
  }
}

export default function PharmacistValidationPage() {
  const [mappings, setMappings] = useState<ICD10Mapping[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'validated'>('pending')
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    validated: 0,
    tier1: 0,
    tier2: 0,
    tier3: 0
  })

  useEffect(() => {
    fetchMappings()
  }, [filter])

  const fetchMappings = async () => {
    try {
      setLoading(true)
      const url = filter === 'all' 
        ? '/api/admin/icd10-validation' 
        : `/api/admin/icd10-validation?status=${filter}`
      
      const response = await fetch(url)
      const data = await response.json()
      
      if (data.success) {
        setMappings(data.data.mappings)
        setStats(data.data.stats)
      }
    } catch (error) {
      console.error('Error fetching mappings:', error)
    } finally {
      setLoading(false)
    }
  }

  const validateMapping = async (mappingId: string, approved: boolean) => {
    try {
      const response = await fetch('/api/admin/icd10-validation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mappingId, approved })
      })
      
      if (response.ok) {
        // Refresh mappings
        fetchMappings()
      }
    } catch (error) {
      console.error('Error validating mapping:', error)
    }
  }

  const getSourceBadge = (source: string) => {
    const badges = {
      'FDA_SPL': { label: 'FDA', color: 'bg-blue-100 text-blue-800' },
      'WHO_ATC': { label: 'WHO', color: 'bg-green-100 text-green-800' },
      'RXNORM_MESH': { label: 'RxNorm', color: 'bg-purple-100 text-purple-800' },
      'THERAPEUTIC_INFERENCE': { label: 'Inference', color: 'bg-orange-100 text-orange-800' }
    }
    return badges[source as keyof typeof badges] || { label: source, color: 'bg-gray-100 text-gray-800' }
  }

  const getConfidenceBadge = (confidence: string) => {
    const badges = {
      'HIGH': { label: 'High', color: 'bg-green-100 text-green-800' },
      'MEDIUM': { label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
      'LOW': { label: 'Low', color: 'bg-red-100 text-red-800' }
    }
    return badges[confidence as keyof typeof badges] || { label: confidence, color: 'bg-gray-100 text-gray-800' }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">ICD-10 Validation Workflow</h1>
            <p className="text-gray-600 mt-1">Pharmacist review and approval of drug-indication mappings</p>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-cyan-600" />
            <Badge variant="outline" className="text-sm">Clinical Review Mode</Badge>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Mappings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Validated</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.validated}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Tier 1 (FDA/DailyMed)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.tier1}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Tier 2 (WHO/RxNorm)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.tier2}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Tabs */}
        <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
          <TabsList>
            <TabsTrigger value="pending">Pending Review</TabsTrigger>
            <TabsTrigger value="validated">Validated</TabsTrigger>
            <TabsTrigger value="all">All Mappings</TabsTrigger>
          </TabsList>

          <TabsContent value={filter} className="space-y-4">
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : mappings.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-gray-500">
                  No mappings found for this filter
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {mappings.map((mapping) => (
                  <Card key={mapping.id} className="border-l-4 border-l-orange-400">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="font-semibold text-lg">{mapping.drug.packageName}</h3>
                            <Badge variant="outline" className="text-xs">{mapping.drug.genericName}</Badge>
                            {mapping.requiresReview && (
                              <Badge className="bg-orange-100 text-orange-800">
                                <Clock className="w-3 h-3 mr-1" />
                                Needs Review
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2 mb-3">
                            <Badge className={`font-mono ${getSourceBadge(mapping.source).color}`}>
                              {mapping.icd10Code}
                            </Badge>
                            <span className="text-gray-700">{mapping.description}</span>
                          </div>

                          <div className="flex items-center gap-2 text-sm">
                            <Badge className={getSourceBadge(mapping.source).color}>
                              {getSourceBadge(mapping.source).label}
                            </Badge>
                            <Badge className={getConfidenceBadge(mapping.confidence).color}>
                              {getConfidenceBadge(mapping.confidence).label} Confidence
                            </Badge>
                            <span className="text-gray-500">
                              Evidence: {mapping.evidenceLevel}
                            </span>
                          </div>
                        </div>

                        {!mapping.isValidated && (
                          <div className="flex gap-2 ml-4">
                            <Button
                              size="sm"
                              onClick={() => validateMapping(mapping.id, true)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => validateMapping(mapping.id, false)}
                              className="border-red-300 text-red-600 hover:bg-red-50"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
