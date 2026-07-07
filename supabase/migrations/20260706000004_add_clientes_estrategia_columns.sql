-- 20260706000004_add_clientes_estrategia_columns.sql

-- Adiciona as colunas estratégicas que faltavam na tabela CLIENTES_ESTRATEGIA
ALTER TABLE public."CLIENTES_ESTRATEGIA"
ADD COLUMN IF NOT EXISTS tipo_cliente text,
ADD COLUMN IF NOT EXISTS posicionamento_atual text,
ADD COLUMN IF NOT EXISTS posicionamento_desejado text,
ADD COLUMN IF NOT EXISTS proposta_valor text,
ADD COLUMN IF NOT EXISTS diferenciais text,
ADD COLUMN IF NOT EXISTS publico_alvo text,
ADD COLUMN IF NOT EXISTS persona_principal text,
ADD COLUMN IF NOT EXISTS dor_principal text,
ADD COLUMN IF NOT EXISTS desejo_principal text,
ADD COLUMN IF NOT EXISTS inimigo_comum text,
ADD COLUMN IF NOT EXISTS nivel_percepcao_premium text,
ADD COLUMN IF NOT EXISTS objetivo_90_dias text,
ADD COLUMN IF NOT EXISTS objetivo_mes_atual text,
ADD COLUMN IF NOT EXISTS prioridade_estrategica text,
ADD COLUMN IF NOT EXISTS tom_de_voz text,
ADD COLUMN IF NOT EXISTS palavras_evitar text,
ADD COLUMN IF NOT EXISTS palavras_usar text,
ADD COLUMN IF NOT EXISTS restricoes_comunicacao text,
ADD COLUMN IF NOT EXISTS observacoes_estrategicas text,
ADD COLUMN IF NOT EXISTS status_cliente text;
