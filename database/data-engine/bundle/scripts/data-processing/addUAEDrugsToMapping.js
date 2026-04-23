import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Common ICD-10 mappings for drug categories
const drugCategoryMappings = {
  // Antibiotics
  antibiotics: [
    { code: 'J02.9', description: 'Acute pharyngitis, unspecified' },
    { code: 'J18.9', description: 'Pneumonia, unspecified organism' },
    { code: 'N39.0', description: 'Urinary tract infection, site not specified' },
    { code: 'L03.90', description: 'Cellulitis, unspecified' },
  ],

  // Pain medications
  analgesics: [
    { code: 'R52', description: 'Pain, unspecified' },
    { code: 'M25.5', description: 'Pain in joint' },
    { code: 'R51', description: 'Headache' },
    { code: 'M54.5', description: 'Low back pain' },
  ],

  // Cardiovascular
  cardiovascular: [
    { code: 'I10', description: 'Essential (primary) hypertension' },
    { code: 'I50.9', description: 'Heart failure, unspecified' },
    {
      code: 'I25.10',
      description:
        'Atherosclerotic heart disease of native coronary artery without angina pectoris',
    },
    { code: 'I48.91', description: 'Unspecified atrial fibrillation' },
  ],

  // Diabetes medications
  diabetes: [
    { code: 'E11.9', description: 'Type 2 diabetes mellitus without complications' },
    { code: 'E10.9', description: 'Type 1 diabetes mellitus without complications' },
    { code: 'E11.65', description: 'Type 2 diabetes mellitus with hyperglycemia' },
  ],

  // Respiratory
  respiratory: [
    { code: 'J45.909', description: 'Unspecified asthma, uncomplicated' },
    { code: 'J44.9', description: 'Chronic obstructive pulmonary disease, unspecified' },
    { code: 'J30.9', description: 'Allergic rhinitis, unspecified' },
    { code: 'R05', description: 'Cough' },
  ],

  // Gastrointestinal
  gastrointestinal: [
    { code: 'K21.9', description: 'Gastro-esophageal reflux disease without esophagitis' },
    { code: 'K29.60', description: 'Other gastritis without bleeding' },
    { code: 'K59.1', description: 'Diarrhea, unspecified' },
    { code: 'K59.00', description: 'Constipation, unspecified' },
  ],

  // Mental health
  psychiatric: [
    { code: 'F32.9', description: 'Major depressive disorder, single episode, unspecified' },
    { code: 'F41.9', description: 'Anxiety disorder, unspecified' },
    { code: 'F25.9', description: 'Schizoaffective disorder, unspecified' },
    { code: 'G47.00', description: 'Insomnia, unspecified' },
  ],

  // Neurological
  neurological: [
    {
      code: 'G40.909',
      description: 'Epilepsy, unspecified, not intractable, without status epilepticus',
    },
    { code: 'G89.29', description: 'Other chronic pain' },
    {
      code: 'G43.909',
      description: 'Migraine, unspecified, not intractable, without status migrainosus',
    },
  ],

  // Dermatological
  dermatological: [
    { code: 'L70.0', description: 'Acne vulgaris' },
    { code: 'L20.9', description: 'Atopic dermatitis, unspecified' },
    { code: 'L40.0', description: 'Psoriasis vulgaris' },
    { code: 'B35.9', description: 'Dermatophytosis, unspecified' },
  ],

  // Vitamins and supplements
  vitamins: [
    { code: 'E55.9', description: 'Vitamin D deficiency, unspecified' },
    { code: 'E53.8', description: 'Deficiency of other specified B group vitamins' },
    { code: 'D50.9', description: 'Iron deficiency anemia, unspecified' },
    { code: 'E58', description: 'Dietary calcium deficiency' },
  ],

  // Hormonal
  hormonal: [
    { code: 'E03.9', description: 'Hypothyroidism, unspecified' },
    { code: 'E28.2', description: 'Polycystic ovarian syndrome' },
    { code: 'N95.1', description: 'Menopausal and female climacteric states' },
  ],
};

// Drug name patterns and their categories
const drugPatterns = {
  // Antibiotics
  antibiotics: [
    'cillin',
    'mycin',
    'floxacin',
    'cephalex',
    'azithro',
    'clarithro',
    'erythro',
    'doxycycline',
    'tetracycline',
    'clindamycin',
    'metronidazole',
    'vancomycin',
    'gentamicin',
    'trimethoprim',
    'nitrofurantoin',
    'cefuroxime',
    'ceftriaxone',
  ],

  // Pain medications
  analgesics: [
    'paracetamol',
    'acetaminophen',
    'ibuprofen',
    'diclofenac',
    'naproxen',
    'tramadol',
    'codeine',
    'morphine',
    'oxycodone',
    'fentanyl',
    'aspirin',
    'celecoxib',
    'indomethacin',
    'ketorolac',
    'piroxicam',
  ],

  // Cardiovascular
  cardiovascular: [
    'amlodipine',
    'nifedipine',
    'diltiazem',
    'verapamil',
    'lisinopril',
    'enalapril',
    'losartan',
    'valsartan',
    'telmisartan',
    'atenolol',
    'metoprolol',
    'bisoprolol',
    'carvedilol',
    'propranolol',
    'atorvastatin',
    'simvastatin',
    'rosuvastatin',
    'clopidogrel',
    'warfarin',
    'furosemide',
    'spironolactone',
    'digoxin',
  ],

  // Diabetes
  diabetes: [
    'metformin',
    'glimepiride',
    'glyburide',
    'glipizide',
    'sitagliptin',
    'insulin',
    'glargine',
    'lispro',
    'aspart',
    'empagliflozin',
    'dapagliflozin',
  ],

  // Respiratory
  respiratory: [
    'salbutamol',
    'albuterol',
    'terbutaline',
    'salmeterol',
    'formoterol',
    'montelukast',
    'budesonide',
    'fluticasone',
    'beclomethasone',
    'ipratropium',
    'tiotropium',
    'theophylline',
  ],

  // Gastrointestinal
  gastrointestinal: [
    'omeprazole',
    'pantoprazole',
    'esomeprazole',
    'lansoprazole',
    'ranitidine',
    'famotidine',
    'ondansetron',
    'metoclopramide',
    'domperidone',
    'loperamide',
    'bisacodyl',
    'lactulose',
  ],

  // Mental health
  psychiatric: [
    'sertraline',
    'fluoxetine',
    'escitalopram',
    'citalopram',
    'paroxetine',
    'venlafaxine',
    'duloxetine',
    'amitriptyline',
    'alprazolam',
    'diazepam',
    'lorazepam',
    'clonazepam',
    'zolpidem',
    'quetiapine',
    'risperidone',
  ],

  // Neurological
  neurological: [
    'gabapentin',
    'pregabalin',
    'carbamazepine',
    'valproic',
    'levetiracetam',
    'phenytoin',
    'lamotrigine',
    'topiramate',
  ],

  // Dermatological
  dermatological: [
    'isotretinoin',
    'tretinoin',
    'clindamycin',
    'benzoyl',
    'hydrocortisone',
    'betamethasone',
    'clobetasol',
    'ketoconazole',
    'terbinafine',
    'fluconazole',
  ],

  // Vitamins
  vitamins: [
    'vitamin',
    'folic',
    'iron',
    'calcium',
    'magnesium',
    'zinc',
    'omega',
    'multivitamin',
    'b12',
    'b6',
    'thiamine',
    'riboflavin',
  ],

  // Hormonal
  hormonal: [
    'levothyroxine',
    'estradiol',
    'progesterone',
    'testosterone',
    'prednisolone',
    'prednisone',
    'dexamethasone',
    'hydrocortisone',
  ],
};

function categorizeGenericName(genericName) {
  const name = genericName.toLowerCase();

  for (const [category, patterns] of Object.entries(drugPatterns)) {
    for (const pattern of patterns) {
      if (name.includes(pattern.toLowerCase())) {
        return category;
      }
    }
  }

  // Default categorization based on common drug suffixes/prefixes
  if (name.includes('statin')) return 'cardiovascular';
  if (name.includes('pril') || name.includes('sartan')) return 'cardiovascular';
  if (name.includes('olol')) return 'cardiovascular';
  if (name.includes('pine')) return 'cardiovascular';
  if (name.includes('zole')) return 'gastrointestinal';
  if (name.includes('pam') || name.includes('lam')) return 'psychiatric';
  if (name.includes('mycin') || name.includes('cillin')) return 'antibiotics';

  return 'analgesics'; // Default category
}

function getICD10Mapping(category) {
  return drugCategoryMappings[category] || drugCategoryMappings.analgesics;
}

function extractGenericName(packageName, genericName) {
  // Clean and extract the main active ingredient
  let cleaned = genericName || packageName;

  // Remove dosage information
  cleaned = cleaned.replace(/\d+(\.\d+)?\s*(mg|mcg|g|ml|%|iu|units?)\b/gi, '');

  // Remove common pharmaceutical terms
  cleaned = cleaned.replace(
    /\b(tablets?|capsules?|syrup|injection|cream|ointment|drops?|solution|suspension)\b/gi,
    ''
  );

  // Remove parentheses and their contents
  cleaned = cleaned.replace(/\([^)]*\)/g, '');

  // Remove extra spaces and trim
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  // Take the first active ingredient if multiple
  if (cleaned.includes(',')) {
    cleaned = cleaned.split(',')[0].trim();
  }

  return cleaned.toLowerCase();
}

async function processUAEDrugs() {
  try {
    console.log('Reading UAE drug list...');

    // Read the CSV file
    const csvPath = path.join(__dirname, '../../data/csv/UAE drug list.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');

    // Parse CSV (simple parsing for this use case)
    const lines = csvContent.split('\n');
    const headers = lines[0].split(',');

    // Find relevant column indices
    const packageNameIndex = headers.findIndex((h) => h.toLowerCase().includes('package name'));
    const genericNameIndex = headers.findIndex((h) => h.toLowerCase().includes('generic name'));

    console.log(`Found package name at index: ${packageNameIndex}`);
    console.log(`Found generic name at index: ${genericNameIndex}`);

    // Read existing mappings
    const existingMappingsPath = path.join(__dirname, '../../api/drug-service/drugMappings.js');
    const existingContent = fs.readFileSync(existingMappingsPath, 'utf-8');

    // Extract existing drug names
    const existingDrugs = new Set();
    const drugMatches = existingContent.match(/(\w+):\s*\[/g);
    if (drugMatches) {
      drugMatches.forEach((match) => {
        const drugName = match.replace(':', '').replace('[', '').trim();
        existingDrugs.add(drugName.toLowerCase());
      });
    }

    console.log(`Found ${existingDrugs.size} existing drugs in mappings`);

    // Process drugs from CSV
    const newDrugs = new Map();
    let processedCount = 0;

    for (let i = 1; i < lines.length && newDrugs.size < 500; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const columns = line.split(',');
      if (columns.length < Math.max(packageNameIndex, genericNameIndex) + 1) continue;

      const packageName = columns[packageNameIndex]?.replace(/"/g, '').trim();
      const genericName = columns[genericNameIndex]?.replace(/"/g, '').trim();

      if (!packageName && !genericName) continue;

      const extractedName = extractGenericName(packageName, genericName);
      if (!extractedName || extractedName.length < 3) continue;

      // Skip if already exists
      if (existingDrugs.has(extractedName)) continue;

      // Skip if already processed
      if (newDrugs.has(extractedName)) continue;

      // Categorize and get ICD-10 mapping
      const category = categorizeGenericName(extractedName);
      const icd10Mapping = getICD10Mapping(category);

      newDrugs.set(extractedName, {
        category,
        mapping: icd10Mapping,
        originalPackage: packageName,
        originalGeneric: genericName,
      });

      processedCount++;
      if (processedCount % 50 === 0) {
        console.log(`Processed ${processedCount} drugs, found ${newDrugs.size} new unique drugs`);
      }
    }

    console.log(`\nFound ${newDrugs.size} new drugs to add to mappings`);

    // Generate new mapping entries
    let newMappingEntries = '';
    for (const [drugName, drugInfo] of newDrugs) {
      const mappingArray = drugInfo.mapping
        .map((m) => `    { code: '${m.code}', description: '${m.description}' }`)
        .join(',\n');

      newMappingEntries += `  ${drugName}: [\n${mappingArray}\n  ],\n`;
    }

    // Read the existing file and add new entries
    let updatedContent = existingContent;

    // Find the position to insert new entries (before the closing brace)
    const lastBraceIndex = updatedContent.lastIndexOf('};');
    if (lastBraceIndex !== -1) {
      const beforeClosing = updatedContent.substring(0, lastBraceIndex);
      const afterClosing = updatedContent.substring(lastBraceIndex);

      updatedContent = beforeClosing + newMappingEntries + afterClosing;
    }

    // Write updated mappings
    const outputPath = path.join(__dirname, '../../api/drug-service/drugMappings-expanded.js');
    fs.writeFileSync(outputPath, updatedContent);

    // Also update the main ICD-10 data file
    const icd10DataPath = path.join(__dirname, '../../data/json/icd10-data-enhanced.json');
    let icd10Data = {};

    if (fs.existsSync(icd10DataPath)) {
      const existingIcd10Content = fs.readFileSync(icd10DataPath, 'utf-8');
      icd10Data = JSON.parse(existingIcd10Content);
    }

    // Add new drugs to ICD-10 data
    for (const [drugName, drugInfo] of newDrugs) {
      icd10Data[drugName] = drugInfo.mapping;
    }

    fs.writeFileSync(icd10DataPath, JSON.stringify(icd10Data, null, 2));

    // Generate summary report
    const summaryReport = {
      totalProcessed: processedCount,
      newDrugsAdded: newDrugs.size,
      categoriesUsed: {},
      sampleDrugs: {},
    };

    // Count categories and create samples
    for (const [drugName, drugInfo] of newDrugs) {
      const category = drugInfo.category;
      summaryReport.categoriesUsed[category] = (summaryReport.categoriesUsed[category] || 0) + 1;

      if (!summaryReport.sampleDrugs[category]) {
        summaryReport.sampleDrugs[category] = [];
      }

      if (summaryReport.sampleDrugs[category].length < 5) {
        summaryReport.sampleDrugs[category].push({
          name: drugName,
          originalPackage: drugInfo.originalPackage,
          icd10Codes: drugInfo.mapping.map((m) => m.code),
        });
      }
    }

    const reportPath = path.join(__dirname, '../../data/uae-drugs-mapping-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(summaryReport, null, 2));

    console.log('\n=== PROCESSING COMPLETE ===');
    console.log(`✅ Added ${newDrugs.size} new drugs to ICD-10 mappings`);
    console.log(`📁 Updated mappings saved to: ${outputPath}`);
    console.log(`📁 Enhanced ICD-10 data saved to: ${icd10DataPath}`);
    console.log(`📊 Summary report saved to: ${reportPath}`);

    console.log('\n=== CATEGORY BREAKDOWN ===');
    Object.entries(summaryReport.categoriesUsed)
      .sort(([, a], [, b]) => b - a)
      .forEach(([category, count]) => {
        console.log(`${category}: ${count} drugs`);
      });

    console.log('\n=== SAMPLE DRUGS BY CATEGORY ===');
    Object.entries(summaryReport.sampleDrugs).forEach(([category, drugs]) => {
      console.log(`\n${category.toUpperCase()}:`);
      drugs.forEach((drug) => {
        console.log(`  - ${drug.name} (${drug.icd10Codes.join(', ')})`);
      });
    });
  } catch (error) {
    console.error('Error processing UAE drugs:', error);
    process.exit(1);
  }
}

// Run the script
processUAEDrugs();
