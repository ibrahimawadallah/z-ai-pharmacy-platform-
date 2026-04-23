-- Drug Database Schema
-- Create drugs table with comprehensive drug information

CREATE TABLE IF NOT EXISTS drugs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    drug_name TEXT NOT NULL, -- Package Name
    generic_name TEXT NOT NULL,
    drug_code TEXT UNIQUE, -- Added: Drug Code
    category TEXT, -- Derived or default
    strength TEXT,
    dosage_form TEXT,
    package_size TEXT, -- Added
    manufacturer TEXT, -- Manufacturer Name
    ndc TEXT, -- Can use Generic Code or empty
    price REAL, -- Package Price to Public (standard)
    unit_price REAL, -- Added: Unit Price to Public
    thiqa_price REAL, -- Added: Thiqa Max. Reimbursement Price
    thiqa_copay REAL, -- Added: Thiqa co-pay amount
    basic_copay REAL, -- Added: Basic co-pay amount
    insurance_plan TEXT, -- Added: Insurance Plan
    is_thiqa_covered BOOLEAN, -- Added
    is_basic_covered BOOLEAN, -- Added
    indications TEXT,
    contraindications TEXT,
    side_effects TEXT,
    interactions TEXT,
    pregnancy_category TEXT,
    breastfeeding_safe BOOLEAN,
    controlled_substance BOOLEAN,
    requires_prescription BOOLEAN,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create drug categories table for better organization
CREATE TABLE IF NOT EXISTS drug_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create manufacturers table
CREATE TABLE IF NOT EXISTS manufacturers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    country TEXT,
    website TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create drug interactions table
CREATE TABLE IF NOT EXISTS drug_interactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    drug_id INTEGER,
    interacting_drug_id INTEGER,
    interaction_type TEXT,
    severity TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (drug_id) REFERENCES drugs(id),
    FOREIGN KEY (interacting_drug_id) REFERENCES drugs(id)
);

-- Create drug side effects table
CREATE TABLE IF NOT EXISTS drug_side_effects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    drug_id INTEGER,
    side_effect TEXT,
    frequency TEXT,
    severity TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (drug_id) REFERENCES drugs(id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_drugs_name ON drugs(drug_name);
CREATE INDEX IF NOT EXISTS idx_drugs_generic ON drugs(generic_name);
CREATE INDEX IF NOT EXISTS idx_drugs_category ON drugs(category);
CREATE INDEX IF NOT EXISTS idx_drugs_ndc ON drugs(ndc);
CREATE INDEX IF NOT EXISTS idx_drugs_manufacturer ON drugs(manufacturer); 