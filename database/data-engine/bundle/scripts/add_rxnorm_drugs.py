import sqlite3
import json
import re
from pathlib import Path

DATABASE_PATH = Path("database/drug_icd10.db")
RXNORMS_PATH = Path("data/dailymed_drugs.json")


def normalize_drug_name(name):
    """Normalize drug name for matching."""
    name = name.lower().strip()
    name = re.sub(r'[^a-z0-9\s-]', '', name)
    name = name.replace('[', ' ').replace(']', ' ')
    name = re.sub(r'\s+', ' ', name).strip()
    return name


def extract_ingredient(name):
    """Extract primary ingredient from drug name."""
    name = normalize_drug_name(name)
    parts = name.split()
    if parts:
        return parts[0]
    return name


def determine_drug_class(name):
    """Determine drug class from name."""
    name_lower = name.lower()

    classes = [
        ('statin|atorvastatin|simvastatin|rosuvastatin|pravastatin', 'Statin'),
        ('lisinopril|enalapril|ramipril|captopril|perindopril', 'ACE Inhibitor'),
        ('losartan|valsartan|olmesartan|telmisartan|candesartan', 'ARB'),
        ('amlodipine|norvasc|diltiazem|verapamil|nifedipine', 'Calcium Channel Blocker'),
        ('metformin|glipizide|glibenclamide|glyburide|diabetes', 'Antidiabetic'),
        ('omeprazole|pantoprazole|lansoprazole|esomeprazole|ppi', 'PPI'),
        ('amoxicillin|penicillin|antibiotic|ciprofloxacin|azithromycin', 'Antibiotic'),
        ('aspirin|ibuprofen|naproxen|diclofenac|nsaid', 'NSAID'),
        ('paracetamol|acetaminophen|tylenol', 'Analgesic'),
        ('atorvastatin|lipitor', 'Statin'),
        ('amlodipine', 'Calcium Channel Blocker'),
    ]

    for pattern, drug_class in classes:
        if re.search(pattern, name_lower):
            return drug_class

    return 'Other'


def get_existing_mappings(conn):
    """Get existing drug-ICD10 mappings from database."""
    cursor = conn.cursor()
    cursor.execute("SELECT name, code, short_description FROM drugs d JOIN drug_codes dc ON d.id = dc.drug_id JOIN codes c ON dc.code_id = c.id")
    existing = {}
    for drug_name, code, desc in cursor.fetchall():
        drug_key = normalize_drug_name(drug_name)
        if drug_key not in existing:
            existing[drug_key] = []
        existing[drug_key].append({'code': code, 'description': desc})
    return existing


def add_rxnorm_drugs(conn):
    """Add RxNorm drugs to database with ICD-10 mappings."""
    print("Loading RxNorm data...")
    with open(RXNORMS_PATH, 'r', encoding='utf-8') as f:
        rxnorm_drugs = json.load(f)

    print(f"Processing {len(rxnorm_drugs)} RxNorm drugs...")

    cursor = conn.cursor()
    existing_mappings = get_existing_mappings(conn)

    drugs_added = 0
    mappings_added = 0
    skipped = 0

    for drug in rxnorm_drugs:
        name = drug.get('name', '')
        rxcui = drug.get('rxcui', '')
        if not name:
            continue

        normalized = normalize_drug_name(name)
        ingredient = extract_ingredient(name)
        drug_class = determine_drug_class(name)

        cursor.execute(
            "INSERT OR IGNORE INTO drugs (name, generic_name, drug_class) VALUES (?, ?, ?)",
            (name, ingredient, drug_class)
        )

        if cursor.rowcount == 0:
            skipped += 1
            continue

        drugs_added += 1

        cursor.execute("SELECT id FROM drugs WHERE name = ?", (name,))
        result = cursor.fetchone()
        if not result:
            continue
        drug_id = result[0]

        mapping_to_use = None

        if normalized in existing_mappings:
            mapping_to_use = existing_mappings[normalized]
        elif ingredient in existing_mappings:
            mapping_to_use = existing_mappings[ingredient]

        if mapping_to_use:
            for icd in mapping_to_use:
                cursor.execute(
                    "INSERT OR IGNORE INTO drug_codes (drug_id, code_id, is_primary_code) VALUES (?, ?, ?)",
                    (drug_id, 0, 0)
                )
                cursor.execute("SELECT id FROM codes WHERE code = ?", (icd['code'],))
                result = cursor.fetchone()
                if result:
                    code_id = result[0]
                    cursor.execute(
                        "INSERT OR IGNORE INTO drug_codes (drug_id, code_id, is_primary_code) VALUES (?, ?, ?)",
                        (drug_id, code_id, 0)
                    )
                    if cursor.rowcount > 0:
                        mappings_added += 1

        if drugs_added % 100 == 0:
            print(f"  Progress: {drugs_added} drugs added...")

    conn.commit()
    print(f"\n✅ Added {drugs_added} drugs, {mappings_added} new mappings, {skipped} skipped")


def verify_new_data(conn):
    """Verify new data in database."""
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM drugs")
    drug_count = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM drug_codes")
    mapping_count = cursor.fetchone()[0]

    print(f"\n📊 Updated Database:")
    print(f"   Total drugs: {drug_count}")
    print(f"   Total mappings: {mapping_count}")

    cursor.execute("SELECT name, drug_class FROM drugs WHERE id > 302 LIMIT 10")
    print("\n📋 New drugs added:")
    for row in cursor.fetchall():
        print(f"   {row[0]} ({row[1]})")


def main():
    print("=" * 60)
    print("📦 Adding RxNorm Drugs to Database")
    print("=" * 60)

    conn = sqlite3.connect(DATABASE_PATH)
    add_rxnorm_drugs(conn)
    verify_new_data(conn)
    conn.close()

    print("\n✅ Complete!")


if __name__ == '__main__':
    main()