-- =====================================================================================
-- FLUXAI OS™ - ARQUITETURA DE BANCO DE DADOS (SUPABASE)
-- VERSÃO: 2.1.0 - HUB DE ATIVAÇÃO OPERACIONAL E GOVERNANÇA INTEGRADA
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
