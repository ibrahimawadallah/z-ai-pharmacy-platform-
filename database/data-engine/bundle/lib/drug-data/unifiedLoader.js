/**
 * Unified Data Loader
 * Single source of truth for all drug-ICD10 mappings
 * Supports both file-based (dev) and MongoDB (production/Vercel) sources
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoClient } from 'mongodb';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory cache
let mappingsCache = null;
let cacheTimestamp = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// MongoDB connection
let mongoClient = null;
let mongoDb = null;

/**
 * Connect to MongoDB (for production/Vercel deployment)
 */
async function connectMongoDB() {
  if (mongoDb) return mongoDb;

  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.warn('[UnifiedLoader] No MONGODB_URI found, using file-based fallback');
      return null;
    }

    mongoClient = new MongoClient(uri);
    await mongoClient.connect();
    mongoDb = mongoClient.db();
    console.log('[UnifiedLoader] Connected to MongoDB');
    return mongoDb;
  } catch (error) {
    console.error('[UnifiedLoader] MongoDB connection failed:', error.message);
    return null;
  }
}

/**
 * Load mappings from MongoDB
 */
async function loadFromMongoDB() {
  try {
    const db = await connectMongoDB();
    if (!db) return null;

    // Load from drugs collection with ICD-10 mappings embedded
    const collection = db.collection('drugs');
    const drugs = await collection.find({}).limit(10000).toArray();

    if (drugs && drugs.length > 0) {
      // Build mappings object from drugs collection
      const mappings = {};
      for (const drug of drugs) {
        const key = normalize(drug.drug_name || drug.name || '');
        if (key && drug.relatedIcd10Codes && Array.isArray(drug.relatedIcd10Codes)) {
          mappings[key] = drug.relatedIcd10Codes;
        }

        // Also add generic name mapping
        if (drug.generic_name) {
          const genericKey = normalize(drug.generic_name);
          if (genericKey && drug.relatedIcd10Codes) {
            mappings[genericKey] = drug.relatedIcd10Codes;
          }
        }
      }

      console.log(
        `[UnifiedLoader] Built ${Object.keys(mappings).length.toLocaleString()} mappings from MongoDB drugs`
      );
      return mappings;
    }

    return null;
  } catch (error) {
    console.error('[UnifiedLoader] Error loading from MongoDB:', error.message);
    return null;
  }
}

/**
 * Load unified drug-ICD10 mappings
 * Tries file system first, falls back to MongoDB for Vercel
 */
export async function loadUnifiedMappings() {
  // Return cached version if still valid
  if (mappingsCache && cacheTimestamp && Date.now() - cacheTimestamp < CACHE_TTL) {
    return mappingsCache;
  }

  try {
    // Try file system first (for local development)
    const mappingPath = path.join(__dirname, '../../data/unified/drug-icd10-map.json');

    if (fs.existsSync(mappingPath)) {
      const content = fs.readFileSync(mappingPath, 'utf-8');
      mappingsCache = JSON.parse(content);
      cacheTimestamp = Date.now();
      console.log(
        `[UnifiedLoader] Loaded ${Object.keys(mappingsCache).length.toLocaleString()} mappings from file`
      );
      return mappingsCache;
    }

    // Fall back to MongoDB (for production/Vercel)
    console.log('[UnifiedLoader] File not found, trying MongoDB...');
    const mongoMappings = await loadFromMongoDB();

    if (mongoMappings) {
      mappingsCache = mongoMappings;
      cacheTimestamp = Date.now();
      return mappingsCache;
    }

    console.error('[UnifiedLoader] No data source available');
    return {};
  } catch (error) {
    console.error('[UnifiedLoader] Error loading mappings:', error.message);

    // Try MongoDB as last resort
    try {
      const mongoMappings = await loadFromMongoDB();
      if (mongoMappings) {
        mappingsCache = mongoMappings;
        cacheTimestamp = Date.now();
        return mappingsCache;
      }
    } catch (mongoError) {
      console.error('[UnifiedLoader] MongoDB fallback failed:', mongoError.message);
    }

    return {};
  }
}

/**
 * Normalize drug name for lookup
 */
function normalize(name) {
  if (!name) return '';
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, '');
}

/**
 * Get ICD-10 mappings for a drug
 * Single function replacing all fragmented getMappings functions
 *
 * @param {string} drugName - Generic drug name
 * @param {string} packageName - Brand/package name
 * @param {string} dosageForm - Dosage form (tablet, injection, etc.)
 * @param {string} searchQuery - Original search query (optional)
 * @returns {Array} Array of ICD-10 codes with descriptions
 */
export async function getMappingsForDrug(
  drugName,
  packageName = null,
  dosageForm = null,
  searchQuery = null
) {
  const mappings = await loadUnifiedMappings();

  // Try exact matches first (highest priority)
  const lookupKeys = [
    packageName, // Brand name (e.g., "KIDNAPS")
    drugName, // Generic name (e.g., "Melatonin")
    searchQuery, // Original search query
  ]
    .filter(Boolean)
    .map(normalize);

  // Check for direct matches
  for (const key of lookupKeys) {
    if (mappings[key]) {
      return Array.isArray(mappings[key]) ? mappings[key] : [];
    }
  }

  // Try generic name + dosage form combinations
  if (drugName && dosageForm) {
    const combinedKey = normalize(`${drugName} ${dosageForm}`);
    if (mappings[combinedKey]) {
      return Array.isArray(mappings[combinedKey]) ? mappings[combinedKey] : [];
    }
  }

  // Try variants (handle + and - in names)
  if (drugName) {
    const variants = [
      normalize(drugName),
      normalize(drugName.replace(/[+]/g, '-')),
      normalize(drugName.replace(/[+]/g, ' ')),
      normalize(drugName.replace(/\s+/g, '')),
    ];

    for (const variant of variants) {
      if (mappings[variant]) {
        return Array.isArray(mappings[variant]) ? mappings[variant] : [];
      }
    }
  }

  // Try partial matches (search within keys)
  const searchKey = normalize(packageName || drugName || '');
  if (searchKey && searchKey.length >= 3) {
    for (const [key, codes] of Object.entries(mappings)) {
      if (key.includes(searchKey) || searchKey.includes(key)) {
        return Array.isArray(codes) ? codes : [];
      }
    }
  }

  // No mappings found
  return [];
}

/**
 * Get all mappings (for backward compatibility)
 */
export async function getAllMappings() {
  return await loadUnifiedMappings();
}

/**
 * Clear cache (useful for testing or forced reload)
 */
export function clearCache() {
  mappingsCache = null;
  cacheTimestamp = null;
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  return {
    cached: !!mappingsCache,
    entries: mappingsCache ? Object.keys(mappingsCache).length : 0,
    age: cacheTimestamp ? Date.now() - cacheTimestamp : 0,
    ttl: CACHE_TTL,
  };
}

/**
 * Preload mappings (for faster first request)
 */
export async function preloadMappings() {
  console.log('[UnifiedLoader] Preloading mappings...');
  await loadUnifiedMappings();
  console.log('[UnifiedLoader] Preload complete');
}
