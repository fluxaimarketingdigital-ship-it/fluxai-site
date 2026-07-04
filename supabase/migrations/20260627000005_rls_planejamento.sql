-- Migration SQL para habilitar leitura da Tabela PLANEJAMENTO_CONTEUDO (Motor de Conteúdo)
-- Data: 2026-06-27

-- 1. Devolver a permissão de leitura para usuários logados
GRANT SELECT ON public."PLANEJAMENTO_CONTEUDO" TO authenticated;

-- 2. Criar a política de segurança liberando visualização
CREATE POLICY "Permitir leitura para Cockpit" 
ON public."PLANEJAMENTO_CONTEUDO" 
FOR SELECT 
TO authenticated 
USING (true);
