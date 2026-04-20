'use client'

import React from 'react'
import { AlertTriangle, Info, Badge } from 'lucide-react'
import { Badge as UIBadge } from '@/components/ui/badge'
import { DrugInteraction, SideEffect } from '@/providers/AppProvider'

interface DrugClinicalInfoProps {
  interactions?: DrugInteraction[]
  sideEffects?: SideEffect[]
  warnings?: string | null
  renalAdjustment?: string | null
  hepaticAdjustment?: string | null
  compact?: boolean
}

const INTERACTION_SEVERITY_COLORS: Record<string, string> = {
  'severe': 'bg-red-100 text-red-700 border-red-300',
  'moderate': 'bg-orange-100 text-orange-700 border-orange-300',
  'minor': 'bg-yellow-100 text-yellow-700 border-yellow-300',
  'unknown': 'bg-gray-100 text-gray-700 border-gray-300',
}

const SIDE_EFFECT_FREQUENCY_COLORS: Record<string, string> = {
  'Common': 'bg-orange-100 text-orange-700 border-orange-300',
  'Uncommon': 'bg-yellow-100 text-yellow-700 border-yellow-300',
  'Rare': 'bg-blue-100 text-blue-700 border-blue-300',
  'Unknown': 'bg-gray-100 text-gray-700 border-gray-300',
}

export function DrugClinicalInfo({ 
  interactions, 
  sideEffects, 
  warnings, 
  renalAdjustment, 
  hepaticAdjustment,
  compact = false 
}: DrugClinicalInfoProps) {
  if (compact) {
    // Compact version for search result cards
    return (
      <div className="flex gap-2 flex-wrap">
        {interactions && interactions.length > 0 && (
          <UIBadge variant="outline" className="text-[9px] px-2 py-0.5 bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-900/50 text-orange-700 dark:text-orange-400">
            <AlertTriangle className="w-2.5 h-2.5 mr-1" />
            {interactions.length} {interactions.length === 1 ? 'Interaction' : 'Interactions'}
          </UIBadge>
        )}
        {sideEffects && sideEffects.length > 0 && (
          <UIBadge variant="outline" className="text-[9px] px-2 py-0.5 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400">
            <AlertTriangle className="w-2.5 h-2.5 mr-1" />
            {sideEffects.length} {sideEffects.length === 1 ? 'Side Effect' : 'Side Effects'}
          </UIBadge>
        )}
        {warnings && (
          <UIBadge variant="outline" className="text-[9px] px-2 py-0.5 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-900/50 text-amber-700 dark:text-amber-400">
            <Info className="w-2.5 h-2.5 mr-1" />
            Warnings
          </UIBadge>
        )}
      </div>
    )
  }

  // Full version for detailed drug view
  return (
    <div className="space-y-4">
      {/* Drug Interactions */}
      {interactions && interactions.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-orange-500" /> Drug Interactions
            </h4>
            <UIBadge variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-slate-500">{interactions.length}</UIBadge>
          </div>
          <div className="space-y-2">
            {interactions.slice(0, 5).map((interaction, i) => (
              <div key={i} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
                <div className="flex items-start gap-3">
                  <UIBadge 
                    className={`text-[10px] font-bold uppercase tracking-wider ${INTERACTION_SEVERITY_COLORS[interaction.severity || 'unknown']}`}
                  >
                    {interaction.severity || 'Unknown'}
                  </UIBadge>
                  <div className="flex-1 min-w-0">
                    {interaction.secondaryDrugName && (
                      <p className="font-semibold text-sm text-slate-900 dark:text-slate-100 mb-1">{interaction.secondaryDrugName}</p>
                    )}
                    {interaction.description && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">{interaction.description}</p>
                    )}
                    {interaction.management && (
                      <div className="flex items-start gap-2">
                        <Info className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-blue-600 dark:text-blue-400">{interaction.management}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {interactions.length > 5 && (
              <div className="text-center">
                <UIBadge variant="secondary" className="text-xs">
                  +{interactions.length - 5} more interactions
                </UIBadge>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Side Effects */}
      {sideEffects && sideEffects.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-red-500" /> Side Effects
            </h4>
            <UIBadge variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-slate-500">{sideEffects.length}</UIBadge>
          </div>
          <div className="flex flex-wrap gap-2">
            {sideEffects.slice(0, 12).map((sideEffect, i) => (
              <UIBadge 
                key={i} 
                variant="outline" 
                className={`px-2 py-1 rounded-full border text-[10px] ${SIDE_EFFECT_FREQUENCY_COLORS[sideEffect.frequency || 'Unknown']}`}
              >
                {sideEffect.sideEffect}
              </UIBadge>
            ))}
            {sideEffects.length > 12 && (
              <UIBadge variant="secondary" className="text-xs">
                +{sideEffects.length - 12} more
              </UIBadge>
            )}
          </div>
        </div>
      )}

      {/* Clinical Information */}
      {(warnings || renalAdjustment || hepaticAdjustment) && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              <Info className="w-4 h-4 text-purple-500" /> Clinical Information
            </h4>
          </div>
          
          {warnings && (
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/50">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-amber-800 dark:text-amber-400 mb-1">Clinical Warnings</p>
                  <p className="text-xs text-amber-700 dark:text-amber-300">{warnings}</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {renalAdjustment && (
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/50">
                <p className="text-xs font-bold text-blue-800 dark:text-blue-400 mb-1">Renal Adjustment</p>
                <p className="text-xs text-blue-700 dark:text-blue-300">{renalAdjustment}</p>
              </div>
            )}
            {hepaticAdjustment && (
              <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-900/50">
                <p className="text-xs font-bold text-purple-800 dark:text-purple-400 mb-1">Hepatic Adjustment</p>
                <p className="text-xs text-purple-700 dark:text-purple-300">{hepaticAdjustment}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
