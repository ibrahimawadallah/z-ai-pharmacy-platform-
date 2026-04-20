'use client'

import React, { useState, useMemo } from 'react'
import { Calculator, Info, ChevronDown, ChevronUp, Activity } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface WeightBasedDoseCalculatorProps {
  baseDoseMgPerKg?: number | null
  baseDoseIndication?: string | null
  drugName?: string
}

export function WeightBasedDoseCalculator({ 
  baseDoseMgPerKg, 
  baseDoseIndication,
  drugName 
}: WeightBasedDoseCalculatorProps) {
  const [weight, setWeight] = useState<string>('70')
  const [showAdjustments, setShowAdjustments] = useState(false)

  const calculation = useMemo(() => {
    const weightKg = parseFloat(weight)
    if (!baseDoseMgPerKg || isNaN(weightKg) || weightKg <= 0) {
      return null
    }
    const totalDose = baseDoseMgPerKg * weightKg
    return {
      baseDose: baseDoseMgPerKg,
      weight: weightKg,
      totalDose: Math.round(totalDose * 100) / 100,
      formula: `${baseDoseMgPerKg} mg/kg × ${weightKg} kg = ${Math.round(totalDose * 100) / 100} mg`
    }
  }, [baseDoseMgPerKg, weight])

  const isValidWeight = useMemo(() => {
    const w = parseFloat(weight)
    return !isNaN(w) && w > 0 && w <= 300
  }, [weight])

  if (!baseDoseMgPerKg) {
    return (
      <Card className="border border-border">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Calculator className="w-5 h-5 text-cyan-500" />
            Weight-Based Dose Calculator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
            <Info className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium">Weight-based dosing not established</p>
              <p className="text-xs text-muted-foreground mt-1">
                This drug does not have weight-based dosing data in the database. 
                Use standard dosing or consult external references.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border border-cyan-500/30 bg-gradient-to-br from-cyan-50/50 to-blue-50/50 dark:from-cyan-950/30 dark:to-blue-950/30">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Calculator className="w-5 h-5 text-cyan-500" />
          Weight-Based Dose Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Patient Weight (kg)</label>
            <Input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Enter weight in kg"
              min="0.5"
              max="300"
              className="h-10"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Base Dose</label>
            <div className="h-10 px-3 flex items-center bg-muted/50 rounded-md border">
              <span className="text-sm font-medium">{baseDoseMgPerKg} mg/kg</span>
              {baseDoseIndication && (
                <Badge variant="outline" className="ml-2 text-xs">
                  {baseDoseIndication}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {calculation && isValidWeight && (
          <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-cyan-200 dark:border-cyan-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Calculated Dose:</span>
              <Badge className="bg-cyan-500 text-white">
                {calculation.totalDose} mg
              </Badge>
            </div>
            
            <div className="text-xs text-muted-foreground space-y-1">
              <p className="font-mono bg-muted/50 p-2 rounded">
                {calculation.formula}
              </p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Total Dose = Base Dose (mg/kg) × Weight (kg)
              </p>
            </div>
          </div>
        )}

        {!isValidWeight && weight && (
          <div className="p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Please enter a valid weight between 0.5 and 300 kg
            </p>
          </div>
        )}

        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowAdjustments(!showAdjustments)}
          className="w-full justify-between text-muted-foreground hover:text-foreground"
        >
          <span className="text-sm flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Advanced Adjustments
          </span>
          {showAdjustments ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </Button>

        {showAdjustments && (
          <div className="p-4 bg-muted/30 rounded-lg space-y-3">
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">Note:</strong> This calculator uses simple weight-based dosing. 
              For patients with renal or hepatic impairment, additional dose adjustments may be required 
              based on organ function.
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-amber-50 dark:bg-amber-950 rounded border border-amber-200 dark:border-amber-800">
                <p className="font-medium text-amber-700 dark:text-amber-300">Hepatic Impairment</p>
                <p className="text-muted-foreground mt-1">May require dose reduction. Monitor liver function.</p>
              </div>
              <div className="p-2 bg-red-50 dark:bg-red-950 rounded border border-red-200 dark:border-red-800">
                <p className="font-medium text-red-700 dark:text-red-300">Renal Impairment</p>
                <p className="text-muted-foreground mt-1">Adjust based on CrCl. Use modified dosing intervals.</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default WeightBasedDoseCalculator