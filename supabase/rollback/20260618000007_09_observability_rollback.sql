-- 20260618000007_09_observability_rollback.sql
-- ROLLBACK EXPLÍCITO SEM CASCADE (EXCETO CASCADE INTERNO DAS DEPENDÊNCIAS DAS TABELAS CRIADAS NESTE PRÓPRIO PACOTE)

DROP POLICY IF EXISTS "recovery_actions_delete" ON recovery_actions;
DROP POLICY IF EXISTS "recovery_actions_select" ON recovery_actions;
DROP POLICY IF EXISTS "recovery_actions_update" ON recovery_actions;
DROP POLICY IF EXISTS "recovery_actions_insert" ON recovery_actions;
DROP POLICY IF EXISTS "reconciliation_items_all" ON reconciliation_items;
DROP POLICY IF EXISTS "reconciliation_runs_all" ON reconciliation_runs;
DROP POLICY IF EXISTS "incidents_select" ON operational_incidents;
DROP POLICY IF EXISTS "incidents_delete" ON operational_incidents;
DROP POLICY IF EXISTS "incidents_update" ON operational_incidents;
DROP POLICY IF EXISTS "incidents_insert" ON operational_incidents;
DROP POLICY IF EXISTS "system_logs_deny_delete" ON system_logs;
DROP POLICY IF EXISTS "system_logs_deny_update" ON system_logs;
DROP POLICY IF EXISTS "system_logs_read_admin" ON system_logs;
DROP POLICY IF EXISTS "system_logs_insert_admin" ON system_logs;

DROP TRIGGER IF EXISTS trg_operational_incidents_updated_at ON operational_incidents;
DROP FUNCTION IF EXISTS update_incident_timestamp();
DROP FUNCTION IF EXISTS record_system_log(UUID, UUID, UUID, VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR, JSONB, VARCHAR, INTEGER);

DROP TABLE IF EXISTS recovery_actions;
DROP TABLE IF EXISTS reconciliation_items;
DROP TABLE IF EXISTS reconciliation_runs;
DROP TABLE IF EXISTS operational_incidents;
DROP TABLE IF EXISTS system_logs;
