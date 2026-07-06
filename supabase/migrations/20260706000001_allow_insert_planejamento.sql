-- Migration: Permite que usuários autenticados (operadores) insiram pautas diretamente via OS
-- Data: 2026-07-06

-- Dar permissão de INSERT para authenticated (operadores do OS)
GRANT INSERT ON public."PLANEJAMENTO_CONTEUDO" TO authenticated;

-- Política de INSERT: só quem está logado pode criar
CREATE POLICY "Permitir insert para operadores autenticados"
ON public."PLANEJAMENTO_CONTEUDO"
FOR INSERT
TO authenticated
WITH CHECK (true);
