// pipeline/map_drugs_nlp.js
// Script to process UAE drug list, map to SNOMED/ICD-10, and output results (ESM version)

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Papa from 'papaparse';
import { mapDrugList } from '../lib/drug_mapper.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to UAE drug list (adjust as needed)
// Adjusted to point to the public/data/csv directory in the project root
const DRUG_LIST_PATH = path.join(__dirname, '../../../../public/data/csv/UAE drug list.csv');
const OUTPUT_PATH = path.join(__dirname, '../../../../data/json/uae_drug_snomed_icd10.json');

// Simple CSV loader (replace with a robust parser if needed)
function loadDrugListCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  // Use Papa Parse for robust CSV parsing (handles quotes, newlines, etc.)
  const parsed = Papa.parse(content, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
  });

  if (parsed.errors.length > 0) {
    console.warn('CSV parsing errors:', parsed.errors);
  }

  return parsed.data;
}

function main() {
  if (!fs.existsSync(DRUG_LIST_PATH)) {
    console.error('UAE drug list not found:', DRUG_LIST_PATH);
    process.exit(1);
  }
  const drugList = loadDrugListCSV(DRUG_LIST_PATH);
  const mapped = mapDrugList(drugList);
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(mapped, null, 2));
  console.log(`Mapped ${mapped.length} drugs. Output:`, OUTPUT_PATH);
}

if (
  import.meta.url === `file://${process.argv[1]}` ||
  import.meta.url.replace('file:///', 'file://').replace(/\\/g, '/') ===
    `file://${process.argv[1].replace(/\\/g, '/')}`
) {
  main();
} else {
  // Fallback for different environments or just run it
  console.log('Comparison failed, running main anyway');
  console.log('import.meta.url:', import.meta.url);
  console.log('process.argv[1]:', process.argv[1]);
  main();
}
