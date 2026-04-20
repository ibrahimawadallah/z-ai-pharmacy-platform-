'use client'

import { useState, useCallback } from 'react'
import { AlertTriangle, X, Plus, Search, Loader2, Brain } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface Drug {
  id: string
  name: string
  dosage?: string
}

interface Interaction {
  severity: 'mild' | 'moderate' | 'severe' | 'contraindicated'
  drug1: string
  drug2: string
  description: string
  mechanism?: string
  recommendation: string
}

interface AIAnalysisResult {
  aiPowered: boolean
  summary: string
  interactions: Interaction[]
  note?: string
}

interface QuickInteractionCheckerProps {
  onAnalyze?: (drugs: Drug[]) => Promise<Interaction[]>
}

const severityColors = {
  mild: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  moderate: 'bg-orange-100 text-orange-800 border-orange-300',
  severe: 'bg-red-100 text-red-800 border-red-300',
  contraindicated: 'bg-red-600 text-white border-red-700'
}

export function QuickInteractionChecker() {
  const [drugs, setDrugs] = useState<Drug[]>([])
  const [inputValue, setInputValue] = useState('')
  const [interactions, setInteractions] = useState<Interaction[]>([])
  const [isChecking, setIsChecking] = useState(false)
  const [showEmergency, setShowEmergency] = useState(false)
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(null)
  const [useAI, setUseAI] = useState(true)

  const addDrug = useCallback(() => {
    if (inputValue.trim()) {
      const newDrug: Drug = {
        id: crypto.randomUUID(),
        name: inputValue.trim(),
        dosage: ''
      }
      setDrugs(prev => [...prev, newDrug])
      setInputValue('')
    }
  }, [inputValue])

  const removeDrug = useCallback((id: string) => {
    setDrugs(prev => prev.filter(d => d.id !== id))
  }, [])

  const checkInteractions = useCallback(async () => {
    if (drugs.length < 2) return
    
    setIsChecking(true)
    setAiAnalysis(null)
    
    try {
      if (useAI) {
        // Call AI API
        const response = await fetch('/api/ai/drug-interaction', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            drugs: drugs.map(d => d.name)
          })
        })
        
        if (response.ok) {
          const result: AIAnalysisResult = await response.json()
          setAiAnalysis(result)
          setInteractions(result.interactions.map(i => {
            const interaction: Interaction = {
              severity: i.severity,
              drug1: (i as any).drugs?.[0] || i.drug1,
              drug2: (i as any).drugs?.[1] || i.drug2,
              description: i.description,
              recommendation: i.recommendation
            }
            return interaction
          }))
          
          const hasCritical = result.interactions.some(i => 
            i.severity === 'contraindicated' || i.severity === 'severe'
          )
          setShowEmergency(hasCritical)
        } else {
          // Fallback to local
          performLocalCheck()
        }
      } else {
        performLocalCheck()
      }
    } catch (error) {
      console.error('Interaction check failed:', error)
      performLocalCheck()
    } finally {
      setIsChecking(false)
    }
  }, [drugs, useAI])

  const performLocalCheck = () => {
    // Local fallback checking common interactions
    const drugNames = drugs.map(d => d.name.toLowerCase())
    const found: Interaction[] = []
    
    // Check for common interactions
    const hasWarfarin = drugNames.some(n => n.includes('warfarin'))
    const hasAspirin = drugNames.some(n => n.includes('aspirin'))
    const hasMetformin = drugNames.some(n => n.includes('metformin'))
    const hasACEI = drugNames.some(n => ['lisinopril', 'enalapril', 'captopril'].some(a => n.includes(a)))
    const hasDiuretic = drugNames.some(n => ['furosemide', 'hctz', 'hydrochlorothiazide'].some(d => n.includes(d)))
    const hasNSAID = drugNames.some(n => ['ibuprofen', 'naproxen', 'diclofenac'].some(nsa => n.includes(nsa)))
    const hasStatin = drugNames.some(n => ['atorvastatin', 'simvastatin', 'rosuvastatin'].some(s => n.includes(s)))
    const hasAzole = drugNames.some(n => ['ketoconazole', 'fluconazole', 'itraconazole'].some(a => n.includes(a)))
    
    if (hasWarfarin && hasAspirin) {
      found.push({
        severity: 'severe',
        drug1: 'Warfarin',
        drug2: 'Aspirin',
        description: 'Increased risk of major bleeding',
        mechanism: 'Additive anticoagulant effect',
        recommendation: 'Avoid combination unless specifically indicated; monitor INR closely'
      })
    }
    
    if (hasMetformin && (hasACEI || hasDiuretic) && hasNSAID) {
      found.push({
        severity: 'contraindicated',
        drug1: 'Metformin + ACE-I/ARB + NSAID',
        drug2: 'Triple combination',
        description: 'Increased risk of acute kidney injury and lactic acidosis',
        mechanism: 'Triple whammy effect on renal perfusion',
        recommendation: 'Avoid triple combination; hold NSAID or adjust diabetes regimen'
      })
    }
    
    if (hasStatin && hasAzole) {
      found.push({
        severity: 'moderate',
        drug1: 'Statin',
        drug2: 'Azole antifungal',
        description: 'Increased statin levels, risk of myopathy',
        mechanism: 'CYP3A4 inhibition',
        recommendation: 'Use lowest statin dose or temporarily hold during antifungal therapy'
      })
    }
    
    // Demo if no real interactions found
    if (found.length === 0 && drugs.length >= 2) {
      found.push({
        severity: 'mild',
        drug1: drugs[0].name,
        drug2: drugs[1].name,
        description: 'No major interactions detected in local database',
        recommendation: 'Continue monitoring; consult AI analysis for comprehensive check'
      })
    }
    
    setInteractions(found)
    const hasCritical = found.some(i => i.severity === 'contraindicated' || i.severity === 'severe')
    setShowEmergency(hasCritical)
    
    setAiAnalysis({
      aiPowered: false,
      summary: `Found ${found.length} potential interaction(s) via local database check`,
      interactions: found,
      note: 'Limited local database - use AI analysis for comprehensive screening'
    })
  }

  const clearAll = useCallback(() => {
    setDrugs([])
    setInteractions([])
    setShowEmergency(false)
  }, [])

  return (
    <div className="space-y-4">
      {/* Emergency Alert Banner */}
      {showEmergency && (
        <div className="bg-red-600 text-white p-4 rounded-lg shadow-lg animate-pulse">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6" />
            <div className="flex-1">
              <h3 className="font-bold text-lg">CRITICAL DRUG INTERACTION DETECTED</h3>
              <p className="text-red-100">Do not dispense without physician approval</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowEmergency(false)}
              className="text-white hover:bg-red-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Search className="h-5 w-5" />
            Quick Interaction Check
          </h3>
          <Button
            size="sm"
            variant={useAI ? 'default' : 'outline'}
            onClick={() => setUseAI(!useAI)}
            className={useAI ? 'bg-purple-600' : ''}
          >
            <Brain className="h-4 w-4 mr-1" />
            {useAI ? 'AI On' : 'AI Off'}
          </Button>
        </div>

        {/* Drug Input */}
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addDrug()}
            placeholder="Type drug name and press Enter..."
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button onClick={addDrug} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Drug List */}
        <div className="flex flex-wrap gap-2 mb-4">
          {drugs.map((drug) => (
            <Badge 
              key={drug.id} 
              variant="secondary"
              className="px-3 py-1 text-sm flex items-center gap-1"
            >
              {drug.name}
              <button 
                onClick={() => removeDrug(drug.id)}
                className="ml-1 hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {drugs.length === 0 && (
            <p className="text-gray-400 text-sm">Add 2 or more drugs to check interactions</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            onClick={checkInteractions}
            disabled={drugs.length < 2 || isChecking}
            className="flex-1"
          >
            {isChecking ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Checking...
              </>
            ) : (
              'Check Interactions'
            )}
          </Button>
          {drugs.length > 0 && (
            <Button onClick={clearAll} variant="outline">
              Clear
            </Button>
          )}
        </div>
      </Card>

      {/* Interaction Results */}
      {interactions.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold">Interaction Results ({interactions.length})</h4>
            {aiAnalysis && (
              <Badge className={aiAnalysis.aiPowered ? 'bg-purple-100 text-purple-800' : 'bg-gray-100'}>
                {aiAnalysis.aiPowered ? 'AI Analysis' : 'Local Check'}
              </Badge>
            )}
          </div>
          
          {aiAnalysis?.summary && (
            <p className="text-sm text-gray-600 mb-3">{aiAnalysis.summary}</p>
          )}
          
          <div className="space-y-3">
            {interactions.map((interaction, idx) => (
              <div 
                key={idx}
                className={`p-3 rounded-lg border ${severityColors[interaction.severity]}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant={interaction.severity === 'contraindicated' ? 'destructive' : 'default'}>
                    {interaction.severity.toUpperCase()}
                  </Badge>
                  <span className="font-medium">
                    {interaction.drug1} + {interaction.drug2}
                  </span>
                </div>
                <p className="text-sm mb-1">{interaction.description}</p>
                {interaction.mechanism && (
                  <p className="text-xs text-gray-600 mb-1">Mechanism: {interaction.mechanism}</p>
                )}
                <p className="text-sm font-medium">
                  Recommendation: {interaction.recommendation}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
