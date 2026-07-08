-- MIGRATION: FASE 11 - MITIGAÇÃO MÍNIMA DE RLS E GOVERNANÇA (VERSÃO FINAL E IDEMPOTENTE)
-- Data: 2026-07-08
-- Protege as tabelas críticas contra IDOR e Privilege Escalation sem quebrar o front-end.

-- ===========================================================================
-- 1. FUNÇÕES AUXILIARES DE SEGURANÇA (SECURITY DEFINER)
-- ===========================================================================
-- Bypassam RLS para ler `governance_users` com segurança a partir do e-mail do token JWT da sessão.
-- Incluem SET search_path = public para segurança.

CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS text AS $$
DECLARE
  v_role text;
BEGIN
  SELECT role INTO v_role
  FROM public.governance_users
  WHERE email = (auth.jwt() ->> 'email')
  LIMIT 1;
  RETURN v_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.current_user_project_id()
RETURNS uuid AS $$
DECLARE
  v_project_id uuid;
BEGIN
  SELECT scoped_project_id INTO v_project_id
  FROM public.governance_users
  WHERE email = (auth.jwt() ->> 'email')
  LIMIT 1;
  RETURN v_project_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.is_admin_or_operator()
RETURNS boolean AS $$
DECLARE
  v_role text;
BEGIN
  SELECT role INTO v_role
  FROM public.governance_users
  WHERE email = (auth.jwt() ->> 'email')
  LIMIT 1;
  RETURN (v_role = 'ADMIN' OR v_role = 'OPERATOR');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;


-- ===========================================================================
-- 2. POLÍTICAS PARA GOVERNANCE_USERS
-- ===========================================================================
ALTER TABLE public.governance_users ENABLE ROW LEVEL SECURITY;

-- Remover policies permissivas antigas
DROP POLICY IF EXISTS "Allow authenticated on governance_users" ON public.governance_users;
DROP POLICY IF EXISTS "Allow All on governance_users" ON public.governance_users;

-- Remover policies novas para garantir idempotência
DROP POLICY IF EXISTS "Admin All governance_users" ON public.governance_users;
DROP POLICY IF EXISTS "Read Own governance_users" ON public.governance_users;

-- Admin tem acesso total
CREATE POLICY "Admin All governance_users" ON public.governance_users 
FOR ALL TO authenticated 
USING (public.current_user_role() = 'ADMIN') 
WITH CHECK (public.current_user_role() = 'ADMIN');

-- Operador ou Cliente só pode ler o próprio perfil
CREATE POLICY "Read Own governance_users" ON public.governance_users 
FOR SELECT TO authenticated 
USING (email = (auth.jwt() ->> 'email'));


-- ===========================================================================
-- 3. POLÍTICAS PARA AUDIT_LOGS E OPERATIONAL_EVENTS
-- ===========================================================================
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.operational_events ENABLE ROW LEVEL SECURITY;

-- Remover policies permissivas antigas
DROP POLICY IF EXISTS "Allow authenticated on audit_logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Allow All on audit_logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Allow authenticated on operational_events" ON public.operational_events;
DROP POLICY IF EXISTS "Allow All on operational_events" ON public.operational_events;

-- Remover policies novas para garantir idempotência
DROP POLICY IF EXISTS "Insert audit_logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Select audit_logs AdminOp" ON public.audit_logs;
DROP POLICY IF EXISTS "Insert operational_events" ON public.operational_events;
DROP POLICY IF EXISTS "Select events AdminOp" ON public.operational_events;
DROP POLICY IF EXISTS "Select events Client" ON public.operational_events;

-- INSERT livre para todo usuário autenticado (o front-end grava)
CREATE POLICY "Insert audit_logs" ON public.audit_logs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Insert operational_events" ON public.operational_events FOR INSERT TO authenticated WITH CHECK (true);

-- ADMIN/OPERATOR podem ler todos
CREATE POLICY "Select audit_logs AdminOp" ON public.audit_logs FOR SELECT TO authenticated USING (public.is_admin_or_operator());
CREATE POLICY "Select events AdminOp" ON public.operational_events FOR SELECT TO authenticated USING (public.is_admin_or_operator());

-- CLIENT só lê seus próprios eventos na timeline
CREATE POLICY "Select events Client" ON public.operational_events FOR SELECT TO authenticated USING (
    project_id = public.current_user_project_id() 
    AND NOT public.is_admin_or_operator()
);
-- Nota: UPDATE e DELETE não estão permitidos para ninguém, tornando os logs imutáveis.


-- ===========================================================================
-- 4. POLÍTICAS PARA PROJECTS
-- ===========================================================================
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Remover policies permissivas antigas
DROP POLICY IF EXISTS "Allow authenticated on projects" ON public.projects;
DROP POLICY IF EXISTS "Allow All on projects" ON public.projects;

-- Remover policies novas para garantir idempotência
DROP POLICY IF EXISTS "Select projects AdminOp" ON public.projects;
DROP POLICY IF EXISTS "Update projects AdminOp" ON public.projects;
DROP POLICY IF EXISTS "Insert projects AdminOp" ON public.projects;
DROP POLICY IF EXISTS "Select projects Client" ON public.projects;

-- ADMIN/OPERATOR acesso total de leitura e edição
CREATE POLICY "Select projects AdminOp" ON public.projects FOR SELECT TO authenticated USING (public.is_admin_or_operator());
CREATE POLICY "Update projects AdminOp" ON public.projects FOR UPDATE TO authenticated USING (public.is_admin_or_operator()) WITH CHECK (public.is_admin_or_operator());
CREATE POLICY "Insert projects AdminOp" ON public.projects FOR INSERT TO authenticated WITH CHECK (public.is_admin_or_operator());

-- CLIENT só lê o seu
CREATE POLICY "Select projects Client" ON public.projects FOR SELECT TO authenticated USING (id = public.current_user_project_id());


-- ===========================================================================
-- 5. POLÍTICAS PARA TABELAS OPERACIONAIS (PT-BR)
-- ===========================================================================
-- Garante que authenticated tem GRANT base, permitindo as RLS atuarem
GRANT SELECT, INSERT, UPDATE, DELETE ON public."PLANEJAMENTO_CONTEUDO" TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public."DEMANDAS_CLIENTES" TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public."CONTRATOS_CLIENTES" TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public."FINANCEIRO_CLIENTES" TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public."IA_CREDITOS_CLIENTE" TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public."SERVICOS_EXTRAS_CLIENTES" TO authenticated;

-- (A) PLANEJAMENTO_CONTEUDO
ALTER TABLE public."PLANEJAMENTO_CONTEUDO" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow authenticated on PLANEJAMENTO_CONTEUDO" ON public."PLANEJAMENTO_CONTEUDO";
DROP POLICY IF EXISTS "Allow All on PLANEJAMENTO_CONTEUDO" ON public."PLANEJAMENTO_CONTEUDO";
DROP POLICY IF EXISTS "AdminOp PLANEJAMENTO" ON public."PLANEJAMENTO_CONTEUDO";
DROP POLICY IF EXISTS "Client Select PLANEJAMENTO" ON public."PLANEJAMENTO_CONTEUDO";

CREATE POLICY "AdminOp PLANEJAMENTO" ON public."PLANEJAMENTO_CONTEUDO" FOR ALL TO authenticated USING (public.is_admin_or_operator()) WITH CHECK (public.is_admin_or_operator());
CREATE POLICY "Client Select PLANEJAMENTO" ON public."PLANEJAMENTO_CONTEUDO" FOR SELECT TO authenticated USING (client_id = public.current_user_project_id()::text);


-- (B) DEMANDAS_CLIENTES
ALTER TABLE public."DEMANDAS_CLIENTES" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow authenticated on DEMANDAS_CLIENTES" ON public."DEMANDAS_CLIENTES";
DROP POLICY IF EXISTS "Allow All on DEMANDAS_CLIENTES" ON public."DEMANDAS_CLIENTES";
DROP POLICY IF EXISTS "AdminOp DEMANDAS" ON public."DEMANDAS_CLIENTES";
DROP POLICY IF EXISTS "Client Select DEMANDAS" ON public."DEMANDAS_CLIENTES";

CREATE POLICY "AdminOp DEMANDAS" ON public."DEMANDAS_CLIENTES" FOR ALL TO authenticated USING (public.is_admin_or_operator()) WITH CHECK (public.is_admin_or_operator());
CREATE POLICY "Client Select DEMANDAS" ON public."DEMANDAS_CLIENTES" FOR SELECT TO authenticated USING (client_id = public.current_user_project_id()::text);


-- (C) CONTRATOS_CLIENTES
ALTER TABLE public."CONTRATOS_CLIENTES" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow authenticated on CONTRATOS_CLIENTES" ON public."CONTRATOS_CLIENTES";
DROP POLICY IF EXISTS "Allow All on CONTRATOS_CLIENTES" ON public."CONTRATOS_CLIENTES";
DROP POLICY IF EXISTS "AdminOp CONTRATOS" ON public."CONTRATOS_CLIENTES";
DROP POLICY IF EXISTS "Client Select CONTRATOS" ON public."CONTRATOS_CLIENTES";

CREATE POLICY "AdminOp CONTRATOS" ON public."CONTRATOS_CLIENTES" FOR ALL TO authenticated USING (public.is_admin_or_operator()) WITH CHECK (public.is_admin_or_operator());
CREATE POLICY "Client Select CONTRATOS" ON public."CONTRATOS_CLIENTES" FOR SELECT TO authenticated USING (client_id = public.current_user_project_id()::text);


-- (D) FINANCEIRO_CLIENTES
ALTER TABLE public."FINANCEIRO_CLIENTES" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow authenticated on FINANCEIRO_CLIENTES" ON public."FINANCEIRO_CLIENTES";
DROP POLICY IF EXISTS "Allow All on FINANCEIRO_CLIENTES" ON public."FINANCEIRO_CLIENTES";
DROP POLICY IF EXISTS "AdminOp FINANCEIRO" ON public."FINANCEIRO_CLIENTES";
DROP POLICY IF EXISTS "Client Select FINANCEIRO" ON public."FINANCEIRO_CLIENTES";

CREATE POLICY "AdminOp FINANCEIRO" ON public."FINANCEIRO_CLIENTES" FOR ALL TO authenticated USING (public.is_admin_or_operator()) WITH CHECK (public.is_admin_or_operator());
CREATE POLICY "Client Select FINANCEIRO" ON public."FINANCEIRO_CLIENTES" FOR SELECT TO authenticated USING (client_id = public.current_user_project_id()::text);


-- (E) IA_CREDITOS_CLIENTE
ALTER TABLE public."IA_CREDITOS_CLIENTE" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow authenticated on IA_CREDITOS_CLIENTE" ON public."IA_CREDITOS_CLIENTE";
DROP POLICY IF EXISTS "Allow All on IA_CREDITOS_CLIENTE" ON public."IA_CREDITOS_CLIENTE";
DROP POLICY IF EXISTS "AdminOp CREDITOS" ON public."IA_CREDITOS_CLIENTE";
DROP POLICY IF EXISTS "Client Select CREDITOS" ON public."IA_CREDITOS_CLIENTE";

CREATE POLICY "AdminOp CREDITOS" ON public."IA_CREDITOS_CLIENTE" FOR ALL TO authenticated USING (public.is_admin_or_operator()) WITH CHECK (public.is_admin_or_operator());
CREATE POLICY "Client Select CREDITOS" ON public."IA_CREDITOS_CLIENTE" FOR SELECT TO authenticated USING (client_id = public.current_user_project_id()::text);


-- (F) SERVICOS_EXTRAS_CLIENTES
ALTER TABLE public."SERVICOS_EXTRAS_CLIENTES" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow authenticated on SERVICOS_EXTRAS_CLIENTES" ON public."SERVICOS_EXTRAS_CLIENTES";
DROP POLICY IF EXISTS "Allow All on SERVICOS_EXTRAS_CLIENTES" ON public."SERVICOS_EXTRAS_CLIENTES";
DROP POLICY IF EXISTS "AdminOp EXTRAS" ON public."SERVICOS_EXTRAS_CLIENTES";
DROP POLICY IF EXISTS "Client Select EXTRAS" ON public."SERVICOS_EXTRAS_CLIENTES";

CREATE POLICY "AdminOp EXTRAS" ON public."SERVICOS_EXTRAS_CLIENTES" FOR ALL TO authenticated USING (public.is_admin_or_operator()) WITH CHECK (public.is_admin_or_operator());
CREATE POLICY "Client Select EXTRAS" ON public."SERVICOS_EXTRAS_CLIENTES" FOR SELECT TO authenticated USING (client_id = public.current_user_project_id()::text);
