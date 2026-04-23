
CREATE TABLE IF NOT EXISTS lab_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER,
    test_type TEXT NOT NULL, -- e.g., 'Hemoglobin', 'Blood Glucose', 'Cholesterol'
    value REAL NOT NULL,
    unit TEXT NOT NULL, -- e.g., 'g/dL', 'mg/dL'
    reference_range TEXT, -- e.g., '13.5-17.5'
    flag TEXT, -- 'Normal', 'High', 'Low', 'Critical'
    test_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    FOREIGN KEY(patient_id) REFERENCES patients(id)
);

CREATE INDEX IF NOT EXISTS idx_lab_patient ON lab_results(patient_id);
CREATE INDEX IF NOT EXISTS idx_lab_type ON lab_results(test_type);

CREATE TABLE IF NOT EXISTS imaging_studies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER,
    modality TEXT NOT NULL, -- 'X-Ray', 'CT', 'MRI', 'Ultrasound'
    body_part TEXT NOT NULL, -- 'Chest', 'Brain', 'Abdomen'
    image_url TEXT,
    findings TEXT, -- The raw findings/description
    impression TEXT, -- The doctor's conclusion
    ai_prediction TEXT, -- For storing ML model output
    ai_confidence REAL,
    study_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(patient_id) REFERENCES patients(id)
);

CREATE INDEX IF NOT EXISTS idx_imaging_patient ON imaging_studies(patient_id);

CREATE TABLE IF NOT EXISTS clinical_reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER,
    report_type TEXT DEFAULT 'OIC_EXTRACTED', -- 'OIC_EXTRACTED', 'DISCHARGE', 'REFERRAL'
    source_text TEXT,
    structured_data TEXT, -- JSON string of OICReportResponse
    severity TEXT,
    urgency TEXT,
    icd10_codes TEXT, -- Comma separated or JSON
    report_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(patient_id) REFERENCES patients(id)
);

CREATE INDEX IF NOT EXISTS idx_reports_patient ON clinical_reports(patient_id);
