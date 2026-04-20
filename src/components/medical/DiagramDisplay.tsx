'use client'

import { useState } from 'react'
import { Image as ImageIcon, ExternalLink, AlertCircle, RefreshCw } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ScrollArea } from '@/components/ui/scroll-area'

interface DiagramResource {
  url: string
  title: string
  description: string
}

interface DiagramDisplayProps {
  diagrams: DiagramResource[]
  moduleColor: string
}

// Placeholder diagrams with SVG illustrations
const placeholderDiagrams: Record<string, { svg: string; title: string; description: string }> = {
  'antibiotic-coverage': {
    title: 'Antibiotic Coverage Spectrum',
    description: 'Visual guide to antibiotic spectrum of activity',
    svg: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <rect fill="#f0fdf4" width="400" height="300" rx="8"/>
      <text x="200" y="30" text-anchor="middle" font-size="14" font-weight="bold" fill="#166534">Antibiotic Coverage Spectrum</text>
      
      <!-- Narrow Spectrum -->
      <rect x="30" y="60" width="100" height="200" fill="#bbf7d0" rx="4"/>
      <text x="80" y="80" text-anchor="middle" font-size="10" font-weight="bold" fill="#166534">NARROW</text>
      <text x="80" y="100" text-anchor="middle" font-size="8" fill="#166534">Penicillin G</text>
      <text x="80" y="115" text-anchor="middle" font-size="8" fill="#166534">Vancomycin</text>
      <text x="80" y="130" text-anchor="middle" font-size="8" fill="#166534">Isoniazid</text>
      
      <!-- Moderate Spectrum -->
      <rect x="150" y="60" width="100" height="200" fill="#86efac" rx="4"/>
      <text x="200" y="80" text-anchor="middle" font-size="10" font-weight="bold" fill="#166534">MODERATE</text>
      <text x="200" y="100" text-anchor="middle" font-size="8" fill="#166534">Amoxicillin</text>
      <text x="200" y="115" text-anchor="middle" font-size="8" fill="#166534">Ceftriaxone</text>
      <text x="200" y="130" text-anchor="middle" font-size="8" fill="#166534">Azithromycin</text>
      
      <!-- Broad Spectrum -->
      <rect x="270" y="60" width="100" height="200" fill="#4ade80" rx="4"/>
      <text x="320" y="80" text-anchor="middle" font-size="10" font-weight="bold" fill="#166534">BROAD</text>
      <text x="320" y="100" text-anchor="middle" font-size="8" fill="#166534">Pip-Tazo</text>
      <text x="320" y="115" text-anchor="middle" font-size="8" fill="#166534">Meropenem</text>
      <text x="320" y="130" text-anchor="middle" font-size="8" fill="#166534">Ciprofloxacin</text>
      
      <text x="200" y="280" text-anchor="middle" font-size="9" fill="#166534">Select narrowest effective agent</text>
    </svg>`
  },
  'antibiotic-moa': {
    title: 'Antibiotic Mechanism of Action',
    description: 'How different antibiotics target bacteria',
    svg: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <rect fill="#eff6ff" width="400" height="300" rx="8"/>
      <text x="200" y="25" text-anchor="middle" font-size="14" font-weight="bold" fill="#1e40af">Antibiotic Mechanisms of Action</text>
      
      <!-- Bacterial Cell -->
      <ellipse cx="200" cy="170" rx="80" ry="100" fill="#dbeafe" stroke="#3b82f6" stroke-width="2"/>
      <text x="200" y="180" text-anchor="middle" font-size="10" fill="#1e40af">BACTERIUM</text>
      
      <!-- Cell Wall -->
      <path d="M 100 50 Q 200 20 300 50" fill="none" stroke="#dc2626" stroke-width="3"/>
      <text x="200" y="15" text-anchor="middle" font-size="8" fill="#dc2626">Cell Wall (Beta-lactams, Vanc)</text>
      
      <!-- Ribosomes -->
      <circle cx="170" cy="140" r="15" fill="#8b5cf6"/>
      <text x="170" y="143" text-anchor="middle" font-size="6" fill="white">30S</text>
      <circle cx="230" cy="140" r="15" fill="#7c3aed"/>
      <text x="230" y="143" text-anchor="middle" font-size="6" fill="white">50S</text>
      <text x="200" y="165" text-anchor="middle" font-size="7" fill="#5b21b6">Ribosomes (Aminoglycosides, Macrolides)</text>
      
      <!-- DNA -->
      <path d="M 185 200 Q 200 190 215 200 Q 200 210 185 200" fill="#f97316"/>
      <text x="200" y="225" text-anchor="middle" font-size="7" fill="#c2410c">DNA (Fluoroquinolones)</text>
      
      <!-- Folate -->
      <rect x="240" y="200" width="30" height="15" fill="#10b981" rx="2"/>
      <text x="255" y="210" text-anchor="middle" font-size="6" fill="white">Folate</text>
      <text x="255" y="225" text-anchor="middle" font-size="7" fill="#047857">(Sulfonamides)</text>
      
      <!-- Legend -->
      <text x="50" y="280" text-anchor="start" font-size="8" fill="#374151">Target specific bacterial structures to achieve selective toxicity</text>
    </svg>`
  },
  'resistance-mechanisms': {
    title: 'Antibiotic Resistance Mechanisms',
    description: 'How bacteria develop resistance',
    svg: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <rect fill="#fef2f2" width="400" height="300" rx="8"/>
      <text x="200" y="25" text-anchor="middle" font-size="14" font-weight="bold" fill="#991b1b">Antibiotic Resistance Mechanisms</text>
      
      <!-- Enzymatic Inactivation -->
      <rect x="20" y="50" width="85" height="110" fill="#fecaca" rx="4"/>
      <text x="62" y="70" text-anchor="middle" font-size="9" font-weight="bold" fill="#991b1b">ENZYMATIC</text>
      <text x="62" y="85" text-anchor="middle" font-size="8" fill="#991b1b">Beta-lactamases</text>
      <text x="62" y="98" text-anchor="middle" font-size="8" fill="#991b1b">ESBLs</text>
      <text x="62" y="111" text-anchor="middle" font-size="8" fill="#991b1b">KPC, NDM-1</text>
      <text x="62" y="130" text-anchor="middle" font-size="7" fill="#7f1d1d">Destroy drug</text>
      
      <!-- Target Modification -->
      <rect x="115" y="50" width="85" height="110" fill="#fde68a" rx="4"/>
      <text x="157" y="70" text-anchor="middle" font-size="9" font-weight="bold" fill="#92400e">TARGET</text>
      <text x="157" y="85" text-anchor="middle" font-size="8" fill="#92400e">Altered PBPs</text>
      <text x="157" y="98" text-anchor="middle" font-size="8" fill="#92400e">Ribosomal meth.</text>
      <text x="157" y="111" text-anchor="middle" font-size="8" fill="#92400e">DNA gyrase mut.</text>
      <text x="157" y="130" text-anchor="middle" font-size="7" fill="#78350f">Drug can't bind</text>
      
      <!-- Efflux Pumps -->
      <rect x="210" y="50" width="85" height="110" fill="#bbf7d0" rx="4"/>
      <text x="252" y="70" text-anchor="middle" font-size="9" font-weight="bold" fill="#166534">EFFLUX</text>
      <text x="252" y="85" text-anchor="middle" font-size="8" fill="#166534">Pump out drug</text>
      <text x="252" y="98" text-anchor="middle" font-size="8" fill="#166534">Multi-drug R</text>
      <text x="252" y="111" text-anchor="middle" font-size="8" fill="#166534">Tetracycline R</text>
      <text x="252" y="130" text-anchor="middle" font-size="7" fill="#14532d">Remove drug</text>
      
      <!-- Porin Loss -->
      <rect x="305" y="50" width="85" height="110" fill="#e9d5ff" rx="4"/>
      <text x="347" y="70" text-anchor="middle" font-size="9" font-weight="bold" fill="#7e22ce">PERMEABILITY</text>
      <text x="347" y="85" text-anchor="middle" font-size="8" fill="#7e22ce">Porin loss</text>
      <text x="347" y="98" text-anchor="middle" font-size="8" fill="#7e22ce">Gram-negative</text>
      <text x="347" y="111" text-anchor="middle" font-size="8" fill="#7e22ce">Carbapenem R</text>
      <text x="347" y="130" text-anchor="middle" font-size="7" fill="#581c87">Block entry</text>
      
      <!-- Bottom Note -->
      <rect x="50" y="180" width="300" height="100" fill="#fee2e2" rx="4"/>
      <text x="200" y="200" text-anchor="middle" font-size="10" font-weight="bold" fill="#991b1b">Key Resistant Organisms</text>
      <text x="200" y="220" text-anchor="middle" font-size="8" fill="#7f1d1d">MRSA - Methicillin-Resistant S. aureus</text>
      <text x="200" y="235" text-anchor="middle" font-size="8" fill="#7f1d1d">VRE - Vancomycin-Resistant Enterococcus</text>
      <text x="200" y="250" text-anchor="middle" font-size="8" fill="#7f1d1d">ESBL - Extended-Spectrum Beta-Lactamase</text>
      <text x="200" y="265" text-anchor="middle" font-size="8" fill="#7f1d1d">CRE - Carbapenem-Resistant Enterobacteriaceae</text>
    </svg>`
  },
  'pk-pd': {
    title: 'PK/PD Principles',
    description: 'Pharmacokinetic and pharmacodynamic parameters',
    svg: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <rect fill="#f5f3ff" width="400" height="300" rx="8"/>
      <text x="200" y="25" text-anchor="middle" font-size="14" font-weight="bold" fill="#5b21b6">PK/PD Parameters for Antibiotics</text>
      
      <!-- T>MIC -->
      <rect x="20" y="45" width="115" height="115" fill="#ede9fe" rx="4"/>
      <text x="77" y="65" text-anchor="middle" font-size="10" font-weight="bold" fill="#6d28d9">T &gt; MIC</text>
      <text x="77" y="85" text-anchor="middle" font-size="8" fill="#5b21b6">Time-dependent</text>
      <text x="77" y="100" text-anchor="middle" font-size="7" fill="#5b21b6">Beta-lactams</text>
      <text x="77" y="113" text-anchor="middle" font-size="7" fill="#5b21b6">Vancomycin</text>
      <text x="77" y="130" text-anchor="middle" font-size="7" fill="#4c1d95">Keep above MIC</text>
      <text x="77" y="143" text-anchor="middle" font-size="6" fill="#4c1d95">40-100% of dosing interval</text>
      
      <!-- Cmax/MIC -->
      <rect x="145" y="45" width="115" height="115" fill="#dbeafe" rx="4"/>
      <text x="202" y="65" text-anchor="middle" font-size="10" font-weight="bold" fill="#1d4ed8">Cmax / MIC</text>
      <text x="202" y="85" text-anchor="middle" font-size="8" fill="#1e40af">Concentration-dependent</text>
      <text x="202" y="100" text-anchor="middle" font-size="7" fill="#1e40af">Aminoglycosides</text>
      <text x="202" y="113" text-anchor="middle" font-size="7" fill="#1e40af">Daptomycin</text>
      <text x="202" y="130" text-anchor="middle" font-size="7" fill="#1e3a8a">High peak matters</text>
      <text x="202" y="143" text-anchor="middle" font-size="6" fill="#1e3a8a">Target: 8-10x MIC</text>
      
      <!-- AUC/MIC -->
      <rect x="270" y="45" width="115" height="115" fill="#dcfce7" rx="4"/>
      <text x="327" y="65" text-anchor="middle" font-size="10" font-weight="bold" fill="#15803d">AUC / MIC</text>
      <text x="327" y="85" text-anchor="middle" font-size="8" fill="#166534">Total exposure</text>
      <text x="327" y="100" text-anchor="middle" font-size="7" fill="#166534">Fluoroquinolones</text>
      <text x="327" y="113" text-anchor="middle" font-size="7" fill="#166534">Vancomycin</text>
      <text x="327" y="130" text-anchor="middle" font-size="7" fill="#14532d">Area under curve</text>
      <text x="327" y="143" text-anchor="middle" font-size="6" fill="#14532d">Target: AUC/MIC &gt;125</text>
      
      <!-- Graph -->
      <rect x="50" y="180" width="300" height="100" fill="#faf5ff" rx="4"/>
      <polyline points="70,260 120,220 170,240 220,210 270,230 320,250" fill="none" stroke="#7c3aed" stroke-width="2"/>
      <line x1="50" y1="235" x2="350" y2="235" stroke="#ef4444" stroke-width="1" stroke-dasharray="5,5"/>
      <text x="355" y="238" font-size="8" fill="#ef4444">MIC</text>
      <text x="200" y="195" text-anchor="middle" font-size="9" fill="#5b21b6">Drug Concentration vs Time</text>
    </svg>`
  },
  'bp-regulation': {
    title: 'Blood Pressure Regulation',
    description: 'Physiological mechanisms of BP control',
    svg: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <rect fill="#fff1f2" width="400" height="300" rx="8"/>
      <text x="200" y="25" text-anchor="middle" font-size="14" font-weight="bold" fill="#9f1239">Blood Pressure Regulation</text>
      
      <!-- Central BP -->
      <circle cx="200" cy="150" r="50" fill="#fecdd3" stroke="#e11d48" stroke-width="2"/>
      <text x="200" y="145" text-anchor="middle" font-size="10" font-weight="bold" fill="#9f1239">BP = CO × TPR</text>
      <text x="200" y="160" text-anchor="middle" font-size="8" fill="#9f1239">Blood Pressure</text>
      
      <!-- Heart -->
      <ellipse cx="100" cy="100" rx="40" ry="30" fill="#fda4af" stroke="#e11d48" stroke-width="2"/>
      <text x="100" y="95" text-anchor="middle" font-size="8" font-weight="bold" fill="#9f1239">Heart</text>
      <text x="100" y="108" text-anchor="middle" font-size="7" fill="#9f1239">Cardiac Output</text>
      <line x1="140" y1="110" x2="155" y2="130" stroke="#e11d48" stroke-width="2" marker-end="url(#arrow)"/>
      
      <!-- Blood Vessels -->
      <ellipse cx="300" cy="100" rx="40" ry="30" fill="#fda4af" stroke="#e11d48" stroke-width="2"/>
      <text x="300" y="95" text-anchor="middle" font-size="8" font-weight="bold" fill="#9f1239">Vessels</text>
      <text x="300" y="108" text-anchor="middle" font-size="7" fill="#9f1239">TPR</text>
      <line x1="260" y1="110" x2="245" y2="130" stroke="#e11d48" stroke-width="2"/>
      
      <!-- Kidney -->
      <ellipse cx="200" cy="250" rx="40" ry="25" fill="#fda4af" stroke="#e11d48" stroke-width="2"/>
      <text x="200" y="253" text-anchor="middle" font-size="8" font-weight="bold" fill="#9f1239">Kidney</text>
      <text x="200" y="265" text-anchor="middle" font-size="7" fill="#9f1239">Volume/RAAS</text>
      <line x1="200" y1="200" x2="200" y2="225" stroke="#e11d48" stroke-width="2"/>
      
      <!-- Drug Targets -->
      <rect x="20" y="60" width="60" height="70" fill="#fef2f2" rx="4"/>
      <text x="50" y="75" text-anchor="middle" font-size="7" font-weight="bold" fill="#9f1239">DRUGS</text>
      <text x="50" y="88" text-anchor="middle" font-size="6" fill="#9f1239">Beta-blockers</text>
      <text x="50" y="100" text-anchor="middle" font-size="6" fill="#9f1239">ACEi/ARBs</text>
      <text x="50" y="112" text-anchor="middle" font-size="6" fill="#9f1239">CCBs</text>
      <text x="50" y="124" text-anchor="middle" font-size="6" fill="#9f1239">Diuretics</text>
      
      <!-- RAAS -->
      <rect x="320" y="160" width="70" height="60" fill="#fef2f2" rx="4"/>
      <text x="355" y="175" text-anchor="middle" font-size="7" font-weight="bold" fill="#9f1239">RAAS</text>
      <text x="355" y="188" text-anchor="middle" font-size="6" fill="#9f1239">Ang II</text>
      <text x="355" y="200" text-anchor="middle" font-size="6" fill="#9f1239">Aldosterone</text>
      <text x="355" y="212" text-anchor="middle" font-size="6" fill="#9f1239">Vasoconstriction</text>
    </svg>`
  },
  'hf-medications': {
    title: 'Heart Failure Medications',
    description: 'The four pillars of HFrEF therapy',
    svg: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <rect fill="#fef2f2" width="400" height="300" rx="8"/>
      <text x="200" y="25" text-anchor="middle" font-size="14" font-weight="bold" fill="#991b1b">Four Pillars of HFrEF Therapy</text>
      
      <!-- Pillar 1: ACEi/ARB/ARNI -->
      <rect x="30" y="50" width="80" height="180" fill="#fca5a5" rx="4"/>
      <text x="70" y="70" text-anchor="middle" font-size="9" font-weight="bold" fill="#991b1b">ACEi/ARB/ARNI</text>
      <text x="70" y="90" text-anchor="middle" font-size="7" fill="#7f1d1d">Sacubitril-Valsartan</text>
      <text x="70" y="105" text-anchor="middle" font-size="7" fill="#7f1d1d">Enalapril</text>
      <text x="70" y="120" text-anchor="middle" font-size="7" fill="#7f1d1d">Losartan</text>
      <text x="70" y="145" text-anchor="middle" font-size="6" fill="#450a0a">↓ Afterload</text>
      <text x="70" y="158" text-anchor="middle" font-size="6" fill="#450a0a">↓ Remodeling</text>
      <text x="70" y="180" text-anchor="middle" font-size="8" font-weight="bold" fill="#166534">↓ Mortality</text>
      
      <!-- Pillar 2: Beta-blockers -->
      <rect x="120" y="50" width="80" height="180" fill="#fdba74" rx="4"/>
      <text x="160" y="70" text-anchor="middle" font-size="9" font-weight="bold" fill="#9a3412">Beta-Blockers</text>
      <text x="160" y="90" text-anchor="middle" font-size="7" fill="#7c2d12">Carvedilol</text>
      <text x="160" y="105" text-anchor="middle" font-size="7" fill="#7c2d12">Metoprolol XL</text>
      <text x="160" y="120" text-anchor="middle" font-size="7" fill="#7c2d12">Bisoprolol</text>
      <text x="160" y="145" text-anchor="middle" font-size="6" fill="#431407">↓ Heart rate</text>
      <text x="160" y="158" text-anchor="middle" font-size="6" fill="#431407">↓ Remodeling</text>
      <text x="160" y="180" text-anchor="middle" font-size="8" font-weight="bold" fill="#166534">↓ Mortality</text>
      
      <!-- Pillar 3: MRA -->
      <rect x="210" y="50" width="80" height="180" fill="#86efac" rx="4"/>
      <text x="250" y="70" text-anchor="middle" font-size="9" font-weight="bold" fill="#166534">MRA</text>
      <text x="250" y="90" text-anchor="middle" font-size="7" fill="#14532d">Spironolactone</text>
      <text x="250" y="105" text-anchor="middle" font-size="7" fill="#14532d">Eplerenone</text>
      <text x="250" y="145" text-anchor="middle" font-size="6" fill="#14532d">↓ Fibrosis</text>
      <text x="250" y="158" text-anchor="middle" font-size="6" fill="#14532d">Na+ excretion</text>
      <text x="250" y="180" text-anchor="middle" font-size="8" font-weight="bold" fill="#166534">↓ Mortality</text>
      
      <!-- Pillar 4: SGLT2i -->
      <rect x="300" y="50" width="80" height="180" fill="#93c5fd" rx="4"/>
      <text x="340" y="70" text-anchor="middle" font-size="9" font-weight="bold" fill="#1e40af">SGLT2i</text>
      <text x="340" y="90" text-anchor="middle" font-size="7" fill="#1e3a8a">Dapagliflozin</text>
      <text x="340" y="105" text-anchor="middle" font-size="7" fill="#1e3a8a">Empagliflozin</text>
      <text x="340" y="145" text-anchor="middle" font-size="6" fill="#1e3a8a">↓ Cardiac preload</text>
      <text x="340" y="158" text-anchor="middle" font-size="6" fill="#1e3a8a">↑ Ketone use</text>
      <text x="340" y="180" text-anchor="middle" font-size="8" font-weight="bold" fill="#166534">↓ Mortality</text>
      
      <text x="200" y="260" text-anchor="middle" font-size="10" font-weight="bold" fill="#991b1b">Initiate all 4 pillars before discharge if possible</text>
    </svg>`
  },
  'default': {
    title: 'Educational Diagram',
    description: 'Visual representation of pharmacological concepts',
    svg: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <rect fill="#f8fafc" width="400" height="300" rx="8"/>
      <text x="200" y="30" text-anchor="middle" font-size="16" font-weight="bold" fill="#334155">Pharmacology Concept</text>
      
      <!-- Drug -->
      <rect x="50" y="100" width="80" height="60" fill="#e0f2fe" rx="8" stroke="#0284c7" stroke-width="2"/>
      <text x="90" y="125" text-anchor="middle" font-size="10" font-weight="bold" fill="#0369a1">DRUG</text>
      <text x="90" y="140" text-anchor="middle" font-size="8" fill="#0369a1">Administration</text>
      
      <!-- Arrow -->
      <path d="M 130 130 L 170 130" stroke="#0284c7" stroke-width="2" marker-end="url(#arrow)"/>
      
      <!-- ADME -->
      <rect x="170" y="70" width="60" height="120" fill="#fef3c7" rx="8" stroke="#d97706" stroke-width="2"/>
      <text x="200" y="95" text-anchor="middle" font-size="10" font-weight="bold" fill="#92400e">ADME</text>
      <text x="200" y="115" text-anchor="middle" font-size="8" fill="#92400e">Absorption</text>
      <text x="200" y="130" text-anchor="middle" font-size="8" fill="#92400e">Distribution</text>
      <text x="200" y="145" text-anchor="middle" font-size="8" fill="#92400e">Metabolism</text>
      <text x="200" y="160" text-anchor="middle" font-size="8" fill="#92400e">Excretion</text>
      
      <!-- Arrow -->
      <path d="M 230 130 L 270 130" stroke="#0284c7" stroke-width="2"/>
      
      <!-- Target -->
      <rect x="270" y="100" width="80" height="60" fill="#dcfce7" rx="8" stroke="#16a34a" stroke-width="2"/>
      <text x="310" y="125" text-anchor="middle" font-size="10" font-weight="bold" fill="#15803d">TARGET</text>
      <text x="310" y="140" text-anchor="middle" font-size="8" fill="#15803d">Effect</text>
      
      <!-- Effect -->
      <rect x="150" y="220" width="100" height="50" fill="#fce7f3" rx="8" stroke="#db2777" stroke-width="2"/>
      <text x="200" y="245" text-anchor="middle" font-size="10" font-weight="bold" fill="#9d174d">Therapeutic</text>
      <text x="200" y="260" text-anchor="middle" font-size="8" fill="#9d174d">Response</text>
      
      <text x="200" y="290" text-anchor="middle" font-size="9" fill="#64748b">Drug-Receptor Interaction → Pharmacological Effect</text>
    </svg>`
  }
}

function getPlaceholderDiagram(title: string): { svg: string; title: string; description: string } {
  const titleLower = title.toLowerCase()
  
  if (titleLower.includes('coverage') || titleLower.includes('spectrum')) {
    return placeholderDiagrams['antibiotic-coverage']
  }
  if (titleLower.includes('mechanism') || titleLower.includes('moa') || titleLower.includes('action')) {
    return placeholderDiagrams['antibiotic-moa']
  }
  if (titleLower.includes('resistance')) {
    return placeholderDiagrams['resistance-mechanisms']
  }
  if (titleLower.includes('pk') || titleLower.includes('pd') || titleLower.includes('pharmacokinetic')) {
    return placeholderDiagrams['pk-pd']
  }
  if (titleLower.includes('blood pressure') || titleLower.includes('bp') || titleLower.includes('hypertension')) {
    return placeholderDiagrams['bp-regulation']
  }
  if (titleLower.includes('heart failure') || titleLower.includes('hf')) {
    return placeholderDiagrams['hf-medications']
  }
  
  return placeholderDiagrams['default']
}

export function DiagramDisplay({ diagrams, moduleColor }: DiagramDisplayProps) {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})
  const [useFallback, setUseFallback] = useState<Record<string, boolean>>({})

  const handleImageError = (url: string) => {
    setImageErrors(prev => ({ ...prev, [url]: true }))
  }

  const toggleFallback = (url: string) => {
    setUseFallback(prev => ({ ...prev, [url]: !prev[url] }))
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="py-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <ImageIcon className={`w-4 h-4 ${moduleColor}`} />
          Educational Diagrams
          <Badge variant="outline" className="ml-auto text-xs">
            {diagrams.length} diagrams
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea className="h-[300px] pr-2">
          <div className="space-y-4">
            {diagrams.map((diagram, i) => {
              const hasError = imageErrors[diagram.url]
              const isUsingFallback = useFallback[diagram.url]
              const placeholder = getPlaceholderDiagram(diagram.title)
              
              return (
                <div key={i} className="space-y-2">
                  {hasError || isUsingFallback ? (
                    // Use placeholder SVG
                    <div className="w-full rounded-lg border shadow-sm overflow-hidden bg-white">
                      <div 
                        dangerouslySetInnerHTML={{ __html: placeholder.svg }}
                        className="w-full"
                      />
                    </div>
                  ) : (
                    // Try to load external image
                    <img
                      src={diagram.url}
                      alt={diagram.title}
                      className="w-full rounded-lg border shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      onError={() => handleImageError(diagram.url)}
                      onClick={() => window.open(diagram.url, '_blank')}
                      loading="lazy"
                    />
                  )}
                  
                  <div className="px-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-xs">{diagram.title}</p>
                      {hasError && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-xs"
                          onClick={() => toggleFallback(diagram.url)}
                        >
                          {isUsingFallback ? 'Show Placeholder' : 'Retry'}
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{diagram.description}</p>
                    
                    {hasError && !isUsingFallback && (
                      <Alert className="mt-2 py-2">
                        <AlertCircle className="h-3 w-3" />
                        <AlertDescription className="text-xs">
                          External image unavailable. 
                          <Button
                            variant="link"
                            size="sm"
                            className="h-auto p-0 ml-1 text-xs"
                            onClick={() => toggleFallback(diagram.url)}
                          >
                            View educational diagram
                          </Button>
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
