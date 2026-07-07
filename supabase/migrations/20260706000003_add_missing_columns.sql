-- 20260706000003_add_missing_columns.sql

-- Atualização da tabela DNA_CLIENTE_GPT com todas as 19 colunas faltantes
ALTER TABLE public."DNA_CLIENTE_GPT"
ADD COLUMN IF NOT EXISTS client_name text,
ADD COLUMN IF NOT EXISTS essencia_marca text,
ADD COLUMN IF NOT EXISTS personalidade_marca text,
ADD COLUMN IF NOT EXISTS tom_de_voz text,
ADD COLUMN IF NOT EXISTS nivel_linguagem text,
ADD COLUMN IF NOT EXISTS temas_permitidos text,
ADD COLUMN IF NOT EXISTS temas_proibidos text,
ADD COLUMN IF NOT EXISTS promessas_evitar text,
ADD COLUMN IF NOT EXISTS argumentos_centrais text,
ADD COLUMN IF NOT EXISTS provas_autoridade text,
ADD COLUMN IF NOT EXISTS referencias_visuais text,
ADD COLUMN IF NOT EXISTS referencias_conteudo text,
ADD COLUMN IF NOT EXISTS restricoes_legais text,
ADD COLUMN IF NOT EXISTS restricoes_eticas text,
ADD COLUMN IF NOT EXISTS cta_preferenciais text,
ADD COLUMN IF NOT EXISTS modelo_legenda text,
ADD COLUMN IF NOT EXISTS modelo_roteiro text,
ADD COLUMN IF NOT EXISTS modelo_carrossel text,
ADD COLUMN IF NOT EXISTS observacoes_gpt text;

-- Atualização da tabela CONTRATOS_CLIENTES com as colunas faltantes
ALTER TABLE public."CONTRATOS_CLIENTES"
ADD COLUMN IF NOT EXISTS tipo_contrato text,
ADD COLUMN IF NOT EXISTS plano_cliente text,
ADD COLUMN IF NOT EXISTS status_contrato text,
ADD COLUMN IF NOT EXISTS data_fim text,
ADD COLUMN IF NOT EXISTS valor_mensal numeric,
ADD COLUMN IF NOT EXISTS valor_setup numeric,
ADD COLUMN IF NOT EXISTS servicos_inclusos text,
ADD COLUMN IF NOT EXISTS limites_escopo text,
ADD COLUMN IF NOT EXISTS creditos_ia_base_mes numeric,
ADD COLUMN IF NOT EXISTS link_contrato_drive text,
ADD COLUMN IF NOT EXISTS link_proposta_drive text,
ADD COLUMN IF NOT EXISTS ciclo_fidelidade text;
