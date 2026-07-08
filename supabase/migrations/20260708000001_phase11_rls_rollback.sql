-- ROLLBACK MIGRATION: FASE 11 - MITIGAÇÃO MÍNIMA DE RLS E GOVERNANÇA
-- Executar isto irá reverter as políticas de segurança rigorosas, restaurando o estado original (vulnerável).

-- 1. DROP FUNÇÕES
DROP FUNCTION IF EXISTS public.current_user_role();
DROP FUNCTION IF EXISTS public.current_user_project_id();
DROP FUNCTION IF EXISTS public.is_admin_or_operator();

-- 2. RESTAURAR GOVERNANCE_USERS
DROP POLICY IF EXISTS "Admin All governance_users" ON public.governance_users;
DROP POLICY IF EXISTS "Read Own governance_users" ON public.governance_users;
CREATE POLICY "Allow authenticated on governance_users" ON public.governance_users FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 3. RESTAURAR AUDIT_LOGS E OPERATIONAL_EVENTS
DROP POLICY IF EXISTS "Insert audit_logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Select audit_logs AdminOp" ON public.audit_logs;
CREATE POLICY "Allow authenticated on audit_logs" ON public.audit_logs FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Insert operational_events" ON public.operational_events;
DROP POLICY IF EXISTS "Select events AdminOp" ON public.operational_events;
DROP POLICY IF EXISTS "Select events Client" ON public.operational_events;
CREATE POLICY "Allow authenticated on operational_events" ON public.operational_events FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 4. RESTAURAR PROJECTS
DROP POLICY IF EXISTS "Select projects AdminOp" ON public.projects;
DROP POLICY IF EXISTS "Update projects AdminOp" ON public.projects;
DROP POLICY IF EXISTS "Insert projects AdminOp" ON public.projects;
DROP POLICY IF EXISTS "Select projects Client" ON public.projects;
CREATE POLICY "Allow authenticated on projects" ON public.projects FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 5. RESTAURAR TABELAS OPERACIONAIS
-- PLANEJAMENTO_CONTEUDO
DROP POLICY IF EXISTS "AdminOp PLANEJAMENTO" ON public."PLANEJAMENTO_CONTEUDO";
DROP POLICY IF EXISTS "Client Select PLANEJAMENTO" ON public."PLANEJAMENTO_CONTEUDO";

-- DEMANDAS_CLIENTES
DROP POLICY IF EXISTS "AdminOp DEMANDAS" ON public."DEMANDAS_CLIENTES";
DROP POLICY IF EXISTS "Client Select DEMANDAS" ON public."DEMANDAS_CLIENTES";

-- CONTRATOS_CLIENTES
DROP POLICY IF EXISTS "AdminOp CONTRATOS" ON public."CONTRATOS_CLIENTES";
DROP POLICY IF EXISTS "Client Select CONTRATOS" ON public."CONTRATOS_CLIENTES";

-- FINANCEIRO_CLIENTES
DROP POLICY IF EXISTS "AdminOp FINANCEIRO" ON public."FINANCEIRO_CLIENTES";
DROP POLICY IF EXISTS "Client Select FINANCEIRO" ON public."FINANCEIRO_CLIENTES";

-- IA_CREDITOS_CLIENTE
DROP POLICY IF EXISTS "AdminOp CREDITOS" ON public."IA_CREDITOS_CLIENTE";
DROP POLICY IF EXISTS "Client Select CREDITOS" ON public."IA_CREDITOS_CLIENTE";

-- SERVICOS_EXTRAS_CLIENTES
DROP POLICY IF EXISTS "AdminOp EXTRAS" ON public."SERVICOS_EXTRAS_CLIENTES";
DROP POLICY IF EXISTS "Client Select EXTRAS" ON public."SERVICOS_EXTRAS_CLIENTES";

-- Remove GRANT base (volta ao estado do script de 20260606)
REVOKE ALL ON public."PLANEJAMENTO_CONTEUDO" FROM authenticated;
REVOKE ALL ON public."DEMANDAS_CLIENTES" FROM authenticated;
REVOKE ALL ON public."CONTRATOS_CLIENTES" FROM authenticated;
REVOKE ALL ON public."FINANCEIRO_CLIENTES" FROM authenticated;
REVOKE ALL ON public."IA_CREDITOS_CLIENTE" FROM authenticated;
REVOKE ALL ON public."SERVICOS_EXTRAS_CLIENTES" FROM authenticated;
