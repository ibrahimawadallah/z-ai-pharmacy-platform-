CREATE TABLE IF NOT EXISTS patients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    age INTEGER,
    gender TEXT,
    blood_type TEXT,
    medical_condition TEXT,
    admission_date TEXT,
    doctor TEXT,
    hospital TEXT,
    insurance_provider TEXT,
    billing_amount REAL,
    room_number INTEGER,
    admission_type TEXT,
    discharge_date TEXT,
    medication TEXT,
    test_results TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_patients_condition ON patients(medical_condition);
CREATE INDEX IF NOT EXISTS idx_patients_medication ON patients(medication);
