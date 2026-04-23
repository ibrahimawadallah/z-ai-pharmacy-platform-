/**
 * Data Source Unification Script
 * Consolidates all fragmented drug-ICD10 mappings into single unified file
 * Eliminates redundancy and creates clear single source of truth
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting Data Unification Process...\n');

// ============================================================================
// STEP 1: Load all existing mapping sources
// ============================================================================

const sources = {
  // Base mappings (manually curated)
  base: null,
  additional: null,
  enriched: null,

  // Generated mappings
  uaeComplete: null,
  comprehensive: null,

  // Priority hotfixes
  hotfixes: {},
};

// Load base mappings from JS files
console.log('📂 Loading base mapping files...');
try {
  const { drugToIcd10Mapping } = await import('../lib/drug-data/drugMappings.js');
  sources.base = drugToIcd10Mapping;
  console.log(`  ✅ drugMappings.js: ${Object.keys(drugToIcd10Mapping).length} entries`);
} catch (error) {
  console.log('  ⚠️  drugMappings.js not found');
}

try {
  const { additionalDrugMappings } = await import('../lib/drug-data/drugMappings2.js');
  sources.additional = additionalDrugMappings;
  console.log(`  ✅ drugMappings2.js: ${Object.keys(additionalDrugMappings).length} entries`);
} catch (error) {
  console.log('  ⚠️  drugMappings2.js not found');
}

try {
  const { enrichedDrugMappings } = await import('../lib/drug-data/drugMappings-enriched.js');
  sources.enriched = enrichedDrugMappings;
  console.log(`  ✅ drugMappings-enriched.js: ${Object.keys(enrichedDrugMappings).length} entries`);
} catch (error) {
  console.log('  ⚠️  drugMappings-enriched.js not found');
}

// Load JSON mappings
console.log('\n📂 Loading JSON mapping files...');
const uaeCompletePath = path.join(__dirname, '../data/uae-drugs-complete-icd10-mappings.json');
if (fs.existsSync(uaeCompletePath)) {
  sources.uaeComplete = JSON.parse(fs.readFileSync(uaeCompletePath, 'utf-8'));
  console.log(
    `  ✅ uae-drugs-complete-icd10-mappings.json: ${Object.keys(sources.uaeComplete).length} entries`
  );
} else {
  console.log('  ⚠️  uae-drugs-complete-icd10-mappings.json not found');
}

const comprehensivePath = path.join(__dirname, '../data/icd10-comprehensive-mappings.json');
if (fs.existsSync(comprehensivePath)) {
  sources.comprehensive = JSON.parse(fs.readFileSync(comprehensivePath, 'utf-8'));
  console.log(
    `  ✅ icd10-comprehensive-mappings.json: ${Object.keys(sources.comprehensive).length} entries`
  );
} else {
  console.log('  ⚠️  icd10-comprehensive-mappings.json not found');
}

// ============================================================================
// STEP 2: Define priority hotfixes (medical accuracy critical)
// ============================================================================

console.log('\n🔧 Defining priority hotfixes...');

sources.hotfixes = {
  // Anticoagulants - Critical for DVT/PE prevention
  inhixa: [
    { code: 'I82.90', description: 'Acute embolism and thrombosis of unspecified vein' },
    { code: 'I26.99', description: 'Other pulmonary embolism without acute cor pulmonale' },
    { code: 'I48.91', description: 'Unspecified atrial fibrillation' },
    { code: 'I21.9', description: 'Acute myocardial infarction, unspecified' },
    { code: 'Z79.01', description: 'Long term (current) use of anticoagulants' },
  ],
  enoxaparin: [
    { code: 'I82.90', description: 'Acute embolism and thrombosis of unspecified vein' },
    { code: 'I26.99', description: 'Other pulmonary embolism without acute cor pulmonale' },
    { code: 'I48.91', description: 'Unspecified atrial fibrillation' },
    { code: 'I21.9', description: 'Acute myocardial infarction, unspecified' },
    { code: 'Z79.01', description: 'Long term (current) use of anticoagulants' },
  ],
  'enoxaparin sodium': [
    { code: 'I82.90', description: 'Acute embolism and thrombosis of unspecified vein' },
    { code: 'I26.99', description: 'Other pulmonary embolism without acute cor pulmonale' },
    { code: 'I48.91', description: 'Unspecified atrial fibrillation' },
    { code: 'I21.9', description: 'Acute myocardial infarction, unspecified' },
    { code: 'Z79.01', description: 'Long term (current) use of anticoagulants' },
  ],

  // Sleep medications - Melatonin products
  melatonin: [
    { code: 'G47.00', description: 'Insomnia, unspecified' },
    { code: 'G47.09', description: 'Other insomnia' },
    { code: 'F51.01', description: 'Primary insomnia' },
    { code: 'G47.9', description: 'Sleep disorder, unspecified' },
    { code: 'G47.10', description: 'Hypersomnia, unspecified' },
  ],
  kidnaps: [
    { code: 'G47.00', description: 'Insomnia, unspecified' },
    { code: 'G47.09', description: 'Other insomnia' },
    { code: 'F51.01', description: 'Primary insomnia' },
    { code: 'G47.9', description: 'Sleep disorder, unspecified' },
    { code: 'G47.10', description: 'Hypersomnia, unspecified' },
  ],
  kalmeton: [
    { code: 'G47.00', description: 'Insomnia, unspecified' },
    { code: 'G47.09', description: 'Other insomnia' },
    { code: 'F51.01', description: 'Primary insomnia' },
    { code: 'G47.9', description: 'Sleep disorder, unspecified' },
    { code: 'G47.10', description: 'Hypersomnia, unspecified' },
  ],
  slonix: [
    { code: 'G47.00', description: 'Insomnia, unspecified' },
    { code: 'G47.09', description: 'Other insomnia' },
    { code: 'F51.01', description: 'Primary insomnia' },
    { code: 'G47.9', description: 'Sleep disorder, unspecified' },
    { code: 'G47.10', description: 'Hypersomnia, unspecified' },
  ],
  circadin: [
    { code: 'G47.00', description: 'Insomnia, unspecified' },
    { code: 'G47.09', description: 'Other insomnia' },
    { code: 'F51.01', description: 'Primary insomnia' },
    { code: 'G47.9', description: 'Sleep disorder, unspecified' },
    { code: 'G47.10', description: 'Hypersomnia, unspecified' },
  ],
  melaton: [
    { code: 'G47.00', description: 'Insomnia, unspecified' },
    { code: 'G47.09', description: 'Other insomnia' },
    { code: 'F51.01', description: 'Primary insomnia' },
    { code: 'G47.9', description: 'Sleep disorder, unspecified' },
    { code: 'G47.10', description: 'Hypersomnia, unspecified' },
  ],
};

console.log(`  ✅ Defined ${Object.keys(sources.hotfixes).length} critical hotfixes`);

// ============================================================================
// STEP 3: Merge all sources with priority order
// ============================================================================

console.log('\n🔄 Merging data sources with priority order...');
console.log('   Priority: Hotfixes > Base > Additional > Enriched > UAE Complete > Comprehensive');

const unifiedMappings = {};
const stats = {
  total: 0,
  fromHotfixes: 0,
  fromBase: 0,
  fromAdditional: 0,
  fromEnriched: 0,
  fromUAEComplete: 0,
  fromComprehensive: 0,
  conflicts: 0,
};

// Helper function to normalize drug names
function normalize(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, '');
}

// Helper to merge sources
function mergeSource(source, sourceName, statsKey) {
  if (!source) return;

  let added = 0;
  let skipped = 0;

  for (const [drugName, codes] of Object.entries(source)) {
    const normalizedName = normalize(drugName);

    if (!unifiedMappings[normalizedName]) {
      unifiedMappings[normalizedName] = {
        originalName: drugName,
        codes: codes,
        source: sourceName,
      };
      added++;
      stats[statsKey]++;
    } else {
      skipped++;
      stats.conflicts++;
    }
  }

  console.log(`  ✅ ${sourceName}: Added ${added}, Skipped ${skipped} (already exists)`);
}

// Merge in priority order (lowest to highest, so highest wins)
mergeSource(sources.comprehensive, 'Comprehensive', 'fromComprehensive');
mergeSource(sources.uaeComplete, 'UAE Complete', 'fromUAEComplete');
mergeSource(sources.enriched, 'Enriched', 'fromEnriched');
mergeSource(sources.additional, 'Additional', 'fromAdditional');
mergeSource(sources.base, 'Base', 'fromBase');

// Apply hotfixes last (highest priority)
console.log('\n🔧 Applying priority hotfixes...');
for (const [drugName, codes] of Object.entries(sources.hotfixes)) {
  const normalizedName = normalize(drugName);
  const existed = !!unifiedMappings[normalizedName];

  unifiedMappings[normalizedName] = {
    originalName: drugName,
    codes: codes,
    source: 'HOTFIX',
    priority: 'critical',
  };

  stats.fromHotfixes++;
  console.log(`  ${existed ? '🔄 Overrode' : '✅ Added'}: ${drugName}`);
}

stats.total = Object.keys(unifiedMappings).length;

// ============================================================================
// STEP 4: Create unified directory and save
// ============================================================================

console.log('\n💾 Saving unified data...');

const unifiedDir = path.join(__dirname, '../data/unified');
if (!fs.existsSync(unifiedDir)) {
  fs.mkdirSync(unifiedDir, { recursive: true });
  console.log('  ✅ Created data/unified/ directory');
}

// Convert back to simple format for API compatibility
const simplifiedMappings = {};
for (const [normalizedName, data] of Object.entries(unifiedMappings)) {
  simplifiedMappings[normalizedName] = data.codes;
}

const mappingPath = path.join(unifiedDir, 'drug-icd10-map.json');
fs.writeFileSync(mappingPath, JSON.stringify(simplifiedMappings, null, 2));
console.log(`  ✅ Saved: data/unified/drug-icd10-map.json`);

// Save metadata for debugging
const metadataPath = path.join(unifiedDir, 'drug-icd10-map-metadata.json');
fs.writeFileSync(metadataPath, JSON.stringify(unifiedMappings, null, 2));
console.log(`  ✅ Saved: data/unified/drug-icd10-map-metadata.json (with source tracking)`);

// Save statistics
const statsPath = path.join(unifiedDir, 'unification-stats.json');
fs.writeFileSync(
  statsPath,
  JSON.stringify(
    {
      timestamp: new Date().toISOString(),
      stats: stats,
      sources: {
        hotfixes: Object.keys(sources.hotfixes).length,
        base: sources.base ? Object.keys(sources.base).length : 0,
        additional: sources.additional ? Object.keys(sources.additional).length : 0,
        enriched: sources.enriched ? Object.keys(sources.enriched).length : 0,
        uaeComplete: sources.uaeComplete ? Object.keys(sources.uaeComplete).length : 0,
        comprehensive: sources.comprehensive ? Object.keys(sources.comprehensive).length : 0,
      },
    },
    null,
    2
  )
);
console.log(`  ✅ Saved: data/unified/unification-stats.json`);

// ============================================================================
// STEP 5: Display summary
// ============================================================================

console.log('\n' + '='.repeat(70));
console.log('✅ DATA UNIFICATION COMPLETE');
console.log('='.repeat(70));
console.log(`
📊 Statistics:
   Total Unified Mappings: ${stats.total.toLocaleString()}

   Source Breakdown:
   - Hotfixes (Critical):  ${stats.fromHotfixes} entries
   - Base Mappings:        ${stats.fromBase} entries
   - Additional Mappings:  ${stats.fromAdditional} entries
   - Enriched Mappings:    ${stats.fromEnriched} entries
   - UAE Complete:         ${stats.fromUAEComplete} entries
   - Comprehensive:        ${stats.fromComprehensive} entries

   Conflicts Resolved:     ${stats.conflicts} (lower priority sources skipped)

📁 Output Files:
   ✅ data/unified/drug-icd10-map.json (${(fs.statSync(mappingPath).size / 1024 / 1024).toFixed(2)} MB)
   ✅ data/unified/drug-icd10-map-metadata.json
   ✅ data/unified/unification-stats.json

🎯 Next Steps:
   1. Update code to use: data/unified/drug-icd10-map.json
   2. Remove old mapping files after verification
   3. Update documentation
`);

console.log('='.repeat(70));
