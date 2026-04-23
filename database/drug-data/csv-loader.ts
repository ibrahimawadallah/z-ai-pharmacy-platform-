import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

export interface Drug {
  id: string;
  drug_name: string;
  generic_name: string;
  category: string;
  strength: string;
  dosage_form: string;
  prescription_status: string;
  is_controlled: boolean;
  is_semi_controlled: boolean;
  thiqa_coverage: boolean;
  basic_coverage: boolean;
  icd10_codes: any[];
  [key: string]: any;
}

let cachedDrugs: Drug[] | null = null;

export async function loadDrugsFromCSV(): Promise<Drug[]> {
  if (cachedDrugs) {
    return cachedDrugs;
  }

  try {
    // Try to find the CSV file in standard locations
    // In Vercel, process.cwd() is the project root
    const possiblePaths = [
      path.join(process.cwd(), 'data', 'csv', 'UAE drug list.csv'),
      path.join(process.cwd(), 'public', 'data', 'csv', 'UAE drug list.csv'),
      path.join(process.cwd(), 'lib', 'drug-data', 'UAE drug list.csv'),
      path.join(process.cwd(), '..', 'data', 'csv', 'UAE drug list.csv'), // For local dev sometimes
    ];

    let csvPath = '';
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        csvPath = p;
        break;
      }
    }

    if (!csvPath) {
      console.warn('[CSV Loader] UAE drug database file not found in paths:', possiblePaths);
      return [];
    }

    const csvDataRaw = await fs.promises.readFile(csvPath, 'utf8');

    // Remove BOM if present
    let csvData = csvDataRaw;
    if (csvData.charCodeAt(0) === 0xfeff) {
      csvData = csvData.slice(1);
    }

    if (!csvData.trim()) {
      console.warn('[CSV Loader] UAE drug database file is empty');
      return [];
    }

    const parsed = Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header: string) => header.trim(),
    });

    if (parsed.errors.length > 0) {
      console.warn('[CSV Loader] CSV parsing errors detected', parsed.errors);
    }

    const validDrugs = parsed.data.filter(
      (drug: any) => drug && drug['Package Name'] && drug['Package Name'].trim()
    );

    let idCounter = 1;
    const loadedDrugs = validDrugs.map((drug: any) => {
      // Normalize fields to match Drug interface
      return {
        id: (idCounter++).toString(),
        drug_name: drug['Package Name'],
        generic_name: drug['Generic Name'],
        category: drug['Category'] || 'Uncategorized',
        strength: drug['Strength'] || '',
        dosage_form: drug['Dosage Form'] || '',
        prescription_status: drug['Prescription Status'] || '',
        is_controlled: (drug['Dispense Mode'] || '').toLowerCase().includes('controlled'),
        is_semi_controlled: (drug['Dispense Mode'] || '').toLowerCase().includes('semi-controlled'),
        thiqa_coverage:
          (drug['Included in Thiqa/ ABM - other than 1&7- Drug Formulary'] || '').toLowerCase() ===
          'yes',
        basic_coverage: (drug['Included In Basic Drug Formulary'] || '').toLowerCase() === 'yes',
        price_public: parseFloat(drug['Package Price to Public'] || '0'),
        price_pharmacy: parseFloat(drug['Package Price to Pharmacy'] || '0'),
        icd10_codes: [],
        ...drug,
      };
    });

    cachedDrugs = loadedDrugs;
    console.log(`[CSV Loader] Successfully loaded ${loadedDrugs.length} drugs from CSV`);
    return loadedDrugs;
  } catch (error) {
    console.error('[CSV Loader] Error loading UAE drug database', error);
    return [];
  }
}

export function clearDrugCache() {
  cachedDrugs = null;
}
