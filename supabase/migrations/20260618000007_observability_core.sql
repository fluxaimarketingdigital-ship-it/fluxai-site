-- 20260618000007_observability_core.sql

-- EXTENSION para UUID caso não exista
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. SYSTEM LOGS
CREATE TABLE system_logs (
    log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID,
    correlation_id UUID,
    transaction_id UUID,
    business_id VARCHAR(100),
    environment VARCHAR(50) NOT NULL DEFAULT 'staging' CHECK (environment IN ('staging', 'production', 'preview')),
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL')),
    event_type VARCHAR(100) NOT NULL,
    component VARCHAR(100),
    route_name VARCHAR(100),
    source_system VARCHAR(100),
    target_system VARCHAR(100),
    user_id UUID,
    client_id VARCHAR(100),
    transaction_status VARCHAR(50),
    error_code VARCHAR(100),
    message_safe VARCHAR(2000) NOT NULL,
    metadata_safe JSONB,
    duration_ms INTEGER,
    commit_hash VARCHAR(40),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. OPERATIONAL INCIDENTS
CREATE TABLE operational_incidents (
    incident_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_key VARCHAR(255) NOT NULL UNIQUE CHECK (length(incident_key) > 0),
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('SEV-1', 'SEV-2', 'SEV-3', 'SEV-4')),
    status VARCHAR(50) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'acknowledged', 'investigating', 'mitigated', 'resolved', 'closed')),
    title VARCHAR(255) NOT NULL,
    description_safe TEXT,
    first_detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() CHECK (last_detected_at >= first_detected_at),
    occurrence_count INTEGER DEFAULT 1 CHECK (occurrence_count >= 1),
    transaction_id UUID,
    correlation_id UUID,
    component VARCHAR(100),
    error_code VARCHAR(100),
    owner UUID,
    resolution TEXT,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. RECONCILIATION RUNS
CREATE TABLE reconciliation_runs (
    run_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scope VARCHAR(100) NOT NULL,
    source_system VARCHAR(100) NOT NULL,
    target_system VARCHAR(100) NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE CHECK (completed_at >= started_at),
    status VARCHAR(50) NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed', 'aborted')),
    expected_count INTEGER DEFAULT 0 CHECK (expected_count >= 0),
    actual_count INTEGER DEFAULT 0 CHECK (actual_count >= 0),
    matched_count INTEGER DEFAULT 0 CHECK (matched_count >= 0),
    missing_count INTEGER DEFAULT 0 CHECK (missing_count >= 0),
    divergent_count INTEGER DEFAULT 0 CHECK (divergent_count >= 0),
    error_count INTEGER DEFAULT 0 CHECK (error_count >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. RECONCILIATION ITEMS
CREATE TABLE reconciliation_items (
    item_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    run_id UUID REFERENCES reconciliation_runs(run_id) ON DELETE CASCADE,
    transaction_id UUID,
    business_id VARCHAR(100),
    source_reference VARCHAR(255),
    target_reference VARCHAR(255),
    reconciliation_status VARCHAR(50) NOT NULL CHECK (reconciliation_status IN ('matched', 'missing_source', 'missing_target', 'divergent', 'resolved')),
    difference_type VARCHAR(100),
    difference_safe JSONB,
    action_required VARCHAR(255),
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. RECOVERY ACTIONS
CREATE TABLE recovery_actions (
    recovery_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID,
    incident_id UUID REFERENCES operational_incidents(incident_id),
    action_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'authorized', 'running', 'completed', 'failed', 'rejected')),
    requested_by UUID,
    authorized_by UUID,
    attempt_count INTEGER DEFAULT 0 CHECK (attempt_count >= 0),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE CHECK (completed_at >= started_at),
    error_code VARCHAR(100),
    result_safe JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT chk_recovery_target CHECK (transaction_id IS NOT NULL OR incident_id IS NOT NULL)
);
