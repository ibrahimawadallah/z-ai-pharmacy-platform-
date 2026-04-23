import {
  loadUnifiedMappings,
  getMappingsForDrug as coreGetMappingsForDrug,
  getCacheStats as coreGetCacheStats,
  clearCache as coreClearCache,
  preloadMappings as corePreloadMappings,
} from '../lib/drug-data/unifiedLoader.js';

export async function loadMappings() {
  return loadUnifiedMappings();
}

export async function getMappingsForDrug(
  drugName,
  packageName = null,
  dosageForm = null,
  searchQuery = null
) {
  return coreGetMappingsForDrug(drugName, packageName, dosageForm, searchQuery);
}

export function getCacheStats() {
  return coreGetCacheStats();
}

export function clearCache() {
  coreClearCache();
}

export async function preloadMappings() {
  await corePreloadMappings();
}
