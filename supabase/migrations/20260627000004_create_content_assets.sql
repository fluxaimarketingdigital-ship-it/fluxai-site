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

-- Política de leitura
CREATE POLICY "content_assets_select_policy" ON public.content_assets
FOR SELECT
USING (
  public.current_user_role(auth.uid()) = 'ADMIN' 
  OR 
  (public.current_user_role(auth.uid()) = 'CLIENT' AND project_id = public.current_user_client_id(auth.uid()))
);

-- Política de Inserção (ADMIN e OPERATOR podem inserir)
CREATE POLICY "content_assets_insert_policy" ON public.content_assets
FOR INSERT
WITH CHECK (
  public.current_user_role(auth.uid()) IN ('ADMIN', 'OPERATOR')
);

-- Política de Atualização
CREATE POLICY "content_assets_update_policy" ON public.content_assets
FOR UPDATE
USING (
  public.current_user_role(auth.uid()) IN ('ADMIN', 'OPERATOR')
  OR 
  (public.current_user_role(auth.uid()) = 'CLIENT' AND project_id = public.current_user_client_id(auth.uid()))
);

-- Política de Deleção
CREATE POLICY "content_assets_delete_policy" ON public.content_assets
FOR DELETE
USING (
  public.current_user_role(auth.uid()) = 'ADMIN'
);
