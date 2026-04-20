'use client'

import { useState, useCallback } from 'react'
import { 
  Baby, 
  Calculator, 
  Weight, 
  AlertCircle,
  Info,
  CheckCircle,
  Loader2,
  Search
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface DosingResult {
  drugName: string
  doseMg: number
  doseMl?: number
  frequency: string
  maxDose: number
  warning?: string
  basedOn: string
}

interface UAEDrug {
  id: string
  drugCode: string
  packageName: string
  genericName: string
  strength: string
  dosageForm: string
  status: string
}

interface PediatricDosingCalculatorProps {
  onDoseCalculated?: (result: DosingResult) => void
}

// Pediatric dosing guidelines for common drugs (aligned with UAE formulary)
const pediatricDosingDB: Record<string, {
  mgPerKg: number
  maxMg: number
  frequency: string
  concentrationMgPerMl?: number
  ageLimit?: string
  contraindications?: string[]
}> = {
  'paracetamol': {
    mgPerKg: 15,
    maxMg: 1000,
    frequency: 'Every 4-6 hours as needed',
    concentrationMgPerMl: 120,
    ageLimit: 'All ages'
  },
  'acetaminophen': {
    mgPerKg: 15,
    maxMg: 1000,
    frequency: 'Every 4-6 hours as needed',
    concentrationMgPerMl: 160,
    ageLimit: 'All ages'
  },
  'ibuprofen': {
    mgPerKg: 10,
    maxMg: 800,
    frequency: 'Every 6-8 hours with food',
    concentrationMgPerMl: 100,
    ageLimit: '> 6 months',
    contraindications: ['Dehydration', 'Kidney disease', 'GI bleeding']
  },
  'amoxicillin': {
    mgPerKg: 45,
    maxMg: 4000,
    frequency: 'Twice daily',
    concentrationMgPerMl: 400,
    ageLimit: 'All ages'
  },
  'cephalexin': {
    mgPerKg: 25,
    maxMg: 4000,
    frequency: 'Four times daily',
    concentrationMgPerMl: 250,
    ageLimit: 'All ages'
  },
  'azithromycin': {
    mgPerKg: 10,
    maxMg: 500,
    frequency: 'Once daily for 3-5 days',
    concentrationMgPerMl: 200,
    ageLimit: '> 6 months'
  },
  'prednisolone': {
    mgPerKg: 1,
    maxMg: 60,
    frequency: 'Once or twice daily',
    concentrationMgPerMl: 15,
    ageLimit: 'All ages',
    contraindications: ['Systemic fungal infection', 'Active infection']
  },
  'ondansetron': {
    mgPerKg: 0.15,
    maxMg: 8,
    frequency: 'Every 6-8 hours as needed',
    concentrationMgPerMl: 2,
    ageLimit: '> 6 months',
    contraindications: ['Long QT syndrome']
  },
  'diphenhydramine': {
    mgPerKg: 1,
    maxMg: 50,
    frequency: 'Every 6 hours as needed',
    concentrationMgPerMl: 12.5,
    ageLimit: '> 2 years',
    contraindications: ['Asthma', 'Glaucoma', 'Urinary retention']
  },
  'salbutamol': {
    mgPerKg: 0.1,
    maxMg: 8,
    frequency: 'Every 4-6 hours as needed',
    concentrationMgPerMl: 2,
    ageLimit: 'All ages'
  }
}

const commonPediatricDrugs = [
  'Paracetamol', 'Ibuprofen', 'Amoxicillin', 'Azithromycin', 
  'Prednisolone', 'Ondansetron', 'Salbutamol'
]

export function PediatricDosingCalculator({ onDoseCalculated }: PediatricDosingCalculatorProps) {
  const [weight, setWeight] = useState('')
  const [age, setAge] = useState('')
  const [drugName, setDrugName] = useState('')
  const [result, setResult] = useState<DosingResult | null>(null)
  const [warning, setWarning] = useState<string | null>(null)
  const [searchResults, setSearchResults] = useState<UAEDrug[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedDrug, setSelectedDrug] = useState<UAEDrug | null>(null)

  const calculateDose = useCallback(() => {
    const weightKg = parseFloat(weight)
    const ageMonths = parseInt(age)
    
    if (!weightKg || !drugName) return
    
    const drugData = pediatricDosingDB[drugName.toLowerCase()]
    
    if (!drugData) {
      setWarning('Drug not found in pediatric database. Please consult a reference.')
      setResult(null)
      return
    }
    
    // Check age restrictions
    if (drugData.ageLimit?.includes('>')) {
      const minAge = parseInt(drugData.ageLimit.replace(/[^0-9]/g, ''))
      const unit = drugData.ageLimit.includes('month') ? 'months' : 'years'
      const ageInMonths = unit === 'years' ? ageMonths * 12 : ageMonths
      
      if (ageInMonths < minAge) {
        setWarning(`This drug is contraindicated under ${drugData.ageLimit}. Consult pediatric specialist.`)
        return
      }
    }
    
    // Calculate dose
    const calculatedDose = weightKg * drugData.mgPerKg
    const finalDose = Math.min(calculatedDose, drugData.maxMg)
    
    // Calculate volume if liquid formulation available
    let doseMl: number | undefined
    if (drugData.concentrationMgPerMl) {
      doseMl = finalDose / drugData.concentrationMgPerMl
      // Round to 0.1 ml for practical dosing
      doseMl = Math.round(doseMl * 10) / 10
    }
    
    const dosingResult: DosingResult = {
      drugName,
      doseMg: Math.round(finalDose * 10) / 10,
      doseMl,
      frequency: drugData.frequency,
      maxDose: drugData.maxMg,
      basedOn: `${drugData.mgPerKg} mg/kg × ${weightKg} kg = ${calculatedDose.toFixed(1)} mg (capped at ${drugData.maxMg} mg)`,
      warning: drugData.contraindications?.length 
        ? `Cautions: ${drugData.contraindications.join(', ')}` 
        : undefined
    }
    
    setResult(dosingResult)
    setWarning(null)
    
    if (onDoseCalculated) {
      onDoseCalculated(dosingResult)
    }
  }, [weight, age, drugName, onDoseCalculated])

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center">
          <Baby className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Pediatric Dosing</h2>
          <p className="text-sm text-gray-500">Weight-based dose calculator (UAE formulary)</p>
        </div>
      </div>

      {/* Patient Info */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Weight className="h-4 w-4" />
          Patient Information
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-gray-600 block mb-1">Weight (kg)</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="e.g., 15"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 block mb-1">Age (months)</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="e.g., 24"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
            />
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Tip: Age is used to check age restrictions and calculate weight-based doses
        </p>
      </Card>

      {/* Drug Selection */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Select Drug</h3>
        
        {/* Quick Select */}
        <div className="flex flex-wrap gap-2 mb-3">
          {commonPediatricDrugs.map(drug => (
            <button
              key={drug}
              onClick={() => setDrugName(drug)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                drugName === drug 
                  ? 'bg-pink-500 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {drug}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={drugName}
            onChange={(e) => setDrugName(e.target.value)}
            placeholder="Or type drug name..."
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg"
          />
          <Button 
            onClick={calculateDose}
            disabled={!weight || !drugName}
            className="bg-pink-500 hover:bg-pink-600"
          >
            <Calculator className="h-4 w-4 mr-1" />
            Calculate
          </Button>
        </div>
      </Card>

      {/* Warning */}
      {warning && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-amber-800">Attention</h4>
            <p className="text-sm text-amber-700">{warning}</p>
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <Card className="p-4 border-l-4 border-l-green-500 bg-green-50">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-6 w-6 text-green-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-bold text-lg">{result.drugName}</h4>
              
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between p-2 bg-white rounded">
                  <span className="text-gray-600">Dose</span>
                  <span className="font-bold text-xl">{result.doseMg} mg</span>
                </div>
                
                {result.doseMl && (
                  <div className="flex items-center justify-between p-2 bg-white rounded">
                    <span className="text-gray-600">Liquid Volume</span>
                    <span className="font-bold text-xl text-pink-600">{result.doseMl} mL</span>
                  </div>
                )}
                
                <div className="flex items-center justify-between p-2 bg-white rounded">
                  <span className="text-gray-600">Frequency</span>
                  <Badge variant="outline">{result.frequency}</Badge>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-white rounded">
                  <span className="text-gray-600">Max Dose</span>
                  <span className="font-medium">{result.maxDose} mg</span>
                </div>
              </div>
              
              <p className="text-xs text-gray-500 mt-3 flex items-start gap-1">
                <Info className="h-3 w-3 mt-0.5" />
                {result.basedOn}
              </p>
              
              {result.warning && (
                <p className="text-xs text-amber-600 mt-2 flex items-start gap-1">
                  <AlertCircle className="h-3 w-3 mt-0.5" />
                  {result.warning}
                </p>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Legend */}
      <div className="text-xs text-gray-500 flex gap-4 justify-center">
        <span className="flex items-center gap-1">
          <Info className="h-3 w-3" />
          Always verify with pediatric reference
        </span>
      </div>
    </div>
  )
}
