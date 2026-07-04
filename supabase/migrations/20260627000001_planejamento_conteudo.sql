-- Migration SQL para a Tabela PLANEJAMENTO_CONTEUDO (Motor de Conteúdo)
-- Data: 2026-06-27

CREATE TABLE IF NOT EXISTS public."PLANEJAMENTO_CONTEUDO" (
    planejamento_id text PRIMARY KEY,
    client_id text NOT NULL,
    client_name text,
    mes_referencia text,
    semana_referencia text,
    canal text,
    formato_conteudo text,
    tema text,
    objetivo_conteudo text,
    pilar_conteudo text,
    etapa_funil text,
    briefing_resumo text,
    status_planejamento text,
    geracao_id text,
    credito_id text,
    responsavel_planejamento text,
    responsavel_design text,
    responsavel_copy text,
    data_prevista text,
    data_publicacao text,
    link_briefing_drive text,
    link_entrega_drive text,
    observacao text,
    data_criacao text,
    data_atualizacao text
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public."PLANEJAMENTO_CONTEUDO" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."PLANEJAMENTO_CONTEUDO" FORCE ROW LEVEL SECURITY;

-- Revogar acessos públicos por padrão (Fail-Closed)
REVOKE ALL ON public."PLANEJAMENTO_CONTEUDO" FROM PUBLIC, anon, authenticated;

-- Garantir acesso para o Service Role (Make/Backend)
GRANT SELECT, INSERT, UPDATE, DELETE ON public."PLANEJAMENTO_CONTEUDO" TO service_role;
