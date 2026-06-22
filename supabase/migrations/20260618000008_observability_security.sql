-- 20260618000008_observability_security.sql

-- ENABLE RLS
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE operational_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE reconciliation_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE reconciliation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE recovery_actions ENABLE ROW LEVEL SECURITY;

-- 1. SYSTEM LOGS: Fail-closed (Append-only by authenticated role)
CREATE POLICY "system_logs_insert_admin"
ON system_logs FOR INSERT TO authenticated
WITH CHECK (false); -- Escrita bloqueada diretamente, exigindo RPC (record_system_log)

CREATE POLICY "system_logs_read_admin"
ON system_logs FOR SELECT TO authenticated
USING (auth.uid() IS NOT NULL); -- Apenas administradores do fluxo

-- Bloqueio explícito de UPDATE e DELETE
CREATE POLICY "system_logs_deny_update"
ON system_logs FOR UPDATE TO authenticated USING (false);

CREATE POLICY "system_logs_deny_delete"
ON system_logs FOR DELETE TO authenticated USING (false);

-- 2. OPERATIONAL INCIDENTS: Controle restrito
CREATE POLICY "incidents_insert"
ON operational_incidents FOR INSERT TO authenticated
WITH CHECK (false); -- Escrita via backend/RPC

CREATE POLICY "incidents_update"
ON operational_incidents FOR UPDATE TO authenticated
USING (auth.uid() IS NOT NULL);

CREATE POLICY "incidents_delete"
ON operational_incidents FOR DELETE TO authenticated USING (false);

CREATE POLICY "incidents_select"
ON operational_incidents FOR SELECT TO authenticated
USING (auth.uid() IS NOT NULL);

-- 3. RECONCILIATION RUNS / ITEMS (Fail-closed read/write only for admins)
CREATE POLICY "reconciliation_runs_all"
ON reconciliation_runs FOR ALL TO authenticated
USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "reconciliation_items_all"
ON reconciliation_items FOR ALL TO authenticated
USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

-- 4. RECOVERY ACTIONS
CREATE POLICY "recovery_actions_insert"
ON recovery_actions FOR INSERT TO authenticated
WITH CHECK (false); -- Escrita via backend/RPC

CREATE POLICY "recovery_actions_update"
ON recovery_actions FOR UPDATE TO authenticated
USING (auth.uid() IS NOT NULL);

CREATE POLICY "recovery_actions_select"
ON recovery_actions FOR SELECT TO authenticated
USING (auth.uid() IS NOT NULL);

CREATE POLICY "recovery_actions_delete"
ON recovery_actions FOR DELETE TO authenticated USING (false);

-- Revoke public access
REVOKE ALL ON system_logs FROM public, anon;
REVOKE ALL ON operational_incidents FROM public, anon;
REVOKE ALL ON reconciliation_runs FROM public, anon;
REVOKE ALL ON reconciliation_items FROM public, anon;
REVOKE ALL ON recovery_actions FROM public, anon;
