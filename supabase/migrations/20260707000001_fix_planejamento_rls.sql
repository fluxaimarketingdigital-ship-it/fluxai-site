-- Migration SQL para ajustar RLS da Tabela PLANEJAMENTO_CONTEUDO
-- Data: 2026-07-07

-- Conceder acesso ao frontend (anon / authenticated) para operações na esteira
GRANT SELECT, INSERT, UPDATE, DELETE ON public."PLANEJAMENTO_CONTEUDO" TO anon, authenticated;

-- Criar políticas RLS para permitir acesso total ao frontend (ajustar conforme regras de negócios caso precise restringir depois)
DROP POLICY IF EXISTS "Permitir acesso total anonimo" ON public."PLANEJAMENTO_CONTEUDO";
CREATE POLICY "Permitir acesso total anonimo" ON public."PLANEJAMENTO_CONTEUDO"
    FOR ALL
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);
