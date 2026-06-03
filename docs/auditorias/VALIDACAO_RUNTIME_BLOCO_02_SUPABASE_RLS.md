# Validação Runtime e Saneamento RLS — Bloco 2

Este documento registra o diagnóstico, o script de saneamento final e o processo de homologação das políticas de Row Level Security (RLS) no Supabase de produção.

---

## 🔍 1. Diagnóstico de Políticas Residuais

Após a execução da primeira etapa de migração, uma varredura nas políticas de banco de dados revelou que algumas tabelas operacionais e acessos legados ainda possuíam regras com o papel `public` ou `anon` (definidas como `roles = {public}` com cláusulas `USING (true)`). 

As seguintes tabelas e políticas foram identificadas como vulneráveis e remanescentes:
- `ai_usage_logs` / `Allow All on ai_usage_logs`
- `analytics_snapshots` / `Allow All on analytics_snapshots`
- `approvals` / `Approvals public read`, `Permitir tudo provisoriamente`, `Políticas de aprovação por cargo`
- `audit_logs` / `Allow All on audit_logs`
- `client_knowledge_cache` / `Allow All on client_knowledge_cache`
- `content_assets` / `Allow All on content_assets`, `Permitir tudo provisoriamente`, `Public Update Content`, `Public View Content`
- `contracts` / `Allow All on contracts`, `Permitir tudo provisoriamente`
- `crm_leads` / `Allow All on crm_leads`
- `external_approvals` / `Allow External Access via Token`
- `extra_services_contracts` / `Allow All on extra_services_contracts`
- `governance_users` / `Allow All on governance_users`
- `knowledge_documents` / `Allow All on knowledge_documents`

---

## 🛠️ 2. Script SQL de Saneamento Final

O script a seguir realiza o expurgo de todas as políticas públicas listadas acima, ativa RLS e assegura que todas as tabelas operacionais estejam protegidas por políticas restritas a `TO authenticated`.

```sql
-- =====================================================================================
-- FLUXAI OS™ - SCRIPT DE SANEAMENTO FINAL RLS (BLOCO 2)
-- APLICAÇÃO: Manual via Supabase SQL Editor
-- CARACTERÍSTICA: Não destrutivo (não apaga dados reais de produção)
-- =====================================================================================

-- -------------------------------------------------------------------------------------
-- SEÇÃO 1: EXPURGO DAS POLÍTICAS PÚBLICAS / ANÔNIMAS REMANESCENTES
-- -------------------------------------------------------------------------------------

-- ai_usage_logs
DROP POLICY IF EXISTS "Allow All on ai_usage_logs" ON public.ai_usage_logs;

-- analytics_snapshots
DROP POLICY IF EXISTS "Allow All on analytics_snapshots" ON public.analytics_snapshots;

-- approvals
DROP POLICY IF EXISTS "Approvals public read" ON public.approvals;
DROP POLICY IF EXISTS "Permitir tudo provisoriamente" ON public.approvals;
DROP POLICY IF EXISTS "Políticas de aprovação por cargo" ON public.approvals;

-- audit_logs
DROP POLICY IF EXISTS "Allow All on audit_logs" ON public.audit_logs;

-- client_knowledge_cache
DROP POLICY IF EXISTS "Allow All on client_knowledge_cache" ON public.client_knowledge_cache;

-- content_assets
DROP POLICY IF EXISTS "Allow All on content_assets" ON public.content_assets;
DROP POLICY IF EXISTS "Permitir tudo provisoriamente" ON public.content_assets;
DROP POLICY IF EXISTS "Public Update Content" ON public.content_assets;
DROP POLICY IF EXISTS "Public View Content" ON public.content_assets;

-- contracts
DROP POLICY IF EXISTS "Allow All on contracts" ON public.contracts;
DROP POLICY IF EXISTS "Permitir tudo provisoriamente" ON public.contracts;

-- crm_leads
DROP POLICY IF EXISTS "Allow All on crm_leads" ON public.crm_leads;

-- external_approvals
DROP POLICY IF EXISTS "Allow External Access via Token" ON public.external_approvals;

-- extra_services_contracts
DROP POLICY IF EXISTS "Allow All on extra_services_contracts" ON public.extra_services_contracts;

-- governance_users
DROP POLICY IF EXISTS "Allow All on governance_users" ON public.governance_users;

-- knowledge_documents
DROP POLICY IF EXISTS "Allow All on knowledge_documents" ON public.knowledge_documents;


-- -------------------------------------------------------------------------------------
-- SEÇÃO 2: GARANTIA DE RLS ATIVO EM TODAS AS TABELAS OPERACIONAIS COMPLEMENTARES
-- -------------------------------------------------------------------------------------
ALTER TABLE public.approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.external_approvals ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------------------------------------------------
-- SEÇÃO 3: CRIAÇÃO/REFORÇO DAS POLÍTICAS DE ACESSO AUTENTICADO (TO authenticated)
-- -------------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Allow authenticated on approvals" ON public.approvals;
DROP POLICY IF EXISTS "Allow authenticated on analytics_snapshots" ON public.analytics_snapshots;
DROP POLICY IF EXISTS "Allow authenticated on external_approvals" ON public.external_approvals;

CREATE POLICY "Allow authenticated on approvals" ON public.approvals FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated on analytics_snapshots" ON public.analytics_snapshots FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated on external_approvals" ON public.external_approvals FOR ALL TO authenticated USING (true) WITH CHECK (true);
```

---

## 📊 3. Validação de Segurança

### Query SQL de Validação Final
Execute a consulta abaixo para buscar qualquer política associada ao papel `public` ou `anon` no schema `public`:

```sql
SELECT 
    schemaname,
    tablename,
    policyname,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND (roles && ARRAY['public'::name, 'anon'::name]);
```

### Resultado Esperado
* **Resultado:** **0 linhas retornadas**.
* **Significado:** Nenhuma tabela possui políticas expostas a usuários públicos ou anônimos, concluindo a mitigação de segurança.
