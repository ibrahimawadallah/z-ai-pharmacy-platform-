import sqlite3
import json
import re
from pathlib import Path
from datetime import datetime

DATABASE_PATH = Path("database/drug_icd10.db")
SCHEMA_PATH = Path("database/icd10_schema.sql")
MAPPINGS_PATH = Path("data/unified/drug-icd10-map.json")


def create_database():
    """Create database from schema."""
    print("Creating database...")
    DATABASE_PATH.parent.mkdir(parents=True, exist_ok=True)

    if DATABASE_PATH.exists():
        DATABASE_PATH.unlink()
        print("Removed existing database")

    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()

    with open(SCHEMA_PATH, 'r', encoding='utf-8') as f:
        schema = f.read()

    schema = schema.replace(
        "subcategory_id INTEGER NOT NULL",
        "subcategory_id INTEGER"
    )

    cursor.executescript(schema)
    conn.commit()
    print(f"✅ Database created: {DATABASE_PATH}")
    return conn


def normalize_drug_name(name):
    """Normalize drug name for database storage."""
    name = name.lower().strip()
    name = re.sub(r'[^a-z0-9\s-]', '', name)
    name = re.sub(r'\s+', '_', name)
    return name


def extract_generic_name(drug_name):
    """Extract generic name from full drug name."""
    patterns = [
        r'^([a-zA-Z]+)',  # First word
        r'\[([^\]]+)\]',  # Bracketed name
        r'([a-zA-Z]+)\s+MG',  # Before MG
    ]

    for pattern in patterns:
        match = re.search(pattern, drug_name, re.IGNORECASE)
        if match:
            return match.group(1).lower()

    return drug_name.split()[0].lower() if drug_name else None


def determine_drug_class(drug_name):
    """Determine drug class from drug name."""
    drug_name_lower = drug_name.lower()

    if any(x in drug_name_lower for x in ['statin', 'vastatin']):
        return 'Statin'
    if any(x in drug_name_lower for x in ['pril', 'lisinopril', 'ramipril', 'enalapril']):
        return 'ACE Inhibitor'
    if any(x in drug_name_lower for x in ['sartan', 'losartan', 'valsartan']):
        return 'ARB'
    if any(x in drug_name_lower for x in ['pril', 'amlodipine', 'norvasc']):
        return 'Calcium Channel Blocker'
    if any(x in drug_name_lower for x in ['metformin', 'gliptin', 'janumet']):
        return 'Antidiabetic'
    if any(x in drug_name_lower for x in ['omeprazole', 'pantoprazole', 'lansoprazole']):
        return 'PPI'
    if any(x in drug_name_lower for x in ['aspirin', 'salicyl']):
        return 'NSAID'
    if any(x in drug_name_lower for x in ['ibuprofen', 'motrin', 'advil']):
        return 'NSAID'
    if any(x in drug_name_lower for x in ['amoxicillin', 'penicillin', 'antibiotic']):
        return 'Antibiotic'
    if any(x in drug_name_lower for x in ['paracetamol', 'acetaminophen', 'tylenol']):
        return 'Analgesic'

    return 'Other'


def import_mappings(conn):
    """Import drug-ICD10 mappings into database."""
    print("Importing drug-ICD10 mappings...")

    with open(MAPPINGS_PATH, 'r', encoding='utf-8') as f:
        mappings = json.load(f)

    cursor = conn.cursor()
    drugs_added = 0
    codes_added = 0
    mappings_added = 0

    for drug_name, icd_codes in mappings.items():
        normalized_name = normalize_drug_name(drug_name)
        generic_name = extract_generic_name(drug_name)
        drug_class = determine_drug_class(drug_name)

        cursor.execute(
            "INSERT OR IGNORE INTO drugs (name, generic_name, drug_class) VALUES (?, ?, ?)",
            (drug_name, generic_name, drug_class)
        )
        if cursor.rowcount > 0:
            drugs_added += 1

        cursor.execute("SELECT id FROM drugs WHERE name = ?", (drug_name,))
        drug_id = cursor.fetchone()[0]

        for icd_code in icd_codes:
            code = icd_code.get('code')
            description = icd_code.get('description')

            if not code:
                continue

            cursor.execute(
                "INSERT OR IGNORE INTO codes (code, short_description, long_description) VALUES (?, ?, ?)",
                (code, description, description)
            )
            if cursor.rowcount > 0:
                codes_added += 1

            cursor.execute("SELECT id FROM codes WHERE code = ?", (code,))
            result = cursor.fetchone()
            if not result:
                continue
            code_id = result[0]

            cursor.execute(
                "INSERT OR IGNORE INTO drug_codes (drug_id, code_id, is_primary_code) VALUES (?, ?, ?)",
                (drug_id, code_id, 0)
            )
            if cursor.rowcount > 0:
                mappings_added += 1

        if drugs_added % 50 == 0:
            print(f"  Progress: {drugs_added} drugs, {codes_added} codes...")

    conn.commit()
    print(f"\n✅ Imported {drugs_added} drugs, {codes_added} codes, {mappings_added} mappings")
    return drugs_added, codes_added, mappings_added


def create_chapters_from_codes(conn):
    """Extract chapters from codes and create chapter structure."""
    print("Creating chapter structure...")

    cursor = conn.cursor()

    cursor.execute("""
        INSERT OR IGNORE INTO chapters (code, title)
        VALUES ('I', 'Infectious Diseases'),
               ('II', 'Neoplasms'),
               ('III', 'Blood Disorders'),
               ('IV', 'Endocrine Disorders'),
               ('V', 'Mental Disorders'),
               ('VI', 'Nervous System'),
               ('VII', 'Eye Disorders'),
               ('VIII', 'Ear Disorders'),
               ('IX', 'Circulatory System'),
               ('X', 'Respiratory System'),
               ('XI', 'Digestive System'),
               ('XII', 'Skin Disorders'),
               ('XIII', 'Musculoskeletal'),
               ('XIV', 'Genitourinary'),
               ('XV', 'Pregnancy'),
               ('XVI', 'Perinatal'),
               ('XVII', 'Congenital'),
               ('XVIII', 'Symptoms'),
               ('XIX', 'Injury'),
               ('XX', 'External Causes'),
               ('XXI', 'Health Status'),
               ('XXII', 'Procedures')
    """)

    conn.commit()
    print("✅ Created 22 chapters")


def add_search_indexes(conn):
    """Add full-text search indexes."""
    print("Adding search indexes...")

    cursor = conn.cursor()

    cursor.execute("""
        CREATE INDEX IF NOT EXISTS idx_drugs_generic ON drugs(generic_name)
    """)

    cursor.execute("""
        CREATE INDEX IF NOT EXISTS idx_codes_short_desc ON codes(short_description)
    """)

    conn.commit()
    print("✅ Created additional indexes")


def verify_database(conn):
    """Verify database contents."""
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM drugs")
    drug_count = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM codes")
    code_count = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM drug_codes")
    mapping_count = cursor.fetchone()[0]

    print(f"\n📊 Database Verification:")
    print(f"   Drugs: {drug_count}")
    print(f"   ICD-10 Codes: {code_count}")
    print(f"   Drug-Code Mappings: {mapping_count}")

    cursor.execute("""
        SELECT d.name, c.code, c.short_description
        FROM drugs d
        JOIN drug_codes dc ON d.id = dc.drug_id
        JOIN codes c ON dc.code_id = c.id
        LIMIT 5
    """)
    print("\n📋 Sample data:")
    for row in cursor.fetchall():
        print(f"   {row[0]} → {row[1]} ({row[2]})")

    return drug_count, code_count, mapping_count


def main():
    print("=" * 60)
    print("🏥 Drug-ICD10 Database Builder")
    print("=" * 60)

    conn = create_database()
    create_chapters_from_codes(conn)
    drugs, codes, mappings = import_mappings(conn)
    add_search_indexes(conn)
    verify_database(conn)

    conn.close()

    print("\n" + "=" * 60)
    print("✅ Database build complete!")
    print(f"📁 Location: {DATABASE_PATH}")
    print("=" * 60)


if __name__ == '__main__':
    main()