'use client'

import { useState, useCallback, useEffect } from 'react'
import { 
  AlertTriangle, 
  CheckCircle, 
  Plus, 
  X, 
  Search,
  Pill,
  AlertOctagon,
  Info,
  Brain,
  Loader2,
  Sparkles,
  Database
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface DrugInteraction {
  drug1: string
  drug2: string
  severity: 'mild' | 'moderate' | 'severe'
  description: string
  mechanism: string
  recommendation: string
}

interface AIAnalysisResult {
  aiPowered: boolean
  summary: string
  interactions: Array<{
    drugs?: string[]
    severity: string
    mechanism: string
    description: string
    recommendation: string
  }>
  alternativeDrugs?: Array<{
    originalDrug: string
    alternatives: string[]
    reason: string
  }>
  clinicalPearls?: string[]
  monitoringParameters?: string[]
  note?: string
}

interface InteractionDatabase {
  [drugName: string]: {
    [interactingDrug: string]: {
      severity: 'mild' | 'moderate' | 'severe'
      description: string
      mechanism: string
      recommendation: string
    }
  }
}

export function DrugInteractionChecker() {
  const [drugs, setDrugs] = useState<string[]>([])
  const [inputValue, setInputValue] = useState('')
  const [interactions, setInteractions] = useState<DrugInteraction[]>([])
  const [interactionDB, setInteractionDB] = useState<InteractionDatabase>({})
  const [isLoading, setIsLoading] = useState(true)
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [activeTab, setActiveTab] = useState('database')
  const [patientContext, setPatientContext] = useState({
    age: '',
    renalFunction: 'normal',
    liverFunction: 'normal'
  })

  // Check local database interactions
  const checkLocalInteractions = useCallback((drugList: string[]) => {
    const found: DrugInteraction[] = []
    
    // Check all pairs
    for (let i = 0; i < drugList.length; i++) {
      for (let j = i + 1; j < drugList.length; j++) {
        const drug1 = drugList[i].toLowerCase()
        const drug2 = drugList[j].toLowerCase()
        
        // Check both directions in database
        const dbDrug1 = Object.keys(interactionDB).find(k => k.toLowerCase() === drug1)
        const dbDrug2 = Object.keys(interactionDB).find(k => k.toLowerCase() === drug2)
        
        if (dbDrug1 && interactionDB[dbDrug1][drug2]) {
          found.push({
            drug1: drugList[i],
            drug2: drugList[j],
            ...interactionDB[dbDrug1][drug2]
          })
        } else if (dbDrug2 && interactionDB[dbDrug2][drug1]) {
          found.push({
            drug1: drugList[i],
            drug2: drugList[j],
            ...interactionDB[dbDrug2][drug1]
          })
        }
      }
    }
    
    setInteractions(found)
  }, [interactionDB])

  // AI-powered analysis
  const performAIAnalysis = useCallback(async () => {
    if (drugs.length < 2) return
    
    setIsAnalyzing(true)
    
    try {
      const response = await fetch('/api/ai/drug-interaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          drugs,
          patientContext: patientContext.age ? {
            age: parseInt(patientContext.age),
            renalFunction: patientContext.renalFunction,
            liverFunction: patientContext.liverFunction
          } : undefined
        })
      })
      
      if (response.ok) {
        const result = await response.json()
        setAiAnalysis(result)
      }
    } catch (error) {
      console.error('AI Analysis failed:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }, [drugs, patientContext])

  const addDrug = useCallback(() => {
    if (inputValue.trim() && !drugs.includes(inputValue.trim())) {
      const newDrugs = [...drugs, inputValue.trim()]
      setDrugs(newDrugs)
      checkLocalInteractions(newDrugs)
      setAiAnalysis(null) // Clear AI analysis when drugs change
      setInputValue('')
    }
  }, [inputValue, drugs, checkLocalInteractions])

  const removeDrug = useCallback((drug: string) => {
    const newDrugs = drugs.filter(d => d !== drug)
    setDrugs(newDrugs)
    checkLocalInteractions(newDrugs)
    setAiAnalysis(null)
  }, [drugs, checkLocalInteractions])

  // Load interaction database
  useEffect(() => {
    fetch('/data/drug-interactions.json')
      .then(res => res.json())
      .then(data => {
        setInteractionDB(data)
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  const severityConfig = {
    mild: { color: 'bg-yellow-100 text-yellow-800 border-yellow-300', icon: Info, label: 'MILD' },
    moderate: { color: 'bg-orange-100 text-orange-800 border-orange-300', icon: AlertTriangle, label: 'MODERATE' },
    severe: { color: 'bg-red-100 text-red-800 border-red-300', icon: AlertOctagon, label: 'SEVERE' }
  }

  const commonDrugs = [
    'Aspirin', 'Warfarin', 'Metformin', 'Lisinopril', 
    'Atorvastatin', 'Omeprazole', 'Amlodipine', 'Paracetamol',
    'Ibuprofen', 'Amoxicillin', 'Prednisone'
  ]

  const hasSevereInteraction = interactions.some(i => i.severity === 'severe') ||
    aiAnalysis?.interactions.some(i => i.severity === 'severe')

  if (isLoading) {
    return (
      <Card className="p-8 text-center">
        <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto" />
        <p className="mt-2 text-gray-500">Loading interaction database...</p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${hasSevereInteraction ? 'bg-red-600 animate-pulse' : 'bg-red-600'}`}>
          <AlertOctagon className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold">Drug Interaction Checker</h2>
          <p className="text-sm text-gray-500">
            Database + AI-powered interaction analysis
          </p>
        </div>
        {aiAnalysis?.aiPowered && (
          <Badge className="bg-purple-100 text-purple-800">
            <Sparkles className="h-3 w-3 mr-1" />
            AI Enhanced
          </Badge>
        )}
      </div>

      {/* Patient Context */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-sm mb-3 text-blue-800">Patient Context (Optional for AI Analysis)</h3>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-blue-700 block mb-1">Age</label>
            <input
              type="number"
              placeholder="Years"
              value={patientContext.age}
              onChange={(e) => setPatientContext(prev => ({ ...prev, age: e.target.value }))}
              className="w-full px-3 py-2 border border-blue-200 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-blue-700 block mb-1">Renal Function</label>
            <select
              value={patientContext.renalFunction}
              onChange={(e) => setPatientContext(prev => ({ ...prev, renalFunction: e.target.value }))}
              className="w-full px-3 py-2 border border-blue-200 rounded-lg text-sm"
            >
              <option value="normal">Normal</option>
              <option value="mild">Mild Impairment</option>
              <option value="moderate">Moderate Impairment</option>
              <option value="severe">Severe Impairment</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-blue-700 block mb-1">Liver Function</label>
            <select
              value={patientContext.liverFunction}
              onChange={(e) => setPatientContext(prev => ({ ...prev, liverFunction: e.target.value }))}
              className="w-full px-3 py-2 border border-blue-200 rounded-lg text-sm"
            >
              <option value="normal">Normal</option>
              <option value="mild">Mild Impairment</option>
              <option value="moderate">Moderate Impairment</option>
              <option value="severe">Severe Impairment</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Input Section */}
      <Card className="p-4">
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addDrug()}
              placeholder="Enter drug name (e.g., Warfarin)..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <Button onClick={addDrug} disabled={!inputValue.trim()} size="lg">
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        {/* Quick Add */}
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2">Quick add:</p>
          <div className="flex flex-wrap gap-2">
            {commonDrugs.map(drug => (
              <button
                key={drug}
                onClick={() => {
                  if (!drugs.includes(drug)) {
                    const newDrugs = [...drugs, drug]
                    setDrugs(newDrugs)
                    checkLocalInteractions(newDrugs)
                    setAiAnalysis(null)
                  }
                }}
                disabled={drugs.includes(drug)}
                className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 rounded-lg transition-colors"
              >
                <Pill className="h-3 w-3 inline mr-1" />
                {drug}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Drugs */}
        <div className="flex flex-wrap gap-2">
          {drugs.map((drug) => (
            <div 
              key={drug}
              className="flex items-center gap-1 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg"
            >
              <Pill className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-800">{drug}</span>
              <button 
                onClick={() => removeDrug(drug)}
                className="ml-1 text-blue-600 hover:text-red-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          {drugs.length === 0 && (
            <p className="text-gray-400 text-sm">Add drugs to check interactions</p>
          )}
        </div>

        {drugs.length >= 2 && (
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Checking {drugs.length} drugs for {((drugs.length * (drugs.length - 1)) / 2)} possible interactions...
            </p>
            <Button 
              onClick={performAIAnalysis}
              disabled={isAnalyzing}
              variant="outline"
              className="bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  AI Analyzing...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  {aiAnalysis ? 'Re-analyze with AI' : 'Analyze with AI'}
                </>
              )}
            </Button>
          </div>
        )}
      </Card>

      {/* Results Tabs */}
      {drugs.length >= 2 && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="database" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Database Results
              {interactions.length > 0 && (
                <Badge variant="destructive" className="ml-1">{interactions.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              AI Analysis
              {aiAnalysis && (
                <Badge className="bg-purple-100 text-purple-800 ml-1">Ready</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="database" className="space-y-4">
            {interactions.length > 0 ? (
              <Card className="p-4 border-red-200">
                <div className="flex items-center gap-2 mb-4">
                  <AlertOctagon className="h-5 w-5 text-red-600" />
                  <h3 className="font-semibold text-red-800">
                    Found {interactions.length} Interaction{interactions.length > 1 ? 's' : ''}
                  </h3>
                </div>
                
                <div className="space-y-3">
                  {interactions.map((interaction, idx) => {
                    const config = severityConfig[interaction.severity]
                    const Icon = config.icon
                    
                    return (
                      <div 
                        key={idx}
                        className={`p-4 rounded-lg border-l-4 ${config.color}`}
                      >
                        <div className="flex items-start gap-3">
                          <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className={config.color}>{config.label}</Badge>
                              <span className="font-semibold">
                                {interaction.drug1} + {interaction.drug2}
                              </span>
                            </div>
                            
                            <p className="text-sm mb-2">{interaction.description}</p>
                            
                            <div className="text-sm">
                              <span className="font-medium">Mechanism:</span>{' '}
                              <span className="opacity-90">{interaction.mechanism}</span>
                            </div>
                            
                            <div className="mt-2 p-2 bg-white/50 rounded text-sm">
                              <span className="font-medium flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                Recommendation:
                              </span>{' '}
                              {interaction.recommendation}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Card>
            ) : (
              <Card className="p-6 text-center bg-green-50 border-green-200">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-green-800">No Database Interactions Found</h3>
                <p className="text-green-700 text-sm mt-1">
                  No known interactions in local database.
                </p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="ai" className="space-y-4">
            {isAnalyzing ? (
              <Card className="p-8 text-center">
                <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-purple-600" />
                <p className="text-lg font-medium">AI Analyzing Drug Interactions...</p>
                <p className="text-sm text-gray-500 mt-2">
                  Checking metabolic pathways, protein binding, and pharmacodynamic interactions
                </p>
              </Card>
            ) : aiAnalysis ? (
              <>
                {/* AI Summary */}
                <Card className={`p-4 border-l-4 ${
                  aiAnalysis.interactions.some(i => i.severity === 'severe') 
                    ? 'border-red-500 bg-red-50' 
                    : aiAnalysis.interactions.some(i => i.severity === 'moderate')
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-green-500 bg-green-50'
                }`}>
                  <div className="flex items-start gap-3">
                    <Brain className="h-5 w-5 mt-0.5" />
                    <div>
                      <h3 className="font-semibold">AI Analysis Summary</h3>
                      <p className="text-sm mt-1">{aiAnalysis.summary}</p>
                      {aiAnalysis.note && (
                        <p className="text-xs text-gray-600 mt-2 italic">{aiAnalysis.note}</p>
                      )}
                    </div>
                  </div>
                </Card>

                {/* AI Interactions */}
                {aiAnalysis.interactions.length > 0 && (
                  <Card className="p-4">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <AlertOctagon className="h-4 w-4 text-red-500" />
                      AI-Detected Interactions
                    </h3>
                    <div className="space-y-3">
                      {aiAnalysis.interactions.map((interaction, idx) => (
                        <div 
                          key={idx}
                          className={`p-3 rounded-lg border-l-4 ${
                            interaction.severity === 'severe' 
                              ? 'bg-red-50 border-red-500' 
                              : interaction.severity === 'moderate'
                                ? 'bg-orange-50 border-orange-500'
                                : 'bg-yellow-50 border-yellow-500'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={
                              interaction.severity === 'severe' 
                                ? 'bg-red-100 text-red-800' 
                                : interaction.severity === 'moderate'
                                  ? 'bg-orange-100 text-orange-800'
                                  : 'bg-yellow-100 text-yellow-800'
                            }>
                              {interaction.severity.toUpperCase()}
                            </Badge>
                            {interaction.drugs && (
                              <span className="font-medium">{interaction.drugs.join(' + ')}</span>
                            )}
                          </div>
                          <p className="text-sm">{interaction.description}</p>
                          <p className="text-xs text-gray-600 mt-1">
                            <span className="font-medium">Mechanism:</span> {interaction.mechanism}
                          </p>
                          <p className="text-xs text-gray-600">
                            <span className="font-medium">Recommendation:</span> {interaction.recommendation}
                          </p>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Clinical Pearls */}
                {aiAnalysis.clinicalPearls && aiAnalysis.clinicalPearls.length > 0 && (
                  <Card className="p-4 bg-blue-50 border-blue-200">
                    <h3 className="font-semibold mb-2 text-blue-800 flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Clinical Pearls
                    </h3>
                    <ul className="space-y-1">
                      {aiAnalysis.clinicalPearls.map((pearl, idx) => (
                        <li key={idx} className="text-sm text-blue-700 flex items-start gap-2">
                          <span className="text-blue-400">•</span>
                          {pearl}
                        </li>
                      ))}
                    </ul>
                  </Card>
                )}

                {/* Monitoring */}
                {aiAnalysis.monitoringParameters && aiAnalysis.monitoringParameters.length > 0 && (
                  <Card className="p-4">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      Monitoring Parameters
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {aiAnalysis.monitoringParameters.map((param, idx) => (
                        <Badge key={idx} variant="outline" className="text-sm">
                          {param}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Alternatives */}
                {aiAnalysis.alternativeDrugs && aiAnalysis.alternativeDrugs.length > 0 && (
                  <Card className="p-4">
                    <h3 className="font-semibold mb-2">Alternative Drug Suggestions</h3>
                    <div className="space-y-2">
                      {aiAnalysis.alternativeDrugs.map((alt, idx) => (
                        <div key={idx} className="p-2 bg-gray-50 rounded">
                          <p className="text-sm font-medium">Instead of: {alt.originalDrug}</p>
                          <p className="text-xs text-gray-600">{alt.reason}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {alt.alternatives.map((a, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {a}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </>
            ) : (
              <Card className="p-8 text-center">
                <Brain className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">Click "Analyze with AI" for comprehensive interaction analysis</p>
                <p className="text-sm text-gray-400 mt-2">
                  AI checks metabolic pathways, pharmacodynamics, and patient-specific factors
                </p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}

      {/* Safety Legend */}
      <div className="flex gap-4 justify-center text-xs">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-yellow-400 rounded-full" />
          Mild - Monitor
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-orange-400 rounded-full" />
          Moderate - Caution
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-red-500 rounded-full" />
          Severe - Avoid
        </span>
      </div>
    </div>
  )
}
