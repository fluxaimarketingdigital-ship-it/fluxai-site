-- MIGRATION: 20260626000002_rls_policies_tenant.sql
-- FASE B: Correção de RLS
-- Descrição: Ativa RLS, erradica policies frágeis USING(true) e consolida o isolamento restrito de leitura.

-- 1. Ativando RLS nas 3 tabelas desprotegidas
ALTER TABLE public."CONTRATOS_CLIENTES" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."DNA_CLIENTE_GPT" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."CLIENTES_ESTRATEGIA" ENABLE ROW LEVEL SECURITY;

-- 2. Erradicação do Bypass de Homologação
DROP POLICY IF EXISTS "Homologacao: Permitir SELECT authenticated" ON public."SERVICOS_EXTRAS_CLIENTES";
DROP POLICY IF EXISTS "Homologacao: Permitir SELECT authenticated" ON public."FINANCEIRO_CLIENTES";
DROP POLICY IF EXISTS "Homologacao: Permitir SELECT authenticated" ON public."DEMANDAS_CLIENTES";
DROP POLICY IF EXISTS "Homologacao: Permitir SELECT authenticated" ON public."COMUNICACOES_CLIENTE";
DROP POLICY IF EXISTS "Homologacao: Permitir SELECT authenticated" ON public."IA_CREDITOS_CLIENTE";

-- 3. Aplicação do RLS Absoluto (Isolamento Multi-Tenant em Leitura)
-- Nota: Escrita (INSERT/UPDATE/DELETE) não possui policy, forçando DEFAULT DENY 
-- contra conexões autenticadas do front-end. Toda alteração se dá via Proxy/Service Role ou ADMIN explicitly.

CREATE POLICY "Tenant Isolation: Read Own Client" ON public."CONTRATOS_CLIENTES"
  FOR SELECT TO authenticated USING (public.can_access_client(client_id));

CREATE POLICY "Tenant Isolation: Read Own Client" ON public."DNA_CLIENTE_GPT"
  FOR SELECT TO authenticated USING (public.can_access_client(client_id));

CREATE POLICY "Tenant Isolation: Read Own Client" ON public."IA_CREDITOS_CLIENTE"
  FOR SELECT TO authenticated USING (public.can_access_client(client_id));

CREATE POLICY "Tenant Isolation: Read Own Client" ON public."CLIENTES_ESTRATEGIA"
  FOR SELECT TO authenticated USING (public.can_access_client(client_id));

CREATE POLICY "Tenant Isolation: Read Own Client" ON public."SERVICOS_EXTRAS_CLIENTES"
  FOR SELECT TO authenticated USING (public.can_access_client(client_id));

CREATE POLICY "Tenant Isolation: Read Own Client" ON public."FINANCEIRO_CLIENTES"
  FOR SELECT TO authenticated USING (public.can_access_client(client_id));

CREATE POLICY "Tenant Isolation: Read Own Client" ON public."DEMANDAS_CLIENTES"
  FOR SELECT TO authenticated USING (public.can_access_client(client_id));

CREATE POLICY "Tenant Isolation: Read Own Client" ON public."COMUNICACOES_CLIENTE"
  FOR SELECT TO authenticated USING (public.can_access_client(client_id));

-- Bônus: Conceder aos ADMINS privilégios operacionais locais apenas via App, se desejado.
-- Contudo, mantendo o modelo estrito de READ-ONLY para todos e centralizando ações via proxy.

-- 4. Conceder permissão de Leitura (SELECT) na camada de banco
GRANT SELECT ON public."CONTRATOS_CLIENTES" TO authenticated;
GRANT SELECT ON public."DNA_CLIENTE_GPT" TO authenticated;
GRANT SELECT ON public."IA_CREDITOS_CLIENTE" TO authenticated;
GRANT SELECT ON public."CLIENTES_ESTRATEGIA" TO authenticated;
GRANT SELECT ON public."SERVICOS_EXTRAS_CLIENTES" TO authenticated;
GRANT SELECT ON public."FINANCEIRO_CLIENTES" TO authenticated;
GRANT SELECT ON public."DEMANDAS_CLIENTES" TO authenticated;
GRANT SELECT ON public."COMUNICACOES_CLIENTE" TO authenticated;
