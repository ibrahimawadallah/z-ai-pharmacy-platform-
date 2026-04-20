'use client'

import { useState, useCallback } from 'react'
import { 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  Plus, 
  X, 
  Search,
  ShieldAlert,
  User,
  Loader2
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface AllergyCheck {
  drugName: string
  containsAllergen: boolean
  allergenType?: string
  severity?: 'mild' | 'moderate' | 'severe'
  alternativeDrugs: string[]
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

interface AllergyCheckerProps {
  patientAllergies?: string[]
  onAllergyDetected?: (allergy: AllergyCheck) => void
}

// Allergen patterns for common drug classes
const allergenPatterns: Record<string, { allergens: string[]; crossReactivity: string[] }> = {
  'penicillin': { allergens: ['beta-lactam'], crossReactivity: ['cephalosporins', 'carbapenems'] },
  'amoxicillin': { allergens: ['beta-lactam', 'penicillin'], crossReactivity: ['ampicillin', 'cephalexin'] },
  'cephalexin': { allergens: ['cephalosporin', 'beta-lactam'], crossReactivity: ['penicillins', 'cefuroxime'] },
  'ceftriaxone': { allergens: ['cephalosporin', 'beta-lactam'], crossReactivity: ['penicillins'] },
  'sulfamethoxazole': { allergens: ['sulfa'], crossReactivity: ['sulfadiazine', 'sulfasalazine'] },
  'ibuprofen': { allergens: ['nsaid'], crossReactivity: ['naproxen', 'aspirin', 'ketoprofen'] },
  'naproxen': { allergens: ['nsaid'], crossReactivity: ['ibuprofen', 'ketoprofen'] },
  'aspirin': { allergens: ['salicylate', 'nsaid'], crossReactivity: ['diflunisal', 'salsalate'] },
  'morphine': { allergens: ['opioid'], crossReactivity: ['codeine', 'oxycodone', 'hydrocodone'] },
  'codeine': { allergens: ['opioid'], crossReactivity: ['morphine', 'oxycodone'] },
  'allopurinol': { allergens: ['purine analog'], crossReactivity: [] },
  'carbamazepine': { allergens: ['tricyclic compound'], crossReactivity: ['oxcarbazepine'] },
  'phenytoin': { allergens: ['hydantoin'], crossReactivity: ['fosphenytoin'] },
  'warfarin': { allergens: ['coumarin'], crossReactivity: ['phenprocoumon'] },
  'heparin': { allergens: ['glycosaminoglycan'], crossReactivity: ['enoxaparin', 'dalteparin'] },
  'metformin': { allergens: ['biguanide'], crossReactivity: [] },
  'lisinopril': { allergens: ['ace inhibitor'], crossReactivity: ['enalapril', 'captopril', 'ramipril'] },
  'atorvastatin': { allergens: ['statin'], crossReactivity: ['simvastatin', 'rosuvastatin', 'pravastatin'] },
  'omeprazole': { allergens: ['ppi'], crossReactivity: ['esomeprazole', 'lansoprazole'] },
  'cetirizine': { allergens: ['antihistamine'], crossReactivity: ['loratadine', 'fexofenadine'] },
  'prednisone': { allergens: ['corticosteroid'], crossReactivity: ['prednisolone', 'methylprednisolone'] },
  'insulin': { allergens: ['protein hormone'], crossReactivity: ['insulin analogs'] },
  'metoprolol': { allergens: ['beta blocker'], crossReactivity: ['atenolol', 'propranolol'] },
  'amlodipine': { allergens: ['calcium channel blocker'], crossReactivity: ['nifedipine', 'felodipine'] },
  'levothyroxine': { allergens: ['thyroid hormone'], crossReactivity: ['liothyronine'] },
  'sertraline': { allergens: ['ssri'], crossReactivity: ['fluoxetine', 'paroxetine', 'citalopram'] },
}

export function AllergyChecker({ patientAllergies = [], onAllergyDetected }: AllergyCheckerProps) {
  const [inputValue, setInputValue] = useState('')
  const [patientAllergyInput, setPatientAllergyInput] = useState('')
  const [allergies, setAllergies] = useState<string[]>(patientAllergies)
  const [checkResult, setCheckResult] = useState<AllergyCheck | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  const [searchResults, setSearchResults] = useState<UAEDrug[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const addPatientAllergy = useCallback(() => {
    if (patientAllergyInput.trim() && !allergies.includes(patientAllergyInput.trim())) {
      setAllergies(prev => [...prev, patientAllergyInput.trim()])
      setPatientAllergyInput('')
    }
  }, [patientAllergyInput, allergies])

  const removeAllergy = useCallback((allergy: string) => {
    setAllergies(prev => prev.filter(a => a !== allergy))
  }, [])

  // Search drugs from UAE database
  const searchDrugs = useCallback(async (query: string) => {
    if (!query.trim() || query.length < 3) return
    
    setIsSearching(true)
    try {
      const response = await fetch(`/api/drugs/search?q=${encodeURIComponent(query)}&limit=10`)
      if (response.ok) {
        const data = await response.json()
        setSearchResults(data.data || [])
      }
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setIsSearching(false)
    }
  }, [])

  const getAlternativeDrugs = (drugName: string): string[] => {
    const alternatives: string[] = []
    
    // Find drugs in different classes from search results
    for (const result of searchResults) {
      if (result.packageName.toLowerCase() === drugName.toLowerCase()) continue
      
      // Check if this alternative has different allergen patterns
      const altPattern = Object.entries(allergenPatterns).find(([key]) => 
        result.packageName.toLowerCase().includes(key) || 
        result.genericName.toLowerCase().includes(key)
      )
      
      if (!altPattern) {
        alternatives.push(result.packageName)
      }
    }
    
    return alternatives.slice(0, 3)
  }

  const checkDrugAllergy = useCallback(async (drugName: string) => {
    setIsChecking(true)
    setCheckResult(null)
    
    try {
      // First search for the drug
      const searchResponse = await fetch(`/api/drugs/search?q=${encodeURIComponent(drugName)}&limit=1`)
      
      if (!searchResponse.ok) {
        throw new Error('Failed to search drug')
      }
      
      const searchData = await searchResponse.json()
      
      if (!searchData.data || searchData.data.length === 0) {
        setCheckResult({
          drugName,
          containsAllergen: false,
          alternativeDrugs: ['Drug not found in UAE database']
        })
        setIsChecking(false)
        return
      }
      
      const foundDrug = searchData.data[0]
      const normalizedDrugName = drugName.toLowerCase().trim()
      
      // Find matching allergen pattern
      let drugData: { allergens: string[]; crossReactivity: string[] } | null = null
      for (const [pattern, data] of Object.entries(allergenPatterns)) {
        if (normalizedDrugName.includes(pattern) || 
            foundDrug.genericName.toLowerCase().includes(pattern)) {
          drugData = data
          break
        }
      }
      
      // Check for allergen matches
      const matchedAllergens: string[] = []
      let severity: 'mild' | 'moderate' | 'severe' = 'mild'
      
      for (const allergy of allergies) {
        const normalizedAllergy = allergy.toLowerCase()
        
        // Direct drug match
        if (normalizedDrugName === normalizedAllergy || 
            normalizedDrugName.includes(normalizedAllergy) ||
            normalizedAllergy.includes(normalizedDrugName)) {
          matchedAllergens.push(allergy)
          severity = 'severe'
        }
        
        // Allergen class match (if we have pattern data)
        if (drugData) {
          for (const allergen of drugData.allergens) {
            if (normalizedAllergy.includes(allergen) || allergen.includes(normalizedAllergy)) {
              if (!matchedAllergens.includes(allergy)) {
                matchedAllergens.push(allergy)
              }
              if (severity === 'mild') severity = 'moderate'
            }
          }
          
          // Cross-reactivity check
          for (const cross of drugData.crossReactivity) {
            if (normalizedAllergy.includes(cross) || cross.includes(normalizedAllergy)) {
              if (!matchedAllergens.includes(allergy)) {
                matchedAllergens.push(`${allergy} (cross-reactivity)`)
              }
              severity = 'severe'
            }
          }
        }
      }

      const result: AllergyCheck = {
        drugName: foundDrug.packageName,
        containsAllergen: matchedAllergens.length > 0,
        allergenType: matchedAllergens.length > 0 ? matchedAllergens.join(', ') : undefined,
        severity: matchedAllergens.length > 0 ? severity : undefined,
        alternativeDrugs: getAlternativeDrugs(foundDrug.packageName)
      }

      setCheckResult(result)
      if (result.containsAllergen && onAllergyDetected) {
        onAllergyDetected(result)
      }
    } catch (error) {
      console.error('Allergy check failed:', error)
      setCheckResult({
        drugName,
        containsAllergen: false,
        alternativeDrugs: ['Error checking allergy']
      })
    } finally {
      setIsChecking(false)
    }
  }, [allergies, onAllergyDetected, searchResults])

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <ShieldAlert className="h-5 w-5 text-red-500" />
        <h3 className="font-semibold">Allergy Checker</h3>
        <span className="text-xs text-gray-500">(UAE Database)</span>
      </div>

      {/* Patient Allergies Input */}
      <Card className="p-4">
        <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
          <User className="h-4 w-4" />
          Patient Allergies
        </h4>
        
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={patientAllergyInput}
            onChange={(e) => setPatientAllergyInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addPatientAllergy()}
            placeholder="Add allergy (e.g., Penicillin)..."
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
          />
          <Button onClick={addPatientAllergy} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Allergy List */}
        <div className="flex flex-wrap gap-2">
          {allergies.map((allergy) => (
            <div 
              key={allergy}
              className="flex items-center gap-1 px-3 py-1 bg-red-50 border border-red-200 rounded-lg"
            >
              <AlertCircle className="h-3 w-3 text-red-500" />
              <span className="text-sm text-red-700">{allergy}</span>
              <button 
                onClick={() => removeAllergy(allergy)}
                className="ml-1 text-red-400 hover:text-red-600"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {allergies.length === 0 && (
            <p className="text-gray-400 text-sm">No allergies recorded</p>
          )}
        </div>
      </Card>

      {/* Drug to Check */}
      <Card className="p-4">
        <h4 className="text-sm font-medium mb-2">Check Drug</h4>
        
        <div className="flex gap-2 mb-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value)
                if (e.target.value.length >= 3) {
                  searchDrugs(e.target.value)
                }
              }}
              placeholder="Search drug in UAE database..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
          <Button 
            onClick={() => inputValue.trim() && checkDrugAllergy(inputValue.trim())}
            disabled={!inputValue.trim() || isChecking || allergies.length === 0}
            size="sm"
          >
            {isChecking ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Check'}
          </Button>
        </div>

        {/* Search Results */}
        {isSearching && (
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <Loader2 className="h-3 w-3 animate-spin" />
            Searching UAE database...
          </div>
        )}
        
        {searchResults.length > 0 && !isSearching && (
          <div className="space-y-1 max-h-40 overflow-y-auto">
            <p className="text-xs text-gray-500 mb-1">Click to check:</p>
            {searchResults.slice(0, 5).map((result) => (
              <button
                key={result.id}
                onClick={() => {
                  setInputValue(result.packageName)
                  checkDrugAllergy(result.packageName)
                }}
                className="w-full text-left p-2 bg-gray-50 hover:bg-gray-100 rounded text-sm transition-colors"
              >
                <div className="font-medium">{result.packageName}</div>
                <div className="text-xs text-gray-500">{result.genericName} • {result.strength}</div>
              </button>
            ))}
          </div>
        )}
      </Card>

      {/* Results */}
      {checkResult && (
        <Card className={`p-4 border-l-4 ${
          checkResult.containsAllergen 
            ? 'border-red-500 bg-red-50' 
            : 'border-green-500 bg-green-50'
        }`}>
          <div className="flex items-start gap-3">
            {checkResult.containsAllergen ? (
              <XCircle className="h-6 w-6 text-red-600 mt-0.5" />
            ) : (
              <CheckCircle className="h-6 w-6 text-green-600 mt-0.5" />
            )}
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-bold">{checkResult.drugName}</h4>
                <Badge className={
                  checkResult.containsAllergen 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-green-100 text-green-800'
                }>
                  {checkResult.containsAllergen ? 'CONTRAINDICATED' : 'SAFE'}
                </Badge>
              </div>

              {checkResult.containsAllergen ? (
                <>
                  <p className="text-red-700 text-sm mb-2">
                    <span className="font-medium">Conflicting allergens:</span>{' '}
                    {checkResult.allergenType}
                  </p>
                  {checkResult.severity && (
                    <Badge className={
                      checkResult.severity === 'severe' ? 'bg-red-600' :
                      checkResult.severity === 'moderate' ? 'bg-orange-500' :
                      'bg-yellow-500'
                    }>
                      {checkResult.severity.toUpperCase()} RISK
                    </Badge>
                  )}
                </>
              ) : (
                <p className="text-green-700 text-sm">
                  No known allergy conflicts with patient profile
                </p>
              )}

              {/* Alternatives */}
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  {checkResult.containsAllergen ? 'Consider alternatives:' : 'Similar drugs:'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {checkResult.alternativeDrugs.map((alt, idx) => (
                    <button
                      key={idx}
                      onClick={() => checkDrugAllergy(alt)}
                      className="px-3 py-1 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                    >
                      {alt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Legend */}
      <div className="text-xs text-gray-500 flex gap-4 justify-center">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-green-500 rounded-full" />
          Safe
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-yellow-500 rounded-full" />
          Mild Risk
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-red-500 rounded-full" />
          Contraindicated
        </span>
      </div>
    </div>
  )
}
