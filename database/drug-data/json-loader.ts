import fs from 'fs';
import path from 'path';
import { Drug } from './csv-loader';

let cachedDrugs: Drug[] | null = null;

export async function loadDrugsFromJSON(): Promise<Drug[]> {
  if (cachedDrugs) {
    return cachedDrugs;
  }

  try {
    const jsonPath = path.join(process.cwd(), 'public', 'uae-drugs-llm-dataset.json');

    if (!fs.existsSync(jsonPath)) {
      console.warn('[JSON Loader] UAE drug dataset file not found at:', jsonPath);
      return [];
    }

    const fileContent = await fs.promises.readFile(jsonPath, 'utf8');
    const rawDrugs = JSON.parse(fileContent);

    if (!Array.isArray(rawDrugs)) {
      console.warn('[JSON Loader] Data is not an array');
      return [];
    }

    const loadedDrugs = rawDrugs.map((drug: any, index: number) => {
      // Determine controlled status more accurately from Dispense Mode
      const dispenseMode = (drug['Dispense Mode'] || '').toLowerCase();
      const isControlled =
        dispenseMode.includes('narcotic') ||
        (dispenseMode.includes('controlled') &&
          !dispenseMode.includes('semi-controlled') &&
          !dispenseMode.includes('non-controlled'));
      const isSemiControlled = dispenseMode.includes('semi-controlled');
      const isNarcotic = dispenseMode.includes('narcotic');

      // Map controlled_status string for UI
      let controlledStatus = 'Non-Controlled';
      if (isNarcotic) controlledStatus = 'Narcotic';
      else if (isControlled) controlledStatus = 'Controlled';
      else if (isSemiControlled) controlledStatus = 'Semi-Controlled';

      return {
        id: drug['Drug Code'] || (index + 1).toString(),
        drug_name: drug['Package Name'],
        generic_name: drug['Generic Name'],
        // Use Therapeutic Indication as category if available, fallback to generic name or Uncategorized
        category: drug['Therapeutic Indication'] || drug['Generic Name'] || 'Uncategorized',
        strength: drug['Strength'] || '',
        dosage_form: drug['Dosage Form'] || '',
        prescription_status: drug['Dispense Mode'] || '',

        // Boolean flags for compatibility
        is_controlled: isControlled,
        is_semi_controlled: isSemiControlled,
        is_narcotic: isNarcotic,

        // Granular status string
        controlled_status: controlledStatus,

        // Coverage flags
        thiqa_coverage:
          (drug['Included in Thiqa/ ABM - other than 1&7- Drug Formulary'] || '').toLowerCase() ===
          'yes',
        basic_coverage: (drug['Included In Basic Drug Formulary'] || '').toLowerCase() === 'yes',
        abm1_coverage: (drug['Included In ABM 1 Drug Formulary'] || '').toLowerCase() === 'yes',
        abm7_coverage: (drug['Included In ABM 7 Drug Formulary'] || '').toLowerCase() === 'yes',

        // Pricing
        price_public: parseFloat(drug['Package Price to Public'] || '0'),
        price_pharmacy: parseFloat(drug['Package Price to Pharmacy'] || '0'),

        // Additional metadata
        manufacturer: drug['Manufacturer Name'] || '',
        agent_name: drug['Agent Name'] || '',
        icd10_codes: drug['ICD-10 Codes'] || [],
        mechanism_of_action: drug['Mechanism of Action'] || '',

        // Keep original fields
        ...drug,
      };
    });

    cachedDrugs = loadedDrugs;
    console.log(`[JSON Loader] Successfully loaded ${loadedDrugs.length} drugs from JSON`);
    return loadedDrugs;
  } catch (error) {
    console.error('[JSON Loader] Error loading UAE drug dataset', error);
    return [];
  }
}

export function clearDrugCache() {
  cachedDrugs = null;
}
