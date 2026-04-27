/**
 * Data Quality Scoring System for DrugEye Clinical Command Center
 * 
 * Based on clinical data model principles from:
 * "Data Model Considerations for Clinical Effectiveness Researchers" (PMC3824370)
 * 
 * This system provides transparency about data completeness and sources
 * for medical information, ensuring healthcare professionals can make
 * informed decisions about data reliability, following clinical research best practices.
 */

export interface DrugDataQuality {
  completeness: number; // 0-100%
  source: string; // 'UAE_MOH_OFFICIAL', 'FDA_DailyMed', 'EMA', 'MANUAL_VERIFICATION', 'SMART_DEFAULT'
  lastVerified: Date | null;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  requiresVerification: boolean;
  tier: 'TIER_1' | 'TIER_2' | 'TIER_3';
  metadata: {
    dataType: string; // 'CLINICAL', 'ADMINISTRATIVE', 'BASIC'
    collectionMethod: string; // 'OFFICIAL_SOURCE', 'AUTOMATED_EXTRACTION', 'MANUAL_ENTRY'
    validationStatus: string; // 'VERIFIED', 'PENDING', 'DEFAULT'
    researchReady: boolean; // Suitable for clinical research
  };
}

export interface ICD10MappingQuality {
  source: string; // 'FDA_SPL', 'WHO_ATC', 'RXNORM_MESH', 'THERAPEUTIC_INFERENCE'
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  evidenceLevel: string; // 'APPROVED_INDICATION', 'THERAPEUTIC_CLASSIFICATION', 'THERAPEUTIC_RELATIONSHIP', 'THERAPEUTIC_INFERENCE'
  tier: 'TIER_1' | 'TIER_2' | 'TIER_3';
  isValidated: boolean;
  requiresReview: boolean;
  lastVerified: Date | null;
}

export interface DrugDataCompleteness {
  basicInfo: boolean; // drug code, name, strength, form
  clinicalData: boolean; // pregnancy, G6PD, dosing
  safetyData: boolean; // interactions, side effects, warnings
  regulatoryData: boolean; // status, pricing, availability
  sourceAttribution: boolean; // verified source
}

/**
 * Calculate data quality score for a drug
 */
export function calculateDrugDataQuality(drug: any): DrugDataQuality {
  const completeness: DrugDataCompleteness = {
    basicInfo: !!drug.drugCode && !!drug.packageName && !!drug.genericName,
    clinicalData: !!drug.pregnancyCategory && !!drug.g6pdSafety && !!drug.baseDoseMgPerKg,
    safetyData: hasSafetyData(drug),
    regulatoryData: !!drug.status && !!drug.packagePricePublic,
    sourceAttribution: hasSourceAttribution(drug)
  };

  const completenessScore = calculateCompletenessScore(completeness);
  const tier = determineDataTier(completenessScore, completeness, drug.source);
  const confidence = determineConfidence(tier, drug.source, drug.lastVerified);
  const metadata = determineMetadata(drug, completeness, tier);
  
  return {
    completeness: completenessScore,
    source: determineSource(drug),
    lastVerified: drug.lastVerified || null,
    confidence,
    requiresVerification: confidence !== 'HIGH',
    tier,
    metadata
  };
}

function hasSafetyData(drug: any): boolean {
  const hasInteractions = drug.interactions && drug.interactions.length > 0;
  const hasSideEffects = drug.sideEffects && drug.sideEffects.length > 0;
  const hasWarnings = !!drug.warnings;
  return hasInteractions || hasSideEffects || hasWarnings;
}

function hasSourceAttribution(drug: any): boolean {
  // Check if drug has verified source information
  return !!drug.source || !!drug.verifiedAt || !!drug.verifiedBy;
}

function calculateCompletenessScore(completeness: DrugDataCompleteness): number {
  let score = 0;
  const weights = {
    basicInfo: 30,
    clinicalData: 25,
    safetyData: 25,
    regulatoryData: 10,
    sourceAttribution: 10
  };

  if (completeness.basicInfo) score += weights.basicInfo;
  if (completeness.clinicalData) score += weights.clinicalData;
  if (completeness.safetyData) score += weights.safetyData;
  if (completeness.regulatoryData) score += weights.regulatoryData;
  if (completeness.sourceAttribution) score += weights.sourceAttribution;

  return score;
}

function determineDataTier(score: number, completeness: DrugDataCompleteness, source: string): 'TIER_1' | 'TIER_2' | 'TIER_3' {
  // TIER_1: Complete data from official sources, suitable for clinical research
  if (score >= 80 && completeness.basicInfo && completeness.sourceAttribution && source === 'UAE_MOH_OFFICIAL') {
    return 'TIER_1';
  }
  // TIER_2: Basic verified data, clinical data from official sources or smart defaults
  else if (score >= 50 && completeness.basicInfo && (source === 'UAE_MOH_OFFICIAL' || source === 'FDA_DailyMed' || source === 'SMART_DEFAULT')) {
    return 'TIER_2';
  }
  // TIER_3: Limited data, requires professional verification
  else {
    return 'TIER_3';
  }
}

function determineConfidence(tier: string, source: string, lastVerified: Date | null): 'HIGH' | 'MEDIUM' | 'LOW' {
  if (tier === 'TIER_1' && source === 'UAE_MOH_OFFICIAL' && lastVerified) {
    return 'HIGH';
  } else if (tier === 'TIER_2' && (source === 'UAE_MOH_OFFICIAL' || source === 'FDA_DailyMed')) {
    return 'MEDIUM';
  } else if (tier === 'TIER_2' && source === 'SMART_DEFAULT') {
    return 'MEDIUM'; // Smart defaults are conservative but not verified
  } else {
    return 'LOW';
  }
}

function determineSource(drug: any): string {
  if (drug.source) return drug.source;
  if (drug.verifiedBy) return `MANUAL_VERIFICATION: ${drug.verifiedBy}`;
  if (drug.importSource) return drug.importSource;
  return 'UAE_MOH_OFFICIAL'; // Default to official source
}

function determineMetadata(drug: any, completeness: DrugDataCompleteness, tier: string) {
  return {
    dataType: completeness.clinicalData ? 'CLINICAL' : completeness.regulatoryData ? 'ADMINISTRATIVE' : 'BASIC',
    collectionMethod: drug.source === 'SMART_DEFAULT' ? 'AUTOMATED_EXTRACTION' : 'OFFICIAL_SOURCE',
    validationStatus: drug.source === 'UAE_MOH_OFFICIAL' ? 'VERIFIED' : drug.source === 'SMART_DEFAULT' ? 'DEFAULT' : 'PENDING',
    researchReady: tier === 'TIER_1' && drug.source === 'UAE_MOH_OFFICIAL'
  };
}

/**
 * Get data quality badge configuration
 */
export function getDataQualityBadge(quality: DrugDataQuality) {
  const badges = {
    TIER_1: {
      label: 'Verified',
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: '✓'
    },
    TIER_2: {
      label: 'Basic Info',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      icon: '⚠'
    },
    TIER_3: {
      label: 'Limited Data',
      color: 'bg-red-100 text-red-800 border-red-200',
      icon: '!'
    }
  };

  return badges[quality.tier];
}

/**
 * Generate data quality warning message
 */
export function getDataQualityWarning(quality: DrugDataQuality): string {
  if (quality.confidence === 'HIGH') {
    return 'Data verified from official sources';
  } else if (quality.confidence === 'MEDIUM') {
    return 'Basic drug information verified. Clinical data may be incomplete. Verify with official sources.';
  } else {
    return 'Limited data available. This drug requires professional verification before clinical use. Always consult official drug references.';
  }
}

/**
 * Check if drug is safe for clinical use based on data quality
 */
export function isSafeForClinicalUse(quality: DrugDataQuality): boolean {
  return quality.confidence === 'HIGH' && quality.tier === 'TIER_1';
}

/**
 * Get data completeness breakdown for UI display
 */
export function getDataCompletenessBreakdown(drug: any) {
  return {
    basicInfo: {
      complete: !!drug.drugCode && !!drug.packageName && !!drug.genericName,
      label: 'Basic Information'
    },
    clinicalData: {
      complete: !!drug.pregnancyCategory && !!drug.g6pdSafety,
      label: 'Clinical Data (Pregnancy, G6PD)'
    },
    safetyData: {
      complete: hasSafetyData(drug),
      label: 'Safety Data (Interactions, Side Effects)'
    },
    regulatoryData: {
      complete: !!drug.status && !!drug.packagePricePublic,
      label: 'Regulatory Data (Status, Pricing)'
    }
  };
}

/**
 * Calculate ICD-10 mapping quality
 */
export function calculateICD10MappingQuality(mapping: any): ICD10MappingQuality {
  const source = mapping.source || 'THERAPEUTIC_INFERENCE';
  const confidence = mapping.confidence || determineSourceConfidence(source);
  const evidenceLevel = mapping.evidenceLevel || determineEvidenceLevel(source);
  const tier = determineICD10Tier(source, confidence, mapping.isValidated);
  
  return {
    source,
    confidence,
    evidenceLevel,
    tier,
    isValidated: mapping.isValidated || false,
    requiresReview: mapping.requiresReview !== false,
    lastVerified: mapping.lastVerified || null
  };
}

function determineSourceConfidence(source: string): 'HIGH' | 'MEDIUM' | 'LOW' {
  const sourceConfidence: Record<string, 'HIGH' | 'MEDIUM' | 'LOW'> = {
    'FDA_SPL': 'HIGH',
    'WHO_ATC': 'HIGH',
    'RXNORM_MESH': 'MEDIUM',
    'THERAPEUTIC_INFERENCE': 'LOW',
    'UAE_MOH_OFFICIAL': 'HIGH',
    'EMA': 'HIGH'
  };
  
  return sourceConfidence[source] || 'LOW';
}

function determineEvidenceLevel(source: string): string {
  const sourceEvidence: Record<string, string> = {
    'FDA_SPL': 'APPROVED_INDICATION',
    'WHO_ATC': 'THERAPEUTIC_CLASSIFICATION',
    'RXNORM_MESH': 'THERAPEUTIC_RELATIONSHIP',
    'THERAPEUTIC_INFERENCE': 'THERAPEUTIC_INFERENCE',
    'UAE_MOH_OFFICIAL': 'APPROVED_INDICATION',
    'EMA': 'APPROVED_INDICATION'
  };
  
  return sourceEvidence[source] || 'THERAPEUTIC_INFERENCE';
}

function determineICD10Tier(source: string, confidence: string, isValidated: boolean): 'TIER_1' | 'TIER_2' | 'TIER_3' {
  // TIER_1: Official regulatory sources, validated
  if ((source === 'FDA_SPL' || source === 'UAE_MOH_OFFICIAL' || source === 'EMA') && 
      confidence === 'HIGH' && isValidated) {
    return 'TIER_1';
  }
  // TIER_2: Authoritative medical databases or official sources not yet validated
  else if ((source === 'FDA_SPL' || source === 'WHO_ATC' || source === 'UAE_MOH_OFFICIAL' || source === 'EMA') && 
           (confidence === 'HIGH' || confidence === 'MEDIUM')) {
    return 'TIER_2';
  }
  // TIER_2: RxNorm with medium confidence
  else if (source === 'RXNORM_MESH' && confidence === 'MEDIUM') {
    return 'TIER_2';
  }
  // TIER_3: Therapeutic inference or low confidence
  else {
    return 'TIER_3';
  }
}

/**
 * Get ICD-10 mapping quality badge configuration
 */
export function getICD10MappingQualityBadge(quality: ICD10MappingQuality) {
  const badges = {
    TIER_1: {
      label: 'FDA Approved',
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: '🔵'
    },
    TIER_2: {
      label: 'WHO Standard',
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: '🟢'
    },
    TIER_3: {
      label: 'Therapeutic Inference',
      color: 'bg-orange-100 text-orange-800 border-orange-200',
      icon: '🟠'
    }
  };

  return badges[quality.tier];
}

/**
 * Get ICD-10 mapping quality warning message
 */
export function getICD10MappingQualityWarning(quality: ICD10MappingQuality): string {
  if (quality.tier === 'TIER_1') {
    return 'Official FDA-approved indication mapping';
  } else if (quality.tier === 'TIER_2') {
    return 'Based on WHO ATC classification or authoritative medical database';
  } else {
    return 'Therapeutic inference based on drug category. Verify with official sources before clinical use.';
  }
}

/**
 * Check if ICD-10 mapping is safe for clinical decision support
 */
export function isICD10SafeForClinicalUse(quality: ICD10MappingQuality): boolean {
  return quality.tier === 'TIER_1' && quality.isValidated;
}
