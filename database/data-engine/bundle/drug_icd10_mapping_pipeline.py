"""
Full pipeline for drug-to-ICD-10 mapping using SNOMED CT and NLP (scispaCy)

Requirements:
- drug_mapping_extracted.csv (columns: drug, code, description, flag)
- snomed_mapping.csv (columns: drug, snomed_id, snomed_term)
- snomed_to_icd10.csv (columns: snomed_id, icd10_code)
- scispaCy: pip install scispacy en_core_sci_md

This script:
1. Loads drug mapping data
2. Looks up SNOMED CT concepts and crosswalks
3. Uses scispaCy to extract clinical concepts
4. Compares ICD-10 codes from all sources
5. Flags mismatches and generates a report
"""
import pandas as pd
import spacy
from collections import defaultdict

# Load data
DRUG_MAP_FILE = 'drug_mapping_extracted.csv'
SNOMED_MAP_FILE = 'snomed_mapping.csv'  # You must provide this
SNOMED_XWALK_FILE = 'snomed_to_icd10.csv'  # You must provide this
REPORT_FILE = 'drug_icd10_mapping_report.csv'

# Load drug mapping
drug_df = pd.read_csv(DRUG_MAP_FILE)

# Load SNOMED mapping and crosswalk
try:
    snomed_map = pd.read_csv(SNOMED_MAP_FILE)
    snomed_xwalk = pd.read_csv(SNOMED_XWALK_FILE)
except FileNotFoundError:
    print("SNOMED mapping or crosswalk file not found. Please provide them.")
    snomed_map = pd.DataFrame(columns=['drug', 'snomed_id', 'snomed_term'])
    snomed_xwalk = pd.DataFrame(columns=['snomed_id', 'icd10_code'])

# Build SNOMED lookup dicts
snomed_by_drug = snomed_map.groupby('drug').agg(list).to_dict('index')
icd10_by_snomed = snomed_xwalk.groupby('snomed_id')['icd10_code'].apply(list).to_dict()

# Load scispaCy model
try:
    nlp = spacy.load('en_core_sci_md')
except Exception as e:
    print("scispaCy model not found. Please install with: pip install scispacy en_core_sci_md")
    nlp = None

def nlp_icd10_suggestion(description):
    if not nlp:
        return []
    doc = nlp(str(description))
    # Extract entities (UMLS, etc.)
    codes = set()
    for ent in doc.ents:
        if hasattr(ent._, 'umls_ents'):
            for umls_ent in ent._.umls_ents:
                codes.add(umls_ent[0])
    return list(codes)

# Aggregate all mappings per drug
results = []
drugs = drug_df['drug'].unique()
for drug in drugs:
    subset = drug_df[drug_df['drug'] == drug]
    descriptions = subset['description'].unique()
    current_icd10 = set(subset['code'])
    # SNOMED
    snomed_info = snomed_by_drug.get(drug, {})
    snomed_ids = snomed_info.get('snomed_id', []) if snomed_info else []
    snomed_terms = snomed_info.get('snomed_term', []) if snomed_info else []
    snomed_icd10 = set()
    for sid in snomed_ids:
        snomed_icd10.update(icd10_by_snomed.get(sid, []))
    # NLP
    nlp_icd10 = set()
    for desc in descriptions:
        nlp_icd10.update(nlp_icd10_suggestion(desc))
    # Compare
    all_codes = current_icd10 | snomed_icd10 | nlp_icd10
    agree = current_icd10 == snomed_icd10 == nlp_icd10 and len(current_icd10) > 0
    flag = 'high_confidence' if agree else 'flag_for_review'
    results.append({
        'drug': drug,
        'current_icd10': ';'.join(current_icd10),
        'snomed_icd10': ';'.join(snomed_icd10),
        'nlp_icd10': ';'.join(nlp_icd10),
        'flag': flag,
        'description': '|'.join(descriptions),
        'snomed_ids': ';'.join(map(str, snomed_ids)),
        'snomed_terms': ';'.join(map(str, snomed_terms)),
    })

# Output report
report_df = pd.DataFrame(results)
report_df.to_csv(REPORT_FILE, index=False)
print(f"Report generated: {REPORT_FILE}")
