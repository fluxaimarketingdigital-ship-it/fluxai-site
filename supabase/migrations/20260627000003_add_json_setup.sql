-- Migration SQL: Add JSONB column for complete onboarding setup
-- Data: 2026-06-27 (or 2026-07-03)

-- Adiciona a coluna setup_completo na tabela CLIENTES_ESTRATEGIA
ALTER TABLE public."CLIENTES_ESTRATEGIA" 
ADD COLUMN IF NOT EXISTS setup_completo JSONB DEFAULT '{}'::jsonb;

-- Comentário para documentação
COMMENT ON COLUMN public."CLIENTES_ESTRATEGIA".setup_completo IS 'Armazena o payload completo do formulário de Onboarding (todas as 7 etapas) para auto-preenchimento no modo Edição.';
