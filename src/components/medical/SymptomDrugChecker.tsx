'use client'

import { useState, useCallback } from 'react'
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Pill,
  Stethoscope,
  ArrowRight,
  ShieldAlert,
  Info
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface DrugSafetyCheck {
  drugName: string
  isSafe: boolean
  contraindicatedSymptoms: string[]
  warnings: string[]
  alternatives: string[]
  reasoning: string
}

interface SymptomDrugCheckerProps {
  symptoms: string[]
  patientConditions?: string[]
  patientAllergies?: string[]
}

// Drug-symptom contraindications database
const drugSymptomContraindications: Record<string, { symptoms: string[]; reason: string }[]> = {
  'Aspirin': [
    { symptoms: ['cough', 'shortness of breath', 'chest pain'], reason: 'May worsen respiratory symptoms in sensitive patients' },
    { symptoms: ['stomach pain', 'nausea', 'vomiting'], reason: 'NSAID - can cause GI irritation' }
  ],
  'Ibuprofen': [
    { symptoms: ['stomach pain', 'nausea'], reason: 'NSAID contraindicated with GI symptoms' },
    { symptoms: ['fever with rash'], reason: 'Risk of severe skin reactions' }
  ],
  'Metformin': [
    { symptoms: ['nausea', 'vomiting', 'dehydration'], reason: 'Risk of lactic acidosis with dehydration' }
  ],
  'ACE Inhibitors': [
    { symptoms: ['cough'], reason: 'ACE inhibitors commonly cause dry cough' }
  ],
  'Antibiotics': [
    { symptoms: ['diarrhea'], reason: 'Can worsen antibiotic-associated diarrhea' }
  ],
  'Decongestants': [
    { symptoms: ['high blood pressure', 'chest pain', 'heart palpitations'], reason: 'Can increase blood pressure and heart rate' }
  ],
  'Codeine': [
    { symptoms: ['respiratory distress', 'shortness of breath'], reason: 'Can depress respiratory function' }
  ]
}

const commonDrugs = [
  'Paracetamol', 'Aspirin', 'Ibuprofen', 'Amoxicillin', 'Metformin',
  'Atorvastatin', 'Amlodipine', 'Omeprazole', 'Cetirizine', 'Salbutamol'
]

const getAlternatives = (drug: string, contras: { symptoms: string[]; reason: string }[]): string[] => {
  const alternatives: Record<string, string[]> = {
    'Aspirin': ['Paracetamol', 'Celecoxib (if NSAID needed)'],
    'Ibuprofen': ['Paracetamol', 'Naproxen'],
    'ACE Inhibitors': ['ARBs (Losartan, Valsartan)'],
    'Decongestants': ['Saline nasal spray', 'Antihistamines'],
    'Codeine': ['Dextromethorphan', 'Benzonatate']
  }
  return alternatives[drug] || ['Consult formulary for alternatives']
}

export function SymptomDrugChecker({ 
  symptoms, 
  patientConditions = [], 
  patientAllergies = [] 
}: SymptomDrugCheckerProps) {
  const [selectedDrug, setSelectedDrug] = useState('')
  const [checkResult, setCheckResult] = useState<DrugSafetyCheck | null>(null)
  const [isChecking, setIsChecking] = useState(false)

  const checkDrugSafety = useCallback((drugName: string) => {
    setIsChecking(true)
    
    // Simulate API call
    setTimeout(() => {
      const contraindications = drugSymptomContraindications[drugName] || []
      const matchingContraindications = contraindications.filter(c => 
        c.symptoms.some(s => symptoms.some(sym => sym.toLowerCase().includes(s.toLowerCase())))
      )

      // Check allergies
      const allergyMatch = patientAllergies.some(allergy => 
        drugName.toLowerCase().includes(allergy.toLowerCase()) ||
        allergy.toLowerCase().includes(drugName.toLowerCase())
      )

      const result: DrugSafetyCheck = {
        drugName,
        isSafe: matchingContraindications.length === 0 && !allergyMatch,
        contraindicatedSymptoms: matchingContraindications.flatMap(c => c.symptoms),
        warnings: matchingContraindications.map(c => c.reason),
        alternatives: getAlternatives(drugName, matchingContraindications),
        reasoning: allergyMatch 
          ? `CONTRAINDICATED: Patient has allergy to ${drugName}`
          : matchingContraindications.length > 0
            ? `WARNING: ${matchingContraindications.map(c => c.reason).join('; ')}`
            : 'SAFE: No contraindications found for reported symptoms'
      }

      setCheckResult(result)
      setIsChecking(false)
    }, 800)
  }, [symptoms, patientAllergies])

  if (symptoms.length === 0) {
    return (
      <Card className="p-6 text-center">
        <Info className="h-12 w-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-500">Add symptoms first to check drug safety</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <ShieldAlert className="h-5 w-5 text-amber-500" />
        <h3 className="font-semibold">Drug-Symptom Safety Check</h3>
      </div>

      {/* Current Symptoms Display */}
      <div className="bg-gray-50 p-3 rounded-lg">
        <p className="text-sm text-gray-600 mb-2">Current symptoms:</p>
        <div className="flex flex-wrap gap-1">
          {symptoms.map((symptom, idx) => (
            <Badge key={idx} variant="secondary" className="text-xs">
              {symptom}
            </Badge>
          ))}
        </div>
      </div>

      {/* Drug Selector */}
      <Card className="p-4">
        <label className="text-sm font-medium mb-2 block">Select drug to check:</label>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {commonDrugs.map(drug => (
            <button
              key={drug}
              onClick={() => {
                setSelectedDrug(drug)
                checkDrugSafety(drug)
              }}
              className={`px-3 py-2 text-sm rounded-lg border transition-colors text-left ${
                selectedDrug === drug 
                  ? 'bg-blue-50 border-blue-500 text-blue-700' 
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <Pill className="h-3 w-3 inline mr-1" />
              {drug}
            </button>
          ))}
        </div>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={selectedDrug}
            onChange={(e) => setSelectedDrug(e.target.value)}
            placeholder="Or type drug name..."
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
          />
          <Button 
            onClick={() => selectedDrug && checkDrugSafety(selectedDrug)}
            disabled={!selectedDrug || isChecking}
            size="sm"
          >
            {isChecking ? 'Checking...' : 'Check'}
          </Button>
        </div>
      </Card>

      {/* Results */}
      {checkResult && (
        <Card className={`p-4 border-l-4 ${
          checkResult.isSafe 
            ? 'border-l-green-500 bg-green-50' 
            : 'border-l-red-500 bg-red-50'
        }`}>
          <div className="flex items-start gap-3">
            {checkResult.isSafe ? (
              <CheckCircle className="h-6 w-6 text-green-600 mt-0.5" />
            ) : (
              <XCircle className="h-6 w-6 text-red-600 mt-0.5" />
            )}
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-bold text-lg">{checkResult.drugName}</h4>
                <Badge className={checkResult.isSafe ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {checkResult.isSafe ? 'SAFE' : 'CONTRAINDICATED'}
                </Badge>
              </div>

              <p className={`text-sm mb-3 ${checkResult.isSafe ? 'text-green-800' : 'text-red-800'}`}>
                {checkResult.reasoning}
              </p>

              {checkResult.contraindicatedSymptoms.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm font-medium text-red-700 mb-1">Conflicting symptoms:</p>
                  <div className="flex flex-wrap gap-1">
                    {checkResult.contraindicatedSymptoms.map((sym, idx) => (
                      <Badge key={idx} variant="destructive" className="text-xs">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {sym}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {checkResult.warnings.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm font-medium text-amber-700 mb-1">Warnings:</p>
                  <ul className="text-sm text-amber-800 space-y-1">
                    {checkResult.warnings.map((warning, idx) => (
                      <li key={idx} className="flex items-start gap-1">
                        <span className="text-amber-500">⚠</span>
                        {warning}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {!checkResult.isSafe && checkResult.alternatives.length > 0 && (
                <div className="mt-3 pt-3 border-t border-red-200">
                  <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                    <ArrowRight className="h-4 w-4" />
                    Consider alternatives:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {checkResult.alternatives.map((alt, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedDrug(alt.split(' ')[0])
                          checkDrugSafety(alt.split(' ')[0])
                        }}
                        className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm hover:bg-blue-50 hover:border-blue-300 transition-colors"
                      >
                        <Stethoscope className="h-3 w-3 inline mr-1" />
                        {alt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Safety Legend */}
      <div className="text-xs text-gray-500 flex gap-4 justify-center">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-green-500 rounded-full" />
          Safe
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-red-500 rounded-full" />
          Contraindicated
        </span>
      </div>
    </div>
  )
}
