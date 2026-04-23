import { drugToIcd10Mapping } from '../drug-data/drugMappings.js';
import { additionalDrugMappings } from '../drug-data/drugMappings2.js';
import { uaeDrugMappings as drugMappings3 } from '../drug-data/drugMappings3.js';
import { drugToIcd10Mapping as expandedDrugMappings } from '../drug-data/drugMappings-expanded.js';
import { expandedDrugMappings as expandedDrugMappings20Percent } from '../drug-data/drugMappings-expanded-20percent.js';
import { enrichedDrugMappings } from '../drug-data/drugMappings-enriched.js';
import { uaeDrugMappings } from '../drug-data/uaeMappings.js';
import { combinationDrugMappings } from '../drug-data/combination-mappings.js';

// Define types for better type safety
interface Icd10Code {
  code: string;
  description: string;
}

interface DrugMapping {
  [key: string]: Icd10Code[];
}

// Consolidated and optimized ICD-10 mappings
export const CONSOLIDATED_MAPPINGS: DrugMapping = {
  ...(drugToIcd10Mapping as DrugMapping),
  ...(additionalDrugMappings as DrugMapping),
  ...(drugMappings3 as DrugMapping), // Include drugMappings3
  ...(expandedDrugMappings as DrugMapping), // Include expanded mappings
  ...(expandedDrugMappings20Percent as DrugMapping), // Include 20% expanded mappings
  ...(enrichedDrugMappings as DrugMapping), // Include enriched mappings
  ...(uaeDrugMappings as DrugMapping), // Include UAE specific mappings
  ...(combinationDrugMappings as DrugMapping), // Include high-quality combination mappings (Overrides previous)

  // Enhanced common drugs with proper ICD-10 codes
  metformin: [
    { code: 'E11.9', description: 'Type 2 diabetes mellitus without complications' },
    { code: 'E11.65', description: 'Type 2 diabetes mellitus with hyperglycemia' },
  ],

  lisinopril: [
    { code: 'I10', description: 'Essential (primary) hypertension' },
    { code: 'I50.9', description: 'Heart failure, unspecified' },
  ],

  atorvastatin: [
    { code: 'E78.5', description: 'Hyperlipidemia, unspecified' },
    { code: 'E78.2', description: 'Mixed hyperlipidemia' },
  ],

  // UAE-specific medications
  'panadol advance': [
    { code: 'R52', description: 'Pain, unspecified' },
    { code: 'R50.9', description: 'Fever, unspecified' },
  ],

  'brufen plus': [
    { code: 'M25.50', description: 'Pain in unspecified joint' },
    { code: 'R50.9', description: 'Fever, unspecified' },
  ],

  'voltaren emulgel': [
    { code: 'M25.50', description: 'Pain in unspecified joint' },
    { code: 'M79.3', description: 'Panniculitis, unspecified' },
    { code: 'M15.9', description: 'Osteoarthritis, unspecified' },
    { code: 'M79.3', description: 'Myalgia' },
  ],
  'diclofenac gel': [
    { code: 'M25.50', description: 'Pain in unspecified joint' },
    { code: 'M79.3', description: 'Panniculitis, unspecified' },
    { code: 'M15.9', description: 'Osteoarthritis, unspecified' },
    { code: 'M79.3', description: 'Myalgia' },
  ],
  // Helicobacter pylori treatment
  pylera: [
    { code: 'K29.70', description: 'Helicobacter pylori gastritis' },
    { code: 'K27.9', description: 'Peptic ulcer disease, unspecified' },
    {
      code: 'B96.81',
      description: 'Helicobacter pylori as the cause of diseases classified elsewhere',
    },
    { code: 'K25.9', description: 'Gastric ulcer, unspecified' },
    { code: 'K26.9', description: 'Duodenal ulcer, unspecified' },
  ],
  'bismuth subcitrate potassium metronidazole tetracycline': [
    { code: 'K29.70', description: 'Helicobacter pylori gastritis' },
    { code: 'K27.9', description: 'Peptic ulcer disease, unspecified' },
    {
      code: 'B96.81',
      description: 'Helicobacter pylori as the cause of diseases classified elsewhere',
    },
  ],

  'diclofenac cream': [
    { code: 'M25.50', description: 'Pain in unspecified joint' },
    { code: 'M79.3', description: 'Panniculitis, unspecified' },
    { code: 'M15.9', description: 'Osteoarthritis, unspecified' },
  ],
  'diclofenac topical': [
    { code: 'M25.50', description: 'Pain in unspecified joint' },
    { code: 'M79.3', description: 'Panniculitis, unspecified' },
    { code: 'M15.9', description: 'Osteoarthritis, unspecified' },
  ],

  // Topical/localized pain medications
  'lidocaine patch': [
    { code: 'G89.29', description: 'Other chronic pain' },
    { code: 'B02.29', description: 'Postherpetic neuralgia' },
    { code: 'M79.3', description: 'Panniculitis, unspecified' },
    { code: 'G50.9', description: 'Disorder of trigeminal nerve, unspecified' },
  ],
  lidoderm: [
    { code: 'G89.29', description: 'Other chronic pain' },
    { code: 'B02.29', description: 'Postherpetic neuralgia' },
  ],
};
