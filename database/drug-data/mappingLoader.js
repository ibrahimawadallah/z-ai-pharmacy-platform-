/**
 * Lazy Loading and Caching System for Drug Mappings
 * Implements lazy loading for expanded mappings and optimized caching
 */

import { drugToIcd10Mapping } from './drugMappings.js';
import { additionalDrugMappings } from './drugMappings2.js';
import { enrichedDrugMappings } from './drugMappings-enriched.js';
import {
  getMappingMetadata,
  setMappingMetadata,
  markAsAutomated,
  QUALITY_LEVELS,
  CONFIDENCE_SCORES,
} from './mappingQuality.js';

// Lazy loading state
let expandedMappingsLoaded = false;
let expandedMappings = null;
let expandedMetadata = null;
let allMappingsCache = null;
let normalizedMappingsCache = null;
let cacheTimestamp = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Lazy load expanded mappings only when needed
 */
async function loadExpandedMappings() {
  if (expandedMappingsLoaded) {
    return { mappings: expandedMappings, metadata: expandedMetadata };
  }

  try {
    // Dynamic import for lazy loading
    const expandedModule = await import('./drugMappings-expanded-20percent.js');
    expandedMappings = expandedModule.expandedDrugMappings || {};
    expandedMetadata = expandedModule.expandedMappingMetadata || {};
    expandedMappingsLoaded = true;

    // Initialize metadata for tracking
    for (const [drugName, meta] of Object.entries(expandedMetadata)) {
      if (!getMappingMetadata(drugName)) {
        setMappingMetadata(
          drugName,
          markAsAutomated(drugName, meta.confidence || CONFIDENCE_SCORES.LOW, meta.category || null)
        );
      }
    }

    return { mappings: expandedMappings, metadata: expandedMetadata };
  } catch (error) {
    console.warn('Failed to load expanded mappings:', error.message);
    expandedMappings = {};
    expandedMetadata = {};
    expandedMappingsLoaded = true;
    return { mappings: {}, metadata: {} };
  }
}

/**
 * Get all mappings with lazy loading
 */
export async function getAllMappings() {
  // Check cache first
  if (allMappingsCache && cacheTimestamp && Date.now() - cacheTimestamp < CACHE_TTL) {
    return allMappingsCache;
  }

  // Load base mappings (always loaded)
  const baseMappings = {
    ...drugToIcd10Mapping,
    ...additionalDrugMappings,
    ...enrichedDrugMappings, // Include enriched mappings
  };

  // Load consolidated mappings (includes Pylera and other manually curated drugs)
  let consolidatedMappings = {};
  try {
    const consolidatedModule = await import('../../api/icd10/mapping-consolidator.js');
    consolidatedMappings = consolidatedModule.CONSOLIDATED_MAPPINGS || {};
    console.log(
      '[MappingLoader] Loaded consolidated mappings, pylera exists:',
      'pylera' in consolidatedMappings
    );
  } catch (error) {
    console.error(
      '[MappingLoader] Failed to load consolidated mappings:',
      error.message,
      error.stack
    );
  }

  // Load complete UAE drug mappings (all 22,049 drugs)
  let completeMappings = {};
  try {
    const fs = await import('fs');
    const path = await import('path');
    const { fileURLToPath } = await import('url');
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const mappingPath = path.join(__dirname, '../../data/uae-drugs-complete-icd10-mappings.json');
    const cleanMappingPath = path.join(
      __dirname,
      '../../data/uae-drugs-complete-icd10-mappings-clean.json'
    );

    // Prefer the clean mapping file if it exists (quarantined flagged entries)
    const preferredPath = fs.existsSync(cleanMappingPath) ? cleanMappingPath : mappingPath;
    if (fs.existsSync(preferredPath)) {
      const content = fs.readFileSync(mappingPath, 'utf-8');
      completeMappings = JSON.parse(content);
      console.log(
        '[MappingLoader] Loaded complete UAE drug mappings:',
        Object.keys(completeMappings).length,
        'entries',
        '(source:',
        path.basename(preferredPath) + ')'
      );
    }
  } catch (error) {
    console.warn('[MappingLoader] Complete UAE mappings not yet generated:', error.message);
  }

  // Lazy load expanded mappings only when needed
  const { mappings: expanded } = await loadExpandedMappings();

  // Combine all mappings (priority: consolidated > complete UAE > base > expanded)
  allMappingsCache = {
    ...baseMappings,
    ...expanded,
    ...completeMappings, // Complete UAE mappings (22,049 drugs)
    ...consolidatedMappings, // Consolidated mappings override others (highest priority)
  };

  cacheTimestamp = Date.now();
  return allMappingsCache;
}

/**
 * Get normalized mappings with optimized caching
 */
export async function getNormalizedMappings() {
  // Check cache first
  if (normalizedMappingsCache && cacheTimestamp && Date.now() - cacheTimestamp < CACHE_TTL) {
    return normalizedMappingsCache;
  }

  const allMappings = await getAllMappings();
  normalizedMappingsCache = new Map();

  for (const [key, codes] of Object.entries(allMappings)) {
    const normalizedKey = key
      .toLowerCase()
      .replace(/[+-\s]/g, ' ')
      .trim();
    if (!normalizedMappingsCache.has(normalizedKey)) {
      normalizedMappingsCache.set(normalizedKey, { originalKey: key, codes });
    }
  }

  return normalizedMappingsCache;
}

/**
 * Clear caches (useful for testing or forced refresh)
 */
export function clearCaches() {
  allMappingsCache = null;
  normalizedMappingsCache = null;
  cacheTimestamp = null;
}

/**
 * Preload expanded mappings (optional, for performance-critical paths)
 */
export async function preloadExpandedMappings() {
  await loadExpandedMappings();
}

/**
 * Get mapping with quality information
 */
export async function getMappingWithQuality(drugName) {
  const allMappings = await getAllMappings();
  const normalized = drugName.toLowerCase();
  const metadata = getMappingMetadata(normalized);

  return {
    codes: allMappings[normalized] || null,
    metadata: metadata || null,
    quality: metadata ? metadata.quality : null,
    confidence: metadata ? metadata.confidence : null,
  };
}

/**
 * Check if expanded mappings are loaded
 */
export function isExpandedLoaded() {
  return expandedMappingsLoaded;
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  return {
    expandedLoaded: expandedMappingsLoaded,
    cacheAge: cacheTimestamp ? Date.now() - cacheTimestamp : null,
    cacheValid: cacheTimestamp && Date.now() - cacheTimestamp < CACHE_TTL,
    normalizedCacheSize: normalizedMappingsCache ? normalizedMappingsCache.size : 0,
  };
}
