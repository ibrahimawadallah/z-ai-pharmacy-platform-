-- ML Operations Schema
-- Stores operational metrics, error logs, and model metadata for continuous learning

-- 1. Operational Metrics (Performance & User Behavior)
CREATE TABLE IF NOT EXISTS ml_operational_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    service_name TEXT NOT NULL,
    operation TEXT NOT NULL,
    duration_ms INTEGER,
    status_code INTEGER,
    user_id TEXT,
    session_id TEXT,
    metadata TEXT, -- JSON string
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Error Logs (System Reliability)
CREATE TABLE IF NOT EXISTS ml_error_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    service_name TEXT NOT NULL,
    error_message TEXT,
    stack_trace TEXT,
    severity TEXT CHECK(severity IN ('DEBUG', 'INFO', 'WARN', 'ERROR', 'CRITICAL')),
    context TEXT, -- JSON string
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Model Registry (Version Control & Performance)
CREATE TABLE IF NOT EXISTS ml_model_registry (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    model_name TEXT NOT NULL,
    version TEXT NOT NULL,
    model_type TEXT NOT NULL, -- 'anomaly_detection', 'predictive_maintenance', etc.
    parameters TEXT, -- JSON string (Hyperparameters)
    accuracy_score REAL,
    f1_score REAL,
    last_trained_at DATETIME,
    status TEXT DEFAULT 'active' CHECK(status IN ('active', 'retired', 'testing')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. A/B Testing Framework
CREATE TABLE IF NOT EXISTS ml_ab_tests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    test_name TEXT NOT NULL,
    model_a_id INTEGER,
    model_b_id INTEGER,
    metric_to_optimize TEXT NOT NULL,
    status TEXT DEFAULT 'running' CHECK(status IN ('running', 'completed', 'paused')),
    winner_model_id INTEGER,
    start_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    end_date DATETIME,
    FOREIGN KEY(model_a_id) REFERENCES ml_model_registry(id),
    FOREIGN KEY(model_b_id) REFERENCES ml_model_registry(id)
);

-- 5. Inference History (For feedback loop)
CREATE TABLE IF NOT EXISTS ml_inference_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    model_id INTEGER,
    input_data TEXT NOT NULL, -- JSON string
    prediction TEXT NOT NULL, -- JSON string
    confidence REAL,
    actual_outcome TEXT, -- Filled later for retraining
    is_correct BOOLEAN,
    latency_ms REAL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(model_id) REFERENCES ml_model_registry(id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_ml_metrics_service ON ml_operational_metrics(service_name, timestamp);
CREATE INDEX IF NOT EXISTS idx_ml_errors_service ON ml_error_logs(service_name, timestamp);
CREATE INDEX IF NOT EXISTS idx_ml_inference_model ON ml_inference_history(model_id, timestamp);
