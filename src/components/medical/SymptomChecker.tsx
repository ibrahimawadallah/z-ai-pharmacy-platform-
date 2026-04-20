'use client'

import { useState, useCallback } from 'react'
import { 
  Search, 
  Plus, 
  X, 
  Stethoscope, 
  AlertTriangle, 
  CheckCircle,
  Activity,
  Brain,
  Loader2
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface Symptom {
  id: string
  name: string
  severity: 'mild' | 'moderate' | 'severe'
  duration?: string
  description?: string
}

interface DiagnosisResult {
  possibleConditions: Array<{
    name: string
    probability: number
    matchingSymptoms: string[]
    recommendedTests?: string[]
  }>
  drugRecommendations: Array<{
    drugName: string
    indication: string
    contraindications: string[]
    warnings: string[]
    safety: 'safe' | 'caution' | 'contraindicated'
  }>
  alerts: string[]
  aiAnalysis: string
}

const commonSymptoms = [
  'Fever', 'Cough', 'Headache', 'Fatigue', 'Nausea', 
  'Chest pain', 'Shortness of breath', 'Dizziness', 
  'Abdominal pain', 'Rash', 'Joint pain', 'Sore throat'
]

export function SymptomChecker() {
  const [symptoms, setSymptoms] = useState<Symptom[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<DiagnosisResult | null>(null)
  const [patientContext, setPatientContext] = useState({
    age: '',
    gender: '',
    weight: '',
    allergies: '',
    conditions: ''
  })

  const addSymptom = useCallback((name: string, severity: Symptom['severity'] = 'moderate') => {
    const newSymptom: Symptom = {
      id: crypto.randomUUID(),
      name,
      severity,
    }
    setSymptoms(prev => [...prev, newSymptom])
    setInputValue('')
  }, [])

  const removeSymptom = useCallback((id: string) => {
    setSymptoms(prev => prev.filter(s => s.id !== id))
  }, [])

  const analyzeSymptoms = useCallback(async () => {
    if (symptoms.length === 0) return
    
    setIsAnalyzing(true)
    
    // Simulate AI analysis - in production, call the mini-service
    setTimeout(() => {
      const mockResult: DiagnosisResult = {
        possibleConditions: [
          {
            name: 'Viral Upper Respiratory Infection',
            probability: 75,
            matchingSymptoms: symptoms.filter(s => 
              ['fever', 'cough', 'sore throat', 'fatigue'].some(key => 
                s.name.toLowerCase().includes(key)
              )
            ).map(s => s.name),
            recommendedTests: ['CBC', 'CRP', 'Chest X-ray if indicated']
          },
          {
            name: 'Acute Bronchitis',
            probability: 45,
            matchingSymptoms: symptoms.filter(s => 
              ['cough', 'chest pain', 'shortness of breath'].some(key => 
                s.name.toLowerCase().includes(key)
              )
            ).map(s => s.name),
            recommendedTests: ['Chest X-ray', 'Sputum culture']
          }
        ].filter(c => c.matchingSymptoms.length > 0),
        
        drugRecommendations: [
          {
            drugName: 'Acetaminophen',
            indication: 'Fever and pain management',
            contraindications: patientContext.allergies.toLowerCase().includes('acetaminophen') ? ['Known allergy'] : [],
            warnings: patientContext.conditions.toLowerCase().includes('liver') ? ['Use with caution in liver disease'] : [],
            safety: 'safe'
          },
          {
            drugName: 'Amoxicillin',
            indication: 'Bacterial infection (if confirmed)',
            contraindications: patientContext.allergies.toLowerCase().includes('penicillin') ? ['Penicillin allergy'] : [],
            warnings: ['Only if bacterial infection confirmed'],
            safety: patientContext.allergies.toLowerCase().includes('penicillin') ? 'contraindicated' : 'caution'
          }
        ],
        
        alerts: symptoms.some(s => s.severity === 'severe') 
          ? ['Severe symptoms detected - Consider urgent care evaluation'] 
          : [],
        
        aiAnalysis: `Based on the reported symptoms (${symptoms.map(s => s.name).join(', ')}), 
          the most likely diagnosis is a viral respiratory infection. 
          The patient should be monitored for worsening symptoms. 
          ${patientContext.allergies ? `Note: Patient has reported allergies to ${patientContext.allergies}` : ''}`
      }
      
      setResult(mockResult)
      setIsAnalyzing(false)
    }, 2000)
  }, [symptoms, patientContext])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return 'bg-green-100 text-green-800 border-green-300'
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'severe': return 'bg-red-100 text-red-800 border-red-300'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSafetyColor = (safety: string) => {
    switch (safety) {
      case 'safe': return 'bg-green-100 text-green-800'
      case 'caution': return 'bg-yellow-100 text-yellow-800'
      case 'contraindicated': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
          <Stethoscope className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold">AI Symptom Checker</h2>
          <p className="text-sm text-gray-500">Enter symptoms for AI-powered differential diagnosis</p>
        </div>
      </div>

      {/* Patient Context */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Patient Information
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <input
            type="number"
            placeholder="Age"
            value={patientContext.age}
            onChange={(e) => setPatientContext(prev => ({ ...prev, age: e.target.value }))}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
          />
          <select
            value={patientContext.gender}
            onChange={(e) => setPatientContext(prev => ({ ...prev, gender: e.target.value }))}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
          >
            <option value="">Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <input
            type="number"
            placeholder="Weight (kg)"
            value={patientContext.weight}
            onChange={(e) => setPatientContext(prev => ({ ...prev, weight: e.target.value }))}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
          />
          <input
            type="text"
            placeholder="Allergies"
            value={patientContext.allergies}
            onChange={(e) => setPatientContext(prev => ({ ...prev, allergies: e.target.value }))}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
          />
        </div>
        <textarea
          placeholder="Existing medical conditions..."
          value={patientContext.conditions}
          onChange={(e) => setPatientContext(prev => ({ ...prev, conditions: e.target.value }))}
          className="w-full mt-3 px-3 py-2 border border-gray-200 rounded-lg text-sm"
          rows={2}
        />
      </Card>

      {/* Symptom Input */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Symptoms</h3>
        
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && inputValue.trim()) {
                  addSymptom(inputValue.trim())
                }
              }}
              placeholder="Type symptom and press Enter..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Button 
            onClick={() => inputValue.trim() && addSymptom(inputValue.trim())}
            disabled={!inputValue.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Common Symptoms */}
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-2">Common symptoms:</p>
          <div className="flex flex-wrap gap-2">
            {commonSymptoms.map(symptom => (
              <button
                key={symptom}
                onClick={() => addSymptom(symptom)}
                className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
              >
                {symptom}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Symptoms */}
        <div className="flex flex-wrap gap-2">
          {symptoms.map((symptom) => (
            <div 
              key={symptom.id}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full border ${getSeverityColor(symptom.severity)}`}
            >
              <span className="text-sm font-medium">{symptom.name}</span>
              <select
                value={symptom.severity}
                onChange={(e) => {
                  setSymptoms(prev => prev.map(s => 
                    s.id === symptom.id ? { ...s, severity: e.target.value as Symptom['severity'] } : s
                  ))
                }}
                className="text-xs bg-transparent border-none focus:outline-none cursor-pointer"
              >
                <option value="mild">Mild</option>
                <option value="moderate">Moderate</option>
                <option value="severe">Severe</option>
              </select>
              <button 
                onClick={() => removeSymptom(symptom.id)}
                className="ml-1 hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {symptoms.length === 0 && (
            <p className="text-gray-400 text-sm">No symptoms added yet</p>
          )}
        </div>

        {/* Analyze Button */}
        <Button 
          onClick={analyzeSymptoms}
          disabled={symptoms.length === 0 || isAnalyzing}
          className="w-full mt-4 h-12"
          size="lg"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              AI Analyzing Symptoms...
            </>
          ) : (
            <>
              <Brain className="h-5 w-5 mr-2" />
              Analyze with AI
            </>
          )}
        </Button>
      </Card>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Alerts */}
          {result.alerts.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-800">Important Alerts</h4>
                  {result.alerts.map((alert, idx) => (
                    <p key={idx} className="text-red-700 text-sm mt-1">{alert}</p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Possible Conditions */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-500" />
              Possible Conditions
            </h3>
            <div className="space-y-3">
              {result.possibleConditions.map((condition, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{condition.name}</h4>
                    <Badge variant={condition.probability > 50 ? 'default' : 'secondary'}>
                      {condition.probability}% match
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Matching symptoms: {condition.matchingSymptoms.join(', ')}
                  </p>
                  {condition.recommendedTests && (
                    <p className="text-sm text-blue-600">
                      Recommended: {condition.recommendedTests.join(', ')}
                    </p>
                  )}
                </div>
              ))}
              {result.possibleConditions.length === 0 && (
                <p className="text-gray-500 text-sm">No matching conditions found</p>
              )}
            </div>
          </Card>

          {/* Drug Recommendations */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Drug Recommendations
            </h3>
            <div className="space-y-3">
              {result.drugRecommendations.map((drug, idx) => (
                <div key={idx} className={`border rounded-lg p-3 ${getSafetyColor(drug.safety)}`}>
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold">{drug.drugName}</h4>
                    <Badge className={getSafetyColor(drug.safety)}>
                      {drug.safety.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm mb-2">{drug.indication}</p>
                  {drug.contraindications.length > 0 && (
                    <p className="text-sm text-red-700 mb-1">
                      ⚠️ Contraindications: {drug.contraindications.join(', ')}
                    </p>
                  )}
                  {drug.warnings.length > 0 && (
                    <p className="text-sm text-amber-700">
                      ⚡ Warnings: {drug.warnings.join(', ')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* AI Analysis */}
          <Card className="p-4 bg-blue-50 border-blue-200">
            <h3 className="font-semibold mb-2 flex items-center gap-2 text-blue-800">
              <Brain className="h-4 w-4" />
              AI Clinical Analysis
            </h3>
            <p className="text-blue-800 text-sm whitespace-pre-line">{result.aiAnalysis}</p>
          </Card>
        </div>
      )}
    </div>
  )
}
