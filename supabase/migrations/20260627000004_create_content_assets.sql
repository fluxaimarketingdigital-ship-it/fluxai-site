-- MIGRATION: 20260627000004_create_content_assets.sql

CREATE TABLE IF NOT EXISTS public.content_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id TEXT NOT NULL,
    title TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PLANEJAMENTO',
    priority TEXT,
    platform TEXT,
    scheduled_at TIMESTAMP WITH TIME ZONE,
    caption TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    internal_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.content_assets ENABLE ROW LEVEL SECURITY;

-- Limpar políticas antigas se existirem
DROP POLICY IF EXISTS "content_assets_select_policy" ON public.content_assets;
DROP POLICY IF EXISTS "content_assets_insert_policy" ON public.content_assets;
DROP POLICY IF EXISTS "content_assets_update_policy" ON public.content_assets;
DROP POLICY IF EXISTS "content_assets_delete_policy" ON public.content_assets;

-- Política de leitura
CREATE POLICY "content_assets_select_policy" ON public.content_assets
FOR SELECT
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'ADMIN' 
  OR 
  ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'CLIENT' AND project_id = (SELECT client_id FROM public.profiles WHERE id = auth.uid()))
);

-- Política de Inserção (ADMIN e OPERATOR podem inserir)
CREATE POLICY "content_assets_insert_policy" ON public.content_assets
FOR INSERT
WITH CHECK (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('ADMIN', 'OPERATOR')
);

-- Política de Atualização
CREATE POLICY "content_assets_update_policy" ON public.content_assets
FOR UPDATE
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('ADMIN', 'OPERATOR')
  OR 
  ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'CLIENT' AND project_id = (SELECT client_id FROM public.profiles WHERE id = auth.uid()))
);

-- Política de Deleção
CREATE POLICY "content_assets_delete_policy" ON public.content_assets
FOR DELETE
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'ADMIN'
);
