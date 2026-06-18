-- Implementação de Policies RBAC
-- STG-06 Gate 6

-- Proteção da Tabela profiles (Governança)
DROP POLICY IF EXISTS "Strict access to profiles" ON public.profiles;

CREATE POLICY "Users can read own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles" ON public.profiles
    FOR SELECT USING (public.current_user_role(auth.uid()) = 'ADMIN');

-- Nenhum UPDATE em profiles permitido pelo frontend, exceto por Admin
CREATE POLICY "Admins can update profiles" ON public.profiles
    FOR UPDATE USING (public.current_user_role(auth.uid()) = 'ADMIN');

-- Proteção da Tabela crm_leads
CREATE POLICY "Leads readable by Admins" ON public.crm_leads
    FOR SELECT USING (public.current_user_role(auth.uid()) = 'ADMIN');

-- Bloqueio genérico (Default Deny permanece para outros)

-- --------------------------------------------------------
-- HARDENING DAS TABELAS OPERACIONAIS (GATE 4D)
-- --------------------------------------------------------

-- 1. GRANTS MÍNIMOS (Necessários pois houve REVOKE ALL na 0606)
GRANT SELECT, INSERT, UPDATE, DELETE ON public."CONTRATOS_CLIENTES" TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public."DNA_CLIENTE_GPT" TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public."IA_CREDITOS_CLIENTE" TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public."CLIENTES_ESTRATEGIA" TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public."SERVICOS_EXTRAS_CLIENTES" TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public."FINANCEIRO_CLIENTES" TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public."DEMANDAS_CLIENTES" TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public."COMUNICACOES_CLIENTE" TO authenticated;

-- 2. POLÍTICAS ESTRITAS: Acesso exclusivo para ADMIN ativo
-- (Demais papéis bloqueados até que o contrato JWT de client_id seja formalizado)

CREATE POLICY "admin_all_contratos" ON public."CONTRATOS_CLIENTES"
    FOR ALL TO authenticated
    USING (public.is_active_user(auth.uid()) AND public.current_user_role(auth.uid()) = 'ADMIN')
    WITH CHECK (public.is_active_user(auth.uid()) AND public.current_user_role(auth.uid()) = 'ADMIN');

CREATE POLICY "admin_all_dna" ON public."DNA_CLIENTE_GPT"
    FOR ALL TO authenticated
    USING (public.is_active_user(auth.uid()) AND public.current_user_role(auth.uid()) = 'ADMIN')
    WITH CHECK (public.is_active_user(auth.uid()) AND public.current_user_role(auth.uid()) = 'ADMIN');

CREATE POLICY "admin_all_creditos" ON public."IA_CREDITOS_CLIENTE"
    FOR ALL TO authenticated
    USING (public.is_active_user(auth.uid()) AND public.current_user_role(auth.uid()) = 'ADMIN')
    WITH CHECK (public.is_active_user(auth.uid()) AND public.current_user_role(auth.uid()) = 'ADMIN');

CREATE POLICY "admin_all_estrategia" ON public."CLIENTES_ESTRATEGIA"
    FOR ALL TO authenticated
    USING (public.is_active_user(auth.uid()) AND public.current_user_role(auth.uid()) = 'ADMIN')
    WITH CHECK (public.is_active_user(auth.uid()) AND public.current_user_role(auth.uid()) = 'ADMIN');

CREATE POLICY "admin_all_servicos" ON public."SERVICOS_EXTRAS_CLIENTES"
    FOR ALL TO authenticated
    USING (public.is_active_user(auth.uid()) AND public.current_user_role(auth.uid()) = 'ADMIN')
    WITH CHECK (public.is_active_user(auth.uid()) AND public.current_user_role(auth.uid()) = 'ADMIN');

CREATE POLICY "admin_all_financeiro" ON public."FINANCEIRO_CLIENTES"
    FOR ALL TO authenticated
    USING (public.is_active_user(auth.uid()) AND public.current_user_role(auth.uid()) = 'ADMIN')
    WITH CHECK (public.is_active_user(auth.uid()) AND public.current_user_role(auth.uid()) = 'ADMIN');

CREATE POLICY "admin_all_demandas" ON public."DEMANDAS_CLIENTES"
    FOR ALL TO authenticated
    USING (public.is_active_user(auth.uid()) AND public.current_user_role(auth.uid()) = 'ADMIN')
    WITH CHECK (public.is_active_user(auth.uid()) AND public.current_user_role(auth.uid()) = 'ADMIN');

CREATE POLICY "admin_all_comunicacoes" ON public."COMUNICACOES_CLIENTE"
    FOR ALL TO authenticated
    USING (public.is_active_user(auth.uid()) AND public.current_user_role(auth.uid()) = 'ADMIN')
    WITH CHECK (public.is_active_user(auth.uid()) AND public.current_user_role(auth.uid()) = 'ADMIN');
