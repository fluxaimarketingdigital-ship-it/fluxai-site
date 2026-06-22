-- 20260618000009_reconciliation_recovery.sql

-- Função genérica e segura (com search_path) para atualizar o updated_at
CREATE OR REPLACE FUNCTION update_incident_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Trigger para incidents
CREATE TRIGGER trg_operational_incidents_updated_at
BEFORE UPDATE ON operational_incidents
FOR EACH ROW EXECUTE FUNCTION update_incident_timestamp();

-- Constraints de segurança (proteção do IDEMPOTENCY ou CHAVES ÚNICAS adicionais)
ALTER TABLE operational_incidents
ADD CONSTRAINT chk_incident_severity_valid CHECK (severity IN ('SEV-1', 'SEV-2', 'SEV-3', 'SEV-4'));

ALTER TABLE system_logs
ADD CONSTRAINT chk_system_logs_severity_valid CHECK (severity IN ('DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL'));

-- ÍNDICES para ganho de performance na auditoria
CREATE INDEX idx_system_logs_transaction_id ON system_logs(transaction_id);
CREATE INDEX idx_system_logs_severity ON system_logs(severity);
CREATE INDEX idx_system_logs_created_at ON system_logs(created_at);

CREATE INDEX idx_incidents_transaction_id ON operational_incidents(transaction_id);
CREATE INDEX idx_incidents_status ON operational_incidents(status);

CREATE INDEX idx_recovery_transaction_id ON recovery_actions(transaction_id);
CREATE INDEX idx_recovery_status ON recovery_actions(status);

-- RPC Segura para inserção controlada de logs (Bypass RLS para escrita de logs sanitizados)
CREATE OR REPLACE FUNCTION record_system_log(
    p_request_id UUID,
    p_correlation_id UUID,
    p_transaction_id UUID,
    p_business_id VARCHAR,
    p_severity VARCHAR,
    p_event_type VARCHAR,
    p_component VARCHAR,
    p_route_name VARCHAR,
    p_source_system VARCHAR,
    p_target_system VARCHAR,
    p_message_safe VARCHAR,
    p_metadata_safe JSONB DEFAULT NULL,
    p_error_code VARCHAR DEFAULT NULL,
    p_duration_ms INTEGER DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_log_id UUID;
BEGIN
    -- Validar a severidade e comprimento da mensagem
    IF p_severity NOT IN ('DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL') THEN
        RAISE EXCEPTION 'Invalid severity level';
    END IF;

    IF length(p_message_safe) > 2000 THEN
        RAISE EXCEPTION 'Message too long';
    END IF;

    INSERT INTO system_logs (
        request_id, correlation_id, transaction_id, business_id,
        severity, event_type, component, route_name,
        source_system, target_system, user_id, client_id,
        message_safe, metadata_safe, error_code, duration_ms
    ) VALUES (
        p_request_id, p_correlation_id, p_transaction_id, p_business_id,
        p_severity, p_event_type, p_component, p_route_name,
        p_source_system, p_target_system, auth.uid(), current_setting('request.jwt.claims', true)::json->>'client_id',
        p_message_safe, p_metadata_safe, p_error_code, p_duration_ms
    ) RETURNING log_id INTO v_log_id;

    RETURN v_log_id;
END;
$$;
