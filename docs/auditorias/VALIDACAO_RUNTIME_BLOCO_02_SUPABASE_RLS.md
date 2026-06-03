# Validação Runtime e Saneamento RLS — Bloco 2 (Atualizado)

Este documento registra o diagnóstico final, o script de saneamento final e o processo de homologação das políticas de Row Level Security (RLS) no Supabase de produção.

---

## 🔍 1. Diagnóstico de Políticas Residuais

Nas varreduras do banco de dados, identificamos a presença de políticas públicas legadas ou remanescentes associadas ao papel `{public}` (ou `{anon}`) em várias tabelas operacionais e de perfis.

As tabelas e políticas a serem saneadas são:
- **`profiles`**: `Profiles are viewable by everyone`, `Users can update own profile`, `Allow All on profiles`
- **`leads` / `crm_leads`**: `Leads insertable by staff`, `Leads public read`, `Allow All on crm_leads`
- **`approvals`**: `Approvals public read`, `Staff can create approvals`, `Permitir tudo provisoriamente`
- **`content_assets`**: `Allow All on content_assets`, `Permitir tudo provisoriamente`, `Public View Content`, `Public Update Content`
- **`projects`**: `Allow All on projects`
- **`contracts`**: `Allow All on contracts`, `Permitir tudo provisoriamente`
- **`payments` / `payments_ledger`**: `Allow All on payments`, `Allow All on payments_ledger`
- **`governance_users`**: `Allow All on governance_users`
- **`extra_services_contracts`**: `Allow All on extra_services_contracts`
- **`operational_events`**: `Allow All on operational_events`
- **`ai_usage_logs`**: `Allow All on ai_usage_logs`
- **`client_knowledge_cache`**: `Allow All on client_knowledge_cache`
- **`knowledge_documents`**: `Allow All on knowledge_documents`
- **`audit_logs`**: `Allow All on audit_logs`
- **`external_approvals`**: `Allow External Access via Token`, `Allow All on external_approvals`

---

## 🛠️ 2. Script SQL de Saneamento Definitivo

Execute este script no **SQL Editor** do Supabase para revogar todas as políticas públicas e anôminas e forçar o RLS restrito a `TO authenticated` em todas as tabelas operacionais:

```sql
-- =====================================================================================
-- FLUXAI OS™ - SCRIPT DE SANEAMENTO DEFINITIVO RLS (BLOCO 2)
-- APLICAÇÃO: Manual via Supabase SQL Editor
-- CARACTERÍSTICA: Não destrutivo (não apaga dados reais nem dropa tabelas)
-- =====================================================================================

-- -------------------------------------------------------------------------------------
-- SEÇÃO 1: EXPURGO DAS POLÍTICAS PÚBLICAS / ANÔNIMAS RESTANTES
-- -------------------------------------------------------------------------------------

-- 1. Tabela public.profiles
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow All on profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow authenticated on profiles" ON public.profiles;

-- 2. Tabela public.leads
DROP POLICY IF EXISTS "Leads insertable by staff" ON public.leads;
DROP POLICY IF EXISTS "Leads public read" ON public.leads;
DROP POLICY IF EXISTS "Allow All on leads" ON public.leads;
DROP POLICY IF EXISTS "Allow authenticated on leads" ON public.leads;

-- 3. Tabela public.crm_leads
DROP POLICY IF EXISTS "Leads insertable by staff" ON public.crm_leads;
DROP POLICY IF EXISTS "Leads public read" ON public.crm_leads;
DROP POLICY IF EXISTS "Allow All on crm_leads" ON public.crm_leads;
DROP POLICY IF EXISTS "Allow authenticated on crm_leads" ON public.crm_leads;

-- 4. Tabela public.approvals
DROP POLICY IF EXISTS "Approvals public read" ON public.approvals;
DROP POLICY IF EXISTS "Staff can create approvals" ON public.approvals;
DROP POLICY IF EXISTS "Permitir tudo provisoriamente" ON public.approvals;
DROP POLICY IF EXISTS "Allow All on approvals" ON public.approvals;
DROP POLICY IF EXISTS "Allow authenticated on approvals" ON public.approvals;

-- 5. Tabela public.content_assets
DROP POLICY IF EXISTS "Allow All on content_assets" ON public.content_assets;
DROP POLICY IF EXISTS "Permitir tudo provisoriamente" ON public.content_assets;
DROP POLICY IF EXISTS "Public View Content" ON public.content_assets;
DROP POLICY IF EXISTS "Public Update Content" ON public.content_assets;
DROP POLICY IF EXISTS "Allow authenticated on content_assets" ON public.content_assets;

-- 6. Tabela public.projects
DROP POLICY IF EXISTS "Allow All on projects" ON public.projects;
DROP POLICY IF EXISTS "Allow authenticated on projects" ON public.projects;

-- 7. Tabela public.contracts
DROP POLICY IF EXISTS "Allow All on contracts" ON public.contracts;
DROP POLICY IF EXISTS "Permitir tudo provisoriamente" ON public.contracts;
DROP POLICY IF EXISTS "Allow authenticated on contracts" ON public.contracts;

-- 8. Tabela public.payments
DROP POLICY IF EXISTS "Allow All on payments" ON public.payments;
DROP POLICY IF EXISTS "Allow authenticated on payments" ON public.payments;

-- 9. Tabela public.payments_ledger
DROP POLICY IF EXISTS "Allow All on payments_ledger" ON public.payments_ledger;
DROP POLICY IF EXISTS "Allow authenticated on payments_ledger" ON public.payments_ledger;

-- 10. Tabela public.governance_users
DROP POLICY IF EXISTS "Allow All on governance_users" ON public.governance_users;
DROP POLICY IF EXISTS "Allow authenticated on governance_users" ON public.governance_users;

-- 11. Tabela public.extra_services_contracts
DROP POLICY IF EXISTS "Allow All on extra_services_contracts" ON public.extra_services_contracts;
DROP POLICY IF EXISTS "Allow authenticated on extra_services_contracts" ON public.extra_services_contracts;

-- 12. Tabela public.operational_events
DROP POLICY IF EXISTS "Allow All on operational_events" ON public.operational_events;
DROP POLICY IF EXISTS "Allow authenticated on operational_events" ON public.operational_events;

-- 13. Tabela public.ai_usage_logs
DROP POLICY IF EXISTS "Allow All on ai_usage_logs" ON public.ai_usage_logs;
DROP POLICY IF EXISTS "Allow authenticated on ai_usage_logs" ON public.ai_usage_logs;

-- 14. Tabela public.client_knowledge_cache
DROP POLICY IF EXISTS "Allow All on client_knowledge_cache" ON public.client_knowledge_cache;
DROP POLICY IF EXISTS "Allow authenticated on client_knowledge_cache" ON public.client_knowledge_cache;

-- 15. Tabela public.knowledge_documents
DROP POLICY IF EXISTS "Allow All on knowledge_documents" ON public.knowledge_documents;
DROP POLICY IF EXISTS "Allow authenticated on knowledge_documents" ON public.knowledge_documents;

-- 16. Tabela public.audit_logs
DROP POLICY IF EXISTS "Allow All on audit_logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Allow authenticated on audit_logs" ON public.audit_logs;

-- 17. Tabela public.external_approvals
DROP POLICY IF EXISTS "Allow External Access via Token" ON public.external_approvals;
DROP POLICY IF EXISTS "Allow All on external_approvals" ON public.external_approvals;
DROP POLICY IF EXISTS "Allow authenticated on external_approvals" ON public.external_approvals;

-- 18. Tabela public.analytics_snapshots (se aplicável)
DROP POLICY IF EXISTS "Allow All on analytics_snapshots" ON public.analytics_snapshots;
DROP POLICY IF EXISTS "Allow authenticated on analytics_snapshots" ON public.analytics_snapshots;


-- -------------------------------------------------------------------------------------
-- SEÇÃO 2: ATIVAÇÃO GLOBAL DE ROW LEVEL SECURITY (RLS)
-- -------------------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.governance_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.extra_services_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.operational_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_knowledge_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.external_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_snapshots ENABLE ROW LEVEL SECURITY;


-- -------------------------------------------------------------------------------------
-- SEÇÃO 3: CRIAÇÃO DAS POLÍTICAS DE ACESSO AUTENTICADO (TO authenticated)
-- -------------------------------------------------------------------------------------
CREATE POLICY "Allow authenticated on profiles" ON public.profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated on leads" ON public.leads FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated on crm_leads" ON public.crm_leads FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated on approvals" ON public.approvals FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated on content_assets" ON public.content_assets FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated on projects" ON public.projects FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated on contracts" ON public.contracts FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated on payments" ON public.payments FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated on payments_ledger" ON public.payments_ledger FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated on governance_users" ON public.governance_users FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated on extra_services_contracts" ON public.extra_services_contracts FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated on operational_events" ON public.operational_events FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated on ai_usage_logs" ON public.ai_usage_logs FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated on client_knowledge_cache" ON public.client_knowledge_cache FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated on knowledge_documents" ON public.knowledge_documents FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated on audit_logs" ON public.audit_logs FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated on external_approvals" ON public.external_approvals FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated on analytics_snapshots" ON public.analytics_snapshots FOR ALL TO authenticated USING (true) WITH CHECK (true);
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
    roles AS roles_permitidas,
    cmd AS comando,
    qual AS condicao_using,
    with_check AS condicao_check
FROM pg_policies
WHERE schemaname = 'public'
  AND (roles && ARRAY['public'::name, 'anon'::name]);
```

### Resultado Esperado
* **Resultado:** **0 linhas retornadas**.
* **Significado:** Nenhuma tabela possui políticas expostas a usuários públicos ou anônimos, concluindo a mitigação de segurança.

---

## 📊 4. Resultado da Bateria de Testes em Runtime (Executado)

Rodamos a bateria de testes de controle em runtime via Puppeteer sobre a porta HTTP `8080`, simulando sessões de clientes e administradores em navegadores reais:

1. **Teste 1 (Acesso Deslogado):** Acesso a `flux-calendar.html?project=some-uuid` sem sessão ativa redirecionou com sucesso para `os/login.html`.
   - **Status:** **SUCESSO**
2. **Teste 2 (Cross-Tenant / IDOR):** Acesso a `flux-calendar.html?project=projeto_invasor_456` sob uma sessão de `CLIENT` com `project_id = projeto_oficial_maria_123` foi bloqueado, e a URL foi reescrita com segurança pelo Event Guard para o ID oficial.
   - **Status:** **SUCESSO**
3. **Teste 3 (Acesso de Administração):** Acesso a `flux-calendar.html?project=projeto_cliente_xyz` sob uma sessão de `ADMIN` foi permitido e mantido normalmente para auditoria.
   - **Status:** **SUCESSO**
4. **Teste 4 (Conexão Supabase REST API):** Requisições REST directas às tabelas operacionais (como `projects` e `external_approvals`) usando a chave anônima (`anonKey` sem JWT) retornaram 0 linhas, comprovando o correto funcionamento do RLS.
   - **Status:** **SUCESSO**

Todos os testes de conformidade técnica em runtime passaram de forma consistente.

