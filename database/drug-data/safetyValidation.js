/**
 * Drug Safety Data Validation System
 * Enforces presence and validity of critical safety information:
 * - Documentation (PIL/PI)
 * - Storage Conditions
 * - Shelf Life / Expiry
 * - Batch Records
 */

export const SAFETY_REQUIREMENTS = {
  DOCS: ['pi_url', 'pil_url'],
  STORAGE: ['temperature_range', 'conditions'],
  BATCH: ['current_batch_number', 'last_qc_date'],
};

/**
 * Validates if a drug object has all required safety data
 * @param {Object} drug - The drug object from formulary
 * @returns {Object} validation result { valid: boolean, errors: string[], warnings: string[] }
 */
export function validateDrugSafety(drug) {
  const result = {
    valid: true,
    errors: [],
    warnings: [],
    safetyStatus: 'active',
  };

  // 1. Documentation Check
  if (!drug.documentation) {
    result.errors.push('Missing documentation object');
  } else {
    if (!drug.documentation.pi_url) result.errors.push('Missing Prescribing Information (PI) URL');
    if (!drug.documentation.pil_url)
      result.errors.push('Missing Patient Information Leaflet (PIL) URL');
  }

  // 2. Storage Conditions Check
  if (!drug.storage_conditions) {
    result.errors.push('Missing storage_conditions object');
  } else {
    if (!drug.storage_conditions.temperature_range)
      result.errors.push('Missing storage temperature range');
    // conditions description is optional but recommended
    if (!drug.storage_conditions.description)
      result.warnings.push('Missing detailed storage description');
  }

  // 3. Expiry / Shelf Life Check
  if (!drug.shelf_life) {
    result.errors.push('Missing shelf_life information');
  }

  // 4. Batch Records Check
  if (!drug.batch_data) {
    result.errors.push('Missing batch_data object');
  } else {
    if (!drug.batch_data.current_batch_number) result.errors.push('Missing current batch number');
    if (!drug.batch_data.expiry_date) result.errors.push('Missing current batch expiry date');

    // Check if expired
    if (drug.batch_data.expiry_date) {
      const expiry = new Date(drug.batch_data.expiry_date);
      const now = new Date();
      if (expiry < now) {
        result.errors.push(`Current batch expired on ${drug.batch_data.expiry_date}`);
      } else if ((expiry - now) / (1000 * 60 * 60 * 24) < 90) {
        result.warnings.push('Current batch expires in less than 90 days');
      }
    }
  }

  // Determine final status
  if (result.errors.length > 0) {
    result.valid = false;
    result.safetyStatus = 'quarantine'; // Block distribution/display if safety data missing
  } else if (result.warnings.length > 0) {
    result.safetyStatus = 'review_required';
  }

  return result;
}
