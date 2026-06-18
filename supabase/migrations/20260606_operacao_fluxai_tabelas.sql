-- Migration SQL para as Tabelas Operacionais do FluxAI OS
-- Data: 2026-06-06
-- Não altera Auth, RBAC ou RLS existentes. Apenas cria as estruturas de tabelas caso não existam.

-- 1. CONTRATOS_CLIENTES
CREATE TABLE IF NOT EXISTS public."CONTRATOS_CLIENTES" (
    contrato_id text PRIMARY KEY,
    client_id text NOT NULL,
    cliente_nome text,
    escopo_contratado text,
    data_inicio text,
    data_criacao text,
    responsavel_comercial text,
    dia_vencimento text,
    observacao text,
    data_atualizacao text
);

-- 2. DNA_CLIENTE_GPT
CREATE TABLE IF NOT EXISTS public."DNA_CLIENTE_GPT" (
    dna_id text PRIMARY KEY,
    client_id text NOT NULL,
    status_dna text,
    data_criacao text,
    data_atualizacao text
    -- Adicionar colunas adicionais de DNA conforme a necessidade
);

-- 3. IA_CREDITOS_CLIENTE (Ordem Exata Solicitada)
CREATE TABLE IF NOT EXISTS public."IA_CREDITOS_CLIENTE" (
    limite_id text PRIMARY KEY,
    client_id text NOT NULL,
    client_name text,
    mes_referencia text,
    tipo_entrega text,
    origem_limite text,
    referencia_origem text,
    limite_operacional_mensal numeric,
    limite_ocupado numeric,
    limite_publicado numeric,
    limite_disponivel_operacional numeric,
    status_limite text,
    escopo_contratado text,
    servico_extra_aprovado text,
    ajuste_manual_autorizado text,
    responsavel_autorizacao text,
    data_inicio text,
    data_fim text,
    observacao text,
    data_criacao text,
    data_atualizacao text
);

-- 4. CLIENTES_ESTRATEGIA
CREATE TABLE IF NOT EXISTS public."CLIENTES_ESTRATEGIA" (
    client_id text PRIMARY KEY,
    cliente_nome text,
    segmento text,
    objetivo_principal text,
    responsavel_fluxai text,
    data_criacao text,
    data_atualizacao text
);

-- 5. SERVICOS_EXTRAS_CLIENTES
CREATE TABLE IF NOT EXISTS public."SERVICOS_EXTRAS_CLIENTES" (
    servico_extra_id text PRIMARY KEY,
    client_id text NOT NULL,
    client_name text,
    tipo_servico_extra text,
    nome_servico text,
    descricao_solicitacao text,
    origem_solicitacao text,
    solicitado_por text,
    status_servico_extra text,
    prioridade text,
    prazo_solicitado text,
    prazo_aprovado text,
    valor_estimado numeric,
    valor_aprovado numeric,
    gera_credito_ia text,
    quantidade_credito_ia numeric,
    impacto_planejamento text,
    responsavel_fluxai text,
    link_briefing_drive text,
    link_entrega_drive text,
    observacao text,
    data_solicitacao text,
    data_orcamento text,
    data_aprovacao text,
    data_entrega text,
    data_atualizacao text
);

-- 6. FINANCEIRO_CLIENTES
CREATE TABLE IF NOT EXISTS public."FINANCEIRO_CLIENTES" (
    financeiro_id text PRIMARY KEY,
    client_id text NOT NULL,
    client_name text,
    origem_lancamento text,
    referencia_origem text,
    descricao_lancamento text,
    tipo_lancamento text,
    valor numeric,
    competencia text,
    data_vencimento text,
    status_pagamento text,
    forma_pagamento text,
    observacao text,
    data_criacao text,
    data_atualizacao text
);

-- 7. DEMANDAS_CLIENTES
CREATE TABLE IF NOT EXISTS public."DEMANDAS_CLIENTES" (
    demanda_id text PRIMARY KEY,
    client_id text NOT NULL,
    client_name text,
    origem_demanda text,
    referencia_origem text,
    titulo_demanda text,
    descricao_demanda text,
    status_demanda text,
    prioridade text,
    responsavel text,
    prazo text,
    impacta_calendario text,
    link_briefing text,
    link_entrega text,
    data_criacao text,
    data_atualizacao text
);

-- 8. COMUNICACOES_CLIENTE
CREATE TABLE IF NOT EXISTS public."COMUNICACOES_CLIENTE" (
    notificacao_id text PRIMARY KEY,
    client_id text NOT NULL,
    client_name text,
    origem_notificacao text,
    referencia_origem text,
    tipo_notificacao text,
    titulo text,
    mensagem text,
    status_notificacao text,
    canal_sugerido text,
    requer_revisao_humana text,
    data_criacao text,
    data_envio text
);

-- 2. ENABLE E FORCE RLS
ALTER TABLE public."CONTRATOS_CLIENTES" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."CONTRATOS_CLIENTES" FORCE ROW LEVEL SECURITY;
ALTER TABLE public."DNA_CLIENTE_GPT" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."DNA_CLIENTE_GPT" FORCE ROW LEVEL SECURITY;
ALTER TABLE public."IA_CREDITOS_CLIENTE" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."IA_CREDITOS_CLIENTE" FORCE ROW LEVEL SECURITY;
ALTER TABLE public."CLIENTES_ESTRATEGIA" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."CLIENTES_ESTRATEGIA" FORCE ROW LEVEL SECURITY;
ALTER TABLE public."SERVICOS_EXTRAS_CLIENTES" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."SERVICOS_EXTRAS_CLIENTES" FORCE ROW LEVEL SECURITY;
ALTER TABLE public."FINANCEIRO_CLIENTES" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."FINANCEIRO_CLIENTES" FORCE ROW LEVEL SECURITY;
ALTER TABLE public."DEMANDAS_CLIENTES" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."DEMANDAS_CLIENTES" FORCE ROW LEVEL SECURITY;
ALTER TABLE public."COMUNICACOES_CLIENTE" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."COMUNICACOES_CLIENTE" FORCE ROW LEVEL SECURITY;

-- 3. REVOKE PRIVILÉGIOS (Fail-Closed Absoluto)
REVOKE ALL ON public."CONTRATOS_CLIENTES" FROM PUBLIC, anon, authenticated;
REVOKE ALL ON public."DNA_CLIENTE_GPT" FROM PUBLIC, anon, authenticated;
REVOKE ALL ON public."IA_CREDITOS_CLIENTE" FROM PUBLIC, anon, authenticated;
REVOKE ALL ON public."CLIENTES_ESTRATEGIA" FROM PUBLIC, anon, authenticated;
REVOKE ALL ON public."SERVICOS_EXTRAS_CLIENTES" FROM PUBLIC, anon, authenticated;
REVOKE ALL ON public."FINANCEIRO_CLIENTES" FROM PUBLIC, anon, authenticated;
REVOKE ALL ON public."DEMANDAS_CLIENTES" FROM PUBLIC, anon, authenticated;
REVOKE ALL ON public."COMUNICACOES_CLIENTE" FROM PUBLIC, anon, authenticated;

