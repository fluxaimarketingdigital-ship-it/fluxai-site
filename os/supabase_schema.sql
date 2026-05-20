-- =====================================================================================
-- FLUXAI OS™ - ARQUITETURA DE BANCO DE DADOS (SUPABASE)
-- VERSÃO: 4.0.0 - KNOWLEDGE CORE™ (AI Usage Logs + Client Knowledge + Vertical Layer)
-- =====================================================================================
--
-- 💡 COMO APLICAR NO SEU SUPABASE:
--
-- CASO 1: SE VOCÊ ESTÁ CONFIGURANDO UM BANCO TOTALMENTE NOVO:
--    1. Vá no menu lateral esquerdo do Supabase e clique em "SQL Editor".
--    2. Clique em "New query".
--    3. Cole todo este código abaixo lá dentro e clique em "Run".
--
-- CASO 2: SE VOCÊ JÁ TINHA O BANCO ANTIGO CRIADO (MIGRAÇÃO / AJUSTE DE ERROS):
--    Se você já rodou o script antes ou tinha tabelas antigas, as tabelas já existiam
--    e a instrução "CREATE TABLE IF NOT EXISTS" não adicionou os novos campos.
--    Para resolver isso e plugar o banco real de vez, basta copiar e rodar TODO este
--    script no SQL Editor. As instruções de ALTER TABLE na PARTE 5 vão injetar as
--    novas colunas nas tabelas existentes de forma 100% segura e sem perder nenhum dado!
--
-- =====================================================================================

-- =====================================================================================
-- PARTE 1: CRIAÇÃO DAS TABELAS (SE NÃO EXISTIREM)
-- =====================================================================================

-- 1. TABELA DE PROJETOS (NÚCLEO DO ECOSSISTEMA)
CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    company_name TEXT NOT NULL,
    segment TEXT,
    status TEXT DEFAULT 'ATIVO',
    workspace_type TEXT DEFAULT 'CLIENT', -- CLIENT | INTERNAL_WORKSPACE | MASTER_ACCOUNT
    is_billing_exempt BOOLEAN DEFAULT false,
    digital_infrastructure JSONB DEFAULT '{}'::jsonb,
    operational_activation JSONB DEFAULT '{}'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb,
    tone TEXT,
    objectives TEXT,
    links JSONB DEFAULT '{}'::jsonb
);

-- 2. TABELA DE CONTRATOS (GOVERNANÇA FINANCEIRA)
CREATE TABLE IF NOT EXISTS contracts (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    client_name TEXT NOT NULL,
    company_name TEXT NOT NULL,
    deliverables TEXT,
    contract_value NUMERIC DEFAULT 0,
    due_day INTEGER DEFAULT 5,
    status TEXT DEFAULT 'ATIVO',
    start_date DATE
);

-- 3. TABELA DE ATIVOS DE CONTEÚDO (MOTOR DE PRODUÇÃO E APROVAÇÃO)
CREATE TABLE IF NOT EXISTS content_assets (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    status TEXT DEFAULT 'PLANEJAMENTO', -- PLANEJAMENTO, EM PRODUÇÃO, AGUARDANDO APROVAÇÃO, AGENDADO, PRONTO, PUBLICADO
    priority TEXT DEFAULT 'MÉDIA',
    platform TEXT,
    scheduled_at TIMESTAMP WITH TIME ZONE,
    caption TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    internal_notes TEXT
);

-- 4. TABELA DE LOGS DE AUDITORIA (CENTRO DE COMANDO)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    action TEXT NOT NULL,
    module TEXT DEFAULT 'system',
    metadata JSONB DEFAULT '{}'::jsonb,
    user_role TEXT DEFAULT 'SYSTEM',
    user_id UUID
);

-- =====================================================================================
-- PARTE 2: MIGRAÇÃO E COMPATIBILIDADE - GARANTIA DE COLUNAS PARA BANCOS EXISTENTES
-- =====================================================================================
-- Executa o upgrade automático nas tabelas antigas caso elas já existissem.
-- Não altera ou apaga nenhum dado pré-existente.

-- Upgrades na tabela 'projects'
ALTER TABLE projects ADD COLUMN IF NOT EXISTS segment TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS digital_infrastructure JSONB DEFAULT '{}'::jsonb;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS operational_activation JSONB DEFAULT '{}'::jsonb;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS tone TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS objectives TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS links JSONB DEFAULT '{}'::jsonb;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS workspace_type TEXT DEFAULT 'CLIENT';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS is_billing_exempt BOOLEAN DEFAULT false;

-- Upgrades na tabela 'contracts'
ALTER TABLE contracts ADD COLUMN IF NOT EXISTS start_date DATE;

-- Upgrades na tabela 'audit_logs'
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS module TEXT DEFAULT 'system';
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS user_id UUID;

-- =====================================================================================
-- PARTE 3: CONFIGURAÇÕES DE SEGURANÇA (RLS - ROW LEVEL SECURITY)
-- =====================================================================================

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Exclui políticas antigas se já existirem para evitar conflitos na reinstalação
DROP POLICY IF EXISTS "Allow All on projects" ON projects;
DROP POLICY IF EXISTS "Allow All on contracts" ON contracts;
DROP POLICY IF EXISTS "Allow All on content_assets" ON content_assets;
DROP POLICY IF EXISTS "Allow All on audit_logs" ON audit_logs;

-- Recria políticas públicas de acesso amplo para simulação e onboarding imediato
CREATE POLICY "Allow All on projects" ON projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All on contracts" ON contracts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All on content_assets" ON content_assets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All on audit_logs" ON audit_logs FOR ALL USING (true) WITH CHECK (true);

-- =====================================================================================
-- PARTE 4: TABELAS DE CRM E GOVERNANÇA (FASE 3)
-- =====================================================================================

-- 5. TABELA DE CRM LEADS (CAPTAÇÃO E INTELIGÊNCIA COMERCIAL)
CREATE TABLE IF NOT EXISTS crm_leads (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    company TEXT,
    email TEXT,
    phone TEXT,
    pain_point TEXT,
    status TEXT DEFAULT 'NOVO', -- NOVO, QUALIFICADO, EM NEGOCIAÇÃO, GANHO, PERDIDO
    temperature TEXT DEFAULT 'MORNO', -- QUENTE, MORNO, FRIO
    health_score INTEGER DEFAULT 50,
    source TEXT DEFAULT 'WEBSITE',
    utm_source TEXT,
    utm_campaign TEXT,
    internal_notes TEXT,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL
);

-- 6. TABELA DE USUÁRIOS E GOVERNANÇA (OPERADORES DO OS)
CREATE TABLE IF NOT EXISTS governance_users (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'CLIENT', -- ADMIN, OPERATOR, CLIENT
    status TEXT DEFAULT 'ACTIVE',
    avatar TEXT,
    permissions JSONB DEFAULT '[]'::jsonb,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    scoped_project_id UUID REFERENCES projects(id) ON DELETE SET NULL -- Restringe CLIENT ao seu projeto
);

ALTER TABLE crm_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE governance_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow All on crm_leads" ON crm_leads;
DROP POLICY IF EXISTS "Allow All on governance_users" ON governance_users;

CREATE POLICY "Allow All on crm_leads" ON crm_leads FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All on governance_users" ON governance_users FOR ALL USING (true) WITH CHECK (true);

-- =====================================================================================
-- PARTE 5: INTERLIGAÇÕES OPERACIONAIS - FINANCIAL + EXTRAS + EVENTOS
-- =====================================================================================

-- 7. RAZÃO FINANCEIRO (FATURAMENTOS, PIX, COMPROVANTES)
-- Liga: contracts -> payments_ledger
-- Acionado por: onboarding (cria 1ª fatura), vencimento mensal, serviços extras
CREATE TABLE IF NOT EXISTS payments_ledger (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
    due_date DATE NOT NULL,
    amount_due NUMERIC DEFAULT 0,
    financial_status TEXT DEFAULT 'ACTIVE',
    -- ACTIVE | UPCOMING_DUE | DUE_TODAY | OVERDUE | PAYMENT_UNDER_REVIEW | PAID
    payment_type TEXT DEFAULT 'RECORRENTE', -- RECORRENTE | EXTRA
    pix_copia_e_cola TEXT,
    pix_qr_code TEXT,
    receipt_url TEXT,         -- Upload interno ou link Drive do comprovante
    drive_folder_url TEXT,    -- Pasta Drive de comprovantes do cliente
    paid_at TIMESTAMP WITH TIME ZONE,
    approved_by TEXT,         -- Quem da FluxAI aprovou o comprovante
    rejection_reason TEXT     -- Motivo de reprovação do comprovante
);

-- 8. SERVIÇOS EXTRAS / ADD-ONS (AVULSOS)
-- Liga: projects -> extra_services_contracts
-- Acionado por: Admin Console quando vende novo serviço extra ao cliente
-- Efeito: cria cobrança em payments_ledger + dispara evento + adapta Content Engine
CREATE TABLE IF NOT EXISTS extra_services_contracts (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    service_type TEXT NOT NULL,
    -- GRAVACAO_VIDEO | WEBSITE | LANDING_PAGE | BRANDING | META_ADS | AUTOMATION | FOTOGRAFIA
    service_value NUMERIC DEFAULT 0,
    deadline DATE,
    responsible TEXT,
    workflow_status TEXT DEFAULT 'ATV_PENDENTE',
    -- ATV_PENDENTE | EM_PRODUCAO | REVISAO | CONCLUIDO
    content_engine_linked BOOLEAN DEFAULT false, -- Flag: já injetou pautas no Content Engine?
    delivery_notes TEXT      -- Notas de entrega para o portal do cliente
);

-- 9. BARRAMENTO DE EVENTOS OPERACIONAIS (AUDIT TRAIL COMPLETO)
-- Liga: TODOS os módulos -> operational_events
-- Acionado por: qualquer ação crítica no sistema
-- Alimenta: Timeline Operacional, Intelligence Layer, Audit Console
CREATE TABLE IF NOT EXISTS operational_events (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    -- ONBOARDING_CONCLUIDO | CONTEUDO_CRIADO | CONTEUDO_APROVADO | CONTEUDO_REPROVADO
    -- PRODUCAO_INICIADA | PRODUCAO_CONCLUIDA | CONTEUDO_PUBLICADO
    -- CLIENTE_REVISOU | CLIENTE_APROVOU | VERSAO_GERADA
    -- SERVICO_EXTRA_ATIVADO | FATURA_GERADA | COMPROVANTE_ENVIADO | PAGAMENTO_CONFIRMADO
    -- USUARIO_CRIADO | PERMISSAO_ALTERADA
    responsible TEXT NOT NULL,  -- Nome/Cargo de quem executou
    context TEXT,               -- Resumo em texto da ação executada
    metadata JSONB DEFAULT '{}'::jsonb -- Payload técnico correlacionado
);

-- Ativar RLS nas novas tabelas
ALTER TABLE payments_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE extra_services_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE operational_events ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso amplo (ajuste para produção com auth.uid())
DROP POLICY IF EXISTS "Allow All on payments_ledger" ON payments_ledger;
DROP POLICY IF EXISTS "Allow All on extra_services_contracts" ON extra_services_contracts;
DROP POLICY IF EXISTS "Allow All on operational_events" ON operational_events;

CREATE POLICY "Allow All on payments_ledger" ON payments_ledger FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All on extra_services_contracts" ON extra_services_contracts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All on operational_events" ON operational_events FOR ALL USING (true) WITH CHECK (true);

-- Migração segura: adiciona coluna em governance_users se já existia sem ela
ALTER TABLE governance_users ADD COLUMN IF NOT EXISTS scoped_project_id UUID REFERENCES projects(id) ON DELETE SET NULL;

-- =====================================================================================
-- ÍNDICES DE PERFORMANCE (Queries comuns por project_id e event_type)
-- =====================================================================================
CREATE INDEX IF NOT EXISTS idx_payments_contract ON payments_ledger(contract_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments_ledger(financial_status);
CREATE INDEX IF NOT EXISTS idx_extras_project ON extra_services_contracts(project_id);
CREATE INDEX IF NOT EXISTS idx_events_project ON operational_events(project_id);
CREATE INDEX IF NOT EXISTS idx_events_type ON operational_events(event_type);
CREATE INDEX IF NOT EXISTS idx_assets_project_status ON content_assets(project_id, status);

-- =====================================================================================
-- PARTE 6: KNOWLEDGE CORE™ — TABELAS DE INTELIGÊNCIA CONTEXTUAL
-- Versão 4.0.0 | Adicionadas em 2026-05-20
-- =====================================================================================

-- 10. AI USAGE LOGS — Controle de custo e auditoria de uso de IA por cliente/módulo
CREATE TABLE IF NOT EXISTS ai_usage_logs (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    -- Quem executou e onde
    user_id TEXT,                    -- ID do usuário (ou 'system')
    module TEXT NOT NULL,            -- 'content-engine' | 'onboarding' | 'contracts-finance' | etc.
    action_type TEXT NOT NULL,       -- Template usado: 'GENERATE_CONTENT_PLAN' | 'GENERATE_CAPTION' | etc.
    -- Modelo e custo
    model_used TEXT NOT NULL,        -- 'gpt-4o' | 'gpt-4o-mini' | 'CACHED'
    tokens_estimated INTEGER DEFAULT 0,
    cost_estimated NUMERIC(10,6) DEFAULT 0,
    -- Cache
    cached_response BOOLEAN DEFAULT false,
    -- Resultado
    success BOOLEAN DEFAULT true,
    error_message TEXT
);

-- 11. CLIENT KNOWLEDGE BASE — Cache persistente de contexto por cliente
-- Evita re-buscar dados a cada chamada de IA. Invalidado quando onboarding/contrato muda.
CREATE TABLE IF NOT EXISTS client_knowledge_cache (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE UNIQUE,
    -- Resumos em texto comprimido para uso nos prompts
    summary_onboarding TEXT,         -- Resumo do onboarding (tom, objetivos, pilares, dores)
    summary_contract TEXT,           -- Resumo do contrato (escopo, valor, vigência)
    summary_extras TEXT,             -- Resumo dos serviços extras ativos
    summary_content_history TEXT,    -- Resumo dos últimos conteúdos no pipeline
    summary_strategy TEXT,           -- Resumo estratégico operacional atual
    -- Metadados
    vertical_key TEXT,               -- 'NUTRICAO' | 'ADVOCACIA' | 'MARKETING' | etc.
    last_invalidated_at TIMESTAMP WITH TIME ZONE,
    invalidation_reason TEXT
);

-- 12. KNOWLEDGE DOCUMENTS — Documentos indexáveis por cliente (base para RAG futuro)
-- Cada documento é um fragmento de contexto que pode ser buscado por similaridade.
CREATE TABLE IF NOT EXISTS knowledge_documents (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    -- Tipo e conteúdo
    doc_type TEXT NOT NULL,
    -- 'ONBOARDING' | 'CONTRACT' | 'BRIEFING' | 'APPROVAL_HISTORY'
    -- 'PLAYBOOK' | 'BRAND_GUIDE' | 'PLANNING' | 'EXTRA_SERVICE_BRIEF'
    title TEXT NOT NULL,
    content TEXT NOT NULL,           -- Texto do documento (usado em RAG / busca semântica futura)
    -- Controle
    is_active BOOLEAN DEFAULT true,
    version INTEGER DEFAULT 1,
    source TEXT,                     -- 'ONBOARDING_FORM' | 'ADMIN_MANUAL' | 'AI_GENERATED'
    metadata JSONB DEFAULT '{}'::jsonb
);

-- ─── RLS e Políticas ────────────────────────────────────────────

ALTER TABLE ai_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_knowledge_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow All on ai_usage_logs" ON ai_usage_logs;
DROP POLICY IF EXISTS "Allow All on client_knowledge_cache" ON client_knowledge_cache;
DROP POLICY IF EXISTS "Allow All on knowledge_documents" ON knowledge_documents;

CREATE POLICY "Allow All on ai_usage_logs" ON ai_usage_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All on client_knowledge_cache" ON client_knowledge_cache FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All on knowledge_documents" ON knowledge_documents FOR ALL USING (true) WITH CHECK (true);

-- ─── Índices de Performance ─────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_ai_logs_project    ON ai_usage_logs(project_id);
CREATE INDEX IF NOT EXISTS idx_ai_logs_module     ON ai_usage_logs(module);
CREATE INDEX IF NOT EXISTS idx_ai_logs_model      ON ai_usage_logs(model_used);
CREATE INDEX IF NOT EXISTS idx_ai_logs_created    ON ai_usage_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_knowledge_project  ON knowledge_documents(project_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_type     ON knowledge_documents(doc_type);
CREATE INDEX IF NOT EXISTS idx_kc_cache_project   ON client_knowledge_cache(project_id);

-- ─── Migração Segura (ALTER TABLE) ──────────────────────────────
-- Roda sem erro mesmo se tabela já existia sem essas colunas.

ALTER TABLE extra_services_contracts
    ADD COLUMN IF NOT EXISTS briefing TEXT,
    ADD COLUMN IF NOT EXISTS approved_by TEXT,
    ADD COLUMN IF NOT EXISTS drive_link TEXT,
    ADD COLUMN IF NOT EXISTS contract_id UUID REFERENCES contracts(id) ON DELETE SET NULL;

-- =====================================================================================
-- FIM DO SCHEMA v4.0.0
-- =====================================================================================
-- Tabelas: projects, contracts, governance_users, content_assets, audit_logs,
--          payments_ledger, extra_services_contracts, operational_events,
--          ai_usage_logs, client_knowledge_cache, knowledge_documents
-- Total: 11 tabelas | RLS ativado em todas
-- =====================================================================================
